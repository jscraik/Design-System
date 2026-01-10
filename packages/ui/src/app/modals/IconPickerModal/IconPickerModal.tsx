import { useEffect, useState } from "react";

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
} from "../../../icons";
import { ModalDialog } from "../../../components/ui/overlays/Modal";
import { cn } from "../../../components/ui/utils";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIconId?: string;
  currentColorId?: string;
  onSave: (iconId: string, colorId: string) => void;
  projectName: string;
}

const colors = [
  {
    id: "gray",
    name: "Gray",
    lightClass: "text-foundation-accent-gray-light",
    darkClass: "text-foundation-accent-gray",
    lightBg: "bg-foundation-accent-gray-light",
    darkBg: "bg-foundation-accent-gray",
    bgClasses: "bg-foundation-accent-gray-light dark:bg-foundation-accent-gray",
  },
  {
    id: "red",
    name: "Red",
    lightClass: "text-foundation-accent-red-light",
    darkClass: "text-foundation-accent-red",
    lightBg: "bg-foundation-accent-red-light",
    darkBg: "bg-foundation-accent-red",
    bgClasses: "bg-foundation-accent-red-light dark:bg-foundation-accent-red",
  },
  {
    id: "orange",
    name: "Orange",
    lightClass: "text-foundation-accent-orange-light",
    darkClass: "text-foundation-accent-orange",
    lightBg: "bg-foundation-accent-orange-light",
    darkBg: "bg-foundation-accent-orange",
    bgClasses: "bg-foundation-accent-orange-light dark:bg-foundation-accent-orange",
  },
  {
    id: "yellow",
    name: "Yellow",
    lightClass: "text-foundation-accent-yellow-light",
    darkClass: "text-foundation-accent-yellow",
    lightBg: "bg-foundation-accent-yellow-light",
    darkBg: "bg-foundation-accent-yellow",
    bgClasses: "bg-foundation-accent-yellow-light dark:bg-foundation-accent-yellow",
  },
  {
    id: "green",
    name: "Green",
    lightClass: "text-foundation-accent-green-light",
    darkClass: "text-foundation-accent-green",
    lightBg: "bg-foundation-accent-green-light",
    darkBg: "bg-foundation-accent-green",
    bgClasses: "bg-foundation-accent-green-light dark:bg-foundation-accent-green",
  },
  {
    id: "blue",
    name: "Blue",
    lightClass: "text-foundation-accent-blue-light",
    darkClass: "text-foundation-accent-blue",
    lightBg: "bg-foundation-accent-blue-light",
    darkBg: "bg-foundation-accent-blue",
    bgClasses: "bg-foundation-accent-blue-light dark:bg-foundation-accent-blue",
  },
  {
    id: "purple",
    name: "Purple",
    lightClass: "text-foundation-accent-purple-light",
    darkClass: "text-foundation-accent-purple",
    lightBg: "bg-foundation-accent-purple-light",
    darkBg: "bg-foundation-accent-purple",
    bgClasses: "bg-foundation-accent-purple-light dark:bg-foundation-accent-purple",
  },
  {
    id: "pink",
    name: "Pink",
    lightClass: "text-foundation-accent-pink-light",
    darkClass: "text-foundation-accent-pink",
    lightBg: "bg-foundation-accent-pink-light",
    darkBg: "bg-foundation-accent-pink",
    bgClasses: "bg-foundation-accent-pink-light dark:bg-foundation-accent-pink",
  },
];

const getColorClasses = (colorId: string) => {
  const color = colors.find((c) => c.id === colorId) ?? colors[0];
  return {
    text: `${color.lightClass} dark:${color.darkClass}`,
    bg: `${color.lightBg} dark:${color.darkBg}`,
  };
};

const icons = [
  { id: "folder", component: IconFolder, name: "Folder" },
  { id: "chat", component: IconChat, name: "Chat" },
  { id: "image", component: IconImage, name: "Image" },
  { id: "edit", component: IconEdit, name: "Edit" },
  { id: "compass", component: IconCompass, name: "Compass" },
  { id: "clock", component: IconClock, name: "Clock" },
  { id: "email", component: IconEmail, name: "Email" },
  { id: "phone", component: IconPhone, name: "Phone" },
  { id: "camera", component: IconCamera, name: "Camera" },
  { id: "mic", component: IconMic, name: "Microphone" },
  { id: "video", component: IconVideo, name: "Video" },
  { id: "headphones", component: IconHeadphones, name: "Headphones" },
  { id: "trash", component: IconTrash, name: "Trash" },
  { id: "settings", component: IconSettings, name: "Settings" },
  { id: "bar-chart", component: IconBarChart, name: "Chart" },
  { id: "flask", component: IconFlask, name: "Flask" },
  { id: "lightbulb", component: IconLightBulb, name: "Lightbulb" },
  { id: "star", component: IconStar, name: "Star" },
  { id: "flag", component: IconFlag, name: "Flag" },
  { id: "pin", component: IconPin, name: "Pin" },
  { id: "book", component: IconBook, name: "Book" },
  { id: "terminal", component: IconTerminal, name: "Terminal" },
  { id: "notebook", component: IconNotebook, name: "Notebook" },
  { id: "globe", component: IconGlobe, name: "Globe" },
  { id: "map-pin", component: IconMapPin, name: "Location" },
  { id: "calendar", component: IconCalendar, name: "Calendar" },
  { id: "writing", component: IconWriting, name: "Writing" },
  { id: "tools", component: IconStuffTools, name: "Tools" },
];

