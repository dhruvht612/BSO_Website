import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, logActivity } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "bso-portal-api" });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'member', 'active')")
    .run(name.trim(), email.toLowerCase().trim(), hash);

  const user = db.prepare("SELECT id, name, email, role, status FROM users WHERE id = ?").get(result.lastInsertRowid);
  logActivity("Member registered", user.email);
  res.status(201).json({ token: createToken(user), user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (user.status !== "active") {
    return res.status(403).json({ message: "Account is inactive. Contact administrator." });
  }
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
  logActivity("User login", user.email);
  res.json({ token: createToken(payload), user: payload });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT id, name, email, role, status FROM users WHERE id = ?").get(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

app.get("/api/public/events", (_req, res) => {
  const events = db.prepare("SELECT * FROM events ORDER BY datetime ASC").all();
  res.json(events);
});

app.get("/api/public/announcements", (_req, res) => {
  const rows = db.prepare("SELECT id, title, body, created_at FROM announcements ORDER BY created_at DESC").all();
  res.json(rows);
});

app.post("/api/public/inquiries", (req, res) => {
  const { name, email, subject = "", message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "Missing required fields" });
  db.prepare("INSERT INTO inquiries (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'new')").run(
    name,
    email,
    subject,
    message
  );
  logActivity("New inquiry submitted", email);
  res.status(201).json({ ok: true });
});

app.get("/api/admin/stats", requireAuth, requireRole("admin"), (req, res) => {
  const totalMembers = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'member'").get().count;
  const upcomingEvents = db.prepare("SELECT COUNT(*) AS count FROM events WHERE datetime >= datetime('now')").get().count;
  const subscribers = db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count;
  const galleryItems = db.prepare("SELECT COUNT(*) AS count FROM gallery_images").get().count;
  const announcements = db.prepare("SELECT COUNT(*) AS count FROM announcements").get().count;
  const pendingInquiries = db
    .prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status IN ('new', 'in_progress')")
    .get().count;
  const recentActivity = db
    .prepare("SELECT id, action, actor_email, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 8")
    .all();
  const upcomingPreview = db
    .prepare("SELECT id, title, datetime, location, category FROM events WHERE datetime >= datetime('now') ORDER BY datetime ASC LIMIT 5")
    .all();
  res.json({
    totalMembers,
    upcomingEvents,
    subscribers,
    galleryItems,
    announcements,
    pendingInquiries,
    recentActivity,
    upcomingPreview,
  });
});

app.get("/api/admin/events", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(
    db
      .prepare(
        `SELECT e.*,
                COUNT(r.id) AS attendees_count
         FROM events e
         LEFT JOIN event_registrations r ON r.event_id = e.id
         GROUP BY e.id
         ORDER BY e.datetime ASC`
      )
      .all()
  );
});
app.post("/api/admin/events", requireAuth, requireRole("admin"), (req, res) => {
  const { title, description, datetime, location, image = "", category = "Community", rsvp_limit = 100, is_published = true } = req.body;
  const result = db
    .prepare(
      "INSERT INTO events (title, description, datetime, location, image, category, rsvp_limit, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(title, description, datetime, location, image, category, rsvp_limit, is_published ? 1 : 0);
  logActivity(`Created event: ${title}`, req.user.email);
  res.status(201).json(db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid));
});
app.put("/api/admin/events/:id", requireAuth, requireRole("admin"), (req, res) => {
  const { title, description, datetime, location, image = "", category = "Community", rsvp_limit = 100, is_published = true } = req.body;
  db.prepare(
    "UPDATE events SET title = ?, description = ?, datetime = ?, location = ?, image = ?, category = ?, rsvp_limit = ?, is_published = ? WHERE id = ?"
  ).run(title, description, datetime, location, image, category, rsvp_limit, is_published ? 1 : 0, req.params.id);
  logActivity(`Updated event #${req.params.id}`, req.user.email);
  res.json(db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id));
});
app.delete("/api/admin/events/:id", requireAuth, requireRole("admin"), (req, res) => {
  db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  logActivity(`Deleted event #${req.params.id}`, req.user.email);
  res.json({ ok: true });
});

