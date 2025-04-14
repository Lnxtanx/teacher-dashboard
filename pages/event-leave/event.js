import React, { useState } from 'react';
import { useRouter } from 'next/router';

const EventRequestPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later you'll send this to your DB
    console.log('Event Request Submitted:', formData);
    alert('Your event request has been submitted!');
    router.push('/dashboard/event-leave/event-dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => router.push('/dashboard/event-leave/event-dashboard')}
        className="bg-gray-700 px-4 py-2 mb-6 rounded hover:bg-gray-600"
      >
        ← Back to Event Dashboard
      </button>

      <h1 className="text-3xl font-bold text-purple-400 text-center mb-8">📝 Request New Event / Leave</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700"
      >
        <div className="mb-4">
          <label className="block mb-1 text-purple-300">Event/Leave Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-purple-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-purple-300">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
        >
          🚀 Submit Request
        </button>
      </form>
    </div>
  );
};

export default EventRequestPage;
