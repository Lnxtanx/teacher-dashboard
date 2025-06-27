import React, { useState, useRef, useEffect } from 'react';
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
} from '../../../component/icons/1';
import { getNavItems } from '../../../component/navItems';

export default function Chatbot() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const chatBoxRef = useRef(null);
    const textareaRef = useRef(null);

    // Load chat history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            try {
                setChatHistory(JSON.parse(savedHistory));
                setResponses(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Failed to parse chat history:', e);
            }
        }
        
        // Show greeting message if no history
        if (!savedHistory || JSON.parse(savedHistory).length === 0) {
            const initialMessage = { 
                role: 'bot', 
                text: "I'm Ekagrata. Hi there! How can I help you today?", 
                timestamp: new Date().toISOString() 
            };
            setResponses([initialMessage]);
            setChatHistory([initialMessage]);
            localStorage.setItem('chatHistory', JSON.stringify([initialMessage]));
        }
    }, []);

    // Save chat history to localStorage when it changes
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    const handleUserMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { 
            role: 'user', 
            text: message.trim(), 
            timestamp: new Date().toISOString() 
        };
        
        const newResponses = [...responses, userMessage];
        setResponses(newResponses);
        setChatHistory(newResponses);
        setMessage('');
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/chatbot/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage.text,
                    history: chatHistory.slice(-10) // Send last 10 messages for context
                }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            const botMessage = { 
                role: 'bot', 
                text: data.response, 
                timestamp: new Date().toISOString() 
            };
            
            const updatedResponses = [...newResponses, botMessage];
            setResponses(updatedResponses);
            setChatHistory(updatedResponses);
        } catch (err) {
            console.error('Error calling chatbot API:', err);
            setError('Failed to get response. Please try again.');
            const errorMessage = { 
                role: 'system', 
                text: 'Failed to get response. Please try again.', 
                timestamp: new Date().toISOString(),
                isError: true
            };
            setResponses([...newResponses, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear chat history
    const handleClearChat = () => {
        const confirmClear = window.confirm('Are you sure you want to clear the chat history?');
        if (confirmClear) {
            const initialMessage = { 
                role: 'bot', 
                text: 'Chat history cleared. How can I help you today?', 
                timestamp: new Date().toISOString() 
            };
            setResponses([initialMessage]);
            setChatHistory([initialMessage]);
            localStorage.setItem('chatHistory', JSON.stringify([initialMessage]));
        }
    };

    // Scroll to bottom on new message
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [responses]);

    // Focus on textarea when component mounts
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    // Auto expand textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [message]);

    // Submit on Enter (no Shift)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage(e);
        }
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format messages with markdown
    const formatMessage = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/``````/gs, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    };

    // Navigation items for sidebar
    const navItems = getNavItems('chatbot');

    return (
        <>
            <Head>
                <title>Ekagrata AI | Teacher Portal</title>
            </Head>

            <div style={styles.mainContainer}>
                {/* Side Navigation */}
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
                    {/* Mobile Header */}
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
                                        <span style={styles.titleIcon}><IconAI /></span>
                                        Ekagrata AI Assistant
                                    </h1>
                                    <div style={styles.headerButtons}>
                                        <button 
                                            onClick={handleClearChat} 
                                            style={styles.clearButton}
                                            className="clear-button"
                                        >
                                            Clear Chat
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.chatBoxContainer}>
                                    <div style={styles.chatBox} ref={chatBoxRef}>
                                        {responses.map((response, index) => (
                                            <div
                                                key={index}
                                                style={
                                                    response.role === 'user' 
                                                        ? styles.userMessage 
                                                        : response.role === 'system' 
                                                            ? {...styles.systemMessage, ...(response.isError ? styles.errorMessage : {})}
                                                            : styles.botMessage
                                                }
                                                className={`message ${response.role === 'user' ? 'user-message' : response.role === 'system' ? 'system-message' : 'bot-message'} ${response.isError ? 'error-message' : ''}`}
                                            >
                                                <div style={styles.messageContent}>
                                                    <div 
                                                        style={styles.messageText}
                                                        dangerouslySetInnerHTML={{ __html: formatMessage(response.text) }}
                                                    />
                                                    <div style={styles.messageTimestamp}>
                                                        {formatTimestamp(response.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {isLoading && (
                                            <div style={styles.botMessage} className="message bot-message typing-indicator">
                                                <div style={styles.dots}>
                                                    <span style={styles.dot}></span>
                                                    <span style={styles.dot}></span>
                                                    <span style={styles.dot}></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleUserMessage} style={styles.inputBar}>
                                        <div style={styles.inputWrapper}>
                                            <textarea
                                                ref={textareaRef}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type your message..."
                                                style={styles.chatInput}
                                                rows={1}
                                                disabled={isLoading}
                                            />
                                            <button 
                                                type="submit" 
                                                style={{...styles.sendButton, ...(isLoading || !message.trim() ? styles.sendButtonDisabled : {})}}
                                                disabled={isLoading || !message.trim()}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </div>
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
                
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .clear-button:hover {
                    background-color: #333;
                    color: #fff;
                }
                
                .back-button:hover {
                    color: #a855f7;
                }
                
                .user-message, .bot-message, .system-message {
                    animation: fadeIn 0.3s ease;
                }
                
                .dot:nth-child(1) { animation-delay: 0s; }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }
                
                @media (max-width: 768px) {
                    .sidebar {
                        left: -250px;
                    }
                    
                    .sidebar.open {
                        left: 0;
                    }
                    
                    .mobile-header {
                        display: flex !important;
                    }
                    
                    .contentWrapper {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </>
    );
}

const styles = {
    // Main layout styles
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
        zIndex: 1000,
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
        marginLeft: '250px',
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
        borderRadius: '12px',
        padding: '44px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    headerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
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
    headerButtons: {
        display: 'flex',
    },
    clearButton: {
        backgroundColor: 'transparent',
        color: '#aaa',
        border: '1px solid #444',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    
    // Chatbot specific styles
    chatBoxContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(80vh - 120px)',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
    },
    chatBox: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingBottom: '80px',  // Add padding to make room for input
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollBehavior: 'smooth',
    },
    userMessage: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '18px',
        backgroundColor: '#8050c7',
        color: 'white',
        alignSelf: 'flex-end',
        borderBottomRightRadius: '4px',
        fontSize: '15px',
        lineHeight: '1.5',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    botMessage: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '18px',
        backgroundColor: '#2a2a2a',
        color: 'white',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: '4px',
        fontSize: '15px',
        lineHeight: '1.5',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    systemMessage: {
        maxWidth: '90%',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: '#332b2b',
        color: '#ff9999',
        alignSelf: 'center',
        fontSize: '14px',
        textAlign: 'center',
    },
    errorMessage: {
        backgroundColor: '#3a2a2a',
    },
    messageContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    messageText: {
        marginBottom: '4px',
    },
    messageTimestamp: {
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.5)',
        alignSelf: 'flex-end',
        marginTop: '4px',
    },
    dots: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
    },
    dot: {
        display: 'block',
        width: '8px',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        animationName: 'dotBounce',
        animationDuration: '1.4s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
    },
    inputBar: {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        zIndex: 10,
    },
    inputWrapper: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#2c2c2c',
        borderRadius: '24px',
        border: '1px solid #444',
        padding: '4px 6px',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    },
    chatInput: {
        flex: 1,
        minHeight: '40px',
        maxHeight: '120px',
        padding: '10px 16px',
        fontSize: '15px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        lineHeight: '1.5',
        fontFamily: 'inherit',
    },
    sendButton: {
        backgroundColor: '#a855f7',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '4px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    sendButtonDisabled: {
        backgroundColor: '#555',
        color: '#888',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
};