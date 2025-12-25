import svgPaths from "./svg-h6e94ice6p";

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
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[12px] text-black text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Foundations
      </p>
    </div>
  );
}

function ActionsDivider() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Actions + Divider">
      <Metadata />
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 736 2">
            <line id="Accent" stroke="var(--stroke-0, black)" strokeWidth="2" x2="736" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ComponentDesc() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Component + Desc.">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[1.2] relative shrink-0 text-[56px] text-black text-nowrap tracking-[0.416px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Spacing
      </p>
    </div>
  );
}

function UtilityComponentFrameHeader() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Utility-componentFrameHeader">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative w-full">
          <ActionsDivider />
          <ComponentDesc />
        </div>
      </div>
    </div>
  );
}

function UtilityComponentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[12px] text-black text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Definitions
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 736 2">
            <line id="Accent" stroke="var(--stroke-0, black)" strokeWidth="2" x2="736" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[128px]" data-name="128">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component11 />
    </div>
  );
}

function StyleDetails() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">128px</p>
      <p className="opacity-50 relative shrink-0">space-64</p>
    </div>
  );
}

function PreviewDetails() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value />
      <StyleDetails />
    </div>
  );
}

function SpacingPreviewRow() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails />
    </div>
  );
}

function Component10() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[64px]" data-name="64">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value1() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component10 />
    </div>
  );
}

function StyleDetails1() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">64px</p>
      <p className="opacity-50 relative shrink-0">space-32</p>
    </div>
  );
}

function PreviewDetails1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value1 />
      <StyleDetails1 />
    </div>
  );
}

function SpacingPreviewRow1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails1 />
    </div>
  );
}

function Component9() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[48px]" data-name="48">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value2() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component9 />
    </div>
  );
}

function StyleDetails2() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">48px</p>
      <p className="opacity-50 relative shrink-0">space-24</p>
    </div>
  );
}

function PreviewDetails2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value2 />
      <StyleDetails2 />
    </div>
  );
}

function SpacingPreviewRow2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails2 />
    </div>
  );
}

function Component8() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[40px]" data-name="40">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value3() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component8 />
    </div>
  );
}

function StyleDetails3() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">40px</p>
      <p className="opacity-50 relative shrink-0">space-20</p>
    </div>
  );
}

function PreviewDetails3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value3 />
      <StyleDetails3 />
    </div>
  );
}

function SpacingPreviewRow3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails3 />
    </div>
  );
}

function Component7() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[32px]" data-name="32">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value4() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component7 />
    </div>
  );
}

function StyleDetails4() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">32px</p>
      <p className="opacity-50 relative shrink-0">space-16</p>
    </div>
  );
}

function PreviewDetails4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value4 />
      <StyleDetails4 />
    </div>
  );
}

function SpacingPreviewRow4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails4 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-start flex flex-wrap gap-[24px] items-start relative shrink-0" data-name="Row">
      <SpacingPreviewRow />
      <SpacingPreviewRow1 />
      <SpacingPreviewRow2 />
      <SpacingPreviewRow3 />
      <SpacingPreviewRow4 />
    </div>
  );
}

function Component6() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[24px]" data-name="24">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value5() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component6 />
    </div>
  );
}

function StyleDetails5() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">24px</p>
      <p className="opacity-50 relative shrink-0">space-12</p>
    </div>
  );
}

function PreviewDetails5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value5 />
      <StyleDetails5 />
    </div>
  );
}

function SpacingPreviewRow5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails5 />
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[16px]" data-name="16">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value6() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component5 />
    </div>
  );
}

function StyleDetails6() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">16px</p>
      <p className="opacity-50 relative shrink-0">space-8</p>
    </div>
  );
}

function PreviewDetails6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value6 />
      <StyleDetails6 />
    </div>
  );
}

function SpacingPreviewRow6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails6 />
    </div>
  );
}

function Component4() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[12px]" data-name="12">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value7() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component4 />
    </div>
  );
}

function StyleDetails7() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">12px</p>
      <p className="opacity-50 relative shrink-0">space-6</p>
    </div>
  );
}

function PreviewDetails7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value7 />
      <StyleDetails7 />
    </div>
  );
}

function SpacingPreviewRow7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails7 />
    </div>
  );
}

function Component3() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[8px]" data-name="8">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value8() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component3 />
    </div>
  );
}

function StyleDetails8() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">8px</p>
      <p className="opacity-50 relative shrink-0">space-4</p>
    </div>
  );
}

function PreviewDetails8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value8 />
      <StyleDetails8 />
    </div>
  );
}

function SpacingPreviewRow8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails8 />
    </div>
  );
}

function Component2() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[4px]" data-name="4">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value9() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component2 />
    </div>
  );
}

function StyleDetails9() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">4px</p>
      <p className="opacity-50 relative shrink-0">space-2</p>
    </div>
  );
}

function PreviewDetails9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value9 />
      <StyleDetails9 />
    </div>
  );
}

function SpacingPreviewRow9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails9 />
    </div>
  );
}

function Row1() {
  return (
    <div className="content-start flex flex-wrap gap-[24px] items-start relative shrink-0" data-name="Row">
      <SpacingPreviewRow5 />
      <SpacingPreviewRow6 />
      <SpacingPreviewRow7 />
      <SpacingPreviewRow8 />
      <SpacingPreviewRow9 />
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] relative shrink-0 size-[2px]" data-name="2">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value10() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component1 />
    </div>
  );
}

function StyleDetails10() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">2px</p>
      <p className="opacity-50 relative shrink-0">space-1</p>
    </div>
  );
}

function PreviewDetails10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value10 />
      <StyleDetails10 />
    </div>
  );
}

function SpacingPreviewRow10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails10 />
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[rgba(255,105,180,0.25)] opacity-0 relative shrink-0 size-[256px]" data-name="0">
      <div aria-hidden="true" className="absolute border border-[#ff69b4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Value11() {
  return (
    <div className="bg-[rgba(0,0,0,0.02)] content-stretch flex flex-col gap-[8px] items-center justify-center p-[24px] relative shrink-0 size-[128px]" data-name="Value">
      <Component />
    </div>
  );
}

function StyleDetails11() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Mono:Medium',sans-serif] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap tracking-[-0.32px] w-full" data-name="Style + Details">
      <p className="relative shrink-0">0</p>
      <p className="opacity-50 relative shrink-0">space-0</p>
    </div>
  );
}

function PreviewDetails11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0" data-name="Preview + Details">
      <Value11 />
      <StyleDetails11 />
    </div>
  );
}

function SpacingPreviewRow11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="_spacingPreviewRow">
      <PreviewDetails11 />
    </div>
  );
}

function Row2() {
  return (
    <div className="content-start flex flex-wrap gap-[24px] items-start relative shrink-0" data-name="Row">
      <SpacingPreviewRow10 />
      <SpacingPreviewRow11 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Table">
      <Row />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 736 1">
            <line id="Divider" stroke="var(--stroke-0, black)" strokeOpacity="0.1" x2="736" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Row1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 736 1">
            <line id="Divider" stroke="var(--stroke-0, black)" strokeOpacity="0.1" x2="736" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Row2 />
    </div>
  );
}

function Definitions() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Definitions">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative w-full">
          <UtilityComponentHeading />
          <Table />
        </div>
      </div>
    </div>
  );
}

export default function Spacing() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Spacing">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip p-[32px] relative size-full">
          <UtilityComponentFrameHeader />
          <Definitions />
        </div>
      </div>
    </div>
  );
}