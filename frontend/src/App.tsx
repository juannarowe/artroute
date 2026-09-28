import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Login } from "./pages/Login"
import { Events } from "./pages/Events"
import { EventDetail } from "./pages/EventDetail"
import { MapPage } from "./pages/Map"
import { Calendar } from "./pages/Calendar"
import { Profile } from "./pages/Profile"
import { MyEvents } from "./pages/MyEvents"
import { CreateEvent } from "./pages/CreateEvent"
import { ManageEvents } from "./pages/ManageEvents"
import { NotFound } from "./pages/NotFound"

export default function App() {

  return (
    <Routes>
      {/* Outside the Layout: no header, no bottom nav */}
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />

        {/* Public: anyone can explore events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/map" element={<MapPage />} />

        {/* Logged-in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/events/new" element={<CreateEvent />} />
          {/* Admin-only check comes with the user role card */}
          <Route path="/manage-events" element={<ManageEvents />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
