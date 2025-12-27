import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { 
  IconChevronDownMd,
  IconUpload,
  IconShare,
  IconSettings,
  IconCheckmark,
  IconCompose,
  IconChevronRightMd,
  IconChevronUpMd,
} from './icons/ChatGPTIcons';
import { Grid3x3, Download, PanelLeftOpen, PanelLeftClose, Sparkles } from 'lucide-react';

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
  isLegacy?: boolean;
}

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  selectedModel: ModelConfig;
  onModelChange: (model: ModelConfig) => void;
  viewMode: 'chat' | 'compose';
  onViewModeChange: (mode: 'chat' | 'compose') => void;
  headerRight?: React.ReactNode;
}

const availableModels: ModelConfig[] = [
  { name: 'Auto', shortName: 'Auto', description: 'Decides how long to think' },
  { name: 'Instant', shortName: 'Instant', description: 'Answers right away' },
  { name: 'Thinking', shortName: 'Thinking', description: 'Thinks longer for better answers' },
  { name: 'Pro', shortName: 'Pro', description: 'Research-grade intelligence' },
];

const legacyModels: ModelConfig[] = [
  { name: 'GPT-5.1 Instant', shortName: 'GPT-5.1 Instant', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-5.1 Thinking', shortName: 'GPT-5.1 Thinking', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-5.1 Pro', shortName: 'GPT-5.1 Pro', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-5 Instant', shortName: 'GPT-5 Instant', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-5 Thinking mini', shortName: 'GPT-5 Thinking mini', description: 'Thinks quickly', isLegacy: true },
  { name: 'GPT-5 Thinking', shortName: 'GPT-5 Thinking', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-5 Pro', shortName: 'GPT-5 Pro', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-4o', shortName: 'GPT-4o', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-4.1', shortName: 'GPT-4.1', description: 'Legacy model', isLegacy: true },
  { name: 'GPT-4.5', shortName: 'GPT-4.5', description: 'Legacy model', isLegacy: true },
  { name: 'o3', shortName: 'o3', description: 'Legacy model', isLegacy: true },
  { name: 'o4-mini', shortName: 'o4-mini', description: 'Legacy model', isLegacy: true },
];

export function ChatHeader({ isSidebarOpen, onSidebarToggle, selectedModel, onModelChange, viewMode, onViewModeChange, headerRight }: ChatHeaderProps) {
  const [showLegacyModels, setShowLegacyModels] = useState(false);
  const [temporaryChat, setTemporaryChat] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#303030] border-b border-white/10 px-3 py-2 flex items-center justify-between relative">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {/* Icon Buttons - Always visible */}
        <div className="flex items-center gap-0.5 bg-[#2d2d2d] rounded-lg p-0.5">
          <button 
            onClick={onSidebarToggle}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-4 text-[#AFAFAF]" />
            ) : (
              <PanelLeftOpen className="size-4 text-[#AFAFAF]" />
            )}
          </button>
          <button 
            onClick={() => onViewModeChange(viewMode === 'chat' ? 'compose' : 'chat')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              viewMode === 'compose' 
                ? 'bg-[#40C977] text-white'
                : 'hover:bg-white/10 text-[#AFAFAF]'
            }`}
          >
            <IconCompose className="size-4" />
            {viewMode === 'compose' && (
              <span className="text-[13px] leading-5 font-medium">Compose</span>
            )}
          </button>
        </div>

        {/* ChatGPT Model Selector - Radix Popover */}
        <div className="bg-[#2d2d2d] rounded-lg p-0.5">
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <button
                className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
              >
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">ChatGPT</span>
                <span className="text-[14px] text-[#AFAFAF] font-normal leading-[20px] tracking-[-0.3px]">{selectedModel.shortName}</span>
                <IconChevronDownMd className="size-3.5 text-[#AFAFAF]" />
              </button>
            </Popover.Trigger>
            
            <Popover.Portal>
              <Popover.Content
                className="w-[280px] bg-[#303030] border border-white/10 rounded-[12px] shadow-2xl overflow-hidden z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                sideOffset={8}
                align="start"
              >
                {/* Main Models */}
                <div className="py-2">
                  {availableModels.map((model) => (
                    <button
                      key={model.name}
                      onClick={() => {
                        onModelChange(model);
                        setOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left transition-all hover:bg-white/5 flex items-center justify-between ${
                        selectedModel.name === model.name ? 'bg-white/5' : ''
                      }`}
                    >
                      <div>
                        <div className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-white">{model.name}</div>
                        <div className="text-[13px] font-normal leading-[18px] tracking-[-0.32px] text-[#AFAFAF]">{model.description}</div>
                      </div>
                      {selectedModel.name === model.name && (
                        <IconCheckmark className="size-4 text-white flex-shrink-0" />
                      )}
                    </button>
                  ))}

                  {/* Legacy Models Section */}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => setShowLegacyModels(!showLegacyModels)}
                      className="w-full px-3 py-2.5 text-left transition-all hover:bg-white/5 flex items-center justify-between"
                    >
                      <span className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-white">Legacy models</span>
                      {showLegacyModels ? (
                        <IconChevronUpMd className="size-4 text-[#AFAFAF]" />
                      ) : (
                        <IconChevronDownMd className="size-4 text-[#AFAFAF]" />
                      )}
                    </button>

                    {/* Legacy Models List */}
                    {showLegacyModels && (
                      <div className="max-h-[320px] overflow-y-auto">
                        {legacyModels.map((model) => (
                          <button
                            key={model.name}
                            onClick={() => {
                              onModelChange(model);
                              setOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-left transition-all hover:bg-white/5 flex items-center justify-between ${
                              selectedModel.name === model.name ? 'bg-white/5' : ''
                            }`}
                          >
                            <div>
                              <div className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-white">{model.name}</div>
                              <div className="text-[13px] font-normal leading-[18px] tracking-[-0.32px] text-[#AFAFAF]">{model.description}</div>
                            </div>
                            {selectedModel.name === model.name && (
                              <IconCheckmark className="size-4 text-white flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Temporary Chat Toggle */}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <div className="px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-[#AFAFAF]" />
                        <span className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-white">Temporary Chat</span>
                      </div>
                      <button
                        onClick={() => setTemporaryChat(!temporaryChat)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          temporaryChat ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full transition-transform ${
                            temporaryChat ? 'translate-x-[18px] bg-[#303030]' : 'translate-x-0.5 bg-white'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* Right Side - Action Buttons - Wrapped in bubble */}
      <div className="flex items-center gap-0.5 bg-black/20 rounded-lg p-0.5">
        {/* Header Right Slot - for custom actions like share button */}
        {headerRight}
        
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <Download className="size-4 text-[#AFAFAF]" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <IconShare className="size-4 text-[#AFAFAF]" />
        </button>
      </div>
    </div>
  );
}