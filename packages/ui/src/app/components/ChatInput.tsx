import { useState } from 'react';
import { 
  IconPlusLg, 
  IconGlobe, 
  IconPaperclip, 
  IconMic, 
  IconGoFilled,
  IconX,
  IconCamera,
  IconClock,
  IconStuffTools,
  IconCompose,
  IconFolder,
  IconImage,
  IconVideo,
  IconHeadphones,
} from './icons/ChatGPTIcons';
import { Megaphone } from 'lucide-react';

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

interface ChatInputProps {
  selectedModel: ModelConfig;
}

export function ChatInput({ selectedModel }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeTag, setActiveTag] = useState('Work with Terminal Tab');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isResearchEnabled, setIsResearchEnabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-white/10 bg-[#212121] p-4">
      {/* Active Context Tag */}
      {activeTag && (
        <div className="mb-3 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-[#40C977]/20 text-[#40C977] px-3 py-1.5 rounded-lg text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
            <IconCompose className="size-3.5" />
            <span>{activeTag}</span>
            <button 
              onClick={() => setActiveTag('')}
              className="hover:bg-[#40C977]/30 rounded-full p-0.5 transition-colors"
            >
              <IconX className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-[#2C2C2C] border border-white/10 rounded-[16px] overflow-hidden shadow-lg">
          {/* Input Area */}
          <div className="px-4 py-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
              rows={1}
              className="w-full bg-transparent text-white placeholder:text-white/40 resize-none focus:outline-none text-[16px] font-normal leading-[24px] tracking-[-0.32px]"
              style={{ 
                minHeight: '24px',
                maxHeight: '200px',
                height: 'auto'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.metaKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
            {/* Left Actions */}
            <div className="flex items-center gap-1 relative">
              <button 
                type="button"
                onClick={() => setShowUploadMenu(!showUploadMenu)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="Add attachment"
              >
                <IconPlusLg className="size-4 text-white/60 group-hover:text-white" />
              </button>
              
              {/* Upload Menu Dropdown */}
              {showUploadMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-[100]" 
                    onClick={() => setShowUploadMenu(false)}
                  />
                  <div className="absolute bottom-full left-0 mb-2 z-[101] bg-[#2C2C2C] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Upload file');
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                    >
                      <IconFolder className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Upload file</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Upload photo');
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                    >
                      <IconImage className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Upload photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Take screenshot');
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                    >
                      <IconVideo className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Take screenshot</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Take photo');
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                    >
                      <IconCamera className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Take photo</span>
                    </button>
                  </div>
                </>
              )}
              
              <button 
                type="button"
                onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                  isSearchEnabled 
                    ? 'bg-[#1B72E8]/20 text-[#5A9EF4]' 
                    : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
                title="Browse web"
              >
                <IconGlobe className={`size-4 ${isSearchEnabled ? 'text-[#5A9EF4]' : ''}`} />
                {isSearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Search
                  </span>
                )}
              </button>

              <button 
                type="button"
                onClick={() => setIsResearchEnabled(!isResearchEnabled)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                  isResearchEnabled 
                    ? 'bg-[#1B72E8]/20 text-[#5A9EF4]' 
                    : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
                title="Research"
              >
                <Megaphone className={`size-4 ${isResearchEnabled ? 'text-[#5A9EF4]' : ''}`} />
                {isResearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Research
                  </span>
                )}
              </button>
              
              <button 
                type="button"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="Tools"
              >
                <IconStuffTools className="size-4 text-white/60 group-hover:text-white" />
              </button>

              {/* Model Badge */}
              <div className="ml-2 px-2 py-1 bg-[#1B72E8]/20 rounded text-[12px] text-[#5A9EF4] font-normal leading-[18px] tracking-[-0.32px]">
                {selectedModel.shortName}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button 
                type="button"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="History"
              >
                <IconClock className="size-4 text-white/60 group-hover:text-white" />
              </button>

              {/* Voice input */}
              <button 
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg transition-colors group ${
                  isRecording ? 'bg-[#FF8583]/20' : 'hover:bg-white/5'
                }`}
                title="Voice input"
              >
                <IconMic className={`size-4 ${
                  isRecording ? 'text-[#FF8583]' : 'text-white/60 group-hover:text-white'
                }`} />
              </button>

              {/* Advanced features with purple gradient */}
              <button 
                type="button"
                className="p-2 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-full transition-all hover:opacity-90"
                title="Advanced features"
              >
                <IconHeadphones className="size-4 text-white" />
              </button>

              {/* Send button */}
              <button 
                type="submit"
                disabled={!message.trim()}
                className="ml-1 p-2 bg-white text-[#0D0D0D] rounded-full hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Send message (⌘+Enter or ⇧+Enter)"
              >
                <IconGoFilled className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
