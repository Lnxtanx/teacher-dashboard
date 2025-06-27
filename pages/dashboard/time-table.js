import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuthHeaders } from '../../lib/authUtils';
import Head from 'next/head';
import { IconCalendar, IconUpload, IconHome, IconChevronLeft, IconEvent, IconAI, IconTeach, IconRecords, IconLogout, IconLeave, IconUser } from '../../component/icons/1';
import { getNavItems } from '../../component/navItems';

const TimeTable = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch timetable image
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch('/api/timetable/get', {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          if (response.status === 404) {
            setImageUrl(null);
            return;
          }
          throw new Error('Failed to fetch timetable');
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      handleUpload(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
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
          setImageUrl(data.url);
          setSelectedFile(null);
          setUploading(false);
          alert('Timetable uploaded successfully!');
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('POST', '/api/timetable/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading timetable:', error);
      alert('Failed to upload timetable. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl || !confirm('Are you sure you want to delete your timetable?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/timetable/delete', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      setImageUrl(null);
      alert('Timetable deleted successfully');
    } catch (error) {
      console.error('Error deleting timetable:', error);
      alert('Failed to delete timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navItems = getNavItems('time-table');
  return (
    <>
      <Head>
        <title>Timetable | Teacher Portal</title>
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
                  <span style={styles.titleIcon}><IconCalendar /></span>
                  Your Timetable
                </h1>

                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                  </div>
                ) : imageUrl ? (
                  <div style={styles.imageContainer} className="image-container">
                    <Image 
                      src={imageUrl} 
                      alt="Timetable" 
                      width={600}
                      height={400}
                      style={styles.timetableImage}
                    />
                    <div style={styles.imageOverlay} className="image-overlay">
                      <button 
                        onClick={handleDelete} 
                        style={styles.deleteButton}
                        className="delete-button"
                      >
                        <span style={{marginRight: '8px', display: 'flex'}}>
                          Delete Timetable
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.placeholderContainer}>
                    <span style={{color: '#6b7280', marginBottom: '16px'}}><IconCalendar /></span>
                    <p style={styles.placeholderText}>No timetable uploaded yet</p>
                    <p style={styles.placeholderSubtext}>Upload your timetable image below</p>
                  </div>
                )}

                <div style={styles.uploadSection}>
                  <div style={styles.uploadCard}>
                    <h3 style={styles.uploadTitle}>Upload New Timetable</h3>
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
                      <div style={styles.uploadControls} className="upload-controls">
                        <label style={styles.fileInputLabel} className="file-input-label">
                          <span style={{marginRight: '8px', display: 'flex'}}>
                            <IconUpload />
                          </span>
                          {selectedFile ? selectedFile.name : "Choose File"}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={styles.hiddenInput} 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
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
    justifyContent: 'center',
    padding: '48px 0',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(0, 0, 0, 0.1)',
    borderTop: '3px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '24px',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  timetableImage: {
    width: '100%',
    display: 'block',
    borderRadius: '8px',
    border: '2px solid #2a2a2a',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
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
    marginBottom: '8px',
  },
  placeholderSubtext: {
    fontSize: '0.875rem',
    color: '#71717a',
  },
  uploadSection: {
    marginTop: '32px',
  },
  uploadCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '16px',
  },
  uploadTitle: {
    fontSize: '1.125rem',
    fontWeight: '500',
    marginBottom: '16px',
    color: '#e4e4e7',
  },
  uploadControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3a3a',
    border: '1px solid #4a4a4a',
    borderRadius: '6px',
    padding: '12px',
    cursor: 'pointer',
    color: '#e4e4e7',
    transition: 'background-color 0.2s ease',
  },
  hiddenInput: {
    display: 'none',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  progressContainer: {
    padding: '12px 0',
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
    margin: '4px 0',
  },
  // Add media queries for responsiveness
  '@media (max-width: 768px)': {
    sidebar: {
      position: 'fixed',
      left: '-250px',
      transition: 'left 0.3s ease',
    },
    contentWrapper: {
      marginLeft: 0,
    },
    mobileHeader: {
      display: 'flex',
    },
  }
};

export default TimeTable;