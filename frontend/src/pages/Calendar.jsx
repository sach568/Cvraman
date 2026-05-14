import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getTasks } from "../api";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getTasks().then((res) => {
      setEvents(
        res.data.map((t) => ({
          title: t.title,
          start: t.due_date,
          extendedProps: { project: t.project_title },
        })),
      );
    });
  }, []);
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-2xl font-bold mb-4">📅 Task Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}
