import { useEffect, useState } from "react";

import { ModalDialog, ModalBody } from "../ui/overlays/modal";
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
  currentIconId?: string;
  currentColorId?: string;
  onSave: (iconId: string, colorId: string) => void;
  projectName: string;
}

// Color definitions with ID and CSS class
const colors = [
  {
    id: "gray",
    className: "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary",
    bg: "bg-foundation-icon-light-tertiary dark:bg-foundation-icon-dark-tertiary",
  },
  {
    id: "blue",
    className: "text-foundation-accent-blue",
    bg: "bg-foundation-accent-blue",
  },
  {
    id: "green",
    className: "text-foundation-accent-green",
    bg: "bg-foundation-accent-green",
  },
  {
    id: "orange",
    className: "text-foundation-accent-orange",
    bg: "bg-foundation-accent-orange",
  },
  {
    id: "red",
    className: "text-foundation-accent-red",
    bg: "bg-foundation-accent-red",
  },
];

// Helper to get CSS class from color ID
const getColorClass = (colorId: string): string => {
  return colors.find((c) => c.id === colorId)?.className ?? colors[0].className;
};

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

function IconPreview({
  selectedColor,
  SelectedIconComponent,
}: {
  selectedColor: string;
  SelectedIconComponent: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className={`p-4 rounded-xl bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 ${selectedColor}`}>
        <SelectedIconComponent className="size-8" />
      </div>
    </div>
  );
}

function ColorPicker({
  selectedColorId,
  onSelect,
}: {
  selectedColorId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelect(color.id)}
            className={`size-8 rounded-full transition-all ${color.bg} ${
              selectedColorId === color.id
                ? "ring-2 ring-black/20 dark:ring-foundation-text-dark-primary ring-offset-2 ring-offset-foundation-bg-light-2 dark:ring-offset-foundation-bg-dark-2 scale-110"
                : "hover:scale-105"
            }`}
            title={color.id}
            aria-label={`Color: ${color.id}`}
          />
        ))}
      </div>
    </div>
  );
}

function IconGrid({
  selectedIcon,
  selectedColorClass,
  onSelect,
}: {
  selectedIcon: string;
  selectedColorClass: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
      {icons.map((icon) => {
        const IconComponent = icon.component;
        return (
          <button
            key={icon.id}
            type="button"
            onClick={() => onSelect(icon.id)}
            className={`p-3 rounded-lg transition-all ${
              selectedIcon === icon.id
                ? "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 scale-95"
                : "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2"
            }`}
            title={icon.id}
            aria-label={`Icon: ${icon.id}`}
          >
            <IconComponent
              className={`size-5 ${
                selectedIcon === icon.id
                  ? selectedColorClass
                  : "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ModalFooter({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-[14px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors font-normal leading-[20px] tracking-[-0.3px]"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 text-[14px] bg-foundation-accent-green-light text-white hover:bg-foundation-accent-green-light/90 dark:bg-foundation-accent-green dark:text-foundation-text-light-primary dark:hover:bg-foundation-accent-green/90 rounded-lg transition-colors font-medium leading-[20px] tracking-[-0.3px]"
      >
        Done
      </button>
    </div>
  );
}

export function IconPickerModal({
  isOpen,
  onClose,
  currentIconId,
  currentColorId = "gray",
  onSave,
  projectName,
}: IconPickerModalProps) {
  const [selectedColorId, setSelectedColorId] = useState(currentColorId);
  const [selectedIcon, setSelectedIcon] = useState(currentIconId ?? "folder");

  // Sync state when modal opens or props change (prevents stale state on reopen)
  useEffect(() => {
    if (!isOpen) return;
    setSelectedColorId(currentColorId);
    setSelectedIcon(currentIconId ?? "folder");
  }, [isOpen, currentColorId, currentIconId]);

  const handleSave = () => {
    onSave(selectedIcon, selectedColorId);
    onClose();
  };

  const SelectedIconComponent = getSelectedIconComponent(selectedIcon);
  const selectedColorClass = getColorClass(selectedColorId);

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose icon"
      titleId="icon-picker-title"
      maxWidth="400px"
    >
      <div className="px-6 py-4 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
        <div>
          <h2
            id="icon-picker-title"
            className="text-[16px] font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary leading-[24px] tracking-[-0.32px]"
          >
            Choose icon
          </h2>
          <p className="text-[13px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-0.5 leading-[18px] tracking-[-0.32px]">
            {projectName}
          </p>
        </div>
      </div>

      <ModalBody>
        <IconPreview
          selectedColor={selectedColorClass}
          SelectedIconComponent={SelectedIconComponent}
        />
        <ColorPicker selectedColorId={selectedColorId} onSelect={setSelectedColorId} />
        <IconGrid
          selectedIcon={selectedIcon}
          selectedColorClass={selectedColorClass}
          onSelect={setSelectedIcon}
        />
      </ModalBody>

      <ModalFooter onClose={onClose} onSave={handleSave} />
    </ModalDialog>
  );
}
