import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  IconFilter,
  IconEye
} from '../../component/icons/1';

// Move styles outside component to prevent recreation on each render
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
    transition: 'left 0.3s ease',
    zIndex: 10,
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
    transition: 'margin-left 0.3s ease',
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
    maxWidth: '1000px',
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
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '24px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#a855f7',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: '12px',
    display: 'flex',
  },
  headerButtons: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    padding: '0 12px',
  },
  filterIcon: {
    marginRight: '8px',
    display: 'flex',
    color: '#a1a1aa',
  },
  filterSelect: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    padding: '10px 0',
    fontSize: '0.875rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    width: '200px',
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
  placeholderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: '8px',
    padding: '48px 24px',
    marginBottom: '24px',
  },
  placeholderText: {
    fontSize: '1.125rem',
    color: '#a1a1aa',
  },
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  classCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  classCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: '100%',
    height: '160px',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  classImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageFallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    color: '#a1a1aa',
    fontSize: '0.875rem',
  },
  classTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: '12px',
    paddingRight: '80px', // Make room for status badge
  },
  classInfo: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
  },
  classInfoItem: {
    marginBottom: '8px',
    fontSize: '0.875rem',
    color: '#d4d4d8',
  },
  classDateTime: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  dateTimeIcon: {
    marginRight: '8px',
    display: 'flex',
    color: '#a1a1aa',
  },
  dateTimeText: {
    fontSize: '0.875rem',
    color: '#d4d4d8',
  },
  reasonSection: {
    marginTop: '12px',
    padding: '8px',
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: '4px',
  },
  reasonLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a1a1aa',
    marginBottom: '4px',
  },
  reasonText: {
    fontSize: '0.875rem',
    color: '#d4d4d8',
    lineHeight: '1.4',
  },
  cardFooter: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  viewDetailsButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#a855f7',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  viewDetailsButtonHover: {
    backgroundColor: '#9333ea',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
    display: 'none',
  },
  overlayActive: {
    display: 'block',
  }
};

