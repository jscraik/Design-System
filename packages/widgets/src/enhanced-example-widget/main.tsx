import { createEmbeddedHost, ensureMockOpenAI, HostProvider } from "@chatui/runtime";
import { AppsSDKUIProvider, Button, Card } from "@chatui/ui";
import { useState } from "react";

import {
    useCallTool,
    useDeviceCapabilities,
    useDisplayMode,
    useMaxHeight,
    useTheme,
    useToolOutput,
    useWidgetState
} from "../shared/openai-hooks";
import { createWidget, mountWidget, WidgetErrorBoundary } from "../shared/widget-base";
import "../styles.css";

const isDev = Boolean(import.meta.env?.DEV);

// Mock data for development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      message: "Hello from the enhanced example widget!",
      count: 42,
      items: ["Item 1", "Item 2", "Item 3"],
    },
  });
}

type ExampleToolOutput = {
  message?: string;
  count?: number;
  items?: string[];
};

type WidgetState = {
  localCount: number;
  interactions: string[];
  preferences: {
    theme: string;
    notifications: boolean;
  };
};

// Core widget component using enhanced OpenAI hooks
function EnhancedExampleCore() {
  const toolOutput = useToolOutput() as ExampleToolOutput | null;
  const [widgetState, setWidgetState] = useWidgetState<WidgetState>();
  const [localCount, setLocalCount] = useState(0);
  const theme = useTheme();
  const deviceCaps = useDeviceCapabilities();
  const callTool = useCallTool();
  const { mode: displayMode, requestMode } = useDisplayMode();
  const maxHeight = useMaxHeight();

  // Initialize widget state if not present
  const currentState = widgetState || {
    localCount: 0,
    interactions: [],
    preferences: { theme: 'auto', notifications: true }
  };

  const message = toolOutput?.message ?? "No message received";
  const serverCount = toolOutput?.count ?? 0;
  const items = toolOutput?.items ?? [];

  const handleCallTool = async () => {
    if (!callTool) {
      if (isDev) {
        console.warn('callTool not available');
      }
      return;
    }

    try {
      const result = await callTool("example_action", {
        action: "increment",
        currentValue: localCount,
      });
      
      if (result?.structuredContent?.newValue) {
        setLocalCount(result.structuredContent.newValue);
      }

      // Update widget state with interaction
      setWidgetState(prev => ({
        ...prev!,
        interactions: [...(prev?.interactions || []), `Tool called at ${new Date().toLocaleTimeString()}`]
      }));
    } catch (error) {
      if (isDev) {
        console.error("Tool call failed:", error);
      }
    }
  };

  const handleToggleFullscreen = async () => {
    if (!requestMode) return;
    
    try {
      const newMode = displayMode === 'fullscreen' ? 'inline' : 'fullscreen';
      await requestMode({ mode: newMode });
    } catch (error) {
      if (isDev) {
        console.error('Failed to change display mode:', error);
      }
    }
  };

  const updatePreferences = (key: keyof WidgetState['preferences'], value: any) => {
    setWidgetState(prev => ({
      ...prev!,
      preferences: {
        ...prev!.preferences,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-4" style={{ maxHeight: maxHeight ? `${maxHeight}px` : 'auto' }}>
      {/* Environment Info Card */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Environment Info</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-400">Theme:</div>
          <div className="text-white">{theme || 'Unknown'}</div>
          
          <div className="text-gray-400">Device:</div>
          <div className="text-white">
            {deviceCaps.isMobile ? 'Mobile' : deviceCaps.isTablet ? 'Tablet' : 'Desktop'}
          </div>
          
          <div className="text-gray-400">Touch:</div>
          <div className="text-white">{deviceCaps.hasTouch ? 'Yes' : 'No'}</div>
          
          <div className="text-gray-400">Hover:</div>
          <div className="text-white">{deviceCaps.hasHover ? 'Yes' : 'No'}</div>
          
          <div className="text-gray-400">Display Mode:</div>
          <div className="text-white">{displayMode || 'Unknown'}</div>
          
          <div className="text-gray-400">Max Height:</div>
          <div className="text-white">{maxHeight ? `${maxHeight}px` : 'Unlimited'}</div>
        </div>
      </Card>

      {/* Server Data Card */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Server Data</h2>
        <p className="text-gray-300 mb-2">{message}</p>
        <p className="text-sm text-gray-400">Server count: {serverCount}</p>
      </Card>

      {/* Interactive Elements Card */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Interactive Elements</h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button 
            onClick={() => setLocalCount(c => c + 1)}
            variant="primary"
          >
            Local Count: {localCount}
          </Button>
          <Button 
            onClick={handleCallTool}
            variant="secondary"
            disabled={!callTool}
          >
            Call Tool
          </Button>
          <Button 
            onClick={handleToggleFullscreen}
            variant="outline"
            disabled={!requestMode}
          >
            Toggle Fullscreen
          </Button>
        </div>
        
        <div className="text-sm text-gray-400">
          Widget state count: {currentState.localCount}
        </div>
      </Card>

      {/* Widget State Management */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Widget Preferences</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Notifications</span>
            <Button
              onClick={() => updatePreferences('notifications', !currentState.preferences.notifications)}
              variant={currentState.preferences.notifications ? "primary" : "outline"}
              size="sm"
            >
              {currentState.preferences.notifications ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Theme Preference</span>
            <select 
              value={currentState.preferences.theme}
              onChange={(e) => updatePreferences('theme', e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Items List */}
          {items.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Items</h2>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item} className="text-gray-300 text-sm">
                • {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Interaction History */}
      {currentState.interactions.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Recent Interactions</h2>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentState.interactions.slice(-5).map((interaction) => (
              <div key={interaction} className="text-xs text-gray-400">
                {interaction}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Create the enhanced widget using the new createWidget HOC
const EnhancedExampleWidget = createWidget(
  () => {
    const host = createEmbeddedHost();

    return (
      <WidgetErrorBoundary>
        <HostProvider host={host}>
          <AppsSDKUIProvider linkComponent="a">
            <EnhancedExampleCore />
          </AppsSDKUIProvider>
        </HostProvider>
      </WidgetErrorBoundary>
    );
  },
  {
    title: "Enhanced Example Widget",
    className: "max-w-2xl mx-auto",
  }
);

// Mount into the DOM when used as a standalone widget entry
if (typeof document !== "undefined") {
  mountWidget(<EnhancedExampleWidget />);
}

// Export for potential reuse
export { EnhancedExampleCore, EnhancedExampleWidget };
