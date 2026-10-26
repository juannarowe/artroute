import { Link, Outlet } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

export function Layout() {
    return (
        <div className="min-h-svh">
            <header className="border-b px-4 py-3">
                {/* Brand name, not a heading: each page has its own <h1>.
                    It links home, so users can always go back. */}
                <Link to="/events" className="font-semibold">
                    Art Route
                </Link>
            </header>

            {/* pb-20 leaves space so the fixed bottom nav does not cover the content */}
            <main className="mx-auto max-w-md px-4 pt-4 pb-20">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    )
}
