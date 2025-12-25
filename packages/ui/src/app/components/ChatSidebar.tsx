import { useState } from 'react';
import { 
  IconSearch, 
  IconPlusLg, 
  IconChevronRightMd, 
  IconDotsHorizontal,
  IconX,
  IconSettings,
  IconCloseBold,
  IconChat,
  IconFolder,
  IconBarChart,
  IconBook,
  IconCompose,
  IconWriting,
} from './icons/ChatGPTIcons';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { IconPickerModal } from './IconPickerModal';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const quickActions: SidebarItem[] = [
  { id: 'chatgpt', label: 'ChatGPT', icon: <IconChat className="size-4" /> },
  { id: 'gpts', label: 'GPTs', icon: <IconChevronRightMd className="size-4" /> },
  { id: 'new-project', label: 'New project', icon: <IconFolder className="size-4" /> },
];

const projects: SidebarItem[] = [
  { id: 'apps-sdk', label: 'Apps SDK Designer', icon: <IconWriting className="size-4" />, color: 'text-[#BA8FF7]' },
  { id: 'dadmode', label: 'DADMODE', icon: <IconBarChart className="size-4" />, color: 'text-[#40C977]' },
  { id: 'peer', label: 'PEER Framework', icon: <IconFolder className="size-4" />, color: 'text-[#FF9E6C]' },
];

