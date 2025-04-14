import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AskLeavePage = () => {
  const router = useRouter();

  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!leaveType || !reason || !date) {
      alert('Please fill all fields');
      return;
    }

    // This is where you would call your backend or Supabase API
    console.log('Submitted Leave Request:', {
      leaveType,
      reason,
      date,
    });

    alert('Leave request submitted successfully!');
    router.push('/dashboard/leave-break/leave-dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-8">➕ Ask for Leave / Break</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
        <div className="mb-4">
          <label className="block mb-1 text-sm">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="">-- Select Type --</option>
            <option value="Medical Leave">Medical Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Short Break">Short Break</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows="3"
            placeholder="Enter reason for leave..."
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white w-full py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default AskLeavePage;
