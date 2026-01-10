import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../DropdownMenu";

const Menu = DropdownMenu;
const MenuTrigger = DropdownMenuTrigger;
const MenuGroup = DropdownMenuGroup;
const MenuPortal = DropdownMenuPortal;
const MenuSub = DropdownMenuSub;
const MenuRadioGroup = DropdownMenuRadioGroup;
const MenuContent = DropdownMenuContent;
const MenuItem = DropdownMenuItem;
const MenuCheckboxItem = DropdownMenuCheckboxItem;
const MenuRadioItem = DropdownMenuRadioItem;
const MenuLabel = DropdownMenuLabel;
const MenuSeparator = DropdownMenuSeparator;
const MenuShortcut = DropdownMenuShortcut;
const MenuSubTrigger = DropdownMenuSubTrigger;
const MenuSubContent = DropdownMenuSubContent;

export type MenuProps = React.ComponentProps<typeof DropdownMenu>;
export type MenuTriggerProps = React.ComponentProps<typeof DropdownMenuTrigger>;
export type MenuContentProps = React.ComponentProps<typeof DropdownMenuContent>;
export type MenuItemProps = React.ComponentProps<typeof DropdownMenuItem>;
export type MenuCheckboxItemProps = React.ComponentProps<typeof DropdownMenuCheckboxItem>;
export type MenuRadioItemProps = React.ComponentProps<typeof DropdownMenuRadioItem>;
export type MenuLabelProps = React.ComponentProps<typeof DropdownMenuLabel>;
export type MenuSeparatorProps = React.ComponentProps<typeof DropdownMenuSeparator>;
export type MenuShortcutProps = React.ComponentProps<typeof DropdownMenuShortcut>;
export type MenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuSubTrigger>;
export type MenuSubContentProps = React.ComponentProps<typeof DropdownMenuSubContent>;
export type MenuGroupProps = React.ComponentProps<typeof DropdownMenuGroup>;
export type MenuPortalProps = React.ComponentProps<typeof DropdownMenuPortal>;
export type MenuSubProps = React.ComponentProps<typeof DropdownMenuSub>;
export type MenuRadioGroupProps = React.ComponentProps<typeof DropdownMenuRadioGroup>;

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuGroup,
  MenuPortal,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuRadioGroup,
};
