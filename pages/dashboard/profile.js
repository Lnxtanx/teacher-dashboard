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

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
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

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Profile = () => {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      fetchProfile(token);
    }
  }, [router]);
  
  const fetchProfile = async (token) => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setTeacher(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadProgress(0);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Using XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          setTeacher(prev => ({ ...prev, profileImage: data.imageUrl }));
          setUploading(false);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('POST', '/api/profile/upload-image');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  const navItems = [
      { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: false },
      { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: false },
      { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: false },
      { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: false },
      { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: false },
      { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: false },
      { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: false },
    ];

  return (
    <>
      <Head>
        <title>Profile | Teacher Portal</title>
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
          {/* Profile at the bottom - Active */}
          <div style={styles.profileSection}>
            <a 
              href="/dashboard/profile" 
              style={{...styles.profileLink, ...styles.activeNavLink}}
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
                  <span style={styles.titleIcon}><IconUser /></span>
                  Your Profile
                </h1>

                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{color: '#a1a1aa', marginTop: '16px'}}>Loading profile data...</p>
                  </div>
                ) : error ? (
                  <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                      onClick={() => fetchProfile(localStorage.getItem('token'))} 
                      style={styles.retryButton}
                    >
                      Try Again
                    </button>
                  </div>
                ) : !teacher ? (
                  <div style={styles.placeholderContainer}>
                    <span style={{color: '#6b7280', marginBottom: '16px'}}><IconUser /></span>
                    <p style={styles.placeholderText}>No profile data found</p>
                  </div>
                ) : (
                  <div style={styles.profileContent}>
                    {/* Profile Image Section */}
                    <div style={styles.profileImageSection}>
                      {teacher.profileImage ? (
                        <img 
                          src={teacher.profileImage} 
                          alt="Profile" 
                          style={styles.profileImage}
                        />
                      ) : (
                        <div style={styles.profileImagePlaceholder}>
                          <IconUser />
                        </div>
                      )}
                      
                      {uploading ? (
                        <div style={styles.progressContainer}>
                          <div style={styles.progressBar}>
                            <div 
                              style={{
                                ...styles.progressFill, 
                                width: `${uploadProgress}%` 
                              }}
                            ></div>
                          </div>
                          <p style={styles.progressText}>Uploading: {uploadProgress}%</p>
                        </div>
                      ) : (
                        <label style={styles.uploadButton} className="upload-button">
                          <span style={{marginRight: '8px', display: 'flex'}}>
                            <IconUpload />
                          </span>
                          Upload Photo
                          <input 
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={styles.hiddenInput}
                          />
                        </label>
                      )}
                    </div>
                    
                    {/* Profile Information Grid */}
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Name</h3>
                        <p style={styles.infoValue}>{teacher.teacherName || 'Not set'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Email</h3>
                        <p style={styles.infoValue}>{teacher.email || 'Not set'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Date of Birth</h3>
                        <p style={styles.infoValue}>
                          {teacher.dob ? new Date(teacher.dob).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Experience</h3>
                        <p style={styles.infoValue}>
                          {teacher.experience ? `${teacher.experience} years` : 'Not set'}
                        </p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Qualification</h3>
                        <p style={styles.infoValue}>{teacher.qualification || 'Not set'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Subject Assigned</h3>
                        <p style={styles.infoValue}>{teacher.subjectAssigned || 'Not set'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>Class Assigned</h3>
                        <p style={styles.infoValue}>{teacher.classAssigned || 'Not set'}</p>
                      </div>
                      <div style={styles.infoItem}>
                        <h3 style={styles.infoLabel}>School Name</h3>
                        <p style={styles.infoValue}>{teacher.school?.schoolName || 'Not set'}</p>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      style={styles.logoutButton}
                      className="logout-button"
                    >
                      <span style={{marginRight: '8px', display: 'flex'}}>
                        <IconLogout />
                      </span>
                      Logout
                    </button>
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
        
        .upload-button:hover {
          background-color: #7c3aed;
        }
        
        .back-button:hover {
          color: #a855f7;
        }
        
        .logout-button:hover {
          background-color: #dc2626;
        }
        
        .image-container:hover .image-overlay {
          opacity: 1;
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
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: '32px',
    textAlign: 'center',
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
    borderRadius: '4px',
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
  profileContent: {
    position: 'relative',
    padding: '16px',
  },
  profileImageSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #2a2a2a',
    marginBottom: '16px',
  },
  profileImagePlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    color: '#a1a1aa',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '0.875rem',
  },
  hiddenInput: {
    display: 'none',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  infoItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    padding: '16px',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    marginBottom: '8px',
  },
  infoValue: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#ffffff',
    wordBreak: 'break-word',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    maxWidth: '200px',
    margin: '0 auto',
  },
  progressContainer: {
    width: '100%',
    maxWidth: '300px',
    padding: '16px 0',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#3a3a3a',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    textAlign: 'center',
  },
};

export default Profile;