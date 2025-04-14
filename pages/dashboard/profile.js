// pages/dashboard/profile.js
import React from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard/dashboard');
  };

  return (
    <div style={styles.container}>
      {/* Back to Dashboard */}
      <button onClick={handleBack} style={styles.backButton}>
        ⬅ Back to Dashboard
      </button>

      {/* Profile Card */}
      <div style={styles.card}>
        {/* Profile Picture */}
        <div style={styles.imageContainer}>
          <img
            src="https://i.pravatar.cc/150?img=32" // Placeholder avatar (can be replaced with DB image)
            alt="Teacher Avatar"
            style={styles.avatar}
          />
        </div>

        <h2 style={styles.title}>Teacher Profile</h2>

        <div style={styles.infoSection}>
          <p><strong>Name:</strong> Mr. Arjun Sharma</p>
          <p><strong>Email:</strong> arjun.sharma@example.com</p>
          <p><strong>Subject:</strong> Computer Science</p>
          <p><strong>Classes Assigned:</strong> B.Tech CSE 1st & 2nd Year</p>
          <p><strong>Experience:</strong> 5 Years</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Department:</strong> Engineering & Technology</p>
          <p><strong>Office Hours:</strong> 10:00 AM - 4:00 PM</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    padding: '2rem',
    color: '#f0f0f0',
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
    transition: '0.3s',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '2rem',
    borderRadius: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: '1rem',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid violet',
  },
  title: {
    fontSize: '1.8rem',
    color: 'violet',
    marginBottom: '1.5rem',
  },
  infoSection: {
    textAlign: 'left',
    lineHeight: '2rem',
    fontSize: '1rem',
  },
};

export default Profile;
