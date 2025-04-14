// pages/dashboard/dashboard.js
import Link from 'next/link';

const Dashboard = () => {
  const navItems = [
    { label: 'Time Table', href: '/dashboard/time-table' },
    { label: 'Lesson Log', href: '/lesson-log/1' },
    { label: 'Completed Class', href: '/class-response/class-completed' },
    { label: 'Event Planner', href: '/event-leave/event-dashboard' },
    { label: 'Leave & Break', href: '/event-leave/leave-dashboard' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.navList}>
          {navItems.map((item, idx) => (
            <Link href={item.href} key={idx} style={styles.navItem}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/dashboard/profile" style={styles.profile}>
          <div style={styles.profileCircle}>N</div>
          Profile
        </Link>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.screen}>
          <p style={styles.text}>
            Welcome to the Teacher Dashboard. Choose an option from the left to get started.
          </p>
        </div>
        <button style={styles.button} onClick={() => alert('Starting Lesson...')}>
          start lesson
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial',
    backgroundColor: '#121212',
    color: '#ffffff',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem',
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
    boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
  },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  navItem: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#2c2c2c',
    transition: 'background 0.3s',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    color: '#ccc',
    textDecoration: 'none',
    padding: '0.5rem',
    borderTop: '1px solid #444',
  },
  profileCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    position: 'relative',
  },
  screen: {
    backgroundColor: '#000',
    color: 'violet',
    padding: '2rem',
    borderRadius: '1rem',
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  text: {
    color: 'violet',
  },
  button: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#dad1ff',
    color: '#000',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '1rem',
    cursor: 'pointer',
  },
};

export default Dashboard;
