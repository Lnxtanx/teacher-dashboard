import React, { useEffect, useRef, useState, useCallback } from 'react';

const PDFViewer = ({ pdfUrl, initialPage = 1, initialScale = 1.5 }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(initialScale);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInputValue, setPageInputValue] = useState(initialPage.toString());
  const [rotation, setRotation] = useState(0);
  const [fitToWidth, setFitToWidth] = useState(false);
  
  // Reference to track current render task
  const currentRenderTaskRef = useRef(null);
  
  // Load PDF document when URL changes
  useEffect(() => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      setLoading(false);
      return;
    }

    const loadPDF = async () => {
      try {
        setLoading(true);
        
        // Load PDF.js if it's not already loaded
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          setError('PDF.js library not found. Make sure to include it in your project.');
          return;
        }

        // Set worker source - FIX: Add proper worker source configuration
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.js';
        }

        // Load the PDF document with better error handling
        const loadingTask = pdfjsLib.getDocument({
          url: encodeURI(pdfUrl),
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
          cMapPacked: true,
        });
        
        // Add password handling
        loadingTask.onPassword = (updateCallback, reason) => {
          const password = prompt('This PDF is password protected. Please enter the password:');
          updateCallback(password);
        };
        
        try {
          const pdf = await loadingTask.promise;        
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          
          // Ensure currentPage is within valid range
          if (initialPage > pdf.numPages) {
            setCurrentPage(1);
            setPageInputValue('1');
          }
          
          setError(null);
        } catch (err) {
          console.error('Error loading PDF:', err);
          setError(`Failed to load PDF: ${err.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(`Failed to load PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
    
    // Cleanup function
    return () => {
      // Cancel any ongoing render task
      if (currentRenderTaskRef.current) {
        currentRenderTaskRef.current.cancel();
        currentRenderTaskRef.current = null;
      }
      
      // Clean up PDF document - FIX: Use optional chaining to prevent errors
      if (pdfDoc) {
        pdfDoc?.destroy?.()?.catch?.(err => 
          console.error('Error destroying PDF document:', err)
        );
      }
    };
  }, [pdfUrl, initialPage]);

  // Calculate proper scale for fit-to-width
  const calculateFitToWidthScale = useCallback(async (page) => {
    if (!page || !containerRef.current) return scale;
    
    const viewport = page.getViewport({ scale: 1.0, rotation });
    const containerWidth = containerRef.current.clientWidth - 32; // Subtract padding
    return containerWidth / viewport.width;
  }, [rotation, scale]);

  // Render current page - FIX: Improved error handling and null checks
  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async () => {
      try {
        setLoading(true);
        
        // Ensure canvas exists - FIX: Add null check for canvas
        if (!canvasRef.current) {
          console.warn('Canvas reference is null, cannot render PDF');
          return;
        }
        
        // Cancel any ongoing render task before starting a new one
        if (currentRenderTaskRef.current) {
          currentRenderTaskRef.current.cancel();
          currentRenderTaskRef.current = null;
        }
        
        // Get the page with error handling
        let page;
        try {
          page = await pdfDoc.getPage(currentPage);
        } catch (err) {
          console.error('Error getting PDF page:', err);
          setError(`Failed to get page ${currentPage}: ${err.message}`);
          return;
        }
        
        // Calculate scale if fitToWidth is enabled
        let currentScale = scale;
        if (fitToWidth) {
          currentScale = await calculateFitToWidthScale(page);
        }
        
        // Set the viewport with rotation
        const viewport = page.getViewport({ scale: currentScale, rotation });
        const canvas = canvasRef.current;
        
        // FIX: Add null check for canvas again
        if (!canvas) {
          console.error('Canvas is no longer available');
          return;
        }
        
        // Get canvas context with error handling
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) {
          setError('Failed to get canvas rendering context');
          return;
        }
        
        // Clear previous content
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set canvas dimensions to match the viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Use device pixel ratio for higher quality rendering
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';
        
        // Scale the context
        context.scale(outputScale, outputScale);
        
        // Render the PDF page with better render options
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          enableWebGL: true,
          renderInteractiveForms: true,
        };
        
        // Store the render task so we can cancel it if needed
        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;
        
        await renderTask.promise;
        currentRenderTaskRef.current = null;
        setError(null);
      } catch (err) {
        // Ignore cancelled task errors
        if (err && err.message !== 'Rendering cancelled') {
          console.error('Error rendering PDF page:', err);
          setError(`Failed to render page ${currentPage}: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    renderPage();
    
    // Cleanup on component unmount or page change
    return () => {
      if (currentRenderTaskRef.current) {
        currentRenderTaskRef.current.cancel();
        currentRenderTaskRef.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale, rotation, fitToWidth, calculateFitToWidthScale]);

  // Handle window resize for fit-to-width mode
  useEffect(() => {
    if (!fitToWidth) return;
    
    const handleResize = () => {
      if (pdfDoc) {
        // Debounce resize handling to avoid too many renders
        if (window.resizeTimeout) {
          clearTimeout(window.resizeTimeout);
        }
        
        window.resizeTimeout = setTimeout(() => {
          pdfDoc.getPage(currentPage).then(page => {
            calculateFitToWidthScale(page).then(newScale => {
              setScale(newScale);
            });
          }).catch(err => {
            console.error('Error adjusting scale on resize:', err);
          });
        }, 200);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
      }
    };
  }, [pdfDoc, currentPage, fitToWidth, calculateFitToWidthScale]);

  // Navigation functions
  const goToPage = useCallback((pageNum) => {
    const targetPage = Math.max(1, Math.min(pageNum, numPages));
    
    // Only update if we're actually changing pages
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
      setPageInputValue(targetPage.toString());
    }
  }, [numPages, currentPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(numPages);
  }, [goToPage, numPages]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prevScale => {
      const newScale = Math.min(prevScale + 0.25, 5);
      setFitToWidth(false);
      return newScale;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prevScale => {
      const newScale = Math.max(prevScale - 0.25, 0.25);
      setFitToWidth(false);
      return newScale;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
    setFitToWidth(false);
  }, [initialScale]);

  const toggleFitToWidth = useCallback(() => {
    setFitToWidth(prev => !prev);
    if (!fitToWidth && pdfDoc) {
      // If enabling fit to width, calculate the scale
      pdfDoc.getPage(currentPage).then(page => {
        calculateFitToWidthScale(page).then(newScale => {
          setScale(newScale);
        });
      }).catch(err => {
        console.error('Error calculating fit to width scale:', err);
      });
    }
  }, [fitToWidth, pdfDoc, currentPage, calculateFitToWidthScale]);

  // Rotation functions
  const rotateClockwise = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const rotateCounterClockwise = useCallback(() => {
    setRotation(prev => (prev - 90 + 360) % 360);
  }, []);

  // Handle direct page input
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const pageNumber = parseInt(pageInputValue, 10);
    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      goToPage(pageNumber);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePageInputBlur();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard events if the viewer is focused
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          goToNextPage();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'Home':
          e.preventDefault();
          goToFirstPage();
          break;
        case 'End':
          e.preventDefault();
          goToLastPage();
          break;
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          if (e.ctrlKey) {
            e.preventDefault();
            resetZoom();
          }
          break;
        case 'r':
          if (e.ctrlKey) {
            e.preventDefault();
            rotateClockwise();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPreviousPage, goToFirstPage, goToLastPage, zoomIn, zoomOut, resetZoom, rotateClockwise]);

  // Display error message
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => setError(null)}
          style={styles.button}
          aria-label="Dismiss error message"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div 
      style={styles.container} 
      ref={containerRef}
      tabIndex="0" 
      aria-label="PDF Viewer"
      role="application"
    >
      <div style={styles.toolbar}>
        <div style={styles.toolbarGroup}>
          <button 
            onClick={goToFirstPage} 
            disabled={currentPage <= 1 || loading}
            style={currentPage <= 1 || loading ? styles.disabledButton : styles.button}
            title="First Page"
            aria-label="Go to first page"
          >
            ⟪
          </button>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1 || loading}
            style={currentPage <= 1 || loading ? styles.disabledButton : styles.button}
            title="Previous Page"
            aria-label="Go to previous page"
          >
            ⟨
          </button>
          
          <div style={styles.pageInputContainer}>
            <input 
              type="text" 
              value={pageInputValue}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              style={styles.pageInput}
              aria-label="Current page"
              disabled={loading}
            />
            <span style={styles.pageCount}>/ {numPages}</span>
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= numPages || loading}
            style={currentPage >= numPages || loading ? styles.disabledButton : styles.button}
            title="Next Page"
            aria-label="Go to next page"
          >
            ⟩
          </button>
          <button 
            onClick={goToLastPage} 
            disabled={currentPage >= numPages || loading}
            style={currentPage >= numPages || loading ? styles.disabledButton : styles.button}
            title="Last Page"
            aria-label="Go to last page"
          >
            ⟫
          </button>
        </div>

        <div style={styles.toolbarGroup}>
          <button 
            onClick={rotateCounterClockwise} 
            style={loading ? styles.disabledButton : styles.button}
            disabled={loading}
            title="Rotate Counter-Clockwise"
            aria-label="Rotate counter-clockwise"
          >
            ↺
          </button>
          <button 
            onClick={rotateClockwise} 
            style={loading ? styles.disabledButton : styles.button}
            disabled={loading}
            title="Rotate Clockwise"
            aria-label="Rotate clockwise"
          >
            ↻
          </button>
          <button 
            onClick={zoomOut} 
            style={loading ? styles.disabledButton : styles.button}
            disabled={loading}
            title="Zoom Out"
            aria-label="Zoom out"
          >
            −
          </button>
          <span style={styles.zoomInfo} title="Current zoom level">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={zoomIn} 
            style={loading ? styles.disabledButton : styles.button}
            disabled={loading}
            title="Zoom In"
            aria-label="Zoom in"
          >
            +
          </button>
          <button 
            onClick={resetZoom} 
            style={loading ? styles.disabledButton : (scale === initialScale ? styles.activeButton : styles.button)}
            disabled={loading}
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            100%
          </button>
          <button 
            onClick={toggleFitToWidth} 
            style={loading ? styles.disabledButton : (fitToWidth ? styles.activeButton : styles.button)}
            disabled={loading}
            title="Fit to Width"
            aria-label="Fit to width"
          >
            ↔
          </button>
        </div>
      </div>
      
      <div style={styles.canvasContainer}>
        {loading && (
          <div style={styles.loadingOverlay} role="status" aria-live="polite">
            <div style={styles.loadingSpinner} aria-hidden="true"></div>
            <span style={styles.loadingText}>Loading PDF...</span>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          style={styles.canvas} 
          aria-label={`PDF page ${currentPage} of ${numPages}`}
        />
      </div>
      
      <div style={styles.statusBar}>
        <span>
          {pdfDoc ? `${currentPage} of ${numPages}` : 'No document loaded'}
        </span>
        <span>
          {rotation !== 0 ? `Rotated: ${rotation}°` : ''}
        </span>
      </div>
    </div>
  );
};

// Generate keyframes for animations
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

// Add keyframes to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#272727',
    borderBottom: '1px solid #3a3a3a',
    flexWrap: 'wrap',
    gap: '8px',
  },
  toolbarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  pageInputContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 4px',
  },
  pageInput: {
    width: '40px',
    padding: '4px',
    backgroundColor: '#3a3a3a',
    color: '#ffffff',
    border: '1px solid #4a4a4a',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  pageCount: {
    margin: '0 4px',
    color: '#e4e4e7',
    fontSize: '0.9rem',
  },
  zoomInfo: {
    margin: '0 4px',
    color: '#e4e4e7',
    fontSize: '0.9rem',
    minWidth: '45px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3a3a3a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
  },
  activeButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
  },
  disabledButton: {
    backgroundColor: '#2a2a2a',
    color: '#6b7280',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'not-allowed',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
  },
  canvasContainer: {
    position: 'relative',
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: '16px',
  },
  canvas: {
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s ease',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    zIndex: 10,
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '8px',
  },
  loadingText: {
    color: '#e4e4e7',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#121212',
    padding: '24px',
    gap: '16px',
  },
  errorMessage: {
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '16px',
    borderRadius: '4px',
    textAlign: 'center',
    maxWidth: '600px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 16px',
    backgroundColor: '#272727',
    borderTop: '1px solid #3a3a3a',
    color: '#9ca3af',
    fontSize: '0.8rem',
  },
};

export default PDFViewer;
