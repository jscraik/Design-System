import { useState } from "react";

import {
  IconBarChart,
  IconBook,
  IconCalendar,
  IconCamera,
  IconChat,
  IconClock,
  IconCompass,
  IconEdit,
  IconEmail,
  IconFlag,
  IconFlask,
  IconFolder,
  IconGlobe,
  IconHeadphones,
  IconImage,
  IconLightBulb,
  IconMapPin,
  IconMic,
  IconNotebook,
  IconPhone,
  IconPin,
  IconSettings,
  IconStar,
  IconStuffTools,
  IconTerminal,
  IconTrash,
  IconVideo,
  IconWriting,
} from "../icons/ChatGPTIcons";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcon?: React.ReactNode;
  currentColor?: string;
  onSave: (icon: string, color: string) => void;
  projectName: string;
}

const colors = [
  { id: "gray", value: "text-white/60", bg: "bg-white/60" },
  {
    id: "blue",
    value: "text-foundation-accent-blue",
    bg: "bg-foundation-accent-blue",
  },
  {
    id: "green",
    value: "text-foundation-accent-green",
    bg: "bg-foundation-accent-green",
  },
  {
    id: "orange",
    value: "text-foundation-accent-orange",
    bg: "bg-foundation-accent-orange",
  },
  {
    id: "red",
    value: "text-foundation-accent-red",
    bg: "bg-foundation-accent-red",
  },
];

const icons = [
  { id: "folder", component: IconFolder },
  { id: "chat", component: IconChat },
  { id: "image", component: IconImage },
  { id: "edit", component: IconEdit },
  { id: "compass", component: IconCompass },
  { id: "clock", component: IconClock },
  { id: "email", component: IconEmail },
  { id: "phone", component: IconPhone },
  { id: "camera", component: IconCamera },
  { id: "mic", component: IconMic },
  { id: "video", component: IconVideo },
  { id: "headphones", component: IconHeadphones },
  { id: "trash", component: IconTrash },
  { id: "settings", component: IconSettings },
  { id: "bar-chart", component: IconBarChart },
  { id: "flask", component: IconFlask },
  { id: "lightbulb", component: IconLightBulb },
  { id: "star", component: IconStar },
  { id: "flag", component: IconFlag },
  { id: "pin", component: IconPin },
  { id: "book", component: IconBook },
  { id: "terminal", component: IconTerminal },
  { id: "notebook", component: IconNotebook },
  { id: "globe", component: IconGlobe },
  { id: "map-pin", component: IconMapPin },
  { id: "calendar", component: IconCalendar },
  { id: "writing", component: IconWriting },
  { id: "tools", component: IconStuffTools },
];

const getSelectedIconComponent = (selectedIcon: string) =>
  icons.find((icon) => icon.id === selectedIcon)?.component || IconFolder;

function ModalHeader({ projectName }: { projectName: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div>
        <h2 className="text-[16px] font-medium text-white leading-[24px] tracking-[-0.32px]">
          Choose icon
        </h2>
        <p className="text-[13px] text-white/60 mt-0.5 leading-[18px] tracking-[-0.32px]">
          {projectName}
        </p>
      </div>
    </div>
  );
}

function IconPreview({
  selectedColor,
  SelectedIconComponent,
}: {
  selectedColor: string;
  SelectedIconComponent: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className={`p-4 rounded-xl bg-white/5 ${selectedColor}`}>
        <SelectedIconComponent className="size-8" />
      </div>
    </div>
  );
}

function ColorPicker({
  selectedColor,
  onSelect,
}: {
  selectedColor: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelect(color.value)}
            className={`size-8 rounded-full transition-all ${color.bg} ${
              selectedColor === color.value
                ? "ring-2 ring-white ring-offset-2 ring-offset-foundation-bg-dark-2 scale-110"
                : "hover:scale-105"
            }`}
            title={color.id}
          />
        ))}
      </div>
    </div>
  );
}

function IconGrid({
  selectedIcon,
  selectedColor,
  onSelect,
}: {
  selectedIcon: string;
  selectedColor: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
      {icons.map((icon) => {
        const IconComponent = icon.component;
        return (
          <button
            key={icon.id}
            onClick={() => onSelect(icon.id)}
            className={`p-3 rounded-lg transition-all ${
              selectedIcon === icon.id ? "bg-white/10 scale-95" : "hover:bg-white/5"
            }`}
            title={icon.id}
          >
            <IconComponent
              className={`size-5 ${selectedIcon === icon.id ? selectedColor : "text-white/60"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ModalFooter({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
      <button
        onClick={onClose}
        className="px-4 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-normal leading-[20px] tracking-[-0.3px]"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 text-[14px] bg-foundation-accent-green text-white hover:bg-foundation-accent-green/90 rounded-lg transition-colors font-medium leading-[20px] tracking-[-0.3px]"
      >
        Done
      </button>
    </div>
  );
}

export function IconPickerModal({
  isOpen,
  onClose,
  currentColor = "text-white/60",
  onSave,
  projectName,
}: IconPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedIcon, setSelectedIcon] = useState("folder");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedIcon, selectedColor);
    onClose();
  };

  const SelectedIconComponent = getSelectedIconComponent(selectedIcon);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[400px]">
        <div className="bg-foundation-bg-dark-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <ModalHeader projectName={projectName} />
          <div className="px-6 py-6">
            <IconPreview
              selectedColor={selectedColor}
              SelectedIconComponent={SelectedIconComponent}
            />
            <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
            <IconGrid
              selectedIcon={selectedIcon}
              selectedColor={selectedColor}
              onSelect={setSelectedIcon}
            />
          </div>
          <ModalFooter onClose={onClose} onSave={handleSave} />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}
