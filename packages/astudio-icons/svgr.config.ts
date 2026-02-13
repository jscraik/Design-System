import type { Config } from "@svgr/core";

const config: Config = {
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  jsxRuntime: "classic",
  typescript: true,
  ref: true,
  icon: false,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            removeTitle: false,
          },
        },
      },
      "removeDimensions",
    ],
  },
  template: (variables, { tpl }) => {
    return tpl`
import * as React from "react";
import type { SVGProps } from "react";

const ${variables.componentName} = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => ${variables.jsx}
);

${variables.componentName}.displayName = "${variables.componentName}";

export default ${variables.componentName};
`;
  },
};

export default config;
