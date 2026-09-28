import { NavLink } from "react-router-dom";
import { CalendarDays, LayoutList, MapIcon, User } from "lucide-react";

// One entry per nav item, so the JSX below is written only once.
const navItems = [
  { to: "/events", label: "Events", icon: LayoutList },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 border-t bg-background"
    >
      <ul className="mx-auto flex max-w-md justify-around">
        {navItems.map((item) => {
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
