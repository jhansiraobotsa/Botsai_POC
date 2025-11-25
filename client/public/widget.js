(function() {
  'use strict';

  // Get configuration from script tag
  const currentScript = document.currentScript || document.querySelector('script[data-chatbot-id]');
  const chatbotId = currentScript?.getAttribute('data-chatbot-id') || currentScript?.getAttribute('src')?.match(/id=([^&]+)/)?.[1];
  const apiUrl = currentScript?.getAttribute('data-api-url') || "https://vyomai.techraq.com";
  const position = currentScript?.getAttribute('data-position') || 'bottom-right';
  const primaryColor = currentScript?.getAttribute('data-color') || '#6366f1';
  const buttonText = currentScript?.getAttribute('data-button-text') || 'Chat with us';
  
  // Get the widget base URL
  const scriptSrc = currentScript?.getAttribute('src') || '';
  const widgetBaseUrl = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;

  if (!chatbotId) {
    console.error('Vyoma AI Widget: chatbot-id is required');
    return;
  }

  // Store customization data
  let customizationData = null;

  // Utility function to validate and format color
  function validateColor(color) {
    if (!color || color.trim() === '') return '#6366f1';
    
    // If it's already a valid hex color, return it
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return color;
    }
    
    // If it's a named color or invalid, return default
    return '#6366f1';
  }

  // Utility function to adjust color brightness
  function adjustColor(color, percent) {
    const validColor = validateColor(color);
    const num = parseInt(validColor.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
  }

  // Fetch customization data from API
  async function fetchCustomization() {
    try {
      console.log('Fetching customization for chatbot:', chatbotId);
      const response = await fetch(`${apiUrl}/api/v1/chatbot/customization/${chatbotId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Customization data loaded:', data);
        return data;
      } else {
        console.warn('Failed to fetch customization, using defaults');
        return getDefaultCustomization();
      }
    } catch (error) {
      console.warn('Error fetching customization, using defaults:', error);
      return getDefaultCustomization();
    }
  }

  // Default customization fallback
  function getDefaultCustomization() {
    return {
      agent_name: 'Vyoma AI',
      header_color: primaryColor,
      user_bubble_color: '#6366f1',
      font_size: '14',
      border_radius: '8',
      widget_position: position,
      show_avatar: true,
      welcome_message: 'Hello! I\'m your AI assistant. How can I help you today?',
      input_placeholder: 'Type your message...',
      suggested_questions: ['What are your business hours?', 'How can I contact you?', 'Tell me about your services'],
      quick_replies: ['Tell me more', 'How does this work?', 'Contact support'],
      typing_indicator: true,
      show_powered_by: true
    };
  }

  // Generate dynamic styles based on customization
  function generateStyles(customization) {
    const custom = customization || getDefaultCustomization();
    const headerColor = validateColor(custom.header_color || primaryColor);
    const userBubbleColor = validateColor(custom.user_bubble_color || '#6366f1');
    const fontSize = custom.font_size || '14';
    const borderRadius = custom.border_radius || '8';
    const widgetPosition = custom.widget_position || position;

    return `
    .vyoma-widget-button {
      position: fixed;
      ${widgetPosition.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
      ${widgetPosition.includes('right') ? 'right: 20px' : 'left: 20px'};
      width: 60px;
      height: 60px;
      background: ${headerColor};
      background: linear-gradient(135deg, ${headerColor} 0%, ${adjustColor(headerColor, -20)} 100%);
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
                    0 0 0 0 ${headerColor}80;
      }
      50% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
                    0 0 0 10px ${headerColor}00;
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
      ${widgetPosition.includes('bottom') ? 'bottom: 90px' : 'top: 90px'};
      ${widgetPosition.includes('right') ? 'right: 20px' : 'left: 20px'};
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      border-radius: ${borderRadius}px;
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
      border-radius: ${borderRadius}px;
    }

    .vyoma-widget-close {
      position: absolute;
      top: 12px;
      ${widgetPosition.includes('right') ? 'right: 12px' : 'left: 12px'};
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
      ${widgetPosition.includes('bottom') ? 'bottom: 70px' : 'top: 70px'};
      ${widgetPosition.includes('right') ? 'right: 0' : 'left: 0'};
      background: white;
      color: #1e293b;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: ${fontSize}px;
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
        ${widgetPosition.includes('right') ? 'right: 10px' : 'left: 10px'};
        ${widgetPosition.includes('bottom') ? 'bottom: 80px' : 'top: 80px'};
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
      border: 4px solid ${headerColor};
      border-color: ${headerColor} transparent ${headerColor} transparent;
      border-radius: 50%;
      animation: vyoma-spin 1.2s linear infinite;
    }

    @keyframes vyoma-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  }

  // Create and initialize the widget
  async function initializeWidget() {
    // Fetch customization data first
    customizationData = await fetchCustomization();
    
    // Generate styles based on customization
    const styles = generateStyles(customizationData);
    
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

    // Get customization values
    const custom = customizationData || getDefaultCustomization();
    const agentName = custom.agent_name || 'Vyoma AI';
    const widgetPosition = custom.widget_position || position;
    const headerColor = validateColor(custom.header_color || primaryColor);
    const userBubbleColor = validateColor(custom.user_bubble_color || '#6366f1');
    const finalButtonText = custom.welcome_message ? 
      custom.welcome_message.split(' ').slice(0, 3).join(' ') + '...' : buttonText;

    console.log('Applying user bubble color:', userBubbleColor);

    // Create widget button
    const button = document.createElement('button');
    button.className = 'vyoma-widget-button';
    button.setAttribute('aria-label', `Chat with ${agentName}`);
    button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'vyoma-widget-tooltip';
    tooltip.textContent = finalButtonText;

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

    // Build iframe URL with ALL customization parameters
    const iframeParams = new URLSearchParams({
      id: chatbotId,
      api: apiUrl,
      // Pass all customization data
      agent_name: encodeURIComponent(agentName),
      header_color: encodeURIComponent(headerColor),
      user_bubble_color: encodeURIComponent(userBubbleColor),
      font_size: custom.font_size || '14',
      border_radius: custom.border_radius || '8',
      widget_position: encodeURIComponent(widgetPosition),
      show_avatar: custom.show_avatar !== false,
      welcome_message: encodeURIComponent(custom.welcome_message || ''),
      input_placeholder: encodeURIComponent(custom.input_placeholder || ''),
      suggested_questions: custom.suggested_questions ? JSON.stringify(custom.suggested_questions) : '[]',
      quick_replies: custom.quick_replies ? JSON.stringify(custom.quick_replies) : '[]',
      typing_indicator: custom.typing_indicator !== false,
      show_powered_by: custom.show_powered_by !== false,
      response_style: encodeURIComponent(custom.response_style || ''),
      response_tone: encodeURIComponent(custom.response_tone || ''),
      fallback_message: encodeURIComponent(custom.fallback_message || ''),
      chat_language: encodeURIComponent(custom.chat_language || 'English')
    });

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'vyoma-widget-iframe';
    iframe.src = `${widgetBaseUrl}/widget.html?${iframeParams.toString()}`;
    iframe.setAttribute('allow', 'microphone');
    iframe.setAttribute('title', `${agentName} Chat Widget`);
    
    iframe.onload = function() {
      loading.remove();
      console.log('Widget iframe loaded with customization:', customizationData);
      console.log('User bubble color applied:', userBubbleColor);
      
      // Send a message to the iframe with the user bubble color for dynamic updates
      try {
        iframe.contentWindow.postMessage({
          type: 'vyoma-customization-update',
          user_bubble_color: userBubbleColor
        }, '*');
      } catch (e) {
        console.log('Could not send message to iframe:', e);
      }
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

    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'vyoma-close') {
        isOpen = false;
        container.classList.remove('vyoma-widget-open');
        button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
        trackEvent('widget_closed_from_inside');
      } else if (event.data && event.data.type === 'vyoma-minimize') {
        isOpen = false;
        container.classList.remove('vyoma-widget-open');
        button.innerHTML = '<i class="fas fa-comments vyoma-widget-icon"></i>';
        trackEvent('widget_minimized');
      }
    });

    // Analytics tracking
    function trackEvent(eventName) {
      try {
        fetch(`${apiUrl}/api/v1/analytics/widget-event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbot_id: chatbotId,
            event: eventName,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            referrer: document.referrer,
            agent_name: agentName
          })
        }).catch(() => {});
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
      },
      getCustomization: function() {
        return customizationData;
      },
      reloadCustomization: async function() {
        customizationData = await fetchCustomization();
        
        // Update tooltip with new welcome message
        const newWelcome = customizationData.welcome_message;
        if (newWelcome) {
          tooltip.textContent = newWelcome.split(' ').slice(0, 3).join(' ') + '...';
        }
        
        return customizationData;
      },
      updateUserBubbleColor: function(newColor) {
        const validatedColor = validateColor(newColor);
        console.log('Updating user bubble color to:', validatedColor);
        
        // Update iframe URL with new color
        const newIframeSrc = iframe.src.replace(
          /user_bubble_color=[^&]*/,
          `user_bubble_color=${encodeURIComponent(validatedColor)}`
        );
        iframe.src = newIframeSrc;
        
        // Send message to iframe for immediate update
        try {
          iframe.contentWindow.postMessage({
            type: 'vyoma-customization-update',
            user_bubble_color: validatedColor
          }, '*');
        } catch (e) {
          console.log('Could not send color update to iframe:', e);
        }
      },
      updateButtonColor: function(newColor) {
        if (newColor) {
          const validatedColor = validateColor(newColor);
          button.style.background = `linear-gradient(135deg, ${validatedColor} 0%, ${adjustColor(validatedColor, -20)} 100%)`;
        }
      }
    };

    console.log('Vyoma AI Widget loaded successfully for chatbot:', chatbotId);
    console.log('Applied customization:', customizationData);
    console.log('User bubble color to be applied:', userBubbleColor);
  }

  // Initialize the widget
  initializeWidget();
})();