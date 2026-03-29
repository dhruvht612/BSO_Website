import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { HomePage } from "@/components/sections/HomePage";
import { InfiniteGridBackdrop } from "@/components/ui/the-infinite-grid";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AboutPage } from "@/pages/AboutPage";
import { EventsPage } from "@/pages/EventsPage";
import { MembershipPage } from "@/pages/MembershipPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { ContactPage } from "@/pages/ContactPage";
import { TeamPage } from "@/pages/TeamPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import {
  AdminAnnouncementsPage,
  AdminAuditPage,
  AdminEventsPage,
  AdminGalleryPage,
  AdminInquiriesPage,
  AdminMembersPage,
  AdminOverviewPage,
  AdminSettingsPage,
  AdminSubscribersPage,
} from "@/pages/admin/AdminPages";
import { MemberLayout } from "@/pages/member/MemberLayout";
import {
  MemberAnnouncementsPage,
  MemberEventsPage,
  MemberMembershipPage,
  MemberProfilePage,
  MemberVolunteerPage,
} from "@/pages/member/MemberPages";
import { Footer } from "@/components/sections/HomePage";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function PublicLayout() {
  return (
    <div className="relative isolate min-h-screen bg-transparent text-ink">
      <InfiniteGridBackdrop />
      <div className="relative z-10">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allow={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="subscribers" element={<AdminSubscribersPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allow={["member", "admin"]}>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MemberProfilePage />} />
              <Route path="events" element={<MemberEventsPage />} />
              <Route path="membership" element={<MemberMembershipPage />} />
              <Route path="announcements" element={<MemberAnnouncementsPage />} />
              <Route path="volunteer" element={<MemberVolunteerPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
