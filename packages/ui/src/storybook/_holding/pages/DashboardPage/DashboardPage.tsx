import {
  Badge,
  Button,
  Card,
  CollapsibleSection,
  ListItem,
  MessageActions,
  ModelBadge,
  Progress,
} from "../../../components/ui";

export interface DashboardPageProps {
  /** Navigation callback */
  onNavigate?: (page: string) => void;
  /** Custom header content */
  headerSlot?: React.ReactNode;
  /** Custom sidebar content */
  sidebarSlot?: React.ReactNode;
  /** Optional stats override */
  stats?: DashboardStat[];
  /** Optional recent chat override */
  recentChats?: DashboardChat[];
}

export type DashboardStat = {
  label: string;
  value: string;
  change: string;
};

export type DashboardChat = {
  id: number | string;
  title: string;
  model: string;
  time: string;
};

const DEFAULT_STATS: DashboardStat[] = [
  { label: "Total Conversations", value: "1,234", change: "+12%" },
  { label: "Messages Today", value: "89", change: "+5%" },
  { label: "Active Models", value: "3", change: "0%" },
  { label: "Response Time", value: "1.2s", change: "-8%" },
];

const DEFAULT_RECENT_CHATS: DashboardChat[] = [
  { id: 1, title: "Code Review Session", model: "GPT-4", time: "2 min ago" },
  { id: 2, title: "Project Planning", model: "Claude", time: "1 hour ago" },
  { id: 3, title: "Debug Help", model: "GPT-4o", time: "3 hours ago" },
];

/**
 * Dashboard page component with analytics and quick actions
 */
export function DashboardPage({
  onNavigate,
  headerSlot,
  sidebarSlot,
  stats,
  recentChats,
}: DashboardPageProps) {
  const resolvedStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const resolvedRecentChats =
    recentChats && recentChats.length > 0 ? recentChats : DEFAULT_RECENT_CHATS;

  return (
    <div className="min-h-screen bg-surface text-primary">
      {/* Header */}
      <div className="border-b border-subtle bg-surface-secondary p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          {headerSlot}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {sidebarSlot && (
          <div className="w-64 border-r border-subtle bg-surface-secondary p-4">{sidebarSlot}</div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-8">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button onClick={() => onNavigate?.("chat")}>New Chat</Button>
            <Button variant="outline" onClick={() => onNavigate?.("settings")}>
              Settings
            </Button>
            <Button variant="outline" onClick={() => onNavigate?.("profile")}>
              Profile
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resolvedStats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary text-sm">{stat.label}</span>
                  <Badge
                    variant={stat.change.startsWith("+") ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Chats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Recent Chats</h3>
              <div className="space-y-2">
                {resolvedRecentChats.map((chat) => (
                  <ListItem
                    key={chat.id}
                    label={chat.title}
                    description={chat.time}
                    right={<ModelBadge name={chat.model} variant="blue" />}
                    onClick={() => onNavigate?.("chat")}
                  />
                ))}
              </div>
            </Card>

            {/* Usage Analytics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Usage This Week</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Messages</span>
                    <span className="text-primary">450/500</span>
                  </div>
                  <Progress value={90} className="h-2" aria-label="Messages usage" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">API Calls</span>
                    <span className="text-primary">1.2k/2k</span>
                  </div>
                  <Progress value={60} className="h-2" aria-label="API calls usage" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Storage</span>
                    <span className="text-primary">2.1GB/5GB</span>
                  </div>
                  <Progress value={42} className="h-2" aria-label="Storage usage" />
                </div>
              </div>
            </Card>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            <CollapsibleSection title="Model Performance">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <ModelBadge name="GPT-4" variant="blue" className="mb-2" />
                  <div className="text-primary text-sm">Avg Response: 1.8s</div>
                </Card>
                <Card className="p-4 text-center">
                  <ModelBadge name="Claude" variant="green" className="mb-2" />
                  <div className="text-primary text-sm">Avg Response: 1.2s</div>
                </Card>
                <Card className="p-4 text-center">
                  <ModelBadge name="GPT-4o" variant="orange" className="mb-2" />
                  <div className="text-primary text-sm">Avg Response: 0.9s</div>
                </Card>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Recent Feedback">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg"
                  >
                    <span className="text-secondary">Message #{i} feedback</span>
                    <MessageActions
                      messageId={`feedback-${i}`}
                      actions={["thumbsUp", "thumbsDown"]}
                      showOnHover={false}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  );
}

DashboardPage.displayName = "DashboardPage";
