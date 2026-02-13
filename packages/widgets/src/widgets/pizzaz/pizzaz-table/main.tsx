import { createEmbeddedHost, ensureMockOpenAI, HostProvider } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles.css";

// Mock for standalone development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      data: [
        { id: 1, name: "Pizza Margherita", price: "$12", rating: 4.5 },
        { id: 2, name: "Pizza Pepperoni", price: "$14", rating: 4.8 },
        { id: 3, name: "Pizza Quattro Stagioni", price: "$16", rating: 4.3 },
      ],
    },
  });
}

/**
 * Render the Pizzaz table widget with tool output data.
 */
function PizzazTableWidget() {
  const host = createEmbeddedHost();
  type TableRow = Record<string, string | number>;
  const data = (host.toolOutput as { data?: TableRow[] } | undefined)?.data ?? [];

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <div className="p-4 bg-surface text-primary">
          <h1 className="text-[16px] font-semibold mb-4 leading-[22px] tracking-[-0.32px]">
            Pizzaz Table
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-subtle">
              <thead>
                <tr className="bg-surface-secondary">
                  <th className="border border-subtle px-3 py-2 text-left text-[13px] font-semibold leading-[18px] tracking-[-0.3px]">
                    Name
                  </th>
                  <th className="border border-subtle px-3 py-2 text-left text-[13px] font-semibold leading-[18px] tracking-[-0.3px]">
                    Price
                  </th>
                  <th className="border border-subtle px-3 py-2 text-left text-[13px] font-semibold leading-[18px] tracking-[-0.3px]">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="odd:bg-surface-secondary">
                    <td className="border border-subtle px-3 py-2 text-[13px] leading-[18px] tracking-[-0.3px]">
                      {item.name}
                    </td>
                    <td className="border border-subtle px-3 py-2 text-[13px] leading-[18px] tracking-[-0.3px]">
                      {item.price}
                    </td>
                    <td className="border border-subtle px-3 py-2 text-[13px] leading-[18px] tracking-[-0.3px]">
                      {item.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PizzazTableWidget />
  </StrictMode>,
);
