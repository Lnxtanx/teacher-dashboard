import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// SVG Icons as components
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconTeach = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconRecords = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconEvent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 18h.01"></path>
    <path d="M12 18h.01"></path>
    <path d="M16 18h.01"></path>
  </svg>
);

const IconLeave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M17 14l-5 5-5-5"></path>
  </svg>
);

const IconAI = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
    <path d="M12 8v8"></path>
    <path d="M8 12h8"></path>
  </svg>
);

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const LeaveApplicationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    leaveType: '',
    reason: '',
    customReason: '',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.leaveType || !formData.fromDate || !formData.toDate) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.leaveType === 'Other' && !formData.customReason) {
      setError('Please specify a reason for your leave');
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      setError('From date cannot be after To date');
      return;
    }

    // Prepare data for submission
    const finalReason = formData.leaveType === 'Other' 
      ? formData.customReason 
      : formData.reason 
        ? `${formData.leaveType}: ${formData.reason}` 
        : formData.leaveType;

    const leaveData = {
      reason: finalReason,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    };

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/leave/genrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leaveData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit leave application');
      }

      // Navigate to leave dashboard on success
      router.push('/event-leave/leave-dashboard');
    } catch (err) {
      console.error('Error submitting leave application:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const leaveTypeOptions = [
    { value: 'Medical Leave', label: 'Medical Leave' },
    { value: 'Casual Leave', label: 'Casual Leave' },
    { value: 'Personal Leave', label: 'Personal Leave' },
    { value: 'Family Emergency', label: 'Family Emergency' },
    { value: 'Bereavement Leave', label: 'Bereavement Leave' },
    { value: 'Study Leave', label: 'Study Leave' },
    { value: 'Other', label: 'Other' },
  ];

  const navItems = [
    { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: false },
    { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: false },
    { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: false },
    { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: false },
    { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: false },
    { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: true },
    { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: false },
  ];

  return (
    <>
      <Head>
        <title>New Leave Application | Teacher Portal</title>
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
                onClick={() => router.push('/event-leave/leave-dashboard')} 
                style={styles.backButton}
                className="back-button"
              >
                <span style={{marginRight: '4px', display: 'flex'}}>
                  <IconChevronLeft />
                </span>
                Back to Leave Records
              </button>

              <div style={styles.card}>
                <div style={styles.headerSection}>
                  <h1 style={styles.title}>
                    <span style={styles.titleIcon}><IconLeave /></span>
                    New Leave Application
                  </h1>
                </div>

                {error && (
                  <div style={styles.errorAlert}>
                    <p style={styles.errorText}>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGrid}>
                    {/* Leave Type */}
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Leave Type <span style={styles.required}>*</span>
                      </label>
                      <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        style={styles.select}
                        required
                      >
                        <option value="">-- Select Leave Type --</option>
                        {leaveTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Range */}
                    <div style={styles.dateRangeContainer}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          From Date <span style={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleChange}
                          style={styles.input}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          To Date <span style={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          name="toDate"
                          value={formData.toDate}
                          onChange={handleChange}
                          style={styles.input}
                          required
                          min={formData.fromDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {/* Reason */}
                    {formData.leaveType && formData.leaveType !== 'Other' && (
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Additional Details
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          style={styles.textarea}
                          placeholder={`Provide additional details about your ${formData.leaveType.toLowerCase()}`}
                          rows="4"
                        />
                      </div>
                    )}

                    {/* Custom Reason for "Other" leave type */}
                    {formData.leaveType === 'Other' && (
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Specify Reason <span style={styles.required}>*</span>
                        </label>
                        <textarea
                          name="customReason"
                          value={formData.customReason}
                          onChange={handleChange}
                          style={styles.textarea}
                          placeholder="Please specify your reason for leave"
                          rows="4"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => router.push('/event-leave/leave-dashboard')}
                      style={styles.cancelButton}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={styles.submitButton}
                      disabled={loading}
                    >
                      {loading ? (
                        <span style={styles.loadingSpinner}></span>
                      ) : (
                        <>
                          <span style={styles.submitIcon}><IconSend /></span>
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
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
  headerSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#a855f7',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: '12px',
    display: 'flex',
  },
  form: {
    width: '100%',
  },
  formGrid: {
    display: 'grid',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.9rem',
    color: '#a1a1aa',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
    minHeight: '100px',
  },
  dateRangeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '32px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #3a3a3a',
    color: '#a1a1aa',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 24px',
    backgroundColor: '#8b5cf6',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  submitIcon: {
    marginRight: '8px',
    display: 'flex',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '24px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.9rem',
  },
};

export default LeaveApplicationForm;