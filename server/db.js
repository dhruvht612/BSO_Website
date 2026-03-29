import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const dataDir = path.resolve("server/data");
const dbPath = path.resolve(dataDir, "bso.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function hasColumn(table, column) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  return columns.some((entry) => entry.name === column);
}

function ensureColumn(table, column, definition) {
  if (!hasColumn(table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function ensureSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'member')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      phone TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      datetime TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT DEFAULT '',
      category TEXT DEFAULT 'Community',
      rsvp_limit INTEGER DEFAULT 100,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      audience TEXT NOT NULL DEFAULT 'members',
      published_at TEXT,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT DEFAULT '',
      caption TEXT DEFAULT '',
      album TEXT DEFAULT 'Community',
      related_event TEXT DEFAULT '',
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES events(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(event_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS org_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      organization_name TEXT NOT NULL DEFAULT 'Brahmin Samaj of Ontario',
      contact_email TEXT NOT NULL DEFAULT 'hello@bsoontario.org',
      contact_phone TEXT NOT NULL DEFAULT '+1 (416) 555-1234',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor_email TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  ensureColumn("users", "phone", "TEXT DEFAULT ''");
  ensureColumn("events", "rsvp_limit", "INTEGER DEFAULT 100");
  ensureColumn("events", "is_published", "INTEGER NOT NULL DEFAULT 1");
  ensureColumn("announcements", "status", "TEXT NOT NULL DEFAULT 'published'");
  ensureColumn("announcements", "audience", "TEXT NOT NULL DEFAULT 'members'");
  ensureColumn("announcements", "published_at", "TEXT");
  ensureColumn("gallery_images", "title", "TEXT DEFAULT ''");
  ensureColumn("gallery_images", "album", "TEXT DEFAULT 'Community'");
  ensureColumn("gallery_images", "related_event", "TEXT DEFAULT ''");
  ensureColumn("gallery_images", "is_featured", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn("inquiries", "subject", "TEXT DEFAULT ''");
  ensureColumn("inquiries", "status", "TEXT NOT NULL DEFAULT 'new'");
}

function seedData() {
  const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (!adminExists) {
    const adminHash = bcrypt.hashSync("admin123", 10);
    const memberHash = bcrypt.hashSync("member123", 10);
    db.prepare(
      "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'admin', 'active')"
    ).run("BSO Admin", "admin@bsoontario.org", adminHash);
    db.prepare(
      "INSERT INTO users (name, email, password_hash, role, status, phone) VALUES (?, ?, ?, 'member', 'active', ?)"
    ).run("Demo Member", "member@bsoontario.org", memberHash, "+1 (647) 555-0117");
  }

  const settingsExists = db.prepare("SELECT id FROM org_settings WHERE id = 1").get();
  if (!settingsExists) {
    db.prepare(
      "INSERT INTO org_settings (id, organization_name, contact_email, contact_phone) VALUES (1, ?, ?, ?)"
    ).run("Brahmin Samaj of Ontario", "hello@bsoontario.org", "+1 (416) 555-1234");
  }

  const eventsCount = db.prepare("SELECT COUNT(*) AS count FROM events").get().count;
  if (eventsCount === 0) {
    const insertEvent = db.prepare(
      "INSERT INTO events (title, description, datetime, location, image, category, rsvp_limit, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    insertEvent.run(
      "Spring Cultural Evening",
      "A community evening with music, heritage talks, and family fellowship.",
      "2026-04-18T18:00:00",
      "Toronto",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb19f?w=800&q=80",
      "Cultural",
      160,
      1
    );
    insertEvent.run(
      "Youth Leadership Workshop",
      "Mentorship and project leadership session for students and young professionals.",
      "2026-05-09T11:00:00",
      "Mississauga",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
      "Youth",
      80,
      1
    );
    insertEvent.run(
      "Volunteer Drive Planning Session",
      "Internal planning session for outreach captains.",
      "2026-05-01T19:00:00",
      "Online",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
      "Community",
      35,
      0
    );
  }

  const announcementsCount = db.prepare("SELECT COUNT(*) AS count FROM announcements").get().count;
  if (announcementsCount === 0) {
    db.prepare("INSERT INTO announcements (title, body, status, audience, published_at) VALUES (?, ?, 'published', 'all', CURRENT_TIMESTAMP)").run(
      "Welcome to the New BSO Portal",
      "Members can now view events, announcements, and profile details in one place."
    );
  }

  const galleryCount = db.prepare("SELECT COUNT(*) AS count FROM gallery_images").get().count;
  if (galleryCount === 0) {
    db.prepare(
      "INSERT INTO gallery_images (image_url, title, caption, album, related_event, is_featured) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
      "Youth Workshop Moments",
      "Interactive leadership exercises and teamwork.",
      "Youth Programs",
      "Youth Leadership Workshop",
      1
    );
  }

  const subscriberCount = db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count;
  if (subscriberCount === 0) {
    db.prepare("INSERT INTO newsletter_subscribers (email) VALUES (?), (?), (?)").run(
      "community.member1@example.com",
      "family.updates@example.com",
      "events.digest@example.com"
    );
  }
}

export function logActivity(action, actorEmail = null) {
  db.prepare("INSERT INTO activity_logs (action, actor_email) VALUES (?, ?)").run(action, actorEmail);
}

ensureSchema();
seedData();
