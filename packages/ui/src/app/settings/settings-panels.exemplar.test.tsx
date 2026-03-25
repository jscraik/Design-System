import { pressKey, render, screen } from "../../testing/utils";
import { AppsPanel } from "./AppsPanel/AppsPanel";
import { DataControlsPanel } from "./DataControlsPanel/DataControlsPanel";
import { ManageAppsPanel } from "./ManageAppsPanel/ManageAppsPanel";
import { NotificationsPanel } from "./NotificationsPanel/NotificationsPanel";
import { SecurityPanel } from "./SecurityPanel/SecurityPanel";

describe("settings panel exemplars", () => {
  it("renders the apps loading state", () => {
    render(<AppsPanel onBack={() => {}} state="loading" />);

    expect(screen.getByText("Loading apps")).toBeInTheDocument();
  });

  it("renders the apps empty state with a recovery action", () => {
    render(<AppsPanel onBack={() => {}} enabledApps={[]} />);

    expect(screen.getByText("No apps enabled yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Browse Apps" })).toBeInTheDocument();
  });

  it("renders the manage apps error state", () => {
    render(<ManageAppsPanel onBack={() => {}} state="error" />);

    expect(screen.getByText("Couldn't load app management")).toBeInTheDocument();
    expect(
      screen.getByText("We couldn't load your app connection status. Try again in a moment."),
    ).toBeInTheDocument();
  });

  it("renders the notifications empty state", () => {
    render(<NotificationsPanel onBack={() => {}} notificationRows={[]} />);

    expect(screen.getByText("No notification preferences yet")).toBeInTheDocument();
  });

  it("supports the primary security action with keyboard only", async () => {
    const { user } = render(<SecurityPanel onBack={() => {}} initialMfaEnabled={false} />);

    await user.tab();
    await user.tab();
    await user.tab();

    const mfaToggle = screen.getByRole("switch", {
      name: "Multi-factor authentication",
    });

    expect(mfaToggle).toHaveFocus();
    expect(mfaToggle).toHaveAttribute("aria-checked", "false");

    await pressKey(user, "Enter");

    expect(mfaToggle).toHaveAttribute("aria-checked", "true");
  });

  it("locks security actions while saving", () => {
    render(<SecurityPanel onBack={() => {}} busy />);

    expect(screen.getByText("Saving security settings…")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Multi-factor authentication" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Learn more" })).toBeDisabled();
  });

  it("locks data controls while saving", () => {
    render(<DataControlsPanel onBack={() => {}} busy />);

    expect(screen.getByText("Saving data controls…")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Improve the model for everyone" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Include audio recordings" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Include video recordings" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Archive" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Delete all" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Export" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Delete account" })).toBeDisabled();
  });
});
