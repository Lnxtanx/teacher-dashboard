import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>Teacher Management System</title>
        <meta name="description" content="Comprehensive teacher management system for educational institutions" />
        {/* Font links moved to _document.js as recommended by Next.js */}
      </Head>

      <div className="page-container">
        {/* Navigation */}
        <nav className="main-nav">
          <div className="nav-container">
            <div className="nav-content">
              <div className="logo-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="logo-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="logo-text">Teacher Management System</span>
              </div>
              <div className="nav-buttons">
                <button
                  onClick={handleLoginClick}
                  className="login-button"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <main className="hero-main">
                <div className="hero-text">
                  <h1 className="hero-heading">
                    <span className="hero-heading-block">Streamline</span>{' '}
                    <span className="hero-heading-highlight">Teacher Management</span>
                  </h1>
                  <p className="hero-description">
                    The comprehensive platform designed to simplify teacher administration,
                    performance tracking, and educational resource management.
                  </p>
                  <div className="hero-buttons">
                    <div className="hero-button-primary-container">
                      <button
                        onClick={handleLoginClick}
                        className="hero-button-primary"
                      >
                        Get Started
                      </button>
                    </div>
                    <div className="hero-button-secondary-container">
                      <a
                        href="#features"
                        className="hero-button-secondary"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-gradient"></div>
            <div className="hero-image">
              <svg xmlns="http://www.w3.org/2000/svg" className="hero-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-subtitle">Features</h2>
              <p className="features-title">
                Everything you need to manage teachers effectively
              </p>
              <p className="features-description">
                Our platform provides comprehensive tools for educational institutions to streamline teacher management.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Teacher Profiles</h3>
                  <p className="feature-description">
                    Manage comprehensive teacher profiles including qualifications, subjects, and performance metrics.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Performance Analytics</h3>
                  <p className="feature-description">
                    Track and analyze teacher performance with comprehensive analytics and reporting tools.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Schedule Management</h3>
                  <p className="feature-description">
                    Efficiently manage teaching schedules, assignments, and classroom allocations.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Document Management</h3>
                  <p className="feature-description">
                    Securely store and manage teacher documents, certifications, and administrative files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-container">
            <h2 className="cta-heading">
              <span className="cta-heading-block">Ready to get started?</span>
              <span className="cta-heading-highlight">Login to your account today.</span>
            </h2>
            <div className="cta-button-container">
              <div className="cta-button-wrapper">
                <button
                  onClick={handleLoginClick}
                  className="cta-button"
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-logo">
                <svg xmlns="http://www.w3.org/2000/svg" className="footer-logo-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="footer-logo-text">Teacher management system </span>
              </div>
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} Teacher management system. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #111827;
        }
      `}</style>

      <style jsx>{`
        /* General Page Styles */
        .page-container {
          min-height: 100vh;
          background-color: #111827;
          color: white;
        }

        /* Navigation Styles */
        .main-nav {
          background-color: #1f2937;
          border-bottom: 1px solid #374151;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        @media (min-width: 640px) {
          .nav-container {
            padding: 0 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .nav-container {
            padding: 0 2rem;
          }
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo-icon {
          height: 2rem;
          width: 2rem;
          color: #8b5cf6;
        }

        .logo-text {
          margin-left: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .nav-buttons {
          display: flex;
        }

        .login-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          background-color: #8b5cf6;
          color: white;
          font-weight: 500;
          transition: background-color 0.2s;
          border: none;
          cursor: pointer;
        }

        .login-button:hover {
          background-color: #7c3aed;
        }

        .login-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px #111827, 0 0 0 4px #8b5cf6;
        }

        /* Hero Section Styles */
        .hero-section {
          position: relative;
          background-color: #111827;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          padding-bottom: 2rem;
          background-color: #111827;
        }

        @media (min-width: 640px) {
          .hero-content {
            padding-bottom: 4rem;
          }
        }

        @media (min-width: 768px) {
          .hero-content {
            padding-bottom: 5rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-content {
            max-width: 42rem;
            width: 100%;
            padding-bottom: 7rem;
          }
        }

        @media (min-width: 1280px) {
          .hero-content {
            padding-bottom: 8rem;
          }
        }

        .hero-main {
          margin-top: 2.5rem;
          margin-left: auto;
          margin-right: auto;
          max-width: 1280px;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .hero-main {
            margin-top: 3rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .hero-main {
            margin-top: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-main {
            margin-top: 5rem;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1280px) {
          .hero-main {
            margin-top: 7rem;
          }
        }

        .hero-text {
          text-align: center;
        }

        @media (min-width: 1024px) {
          .hero-text {
            text-align: left;
          }
        }

        .hero-heading {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: white;
        }

        @media (min-width: 640px) {
          .hero-heading {
            font-size: 3rem;
          }
        }

        @media (min-width: 768px) {
          .hero-heading {
            font-size: 3.75rem;
          }
        }

        .hero-heading-block {
          display: block;
        }

        @media (min-width: 1280px) {
          .hero-heading-block {
            display: inline;
          }
        }

        .hero-heading-highlight {
          display: block;
          color: #8b5cf6;
        }

        @media (min-width: 1280px) {
          .hero-heading-highlight {
            display: inline;
          }
        }

        .hero-description {
          margin-top: 0.75rem;
          font-size: 1rem;
          color: #d1d5db;
        }

        @media (min-width: 640px) {
          .hero-description {
            margin-top: 1.25rem;
            font-size: 1.125rem;
            max-width: 36rem;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (min-width: 768px) {
          .hero-description {
            margin-top: 1.25rem;
            font-size: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-description {
            margin-left: 0;
          }
        }

        .hero-buttons {
          margin-top: 1.25rem;
        }

        @media (min-width: 640px) {
          .hero-buttons {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
          }
        }

        @media (min-width: 1024px) {
          .hero-buttons {
            justify-content: flex-start;
          }
        }

        .hero-button-primary-container {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border-radius: 0.375rem;
        }

        .hero-button-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2rem;
          border: 1px solid transparent;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 0.375rem;
          color: white;
          background-color: #8b5cf6;
          transition: background-color 0.2s;
          cursor: pointer;
        }

        .hero-button-primary:hover {
          background-color: #7c3aed;
        }

        @media (min-width: 768px) {
          .hero-button-primary {
            padding: 1rem 2.5rem;
            font-size: 1.125rem;
          }
        }

        .hero-button-secondary-container {
          margin-top: 0.75rem;
        }

        @media (min-width: 640px) {
          .hero-button-secondary-container {
            margin-top: 0;
            margin-left: 0.75rem;
          }
        }

        .hero-button-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2rem;
          border: 1px solid transparent;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 0.375rem;
          color: #8b5cf6;
          background-color: #1f2937;
          transition: background-color 0.2s;
          text-decoration: none;
        }

        .hero-button-secondary:hover {
          background-color: #374151;
        }

        @media (min-width: 768px) {
          .hero-button-secondary {
            padding: 1rem 2.5rem;
            font-size: 1.125rem;
          }
        }

        .hero-image-container {
          display: none;
        }

        @media (min-width: 1024px) {
          .hero-image-container {
            display: block;
            position: absolute;
            inset: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 50%;
          }
        }

        .hero-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #111827, transparent);
        }

        .hero-image {
          height: 14rem;
          width: 100%;
          background-color: #1f2937;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .hero-image {
            height: 18rem;
          }
        }

        @media (min-width: 768px) {
          .hero-image {
            height: 24rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-image {
            width: 100%;
            height: 100%;
            padding: 2.5rem;
          }
        }

        .hero-svg {
          height: 100%;
          width: 100%;
          color: #374151;
          opacity: 0.3;
        }

        /* Features Section Styles */
        .features-section {
          padding-top: 3rem;
          padding-bottom: 3rem;
          background-color: #1f2937;
        }

        @media (min-width: 1024px) {
          .features-section {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }

        .features-container {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .features-container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .features-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        .features-header {
          margin-bottom: 2.5rem;
        }

        @media (min-width: 1024px) {
          .features-header {
            text-align: center;
          }
        }

        .features-subtitle {
          font-size: 1rem;
          color: #a78bfa;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }

        .features-title {
          margin-top: 0.5rem;
          font-size: 1.875rem;
          line-height: 2rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: white;
        }

        @media (min-width: 640px) {
          .features-title {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
        }

        .features-description {
          margin-top: 1rem;
          max-width: 42rem;
          font-size: 1.25rem;
          color: #d1d5db;
        }

        @media (min-width: 1024px) {
          .features-description {
            margin-left: auto;
            margin-right: auto;
          }
        }

        .features-grid {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        @media (min-width: 768px) {
          .features-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2rem 2rem;
          }
        }

        .feature-item {
          position: relative;
        }

        .feature-icon-container {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 3rem;
          width: 3rem;
          border-radius: 0.375rem;
          background-color: #8b5cf6;
          color: white;
        }

        .feature-icon {
          height: 1.5rem;
          width: 1.5rem;
        }

        .feature-content {
          margin-left: 4rem;
        }

        .feature-title {
          font-size: 1.125rem;
          line-height: 1.5rem;
          font-weight: 500;
          color: white;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }

        .feature-description {
          margin-top: 0.5rem;
          font-size: 1rem;
          color: #d1d5db;
        }

        /* CTA Section Styles */
        .cta-section {
          background-color: #111827;
        }

        .cta-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        @media (min-width: 640px) {
          .cta-container {
            padding: 3rem 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .cta-container {
            padding: 4rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }

        .cta-heading {
          font-size: 1.875rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: white;
        }

        @media (min-width: 640px) {
          .cta-heading {
            font-size: 2.25rem;
          }
        }

        .cta-heading-block {
          display: block;
        }

        .cta-heading-highlight {
          display: block;
          color: #a78bfa;
        }

        .cta-button-container {
          margin-top: 2rem;
        }

        @media (min-width: 1024px) {
          .cta-button-container {
            margin-top: 0;
            flex-shrink: 0;
          }
        }

        .cta-button-wrapper {
          display: inline-flex;
          border-radius: 0.375rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.25rem;
          border: 1px solid transparent;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 0.375rem;
          color: white;
          background-color: #8b5cf6;
          transition: background-color 0.2s;
          cursor: pointer;
        }

        .cta-button:hover {
          background-color: #7c3aed;
        }

        /* Footer Styles */
        .footer {
          background-color: #1f2937;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        @media (min-width: 640px) {
          .footer-container {
            padding: 3rem 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .footer-container {
            padding: 2rem 2rem;
          }
        }

        .footer-content {
          display: block;
        }

        @media (min-width: 768px) {
          .footer-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
        }

        .footer-logo-icon {
          height: 2rem;
          width: 2rem;
          color: #8b5cf6;
        }

        .footer-logo-text {
          margin-left: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }

        .footer-copyright {
          margin-top: 1rem;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        @media (min-width: 768px) {
          .footer-copyright {
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
}
export default Home;
