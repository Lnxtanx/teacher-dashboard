import React from 'react';
import { useRouter } from 'next/router';

const dummyClasses = [
  {
    id: 1,
    class: 'B.Tech CSE 1st Year',
    subject: 'Computer Science',
    topic: 'Introduction to Programming',
    dateTime: '2025-04-14 10:00 AM',
    status: 'Completed',
  },
  {
    id: 2,
    class: 'B.Tech CSE 2nd Year',
    subject: 'Operating Systems',
    topic: 'Process Scheduling',
    dateTime: '2025-04-13 12:00 PM',
    status: 'Cancelled',
  },
  {
    id: 3,
    class: 'B.Tech CSE 3rd Year',
    subject: 'Machine Learning',
    topic: 'Neural Networks',
    dateTime: '2025-04-12 2:00 PM',
    status: 'Completed with Substitute',
  },
];

const CompletedClassesPage = () => {
  const router = useRouter();

  const handleViewDetails = (id) => {
    router.push(`/class-response/class-preview?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-8 text-center">📚 All Submitted Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyClasses.map((cls) => (
          <div
            key={cls.id}
            onClick={() => handleViewDetails(cls.id)}
            className="bg-gray-900 p-6 rounded-lg shadow-md hover:bg-gray-800 cursor-pointer border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-purple-300 mb-2">{cls.subject}</h2>
            <p><span className="font-bold">Class:</span> {cls.class}</p>
            <p><span className="font-bold">Topic:</span> {cls.topic}</p>
            <p><span className="font-bold">Date:</span> {cls.dateTime}</p>
            <p
              className={`font-semibold mt-2 ${
                cls.status === 'Cancelled'
                  ? 'text-red-400'
                  : cls.status.includes('Substitute')
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}
            >
              {cls.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedClassesPage;
