import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";
import type { CalendarItem } from "@/types/calendar";

interface EventsCalendarProps {
  items: CalendarItem[];
}

export function EventsCalendar({ items }: EventsCalendarProps) {
  const navigate = useNavigate();

  const calendarEvents = items.map((item) => ({
    id: item.id,
    title: item.title,
    start: item.start,
    backgroundColor: item.isGoing ? "#000000" : "#ffffff",
    borderColor: "#000000",
    textColor: item.isGoing ? "#ffffff" : "#000000",
  }));

  function handleEventClick(clickInfo: EventClickArg) {
    navigate(`/events/${clickInfo.event.id}`);
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      buttonText={{ today: "Today", month: "Month", week: "Week" }}
      firstDay={1}
      locale="en-GB"
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      eventDisplay="block"
      height="auto"
      events={calendarEvents}
      eventClick={handleEventClick}
    />
  );
}
