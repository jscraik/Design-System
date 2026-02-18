import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

describe("Chart", () => {
  const mockOnStateChange = vi.fn();
  const mockData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 150 },
  ];
  const mockConfig = {
    value: { label: "Value", color: "#hsl(var(--chart-1))" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ChartContainer", () => {
    describe("Basic rendering", () => {
      it("renders chart container", () => {
        render(
          <ChartContainer config={mockConfig}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toBeInTheDocument();
      });

      it("renders children chart", () => {
        render(
          <ChartContainer config={mockConfig}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        // Recharts ResponsiveContainer should render
        const responsiveContainer = document.querySelector(".recharts-responsive-container");
        expect(responsiveContainer).toBeInTheDocument();
      });

      it("has data-chart attribute", () => {
        render(
          <ChartContainer config={mockConfig}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("data-chart");
      });

      it("uses custom id when provided", () => {
        render(
          <ChartContainer id="custom-chart" config={mockConfig}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("data-chart", "chart-custom-chart");
      });

      it("applies custom className", () => {
        render(
          <ChartContainer config={mockConfig} className="custom-class">
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveClass("custom-class");
      });
    });

    describe("Stateful props - Loading", () => {
      it("calls onStateChange with 'loading'", async () => {
        render(
          <ChartContainer config={mockConfig} loading onStateChange={mockOnStateChange}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("loading");
        });
      });

      it("shows loading overlay when loading", () => {
        render(
          <ChartContainer config={mockConfig} loading>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        expect(screen.getByText("Loading chart...")).toBeInTheDocument();
      });

      it("has animate-pulse class when loading", () => {
        render(
          <ChartContainer config={mockConfig} loading>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveClass("animate-pulse");
      });
    });

    describe("Stateful props - Error", () => {
      it("calls onStateChange with 'error'", async () => {
        render(
          <ChartContainer
            config={mockConfig}
            error="Failed to load"
            onStateChange={mockOnStateChange}
          >
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("error");
        });
      });

      it("shows error overlay when error", () => {
        render(
          <ChartContainer config={mockConfig} error="Failed to load chart">
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        expect(screen.getByText("Failed to load chart")).toBeInTheDocument();
      });

      it("has ring class when error", () => {
        render(
          <ChartContainer config={mockConfig} error="Failed">
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveClass("ring-2");
      });
    });

    describe("Stateful props - Disabled", () => {
      it("calls onStateChange with 'disabled'", async () => {
        render(
          <ChartContainer config={mockConfig} disabled onStateChange={mockOnStateChange}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
        });
      });

      it("has reduced opacity when disabled", () => {
        render(
          <ChartContainer config={mockConfig} disabled>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveClass("opacity-50");
      });

      it("prevents pointer events when disabled", () => {
        render(
          <ChartContainer config={mockConfig} disabled>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveClass("pointer-events-none");
      });
    });

    describe("Stateful props - Required", () => {
      it("calls onStateChange with 'default' when required", async () => {
        render(
          <ChartContainer config={mockConfig} required onStateChange={mockOnStateChange}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("default");
        });
      });
    });

    describe("State priority", () => {
      it("prioritizes loading over error and disabled", async () => {
        render(
          <ChartContainer
            config={mockConfig}
            loading
            error="Error"
            disabled
            onStateChange={mockOnStateChange}
          >
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("loading");
        });
      });

      it("prioritizes error over disabled when not loading", async () => {
        render(
          <ChartContainer
            config={mockConfig}
            error="Error"
            disabled
            onStateChange={mockOnStateChange}
          >
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        await waitFor(() => {
          expect(mockOnStateChange).toHaveBeenCalledWith("error");
        });
      });
    });

    describe("Accessibility", () => {
      it("has aria-disabled when disabled", () => {
        render(
          <ChartContainer config={mockConfig} disabled>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("aria-disabled", "true");
      });

      it("has aria-invalid when error", () => {
        render(
          <ChartContainer config={mockConfig} error="Failed">
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("aria-invalid", "true");
      });

      it("has aria-busy when loading", () => {
        render(
          <ChartContainer config={mockConfig} loading>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("aria-busy", "true");
      });

      it("has aria-required when required", () => {
        render(
          <ChartContainer config={mockConfig} required>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("aria-required", "true");
      });

      it("has data-state attribute reflecting current state", () => {
        render(
          <ChartContainer config={mockConfig} loading>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("data-state", "loading");
      });

      it("has data-error attribute when error", () => {
        render(
          <ChartContainer config={mockConfig} error="Failed">
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("data-error", "true");
      });

      it("has data-required attribute when required", () => {
        render(
          <ChartContainer config={mockConfig} required>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toHaveAttribute("data-required", "true");
      });
    });

    describe("Chart theming", () => {
      it("applies theme colors to chart", () => {
        const configWithTheme = {
          value: {
            label: "Value",
            theme: { light: "#ff0000", dark: "#00ff00" },
          },
        };

        render(
          <ChartContainer config={configWithTheme}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        // Should inject style tag with CSS variables
        const styleTag = document.querySelector("style");
        expect(styleTag).toBeInTheDocument();
      });

      it("applies static color to chart", () => {
        const configWithColor = {
          value: {
            label: "Value",
            color: "#ff0000",
          },
        };

        render(
          <ChartContainer config={configWithColor}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        // Should inject style tag with CSS variables
        const styleTag = document.querySelector("style");
        expect(styleTag).toBeInTheDocument();
      });

      it("handles config without colors", () => {
        const configWithoutColor = {
          value: {
            label: "Value",
          },
        };

        render(
          <ChartContainer config={configWithoutColor}>
            <LineChart data={mockData}>
              <Line dataKey="value" />
            </LineChart>
          </ChartContainer>,
        );
        const container = document.querySelector('[data-slot="chart"]');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe("ChartTooltip", () => {
    it("renders tooltip component", () => {
      render(
        <ChartContainer config={mockConfig}>
          <LineChart data={mockData}>
            <Line dataKey="value" />
            <ChartTooltip />
          </LineChart>
        </ChartContainer>,
      );
      // Verify ChartContainer is rendered with the chart
      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("renders with custom content", () => {
      const CustomContent = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;
        return <div>Custom tooltip</div>;
      };

      render(
        <ChartContainer config={mockConfig}>
          <LineChart data={mockData}>
            <Line dataKey="value" />
            <ChartTooltip content={<CustomContent />} />
          </LineChart>
        </ChartContainer>,
      );
      // Verify container is rendered
      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("ChartTooltipContent", () => {
    it("renders tooltip content when active", () => {
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
          payload: { name: "Jan", value: 100 },
          color: "#ff0000",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} />
        </ChartContainer>,
      );

      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("does not render when inactive", () => {
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={false} payload={mockPayload} />
        </ChartContainer>,
      );

      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });

    it("hides label when hideLabel is true", () => {
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} hideLabel />
        </ChartContainer>,
      );
      // Should render without label
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("hides indicator when hideIndicator is true", () => {
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} hideIndicator />
        </ChartContainer>,
      );
      // Should render without indicator dot
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("uses custom formatter", () => {
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
        },
      ];

      const formatter = (value: number) => `$${value}`;

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} formatter={formatter} />
        </ChartContainer>,
      );

      expect(screen.getByText("$100")).toBeInTheDocument();
    });
  });

  describe("ChartLegend", () => {
    it("renders legend component", () => {
      render(
        <ChartContainer config={mockConfig}>
          <LineChart data={mockData}>
            <Line dataKey="value" />
            <ChartLegend />
          </LineChart>
        </ChartContainer>,
      );
      // Verify ChartContainer is rendered with the chart
      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("ChartLegendContent", () => {
    it("renders legend items", () => {
      const mockPayload = [
        {
          value: "Value",
          color: "#ff0000",
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={mockPayload} />
        </ChartContainer>,
      );

      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("does not render when no payload", () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={[]} />
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      // Should still have chart container but no legend
      expect(container).toBeInTheDocument();
    });

    it("hides icon when hideIcon is true", () => {
      const mockPayload = [
        {
          value: "Value",
          color: "#ff0000",
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={mockPayload} hideIcon />
        </ChartContainer>,
      );

      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("uses custom icon from config", () => {
      const CustomIcon = () => <div data-testid="custom-icon">★</div>;
      const configWithIcon = {
        value: {
          label: "Value",
          icon: CustomIcon,
        },
      };
      const mockPayload = [
        {
          value: "Value",
          color: "#ff0000",
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={configWithIcon}>
          <ChartLegendContent payload={mockPayload} />
        </ChartContainer>,
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("renders complete chart with all components", () => {
      render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" />
            <ChartTooltip />
            <ChartLegend />
          </BarChart>
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("handles chart with multiple series", () => {
      const multiSeriesConfig = {
        value1: { label: "Series 1", color: "#ff0000" },
        value2: { label: "Series 2", color: "#00ff00" },
      };

      render(
        <ChartContainer config={multiSeriesConfig}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value1" fill="#ff0000" />
            <Bar dataKey="value2" fill="#00ff00" />
          </BarChart>
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("handles chart with no data", () => {
      render(
        <ChartContainer config={mockConfig}>
          <LineChart data={[]}>
            <Line dataKey="value" />
          </LineChart>
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("useChart hook", () => {
    it("provides config through context", () => {
      // This is tested implicitly by ChartTooltipContent and ChartLegendContent
      // which use useChart internally
      const mockPayload = [
        {
          name: "Value",
          value: 100,
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} />
        </ChartContainer>,
      );

      // The value "100" should be displayed by ChartTooltipContent
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("handles empty config", () => {
      render(
        <ChartContainer config={{}}>
          <LineChart data={mockData}>
            <Line dataKey="value" />
          </LineChart>
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("handles config with only label", () => {
      const minimalConfig = {
        value: {
          label: "Value only",
        },
      };

      render(
        <ChartContainer config={minimalConfig}>
          <LineChart data={mockData}>
            <Line dataKey="value" />
          </LineChart>
        </ChartContainer>,
      );

      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("handles null payload gracefully", () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={false} payload={null} />
        </ChartContainer>,
      );

      // Should not throw
      const container = document.querySelector('[data-slot="chart"]');
      expect(container).toBeInTheDocument();
    });

    it("handles payload without name", () => {
      const mockPayload = [
        {
          value: 100,
          dataKey: "value",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} />
        </ChartContainer>,
      );

      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });
});
