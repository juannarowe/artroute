import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Login } from "./pages/Login"
import { Profile } from "./pages/Profile"

  function EventsPage() {
    return (
      <h2>Events Page</h2>
    )
  }

export default function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
