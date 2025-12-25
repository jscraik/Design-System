import { useState } from 'react';
import { IconChevronDownMd, IconCheckmark, IconCompose, IconPlusComposer, IconSettings } from './icons/ChatGPTIcons';
import { DiscoverySettingsModal } from './DiscoverySettingsModal';

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

interface ModeConfig {
  id: string;
  name: string;
  subtitle: string;
  contextConfig: {
    mode: string;
    selectedFiles: string;
    fileTree: string;
    codeMap: string;
    gitDiff: string;
  };
  whenToUse: string[];
  about: string;
}

const availableModels: ModelConfig[] = [
  { name: 'ChatGPT 5.2 Pro', shortName: '5.2 Pro', description: 'Our most capable model' },
  { name: 'ChatGPT 4o', shortName: '4o', description: 'Fast and efficient' },
  { name: 'ChatGPT 4o mini', shortName: '4o mini', description: 'Lightweight and quick' },
  { name: 'Claude 3.5 Sonnet', shortName: 'Claude', description: 'Anthropic\'s latest model' },
  { name: 'Gemini Pro', shortName: 'Gemini', description: 'Google\'s advanced model' },
];

const modes: ModeConfig[] = [
  {
    id: 'chat',
    name: 'Chat',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Chat',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'General questions',
      'Code explanations',
      'Quick discussions',
    ],
    about: 'Standard chat mode for general interactions and questions.',
  },
  {
    id: 'plan',
    name: 'Plan',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Plan',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'Project planning',
      'Architecture decisions',
      'Feature roadmaps',
    ],
    about: 'Planning mode for strategic thinking and architectural decisions.',
  },
  {
    id: 'edit',
    name: 'Edit',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Edit',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'Direct code modifications',
      'Focused implementation tasks',
      'Clear requirements',
    ],
    about: 'Direct code editing. Requires a powerful model capable of search/replace.',
  },
  {
    id: 'pro-edit',
    name: 'Pro Edit',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Pro Edit',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'Complex refactoring',
      'Multi-file changes',
      'Advanced editing tasks',
    ],
    about: 'Advanced editing mode with enhanced context awareness and precision.',
  },
  {
    id: 'review',
    name: 'Review',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Review',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'Code review sessions',
      'Quality assessments',
      'Pre-merge checks',
    ],
    about: 'Review-only mode for quality checks and assessments.',
  },
  {
    id: 'manual',
    name: 'Manual',
    subtitle: 'Built-in preset',
    contextConfig: {
      mode: 'Current Manual',
      selectedFiles: 'Current selection',
      fileTree: 'Auto',
      codeMap: 'Auto',
      gitDiff: 'none',
    },
    whenToUse: [
      'Custom workflows',
      'Full control over context',
      'Advanced configuration needs',
    ],
    about: 'Unconstrained chat with full control over context. Uses your current file selection and workspace settings.',
  },
];

