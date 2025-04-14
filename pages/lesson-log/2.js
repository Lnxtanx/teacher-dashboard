import React from 'react';
import { useRouter } from 'next/router';

const LessonLogViewPage = () => {
  const router = useRouter();
  const { class: className, subject, topic } = router.query;

  const handleCompleteClass = () => {
    router.push('/lesson-log/3');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 relative">
      <button
        onClick={() => router.push('/dashboard/lessonlog')}
        className="text-sm text-gray-300 hover:text-white mb-4 self-start"
      >
        ← Back to Selection
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-400">
          Class: {className || 'B.Tech CSE 1st Year'} - {subject || 'Subject'}
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-300 mt-2">
          Topic: {topic || 'Topic'}
        </h2>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h3 className="text-lg font-medium text-purple-200 mb-2">📄 PDF Document:</h3>
          <div className="border border-gray-700 rounded overflow-hidden">
            <p className="text-sm text-gray-400 text-center py-2 bg-black">[PDF Document Display Placeholder]</p>
            <iframe
              src="https://example.com/dummy-pdf.pdf"
              title="PDF Viewer"
              width="100%"
              height="500px"
              className="border-0"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCompleteClass}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        ✅ Complete Class
      </button>
    </div>
  );
};

export default LessonLogViewPage;
