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
  IconChevronLeft
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
  contentContainer: {
    flex: 1,
    marginLeft: '250px',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#e4e4e7',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    padding: '8px',
    borderRadius: '4px',
    marginRight: '16px',
    '&:hover': {
      backgroundColor: '#2a2a2a',
    },
  },
  previewContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '24px',
    marginTop: '24px',
  },
  previewHeader: {
    marginBottom: '24px',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '16px',
  },
  previewTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: '8px',
  },
  detailRow: {
    display: 'flex',
    marginBottom: '16px',
    gap: '24px',
  },
  detailLabel: {
    color: '#71717a',
    width: '120px',
  },
  detailValue: {
    color: '#e4e4e7',
    flex: 1,
  },
  imageContainer: {
    marginTop: '24px',
  },
  responseImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
  }
};

const ClassPreview = () => {
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!router.query.id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/class-response/get?id=${router.query.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await res.json();
        if (data.success) {
          setResponse(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch response');
        }
      } catch (err) {
        console.error('Error fetching response:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [router.query.id]);

  const handleBack = () => {
    router.push('/dashboard/dashboard');
  };

  if (loading) {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          <div>No response found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <Head>
        <title>Class Response Preview</title>
      </Head>

      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={handleBack}>
            <IconChevronLeft />
            <span style={{ marginLeft: '8px' }}>Back to Dashboard</span>
          </button>
        </div>

        <div style={styles.previewContainer}>
          <div style={styles.previewHeader}>
            <h1 style={styles.previewTitle}>Class Response Details</h1>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Class Level:</span>
            <span style={styles.detailValue}>{response.classLevel}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Lesson Name:</span>
            <span style={styles.detailValue}>{response.lessonName}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status:</span>
            <span style={styles.detailValue}>{response.status}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Submission Date:</span>
            <span style={styles.detailValue}>
              {new Date(response.submittedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {response.reason && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Reason:</span>
              <span style={styles.detailValue}>{response.reason}</span>
            </div>
          )}

          {response.imageUrl && (
            <div style={styles.imageContainer}>
              <img
                src={response.imageUrl}
                alt="Class Response"
                style={styles.responseImage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPreview;
