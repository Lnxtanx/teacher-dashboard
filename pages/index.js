import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#0d0d0d', 
      color: 'white', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        👨‍🏫 Welcome to the Teacher Panel
      </h1>

      <p style={{ marginBottom: '1rem' }}>
        This is a simple dashboard interface for teachers. The login functionality will be implemented on this page soon.
      </p>

      <p style={{ marginBottom: '2rem' }}>
        For now, you can directly access the main dashboard using the button below.
      </p>

      <Link 
        href="/dashboard/dashboard" 
        style={{
          display: 'inline-block',
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        🚀 Go to Dashboard
      </Link>
    </div>
  );
}
