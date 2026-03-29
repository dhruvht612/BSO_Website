import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Primitives";
import { api } from "@/lib/api";

export function MemberProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/api/member/profile", { auth: true }).then((data) => {
      setProfile(data);
      setName(data.name);
    });
  }, []);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border-subtle bg-surface p-5">
        <h3 className="font-display text-xl">Profile</h3>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            const next = await api.put("/api/member/profile", { name }, { auth: true });
            setProfile((p) => ({ ...p, ...next }));
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-accent"
          />
          <Button type="submit">Save</Button>
        </form>
        {profile && (
          <div className="mt-4 text-sm text-ink-muted">
            <p>Email: {profile.email}</p>
            <p>Status: {profile.status}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function MemberEventsPage() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get("/api/member/events", { auth: true }).then(setEvents);
  }, []);
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <article key={event.id} className="rounded-2xl border border-border-subtle bg-surface p-4">
          <p className="text-xs text-accent">{new Date(event.datetime).toLocaleString()}</p>
          <h3 className="font-display text-xl">{event.title}</h3>
          <p className="mt-2 text-sm text-ink-muted">{event.description}</p>
          <Button
            className="mt-4"
            onClick={async () => {
              await api.post(`/api/member/events/${event.id}/register`, {}, { auth: true });
            }}
          >
            Register
          </Button>
        </article>
      ))}
    </section>
  );
}

export function MemberMembershipPage() {
  const [membership, setMembership] = useState(null);
  useEffect(() => {
    api.get("/api/member/membership", { auth: true }).then(setMembership);
  }, []);
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface p-5">
      <h3 className="font-display text-2xl">Membership</h3>
      <p className="mt-3 text-sm text-ink-muted">Plan: {membership?.plan ?? "-"}</p>
      <p className="text-sm text-ink-muted">Status: {membership?.status ?? "-"}</p>
      <p className="text-sm text-ink-muted">Renewal Date: {membership?.renewalDate ?? "-"}</p>
      <Button className="mt-4">Renew Membership</Button>
    </section>
  );
}

export function MemberAnnouncementsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/api/member/announcements", { auth: true }).then(setRows);
  }, []);
  return (
    <section className="space-y-3">
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-border-subtle bg-surface p-4">
          <h3 className="font-display text-xl">{row.title}</h3>
          <p className="mt-2 text-sm text-ink-muted">{row.body}</p>
        </article>
      ))}
    </section>
  );
}

export function MemberVolunteerPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/api/member/volunteer", { auth: true }).then(setRows);
  }, []);
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-border-subtle bg-surface p-4">
          <h3 className="font-display text-xl">{row.title}</h3>
          <p className="mt-2 text-sm text-ink-muted">Commitment: {row.commitment}</p>
          <Button className="mt-4" variant="secondary">
            Express Interest
          </Button>
        </article>
      ))}
    </section>
  );
}
