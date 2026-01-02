import {
  IconSearch,
  IconChat,
  IconChevronRightMd,
  IconFolder,
  IconWriting,
  IconBarChart,
  IconBook,
  IconCompose,
} from "../../../icons";

import type { IconType } from "./constants";

/**
 * Returns the icon element for a given icon type.
 *
 * @param iconType - Icon type token.
 * @param className - CSS classes applied to the icon.
 * @returns The icon element for the provided type.
 */
export function getIcon(iconType: IconType, className: string = "size-4") {
  const iconMap: Record<IconType, React.ReactNode> = {
    chat: <IconChat className={className} />,
    folder: <IconFolder className={className} />,
    "bar-chart": <IconBarChart className={className} />,
    writing: <IconWriting className={className} />,
    book: <IconBook className={className} />,
    compose: <IconCompose className={className} />,
    search: <IconSearch className={className} />,
    "chevron-right": <IconChevronRightMd className={className} />,
  };

  return iconMap[iconType] || <IconFolder className={className} />;
}

/**
 * Returns the icon element for a category label.
 *
 * @param category - Category label.
 * @returns The icon element for the provided category.
 */
export function getCategoryIcon(category: string) {
  const iconMap: Record<string, React.ReactNode> = {
    Investing: <IconBarChart className="size-4" />,
    Homework: <IconBook className="size-4" />,
    Writing: <IconWriting className="size-4" />,
    Coding: <IconCompose className="size-4" />,
    Research: <IconSearch className="size-4" />,
  };

  return iconMap[category] || <IconFolder className="size-4" />;
}
