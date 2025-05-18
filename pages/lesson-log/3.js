import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  IconHome,
  IconCalendar,
  IconTeach,
  IconRecords,
  IconEvent,
  IconLeave,
  IconAI,
  IconUser,
  IconChevronLeft,
  IconUpload,
  IconCheck
} from '../../component/icons/1';


const LessonLogSubmitPage = () => {
  const router = useRouter();
  const { classId, subject, lessonId } = router.query;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('Completed');
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Only fetch when we have the required parameters
    if (classId && lessonId) {
      fetchLessonData();
    }
  }, [classId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch lesson data which now includes class name
      const response = await fetch(`/api/lesson/getpdf?lessonId=${lessonId}&classId=${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(`Failed to fetch lesson data: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Set both class name and lesson name from the enhanced API response
        setClassName(data.data.className || '');
        setLessonName(data.data.lessonName || '');
      } else {
        throw new Error(data.message || 'No lesson data found');
      }
    } catch (err) {
      console.error('Error fetching lesson data:', err);
      setError(err.message || 'Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // First, upload the image if one was selected
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/lesson/up', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
// Then, submit the class response data
      const responseData = {
        classLevel: className,
        lessonName: lessonName,
        status: status,
        reason: status !== 'Completed' ? reason : null,
        imageUrl: imageUrl,
        classId: Number(classId),
        lessonId: Number(lessonId)
      };

      const submitResponse = await fetch('/api/lesson/classresponse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseData)
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.message || 'Failed to submit class response');
      }

      // On success, navigate back to dashboard
      router.push('/class-response/class-completed');

    } catch (err) {
      console.error('Error submitting class response:', err);
      setError(err.message || 'An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };
  
  const navItems = [
    { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: false },
    { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: false },
    { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: true },
    { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: false },
    { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: false },
    { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: false },
    { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: false },
  ];

  return (
    <>
      <Head>
        <title>Submit Class Response | Teacher Portal</title>
      </Head>

      <div style={styles.mainContainer}>
        {/* Side Navigation - Fixed */}
        <div style={styles.sidebar} className="sidebar">
          <div style={styles.sidebarHeader}>
            <h2 style={styles.portalTitle}>Teacher Portal</h2>
          </div>
          <nav style={styles.sidebarNav}>
            <ul style={styles.navList}>
              {navItems.map((item) => (
                <li key={item.name} style={styles.navItem}>
                  <a
                    href={item.path}
                    style={item.active ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink}
                  >
                    <span style={styles.navIcon}>{item.icon}</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Profile at the bottom */}
          <div style={styles.profileSection}>
            <a
              href="/dashboard/profile"
              style={styles.profileLink}
            >
              <span style={styles.navIcon}><IconUser /></span>
              Profile
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.contentWrapper}>
          {/* Top Navigation Bar - Mobile only */}
          <header style={styles.mobileHeader} className="mobile-header">
            <h2 style={styles.portalTitle}>Teacher Portal</h2>
            <button style={styles.menuButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Content Area */}
          <main style={styles.mainContent}>
            <div style={styles.contentContainer}>
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                style={styles.backButton}
                className="back-button"
              >
                <span style={{ marginRight: '4px', display: 'flex' }}>
                  <IconChevronLeft />
                </span>
                Back to Lesson
              </button>

              <div style={styles.card}>
                <h1 style={styles.title}>
                  <span style={styles.titleIcon}><IconTeach /></span>
                  Submit Class Details
                </h1>

                {error && (
                  <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button
                      onClick={() => setError(null)}
                      style={styles.errorButton}
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div style={styles.submitContainer}>
                  {/* Class Info Section */}
                  <div style={styles.infoSection}>
                    <h2 style={styles.sectionTitle}>Class Information</h2>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Class:</p>
                        <p style={styles.infoValue}>{className || 'Loading...'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Subject:</p>
                        <p style={styles.infoValue}>{subject || 'N/A'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Lesson:</p>
                        <p style={styles.infoValue}>{lessonName || 'Loading...'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Date & Time:</p>
                        <p style={styles.infoValue}>{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div style={styles.statusSection}>
                    <h2 style={styles.sectionTitle}>Class Status</h2>
                    <div style={styles.statusContainer}>
                      <label style={styles.label}>Status:</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={styles.select}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Postponed">Postponed</option>
                      </select>

                      {status !== 'Completed' && (
                        <div style={styles.reasonContainer}>
                          <label style={styles.label}>Reason:</label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={styles.textarea}
                            placeholder="Please provide a reason..."
                            rows="3"
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div style={styles.imageSection}>
                    <h2 style={styles.sectionTitle}>Class Image</h2>
                    <div style={styles.uploadContainer}>
                      <label style={styles.uploadLabel}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={styles.fileInput}
                        />
                        <div style={styles.uploadButton}>
                          <span style={styles.uploadIcon}><IconUpload /></span>
                          <span>Choose Image</span>
                        </div>
                      </label>

                      {imagePreview ? (
                        <div style={styles.previewContainer}>
                          <img
                            src={imagePreview}
                            alt="Class Image Preview"
                            style={styles.imagePreview}
                          />
                        </div>
                      ) : (
                        <div style={styles.placeholderContainer}>
                          <p style={styles.placeholderText}>Upload an image of the class session</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={styles.buttonContainer}>
                    <button
                      onClick={handleSubmit}
                      style={submitting ? { ...styles.submitButton, opacity: 0.7 } : styles.submitButton}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <div style={styles.spinnerContainer}>
                          <div style={styles.spinner}></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <span style={styles.submitIcon}><IconCheck /></span>
                          <span>Submit Class Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #121212;
          color: #e4e4e7;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .back-button:hover {
          color: #a855f7;
        }
        
        @media (max-width: 768px) {
          .sidebar {
            left: -250px;
          }
          
          .sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#e4e4e7',
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1a1a1a',
    borderRight: '1px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #2a2a2a',
  },
  portalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#a855f7',
    margin: 0,
  },
  sidebarNav: {
    marginTop: '32px',
    flex: 1,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    color: '#a1a1aa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  activeNavLink: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    borderLeft: '4px solid #a855f7',
  },
  navIcon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  profileSection: {
    marginTop: 'auto',
    borderTop: '1px solid #2a2a2a',
    padding: '16px 0',
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    color: '#a1a1aa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  contentWrapper: {
    flex: 1,
    marginLeft: '250px', // Match sidebar width
    display: 'flex',
    flexDirection: 'column',
  },
  mobileHeader: {
    display: 'none',
    backgroundColor: '#1a1a1a',
    padding: '16px',
    borderBottom: '1px solid #2a2a2a',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: '#a1a1aa',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
  contentContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#a1a1aa',
    padding: '8px 0',
    marginBottom: '24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#a855f7',
    margin: '0 0 32px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: '12px',
    display: 'flex',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: '16px',
  },
  errorButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  submitContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  infoSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#a855f7',
    marginBottom: '16px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  infoItem: {
    marginBottom: '12px',
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: '#a1a1aa',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#ffffff',
    fontWeight: '500',
  },
  statusSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '0.9rem',
    color: '#a1a1aa',
    marginBottom: '4px',
    display: 'block',
  },
  select: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '1rem',
    width: '100%',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23a1a1aa' viewBox='0 0 16 16'%3E%3Cpath d='M8 10l4-4H4z'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    paddingRight: '36px',
  },
  reasonContainer: {
    marginTop: '8px',
  },
  textarea: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '1rem',
    width: '100%',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  imageSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  uploadLabel: {
    display: 'block',
    cursor: 'pointer',
  },
  fileInput: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: '0',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  uploadIcon: {
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  previewContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    padding: '8px',
    border: '1px solid #3a3a3a',
    marginTop: '16px',
  },
  imagePreview: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  placeholderContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    padding: '32px',
    border: '1px dashed #3a3a3a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
  },
  placeholderText: {
    color: '#a1a1aa',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '14px 28px',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    maxWidth: '300px',
  },
  submitIcon: {
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    marginRight: '10px',
    animation: 'spin 1s linear infinite',
  },
};

export default LessonLogSubmitPage;