function UtilityComponentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Font
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 308 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="308" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center leading-[1.2] relative shrink-0 text-[#0d0d0d] text-[64px] text-nowrap tracking-[-0.32px]" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Aa
      </p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Gg
      </p>
    </div>
  );
}

function WeightS() {
  return (
    <div className="content-stretch flex items-center opacity-80 relative shrink-0" data-name="Weight(s)">
      <p className="font-['SF_Mono:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]">400, 600</p>
    </div>
  );
}

function TypeDetails() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Type + Details">
      <Preview />
      <WeightS />
    </div>
  );
}

function Preview1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[150px] items-start justify-between pl-[12px] pr-[128px] py-[12px] relative rounded-[12px] shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[18px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        SF Pro
      </p>
      <TypeDetails />
    </div>
  );
}

function Font() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[32px] items-start relative rounded-[8px] shrink-0 w-[308px]" data-name="Font">
      <UtilityComponentHeading />
      <Preview1 />
    </div>
  );
}

function UtilityComponentHeading1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Definitions
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 957 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="957" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] relative shrink-0 text-[#0d0d0d] text-[36px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading1
      </p>
    </div>
  );
}

function Size() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        36px
      </p>
    </div>
  );
}

function Weight() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        40px
      </p>
    </div>
  );
}

function LetterSpacing() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.1px
      </p>
    </div>
  );
}

function DetailsWeight() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size />
      <Weight />
      <LineHeight />
      <LetterSpacing />
    </div>
  );
}

function PreviewDetails() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview2 />
      <DetailsWeight />
    </div>
  );
}

function TextPreviewRow() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <PreviewDetails />
    </div>
  );
}

function Preview3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading2
      </p>
    </div>
  );
}

function Size1() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        24px
      </p>
    </div>
  );
}

function Weight1() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight1() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        28px
      </p>
    </div>
  );
}

function LetterSpacing1() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.25px
      </p>
    </div>
  );
}

function DetailsWeight1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size1 />
      <Weight1 />
      <LineHeight1 />
      <LetterSpacing1 />
    </div>
  );
}

function PreviewDetails1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview3 />
      <DetailsWeight1 />
    </div>
  );
}

function TextPreviewRow1() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails1 />
    </div>
  );
}

function Preview4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[26px] relative shrink-0 text-[#0d0d0d] text-[18px] text-nowrap tracking-[-0.45px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading3
      </p>
    </div>
  );
}

function Size2() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        18px
      </p>
    </div>
  );
}

function Weight2() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight2() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing2() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.45px
      </p>
    </div>
  );
}

function DetailsWeight2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size2 />
      <Weight2 />
      <LineHeight2 />
      <LetterSpacing2 />
    </div>
  );
}

function PreviewDetails2() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview4 />
      <DetailsWeight2 />
    </div>
  );
}

function TextPreviewRow2() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails2 />
    </div>
  );
}

function Preview5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[26px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[16px] text-nowrap tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span style={{ fontVariationSettings: "'wdth' 100" }}>{`body / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size3() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function Weight3() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight3() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing3() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.4px
      </p>
    </div>
  );
}

function DetailsWeight3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size3 />
      <Weight3 />
      <LineHeight3 />
      <LetterSpacing3 />
    </div>
  );
}

function PreviewDetails3() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview5 />
      <DetailsWeight3 />
    </div>
  );
}

function TextPreviewRow3() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails3 />
    </div>
  );
}

function Preview6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[14px] text-nowrap tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span style={{ fontVariationSettings: "'wdth' 100" }}>{`body-small / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size4() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        14px
      </p>
    </div>
  );
}

function Weight4() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight4() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        18px
      </p>
    </div>
  );
}

function LetterSpacing4() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.3px
      </p>
    </div>
  );
}

function DetailsWeight4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size4 />
      <Weight4 />
      <LineHeight4 />
      <LetterSpacing4 />
    </div>
  );
}

function PreviewDetails4() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview6 />
      <DetailsWeight4 />
    </div>
  );
}

function TextPreviewRow4() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails4 />
    </div>
  );
}

