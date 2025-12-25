import svgPaths from "./svg-0g7fqv5s72";

function IconOpenaiLogoBold() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon / openai-logo-bold">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon / openai-logo-bold">
          <path d={svgPaths.p3bdf2500} fill="var(--fill-0, #0D0D0D)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

function Metadata() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Metadata">
      <IconOpenaiLogoBold />
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Iconography
      </p>
    </div>
  );
}

function ActionsDivider() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Actions + Divider">
      <Metadata />
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ComponentDesc() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Component + Desc.">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[1.2] relative shrink-0 text-[#0d0d0d] text-[56px] text-nowrap tracking-[0.416px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Platform
      </p>
    </div>
  );
}

export default function UtilityComponentFrameHeader() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Utility-componentFrameHeader">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative size-full">
          <ActionsDivider />
          <ComponentDesc />
        </div>
      </div>
    </div>
  );
}