const getSelectedIconComponent = (selectedIcon: string) =>
  icons.find((icon) => icon.id === selectedIcon)?.component || IconFolder;

function IconPreview({
  selectedColorId,
  SelectedIconComponent,
}: {
  selectedColorId: string;
  SelectedIconComponent: React.ComponentType<{ className?: string }>;
}) {
  const colorClasses = getColorClasses(selectedColorId);

  return (
    <div className="flex items-center justify-center mb-8">
      <div
        className={cn(
          "p-6 rounded-2xl transition-all duration-200",
          "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3/50",
          "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
          "shadow-lg shadow-foundation-bg-light-3/50 dark:shadow-black/10",
        )}
      >
        <SelectedIconComponent className={cn("size-10", colorClasses.text)} />
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
    <div className="mb-8">
      <h3 className="text-[14px] font-medium leading-[18px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
        Color
      </h3>
      <div className="flex items-center justify-center gap-3">
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelect(color.id)}
              className={cn(
                "size-10 rounded-full transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
                color.bgClasses,
                isSelected
                  ? "ring-2 ring-foundation-text-light-primary dark:ring-foundation-text-dark-primary ring-offset-2 ring-offset-foundation-bg-light-1 dark:ring-offset-foundation-bg-dark-2 scale-110 shadow-lg"
                  : "hover:scale-105 hover:shadow-md",
              )}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          );
        })}
      </div>
    </div>
  );
}

function IconGrid({
  selectedIcon,
  selectedColorId,
  onSelect,
}: {
  selectedIcon: string;
  selectedColorId: string;
  onSelect: (id: string) => void;
}) {
  const selectedColorClasses = getColorClasses(selectedColorId);

  return (
    <div className="space-y-4">
      <h3 className="text-[14px] font-medium leading-[18px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
        Icon
      </h3>
      <div className="grid grid-cols-7 gap-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foundation-bg-light-3 dark:scrollbar-thumb-foundation-bg-dark-3">
        {icons.map((icon) => {
          const IconComponent = icon.component;
          const isSelected = selectedIcon === icon.id;

          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => onSelect(icon.id)}
              className={cn(
                "p-3 rounded-xl transition-all duration-200 group",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
                isSelected
                  ? "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 scale-95 shadow-inner"
                  : "hover:bg-foundation-bg-light-3/50 dark:hover:bg-foundation-bg-dark-3/50 hover:scale-105",
              )}
              title={icon.name}
              aria-label={`Select ${icon.name} icon`}
            >
              <IconComponent
                className={cn(
                  "size-5 transition-colors duration-200",
                  isSelected
                    ? selectedColorClasses.text
                    : "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary group-hover:text-foundation-icon-light-secondary dark:group-hover:text-foundation-icon-dark-secondary",
                )}
              />
            </button>
          );
        })}
      </div>
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

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose icon"
      maxWidth="440px"
      className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-2xl shadow-2xl p-0"
      showOverlay={false}
    >
      <div className="px-6 py-4 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2
              className="text-[16px] font-medium leading-[26px] tracking-[-0.4px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
            >
              Choose icon
            </h2>
            <p
              className="text-[12px] font-normal leading-[16px] tracking-[-0.1px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-0.5"
            >
              {projectName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close dialog"
            className={cn(
              "p-1.5 rounded-lg transition-colors duration-200",
              "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
            )}
          >
            <svg
              className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <IconPreview selectedColorId={selectedColorId} SelectedIconComponent={SelectedIconComponent} />
        <ColorPicker selectedColorId={selectedColorId} onSelect={setSelectedColorId} />
        <IconGrid selectedIcon={selectedIcon} selectedColorId={selectedColorId} onSelect={setSelectedIcon} />
      </div>

      <div className="px-6 py-4 border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-200",
            "text-[14px] font-normal leading-[18px] tracking-[-0.3px]",
            "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
            "hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
            "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-200",
            "text-[14px] font-medium leading-[18px] tracking-[-0.3px]",
            "bg-foundation-accent-green-light dark:bg-foundation-accent-green",
            "text-white",
            "hover:opacity-90 hover:scale-105 active:scale-95",
            "shadow-sm hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
          )}
        >
          Done
        </button>
      </div>
    </ModalDialog>
  );
}
