import { useState } from 'react';
import { X } from 'lucide-react';

interface DiscoverySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptEnhancement: 'rewrite' | 'augment' | 'preserve';
  onPromptEnhancementChange: (mode: 'rewrite' | 'augment' | 'preserve') => void;
  targetSize: number;
  onTargetSizeChange: (size: number) => void;
}

export function DiscoverySettingsModal({ 
  isOpen, 
  onClose,
  promptEnhancement: externalPromptEnhancement,
  onPromptEnhancementChange,
  targetSize: externalTargetSize,
  onTargetSizeChange
}: DiscoverySettingsModalProps) {
  const [targetSize, setTargetSize] = useState(externalTargetSize);
  const [showAutoPlanBudget, setShowAutoPlanBudget] = useState(false);
  const [autoPlanBudget, setAutoPlanBudget] = useState(80);
  const [promptEnhancement, setPromptEnhancement] = useState(externalPromptEnhancement);
  const [manualRuns, setManualRuns] = useState(true);
  const [mcpRuns, setMcpRuns] = useState(true);
  const [textFormat, setTextFormat] = useState<'text' | 'markdown' | 'xml' | 'json'>('text');
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'medium' | 'high'>('medium');
  const [verbosity, setVerbosity] = useState<'low' | 'medium' | 'high'>('medium');
  const [storeLogs, setStoreLogs] = useState(true);

  // Sync with external state
  const handlePromptEnhancementChange = (mode: 'rewrite' | 'augment' | 'preserve') => {
    setPromptEnhancement(mode);
    onPromptEnhancementChange(mode);
  };

  const handleTargetSizeChange = (size: number) => {
    setTargetSize(size);
    onTargetSizeChange(size);
  };

  if (!isOpen) return null;

  const handleReset = () => {
    setTargetSize(60);
    setShowAutoPlanBudget(false);
    setAutoPlanBudget(80);
    setPromptEnhancement('rewrite');
    setManualRuns(true);
    setMcpRuns(true);
    setTextFormat('text');
    setReasoningEffort('medium');
    setVerbosity('medium');
    setStoreLogs(true);
  };

  const getEnhancementDescription = () => {
    switch (promptEnhancement) {
      case 'rewrite':
        return 'Agent writes a new prompt based on what it discovered about the codebase.';
      case 'augment':
        return 'Keeps your original instructions and appends relevant context from discoveries.';
      case 'preserve':
        return 'Leaves your instructions unchanged. Only updates the file selection.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-xl w-[420px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-[16px] font-medium leading-[24px] text-white">
            Discovery Settings
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-[13px] font-normal leading-[18px] text-[#4ade80] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="size-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Token Budgets Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Token Budgets
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-4">
              Sets the target size for your final prompt. Use 60k for ChatGPT (lite Pro context), higher for CLIAPI tools with larger context windows.
            </p>
            
            {/* Target Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-normal leading-[18px] text-white/80">
                  Target size
                </label>
                <span className="text-[13px] font-medium leading-[18px] text-white">
                  {targetSize}k
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={targetSize}
                onChange={(e) => handleTargetSizeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${(targetSize - 20) / 0.8}%, rgba(255,255,255,0.1) ${(targetSize - 20) / 0.8}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            {/* Auto Plan Budget */}
            <div className="mt-3">
              <button
                onClick={() => setShowAutoPlanBudget(!showAutoPlanBudget)}
                className="flex items-center gap-2 text-[13px] font-normal leading-[18px] text-white/80 hover:text-white transition-colors w-full"
              >
                <svg 
                  className={`size-3 transition-transform ${showAutoPlanBudget ? 'rotate-90' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="size-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Auto Plan Budget</span>
                <span className="ml-auto text-white/60">{autoPlanBudget}k</span>
              </button>
              
              {showAutoPlanBudget && (
                <div className="mt-3 ml-5 space-y-3">
                  <p className="text-[12px] font-normal leading-[16px] text-white/50">
                    Auto Plan runs use CLI/API calls which support larger context windows.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-normal leading-[18px] text-white/80">
                        Target size
                      </label>
                      <span className="text-[13px] font-medium leading-[18px] text-white">
                        {autoPlanBudget}k
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={autoPlanBudget}
                      onChange={(e) => setAutoPlanBudget(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${(autoPlanBudget - 20) / 0.8}%, rgba(255,255,255,0.1) ${(autoPlanBudget - 20) / 0.8}%, rgba(255,255,255,0.1) 100%)`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Enhancement Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Prompt Enhancement
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-3">
              How the agent modifies your instructions after discovery.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handlePromptEnhancementChange('rewrite')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  promptEnhancement === 'rewrite'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Rewrite
              </button>
              <button
                onClick={() => handlePromptEnhancementChange('augment')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  promptEnhancement === 'augment'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Augment
              </button>
              <button
                onClick={() => handlePromptEnhancementChange('preserve')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  promptEnhancement === 'preserve'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Preserve
              </button>
            </div>
            
            <p className="text-[12px] font-normal leading-[16px] text-white/50">
              {getEnhancementDescription()}
            </p>
          </div>

          {/* Clarifying Questions Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Clarifying Questions
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-4">
              Allow the agent to ask you questions during discovery to better understand your intent.
            </p>
            
            <div className="space-y-4">
              {/* Manual Runs */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium leading-[18px] text-white mb-0.5">
                      Manual Runs (UI)
                    </div>
                    <div className="text-[12px] font-normal leading-[16px] text-white/50">
                      When you click Run Discovery
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setManualRuns(!manualRuns)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                    manualRuns ? 'bg-[#4ade80]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                      manualRuns ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* MCP Runs */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg className="size-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium leading-[18px] text-white mb-0.5">
                      MCP Runs
                    </div>
                    <div className="text-[12px] font-normal leading-[16px] text-white/50">
                      When called via context_builder
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMcpRuns(!mcpRuns)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                    mcpRuns ? 'bg-[#4ade80]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                      mcpRuns ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Text Format Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Text Format
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-3">
              Choose the format for the output text.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTextFormat('text')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  textFormat === 'text'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setTextFormat('markdown')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  textFormat === 'markdown'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Markdown
              </button>
              <button
                onClick={() => setTextFormat('xml')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  textFormat === 'xml'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                XML
              </button>
              <button
                onClick={() => setTextFormat('json')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  textFormat === 'json'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          {/* Reasoning Effort Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Reasoning Effort
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-3">
              Set the level of reasoning effort for the agent.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setReasoningEffort('low')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  reasoningEffort === 'low'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Low
              </button>
              <button
                onClick={() => setReasoningEffort('medium')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  reasoningEffort === 'medium'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setReasoningEffort('high')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  reasoningEffort === 'high'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Verbosity Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Verbosity
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-3">
              Set the level of verbosity for the agent's output.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setVerbosity('low')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  verbosity === 'low'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Low
              </button>
              <button
                onClick={() => setVerbosity('medium')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  verbosity === 'medium'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setVerbosity('high')}
                className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
                  verbosity === 'high'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-[#2a2a2a] text-white/60 hover:text-white'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Store Logs Section */}
          <div>
            <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">
              Store Logs
            </h3>
            <p className="text-[13px] font-normal leading-[18px] text-white/60 mb-3">
              Enable or disable logging of the agent's actions.
            </p>
            
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium leading-[18px] text-white mb-0.5">
                    Store Logs
                  </div>
                  <div className="text-[12px] font-normal leading-[16px] text-white/50">
                    Enable logging for debugging and analysis
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStoreLogs(!storeLogs)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  storeLogs ? 'bg-[#4ade80]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                    storeLogs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-2">
            <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-[14px] font-medium leading-[20px] text-white">
              {targetSize}k
            </span>
            <span className="text-[13px] font-normal leading-[18px] text-[#4ade80] capitalize">
              {promptEnhancement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}