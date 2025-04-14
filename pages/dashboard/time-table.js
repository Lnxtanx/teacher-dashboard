// pages/dashboard/timetable.js
import React from 'react';
import { useRouter } from 'next/router';

const TimeTable = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard/dashboard');
  };

  const timetableData = [
    {
      day: 'Monday',
      periods: ['Math', 'Computer Science', 'Physics', 'Break', 'Chemistry', 'Lab', 'Free'],
    },
    {
      day: 'Tuesday',
      periods: ['English', 'Computer Science', 'Math', 'Break', 'Elective', 'Lab', 'Free'],
    },
    {
      day: 'Wednesday',
      periods: ['Physics', 'Computer Science', 'Math', 'Break', 'Library', 'English', 'Free'],
    },
    {
      day: 'Thursday',
      periods: ['Math', 'Computer Science', 'Sports', 'Break', 'Chemistry', 'Seminar', 'Free'],
    },
    {
      day: 'Friday',
      periods: ['English', 'Computer Science', 'Physics', 'Break', 'Elective', 'Lab', 'Free'],
    },
  ];

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ⬅ Back to Dashboard
      </button>

      <h2 style={styles.title}>Weekly Time Table</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Period 1</th>
              <th style={styles.th}>Period 2</th>
              <th style={styles.th}>Period 3</th>
              <th style={styles.th}>Break</th>
              <th style={styles.th}>Period 5</th>
              <th style={styles.th}>Period 6</th>
              <th style={styles.th}>Period 7</th>
            </tr>
          </thead>
          <tbody>
            {timetableData.map((row, index) => (
              <tr key={index}>
                <td style={styles.td}>{row.day}</td>
                {row.periods.map((period, idx) => (
                  <td key={idx} style={styles.td}>{period}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
  },
  th: {
    padding: '1rem',
    backgroundColor: '#272727',
    color: '#f0f0f0',
    fontWeight: 'bold',
    border: '1px solid #333',
  },
  td: {
    padding: '0.8rem',
    textAlign: 'center',
    border: '1px solid #333',
  },
};

export default TimeTable;
