import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <main>
            <h1>ArtRoute</h1>
            <Outlet />
            <footer>Footer</footer>
        </main>
    )
}