const ClassRecordsPage = () => {
  const router = useRouter();
  const [classRecords, setClassRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverCardId, setHoverCardId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Memoize the fetch function to prevent recreation on each render
  const fetchClassRecords = useCallback(async (token) => {
    try {
      setLoading(true);
      const response = await fetch('/api/class/get', {
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
        throw new Error(`Failed to fetch class records: ${response.status}`);
      }

      const data = await response.json();
      setClassRecords(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching class records:', err);
      setError('Failed to load class records. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    let isMounted = true;
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Only update state if the component is still mounted
      fetchClassRecords(token);
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [router, fetchClassRecords]);

  // Add event listener for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewDetails = (id) => {
    router.push(`/class-response/class-preview?id=${id}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fixed filter function that handles case-insensitivity properly
  const filterClasses = () => {
    if (statusFilter === 'all') {
      return classRecords;
    }
    return classRecords.filter(record => 
      record.status && record.status.toLowerCase() === statusFilter.toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    if (!status) return { color: '#a1a1aa', bgColor: 'rgba(161, 161, 170, 0.1)' };
    
    switch (status.toLowerCase()) {
      case 'completed':
        return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' }; // Green
      case 'cancelled':
        return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }; // Red
      case 'completed with substitute':
        return { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }; // Yellow
      default:
        return { color: '#a1a1aa', bgColor: 'rgba(161, 161, 170, 0.1)' }; // Gray
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  const navItems = [
    { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: false },
    { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: false },
    { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: false },
    { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: true },
    { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: false },
    { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: false },
    { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: false },
  ];

  // Compute dynamic styles based on window size and sidebar state
  const getResponsiveStyles = () => {
    const isBrowser = typeof window !== 'undefined';
    const isMobile = isBrowser ? window.innerWidth <= 768 : false;
    
    return {
      sidebarStyle: {
        ...styles.sidebar,
        left: sidebarOpen ? '0' : (isMobile ? '-250px' : '0')
      },
      contentWrapperStyle: {
        ...styles.contentWrapper,
        marginLeft: isMobile ? '0' : '250px'
      },
      mobileHeaderStyle: {
        ...styles.mobileHeader,
        display: isMobile ? 'flex' : 'none'
      },
      overlayStyle: {
        ...styles.overlay,
        ...(sidebarOpen ? styles.overlayActive : {})
      }
    };
  };
  
  const { sidebarStyle, contentWrapperStyle, mobileHeaderStyle, overlayStyle } = getResponsiveStyles();

  return (
    <>
      <Head>
        <title>Class Records | Teacher Portal</title>
        <meta name="description" content="View and manage your completed class records" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={styles.mainContainer}>
        {/* Overlay for mobile sidebar */}
        <div 
          style={overlayStyle}
          onClick={toggleSidebar}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
        ></div>
        
        {/* Side Navigation */}
        <div style={sidebarStyle} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
                    aria-current={item.active ? 'page' : undefined}
                  >
                    <span style={styles.navIcon} aria-hidden="true">{item.icon}</span>
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
                <span style={styles.navIcon} aria-hidden="true"><IconUser /></span>
                Profile
              </a>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={contentWrapperStyle}>
          {/* Top Navigation Bar - Mobile only */}
          <header style={mobileHeaderStyle} className="mobile-header">
            <h2 style={styles.portalTitle}>Teacher Portal</h2>
            <button 
              style={styles.menuButton}
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
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
                aria-label="Back to Dashboard"
              >
                <span style={{ marginRight: '4px', display: 'flex' }} aria-hidden="true">
                  <IconChevronLeft />
                </span>
                Back to Dashboard
              </button>

              <div style={styles.card}>
                <div style={styles.headerSection}>
                  <h1 style={styles.title}>
                    <span style={styles.titleIcon} aria-hidden="true"><IconRecords /></span>
                    Class Records
                  </h1>

                  <div style={styles.headerButtons}>
                    <div style={styles.filterContainer}>
                      <span style={styles.filterIcon} aria-hidden="true"><IconFilter /></span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                        aria-label="Filter classes by status"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed with substitute">Completed with Substitute</option>
                      </select>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div style={styles.loadingContainer} role="status">
                    <div style={styles.loadingSpinner} aria-hidden="true"></div>
                    <p style={{ color: '#a1a1aa', marginTop: '16px' }}>Loading class records...</p>
                  </div>
                ) : error ? (
                  <div style={styles.errorContainer} role="alert">
                    <p style={styles.errorText}>{error}</p>
                    <button
                      onClick={() => fetchClassRecords(localStorage.getItem('token'))}
                      style={styles.retryButton}
                    >
                      Try Again
                    </button>
                  </div>
                ) : classRecords.length === 0 ? (
                  <div style={styles.placeholderContainer}>
                    <span style={{ color: '#6b7280', marginBottom: '16px' }} aria-hidden="true"><IconRecords /></span>
                    <p style={styles.placeholderText}>No class records found</p>
                  </div>
                ) : (
                  <div style={styles.classGrid}>
                    {filterClasses().map((record) => {
                      const statusStyle = getStatusColor(record.status);
                      const isHovered = hoverCardId === record.id;
                      return (
                        <div
                          key={record.id}
                          style={{
                            ...styles.classCard,
                            ...(isHovered ? styles.classCardHover : {})
                          }}
                          onClick={() => handleViewDetails(record.id)}
                          onMouseEnter={() => setHoverCardId(record.id)}
                          onMouseLeave={() => setHoverCardId(null)}
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for ${record.lessonName || 'Unnamed class'}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleViewDetails(record.id);
                            }
                          }}
                        >
                          <div 
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: statusStyle.bgColor,
                              color: statusStyle.color
                            }}
                            aria-label={`Status: ${record.status || 'Unknown'}`}
                          >
                            {record.status || 'Unknown'}
                          </div>

                          {record.imageUrl && (
                            <div style={styles.imageContainer}>
                              <Image
                                src={record.imageUrl}
                                alt={`Class: ${record.lessonName || 'Unnamed class'}`}
                                width={400}
                                height={300}
                                style={styles.classImage}
                                onError={handleImageError}
                                loading="lazy"
                              />
                              <div style={{ ...styles.imageFallback, display: 'none' }}>
                                Image not available
                              </div>
                            </div>
                          )}

                          <h3 style={styles.classTitle}>{record.lessonName || 'Unnamed class'}</h3>

                          <div style={styles.classInfo}>
                            <p style={styles.classInfoItem}>
                              <strong>Class Level:</strong> {record.classLevel || 'Not specified'}
                            </p>

                            <div style={styles.classDateTime}>
                              <span style={styles.dateTimeIcon} aria-hidden="true"><IconCalendar /></span>
                              <span style={styles.dateTimeText}>
                                {formatDateTime(record.submittedAt)}
                              </span>
                            </div>

                            {record.reason && (
                              <div style={styles.reasonSection}>
                                <h4 style={styles.reasonLabel}>Notes:</h4>
                                <p style={styles.reasonText}>{record.reason}</p>
                              </div>
                            )}
                          </div>

                          <div style={styles.cardFooter}>
                            <button
                              style={{
                                ...styles.viewDetailsButton,
                                ...(hoveredButton === record.id ? styles.viewDetailsButtonHover : {})
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(record.id);
                              }}
                              onMouseEnter={() => setHoveredButton(record.id)}
                              onMouseLeave={() => setHoveredButton(null)}
                              aria-label={`View details for ${record.lessonName || 'this class'}`}
                            >
                              <span style={{ marginRight: '8px', display: 'flex' }} aria-hidden="true">
                                <IconEye />
                              </span>
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
          color: rgb(255, 255, 255);
        }
        
        /* Fix for dropdown options - ensures text is visible */
        select option {
          background-color: #2a2a2a;
          color: #ffffff;
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
          
          .mobile-header {
            display: flex;
          }
        }
        
        /* Focus styles for accessibility */
        button:focus, a:focus, [role="button"]:focus {
          outline: 2px solid #a855f7;
          outline-offset: 2px;
        }
        
        /* Improved button hover states */
        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default ClassRecordsPage;