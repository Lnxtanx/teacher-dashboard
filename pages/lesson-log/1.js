import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getNavItems } from '../../component/navItems';
import { 
  IconHome, 
  IconCalendar, 
  IconTeach, 
  IconRecords, 
  IconEvent, 
  IconLeave, 
  IconAI, 
  IconUser,
  IconChevronLeft
} from '../../component/icons/1';

const LessonLog = () => {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Physical Education'); // Default subject
  const [selectedLesson, setSelectedLesson] = useState('');
  
  const navItems = getNavItems('take-class');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const fetchClasses = async (token) => {
        try {
          setLoading(true);
          const response = await fetch('/api/class/get1', {
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
            throw new Error(`Failed to fetch classes: ${response.status}`);
          }
          const data = await response.json();
          setClasses(data.data || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching classes:', err);
          setError('Failed to load classes');
        } finally {
          setLoading(false);
        }
      };
      fetchClasses(token);
    }
  }, [router]);
  
  const fetchLessons = async (classId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/lesson/get?classId=${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.status}`);
      }

      const data = await response.json();
      setLessons(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchLessons(classId);
    } else {
      setLessons([]);
    }
    setSelectedLesson(''); // Reset lesson selection
  };

  const handleStartClass = () => {
    if (!selectedClass || !selectedLesson) {
      alert('Please select both class and lesson');
      return;
    }

    router.push({
      pathname: '/lesson-log/2',
      query: {
        classId: selectedClass,
        subject: selectedSubject,
        lessonId: selectedLesson
      }
    });
  };

  return (
    <>
      <Head>
        <title>Lesson Log | Teacher Portal</title>
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
                    style={item.active ? {...styles.navLink, ...styles.activeNavLink} : styles.navLink}
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
            <Link href="/dashboard/profile" legacyBehavior>
              <a style={styles.profileLink}>
                <span style={styles.navIcon}><IconUser /></span>
                Profile
              </a>
            </Link>
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
                onClick={() => router.push('/dashboard/dashboard')} 
                style={styles.backButton}
                className="back-button"
              >
                <span style={{marginRight: '4px', display: 'flex'}}>
                  <IconChevronLeft />
                </span>
                Back to Dashboard
              </button>

              <div style={styles.card}>
                <h1 style={styles.title}>
                  <span style={styles.titleIcon}><IconTeach /></span>
                  Lesson Log
                </h1>

                {loading && classes.length === 0 ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{color: '#a1a1aa', marginTop: '16px'}}>Loading classes...</p>
                  </div>
                ) : error ? (
                  <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                      onClick={() => fetchClasses(localStorage.getItem('token'))} 
                      style={styles.retryButton}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div style={styles.form}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Select Class:</label>
                      <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        style={styles.select}
                      >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subject:</label>
                      <input
                        type="text"
                        value={selectedSubject}
                        disabled
                        style={styles.disabledInput}
                      />
                    </div>

                    {selectedClass && (
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Select Lesson:</label>
                        {loading ? (
                          <div style={styles.miniLoadingContainer}>
                            <div style={styles.miniLoadingSpinner}></div>
                            <span style={{color: '#a1a1aa', marginLeft: '8px'}}>Loading lessons...</span>
                          </div>
                        ) : (
                          <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            style={styles.select}
                          >
                            <option value="">-- Select Lesson --</option>
                            {lessons.map((lesson) => (
                              <option key={lesson.id} value={lesson.id}>{lesson.lessonName}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}

                    {selectedClass && selectedLesson && (
                      <div style={styles.summaryBox}>
                        <h3 style={styles.summaryTitle}>Class Details</h3>
                        <div style={styles.summaryItem}>
                          <span style={styles.summaryLabel}>Class:</span>
                          <span style={styles.summaryValue}>
                            {classes.find(c => c.id.toString() === selectedClass.toString())?.name || ''}
                          </span>
                        </div>
                        <div style={styles.summaryItem}>
                          <span style={styles.summaryLabel}>Subject:</span>
                          <span style={styles.summaryValue}>{selectedSubject}</span>
                        </div>
                        <div style={styles.summaryItem}>
                          <span style={styles.summaryLabel}>Lesson:</span>
                          <span style={styles.summaryValue}>
                            {lessons.find(l => l.id.toString() === selectedLesson.toString())?.lessonName || ''}
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={styles.buttonContainer}>
                      <button
                        onClick={handleStartClass}
                        style={selectedClass && selectedLesson ? styles.startButton : styles.disabledButton}
                        disabled={!selectedClass || !selectedLesson}
                      >
                        Start Class
                      </button>
                    </div>
                  </div>
                )}
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
    maxWidth: '800px',
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
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#e4e4e7',
    fontWeight: '500',
  },
  select: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '1rem',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px',
  },
  disabledInput: {
    width: '100%',
    backgroundColor: '#3a3a3a',
    color: '#a1a1aa',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '1rem',
    cursor: 'not-allowed',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  miniLoadingContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
  },
  miniLoadingSpinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTop: '2px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
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
  retryButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  summaryBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#a855f7',
    marginBottom: '16px',
  },
  summaryItem: {
    display: 'flex',
    marginBottom: '12px',
    alignItems: 'center',
  },
  summaryLabel: {
    fontWeight: '500',
    color: '#a1a1aa',
    width: '100px',
  },
  summaryValue: {
    color: '#ffffff',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  disabledButton: {
    backgroundColor: '#4b5563',
    color: '#a1a1aa',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'not-allowed',
  },
};

export default LessonLog;