function Preview7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[12px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span style={{ fontVariationSettings: "'wdth' 100" }}>{`caption / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size5() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        12px
      </p>
    </div>
  );
}

function Weight5() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight5() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function LetterSpacing5() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.1px
      </p>
    </div>
  );
}

function DetailsWeight5() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size5 />
      <Weight5 />
      <LineHeight5 />
      <LetterSpacing5 />
    </div>
  );
}

function PreviewDetails5() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview7 />
      <DetailsWeight5 />
    </div>
  );
}

function TextPreviewRow5() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails5 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Table">
      <TextPreviewRow />
      <TextPreviewRow1 />
      <TextPreviewRow2 />
      <TextPreviewRow3 />
      <TextPreviewRow4 />
      <TextPreviewRow5 />
    </div>
  );
}

function Definitions() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Definitions">
      <UtilityComponentHeading1 />
      <Table />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full" data-name="Content">
      <Font />
      <Definitions />
    </div>
  );
}

function TypographyWeb() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[56px] items-start overflow-clip p-[32px] relative shrink-0 w-[1393px]" data-name="Typography / Web">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Typography / Web
      </p>
      <Content />
    </div>
  );
}

function UtilityComponentHeading2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Font
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 308 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="308" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center leading-[1.2] relative shrink-0 text-[#0d0d0d] text-[64px] text-nowrap tracking-[-0.32px]" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Aa
      </p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Gg
      </p>
    </div>
  );
}

function WeightS1() {
  return (
    <div className="content-stretch flex items-center opacity-80 relative shrink-0" data-name="Weight(s)">
      <p className="font-['SF_Mono:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]">400, 600</p>
    </div>
  );
}

function TypeDetails1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Type + Details">
      <Preview8 />
      <WeightS1 />
    </div>
  );
}

function Preview9() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[150px] items-start justify-between pl-[12px] pr-[128px] py-[12px] relative rounded-[12px] shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[18px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        SF Pro
      </p>
      <TypeDetails1 />
    </div>
  );
}

function Font1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[32px] items-start relative rounded-[8px] shrink-0 w-[308px]" data-name="Font">
      <UtilityComponentHeading2 />
      <Preview9 />
    </div>
  );
}

function UtilityComponentHeading3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Definitions
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 957 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="957" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[36px] relative shrink-0 text-[#0d0d0d] text-[32px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading1
      </p>
    </div>
  );
}

function Size6() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        32px
      </p>
    </div>
  );
}

function Weight6() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight6() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        40px
      </p>
    </div>
  );
}

function LetterSpacing6() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.1px
      </p>
    </div>
  );
}

function DetailsWeight6() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size6 />
      <Weight6 />
      <LineHeight6 />
      <LetterSpacing6 />
    </div>
  );
}

function PreviewDetails6() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview10 />
      <DetailsWeight6 />
    </div>
  );
}

function TextPreviewRow6() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <PreviewDetails6 />
    </div>
  );
}

function Preview11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading2
      </p>
    </div>
  );
}

function Size7() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        24px
      </p>
    </div>
  );
}

function Weight7() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight7() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        28px
      </p>
    </div>
  );
}

function LetterSpacing7() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.25px
      </p>
    </div>
  );
}

function DetailsWeight7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size7 />
      <Weight7 />
      <LineHeight7 />
      <LetterSpacing7 />
    </div>
  );
}

function PreviewDetails7() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview11 />
      <DetailsWeight7 />
    </div>
  );
}

function TextPreviewRow7() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails7 />
    </div>
  );
}

function Preview12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[26px] relative shrink-0 text-[#0d0d0d] text-[18px] text-nowrap tracking-[-0.45px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading3
      </p>
    </div>
  );
}

function Size8() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        18px
      </p>
    </div>
  );
}

function Weight8() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight8() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing8() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.45px
      </p>
    </div>
  );
}

function DetailsWeight8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size8 />
      <Weight8 />
      <LineHeight8 />
      <LetterSpacing8 />
    </div>
  );
}

function PreviewDetails8() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview12 />
      <DetailsWeight8 />
    </div>
  );
}

function TextPreviewRow8() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails8 />
    </div>
  );
}

function Preview13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[17px] text-nowrap tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span style={{ fontVariationSettings: "'wdth' 100" }}>{`body / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size9() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function Weight9() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight9() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing9() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.4px
      </p>
    </div>
  );
}

function DetailsWeight9() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size9 />
      <Weight9 />
      <LineHeight9 />
      <LetterSpacing9 />
    </div>
  );
}

function PreviewDetails9() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview13 />
      <DetailsWeight9 />
    </div>
  );
}

function TextPreviewRow9() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails9 />
    </div>
  );
}

function Preview14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[0] relative shrink-0 text-[#0d0d0d] text-[0px] text-[14px] text-nowrap tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`body-small / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size10() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        14px
      </p>
    </div>
  );
}

