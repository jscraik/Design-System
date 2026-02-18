import "../../../styles/widget.css";
import { useWidgetProps } from "../../../shared/use-widget-props";
import { mountWidget } from "../../../shared/widget-base";

import { AuthDemo, type AuthDemoProps } from "./auth-demo";

function AuthDemoWidget() {
  const props = useWidgetProps<AuthDemoProps>({
    authStatus: {
      authenticated: false,
      level: "none",
    },
  });
  return <AuthDemo {...props} />;
}

mountWidget(<AuthDemoWidget />);
