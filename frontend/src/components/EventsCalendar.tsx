import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";
import type { CalendarItem } from "@/types/calendar";

interface EventsCalendarProps {
  items: CalendarItem[];
}

// "Dumb" calendar: it only draws the items it receives. It never fetches data.
export function EventsCalendar({ items }: EventsCalendarProps) {
  const navigate = useNavigate();

  // FullCalendar wants its own event format: { id, title, start, colors }
  // "Going" events: black. Other events: white with a black border.
  const calendarEvents = items.map((item) => ({
    id: item.id,
    title: item.title,
    start: item.start,
    backgroundColor: item.isGoing ? "#000000" : "#ffffff",
    borderColor: "#000000",
    textColor: item.isGoing ? "#ffffff" : "#000000",
  }));

  // Clicking an event opens its detail page
  function handleEventClick(clickInfo: EventClickArg) {
    navigate(`/events/${clickInfo.event.id}`);
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      // Buttons: ‹ › Today on the left, the month in the middle,
      // Month / Week switch on the right
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      buttonText={{ today: "Today", month: "Month", week: "Week" }}
      firstDay={1} // weeks start on Monday, like in Spain
      locale="en-GB"
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      eventDisplay="block" // show events as filled blocks, also in month view
      height="auto"
      events={calendarEvents}
      eventClick={handleEventClick}
    />
  );
}
