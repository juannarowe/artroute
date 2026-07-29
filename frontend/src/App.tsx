import { Routes, Route } from "react-router-dom";
import { Layout } from "./layouts/Layout";

  function EventsPage() {
    return (
      <h2>Events Page</h2>
    )
  }

  function ProfilePage() {
    return (
      <h2>Profile Page</h2>
    )
  }

  function HomePage() {
    return (
      <h1>Home Page</h1>
    )
  }

export default function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

