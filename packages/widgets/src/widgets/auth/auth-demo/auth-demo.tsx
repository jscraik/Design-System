import { createWidget } from "../../../shared/widget-base";

type AuthStatus = {
  authenticated: boolean;
  level?: "none" | "basic" | "oauth" | "oauth_elevated";
  provider?: string;
  expiresAt?: string;
  scopes?: string[];
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

export type AuthDemoProps = {
  authStatus?: AuthStatus;
  meetsRequiredLevel?: boolean;
  user?: AuthUser;
};

function AuthDemoBody({ authStatus, meetsRequiredLevel, user }: AuthDemoProps) {
  if (!authStatus) {
    return <div className="text-sm text-muted-foreground">No authentication data available.</div>;
  }

  return (
    <div className="space-y-4 text-sm text-foreground/90">
      <div className="flex items-center justify-between">
        <span className="font-medium">Status</span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            authStatus.authenticated
              ? "bg-status-success-muted/20 text-status-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {authStatus.authenticated ? "Authenticated" : "Not authenticated"}
        </span>
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Level</span>
          <span className="text-foreground/90">{authStatus.level ?? "unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Provider</span>
          <span className="text-foreground/90">{authStatus.provider ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Expires</span>
          <span className="text-foreground/90">{authStatus.expiresAt ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Scopes</span>
          <span className="text-foreground/90">
            {authStatus.scopes?.length ? authStatus.scopes.join(", ") : "—"}
          </span>
        </div>
      </div>

      {typeof meetsRequiredLevel === "boolean" && (
        <div
          className={`rounded-lg px-3 py-2 text-xs ${
            meetsRequiredLevel
              ? "bg-status-success-muted/10 text-status-success"
              : "bg-status-warning-muted/10 text-status-warning"
          }`}
        >
          {meetsRequiredLevel
            ? "Access level meets the requested requirement."
            : "Access level does not meet the requested requirement."}
        </div>
      )}

      {user && (
        <div className="rounded-lg border border-border bg-muted p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">User</div>
          <div className="mt-1 text-sm font-medium text-foreground">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
          <div className="mt-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/80">
            {user.plan}
          </div>
        </div>
      )}
    </div>
  );
}

export const AuthDemo = createWidget(AuthDemoBody, {
  title: "Auth Status",
  className: "max-h-[70vh]",
});
