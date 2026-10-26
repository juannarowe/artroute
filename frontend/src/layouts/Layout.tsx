import { Link, Outlet } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

export function Layout() {
    return (
        <div className="min-h-svh">
            {/* "Skip link": hidden until a keyboard user presses Tab, then it lets
                them jump straight to the page content */}
            <a
                href="#main-content"
                className="sr-only rounded-md bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
            >
                Skip to content
            </a>
            <header className="border-b px-4 py-3 md:px-8">
                {/* Brand name, not a heading: each page has its own <h1>.
                    It links home, so users can always go back. */}
                <Link to="/events" className="font-semibold">
                    Art Route
                </Link>
            </header>

            {/* Mobile first: one narrow column; wider on tablet (md) and desktop (lg).
                pb-20 leaves space so the fixed bottom nav does not cover the content */}
            <main id="main-content" className="mx-auto max-w-md px-4 pt-4 pb-20 md:max-w-3xl md:px-8 lg:max-w-5xl">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    )
}
