import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
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
import dynamic from 'next/dynamic';
import { getNavItems } from '../../component/navItems';

// make a pdf container component that  fetch pdf from aws s3 and which is store in lesson-pdf url  intable
// Dynamically import the PDFViewer component to avoid SSR issues
const PDFViewer = dynamic(() => import('../../component/icons/pdf/pdf'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '600px',
      backgroundColor: '#1a1a1a',
      borderRadius: '6px' 
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTop: '3px solid #a855f7',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  )
});

const LessonLogViewPage = () => {
  const router = useRouter();
  const { classId, subject, lessonId } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [className, setClassName] = useState('');
  const [lessonName, setLessonName] = useState('');
  
  useEffect(() => {
    if (classId && lessonId) {
      const fetchLessonPdf = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }
          const response = await fetch(`/api/lesson/getpdf?lessonId=${lessonId}`, {
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
            let errorMessage = `Failed to fetch lesson PDF: ${response.status}`;
            try {
              const errorData = await response.json();
              if (errorData && errorData.message) {
                errorMessage = `${errorMessage} - ${errorData.message}`;
              }
            } catch (jsonError) {
              // Ignore JSON parsing errors
            }
            throw new Error(errorMessage);
          }
          const data = await response.json();
          if (data.success && data.data) {
            setLessonData(data.data);
            setLessonName(data.data.lessonName || 'Untitled Lesson');
          } else {
            throw new Error(data.message || 'No lesson data found');
          }
        } catch (err) {
          console.error('Error fetching lesson PDF:', err);
          setError(err.message || 'Failed to load lesson PDF');
        } finally {
          setLoading(false);
        }
      };
      const fetchClassName = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/class/get1?classId=${classId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setClassName(data.data.name);
            }
          }
        } catch (err) {
          console.error('Error fetching class name:', err);
        }
      };
      fetchLessonPdf();
      fetchClassName();
    }
  }, [router, classId, lessonId]);

  const handleCompleteClass = () => {
    // Navigate to completion page
    router.push({
      pathname: '/lesson-log/3',
      query: {
        classId,
        subject,
        lessonId
      }
    });
  };

  const navItems = getNavItems('take-class');

  return (
    <>
      <Head>
        <title>View Lesson | Teacher Portal</title>
      </Head>
      {/* Add PDF.js CDN link using next/script */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js" strategy="afterInteractive" />
      <Script id="set-pdfjs-worker" strategy="afterInteractive">
        {`
          if (typeof window !== 'undefined') {
            window.pdfjsLib = window.pdfjsLib || {};
            window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {};
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
          }
        `}
      </Script>

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
                onClick={() => router.push('/lesson-log/1')} 
                style={styles.backButton}
                className="back-button"
              >
                <span style={{marginRight: '4px', display: 'flex'}}>
                  <IconChevronLeft />
                </span>
                Back to Lesson Selection
              </button>

              <div style={styles.card}>
                <h1 style={styles.title}>
                  <span style={styles.titleIcon}><IconTeach /></span>
                  Teaching Session
                </h1>

                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{color: '#a1a1aa', marginTop: '16px'}}>Loading lesson content...</p>
                  </div>
                ) : error ? (
                  <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                      onClick={() => {
                        const fetchLessonPdf = async () => {
                          try {
                            setLoading(true);
                            const token = localStorage.getItem('token');
                            if (!token) {
                              router.push('/login');
                              return;
                            }
                            const response = await fetch(`/api/lesson/getpdf?lessonId=${lessonId}`, {
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
                              let errorMessage = `Failed to fetch lesson PDF: ${response.status}`;
                              try {
                                const errorData = await response.json();
                                if (errorData && errorData.message) {
                                  errorMessage = `${errorMessage} - ${errorData.message}`;
                                }
                              } catch (jsonError) {
                                // Ignore JSON parsing errors
                              }
                              throw new Error(errorMessage);
                            }
                            const data = await response.json();
                            if (data.success && data.data) {
                              setLessonData(data.data);
                              setLessonName(data.data.lessonName || 'Untitled Lesson');
                            } else {
                              throw new Error(data.message || 'No lesson data found');
                            }
                          } catch (err) {
                            console.error('Error fetching lesson PDF:', err);
                            setError(err.message || 'Failed to load lesson PDF');
                          } finally {
                            setLoading(false);
                          }
                        };
                        fetchLessonPdf();
                      }} 
                      style={styles.retryButton}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div style={styles.lessonContainer}>
                    <div style={styles.lessonHeader}>
                      <h2 style={styles.lessonClass}>Class: {className}</h2>
                      <h3 style={styles.lessonSubject}>Subject: {subject}</h3>
                      <h3 style={styles.lessonTopic}>Lesson: {lessonName}</h3>
                    </div>
                    
                    <div style={styles.pdfContainer}>
                      <p style={styles.pdfLabel}>Lesson PDF Document:</p>
                      
                      {lessonData?.pdfUrl ? (
                        <div style={styles.pdfWrapper}>
                          <PDFViewer pdfUrl={lessonData.pdfUrl} />
                        </div>
                      ) : (
                        <div style={styles.noPdfMessage}>
                          <p>PDF not available for this lesson.</p>
                        </div>
                      )}
                    </div>
                    
                    <div style={styles.buttonContainer}>
                      <button
                        onClick={handleCompleteClass}
                        style={styles.completeButton}
                      >
                        Complete Class
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
  lessonContainer: {
    width: '100%',
  },
  lessonHeader: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  lessonClass: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#a855f7',
    marginBottom: '8px',
  },
  lessonSubject: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#e4e4e7',
    marginBottom: '8px',
  },
  lessonTopic: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#e4e4e7',
  },
  pdfContainer: {
    backgroundColor: '#232323',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  pdfLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#a1a1aa',
    marginBottom: '12px',
  },
  pdfWrapper: {
    width: '100%',
    height: '600px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid #3a3a3a',
  },
  noPdfMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    height: '200px',
    border: '1px solid #3a3a3a',
    color: '#a1a1aa',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
  },
  completeButton: {
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
};

export default LessonLogViewPage;