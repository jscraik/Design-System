import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { ComposeView } from './components/ComposeView';
import { TypographyPage } from './pages/TypographyPage';
import { SpacingPage } from './pages/SpacingPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'typography' | 'spacing' | 'design-system'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState({
    name: 'ChatGPT 5.2 Pro',
    shortName: '5.2 Pro',
    description: 'Our most capable model'
  });
  const [viewMode, setViewMode] = useState<'chat' | 'compose'>('chat');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Simple view switcher for demo purposes
  if (currentView === 'design-system') {
    return (
      <div className="relative">
        <DesignSystemPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setCurrentView('typography')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            Typography
          </button>
          <button
            onClick={() => setCurrentView('spacing')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            Spacing
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className="rounded-lg bg-[#0d0d0d] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#2d2d2d]"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'typography') {
    return (
      <div className="relative">
        <TypographyPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setCurrentView('design-system')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← Overview
          </button>
          <button
            onClick={() => setCurrentView('spacing')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            View Spacing →
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className="rounded-lg bg-[#0d0d0d] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#2d2d2d]"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'spacing') {
    return (
      <div className="relative">
        <SpacingPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setCurrentView('design-system')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← Overview
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className="rounded-lg bg-[#0d0d0d] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#2d2d2d]"
          >
            ← Back to Chat
          </button>
          <button
            onClick={() => setCurrentView('typography')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← View Typography
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex bg-[#212121] dark">
      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#0D0D0D]">
        {/* Header */}
        <ChatHeader 
          isSidebarOpen={isSidebarOpen} 
          onSidebarToggle={toggleSidebar}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Conditional View */}
        {viewMode === 'compose' ? (
          <ComposeView />
        ) : (
          <>
            {/* Messages Area */}
            <ChatMessages />

            {/* Input Area */}
            <ChatInput selectedModel={selectedModel} />
          </>
        )}
      </div>
    </div>
  );
}