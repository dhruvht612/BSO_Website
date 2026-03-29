import { Outlet } from "react-router-dom";
import { PortalShell } from "@/components/portal/PortalShell";

const memberLinks = [
  { to: "/dashboard", label: "Profile", icon: "👤", end: true },
  { to: "/dashboard/events", label: "Events", icon: "📅" },
  { to: "/dashboard/membership", label: "Membership", icon: "🪪" },
  { to: "/dashboard/announcements", label: "Announcements", icon: "📣" },
  { to: "/dashboard/volunteer", label: "Volunteer", icon: "🤝" },
];

export function MemberLayout() {
  return (
    <PortalShell title="Member Portal" links={memberLinks}>
      <Outlet />
    </PortalShell>
  );
}
