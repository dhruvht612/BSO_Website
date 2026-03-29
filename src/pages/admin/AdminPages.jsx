import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Primitives";
import { StatCard } from "@/components/portal/PortalShell";
import { api } from "@/lib/api";
import {
  EmptyState,
  Modal,
  PageHeader,
  SearchInput,
  SectionCard,
  SelectInput,
  StatusPill,
  Toolbar,
} from "@/components/admin/AdminUI";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function panelClassName() {
  return "rounded-2xl border border-white/10 bg-[#111a2b] p-5 shadow-card";
}

export function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get("/api/admin/stats", { auth: true }).then(setStats).catch(() => null);
  }, []);

  const cards = [
    { label: "Total Members", value: stats?.totalMembers ?? "-" },
    { label: "Upcoming Events", value: stats?.upcomingEvents ?? "-" },
    { label: "Gallery Items", value: stats?.galleryItems ?? "-" },
    { label: "Announcements", value: stats?.announcements ?? "-" },
    { label: "Subscribers", value: stats?.subscribers ?? "-" },
    { label: "Pending Inquiries", value: stats?.pendingInquiries ?? "-" },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time operational snapshot for Brahmin Samaj of Ontario."
        actions={
          <>
            <Button to="/admin/events">Add Event</Button>
            <Button to="/admin/announcements" variant="secondary">Post Announcement</Button>
            <Button to="/admin/gallery" variant="secondary">Upload Image</Button>
            <Button to="/admin/inquiries" variant="ghost">View Inquiries</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <SectionCard title="Recent Activity" subtitle="Latest admin actions and system events">
          <div className="space-y-2">
            {(stats?.recentActivity ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-surface-muted/70 px-3 py-2 text-sm text-ink">
                <span>{item.action}</span>
                <span className="text-xs text-ink-muted">{formatDate(item.created_at)}</span>
              </div>
            ))}
            {!stats?.recentActivity?.length && <EmptyState title="No activity yet" subtitle="Recent changes and actions will appear here." />}
          </div>
        </SectionCard>
        <SectionCard title="Upcoming Events Preview" subtitle="Near-term schedule for quick review">
          <div className="space-y-3">
            {(stats?.upcomingPreview ?? []).map((event) => (
              <div key={event.id} className={panelClassName()}>
                <p className="text-xs text-accent">{formatDate(event.datetime)}</p>
                <h4 className="mt-1 font-display text-lg text-white">{event.title}</h4>
                <p className="text-sm text-slate-300">{event.location}</p>
                <p className="mt-1 text-xs text-slate-400">{event.category}</p>
              </div>
            ))}
            {!stats?.upcomingPreview?.length && <EmptyState title="No upcoming events" subtitle="Create events to populate this widget." />}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Member Growth" subtitle="Placeholder analytics panel for trend chart">
          <div className="h-40 rounded-2xl border border-dashed border-border-subtle/70 bg-surface-muted/50" />
        </SectionCard>
        <SectionCard title="Event Participation" subtitle="Placeholder analytics panel for RSVP/attendance chart">
          <div className="h-40 rounded-2xl border border-dashed border-border-subtle/70 bg-surface-muted/50" />
        </SectionCard>
      </div>
    </section>
  );
}

