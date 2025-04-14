import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LessonLogSubmitPage = () => {
  const router = useRouter();
  const { class: className, subject, topic } = router.query;

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('Completed');
  const currentDateTime = new Date().toLocaleString();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const submission = {
      class: className,
      subject,
      topic,
      dateTime: currentDateTime,
      status,
      image,
    };

    console.log("Submitted data:", submission);
    alert("Class details submitted successfully!");

    // navigate or save to DB here
    router.push('/class-response/class-completed'); // or wherever you need
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-8 text-center">📘 Submit Class Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Image Upload Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">📸 Upload Class Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {image && (
            <img
              src={image}
              alt="Class"
              className="mt-4 rounded-lg max-h-64 object-cover border border-gray-700"
            />
          )}
        </div>

        {/* Class Info Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">📄 Class Details</h2>
          <div className="space-y-4">
            <p><span className="font-bold text-purple-200">Class:</span> {className || 'N/A'}</p>
            <p><span className="font-bold text-purple-200">Subject:</span> {subject || 'N/A'}</p>
            <p><span className="font-bold text-purple-200">Topic:</span> {topic || 'N/A'}</p>
            <p><span className="font-bold text-purple-200">Date & Time:</span> {currentDateTime}</p>

            <div>
              <label className="block text-purple-200 font-medium mb-1">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg w-full"
              >
                <option>Completed</option>
                <option>Cancelled</option>
                <option>Completed with Substitute</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white w-full"
            >
              ✅ Submit Class Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonLogSubmitPage;
