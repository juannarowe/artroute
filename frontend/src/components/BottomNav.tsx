import { NavLink } from "react-router-dom";
import {
  ChartColumn,
  CalendarDays,
  LayoutList,
  MapIcon,
  User,
  ShieldCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyEvents } from "@/hooks/useMyEvents";

// One entry per nav item, so the JSX below is written only once.
// "onlyFor": items that not everybody sees.
const navItems = [
  { to: "/events", label: "Events", icon: LayoutList },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/stats", label: "Stats", icon: ChartColumn, onlyFor: "creators" },
  { to: "/profile", label: "Profile", icon: User },
  {
    to: "/manage-events",
    label: "Manage",
    icon: ShieldCheck,
    onlyFor: "admins",
  },
];

export function BottomNav() {
  const { data: currentUser } = useCurrentUser();
  // Same cache as My Events (no extra request); empty when logged out
  const { data: myEvents } = useMyEvents();

  const isAdmin = currentUser?.role === "admin";
  // Stats: admins and users who created at least one event
  const canSeeStats = isAdmin || (myEvents ?? []).length > 0;

  const visibleItems = navItems.filter((item) => {
    if (item.onlyFor === "admins") {
      return isAdmin;
    }
    if (item.onlyFor === "creators") {
      return canSeeStats;
    }
    return true;
  });

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 border-t bg-background"
    >
      <ul className="mx-auto flex max-w-md justify-around">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.to}>
              {/* NavLink knows if its page is open (isActive) and adds aria-current="page" */}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-foreground"
                    : "flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted-foreground"
                }
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