app.get("/api/admin/members", requireAuth, requireRole("admin"), (_req, res) => {
  const rows = db
    .prepare("SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC")
    .all();
  res.json(rows);
});
app.patch("/api/admin/members/:id/status", requireAuth, requireRole("admin"), (req, res) => {
  const status = req.body.status === "inactive" ? "inactive" : "active";
  db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, req.params.id);
  logActivity(`Updated member #${req.params.id} status to ${status}`, req.user.email);
  res.json(db.prepare("SELECT id, name, email, phone, role, status FROM users WHERE id = ?").get(req.params.id));
});
app.patch("/api/admin/members/:id/role", requireAuth, requireRole("admin"), (req, res) => {
  const role = req.body.role === "admin" ? "admin" : "member";
  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
  logActivity(`Updated member #${req.params.id} role to ${role}`, req.user.email);
  res.json(db.prepare("SELECT id, name, email, phone, role, status FROM users WHERE id = ?").get(req.params.id));
});
app.post("/api/admin/members/:id/resend", requireAuth, requireRole("admin"), (req, res) => {
  logActivity(`Resent membership email to #${req.params.id}`, req.user.email);
  res.json({ ok: true });
});

app.get("/api/admin/gallery", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM gallery_images ORDER BY created_at DESC").all());
});
app.post("/api/admin/gallery", requireAuth, requireRole("admin"), (req, res) => {
  const { image_url, title = "", caption = "", album = "Community", related_event = "", is_featured = false } = req.body;
  const result = db
    .prepare(
      "INSERT INTO gallery_images (image_url, title, caption, album, related_event, is_featured) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(image_url, title, caption, album, related_event, is_featured ? 1 : 0);
  logActivity("Added gallery image", req.user.email);
  res.status(201).json(db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(result.lastInsertRowid));
});
app.put("/api/admin/gallery/:id", requireAuth, requireRole("admin"), (req, res) => {
  const { title = "", caption = "", album = "Community", related_event = "", is_featured = false } = req.body;
  db.prepare(
    "UPDATE gallery_images SET title = ?, caption = ?, album = ?, related_event = ?, is_featured = ? WHERE id = ?"
  ).run(title, caption, album, related_event, is_featured ? 1 : 0, req.params.id);
  logActivity(`Updated gallery image #${req.params.id}`, req.user.email);
  res.json(db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(req.params.id));
});
app.delete("/api/admin/gallery/:id", requireAuth, requireRole("admin"), (req, res) => {
  db.prepare("DELETE FROM gallery_images WHERE id = ?").run(req.params.id);
  logActivity(`Deleted gallery image #${req.params.id}`, req.user.email);
  res.json({ ok: true });
});

app.get("/api/admin/announcements", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all());
});
app.post("/api/admin/announcements", requireAuth, requireRole("admin"), (req, res) => {
  const { title, body, status = "published", audience = "members" } = req.body;
  const result = db
    .prepare("INSERT INTO announcements (title, body, status, audience, published_at, created_by) VALUES (?, ?, ?, ?, ?, ?)")
    .run(title, body, status, audience, status === "published" ? new Date().toISOString() : null, req.user.sub);
  logActivity(`Announcement posted: ${title}`, req.user.email);
  res.status(201).json(db.prepare("SELECT * FROM announcements WHERE id = ?").get(result.lastInsertRowid));
});
app.put("/api/admin/announcements/:id", requireAuth, requireRole("admin"), (req, res) => {
  const { title, body, status = "published", audience = "members" } = req.body;
  db.prepare(
    "UPDATE announcements SET title = ?, body = ?, status = ?, audience = ?, published_at = ? WHERE id = ?"
  ).run(title, body, status, audience, status === "published" ? new Date().toISOString() : null, req.params.id);
  logActivity(`Updated announcement #${req.params.id}`, req.user.email);
  res.json(db.prepare("SELECT * FROM announcements WHERE id = ?").get(req.params.id));
});
app.delete("/api/admin/announcements/:id", requireAuth, requireRole("admin"), (req, res) => {
  db.prepare("DELETE FROM announcements WHERE id = ?").run(req.params.id);
  logActivity(`Deleted announcement #${req.params.id}`, req.user.email);
  res.json({ ok: true });
});

