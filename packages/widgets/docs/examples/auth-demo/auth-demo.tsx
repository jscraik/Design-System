/**
 * Auth Demo Widget
 *
 * Demonstrates authenticated tool call patterns:
 * - Displaying auth status from tool response metadata
 * - Handling different auth levels (none, basic, oauth)
 * - Showing user profile data from authenticated endpoints
 * - Triggering re-authentication flows
 *
 * In production, the MCP server handles OAuth flows and returns
 * auth status in _meta. The widget displays the result and can
 * trigger re-auth via callTool or sendFollowUpMessage.
 */
import {
  AlertCircle,
  CheckCircle,
  Key,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { useCallback, useState } from "react";

import { useOpenAiGlobal } from "../../../src/shared/use-openai-global";
import { useWidgetState } from "../../../src/shared/use-widget-state";

// Types
type AuthLevel = "none" | "basic" | "oauth" | "oauth_elevated";

type AuthStatus = {
  authenticated: boolean;
  level: AuthLevel;
  provider?: string;
  expiresAt?: string;
  scopes?: string[];
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: string;
};

type ToolOutput = {
  authStatus?: AuthStatus;
  user?: UserProfile;
  data?: unknown;
  error?: string;
  requiresAuth?: AuthLevel;
};

type AuthWidgetState = {
  lastAuthCheck: string;
  cachedUser?: UserProfile;
};

const AUTH_LEVEL_INFO: Record<
  AuthLevel,
  { label: string; description: string; icon: typeof Shield }
> = {
  none: {
    label: "No Authentication",
    description: "Public access, no credentials required",
    icon: Lock,
  },
  basic: {
    label: "Basic Auth",
    description: "API key or basic credentials",
    icon: Key,
  },
  oauth: {
    label: "OAuth 2.0",
    description: "Secure token-based authentication",
    icon: Shield,
  },
  oauth_elevated: {
    label: "Elevated OAuth",
    description: "Additional permissions granted",
    icon: ShieldCheck,
  },
};

export function AuthDemo() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ToolOutput | null;
  const toolResponseMetadata = useOpenAiGlobal("toolResponseMetadata") as Record<
    string,
    unknown
  > | null;
  const [widgetState, setWidgetState] = useWidgetState<AuthWidgetState>({
    lastAuthCheck: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(false);

  // Extract auth info from tool response
  const authStatus =
    toolOutput?.authStatus ?? (toolResponseMetadata?.authStatus as AuthStatus | undefined);
  const user = toolOutput?.user ?? widgetState?.cachedUser;
  const error = toolOutput?.error;
  const requiresAuth = toolOutput?.requiresAuth;

  // Handlers
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      // In production, this would trigger an OAuth flow via the MCP server
      await window.openai?.sendFollowUpMessage?.({
        prompt: "I need to authenticate to access this feature",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await window.openai?.callTool?.("auth_logout", {});
      setWidgetState((prev: AuthWidgetState | null) => ({
        ...prev!,
        cachedUser: undefined,
        lastAuthCheck: new Date().toISOString(),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [setWidgetState]);

  const handleRefreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await window.openai?.callTool?.("auth_refresh", {});
      setWidgetState((prev: AuthWidgetState | null) => ({
        ...prev!,
        lastAuthCheck: new Date().toISOString(),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [setWidgetState]);

  const handleRequestElevated = useCallback(async () => {
    setIsLoading(true);
    try {
      await window.openai?.sendFollowUpMessage?.({
        prompt: "I need elevated permissions for this action",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const baseClasses = "bg-surface text-primary border-subtle";

  const currentLevel = authStatus?.level ?? "none";
  const LevelIcon = AUTH_LEVEL_INFO[currentLevel].icon;

  return (
    <div className={`min-h-[300px] rounded-2xl border shadow-sm ${baseClasses}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h2 className="font-semibold">Authentication</h2>
          </div>
          <button
            onClick={handleRefreshAuth}
            disabled={isLoading}
            className={`p-1.5 rounded-full transition-colors hover:bg-surface-secondary ${
              isLoading ? "animate-spin" : ""
            }`}
            aria-label="Refresh auth status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Auth Status Card */}
        <div
          className={`p-4 rounded-xl ${
            authStatus?.authenticated
              ? "bg-success-soft border border-success-surface"
              : "bg-surface-secondary"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                authStatus?.authenticated ? "bg-success-soft-alpha" : "bg-surface-tertiary"
              }`}
            >
              <LevelIcon
                className={`w-5 h-5 ${
                  authStatus?.authenticated ? "text-success" : "text-tertiary"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{AUTH_LEVEL_INFO[currentLevel].label}</h3>
                {authStatus?.authenticated && <CheckCircle className="w-4 h-4 text-success" />}
              </div>
              <p className="text-xs mt-0.5 text-secondary">
                {AUTH_LEVEL_INFO[currentLevel].description}
              </p>
              {authStatus?.provider && (
                <p className="text-xs mt-1 text-tertiary">Provider: {authStatus.provider}</p>
              )}
              {authStatus?.expiresAt && (
                <p className="text-xs text-tertiary">
                  Expires: {new Date(authStatus.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Scopes */}
          {authStatus?.scopes && authStatus.scopes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-subtle">
              <p className="text-xs mb-2 text-secondary">Granted Scopes:</p>
              <div className="flex flex-wrap gap-1">
                {authStatus.scopes.map((scope) => (
                  <span
                    key={scope}
                    className="text-xs px-2 py-0.5 rounded-full bg-surface-tertiary"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-xl flex items-start gap-2 bg-danger-soft border border-danger-surface">
            <AlertCircle className="w-4 h-4 mt-0.5 text-danger" />
            <div>
              <p className="text-sm text-danger">{error}</p>
              {requiresAuth && (
                <p className="text-xs mt-1 text-danger-soft">
                  Required auth level: {AUTH_LEVEL_INFO[requiresAuth].label}
                </p>
              )}
            </div>
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="p-4 rounded-xl bg-surface-secondary">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-tertiary">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{user.name}</h3>
                <p className="text-sm truncate text-secondary">{user.email}</p>
                {user.plan && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 bg-primary-soft-alpha text-primary">
                    {user.plan}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!authStatus?.authenticated ? (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-primary-solid hover:bg-primary-solid-hover disabled:opacity-50 text-primary-solid transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          ) : (
            <>
              {currentLevel !== "oauth_elevated" && (
                <button
                  onClick={handleRequestElevated}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-surface-secondary hover:bg-surface-tertiary"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Elevate
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-danger-soft hover:bg-danger-soft-hover text-danger"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-center text-tertiary">
          Last checked: {new Date(widgetState?.lastAuthCheck ?? Date.now()).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