export function AdminEventsPage() {
  const blank = {
    title: "",
    description: "",
    datetime: "",
    location: "",
    image: "",
    category: "Community",
    rsvp_limit: 100,
    is_published: true,
  };
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => api.get("/api/admin/events", { auth: true }).then(setEvents);
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const text = `${event.title} ${event.location} ${event.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = category === "all" || event.category === category;
      const isPast = new Date(event.datetime) < new Date();
      const computedStatus = event.is_published ? (isPast ? "past" : "upcoming") : "draft";
      const matchesStatus = status === "all" || computedStatus === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, category, status]);

  async function submitForm(event) {
    event.preventDefault();
    if (editingId) await api.put(`/api/admin/events/${editingId}`, form, { auth: true });
    else await api.post("/api/admin/events", form, { auth: true });
    setModalOpen(false);
    setEditingId(null);
    setForm(blank);
    load();
  }

  return (
    <section className="space-y-5">
      <PageHeader title="Events Management" subtitle="Create, publish, and manage community events." />
      <Toolbar>
        <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or location" />
        <SelectInput
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          options={[
            { value: "all", label: "All categories" },
            ...["Community", "Cultural", "Youth", "Seniors"].map((entry) => ({ value: entry, label: entry })),
          ]}
        />
        <SelectInput
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
            { value: "draft", label: "Draft" },
          ]}
        />
        <Button
          onClick={() => {
            setEditingId(null);
            setForm(blank);
            setModalOpen(true);
          }}
        >
          Add New Event
        </Button>
      </Toolbar>

      <SectionCard title="Event Registry" subtitle={`${filtered.length} event entries`}>
        {!filtered.length ? (
          <EmptyState title="No events found" subtitle="Try adjusting filters or create a new event." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Attendees</th>
                  <th className="px-3 py-2">RSVP Limit</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => {
                  const isPast = new Date(event.datetime) < new Date();
                  const eventStatus = event.is_published ? (isPast ? "past" : "upcoming") : "draft";
                  return (
                    <tr key={event.id} className="border-t border-white/10 text-slate-200 hover:bg-white/5">
                      <td className="px-3 py-3">{event.title}</td>
                      <td className="px-3 py-3">{formatDate(event.datetime)}</td>
                      <td className="px-3 py-3">{event.location}</td>
                      <td className="px-3 py-3">{event.category}</td>
                      <td className="px-3 py-3">
                        <StatusPill value={eventStatus} />
                      </td>
                      <td className="px-3 py-3">{event.attendees_count ?? 0}</td>
                      <td className="px-3 py-3">{event.rsvp_limit ?? "-"}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditingId(event.id);
                              setForm({
                                title: event.title,
                                description: event.description,
                                datetime: event.datetime,
                                location: event.location,
                                image: event.image || "",
                                category: event.category || "Community",
                                rsvp_limit: event.rsvp_limit || 100,
                                is_published: Boolean(event.is_published),
                              });
                              setModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button variant="ghost" onClick={() => setDeletingId(event.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Event" : "Create Event"}>
        <form onSubmit={submitForm} className="grid gap-3 md:grid-cols-2">
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" type="datetime-local" value={form.datetime} onChange={(e) => setForm((prev) => ({ ...prev, datetime: e.target.value }))} required />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} required />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent md:col-span-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
          <textarea className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" type="number" min="1" placeholder="RSVP Limit" value={form.rsvp_limit} onChange={(e) => setForm((prev) => ({ ...prev, rsvp_limit: Number(e.target.value) }))} />
          <label className="flex items-center gap-2 rounded-xl border border-border-subtle px-3 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))} />
            Publish Event
          </label>
          <div className="md:col-span-2">
            <Button type="submit">{editingId ? "Update Event" : "Create Event"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Confirm Delete">
        <p className="text-sm text-ink-muted">This action cannot be undone. Delete this event?</p>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={async () => {
              await api.delete(`/api/admin/events/${deletingId}`, { auth: true });
              setDeletingId(null);
              load();
            }}
          >
            Confirm Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
}

export function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [detailMessage, setDetailMessage] = useState("");
  const [detailBusy, setDetailBusy] = useState(false);
  const load = () => api.get("/api/admin/members", { auth: true }).then(setMembers);
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const hit = `${member.name} ${member.email} ${member.phone} ${member.role}`.toLowerCase().includes(query.toLowerCase());
      const statusMatch = statusFilter === "all" || member.status === statusFilter;
      return hit && statusMatch;
    });
  }, [members, query, statusFilter]);

  const memberOnly = members.filter((entry) => entry.role === "member");
  const activeMembers = memberOnly.filter((entry) => entry.status === "active").length;
  const pendingApprovals = memberOnly.filter((entry) => entry.status === "inactive").length;
  const renewalDue = Math.max(1, Math.floor(memberOnly.length / 3));

  return (
    <section className="space-y-5">
      <PageHeader title="Members Management" subtitle="Search, update statuses, and manage member roles." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Members" value={activeMembers} />
        <StatCard label="Pending Approvals" value={pendingApprovals} />
        <StatCard label="Renewals Due" value={renewalDue} />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone" />
        <SelectInput
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </Toolbar>

      <SectionCard title="Members Directory" subtitle={`${filtered.length} members shown`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Profile</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Join Date</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="border-t border-white/10 text-slate-200 hover:bg-white/5">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/20 font-semibold text-accent">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p>{member.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{member.email}</td>
                  <td className="px-3 py-3">{member.phone || "—"}</td>
                  <td className="px-3 py-3"><StatusPill value={member.status} /></td>
                  <td className="px-3 py-3">{new Date(member.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3 capitalize">{member.role}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setDetail(member)}>Details</Button>
                      <Button variant="ghost" onClick={async () => {
                        const next = member.status === "active" ? "inactive" : "active";
                        await api.patch(`/api/admin/members/${member.id}/status`, { status: next }, { auth: true });
                        load();
                      }}>{member.status === "active" ? "Mark inactive" : "Approve"}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <EmptyState title="No members found" subtitle="Try different filters." />}
      </SectionCard>

      <Modal
        open={Boolean(detail)}
        onClose={() => {
          setDetail(null);
          setDetailMessage("");
          setDetailBusy(false);
        }}
        title="Member Detail"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <p><strong>Name:</strong> {detail.name}</p>
            <p><strong>Email:</strong> {detail.email}</p>
            <p><strong>Phone:</strong> {detail.phone || "—"}</p>
            <p><strong>Status:</strong> <StatusPill value={detail.status} /></p>
            {detailMessage ? <p className="text-xs text-emerald-400">{detailMessage}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={detailBusy}
                onClick={async () => {
                  try {
                    setDetailBusy(true);
                    setDetailMessage("");
                    const nextRole = detail.role === "admin" ? "member" : "admin";
                    const updated = await api.patch(`/api/admin/members/${detail.id}/role`, { role: nextRole }, { auth: true });
                    setDetail((prev) => (prev ? { ...prev, role: updated.role } : prev));
                    setDetailMessage(`Role updated to ${updated.role}.`);
                    await load();
                  } finally {
                    setDetailBusy(false);
                  }
                }}
              >
                Toggle Role
              </Button>
              <Button
                variant="secondary"
                disabled={detailBusy}
                onClick={async () => {
                  try {
                    setDetailBusy(true);
                    setDetailMessage("");
                    await api.post(`/api/admin/members/${detail.id}/resend`, {}, { auth: true });
                    setDetailMessage("Membership email queued successfully.");
                  } finally {
                    setDetailBusy(false);
                  }
                }}
              >
                Resend Membership Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [albumFilter, setAlbumFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({
    image_url: "",
    title: "",
    caption: "",
    album: "Community",
    related_event: "",
    is_featured: false,
  });
  const load = () => api.get("/api/admin/gallery", { auth: true }).then(setItems);
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => albumFilter === "all" || item.album === albumFilter),
    [items, albumFilter]
  );

  return (
    <section className="space-y-5">
      <PageHeader title="Gallery Management" subtitle="Manage event albums, featured visuals, and media library." />
      <SectionCard title="Upload Area" subtitle="Drag-and-drop placeholder with URL-based upload">
        <div className="rounded-2xl border border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm text-ink-muted">Drop images here or use upload form.</p>
          <Button className="mt-4" onClick={() => setUploadOpen(true)}>Upload Image</Button>
        </div>
      </SectionCard>
      <Toolbar>
        <SelectInput
          value={albumFilter}
          onChange={(event) => setAlbumFilter(event.target.value)}
          options={[
            { value: "all", label: "All albums" },
            ...Array.from(new Set(items.map((entry) => entry.album || "Community"))).map((entry) => ({
              value: entry,
              label: entry,
            })),
          ]}
        />
      </Toolbar>

      {!filtered.length ? (
        <EmptyState title="No gallery items" subtitle="Upload visuals to populate the gallery grid." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111a2b] p-3">
              <img src={item.image_url} alt={item.title || "Gallery image"} className="h-52 w-full rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]" />
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg text-white">{item.title || "Untitled image"}</h4>
                  {item.is_featured ? <StatusPill value="featured" /> : null}
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.album} • {formatDate(item.created_at)}</p>
                <p className="mt-1 text-sm text-slate-300">{item.related_event || "No related event"}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={async () => {
                  await api.put(`/api/admin/gallery/${item.id}`, { ...item, is_featured: !item.is_featured }, { auth: true });
                  load();
                }}>{item.is_featured ? "Unfeature" : "Feature"}</Button>
                <Button variant="ghost" onClick={async () => {
                  await api.delete(`/api/admin/gallery/${item.id}`, { auth: true });
                  load();
                }}>Delete</Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Gallery Image">
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await api.post("/api/admin/gallery", form, { auth: true });
            setUploadOpen(false);
            setForm({ image_url: "", title: "", caption: "", album: "Community", related_event: "", is_featured: false });
            load();
          }}
        >
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent md:col-span-2" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} required />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Album" value={form.album} onChange={(e) => setForm((p) => ({ ...p, album: e.target.value }))} />
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent md:col-span-2" placeholder="Related Event" value={form.related_event} onChange={(e) => setForm((p) => ({ ...p, related_event: e.target.value }))} />
          <textarea className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent md:col-span-2" rows={3} placeholder="Caption" value={form.caption} onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))} />
          <label className="flex items-center gap-2 rounded-xl border border-border-subtle px-3 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} />
            Mark as featured
          </label>
          <div className="md:col-span-2"><Button type="submit">Save Image</Button></div>
        </form>
      </Modal>
    </section>
  );
}

export function AdminAnnouncementsPage() {
  const [rows, setRows] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", status: "published", audience: "all" });
  const load = () => api.get("/api/admin/announcements", { auth: true }).then(setRows);
  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Announcements"
        subtitle="Create and manage updates for members and public feed."
        actions={<Button onClick={() => { setEditing(null); setForm({ title: "", body: "", status: "published", audience: "all" }); setEditorOpen(true); }}>Create Announcement</Button>}
      />
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <SectionCard title="Announcement List" subtitle={`${rows.length} items`}>
          <div className="space-y-3">
            {rows.map((row) => (
              <article key={row.id} className={panelClassName()}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-lg text-white">{row.title}</h4>
                  <div className="flex gap-2">
                    <StatusPill value={row.status} />
                    <StatusPill value={row.audience} />
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">{formatDate(row.published_at || row.created_at)}</p>
                <p className="mt-2 text-sm text-slate-300 line-clamp-3">{row.body}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => {
                    setEditing(row);
                    setForm({ title: row.title, body: row.body, status: row.status, audience: row.audience });
                    setEditorOpen(true);
                  }}>Edit</Button>
                  {row.status === "published" ? (
                    <Button variant="ghost" onClick={async () => {
                      await api.put(`/api/admin/announcements/${row.id}`, { ...row, status: "draft" }, { auth: true });
                      load();
                    }}>Unpublish</Button>
                  ) : (
                    <Button variant="ghost" onClick={async () => {
                      await api.put(`/api/admin/announcements/${row.id}`, { ...row, status: "published" }, { auth: true });
                      load();
                    }}>Publish</Button>
                  )}
                  <Button variant="ghost" onClick={async () => { await api.delete(`/api/admin/announcements/${row.id}`, { auth: true }); load(); }}>Delete</Button>
                </div>
              </article>
            ))}
            {!rows.length && <EmptyState title="No announcements yet" subtitle="Create your first update." />}
          </div>
        </SectionCard>
        <SectionCard title="Preview Card" subtitle="How announcement appears to members">
          <div className={panelClassName()}>
            <p className="text-xs uppercase tracking-widest text-accent">Community Update</p>
            <h4 className="mt-2 font-display text-xl text-white">{form.title || "Announcement headline"}</h4>
            <p className="mt-2 text-sm text-slate-300">{form.body || "Announcement summary preview appears here."}</p>
          </div>
        </SectionCard>
      </div>

      <Modal open={editorOpen} onClose={() => setEditorOpen(false)} title={editing ? "Edit Announcement" : "Create Announcement"}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (editing) await api.put(`/api/admin/announcements/${editing.id}`, form, { auth: true });
            else await api.post("/api/admin/announcements", form, { auth: true });
            setEditorOpen(false);
            load();
          }}
        >
          <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          <textarea className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent" rows={6} placeholder="Rich text editor placeholder" value={form.body} onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))} required />
          <div className="grid gap-3 md:grid-cols-2">
            <SelectInput
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]}
            />
            <SelectInput
              value={form.audience}
              onChange={(e) => setForm((prev) => ({ ...prev, audience: e.target.value }))}
              options={[{ value: "all", label: "All users" }, { value: "members", label: "Members only" }]}
            />
          </div>
          <Button type="submit">{editing ? "Update" : "Create"} Announcement</Button>
        </form>
      </Modal>
    </section>
  );
}

export function AdminInquiriesPage() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const load = () => api.get("/api/admin/inquiries", { auth: true }).then(setRows);
  useEffect(() => {
    load();
  }, []);

  const visible = rows.filter((row) => tab === "all" || row.status === tab);

  return (
    <section className="space-y-5">
      <PageHeader title="Contact Inquiries" subtitle="Track and resolve incoming messages efficiently." />
      <Toolbar>
        {["all", "new", "in_progress", "resolved", "archived"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-xl px-3 py-2 text-sm capitalize ${tab === item ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
          >
            {item.replaceAll("_", " ")}
          </button>
        ))}
      </Toolbar>
      <SectionCard title="Inquiry Table" subtitle={`${visible.length} records`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Sender</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-white/10 text-slate-200 hover:bg-white/5">
                  <td className="px-3 py-3">{row.name}</td>
                  <td className="px-3 py-3">{row.email}</td>
                  <td className="px-3 py-3">{row.subject || "General Inquiry"}</td>
                  <td className="px-3 py-3">{formatDate(row.created_at)}</td>
                  <td className="px-3 py-3"><StatusPill value={row.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setSelected(row)}>Open</Button>
                      <Button variant="ghost" onClick={async () => { await api.patch(`/api/admin/inquiries/${row.id}/status`, { status: "resolved" }, { auth: true }); load(); }}>Mark Resolved</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Inquiry Detail">
        {selected && (
          <div className="space-y-3 text-sm">
            <p><strong>From:</strong> {selected.name} ({selected.email})</p>
            <p><strong>Subject:</strong> {selected.subject || "General inquiry"}</p>
            <p><strong>Received:</strong> {formatDate(selected.created_at)}</p>
            <p className="rounded-xl border border-border-subtle bg-surface-muted/40 p-3">{selected.message}</p>
            <div className="flex gap-2">
              <Button onClick={async () => { await api.patch(`/api/admin/inquiries/${selected.id}/status`, { status: "in_progress" }, { auth: true }); setSelected(null); load(); }}>In Progress</Button>
              <Button variant="secondary" onClick={async () => { await api.patch(`/api/admin/inquiries/${selected.id}/status`, { status: "resolved" }, { auth: true }); setSelected(null); load(); }}>Resolve</Button>
              <Button variant="ghost" onClick={async () => { await api.patch(`/api/admin/inquiries/${selected.id}/status`, { status: "archived" }, { auth: true }); setSelected(null); load(); }}>Archive</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const subject = encodeURIComponent(selected.subject || "Reply from BSO Admin");
                  const body = encodeURIComponent(
                    `Hello ${selected.name},\n\nThank you for contacting Brahmin Samaj of Ontario.\n\nBest regards,\nBSO Admin Team`
                  );
                  window.location.href = `mailto:${selected.email}?subject=${subject}&body=${body}`;
                }}
              >
                Reply via Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({ organization_name: "", contact_email: "", contact_phone: "" });
  const [savedSettings, setSavedSettings] = useState({ organization_name: "", contact_email: "", contact_phone: "" });
  const [social, setSocial] = useState({ instagram: "", youtube: "", linkedin: "" });
  const [savedSocial, setSavedSocial] = useState({ instagram: "", youtube: "", linkedin: "" });
  const [prefs, setPrefs] = useState({ darkDefault: true, emailNotifications: true, portalAlerts: true });
  const [savedPrefs, setSavedPrefs] = useState({ darkDefault: true, emailNotifications: true, portalAlerts: true });

  useEffect(() => {
    api
      .get("/api/admin/settings", { auth: true })
      .then((data) => {
        setSettings(data);
        setSavedSettings(data);
      })
      .catch(() => null);
  }, []);

  return (
    <section className="space-y-5">
      <PageHeader title="Settings" subtitle="Organization profile, branding, and portal preferences." />
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Organization Profile">
          <div className="grid gap-3">
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={settings.organization_name} onChange={(e) => setSettings((p) => ({ ...p, organization_name: e.target.value }))} placeholder="Organization name" />
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={settings.contact_email} onChange={(e) => setSettings((p) => ({ ...p, contact_email: e.target.value }))} placeholder="Contact email" />
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={settings.contact_phone} onChange={(e) => setSettings((p) => ({ ...p, contact_phone: e.target.value }))} placeholder="Contact phone" />
          </div>
        </SectionCard>
        <SectionCard title="Social Media Links">
          <div className="grid gap-3">
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={social.instagram} onChange={(e) => setSocial((p) => ({ ...p, instagram: e.target.value }))} placeholder="Instagram URL" />
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={social.youtube} onChange={(e) => setSocial((p) => ({ ...p, youtube: e.target.value }))} placeholder="YouTube URL" />
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" value={social.linkedin} onChange={(e) => setSocial((p) => ({ ...p, linkedin: e.target.value }))} placeholder="LinkedIn URL" />
          </div>
        </SectionCard>
        <SectionCard title="Homepage Content Settings">
          <div className="grid gap-3">
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Hero title override" />
            <input className="h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent" placeholder="Featured event ID" />
            <textarea className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent" rows={3} placeholder="Homepage announcement banner text" />
          </div>
        </SectionCard>
        <SectionCard title="Portal Preferences">
          <div className="space-y-3 text-sm">
            {[
              ["darkDefault", "Enable dark theme by default"],
              ["emailNotifications", "Send email notifications for new inquiries"],
              ["portalAlerts", "Enable in-app notifications for admin actions"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/40 px-3 py-2">
                <span>{label}</span>
                <input type="checkbox" checked={prefs[key]} onChange={(e) => setPrefs((prev) => ({ ...prev, [key]: e.target.checked }))} />
              </label>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className="flex gap-2">
        <Button onClick={async () => {
          const updated = await api.put("/api/admin/settings", settings, { auth: true });
          setSettings(updated);
          setSavedSettings(updated);
          setSavedSocial(social);
          setSavedPrefs(prefs);
        }}>Save Settings</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setSettings(savedSettings);
            setSocial(savedSocial);
            setPrefs(savedPrefs);
          }}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}

export function AdminSubscribersPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/api/admin/subscribers", { auth: true }).then(setRows).catch(() => null);
  }, []);
  return (
    <section className="space-y-5">
      <PageHeader title="Newsletter Subscribers" subtitle="Audience list for campaigns and announcements." />
      <SectionCard title="Subscribers" subtitle={`${rows.length} total subscribers`}>
        {!rows.length ? (
          <EmptyState title="No subscribers yet" subtitle="Subscription records appear here when users sign up." />
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                <span>{row.email}</span>
                <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}

export function AdminAuditPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/api/admin/audit", { auth: true }).then(setRows).catch(() => null);
  }, []);
  return (
    <section className="space-y-5">
      <PageHeader title="Audit Log" subtitle="Chronological record of admin and user actions." />
      <SectionCard title="Activity History" subtitle="Last 100 events">
        {!rows.length ? (
          <EmptyState title="No audit logs" subtitle="System activity will appear here." />
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                <div>
                  <p>{row.action}</p>
                  <p className="text-xs text-slate-400">{row.actor_email || "system"}</p>
                </div>
                <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
