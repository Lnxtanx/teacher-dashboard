import React from 'react';
import { useRouter } from 'next/router';

const dummyEvents = [
  {
    id: 1,
    title: 'Tech Fest Volunteering',
    description: 'Requesting leave for tech fest participation',
    dateTime: '2025-04-18 09:00 AM',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Workshop Attendance',
    description: 'Attending AI Workshop at IIT Roorkee',
    dateTime: '2025-04-20 11:00 AM',
    status: 'Approved',
  },
  {
    id: 3,
    title: 'Medical Leave',
    description: 'Medical appointment on scheduled date',
    dateTime: '2025-04-22 02:00 PM',
    status: 'Rejected',
  },
];

const EventDashboard = () => {
  const router = useRouter();

  const handleNewRequest = () => {
    router.push('/event-leave/event');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 text-center mb-6">📅 Event & Leave Dashboard</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleNewRequest}
          className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-800"
        >
          ➕ Request New Event/Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyEvents.map((event) => (
          <div
            key={event.id}
            className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-purple-300 mb-2">{event.title}</h2>
            <p><span className="font-bold">Details:</span> {event.description}</p>
            <p><span className="font-bold">Date & Time:</span> {event.dateTime}</p>
            <p className={`font-semibold mt-2 ${
              event.status === 'Approved'
                ? 'text-green-400'
                : event.status === 'Pending'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              Status: {event.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDashboard;
