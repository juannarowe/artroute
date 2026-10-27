import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminRoute } from "./components/AdminRoute"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Events } from "./pages/Events"
import { EventDetail } from "./pages/EventDetail"
import { MapPage } from "./pages/Map"
import { Calendar } from "./pages/Calendar"
import { Profile } from "./pages/Profile"
import { MyEvents } from "./pages/MyEvents"
import { CreateEvent } from "./pages/CreateEvent"
import { ManageEvents } from "./pages/ManageEvents"
import { NotFound } from "./pages/NotFound"
import { Stats } from "./pages/Stats"

export default function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />

        {/* Auth pages also keep the header and bottom nav, so users can go back */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public: anyone can explore events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/map" element={<MapPage />} />

        {/* Logged-in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/events/new" element={<CreateEvent />} />
        </Route>

        {/* Admins only (the backend checks the role again) */}
        <Route element={<AdminRoute />}>
          <Route path="/manage-events" element={<ManageEvents />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
