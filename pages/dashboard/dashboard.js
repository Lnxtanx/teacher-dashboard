import React, { useEffect, useState } from 'react';
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
} from '../../component/icons/1';

const Dashboard = () => {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      fetchTeacherData(token);
      
      // Load todos from localStorage
      const savedTodos = localStorage.getItem('teacherTodos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }

      // Load demo data
      loadDemoData();
    }
    
    // Update date and time
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    // Fetch weather data based on user location
    getUserLocationAndWeather();
    
    return () => clearInterval(interval);
  }, [router]);
  
  const updateDateTime = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    setCurrentDateTime(now.toLocaleDateString('en-US', options));
  };
  
  const fetchTeacherData = async (token) => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
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
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocationAndWeather = () => {
    setWeatherLoading(true);
    
    // Check if geolocation is available in the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully got coordinates
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default weather if location is not available
          fetchWeatherData(null, null);
          setWeatherLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      // Fallback to default weather
      fetchWeatherData(null, null);
      setWeatherLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      let weatherApiUrl;
      
      if (latitude && longitude) {
        // If we have coordinates, use them to get location-specific weather
        weatherApiUrl = `/api/weather?lat=${latitude}&lon=${longitude}`;
      } else {
        // Fallback to a default location
        weatherApiUrl = '/api/weather';
      }
      
      const response = await fetch(weatherApiUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setWeather({
        city: data.city || 'Unknown Location',
        temperature: data.temperature || 28,
        condition: data.condition || 'Sunny',
        humidity: data.humidity || 65,
        windSpeed: data.windSpeed || 12,
        icon: data.icon || '☀️'
      });
    } catch (err) {
      console.error('Error fetching weather data:', err);
      // Set default weather data if API fails
      setWeather({
        city: 'Unknown Location',
        temperature: 28,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        icon: '☀️'
      });
    } finally {
      setWeatherLoading(false);
    }
  };
  
 const loadDemoData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/announcement', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch announcements');
    
    const json = await response.json();
    if (json.success) {
      setAnnouncements(json.data.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        date: new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      })));
    } else {
      console.warn('Announcement fetch unsuccessful:', json.message);
    }
  } catch (err) {
    console.error('Error loading announcements:', err.message);
  }
};

  
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const updatedTodos = [...todos, { 
      id: Date.now(), 
      text: newTodo, 
      completed: false 
    }];
    
    setTodos(updatedTodos);
    localStorage.setItem('teacherTodos', JSON.stringify(updatedTodos));
    setNewTodo('');
  };
  
  const toggleTodoCompletion = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updatedTodos);
    localStorage.setItem('teacherTodos', JSON.stringify(updatedTodos));
  };
  
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('teacherTodos', JSON.stringify(updatedTodos));
  };

  const navItems = [
    { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: true },
    { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: false },
    { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: false },
    { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: false },
    { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: false },
    { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: false },
    { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: false },
  ];

  // Dashboard tabs
  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 'todos':
        return (
          <div style={styles.todoCard}>
            <div style={styles.todoForm}>
              <input 
                type="text" 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..."
                style={styles.todoInput}
              />
              <button 
                onClick={addTodo}
                style={styles.addButton}
              >
                Add
              </button>
            </div>
            
            <ul style={styles.todoList}>
              {todos.length === 0 ? (
                <li style={styles.emptyTodo}>No tasks yet. Add one above!</li>
              ) : (
                todos.map(todo => (
                  <li key={todo.id} style={styles.todoItem}>
                    <div style={styles.todoContent}>
                      <input 
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoCompletion(todo.id)}
                        style={styles.todoCheckbox}
                      />
                      <span style={{
                        ...styles.todoText,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#a1a1aa' : '#e4e4e7'
                      }}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      style={styles.deleteButton}
                    >
                      ×
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      
      case 'announcements':
        return (
          <div style={styles.tabContent}>
            <h3 style={styles.tabContentTitle}>School Announcements</h3>
            {announcements.length === 0 ? (
              <p style={styles.emptyState}>No announcements at this time.</p>
            ) : (
              <div style={styles.announcementsContainer}>
                {announcements.map(announcement => (
                  <div key={announcement.id} style={styles.announcementCard}>
                    <div style={styles.announcementHeader}>
                      <h4 style={styles.announcementTitle}>{announcement.title}</h4>
                      <span style={styles.announcementDate}>{announcement.date}</span>
                    </div>
                    <p style={styles.announcementContent}>{announcement.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Teacher Portal</title>
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
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={{color: '#a1a1aa', marginTop: '16px'}}>Loading dashboard...</p>
                </div>
              ) : (
                <>
                  {/* Top Section with Greeting and Weather */}
                  <div style={styles.topSection}>
                    {/* Greeting Card */}
                    <div style={styles.greetingCard}>
                      <div style={styles.greetingContent}>
                        <h1 style={styles.greeting}>
                          Hello, {teacher?.teacherName || 'Teacher'}
                        </h1>
                        <p style={styles.welcomeText}>Welcome to your teaching dashboard</p>
                        <p style={styles.dateText}>{currentDateTime}</p>
                      </div>
                    </div>

                    {/* Weather Card */}
                    <div style={styles.weatherCard}>
                      {weatherLoading ? (
                        <div style={styles.weatherLoading}>
                          <div style={styles.loadingSpinnerSmall}></div>
                          <p>Loading weather data...</p>
                        </div>
                      ) : (
                        <>
                          <div style={styles.weatherHeader}>
                            <h3 style={styles.weatherCity}>{weather.city}</h3>
                            <div style={styles.weatherIconLarge}>{weather.icon}</div>
                          </div>
                          <div style={styles.weatherInfo}>
                            <div style={styles.temperature}>
                              <span style={styles.tempValue}>{weather.temperature}°C</span>
                              <span style={styles.tempCondition}>{weather.condition}</span>
                            </div>
                            <div style={styles.weatherDetails}>
                              <div style={styles.weatherDetail}>
                                <span style={styles.detailLabel}>Humidity</span>
                                <span style={styles.detailValue}>{weather.humidity}%</span>
                              </div>
                              <div style={styles.weatherDetail}>
                                <span style={styles.detailLabel}>Wind</span>
                                <span style={styles.detailValue}>{weather.windSpeed} km/h</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Content Tabs Section */}
                  <div style={styles.tabsContainer}>
                    <div style={styles.tabs}>
                      <button 
                        style={activeTab === 'todos' ? 
                          {...styles.tabButton, ...styles.activeTabButton} : 
                          styles.tabButton}
                        onClick={() => setActiveTab('todos')}
                      >
                        To-Do List
                      </button>
                      <button 
                        style={activeTab === 'announcements' ? 
                          {...styles.tabButton, ...styles.activeTabButton} : 
                          styles.tabButton}
                        onClick={() => setActiveTab('announcements')}
                      >
                        Announcements
                      </button>
                    </div>
                    <div style={styles.tabContentWrapper}>
                      {renderActiveTabContent()}
                    </div>
                  </div>
                </>
              )}
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
        
        @media (max-width: 1024px) {
          .sidebar {
            left: -250px;
            z-index: 100;
          }
          
          .sidebar.open {
            left: 0;
          }
          
          .mobile-header {
            display: flex !important;
          }
        }
        
        @media (max-width: 768px) {
          .topSection {
            flex-direction: column !important;
          }
          
          .greetingCard, .weatherCard {
            width: 100% !important;
          }
          
          .tabs {
            overflow-x: auto;
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
    maxWidth: '1200px',
    margin: '0 auto',
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
  loadingSpinnerSmall: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTop: '2px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '8px'
  },
  // Top section with greeting and weather
  topSection: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
  },
  greetingCard: {
    flex: '2',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  greetingContent: {
    position: 'relative',
    zIndex: '2',
  },
  greeting: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: '8px',
  },
  welcomeText: {
    fontSize: '1.1rem',
    color: '#e4e4e7',
    marginBottom: '16px',
  },
  dateText: {
    fontSize: '0.9rem',
    color: '#a1a1aa',
  },
  weatherCard: {
    flex: '1',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  weatherLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#a1a1aa',
  },
  weatherHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  weatherCity: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#e4e4e7',
    margin: '0',
  },
  weatherIconLarge: {
    fontSize: '2.5rem',
  },
  weatherInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  temperature: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  tempValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#a855f7',
  },
  tempCondition: {
    fontSize: '1rem',
    color: '#a1a1aa',
  },
  weatherDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #2a2a2a',
    paddingTop: '16px',
  },
  weatherDetail: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '0.8rem',
    color: '#a1a1aa',
    marginBottom: '4px',
  },
  detailValue: {
    fontSize: '1.1rem',
    color: '#e4e4e7',
    fontWeight: '500',
  },
  // Tabs section
  tabsContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #2a2a2a',
  },
  tabButton: {
    padding: '16px 24px',
    backgroundColor: 'transparent',
    color: '#a1a1aa',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    flex: '1',
    transition: 'all 0.2s ease',
  },
  activeTabButton: {
    backgroundColor: '#2a2a2a',
    color: '#a855f7',
    borderBottom: '2px solid #a855f7',
  },
  tabContentWrapper: {
    padding: '24px',
  },
  tabContent: {},
  tabContentTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: '20px',
  },
  // Todo list styles
  todoCard: {},
  todoForm: {
    display: 'flex',
    marginBottom: '20px',
  },
  todoInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#e4e4e7',
    border: 'none',
    borderRadius: '8px 0 0 8px',
    padding: '12px 16px',
    fontSize: '1rem',
    outline: 'none',
  },
  addButton: {
    backgroundColor: '#a855f7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    padding: '0 16px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  todoList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 8px',
    borderBottom: '1px solid #2a2a2a',
    transition: 'background-color 0.2s ease',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  todoCheckbox: {
    height: '18px',
    width: '18px',
    marginRight: '12px',
    cursor: 'pointer',
  },
  todoText: {
    fontSize: '1rem',
    color: '#e4e4e7',
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#a1a1aa',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyTodo: {
    padding: '20px',
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: '0.9rem',
  },
  // Announcements tab styles
  announcementsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  announcementCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '16px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  announcementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  announcementTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e4e4e7',
    margin: '0',
  },
  announcementDate: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    color: '#a855f7',
    fontSize: '0.8rem',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  announcementContent: {
    fontSize: '0.95rem',
    color: '#e4e4e7',
    lineHeight: '1.5',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: '0.9rem',
  },
};

export default Dashboard;