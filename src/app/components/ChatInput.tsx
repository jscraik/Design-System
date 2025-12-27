import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
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
  IconTelescope,
  IconOperator,
} from './icons/ChatGPTIcons';

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

interface ChatInputProps {
  selectedModel: ModelConfig;
  composerLeft?: React.ReactNode;
  composerRight?: React.ReactNode;
}

export function ChatInput({ selectedModel, composerLeft, composerRight }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeTag, setActiveTag] = useState('Work with Terminal Tab');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isResearchEnabled, setIsResearchEnabled] = useState(false);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

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
        <div className="bg-[#303030] border border-white/10 rounded-[20px] overflow-hidden shadow-lg">
          {/* Input Area */}
          <div className="px-4 py-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
              rows={1}
              className="w-full bg-transparent text-white placeholder:text-[#AFAFAF] resize-none focus:outline-none text-[16px] font-normal leading-[24px] tracking-[-0.32px]"
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
              <Popover.Root modal={false} open={uploadMenuOpen} onOpenChange={setUploadMenuOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors group data-[state=open]:bg-[#1B72E8]/20"
                    title="Add attachment"
                  >
                    <IconPlusLg className="size-4 text-[#AFAFAF] group-hover:text-white data-[state=open]:text-[#5A9EF4]" />
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="top"
                    align="start"
                    sideOffset={10}
                    className="z-[60] w-[200px] rounded-lg border border-white/10 bg-[#2C2C2C] shadow-2xl outline-none"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Upload file');
                        setUploadMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group first:rounded-t-lg"
                    >
                      <IconFolder className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Upload file</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Upload photo');
                        setUploadMenuOpen(false);
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
                        setUploadMenuOpen(false);
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
                        setUploadMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:bg-[#40C977] transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group last:rounded-b-lg"
                    >
                      <IconCamera className="size-4 text-white/60 group-hover:text-white" />
                      <span className="group-hover:text-white">Take photo</span>
                    </button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              
              <button 
                type="button"
                onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                  isSearchEnabled 
                    ? 'bg-[#1B72E8]/20 text-[#5A9EF4]' 
                    : 'hover:bg-white/5 text-[#AFAFAF] hover:text-white'
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
                    : 'hover:bg-white/5 text-[#AFAFAF] hover:text-white'
                }`}
                title="Research"
              >
                <IconTelescope className={`size-4 ${isResearchEnabled ? 'text-[#5A9EF4]' : ''}`} />
                {isResearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Research
                  </span>
                )}
              </button>
              
              <Popover.Root modal={false}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="p-2 rounded-lg transition-colors group hover:bg-white/5 data-[state=open]:bg-[#1B72E8]/20 data-[state=open]:border data-[state=open]:border-[#1B72E8]/40"
                    title="Tools"
                  >
                    <IconOperator className="size-4 text-white/60 group-hover:text-white data-[state=open]:text-[#5A9EF4]" />
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="top"
                    align="start"
                    sideOffset={10}
                    className="z-[60] w-[280px] rounded-xl border border-white/10 bg-[#303030] shadow-2xl outline-none"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-white/50 font-normal leading-[18px] tracking-[-0.3px]">
                          Work With
                        </span>
                        <svg className="size-3.5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="px-3 pb-2">
                      <div className="relative">
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 font-normal leading-[18px] tracking-[-0.3px]"
                        />
                      </div>
                    </div>

                    {/* Apps List - Scrollable */}
                    <div className="px-2 pb-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                      {/* Terminal - Running */}
                      <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-center size-5 text-white/70">
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-white font-normal leading-[18px] tracking-[-0.3px]">
                            Terminal
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Add Terminal');
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                        >
                          Add
                        </button>
                      </div>

                      {/* Code - Not running */}
                      <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-center size-5">
                          <svg className="size-4 text-[#5A9EF4]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] text-white font-normal leading-[18px] tracking-[-0.3px]">
                              Code
                            </span>
                            <span className="text-[11px] text-white/40 font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                              • Not running
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Open Code');
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                        >
                          Open app
                        </button>
                      </div>

                      {/* Code - Insiders */}
                      <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-center size-5">
                          <svg className="size-4 text-[#5A9EF4]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] text-white font-normal leading-[18px] tracking-[-0.3px]">
                              Code - Insiders
                            </span>
                            <span className="text-[11px] text-white/40 font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                              • Not running
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Open Code Insiders');
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                        >
                          Open app
                        </button>
                      </div>

                      {/* Notes */}
                      <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-center size-5">
                          <svg className="size-4 text-[#F5C542]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] text-white font-normal leading-[18px] tracking-[-0.3px]">
                              Notes
                            </span>
                            <span className="text-[11px] text-white/40 font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                              • Not running
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Open Notes');
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                        >
                          Open app
                        </button>
                      </div>

                      {/* Script Editor */}
                      <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-center size-5">
                          <svg className="size-4 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] text-white font-normal leading-[18px] tracking-[-0.3px]">
                              Script Editor
                            </span>
                            <span className="text-[11px] text-white/40 font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                              • Not running
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Open Script Editor');
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                        >
                          Open app
                        </button>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              {/* Model Badge */}
              <div className="ml-2 px-2 py-1 bg-[#1B72E8]/20 rounded text-[12px] text-[#5A9EF4] font-normal leading-[18px] tracking-[-0.32px]">
                {selectedModel.shortName}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Composer Right Slot - highest ROI for customization */}
              {composerRight}
              
              <button 
                type="button"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="History"
              >
                <IconClock className="size-4 text-[#AFAFAF] group-hover:text-white" />
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
                  isRecording ? 'text-[#FF8583]' : 'text-[#AFAFAF] group-hover:text-white'
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
