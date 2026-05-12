import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import api from "../api";

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/tasks.php").then((res) => {
      const evts = res.data.map((task) => ({
        title: task.title,
        start: task.due_date,
        extendedProps: { project: task.project_title },
      }));
      setEvents(evts);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          📅 Task Calendar
        </h2>
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Tasks
          </span>
        </div>
      </div>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
          }}
          eventDisplay="block"
          eventColor="#3b82f6"
          eventTextColor="#ffffff"
          dayMaxEvents={2}
          moreLinkText="+{count} more"
        />
      </div>

      {/* Custom CSS for FullCalendar */}
      <style>{`
        .calendar-wrapper .fc {
          font-family: inherit;
        }
        .calendar-wrapper .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }
        .calendar-wrapper .fc-button {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #374151;
          text-transform: capitalize;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .calendar-wrapper .fc-button:hover {
          background-color: #e5e7eb;
          border-color: #d1d5db;
        }
        .calendar-wrapper .fc-button-primary:not(:disabled).fc-button-active,
        .calendar-wrapper .fc-button-primary:not(:disabled):active {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        .calendar-wrapper .fc-daygrid-day-number {
          font-size: 0.85rem;
          color: #4b5563;
        }
        .calendar-wrapper .fc-day-today {
          background-color: #eff6ff !important;
        }
        .calendar-wrapper .fc-daygrid-day-frame {
          background-color: white;
        }
        .calendar-wrapper .fc-daygrid-day {
          transition: background-color 0.2s;
        }
        .calendar-wrapper .fc-daygrid-day:hover {
          background-color: #f9fafb;
        }
        .calendar-wrapper .fc-event {
          border-radius: 6px;
          padding: 2px 4px;
          font-size: 0.75rem;
          cursor: pointer;
          margin: 1px 2px;
          border: none;
        }
        .calendar-wrapper .fc-daygrid-more-link {
          color: #3b82f6;
          font-size: 0.7rem;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .calendar-wrapper .fc-toolbar {
            flex-direction: column;
            gap: 0.75rem;
          }
          .calendar-wrapper .fc-toolbar-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
