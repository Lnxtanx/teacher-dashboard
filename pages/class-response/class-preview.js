import React from 'react';

const dummyClassDetails = {
  id: 1,
  class: 'B.Tech CSE 1st Year',
  subject: 'Computer Science',
  topic: 'Introduction to Programming',
  dateTime: '2025-04-14 10:00 AM',
  status: 'Completed',
  image: 'https://via.placeholder.com/400x250.png?text=Class+Image', // placeholder
  notes: 'The class was conducted successfully and covered basics of C.',
};

const ClassPreviewPage = () => {
  const details = dummyClassDetails;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h1 className="text-3xl font-bold text-purple-400 mb-4 text-center">📖 Class Preview</h1>

        <img
          src={details.image}
          alt="Uploaded Class"
          className="rounded-lg shadow-lg mb-6 mx-auto border border-gray-800"
        />

        <div className="text-lg space-y-2">
          <p><strong>📚 Class:</strong> {details.class}</p>
          <p><strong>📘 Subject:</strong> {details.subject}</p>
          <p><strong>📎 Topic:</strong> {details.topic}</p>
          <p><strong>🕒 Date & Time:</strong> {details.dateTime}</p>
          <p>
            <strong>📌 Status:</strong>{' '}
            <span className={`font-semibold ${
              details.status === 'Cancelled'
                ? 'text-red-400'
                : details.status.includes('Substitute')
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}>
              {details.status}
            </span>
          </p>
          <p><strong>📝 Notes:</strong> {details.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassPreviewPage;
