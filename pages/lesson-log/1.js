// pages/dashboard/lessonlog.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LessonLog = () => {
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const classOptions = ['B.Tech CSE 1st Year', 'B.Tech CSE 2nd Year'];
  const subjectOptions = ['Computer Science', 'Mathematics', 'Physics', 'English'];
  const topicOptions = {
    'Computer Science': ['Introduction to Programming', 'Data Structures', 'Operating Systems'],
    Mathematics: ['Calculus', 'Algebra', 'Statistics'],
    Physics: ['Mechanics', 'Thermodynamics', 'Optics'],
    English: ['Grammar', 'Essay Writing', 'Communication Skills'],
  };

  const handleStartClass = () => {
    router.push({
      pathname: '/lesson-log/2',
      query: {
        class: selectedClass,
        subject: selectedSubject,
        topic: selectedTopic,
      }
    });
  };

  const handleBack = () => {
    router.push('/dashboard/dashboard');
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ⬅ Back to Dashboard
      </button>

      <h2 style={styles.title}>Lesson Log</h2>

      <div style={styles.form}>
        <div style={styles.selectGroup}>
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject('');
              setSelectedTopic('');
            }}
            style={styles.select}
          >
            <option value="">-- Choose Class --</option>
            {classOptions.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div style={styles.selectGroup}>
            <label>Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('');
              }}
              style={styles.select}
            >
              <option value="">-- Choose Subject --</option>
              {subjectOptions.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {selectedSubject && (
          <div style={styles.selectGroup}>
            <label>Select Topic:</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Choose Topic --</option>
              {(topicOptions[selectedSubject] || []).map((topic, idx) => (
                <option key={idx} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}

        {selectedTopic && (
          <>
            <div style={styles.summaryBox}>
              <p><strong>Class:</strong> {selectedClass}</p>
              <p><strong>Subject:</strong> {selectedSubject}</p>
              <p><strong>Topic:</strong> {selectedTopic}</p>
            </div>
            <button
              onClick={handleStartClass}
              className="bg-purple-700 text-white px-6 py-2 rounded mt-6 hover:bg-purple-800"
            >
              Start Class
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    padding: '2rem',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid #ccc',
    color: '#ccc',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    marginBottom: '1rem',
    cursor: 'pointer',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: 'violet',
    marginBottom: '2rem',
  },
  form: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  selectGroup: {
    marginBottom: '1.5rem',
  },
  select: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  summaryBox: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    lineHeight: '1.6',
    border: '1px solid #333',
  },
};

export default LessonLog;