function Weight10() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight10() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        18px
      </p>
    </div>
  );
}

function LetterSpacing10() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.3px
      </p>
    </div>
  );
}

function DetailsWeight10() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size10 />
      <Weight10 />
      <LineHeight10 />
      <LetterSpacing10 />
    </div>
  );
}

function PreviewDetails10() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview14 />
      <DetailsWeight10 />
    </div>
  );
}

function TextPreviewRow10() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails10 />
    </div>
  );
}

function Preview15() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[13px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span style={{ fontVariationSettings: "'wdth' 100" }}>{`caption / regular / `}</span>
        <span className="font-['SF_Pro:Semibold',sans-serif] font-[590]" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size11() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        12px
      </p>
    </div>
  );
}

function Weight11() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight11() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function LetterSpacing11() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.1px
      </p>
    </div>
  );
}

function DetailsWeight11() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size11 />
      <Weight11 />
      <LineHeight11 />
      <LetterSpacing11 />
    </div>
  );
}

function PreviewDetails11() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview15 />
      <DetailsWeight11 />
    </div>
  );
}

function TextPreviewRow11() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails11 />
    </div>
  );
}

function Table1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Table">
      <TextPreviewRow6 />
      <TextPreviewRow7 />
      <TextPreviewRow8 />
      <TextPreviewRow9 />
      <TextPreviewRow10 />
      <TextPreviewRow11 />
    </div>
  );
}

function Definitions1() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Definitions">
      <UtilityComponentHeading3 />
      <Table1 />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full" data-name="Content">
      <Font1 />
      <Definitions1 />
    </div>
  );
}

function TypographyIOs() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[56px] items-start overflow-clip p-[32px] relative shrink-0 w-[1393px]" data-name="Typography / iOS">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Typography / iOS
      </p>
      <Content1 />
    </div>
  );
}

function UtilityComponentHeading4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Font
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 308 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="308" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center leading-[1.2] relative shrink-0 text-[#0d0d0d] text-[64px] text-nowrap tracking-[-0.32px]" data-name="Preview">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Aa
      </p>
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Gg
      </p>
    </div>
  );
}

function WeightS2() {
  return (
    <div className="content-stretch flex items-center opacity-80 relative shrink-0" data-name="Weight(s)">
      <p className="font-['SF_Mono:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]">400, 600</p>
    </div>
  );
}

function TypeDetails2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Type + Details">
      <Preview16 />
      <WeightS2 />
    </div>
  );
}

function Preview17() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[150px] items-start justify-between pl-[12px] pr-[128px] py-[12px] relative rounded-[12px] shrink-0" data-name="Preview">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[18px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        SF Pro
      </p>
      <TypeDetails2 />
    </div>
  );
}

function Font2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[32px] items-start relative rounded-[8px] shrink-0 w-[308px]" data-name="Font">
      <UtilityComponentHeading4 />
      <Preview17 />
    </div>
  );
}

function UtilityComponentHeading5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[40px] items-start relative shrink-0 w-full" data-name="Utility-componentHeading">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap tracking-[-0.32px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Definitions
      </p>
      <div className="h-0 relative shrink-0 w-full" data-name="Accent">
        <div className="absolute inset-[-2px_0_0_0]" style={{ "--stroke-0": "rgba(13, 13, 13, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 957 2">
            <line id="Accent" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="2" x2="957" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Preview18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[36px] relative shrink-0 text-[#0d0d0d] text-[32px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading1
      </p>
    </div>
  );
}

function Size12() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        32px
      </p>
    </div>
  );
}

function Weight12() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight12() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        40px
      </p>
    </div>
  );
}

function LetterSpacing12() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.1px
      </p>
    </div>
  );
}

function DetailsWeight12() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size12 />
      <Weight12 />
      <LineHeight12 />
      <LetterSpacing12 />
    </div>
  );
}

function PreviewDetails12() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview18 />
      <DetailsWeight12 />
    </div>
  );
}

function TextPreviewRow12() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <PreviewDetails12 />
    </div>
  );
}

function Preview19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading2
      </p>
    </div>
  );
}

function Size13() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        24px
      </p>
    </div>
  );
}

function Weight13() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight13() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        28px
      </p>
    </div>
  );
}

function LetterSpacing13() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        -0.25px
      </p>
    </div>
  );
}

function DetailsWeight13() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size13 />
      <Weight13 />
      <LineHeight13 />
      <LetterSpacing13 />
    </div>
  );
}

function PreviewDetails13() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview19 />
      <DetailsWeight13 />
    </div>
  );
}

