import React from 'react';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import LandingPage from './components/LandingPage';
import WelcomeLoginPage from './components/WelcomeLoginPage';
import ChatList from './components/ChatList';
import MobileChatView from './components/MobileChatView';
import SubscriptionPage from './components/SubscriptionPage';
import ExplorePage from './components/ExplorePage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import SupabaseLoginForm from './components/SupabaseLoginForm';
import { NavigationTab } from './types/navigation';

function App() {
  const { user, isLoggedIn, isLoading, isInitialized } = useSupabaseAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('chat');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSupabaseLogin, setShowSupabaseLogin] = useState(false);

  // Chrome-specific optimizations
  useEffect(() => {
    // Detect Chrome browser
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
    if (isChrome) {
      // Add Chrome-specific class to body
      document.body.classList.add('chrome-browser');
      
      // Optimize for Chrome performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Preload critical resources
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = '/src/components/ChatList.tsx';
          document.head.appendChild(link);
        });
      }
    }
    
    // Set viewport for mobile Chrome
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && window.innerWidth <= 768) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleNewChat = () => {
    // Create new chat logic here
    console.log('New chat');
  };

  const handleLoginSuccess = () => {
    setShowWelcome(false);
    setShowLanding(false);
    setShowRegister(false);
    setShowSupabaseLogin(false);
    setActiveTab('chat');
  };

  const handleGetStarted = () => {
    console.log('🔄 Get started clicked, showing welcome page');
    setShowLanding(false);
    setShowWelcome(false);
    setShowRegister(false);
    setShowSupabaseLogin(true);
  };

  const handleRegisterFromLanding = () => {
    console.log('🔄 Register clicked from landing, showing register page');
    setShowLanding(false);
    setShowWelcome(false);
    setShowRegister(true);
  };

  const handleDemoLoginFromLanding = () => {
    console.log('🔄 Demo login from landing, going to main app');
    setShowLanding(false);
    setShowWelcome(false);
    setShowRegister(false);
    setActiveTab('chat');
  };

  // Handle logout - reset to landing page
  const handleLogout = () => {
    console.log('🔄 Logout clicked, resetting to landing');
    setShowLanding(true);
    setShowWelcome(true);
    setShowRegister(false);
    setShowSupabaseLogin(false);
    setSelectedChat(null);
    setActiveTab('chat');
  };

  // Listen for prompt events from explore page
  useEffect(() => {
    const handleSendPrompt = (event: CustomEvent) => {
      const { prompt, chatId } = event.detail;
      setSelectedChat(chatId);
      setActiveTab('chat');
      
      // Send the prompt after a short delay to ensure chat is loaded
      setTimeout(() => {
        const sendPromptEvent = new CustomEvent('autoSendMessage', { 
          detail: { message: prompt } 
        });
        window.dispatchEvent(sendPromptEvent);
      }, 200);
    };

    const handleNavigateToSubscription = () => {
      setActiveTab('subscription');
    };
    window.addEventListener('sendPromptToChat', handleSendPrompt as EventListener);
    window.addEventListener('navigateToSubscription', handleNavigateToSubscription as EventListener);
    
    return () => {
      window.removeEventListener('sendPromptToChat', handleSendPrompt as EventListener);
      window.removeEventListener('navigateToSubscription', handleNavigateToSubscription as EventListener);
    };
  }, []);

  // Initialize app state when auth is ready
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('🔄 Auth initialized, setting up app state:', { isLoggedIn });
    
    // Check for demo user in localStorage
    const savedUser = localStorage.getItem('mikasa_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isDemo) {
          console.log('🔄 Demo user found, showing main app');
          setShowWelcome(false);
          setShowLanding(false);
          setShowRegister(false);
          setShowSupabaseLogin(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mikasa_user');
      }
    }
    
    if (isLoggedIn) {
      // If logged in via Supabase, show main app
      console.log('🔄 Supabase user logged in, showing main app');
      setShowWelcome(false);
      setShowLanding(false);
      setShowRegister(false);
      setShowSupabaseLogin(false);
    } else {
      // If not logged in, show landing page
      console.log('🔄 No user logged in, showing landing page');
      setShowLanding(true);
      setShowWelcome(false);
      setShowRegister(false);
      setShowSupabaseLogin(false);
    }
  }
  )

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
            👩‍💻
          </div>
          <p className="text-gray-600 mb-2">Memuat Mikasa AI...</p>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show landing page first
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onDemoLogin={handleDemoLoginFromLanding}
          onRegister={handleRegisterFromLanding}
        />
      </div>
    );
  }

  // Show register page
  if (showRegister) {
    return (
      <div className="h-screen bg-gray-50 max-w-md mx-auto">
        <SupabaseLoginForm
          onBack={() => {
            setShowRegister(false);
            setShowLanding(true);
          }}
          onSuccess={handleLoginSuccess}
          defaultMode="signup"
        />
      </div>
    );
  }

  // Show Supabase login page
  if (showSupabaseLogin) {
    return (
      <div className="h-screen bg-gray-50 max-w-md mx-auto">
        <SupabaseLoginForm
          onBack={() => {
            setShowSupabaseLogin(false);
            setShowLanding(true);
          }}
          onSuccess={handleLoginSuccess}
          defaultMode="signin"
        />
      </div>
    );
  }
  // Show welcome page only if not logged in AND no user AND showWelcome is true
  if (!isLoggedIn && !user && showWelcome) {
    return (
      <div className="h-screen bg-gray-50 max-w-md mx-auto">
        <WelcomeLoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // If logged in, always show main app (never show welcome)
  if (isLoggedIn) {
    // Main app content will be rendered below
  }

  const renderContent = () => {
    if (selectedChat) {
      return (
        <MobileChatView 
          chatId={selectedChat} 
          onBack={handleBackToList} 
        />
      );
    }

    switch (activeTab) {
      case 'chat':
        return (
          <ChatList 
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
      case 'explore':
        return <ExplorePage activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'subscription':
        return <SubscriptionPage activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'notifications':
        return <NotificationsPage activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'profile':
        return <ProfilePage activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />;
      default:
        return (
          <ChatList 
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 max-w-md mx-auto">
      {renderContent()}
    </div>
  );
}

export default App;