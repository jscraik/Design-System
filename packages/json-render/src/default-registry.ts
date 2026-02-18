import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AppsSDKBadge,
  AppsSDKButton,
  AppsSDKCheckbox,
  AppsSDKInput,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@design-studio/ui";

import { createRegistry } from "./registry";

export const defaultRegistry = createRegistry();

// Base components
defaultRegistry.register("Button", AppsSDKButton);
defaultRegistry.register("Input", AppsSDKInput);
defaultRegistry.register("Label", Label);
defaultRegistry.register("Badge", AppsSDKBadge);
defaultRegistry.register("Separator", Separator);

// Card components
defaultRegistry.register("Card", Card);
defaultRegistry.register("CardHeader", CardHeader);
defaultRegistry.register("CardTitle", CardTitle);
defaultRegistry.register("CardDescription", CardDescription);
defaultRegistry.register("CardContent", CardContent);
defaultRegistry.register("CardFooter", CardFooter);

// Alert components
defaultRegistry.register("Alert", Alert);
defaultRegistry.register("AlertTitle", AlertTitle);
defaultRegistry.register("AlertDescription", AlertDescription);

// Tabs components
defaultRegistry.register("Tabs", Tabs);
defaultRegistry.register("TabsList", TabsList);
defaultRegistry.register("TabsTrigger", TabsTrigger);
defaultRegistry.register("TabsContent", TabsContent);

// Select components
defaultRegistry.register("Select", Select);
defaultRegistry.register("SelectTrigger", SelectTrigger);
defaultRegistry.register("SelectValue", SelectValue);
defaultRegistry.register("SelectContent", SelectContent);
defaultRegistry.register("SelectItem", SelectItem);

// Form components
defaultRegistry.register("Switch", Switch);
defaultRegistry.register("Checkbox", AppsSDKCheckbox);
defaultRegistry.register("RadioGroup", RadioGroup);
defaultRegistry.register("RadioGroupItem", RadioGroupItem);
defaultRegistry.register("Slider", Slider);

// Feedback components
defaultRegistry.register("Progress", Progress);

// Avatar components
defaultRegistry.register("Avatar", Avatar);
defaultRegistry.register("AvatarImage", AvatarImage);
defaultRegistry.register("AvatarFallback", AvatarFallback);

// Dialog components
defaultRegistry.register("Dialog", Dialog);
defaultRegistry.register("DialogTrigger", DialogTrigger);
defaultRegistry.register("DialogContent", DialogContent);
defaultRegistry.register("DialogHeader", DialogHeader);
defaultRegistry.register("DialogTitle", DialogTitle);
defaultRegistry.register("DialogDescription", DialogDescription);
defaultRegistry.register("DialogFooter", DialogFooter);

// Accordion components
defaultRegistry.register("Accordion", Accordion);
defaultRegistry.register("AccordionItem", AccordionItem);
defaultRegistry.register("AccordionTrigger", AccordionTrigger);
defaultRegistry.register("AccordionContent", AccordionContent);

// Layout primitives
defaultRegistry.register("div", "div");
defaultRegistry.register("span", "span");
defaultRegistry.register("p", "p");
defaultRegistry.register("h1", "h1");
defaultRegistry.register("h2", "h2");
defaultRegistry.register("h3", "h3");
defaultRegistry.register("h4", "h4");
defaultRegistry.register("h5", "h5");
defaultRegistry.register("h6", "h6");
