# JSON Render Examples

Last updated: 2026-01-16

## Doc requirements

- Audience: Developers and AI agents
- Scope: Practical examples of JSON schemas
- Non-scope: Component API documentation
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Dashboard Examples

### Simple Metrics Dashboard

```json
{
  "component": "div",
  "props": { "className": "grid grid-cols-1 md:grid-cols-3 gap-4 p-4" },
  "children": [
    {
      "component": "Card",
      "children": [
        {
          "component": "CardHeader",
          "children": [
            {
              "component": "CardTitle",
              "props": { "className": "text-sm font-medium" },
              "children": "Total Revenue"
            }
          ]
        },
        {
          "component": "CardContent",
          "children": [
            {
              "component": "div",
              "props": { "className": "text-2xl font-bold" },
              "children": "$45,231.89"
            },
            {
              "component": "p",
              "props": { "className": "text-xs text-muted-foreground" },
              "children": "+20.1% from last month"
            }
          ]
        }
      ]
    },
    {
      "component": "Card",
      "children": [
        {
          "component": "CardHeader",
          "children": [
            {
              "component": "CardTitle",
              "props": { "className": "text-sm font-medium" },
              "children": "Active Users"
            }
          ]
        },
        {
          "component": "CardContent",
          "children": [
            {
              "component": "div",
              "props": { "className": "text-2xl font-bold" },
              "children": "2,350"
            },
            {
              "component": "p",
              "props": { "className": "text-xs text-muted-foreground" },
              "children": "+180 since last hour"
            }
          ]
        }
      ]
    }
  ]
}
```

### Analytics Dashboard with Tabs

```json
{
  "component": "div",
  "props": { "className": "p-4" },
  "children": [
    {
      "component": "Tabs",
      "props": { "defaultValue": "overview" },
      "children": [
        {
          "component": "TabsList",
          "children": [
            {
              "component": "TabsTrigger",
              "props": { "value": "overview" },
              "children": "Overview"
            },
            {
              "component": "TabsTrigger",
              "props": { "value": "analytics" },
              "children": "Analytics"
            },
            { "component": "TabsTrigger", "props": { "value": "reports" }, "children": "Reports" }
          ]
        },
        {
          "component": "TabsContent",
          "props": { "value": "overview" },
          "children": [
            {
              "component": "div",
              "props": { "className": "grid grid-cols-2 gap-4" },
              "children": [
                {
                  "component": "Card",
                  "children": [
                    {
                      "component": "CardHeader",
                      "children": [{ "component": "CardTitle", "children": "Sales" }]
                    },
                    { "component": "CardContent", "children": "$12,234" }
                  ]
                },
                {
                  "component": "Card",
                  "children": [
                    {
                      "component": "CardHeader",
                      "children": [{ "component": "CardTitle", "children": "Orders" }]
                    },
                    { "component": "CardContent", "children": "1,234" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Form Examples

### User Profile Form

```json
{
  "component": "Card",
  "props": { "className": "max-w-2xl mx-auto" },
  "children": [
    {
      "component": "CardHeader",
      "children": [
        { "component": "CardTitle", "children": "Profile Settings" },
        { "component": "CardDescription", "children": "Update your account information" }
      ]
    },
    {
      "component": "CardContent",
      "props": { "className": "space-y-4" },
      "children": [
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "name" }, "children": "Full Name" },
            { "component": "Input", "props": { "id": "name", "placeholder": "John Doe" } }
          ]
        },
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "email" }, "children": "Email" },
            {
              "component": "Input",
              "props": { "id": "email", "type": "email", "placeholder": "john@example.com" }
            }
          ]
        },
        {
          "component": "div",
          "props": { "className": "flex items-center space-x-2" },
          "children": [
            { "component": "Switch", "props": { "id": "notifications" } },
            {
              "component": "Label",
              "props": { "htmlFor": "notifications" },
              "children": "Email notifications"
            }
          ]
        }
      ]
    },
    {
      "component": "CardFooter",
      "children": [{ "component": "Button", "children": "Save Changes" }]
    }
  ]
}
```

### Contact Form with Validation

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [
        { "component": "CardTitle", "children": "Contact Us" },
        {
          "component": "CardDescription",
          "children": "Send us a message and we'll get back to you"
        }
      ]
    },
    {
      "component": "CardContent",
      "props": { "className": "space-y-4" },
      "children": [
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "subject" }, "children": "Subject" },
            {
              "component": "Select",
              "children": [
                {
                  "component": "SelectTrigger",
                  "children": [
                    { "component": "SelectValue", "props": { "placeholder": "Select a subject" } }
                  ]
                },
                {
                  "component": "SelectContent",
                  "children": [
                    {
                      "component": "SelectItem",
                      "props": { "value": "support" },
                      "children": "Technical Support"
                    },
                    {
                      "component": "SelectItem",
                      "props": { "value": "sales" },
                      "children": "Sales Inquiry"
                    },
                    {
                      "component": "SelectItem",
                      "props": { "value": "feedback" },
                      "children": "Feedback"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "message" }, "children": "Message" },
            { "component": "Input", "props": { "id": "message", "placeholder": "Your message..." } }
          ]
        }
      ]
    },
    {
      "component": "CardFooter",
      "children": [{ "component": "Button", "children": "Send Message" }]
    }
  ]
}
```

