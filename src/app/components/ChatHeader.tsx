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
import Vector from '../../imports/Vector-311-222';

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
    <div className="bg-[#212121] border-b border-white/10 px-3 py-2 flex items-center justify-between relative">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {/* Icon Buttons - Always visible */}
        <div className="flex items-center gap-0.5 bg-[#2d2d2d] rounded-lg p-0.5 outline-none">
          <button 
            onClick={onSidebarToggle}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <div className="size-4">
              <Vector />
            </div>
          </button>
          <button 
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <svg className="size-4 text-[#AFAFAF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z" fill="currentColor"/>
            </svg>
          </button>
          <button 
            onClick={() => onViewModeChange(viewMode === 'chat' ? 'compose' : 'chat')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
              viewMode === 'compose' 
                ? 'bg-[#2d2d2d] border border-[#5B8FC4] text-[#5B8FC4]' 
                : 'bg-[#2d2d2d] border border-transparent text-[#AFAFAF] hover:border-white/20'
            }`}
          >
            <svg className={`size-4 ${viewMode === 'compose' ? 'text-[#5B8FC4]' : 'text-[#AFAFAF]'}`} fill="none" viewBox="0 0 24 24">
              <path d="M12 4C11.5858 4 11.25 4.33579 11.25 4.75C11.25 5.16421 11.5858 5.5 12 5.5C12.4142 5.5 12.75 5.16421 12.75 4.75C12.75 4.33579 12.4142 4 12 4ZM9.25 4.75C9.25 3.23122 10.4812 2 12 2C13.5188 2 14.75 3.23122 14.75 4.75C14.75 6.26878 13.5188 7.5 12 7.5C10.4812 7.5 9.25 6.26878 9.25 4.75ZM6.09632 7.72548C5.7376 7.51837 5.2789 7.64128 5.0718 8C4.86469 8.35872 4.9876 8.81741 5.34632 9.02452C5.70504 9.23163 6.16373 9.10872 6.37084 8.75C6.57794 8.39128 6.45504 7.93259 6.09632 7.72548ZM3.33975 7C4.09914 5.6847 5.78101 5.23404 7.09632 5.99343C8.41162 6.75282 8.86228 8.4347 8.10289 9.75C7.34349 11.0653 5.66162 11.516 4.34632 10.7566C3.03101 9.99718 2.58035 8.31531 3.33975 7ZM18.928 8.00008C18.7209 7.64136 18.2622 7.51845 17.9035 7.72556C17.5448 7.93267 17.4219 8.39136 17.629 8.75008C17.8361 9.1088 18.2948 9.23171 18.6535 9.0246C19.0122 8.81749 19.1351 8.3588 18.928 8.00008ZM16.9035 5.99351C18.2188 5.23412 19.9007 5.68478 20.66 7.00008C21.4194 8.31539 20.9688 9.99726 19.6535 10.7567C18.3382 11.516 16.6563 11.0654 15.8969 9.75008C15.1375 8.43478 15.5882 6.7529 16.9035 5.99351ZM12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5ZM8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12ZM18.6537 14.9755C18.295 14.7684 17.8363 14.8913 17.6292 15.25C17.4221 15.6087 17.545 16.0674 17.9037 16.2745C18.2624 16.4816 18.7211 16.3587 18.9282 16C19.1353 15.6413 19.0124 15.1826 18.6537 14.9755ZM15.8971 14.25C16.6565 12.9347 18.3384 12.484 19.6537 13.2434C20.969 14.0028 21.4196 15.6847 20.6603 17C19.9009 18.3153 18.219 18.766 16.9037 18.0066C15.5884 17.2472 15.1377 15.5653 15.8971 14.25ZM6.37063 15.2501C6.16352 14.8914 5.70483 14.7685 5.34611 14.9756C4.98739 15.1827 4.86449 15.6414 5.07159 16.0001C5.2787 16.3588 5.73739 16.4817 6.09611 16.2746C6.45483 16.0675 6.57774 15.6088 6.37063 15.2501ZM4.34611 13.2435C5.66142 12.4841 7.34329 12.9348 8.10268 14.2501C8.86207 15.5654 8.41142 17.2473 7.09611 18.0066C5.78081 18.766 4.09893 18.3154 3.33954 17.0001C2.58015 15.6848 3.03081 14.0029 4.34611 13.2435ZM12 18.5C11.5858 18.5 11.25 18.8358 11.25 19.25C11.25 19.6642 11.5858 20 12 20C12.4142 20 12.75 19.6642 12.75 19.25C12.75 18.8358 12.4142 18.5 12 18.5ZM9.25 19.25C9.25 17.7312 10.4812 16.5 12 16.5C13.5188 16.5 14.75 17.7312 14.75 19.25C14.75 20.7688 13.5188 22 12 22C10.4812 22 9.25 20.7688 9.25 19.25Z" fill="currentColor" />
            </svg>
            {viewMode === 'compose' && (
              <span className="text-[13px] leading-5 font-medium">Compose</span>
            )}
          </button>
        </div>

        {/* ChatGPT Model Selector - Radix Popover */}
        {viewMode === 'chat' && (
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
        )}
      </div>

      {/* Right side: Model selector and action buttons */}
      <div className="flex items-center gap-2">
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