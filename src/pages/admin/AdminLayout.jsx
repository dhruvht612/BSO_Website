import { Outlet } from "react-router-dom";
import { PortalShell } from "@/components/portal/PortalShell";

const adminLinks = [
  { to: "/admin", label: "Overview", icon: "OV", end: true },
  { to: "/admin/events", label: "Events", icon: "EV" },
  { to: "/admin/members", label: "Members", icon: "MB" },
  { to: "/admin/gallery", label: "Gallery", icon: "GL" },
  { to: "/admin/announcements", label: "Announcements", icon: "AN" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "IN" },
  { to: "/admin/subscribers", label: "Subscribers", icon: "NS" },
  { to: "/admin/audit", label: "Audit Log", icon: "AL" },
  { to: "/admin/settings", label: "Settings", icon: "ST" },
];

export function AdminLayout() {
  return (
    <PortalShell
      title="Brahmin Samaj Admin"
      subtitle="Command center for members, events, communications, and operations"
      links={adminLinks}
    >
      <Outlet />
    </PortalShell>
  );
}
