import { Badge, Button, Card, IconButton } from "@chatui/ui";

import type { Route } from "../Router";

interface AboutPageProps {
  onNavigate: (route: Route) => void;
  onOpenGithub?: () => void;
}

export function AboutPage({ onNavigate, onOpenGithub }: AboutPageProps) {
  const handleOpenGithub = () => {
    if (onOpenGithub) {
      onOpenGithub();
      return;
    }
    if (typeof window !== "undefined") {
      window.open("https://github.com", "_blank", "noopener,noreferrer");
    }
  };

  const features = [
    {
      title: "AI-Powered Conversations",
      description: "Advanced language models for natural conversations",
      icon: "🤖",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with AI in real-time",
      icon: "⚡",
    },
    {
      title: "Secure & Private",
      description: "Your conversations are encrypted and private",
      icon: "🔒",
    },
    {
      title: "Extensible Platform",
      description: "Build custom tools and integrations",
      icon: "🔧",
    },
  ];

  const team = [
    { name: "AI Assistant", role: "Your helpful companion", avatar: "🤖" },
    { name: "Development Team", role: "Building the future", avatar: "👥" },
    { name: "Community", role: "Making it better together", avatar: "🌟" },
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
            <h1 className="text-xl font-semibold text-white">About ChatUI</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">💬</div>
          <h1 className="text-4xl font-bold text-white mb-4">ChatUI</h1>
          <p className="text-xl text-white/80 mb-6">
            A modern, accessible, and extensible chat interface built for the future of AI
            conversations.
          </p>
          <div className="flex justify-center gap-2 mb-8">
            <Badge variant="secondary">v0.1.0</Badge>
            <Badge variant="outline">Open Source</Badge>
            <Badge variant="outline">TypeScript</Badge>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => onNavigate("chat")}>Start Chatting</Button>
            <Button variant="outline" onClick={handleOpenGithub}>
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Built With ❤️</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="p-6 text-center">
              <div className="text-4xl mb-4">{member.avatar}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-white/60 text-sm">{member.role}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Built With Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Vite",
            "Storybook",
            "Radix UI",
            "OpenAI SDK",
            "pnpm",
          ].map((tech) => (
            <Badge key={tech} variant="outline" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-[var(--foundation-bg-dark-2)] p-6 text-center">
        <p className="text-white/60 text-sm">Made with 💜 for the AI community</p>
      </div>
    </div>
  );
}
