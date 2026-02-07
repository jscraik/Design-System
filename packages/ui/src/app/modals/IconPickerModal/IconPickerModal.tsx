import { useEffect, useRef, useState } from "react";
import { ModalDialog } from "../../../components/ui/overlays/Modal";
import { cn } from "../../../components/ui/utils";
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
    lightClass: "text-muted-foreground",
    darkClass: "text-muted-foreground",
    lightBg: "bg-muted",
    darkBg: "bg-muted",
    bgClasses: "bg-muted dark:bg-muted",
  },
  {
    id: "red",
    name: "Red",
    lightClass: "text-status-error",
    darkClass: "text-status-error",
    lightBg: "bg-status-error",
    darkBg: "bg-status-error",
    bgClasses: "bg-status-error dark:bg-status-error",
  },
  {
    id: "orange",
    name: "Orange",
    lightClass: "text-accent-orange",
    darkClass: "text-accent-orange",
    lightBg: "bg-accent-orange",
    darkBg: "bg-accent-orange",
    bgClasses: "bg-accent-orange dark:bg-accent-orange",
  },
  {
    id: "yellow",
    name: "Yellow",
    lightClass: "text-accent-orange",
    darkClass: "text-accent-orange",
    lightBg: "bg-accent-orange",
    darkBg: "bg-accent-orange",
    bgClasses: "bg-accent-orange dark:bg-accent-orange",
  },
  {
    id: "green",
    name: "Green",
    lightClass: "text-accent-green",
    darkClass: "text-accent-green",
    lightBg: "bg-accent-green",
    darkBg: "bg-accent-green",
    bgClasses: "bg-accent-green dark:bg-accent-green",
  },
  {
    id: "blue",
    name: "Blue",
    lightClass: "text-accent-blue",
    darkClass: "text-accent-blue",
    lightBg: "bg-accent-blue",
    darkBg: "bg-accent-blue",
    bgClasses: "bg-accent-blue dark:bg-accent-blue",
  },
  {
    id: "purple",
    name: "Purple",
    lightClass: "text-accent-purple",
    darkClass: "text-accent-purple",
    lightBg: "bg-accent-purple",
    darkBg: "bg-accent-purple",
    bgClasses: "bg-accent-purple dark:bg-accent-purple",
  },
  {
    id: "pink",
    name: "Pink",
    lightClass: "text-accent-purple",
    darkClass: "text-accent-purple",
    lightBg: "bg-accent-purple",
    darkBg: "bg-accent-purple",
    bgClasses: "bg-accent-purple dark:bg-accent-purple",
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
          "bg-muted dark:bg-muted/50",
          "border border-muted dark:border-muted",
          "shadow-lg shadow-muted/50 dark:shadow-muted/",
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
      <h3 className="text-[14px] font-medium leading-[18px] tracking-[-0.3px] text-foreground dark:text-foreground mb-4">
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
                "focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background dark:focus-visible:ring-offset-secondary",
                color.bgClasses,
                isSelected
                  ? "ring-2 ring-foreground dark:ring-foreground ring-offset-2 ring-offset-background dark:ring-offset-secondary scale-110 shadow-lg"
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
      <h3 className="text-[14px] font-medium leading-[18px] tracking-[-0.3px] text-foreground dark:text-foreground">
        Icon
      </h3>
      <div className="grid grid-cols-7 gap-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted dark:scrollbar-thumb-muted">
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
                "focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background dark:focus-visible:ring-offset-secondary",
                isSelected
                  ? "bg-muted dark:bg-muted scale-95 shadow-inner"
                  : "hover:bg-muted/50 dark:hover:bg-muted/50 hover:scale-105",
              )}
              title={icon.name}
              aria-label={`Select ${icon.name} icon`}
            >
              <IconComponent
                className={cn(
                  "size-5 transition-colors duration-200",
                  isSelected
                    ? selectedColorClasses.text
                    : "text-muted-foreground dark:text-muted-foreground group-hover:text-text-secondary dark:group-hover:text-text-secondary",
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
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSelectedColorId(currentColorId);
      setSelectedIcon(currentIconId ?? "folder");
    }
    wasOpenRef.current = isOpen;
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
      className="bg-background dark:bg-secondary border border-muted dark:border-muted rounded-2xl shadow-2xl p-0"
      showOverlay={false}
    >
      <div className="px-6 py-4 border-b border-muted dark:border-muted">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-[16px] font-medium leading-[26px] tracking-[-0.4px] text-foreground dark:text-foreground">
              Choose icon
            </h2>
            <p className="text-[12px] font-normal leading-[16px] tracking-[-0.1px] text-text-secondary dark:text-text-secondary mt-0.5">
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
              "hover:bg-muted dark:hover:bg-muted",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background dark:focus-visible:ring-offset-secondary",
            )}
          >
            <svg
              className="size-4 text-muted-foreground dark:text-muted-foreground"
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
        <IconPreview
          selectedColorId={selectedColorId}
          SelectedIconComponent={SelectedIconComponent}
        />
        <ColorPicker selectedColorId={selectedColorId} onSelect={setSelectedColorId} />
        <IconGrid
          selectedIcon={selectedIcon}
          selectedColorId={selectedColorId}
          onSelect={setSelectedIcon}
        />
      </div>

      <div className="px-6 py-4 border-t border-muted dark:border-muted flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-200",
            "text-[14px] font-normal leading-[18px] tracking-[-0.3px]",
            "text-text-secondary dark:text-text-secondary",
            "hover:text-foreground dark:hover:text-foreground",
            "hover:bg-muted dark:hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background dark:focus-visible:ring-offset-secondary",
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
            "bg-accent-green dark:bg-accent-green",
            "text-text-body-on-color",
            "hover:opacity-90 hover:scale-105 active:scale-95",
            "shadow-sm hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background dark:focus-visible:ring-offset-secondary",
          )}
        >
          Done
        </button>
      </div>
    </ModalDialog>
  );
}