const chatHistory = [
  'Greeting exchange',
  'Storybook and Apps SDK UI',
  'Conversation start',
  'Your Year with ChatGPT',
  'CRMO explanation and sensitivity',
  'Project governance complexity',
  'React Component Explorers',
  'Clone SwiftUI macOS App',
  'Apps SDK UI examples',
  'Governance framework expansion',
  'New chat',
  'Bobblehead figurine design',
  'Plushie transformation concept',
  'Plushie-style transformation',
  '3D pencil sketch generation',
  'Assistant response clarification',
  'Learn Year 7 Maths',
];

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('chatgpt');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedProjectForIcon, setSelectedProjectForIcon] = useState<SidebarItem | null>(null);
  const [projectsData, setProjectsData] = useState<SidebarItem[]>(projects);
  const [newProjectIcon, setNewProjectIcon] = useState('folder');
  const [newProjectColor, setNewProjectColor] = useState('text-white/60');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [memoryOption, setMemoryOption] = useState<'default' | 'project-only'>('default');
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = ['Investing', 'Homework', 'Writing', 'Coding', 'Research'];

  const categoryIcons = {
    'Investing': <IconBarChart className="size-3" />,
    'Homework': <IconBook className="size-3" />,
    'Writing': <IconWriting className="size-3" />,
    'Coding': <IconCompose className="size-3" />,
    'Research': <IconSearch className="size-3" />,
  };

  const categoryColors = {
    'Investing': 'bg-[#40C977]/20 text-[#40C977] border-[#40C977]/30',
    'Homework': 'bg-[#48AAFF]/20 text-[#48AAFF] border-[#48AAFF]/30',
    'Writing': 'bg-[#BA8FF7]/20 text-[#BA8FF7] border-[#BA8FF7]/30',
    'Coding': 'bg-[#FF9E6C]/20 text-[#FF9E6C] border-[#FF9E6C]/30',
    'Research': 'bg-[#FF8FB3]/20 text-[#FF8FB3] border-[#FF8FB3]/30',
  };

  const handleNewChat = (actionId: string) => {
    setSelectedAction(actionId);
    console.log('Starting new chat with:', actionId);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // Update project name based on selected categories
      setProjectName(newCategories.join(' '));
      
      return newCategories;
    });
  };

  const handleCreateProject = () => {
    console.log('Creating project:', { name: projectName, categories: selectedCategories });
    setProjectName('');
    setSelectedCategories([]);
    setShowProjectModal(false);
  };

  const handleIconChange = (iconId: string, color: string) => {
    if (selectedProjectForIcon) {
      // Map iconId to the corresponding icon component
      const iconMap: { [key: string]: React.ReactNode } = {
        'folder': <IconFolder className="size-4" />,
        'chat': <IconChat className="size-4" />,
        'bar-chart': <IconBarChart className="size-4" />,
        'writing': <IconWriting className="size-4" />,
        'book': <IconBook className="size-4" />,
        'compose': <IconCompose className="size-4" />,
        // Add more mappings as needed
      };

      const newIcon = iconMap[iconId] || <IconFolder className="size-4" />;
      
      const updatedProjects = projectsData.map(project => 
        project.id === selectedProjectForIcon.id 
          ? { ...project, icon: newIcon, color } 
          : project
      );
      setProjectsData(updatedProjects);
    }
    setShowIconPicker(false);
    setSelectedProjectForIcon(null);
  };

  const handleNewProjectIconChange = (iconId: string, color: string) => {
    setNewProjectIcon(iconId);
    setNewProjectColor(color);
    setShowIconPicker(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`bg-[#212121] text-white flex flex-col h-full border-r border-white/10 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        {/* Header */}
        <div className="p-3 space-y-3">
          {/* Window Controls */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-[#FF5F56]" />
              <div className="size-3 rounded-full bg-[#FFBD2E]" />
              <div className="size-3 rounded-full bg-[#27C93F]" />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 font-normal leading-[20px] tracking-[-0.3px]"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-3 space-y-0.5">
          <button 
            onClick={() => handleNewChat('chatgpt')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              selectedAction === 'chatgpt' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <IconChat className="size-4 flex-shrink-0" />
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">ChatGPT</span>
          </button>
          <button 
            onClick={() => setShowProjectModal(true)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              selectedAction === 'new-project' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <IconFolder className="size-4 flex-shrink-0" />
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">New project</span>
          </button>
          
          {/* Projects List */}
          {(projectsExpanded ? projectsData : projectsData.slice(0, 3)).map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedAction(project.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                selectedAction === project.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProjectForIcon(project);
                  setShowIconPicker(true);
                }}
                className={`flex-shrink-0 ${project.color} hover:opacity-70 transition-opacity cursor-pointer`}
              >
                {project.icon}
              </div>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">{project.label}</span>
            </button>
          ))}
          
          {projectsData.length > 3 && (
            <button 
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <IconDotsHorizontal className="size-4 flex-shrink-0" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                {projectsExpanded ? 'See less' : 'See more'}
              </span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 my-2 border-t border-white/10" />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <div className="px-3 pb-2 text-[11px] text-white/40 font-medium tracking-wide uppercase">
            Recent
          </div>
          {chatHistory
            .filter((chat) => chat.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((chat, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-[14px] text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors line-clamp-1 font-normal leading-[20px] tracking-[-0.3px]"
              >
                {chat}
              </button>
            ))}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-white/10 relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
            <span className="text-[14px] truncate font-normal leading-[20px] tracking-[-0.3px]">Jamie Scott Craik</span>
          </button>
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#2a2a2a] border border-white/20 rounded-xl shadow-2xl py-1 z-50">
              {/* Account Type */}
              <div className="px-3 py-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span className="text-white/70 font-normal">PRO/Veteran/Lik</span>
                </div>
              </div>
              
              {/* Personal Account */}
              <button className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-2">
                <svg className="size-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">Personal account</span>
              </button>
              
              {/* Settings */}
              <button className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-2">
                <IconSettings className="size-4 text-white/70" />
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">Settings</span>
              </button>
              
              {/* Divider */}
              <div className="my-1 border-t border-white/10" />
              
              {/* Log Out */}
              <button className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors">
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 z-50" onClick={() => setShowProjectModal(false)}>
            <div className="bg-[#2a2a2a] border border-white/20 text-white p-0 rounded-[12px] w-[420px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-5">
                <p className="text-[13px] text-[#ababab] leading-[18px] tracking-[-0.32px] font-normal text-center">
                  Projects give ChatGPT shared context<br />
                  across chats and files, all in one place.
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-6 pb-6">
                {/* Project Name Input */}
                <div className="relative mb-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIconPicker(true);
                    }}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity ${newProjectColor}`}
                  >
                    {(() => {
                      const iconMap: { [key: string]: React.ReactNode } = {
                        'folder': <IconFolder className="size-4" />,
                        'chat': <IconChat className="size-4" />,
                        'bar-chart': <IconBarChart className="size-4" />,
                        'writing': <IconWriting className="size-4" />,
                        'book': <IconBook className="size-4" />,
                        'compose': <IconCompose className="size-4" />,
                      };
                      return iconMap[newProjectIcon] || <IconFolder className="size-4" />;
                    })()}
                  </button>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-[#404040] border border-transparent rounded-lg pl-10 pr-3 py-3 text-[14px] text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-normal leading-[20px] tracking-[-0.3px]"
                  />
                </div>

                {/* Category Tags */}
                <div className="mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      
                      // Icon color mapping
                      const iconColorMap = {
                        'Investing': 'text-[#40C977]',
                        'Homework': 'text-[#48AAFF]',
                        'Writing': 'text-[#BA8FF7]',
                        'Coding': 'text-[#FF9E6C]',
                        'Research': 'text-[#FF8FB3]',
                      };
                      
                      return (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] border transition-all whitespace-nowrap flex-shrink-0 font-normal leading-[20px] tracking-[-0.3px] ${
                            isSelected 
                              ? categoryColors[category as keyof typeof categoryColors]
                              : 'bg-[#404040] text-white border-white/20 hover:bg-[#4a4a4a]'
                          }`}
                        >
                          <span className={iconColorMap[category as keyof typeof iconColorMap]}>
                            {categoryIcons[category as keyof typeof categoryIcons]}
                          </span>
                          <span>{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateProject}
                  disabled={!projectName.trim()}
                  className="w-full bg-[#2f7a4f] hover:bg-[#2f7a4f]/80 disabled:bg-[#404040] disabled:text-white/40 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                >
                  Create project
                </button>

                {/* More Options Button */}
                <button 
                  onClick={() => setShowMoreOptions(true)}
                  className="w-full bg-[#404040] hover:bg-[#4a4a4a] text-white py-3 rounded-lg mt-2 transition-colors text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                >
                  More options
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Icon Picker Modal */}
        {showIconPicker && selectedProjectForIcon && (
          <IconPickerModal
            isOpen={showIconPicker}
            onClose={() => {
              setShowIconPicker(false);
              setSelectedProjectForIcon(null);
            }}
            onSave={handleIconChange}
            currentColor={selectedProjectForIcon.color}
            projectName={selectedProjectForIcon.label}
          />
        )}

        {/* Icon Picker for New Project */}
        {showIconPicker && !selectedProjectForIcon && (
          <IconPickerModal
            isOpen={showIconPicker}
            onClose={() => {
              setShowIconPicker(false);
              setShowMoreOptions(false);
            }}
            onSave={handleNewProjectIconChange}
            currentColor={newProjectColor}
            projectName={projectName || 'New Project'}
          />
        )}

        {/* Project Settings Modal */}
        {showMoreOptions && !showIconPicker && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowMoreOptions(false)}>
            <div className="bg-[#2a2a2a] border border-white/20 text-white rounded-[16px] w-[380px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 pt-5 pb-4">
                <h2 className="text-[18px] font-medium text-white leading-[24px] tracking-[-0.32px]">
                  Project settings
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                {/* Memory Section */}
                <div className="mb-6">
                  <h3 className="text-[14px] text-white/70 mb-3 font-normal leading-[20px] tracking-[-0.3px]">
                    Memory
                  </h3>
                  
                  {/* Default Option */}
                  <button
                    onClick={() => setMemoryOption('default')}
                    className={`w-full text-left p-4 rounded-xl mb-2 border transition-all ${
                      memoryOption === 'default'
                        ? 'bg-[#2f7a4f]/10 border-[#2f7a4f]'
                        : 'bg-[#404040]/40 border-white/10 hover:bg-[#404040]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-[14px] font-medium text-white leading-[20px] tracking-[-0.3px]">
                        Default
                      </span>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        memoryOption === 'default'
                          ? 'border-[#2f7a4f]'
                          : 'border-white/30'
                      }`}>
                        {memoryOption === 'default' && (
                          <div className="size-2 rounded-full bg-[#2f7a4f]" />
                        )}
                      </div>
                    </div>
                    <p className="text-[13px] text-white/60 leading-[18px] tracking-[-0.32px] font-normal">
                      Project can access memories from outside chats, and vice versa.
                    </p>
                  </button>

                  {/* Project-only Option */}
                  <button
                    onClick={() => setMemoryOption('project-only')}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      memoryOption === 'project-only'
                        ? 'bg-[#2f7a4f]/10 border-[#2f7a4f]'
                        : 'bg-[#404040]/40 border-white/10 hover:bg-[#404040]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-[14px] font-medium text-white leading-[20px] tracking-[-0.3px]">
                        Project-only
                      </span>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        memoryOption === 'project-only'
                          ? 'border-[#2f7a4f]'
                          : 'border-white/30'
                      }`}>
                        {memoryOption === 'project-only' && (
                          <div className="size-2 rounded-full bg-[#2f7a4f]" />
                        )}
                      </div>
                    </div>
                    <p className="text-[13px] text-white/60 leading-[18px] tracking-[-0.32px] font-normal">
                      Project can only access its own memories. Its memories are hidden from outside chats.
                    </p>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                <button
                  onClick={() => setShowMoreOptions(false)}
                  className="px-4 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-normal leading-[20px] tracking-[-0.3px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Memory option:', memoryOption);
                    setShowMoreOptions(false);
                  }}
                  className="px-4 py-2 text-[14px] bg-white text-black hover:bg-white/90 rounded-lg transition-colors font-medium leading-[20px] tracking-[-0.3px]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}