app.get("/api/admin/inquiries", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all());
});
app.patch("/api/admin/inquiries/:id/status", requireAuth, requireRole("admin"), (req, res) => {
  const allowed = ["new", "in_progress", "resolved", "archived"];
  const status = allowed.includes(req.body.status) ? req.body.status : "new";
  db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, req.params.id);
  logActivity(`Inquiry #${req.params.id} marked ${status}`, req.user.email);
  res.json(db.prepare("SELECT * FROM inquiries WHERE id = ?").get(req.params.id));
});

app.get("/api/admin/settings", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM org_settings WHERE id = 1").get());
});
app.put("/api/admin/settings", requireAuth, requireRole("admin"), (req, res) => {
  const { organization_name, contact_email, contact_phone } = req.body;
  db.prepare(
    "UPDATE org_settings SET organization_name = ?, contact_email = ?, contact_phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1"
  ).run(organization_name, contact_email, contact_phone);
  logActivity("Organization settings updated", req.user.email);
  res.json(db.prepare("SELECT * FROM org_settings WHERE id = 1").get());
});
app.get("/api/admin/subscribers", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC").all());
});
app.get("/api/admin/audit", requireAuth, requireRole("admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100").all());
});

app.get("/api/member/profile", requireAuth, requireRole("member", "admin"), (req, res) => {
  const user = db.prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?").get(req.user.sub);
  res.json(user);
});
app.put("/api/member/profile", requireAuth, requireRole("member", "admin"), (req, res) => {
  const { name } = req.body;
  db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, req.user.sub);
  logActivity("Profile updated", req.user.email);
  res.json(db.prepare("SELECT id, name, email, role, status FROM users WHERE id = ?").get(req.user.sub));
});
app.get("/api/member/events", requireAuth, requireRole("member", "admin"), (_req, res) => {
  res.json(db.prepare("SELECT * FROM events ORDER BY datetime ASC").all());
});
app.post("/api/member/events/:id/register", requireAuth, requireRole("member", "admin"), (req, res) => {
  db.prepare("INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (?, ?)").run(
    req.params.id,
    req.user.sub
  );
  logActivity(`Registered for event #${req.params.id}`, req.user.email);
  res.json({ ok: true });
});
app.get("/api/member/membership", requireAuth, requireRole("member", "admin"), (req, res) => {
  const details = db.prepare("SELECT status, created_at FROM users WHERE id = ?").get(req.user.sub);
  res.json({
    plan: "Community Member",
    renewalDate: "2027-01-01",
    status: details?.status ?? "active",
    joinedAt: details?.created_at ?? null,
  });
});
app.get("/api/member/announcements", requireAuth, requireRole("member", "admin"), (_req, res) => {
  res.json(db.prepare("SELECT id, title, body, created_at FROM announcements ORDER BY created_at DESC").all());
});
app.get("/api/member/volunteer", requireAuth, requireRole("member", "admin"), (_req, res) => {
  res.json([
    { id: 1, title: "Event Coordination Team", commitment: "4-6 hrs/month" },
    { id: 2, title: "Youth Mentorship Circle", commitment: "2 hrs/week" },
    { id: 3, title: "Community Outreach Drives", commitment: "Flexible weekends" },
  ]);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`BSO portal API running on http://localhost:${PORT}`);
});
