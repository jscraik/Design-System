import { useState } from 'react';
import { 
  IconChevronDownMd,
  IconUpload,
  IconShare,
  IconSettings,
  IconCheckmark,
  IconCompose,
} from './icons/ChatGPTIcons';
import { Grid3x3, Download, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  selectedModel: ModelConfig;
  onModelChange: (model: ModelConfig) => void;
  viewMode: 'chat' | 'compose';
  onViewModeChange: (mode: 'chat' | 'compose') => void;
}

const availableModels: ModelConfig[] = [
  { name: 'ChatGPT 5.2 Pro', shortName: '5.2 Pro', description: 'Our most capable model' },
  { name: 'ChatGPT 4o', shortName: '4o', description: 'Fast and efficient' },
  { name: 'ChatGPT 4o mini', shortName: '4o mini', description: 'Lightweight and quick' },
  { name: 'Claude 3.5 Sonnet', shortName: 'Claude', description: 'Anthropic\'s latest model' },
  { name: 'Gemini Pro', shortName: 'Gemini', description: 'Google\'s advanced model' },
];

export function ChatHeader({ isSidebarOpen, onSidebarToggle, selectedModel, onModelChange, viewMode, onViewModeChange }: ChatHeaderProps) {
  const [showModelPicker, setShowModelPicker] = useState(false);

  return (
    <div className="bg-[#2C2C2C] border-b border-white/10 px-3 py-2 flex items-center justify-between relative">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {/* Icon Buttons - Always visible */}
        <div className="flex items-center gap-0.5 bg-[#2d2d2d] rounded-lg p-0.5">
          <button 
            onClick={onSidebarToggle}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-4 text-white/60" />
            ) : (
              <PanelLeftOpen className="size-4 text-white/60" />
            )}
          </button>
          <button 
            onClick={() => onViewModeChange(viewMode === 'chat' ? 'compose' : 'chat')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              viewMode === 'compose' 
                ? 'bg-[#2f7a4f] text-white' 
                : 'hover:bg-white/10 text-white/60'
            }`}
          >
            <IconCompose className="size-4" />
            {viewMode === 'compose' && (
              <span className="text-[13px] leading-5 font-medium">Compose</span>
            )}
          </button>
        </div>

        {/* ChatGPT Model Selector - Wrapped in bubble */}
        <div className="bg-[#2d2d2d] rounded-lg p-0.5">
          <button 
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
          >
            <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">ChatGPT</span>
            <span className="text-[14px] text-white/60 font-normal leading-[20px] tracking-[-0.3px]">{selectedModel.shortName}</span>
            <IconChevronDownMd className="size-3.5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Right Side - Action Buttons - Wrapped in bubble */}
      <div className="flex items-center gap-0.5 bg-black/20 rounded-lg p-0.5">
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <Download className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <IconShare className="size-4 text-white/60" />
        </button>
      </div>

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
                        onModelChange(model);
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
                        onModelChange(model);
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
    </div>
  );
}