function TextPreviewRow13() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails13 />
    </div>
  );
}

function Preview20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[26px] relative shrink-0 text-[#0d0d0d] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        heading3
      </p>
    </div>
  );
}

function Size14() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function Weight14() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        600
      </p>
    </div>
  );
}

function LineHeight14() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing14() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0px
      </p>
    </div>
  );
}

function DetailsWeight14() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size14 />
      <Weight14 />
      <LineHeight14 />
      <LetterSpacing14 />
    </div>
  );
}

function PreviewDetails14() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview20 />
      <DetailsWeight14 />
    </div>
  );
}

function TextPreviewRow14() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails14 />
    </div>
  );
}

function Preview21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span>{`body / regular / `}</span>
        <span className="font-['Roboto:Bold',sans-serif] font-bold" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size15() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function Weight15() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight15() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        26px
      </p>
    </div>
  );
}

function LetterSpacing15() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0px
      </p>
    </div>
  );
}

function DetailsWeight15() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size15 />
      <Weight15 />
      <LineHeight15 />
      <LetterSpacing15 />
    </div>
  );
}

function PreviewDetails15() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview21 />
      <DetailsWeight15 />
    </div>
  );
}

function TextPreviewRow15() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails15 />
    </div>
  );
}

function Preview22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0d0d0d] text-[0px] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span>{`body / regular / `}</span>
        <span className="font-['Roboto:Bold',sans-serif] font-bold" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size16() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        14px
      </p>
    </div>
  );
}

function Weight16() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight16() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        18px
      </p>
    </div>
  );
}

function LetterSpacing16() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0px
      </p>
    </div>
  );
}

function DetailsWeight16() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size16 />
      <Weight16 />
      <LineHeight16 />
      <LetterSpacing16 />
    </div>
  );
}

function PreviewDetails16() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview22 />
      <DetailsWeight16 />
    </div>
  );
}

function TextPreviewRow16() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails16 />
    </div>
  );
}

function Preview23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Preview">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d0d0d] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span>{`body-small / regular / `}</span>
        <span className="font-['Roboto:Bold',sans-serif] font-bold" style={{ fontVariationSettings: "'wdth' 100" }}>
          emphasized
        </span>
      </p>
    </div>
  );
}

function Size17() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="size">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Size</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        12px
      </p>
    </div>
  );
}

function Weight17() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="weight">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Weight</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        400 / 600
      </p>
    </div>
  );
}

function LineHeight17() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="line-height">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Line height</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        16px
      </p>
    </div>
  );
}

function LetterSpacing17() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col gap-[2px] items-start justify-center px-[16px] py-[10px] relative rounded-[12px] shrink-0 text-[#0d0d0d] text-nowrap w-[100px]" data-name="letter spacing">
      <p className="font-['OpenAI_Sans_Variable:Medium',sans-serif] leading-none not-italic opacity-50 relative shrink-0 text-[10px]">Letter spacing</p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18px] relative shrink-0 text-[14px] tracking-[-0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0px
      </p>
    </div>
  );
}

function DetailsWeight17() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Details + Weight">
      <Size17 />
      <Weight17 />
      <LineHeight17 />
      <LetterSpacing17 />
    </div>
  );
}

function PreviewDetails17() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Preview + Details">
      <Preview23 />
      <DetailsWeight17 />
    </div>
  );
}

function TextPreviewRow17() {
  return (
    <div className="content-stretch flex items-center pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="_textPreviewRow">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(13,13,13,0.05)] border-solid inset-0 pointer-events-none" />
      <PreviewDetails17 />
    </div>
  );
}

function Table2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Table">
      <TextPreviewRow12 />
      <TextPreviewRow13 />
      <TextPreviewRow14 />
      <TextPreviewRow15 />
      <TextPreviewRow16 />
      <TextPreviewRow17 />
    </div>
  );
}

function Definitions2() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Definitions">
      <UtilityComponentHeading5 />
      <Table2 />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full" data-name="Content">
      <Font2 />
      <Definitions2 />
    </div>
  );
}

function TypographyAndroid() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[56px] items-start overflow-clip p-[32px] relative shrink-0 w-[1393px]" data-name="Typography / Android">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[28px] relative shrink-0 text-[#0d0d0d] text-[24px] text-nowrap tracking-[-0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Typography / Android
      </p>
      <Content2 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex items-center relative size-full">
      <TypographyWeb />
      <TypographyIOs />
      <TypographyAndroid />
    </div>
  );
}