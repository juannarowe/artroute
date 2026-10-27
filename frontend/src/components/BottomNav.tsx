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
  const { data: myEvents } = useMyEvents();

  const isAdmin = currentUser?.role === "admin";
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
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background"
    >
      <ul className="mx-auto flex max-w-md justify-around">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.to}>
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
