import { Avatar, Badge, Button, Card, IconButton, Input, ListItem, Textarea } from "@chatui/ui";
import { useState } from "react";

import type { Route } from "../Router";

interface ProfilePageProps {
  onNavigate: (route: Route) => void;
  onExportData?: () => void;
  onOpenPrivacySettings?: () => void;
  onSaveProfile?: (profile: { name: string; email: string; bio: string }) => void;
}

export function ProfilePage({
  onNavigate,
  onExportData,
  onOpenPrivacySettings,
  onSaveProfile,
}: ProfilePageProps) {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [bio, setBio] = useState("AI enthusiast and developer");
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: "Conversations", value: "1,234" },
    { label: "Messages Sent", value: "5,678" },
    { label: "Days Active", value: "89" },
  ];

  const recentActivity = [
    { id: 1, action: "Started new conversation", time: "2 hours ago" },
    { id: 2, action: "Updated profile settings", time: "1 day ago" },
    { id: 3, action: "Exported chat history", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-[var(--foundation-bg-dark-1)]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[var(--foundation-bg-dark-2)]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <IconButton
              icon={<span>←</span>}
              onClick={() => onNavigate("chat")}
              title="Back to Chat"
              variant="ghost"
            />
            <h1 className="text-xl font-semibold text-white">Profile</h1>
          </div>

          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (isEditing) {
                onSaveProfile?.({ name, email, bio });
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="size-20">
              <span className="text-2xl">👤</span>
            </Avatar>

            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                  />
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white">{name}</h2>
                  <p className="text-white/80">{email}</p>
                  <p className="text-white/60 mt-2">{bio}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Pro User</Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivity.map((activity) => (
              <ListItem
                key={activity.id}
                label={activity.action}
                right={<span className="text-white/60 text-sm">{activity.time}</span>}
              />
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => onNavigate("settings")}>
            Settings
          </Button>
          <Button variant="outline" onClick={onExportData}>
            Export Data
          </Button>
          <Button variant="outline" onClick={onOpenPrivacySettings}>
            Privacy
          </Button>
        </div>
      </div>
    </div>
  );
}
