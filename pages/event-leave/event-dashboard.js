import React, { useState, useEffect } from 'react';
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
  IconAdd
} from '../../component/icons/1';
import { getNavItems } from '../../component/navItems';

const EventDashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const fetchEventRecords = async (token) => {
        try {
          setLoading(true);
          const response = await fetch('/api/event/get', {
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
            throw new Error(`Failed to fetch event records: ${response.status}`);
          }
          const data = await response.json();
          setEvents(data.data || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching event records:', err);
          setError('Failed to load event records');
        } finally {
          setLoading(false);
        }
      };
      fetchEventRecords(token);
    }
  }, [router]);

  const handleNewEventRequest = () => {
    router.push('/event-leave/event');
  };

  const filterEvents = () => {
    if (statusFilter === 'all') {
      return events;
    }
    return events.filter(event => event.status.toLowerCase() === statusFilter.toLowerCase());
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' }; // Green
      case 'rejected':
        return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }; // Red
      case 'pending':
      default:
        return { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }; // Yellow
    }
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const navItems = getNavItems('event-dashboard');

  return (
    <>
      <Head>
        <title>Event Planner | Teacher Portal</title>
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
                <div style={styles.headerSection}>
                  <h1 style={styles.title}>
                    <span style={styles.titleIcon}><IconEvent /></span>
                    Event Planner
                  </h1>

                  <div style={styles.headerButtons}>
                    <div style={styles.filterContainer}>
                      <span style={styles.filterIcon}><IconFilter /></span>
                      <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleNewEventRequest}
                      style={styles.newEventButton}
                      className="new-event-button"
                    >
                      <span style={{marginRight: '8px', display: 'flex'}}>
                        <IconAdd />
                      </span>
                      New Event Request
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{color: '#a1a1aa', marginTop: '16px'}}>Loading event records...</p>
                  </div>
                ) : error ? (
                  <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                      onClick={() => router.push('/event-leave/event')} 
                      style={styles.retryButton}
                    >
                      Try Again
                    </button>
                  </div>
                ) : events.length === 0 ? (
                  <div style={styles.placeholderContainer}>
                    <span style={{color: '#6b7280', marginBottom: '16px'}}><IconEvent /></span>
                    <p style={styles.placeholderText}>No event records found</p>
                    <button 
                      onClick={handleNewEventRequest}
                      style={{...styles.newEventButton, marginTop: '16px'}}
                      className="new-event-button"
                    >
                      <span style={{marginRight: '8px', display: 'flex'}}>
                        <IconAdd />
                      </span>
                      Create Your First Event Request
                    </button>
                  </div>
                ) : (
                  <div style={styles.eventGrid}>
                    {filterEvents().map((event) => {
                      const statusStyle = getStatusColor(event.status);
                      return (
                        <div key={event.id} style={styles.eventCard}>
                          <div style={{...styles.statusBadge, backgroundColor: statusStyle.bgColor, color: statusStyle.color}}>
                            {event.status}
                          </div>
                          <h3 style={styles.eventTitle}>{event.eventName}</h3>
                          <div style={styles.eventDateTime}>
                            <span style={styles.dateTimeIcon}><IconCalendar /></span>
                            <span style={styles.dateTimeText}>{formatDateTime(event.eventDate)}</span>
                          </div>
                          <div style={styles.eventDetails}>
                            <h4 style={styles.descriptionLabel}>Description:</h4>
                            <p style={styles.descriptionText}>{event.description || 'No description provided'}</p>
                          </div>
                          <div style={styles.cardFooter}>
                            <p style={styles.appliedDate}>
                              Requested on {new Date(event.eventDate).toLocaleDateString()}
                            </p>
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
          color: #e4e4e7;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .new-event-button:hover {
          background-color: #7c3aed;
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
    justifyContent: 'space-between',
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
    width: '120px',
  },
  newEventButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
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
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  eventCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
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
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: '16px',
    paddingRight: '80px', // Make room for status badge
  },
  eventDateTime: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '16px',
  },
  dateTimeIcon: {
    marginRight: '8px',
    display: 'flex',
    color: '#a855f7',
  },
  dateTimeText: {
    fontSize: '0.875rem',
    color: '#e4e4e7',
  },
  eventDetails: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
  },
  descriptionLabel: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    marginBottom: '4px',
  },
  descriptionText: {
    fontSize: '1rem',
    color: '#e4e4e7',
    lineHeight: '1.5',
  },
  cardFooter: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #3a3a3a',
  },
  appliedDate: {
    fontSize: '0.75rem',
    color: '#a1a1aa',
    fontStyle: 'italic',
  },
};

export default EventDashboard;