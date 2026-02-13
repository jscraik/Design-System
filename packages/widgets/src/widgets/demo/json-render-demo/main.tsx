import type { ComponentSchema } from "@design-studio/json-render";
import { JsonRender } from "@design-studio/json-render";
import { AppsSDKButton } from "@design-studio/ui";
import { useState } from "react";

import { mountWidget, WidgetBase, WidgetErrorBoundary } from "../../../shared/widget-base";
import "../../../styles.css";

const exampleSchemas: Record<string, ComponentSchema> = {
  dashboard: {
    component: "div",
    props: { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
    children: [
      {
        component: "Card",
        children: [
          {
            component: "CardHeader",
            children: [
              {
                component: "CardTitle",
                props: { className: "text-sm font-medium" },
                children: "Total Revenue",
              },
            ],
          },
          {
            component: "CardContent",
            children: [
              {
                component: "div",
                props: { className: "text-2xl font-bold" },
                children: "$45,231.89",
              },
              {
                component: "p",
                props: { className: "text-xs text-muted-foreground" },
                children: "+20.1% from last month",
              },
            ],
          },
        ],
      },
      {
        component: "Card",
        children: [
          {
            component: "CardHeader",
            children: [
              {
                component: "CardTitle",
                props: { className: "text-sm font-medium" },
                children: "Active Users",
              },
            ],
          },
          {
            component: "CardContent",
            children: [
              { component: "div", props: { className: "text-2xl font-bold" }, children: "2,350" },
              {
                component: "p",
                props: { className: "text-xs text-muted-foreground" },
                children: "+180 since last hour",
              },
            ],
          },
        ],
      },
      {
        component: "Card",
        children: [
          {
            component: "CardHeader",
            children: [
              {
                component: "CardTitle",
                props: { className: "text-sm font-medium" },
                children: "Conversion Rate",
              },
            ],
          },
          {
            component: "CardContent",
            children: [
              { component: "div", props: { className: "text-2xl font-bold" }, children: "12.5%" },
              {
                component: "p",
                props: { className: "text-xs text-muted-foreground" },
                children: "+2.5% from last week",
              },
            ],
          },
        ],
      },
    ],
  },
  form: {
    component: "Card",
    props: { className: "max-w-2xl mx-auto" },
    children: [
      {
        component: "CardHeader",
        children: [
          { component: "CardTitle", children: "Profile Settings" },
          { component: "CardDescription", children: "Update your account information" },
        ],
      },
      {
        component: "CardContent",
        props: { className: "space-y-4" },
        children: [
          {
            component: "div",
            props: { className: "space-y-2" },
            children: [
              { component: "Label", props: { htmlFor: "name" }, children: "Full Name" },
              { component: "Input", props: { id: "name", placeholder: "John Doe" } },
            ],
          },
          {
            component: "div",
            props: { className: "space-y-2" },
            children: [
              { component: "Label", props: { htmlFor: "email" }, children: "Email" },
              {
                component: "Input",
                props: { id: "email", type: "email", placeholder: "john@example.com" },
              },
            ],
          },
          {
            component: "div",
            props: { className: "flex items-center space-x-2" },
            children: [
              { component: "Switch", props: { id: "notifications" } },
              {
                component: "Label",
                props: { htmlFor: "notifications" },
                children: "Email notifications",
              },
            ],
          },
        ],
      },
      {
        component: "CardFooter",
        children: [{ component: "Button", children: "Save Changes" }],
      },
    ],
  },
  alert: {
    component: "div",
    props: { className: "space-y-4" },
    children: [
      {
        component: "Alert",
        children: [
          { component: "AlertTitle", children: "Success!" },
          { component: "AlertDescription", children: "Your changes have been saved successfully." },
        ],
      },
      {
        component: "Alert",
        props: { variant: "destructive" },
        children: [
          { component: "AlertTitle", children: "Error" },
          {
            component: "AlertDescription",
            children: "There was a problem processing your request.",
          },
        ],
      },
    ],
  },
};

function JsonRenderDemo() {
  const [selectedExample, setSelectedExample] = useState<keyof typeof exampleSchemas>("dashboard");

  return (
    <WidgetErrorBoundary>
      <WidgetBase title="JSON Render Demo">
        <div className="space-y-4">
          <div className="flex gap-2">
            <AppsSDKButton
              variant={selectedExample === "dashboard" ? "default" : "outline"}
              onClick={() => setSelectedExample("dashboard")}
            >
              Dashboard
            </AppsSDKButton>
            <AppsSDKButton
              variant={selectedExample === "form" ? "default" : "outline"}
              onClick={() => setSelectedExample("form")}
            >
              Form
            </AppsSDKButton>
            <AppsSDKButton
              variant={selectedExample === "alert" ? "default" : "outline"}
              onClick={() => setSelectedExample("alert")}
            >
              Alerts
            </AppsSDKButton>
          </div>
          <JsonRender schema={exampleSchemas[selectedExample]} />
        </div>
      </WidgetBase>
    </WidgetErrorBoundary>
  );
}

mountWidget(<JsonRenderDemo />);