## List and Table Examples

### Activity Feed

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [{ "component": "CardTitle", "children": "Recent Activity" }]
    },
    {
      "component": "CardContent",
      "children": [
        {
          "component": "div",
          "props": { "className": "space-y-4" },
          "children": [
            {
              "component": "div",
              "props": { "className": "flex items-start space-x-4" },
              "children": [
                {
                  "component": "Avatar",
                  "children": [{ "component": "AvatarFallback", "children": "JD" }]
                },
                {
                  "component": "div",
                  "props": { "className": "flex-1" },
                  "children": [
                    {
                      "component": "p",
                      "props": { "className": "font-medium" },
                      "children": "John Doe"
                    },
                    {
                      "component": "p",
                      "props": { "className": "text-sm text-muted-foreground" },
                      "children": "Created a new project"
                    },
                    {
                      "component": "p",
                      "props": { "className": "text-xs text-muted-foreground" },
                      "children": "2 hours ago"
                    }
                  ]
                },
                { "component": "Badge", "children": "New" }
              ]
            },
            { "component": "Separator" }
          ]
        }
      ]
    }
  ]
}
```

## Settings Page Examples

### Settings with Sections

```json
{
  "component": "div",
  "props": { "className": "space-y-6 p-4" },
  "children": [
    {
      "component": "div",
      "children": [
        {
          "component": "h2",
          "props": { "className": "text-2xl font-bold" },
          "children": "Settings"
        },
        {
          "component": "p",
          "props": { "className": "text-muted-foreground" },
          "children": "Manage your account settings and preferences"
        }
      ]
    },
    {
      "component": "Accordion",
      "props": { "type": "single", "collapsible": true },
      "children": [
        {
          "component": "AccordionItem",
          "props": { "value": "account" },
          "children": [
            { "component": "AccordionTrigger", "children": "Account Settings" },
            {
              "component": "AccordionContent",
              "children": [
                {
                  "component": "div",
                  "props": { "className": "space-y-4" },
                  "children": [
                    {
                      "component": "div",
                      "props": { "className": "flex items-center justify-between" },
                      "children": [
                        {
                          "component": "div",
                          "children": [
                            {
                              "component": "p",
                              "props": { "className": "font-medium" },
                              "children": "Email Notifications"
                            },
                            {
                              "component": "p",
                              "props": { "className": "text-sm text-muted-foreground" },
                              "children": "Receive email about your account activity"
                            }
                          ]
                        },
                        { "component": "Switch" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Modal and Dialog Examples

### Confirmation Dialog

```json
{
  "component": "Dialog",
  "children": [
    {
      "component": "DialogTrigger",
      "children": [
        {
          "component": "Button",
          "props": { "variant": "destructive" },
          "children": "Delete Account"
        }
      ]
    },
    {
      "component": "DialogContent",
      "children": [
        {
          "component": "DialogHeader",
          "children": [
            { "component": "DialogTitle", "children": "Are you sure?" },
            {
              "component": "DialogDescription",
              "children": "This action cannot be undone. This will permanently delete your account."
            }
          ]
        },
        {
          "component": "DialogFooter",
          "children": [
            { "component": "Button", "props": { "variant": "outline" }, "children": "Cancel" },
            { "component": "Button", "props": { "variant": "destructive" }, "children": "Delete" }
          ]
        }
      ]
    }
  ]
}
```

## Alert and Notification Examples

### Status Alerts

```json
{
  "component": "div",
  "props": { "className": "space-y-4" },
  "children": [
    {
      "component": "Alert",
      "children": [
        { "component": "AlertTitle", "children": "Success!" },
        {
          "component": "AlertDescription",
          "children": "Your changes have been saved successfully."
        }
      ]
    },
    {
      "component": "Alert",
      "props": { "variant": "destructive" },
      "children": [
        { "component": "AlertTitle", "children": "Error" },
        {
          "component": "AlertDescription",
          "children": "There was a problem processing your request."
        }
      ]
    }
  ]
}
```

## Progress and Loading Examples

### Progress Indicators

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [{ "component": "CardTitle", "children": "Upload Progress" }]
    },
    {
      "component": "CardContent",
      "props": { "className": "space-y-4" },
      "children": [
        {
          "component": "div",
          "children": [
            {
              "component": "p",
              "props": { "className": "text-sm mb-2" },
              "children": "Uploading file..."
            },
            { "component": "Progress", "props": { "value": 65 } }
          ]
        }
      ]
    }
  ]
}
```

## Related Documentation

- [README.md](./README.md) - System overview
- [AI_GUIDE.md](./AI_GUIDE.md) - AI agent guide
- [REGISTRY.md](./REGISTRY.md) - Component registry