export function ComposeView() {
  const [instructions, setInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<'selected' | 'builder' | 'xml'>('builder');
  const [taskDescription, setTaskDescription] = useState('Review Codex CLI codebase and identify methods for decomposing work into a graph');
  const [autoPlan, setAutoPlan] = useState(true);
  const [showDiscoverySettings, setShowDiscoverySettings] = useState(false);
  const [promptEnhancement, setPromptEnhancement] = useState<'rewrite' | 'augment' | 'preserve'>('rewrite');
  const [targetSize, setTargetSize] = useState(60);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(availableModels[0]);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ModeConfig>(modes[5]); // Default to Manual
  const [previewMode, setPreviewMode] = useState<ModeConfig>(modes[5]); // For hover preview
  const [showProEditConfig, setShowProEditConfig] = useState(false);
  const [proEditMode, setProEditMode] = useState<'agent' | 'model'>('agent');
  const [selectedAgent, setSelectedAgent] = useState('Codex CLI');
  const [selectedModelConfig, setSelectedModelConfig] = useState('GPT-5.2 Codex Medium');

  const handleModeSelect = (mode: ModeConfig) => {
    setSelectedMode(mode);
    setPreviewMode(mode);
    setShowModeSelector(false);
  };

  const handleModeHover = (mode: ModeConfig) => {
    setPreviewMode(mode);
  };

  // Reset preview when modal opens
  const handleModalOpen = () => {
    setPreviewMode(selectedMode);
    setShowModeSelector(true);
  };

  const getTaskSectionConfig = () => {
    switch (promptEnhancement) {
      case 'rewrite':
        return {
          label: 'Task Description',
          placeholder: 'Describe your task here...\n\nExample: "Add a dark mode toggle to the settings page with system, light, and dark options. Store the preference and apply it app-wide."',
          tooltip: 'Describe your task here.\n\nThe agent will:\n• Analyze your codebase\n• Select relevant files\n• Write detailed instructions above\n\nThis is your primary input in Rewrite mode.',
          buttonText: 'Rewrite'
        };
      case 'augment':
        return {
          label: 'Additional Context (Optional)',
          placeholder: 'Add extra details to help the agent find relevant files and enhance your prompt',
          tooltip: 'Add extra context to help the agent.\n\nThe agent will:\n• Keep your existing instructions\n• Add relevant context from discoveries\n• Select appropriate files\n\nLeave empty to just enhance with file context.',
          buttonText: 'Augment'
        };
      case 'preserve':
        return {
          label: 'Discovery Hints (Optional)',
          placeholder: 'Describe what files to look for (your instructions won\'t be modified)',
          tooltip: 'Provide hints for file discovery.\n\nThe agent will:\n• Only select relevant files\n• Leave your instructions unchanged\n\nUseful when you\'ve already written detailed instructions.',
          buttonText: 'Preserve'
        };
    }
  };

  const taskConfig = getTaskSectionConfig();

  return (
    <div className="flex-1 flex flex-col bg-[#0D0D0D]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-8 py-8 space-y-8">
          {/* Instructions Section */}
          <div className="bg-[#212121] border border-[#4d4d4d] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <IconPlusComposer className="size-4 text-[#ececec]/70" />
                </button>
                <span className="text-[15px] leading-6 text-[#ececec] font-medium">
                  Instructions
                </span>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <svg className="size-4 text-[#ececec]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <svg className="size-4 text-[#ececec]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2f2f2f] hover:bg-[#3f3f3f] border border-[#4d4d4d] text-[#ececec] rounded-lg transition-colors text-[13px] leading-5">
                <IconCompose className="size-4 text-[#ececec]/70" />
                Send to Chat
              </button>
            </div>
            {/* Text Area */}
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter your prompt's task instructions here..."
              className="w-full h-[187px] bg-[#1a1a1a] px-4 py-3 text-[15px] leading-6 text-[#ececec] placeholder:text-[#ececec]/40 focus:outline-none resize-none border-0"
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-[#4d4d4d]">
            {/* Tabs removed - Content Builder is now a standalone section */}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'builder' && (
              <div className="bg-[#212121] border border-[#4d4d4d] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a]">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <IconPlusComposer className="size-4 text-[#ececec]/70" />
                    </button>
                    <span className="text-[15px] leading-6 text-[#ececec] font-medium">
                      Content Builder
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2f2f2f] hover:bg-[#3f3f3f] border border-[#4d4d4d] text-[#ececec] rounded-lg transition-colors text-[13px] leading-5">
                    <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Discovery
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-6">
                  {/* Model and Task Description */}
                  <div className="space-y-5">
                    {/* Model Selector */}
                    <div className="w-[340px]">
                      <label className="block text-[13px] leading-5 text-[#ececec]/70 mb-2">
                        Model
                      </label>
                      <div className="relative">
                        <div className="bg-[#2d2d2d] rounded-lg p-0.5">
                          <button className="flex items-center justify-between hover:bg-white/10 px-3 py-2 rounded-md transition-colors w-full" onClick={() => setShowModelPicker(!showModelPicker)}>
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">{selectedModel.name}</span>
                              <span className="text-[12px] text-white/50 font-normal leading-[18px] tracking-[-0.32px]">{selectedModel.description}</span>
                            </div>
                            <IconChevronDownMd className="size-3.5 text-white/60 flex-shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Task Description with Buttons */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[13px] leading-5 text-[#ececec]/70">
                          {taskConfig.label}
                        </label>
                        <div className="flex items-center gap-1">
                          <div className="relative">
                            <button 
                              className="p-1.5 hover:bg-[#2f2f2f] rounded transition-colors"
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              <svg className="size-4 text-[#ececec]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            
                            {/* Tooltip */}
                            {showTooltip && (
                              <div className="absolute right-0 top-8 w-[320px] bg-[#2f2f2f] border border-[#4d4d4d] rounded-lg p-4 shadow-xl z-50">
                                <div className="text-[13px] leading-5 text-[#ececec] space-y-3">
                                  {promptEnhancement === 'rewrite' && (
                                    <>
                                      <p className="font-medium">Describe your task here.</p>
                                      <div>
                                        <p className="font-medium mb-1.5">The agent will:</p>
                                        <ul className="space-y-1 ml-0">
                                          <li>• Analyze your codebase</li>
                                          <li>• Select relevant files</li>
                                          <li>• Write detailed instructions above</li>
                                        </ul>
                                      </div>
                                      <p className="text-[#ececec]/90">This is your primary input in Rewrite mode.</p>
                                    </>
                                  )}
                                  {promptEnhancement === 'augment' && (
                                    <>
                                      <p className="font-medium">Add extra context to help the agent.</p>
                                      <div>
                                        <p className="font-medium mb-1.5">The agent will:</p>
                                        <ul className="space-y-1 ml-0">
                                          <li>• Keep your existing instructions</li>
                                          <li>• Add relevant context from discoveries</li>
                                          <li>• Select appropriate files</li>
                                        </ul>
                                      </div>
                                      <p className="text-[#ececec]/90">Leave empty to just enhance with file context.</p>
                                    </>
                                  )}
                                  {promptEnhancement === 'preserve' && (
                                    <>
                                      <p className="font-medium">Provide hints for file discovery.</p>
                                      <div>
                                        <p className="font-medium mb-1.5">The agent will:</p>
                                        <ul className="space-y-1 ml-0">
                                          <li>• Only select relevant files</li>
                                          <li>• Leave your instructions unchanged</li>
                                        </ul>
                                      </div>
                                      <p className="text-[#ececec]/90">Useful when you've already written detailed instructions.</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <button className="p-1.5 hover:bg-[#2f2f2f] rounded transition-colors">
                            <svg className="size-4 text-[#ececec]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <textarea
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder={taskConfig.placeholder}
                          className="flex-1 h-[120px] bg-[#2f2f2f] border border-[#4d4d4d] rounded-lg px-3 py-2.5 text-[13px] leading-5 text-[#ececec] placeholder:text-[#ececec]/50 focus:outline-none focus:border-[#ececec]/30 resize-none"
                        />
                        
                        {/* Action Button */}
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setShowDiscoverySettings(true)}
                            className="px-4 py-2 bg-[#2f2f2f] hover:bg-[#3f3f3f] border border-[#4d4d4d] text-[#ececec]/90 rounded-lg transition-all text-[13px] leading-5 whitespace-nowrap flex items-center gap-2"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="text-[#19c37d]">{targetSize}k</span>
                              <span>{taskConfig.buttonText}</span>
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[12px] leading-[18px] text-[#ececec]/50">
                          Add a task description to enable actions
                        </span>
                        <span className="text-[12px] leading-[18px] text-[#ececec]/50">
                          {taskDescription.length} chars
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Auto Plan Section */}
                  <div className="flex items-center justify-between pt-5 border-t border-[#4d4d4d]">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-[13px] leading-5 text-[#ececec]">
                          Auto Plan
                        </div>
                        <div className="text-[12px] leading-[18px] text-[#ececec]/70">
                          Generate a plan automatically after discovery
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] leading-[18px] text-[#ececec]/70">
                          Plan mode
                        </span>
                        <div className="relative">
                          <button 
                            onClick={handleModalOpen}
                            className="bg-[#2f2f2f] border border-[#4d4d4d] rounded-lg px-3 py-1.5 text-[12px] leading-[18px] text-[#ececec] flex items-center gap-2 hover:bg-[#3f3f3f] transition-colors"
                          >
                            {previewMode.name}
                            <IconChevronDownMd className="size-3 text-[#ececec]/70" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setAutoPlan(!autoPlan)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          autoPlan ? 'bg-[#19c37d]' : 'bg-[#4d4d4d]'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform shadow-sm ${
                            autoPlan ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-[13px] leading-5 text-[#ececec]/70 min-w-[32px]">
                        {autoPlan ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discovery Settings Modal */}
      <DiscoverySettingsModal 
        isOpen={showDiscoverySettings}
        onClose={() => setShowDiscoverySettings(false)}
        promptEnhancement={promptEnhancement}
        onPromptEnhancementChange={setPromptEnhancement}
        targetSize={targetSize}
        onTargetSizeChange={setTargetSize}
      />

      {/* Model Picker Modal */}
      {showModelPicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModelPicker(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[560px] bg-[#1a1a1a] border border-white/10 rounded-[12px] shadow-2xl p-6">
            <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white mb-4">
              Select Model
            </h2>
            
            <div className="space-y-2">
              {/* GPT Models */}
              <div className="mb-4">
                <h3 className="text-[12px] font-semibold leading-[18px] tracking-[-0.32px] text-white/60 mb-2 px-1">
                  GPT MODELS
                </h3>
                <div className="space-y-1">
                  {availableModels.slice(0, 3).map((model) => (
                    <button
                      key={model.name}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelPicker(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                        selectedModel.name === model.name
                          ? 'bg-[#40C977]/10 border border-[#40C977]/30 text-white'
                          : 'bg-white/5 border border-transparent text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">{model.name}</div>
                        <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">{model.description}</div>
                      </div>
                      {selectedModel.name === model.name && (
                        <IconCheckmark className="size-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Models */}
              <div>
                <h3 className="text-[12px] font-semibold leading-[18px] tracking-[-0.32px] text-white/60 mb-2 px-1">
                  OTHER MODELS
                </h3>
                <div className="space-y-1">
                  {availableModels.slice(3).map((model) => (
                    <button
                      key={model.name}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelPicker(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                        selectedModel.name === model.name
                          ? 'bg-[#40C977]/10 border border-[#40C977]/30 text-white'
                          : 'bg-white/5 border border-transparent text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">{model.name}</div>
                        <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">{model.description}</div>
                      </div>
                      {selectedModel.name === model.name && (
                        <IconCheckmark className="size-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mode Selector Modal */}
      {showModeSelector && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModeSelector(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-16 right-4 z-50 w-[960px] bg-[#1a1a1a] border border-white/10 rounded-[16px] shadow-2xl overflow-hidden">
            <div className="flex h-[600px]">
              {/* Left Side - Mode Details */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <IconSettings className="size-5 text-white/60" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white">
                      {previewMode.name}
                    </h2>
                    <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {previewMode.subtitle}
                    </p>
                  </div>
                </div>

                {/* Context Configuration */}
                <div className="mb-8">
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                    Context Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Mode · <span className="text-white">{previewMode.contextConfig.mode}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Selected Files · <span className="text-white">{previewMode.contextConfig.selectedFiles}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        File Tree · <span className="text-white">{previewMode.contextConfig.fileTree}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Code Map · <span className="text-white">{previewMode.contextConfig.codeMap}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg col-span-2">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Git Diff · <span className="text-white">{previewMode.contextConfig.gitDiff}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* When to use */}
                <div className="mb-8">
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                    When to use
                  </h3>
                  <ul className="space-y-2">
                    {previewMode.whenToUse.map((item, index) => (
                      <li key={index} className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80 flex items-start gap-2">
                        <span className="text-white/60">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* About this mode */}
                <div>
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                    About this mode
                  </h3>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80">
                    {previewMode.about}
                  </p>
                </div>

                {/* Pro Edit Config Button */}
                {previewMode.id === 'pro-edit' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowProEditConfig(true)}
                      className="px-4 py-2 bg-[#2f7a4f] hover:bg-[#2f7a4f]/80 text-white rounded-lg transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                    >
                      Pro Edit Config
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side - Mode List */}
              <div className="w-[360px] bg-[#0d0d0d] border-l border-white/10 p-6">
                <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                  Standard Modes
                </h3>
                <div className="space-y-2">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode)}
                      onMouseEnter={() => handleModeHover(mode)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                        selectedMode.id === mode.id
                          ? mode.id === 'manual'
                            ? 'bg-[#48AAFF]/10 border-2 border-[#48AAFF] text-white'
                            : 'bg-[#40C977]/10 border border-[#40C977]/30 text-white'
                          : 'bg-white/5 border border-transparent text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                        {mode.name}
                      </span>
                      {selectedMode.id === mode.id && (
                        <IconCheckmark className="size-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pro Edit Config Settings Panel */}
      {showProEditConfig && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setShowProEditConfig(false)}
          />
          
          {/* Settings Panel */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[720px] bg-[#171717] border border-white/10 rounded-[12px] shadow-2xl p-8">
            {/* Header */}
            <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white mb-4">
              Pro Edit Settings
            </h2>

            {/* Status Message */}
            <div className="flex items-center gap-2 mb-4">
              <IconCheckmark className="size-4 text-[#40C977]" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[#40C977]">
                Pro Edits currently using Agent mode
              </span>
            </div>

            {/* Description */}
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[#ababab] mb-6">
              Pro Edit mode uses your selected AI model to plan edits, while delegate edit agents or models apply those edits simultaneously.
            </p>

            {/* Agent/Model Toggle */}
            <div className="inline-flex items-center gap-0 bg-[#2a2a2a] rounded-lg p-1 mb-6">
              <button
                onClick={() => setProEditMode('agent')}
                className={`px-4 py-1.5 rounded-md transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px] ${
                  proEditMode === 'agent'
                    ? 'bg-[#2f7a4f] text-white'
                    : 'text-[#ababab] hover:text-white'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => setProEditMode('model')}
                className={`px-4 py-1.5 rounded-md transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px] ${
                  proEditMode === 'model'
                    ? 'bg-[#2f7a4f] text-white'
                    : 'text-[#ababab] hover:text-white'
                }`}
              >
                Model
              </button>
            </div>

            {/* Agent Configuration */}
            {proEditMode === 'agent' && (
              <div>
                <h3 className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-white mb-2">
                  Agent Configuration
                </h3>
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[#ababab] mb-4">
                  Runs a headless agent for each file to apply edits in parallel within a sandbox.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Agent Dropdown */}
                  <div>
                    <label className="block text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[#ababab] mb-2">
                      Agent
                    </label>
                    <div className="relative">
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        <option value="Codex CLI">Codex CLI</option>
                        <option value="Aider">Aider</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none" />
                    </div>
                  </div>

                  {/* Model Dropdown */}
                  <div>
                    <label className="block text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[#ababab] mb-2">
                      Model
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModelConfig}
                        onChange={(e) => setSelectedModelConfig(e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        <option value="GPT-5.2 Codex Medium">GPT-5.2 Codex Medium</option>
                        <option value="GPT-5.2 Codex Large">GPT-5.2 Codex Large</option>
                        <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                      </select>
                      <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}