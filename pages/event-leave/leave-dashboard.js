import React from 'react';
import { useRouter } from 'next/router';

const dummyLeaves = [
  {
    id: 1,
    type: 'Medical Leave',
    reason: 'Fever and weakness',
    date: '2025-04-15',
    status: 'Pending',
  },
  {
    id: 2,
    type: 'Casual Leave',
    reason: 'Family function',
    date: '2025-04-10',
    status: 'Approved',
  },
  {
    id: 3,
    type: 'Short Break',
    reason: 'Doctor Appointment',
    date: '2025-04-05',
    status: 'Rejected',
  },
];

const LeaveDashboard = () => {
  const router = useRouter();

  const handleNewLeave = () => {
    router.push('/event-leave/leave');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400">📝 Leave / Break Dashboard</h1>
        <button
          onClick={handleNewLeave}
          className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded text-white"
        >
          ➕ Ask for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyLeaves.map((leave) => (
          <div
            key={leave.id}
            className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md"
          >
            <h2 className="text-xl font-semibold text-purple-300 mb-2">{leave.type}</h2>
            <p><span className="font-bold">Reason:</span> {leave.reason}</p>
            <p><span className="font-bold">Date:</span> {leave.date}</p>
            <p
              className={`mt-2 font-semibold ${
                leave.status === 'Pending'
                  ? 'text-yellow-400'
                  : leave.status === 'Approved'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {leave.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveDashboard;
