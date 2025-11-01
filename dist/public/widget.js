(function() {
  'use strict';

  // Get configuration from script tag
  const currentScript = document.currentScript || document.querySelector('script[data-chatbot-id]');
  const chatbotId = currentScript?.getAttribute('data-chatbot-id') || currentScript?.getAttribute('src')?.match(/id=([^&]+)/)?.[1];
  const apiUrl = currentScript?.getAttribute('data-api-url') || 'http://localhost:3000';
  const position = currentScript?.getAttribute('data-position') || 'bottom-right';
  const primaryColor = currentScript?.getAttribute('data-color') || '#6366f1';
  const buttonText = currentScript?.getAttribute('data-button-text') || 'Chat with us';
  
  // Get the widget base URL (where widget.js is loaded from, e.g., http://localhost:3000)
  const scriptSrc = currentScript?.getAttribute('src') || '';
  const widgetBaseUrl = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;

  if (!chatbotId) {
    console.error('Vyoma AI Widget: chatbot-id is required');
    return;
  }

  // Create widget styles
  const styles = `
    .vyoma-widget-button {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
      ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
      width: 60px;
      height: 60px;
      background: ${primaryColor};
      background: linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%);
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      animation: vyoma-pulse-ring 2s infinite;
    }

    @keyframes vyoma-pulse-ring {
      0%, 100% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
                    0 0 0 0 ${primaryColor}80;
      }
      50% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
                    0 0 0 10px ${primaryColor}00;
      }
    }

    .vyoma-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
    }

    .vyoma-widget-button:active {
      transform: scale(0.95);
    }

    .vyoma-widget-icon {
      color: white;
      font-size: 28px;
      transition: transform 0.3s;
    }

    .vyoma-widget-button:hover .vyoma-widget-icon {
      transform: scale(1.1);
    }

    .vyoma-widget-container {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 90px' : 'top: 90px'};
      ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    .vyoma-widget-container.vyoma-widget-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .vyoma-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 16px;
    }

    .vyoma-widget-close {
      position: absolute;
      top: 12px;
      ${position.includes('right') ? 'right: 12px' : 'left: 12px'};
      width: 32px;
      height: 32px;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      opacity: 0;
      pointer-events: none;
    }

    .vyoma-widget-container.vyoma-widget-open .vyoma-widget-close {
      opacity: 1;
      pointer-events: all;
    }

    .vyoma-widget-close:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.1);
    }

    .vyoma-widget-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
    }

    .vyoma-widget-tooltip {
      position: absolute;
      ${position.includes('bottom') ? 'bottom: 70px' : 'top: 70px'};
      ${position.includes('right') ? 'right: 0' : 'left: 0'};
      background: white;
      color: #1e293b;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      z-index: 999997;
    }

    .vyoma-widget-button:hover + .vyoma-widget-tooltip {
      opacity: 1;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .vyoma-widget-container {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        ${position.includes('right') ? 'right: 10px' : 'left: 10px'};
        ${position.includes('bottom') ? 'bottom: 80px' : 'top: 80px'};
      }

      .vyoma-widget-button {
        width: 56px;
        height: 56px;
      }

      .vyoma-widget-icon {
        font-size: 24px;
      }
    }

    /* Loading animation */
    .vyoma-widget-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
    }

    .vyoma-widget-loading::after {
      content: '';
      display: block;
      width: 40px;
      height: 40px;
      border: 4px solid ${primaryColor};
      border-color: ${primaryColor} transparent ${primaryColor} transparent;
      border-radius: 50%;
      animation: vyoma-spin 1.2s linear infinite;
    }

    @keyframes vyoma-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Utility function to adjust color brightness
  function adjustColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
  }

  // Inject styles
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Load Font Awesome if not already loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }

  // Create widget button
  const button = document.createElement('button');
  button.className = 'vyoma-widget-button';
  button.setAttribute('aria-label', 'Open chat widget');
  button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'vyoma-widget-tooltip';
  tooltip.textContent = buttonText;

  // Create widget container
  const container = document.createElement('div');
  container.className = 'vyoma-widget-container';
  
  // Create loading indicator
  const loading = document.createElement('div');
  loading.className = 'vyoma-widget-loading';
  container.appendChild(loading);

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'vyoma-widget-close';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close chat widget');

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'vyoma-widget-iframe';
  iframe.src = `${widgetBaseUrl}/widget.html?id=${chatbotId}&api=${apiUrl}`;
  iframe.setAttribute('allow', 'microphone');
  iframe.setAttribute('title', 'Chat Widget');
  
  iframe.onload = function() {
    loading.remove();
  };

  // Assemble widget
  container.appendChild(iframe);
  container.appendChild(closeButton);

  // Add to page
  document.body.appendChild(button);
  document.body.appendChild(tooltip);
  document.body.appendChild(container);

  // Toggle widget
  let isOpen = false;
  
  button.addEventListener('click', function() {
    isOpen = !isOpen;
    if (isOpen) {
      container.classList.add('vyoma-widget-open');
      button.innerHTML = '<i class="fas fa-times vyoma-widget-icon"></i>';
      // Track widget open event
      trackEvent('widget_opened');
    } else {
      container.classList.remove('vyoma-widget-open');
      button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
    }
  });

  closeButton.addEventListener('click', function() {
    isOpen = false;
    container.classList.remove('vyoma-widget-open');
    button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
  });

  // Listen for messages from the iframe (widget.html)
  window.addEventListener('message', function(event) {
    // Handle minimize/close requests from widget
    if (event.data && event.data.type === 'vyoma-close') {
      // Close the widget
      isOpen = false;
      container.classList.remove('vyoma-widget-open');
      button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
      trackEvent('widget_closed_from_inside');
    } else if (event.data && event.data.type === 'vyoma-minimize') {
      // Minimize the widget (same as close for now)
      isOpen = false;
      container.classList.remove('vyoma-widget-open');
      button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
      trackEvent('widget_minimized');
    }
  });

  // Analytics tracking
  function trackEvent(eventName) {
    try {
      // Send analytics to your backend
      fetch(`${apiUrl}/api/v1/analytics/widget-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          event: eventName,
          timestamp: new Date().toISOString(),
          page_url: window.location.href,
          referrer: document.referrer
        })
      }).catch(() => {}); // Fail silently
    } catch (e) {}
  }

  // Track widget load
  trackEvent('widget_loaded');

  // Expose API for external control
  window.VyomaWidget = {
    open: function() {
      if (!isOpen) {
        button.click();
      }
    },
    close: function() {
      if (isOpen) {
        closeButton.click();
      }
    },
    toggle: function() {
      button.click();
    },
    isOpen: function() {
      return isOpen;
    }
  };

  console.log('Vyoma AI Widget loaded successfully for chatbot:', chatbotId);
})();

