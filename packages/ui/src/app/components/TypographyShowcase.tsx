export function TypographyShowcase() {
  const webTypography = [
    {
      name: 'heading1',
      example: 'heading1',
      size: '36px',
      weight: '600',
      lineHeight: '40px',
      letterSpacing: '-0.1px',
      className: 'text-[36px] font-semibold leading-[40px] tracking-[-0.1px]',
    },
    {
      name: 'heading2',
      example: 'heading2',
      size: '24px',
      weight: '600',
      lineHeight: '28px',
      letterSpacing: '-0.25px',
      className: 'text-[24px] font-semibold leading-[28px] tracking-[-0.25px]',
    },
    {
      name: 'heading3',
      example: 'heading3',
      size: '18px',
      weight: '600',
      lineHeight: '26px',
      letterSpacing: '-0.45px',
      className: 'text-[18px] font-semibold leading-[26px] tracking-[-0.45px]',
    },
    {
      name: 'body-large / emphasized',
      example: 'body-large / emphasized',
      size: '16px',
      weight: '600',
      lineHeight: '24px',
      letterSpacing: '-0.32px',
      className: 'text-[16px] font-semibold leading-[24px] tracking-[-0.32px]',
    },
    {
      name: 'body-small / emphasized',
      example: 'body-small / emphasized',
      size: '14px',
      weight: '600',
      lineHeight: '20px',
      letterSpacing: '-0.3px',
      className: 'text-[14px] font-semibold leading-[20px] tracking-[-0.3px]',
    },
    {
      name: 'label-v-large / emphasized',
      example: 'label-v-large / emphasized',
      size: '12px',
      weight: '600',
      lineHeight: '18px',
      letterSpacing: '-0.32px',
      className: 'text-[12px] font-semibold leading-[18px] tracking-[-0.32px]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-6 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
            <h2 className="font-semibold text-[12px] leading-[18px] tracking-[-0.32px]">Foundations</h2>
          </div>
          <div className="mb-4 h-px w-full bg-[#0d0d0d]" />
          <div>
            <h1 className="mb-2 text-[56px] font-semibold leading-[1.2] tracking-[0.416px]">Typography</h1>
            <a 
              href="https://developers.openai.com/apps-sdk/concepts/design-guidelines"
              className="text-[16px] leading-[24px] tracking-[-0.32px] text-[#5d5d5d] underline hover:text-[#0d0d0d]"
              target="_blank"
              rel="noopener noreferrer"
            >
              App design guidelines
            </a>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[308px_1fr]">
          {/* Font Card */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">Font</h3>
              <div className="h-px w-full bg-[#0d0d0d]" />
            </div>
            <div className="flex h-[150px] flex-col justify-between rounded-xl bg-white p-3 ring-1 ring-[#0d0d0d]/10">
              <p className="font-medium text-[12px] leading-[18px] tracking-[-0.32px]">SF Pro</p>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[64px] leading-[1.2] tracking-[-0.32px]">
                  <span className="font-normal">Aa</span>
                  <span className="font-semibold">Gg</span>
                </div>
                <p className="font-mono text-[12px] leading-[18px] tracking-[-0.32px] text-[#0d0d0d]/80">
                  400, 600
                </p>
              </div>
            </div>
          </div>

          {/* Typography Definitions */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">Definitions</h3>
              <div className="h-px w-full bg-[#0d0d0d]" />
            </div>
            <div className="space-y-0">
              {webTypography.map((type, index) => (
                <div 
                  key={type.name}
                  className={`flex items-center justify-between py-6 ${
                    index !== 0 ? 'border-t border-[#0d0d0d]/5' : ''
                  }`}
                >
                  <p className={type.className}>{type.example}</p>
                  <div className="flex gap-2">
                    <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-[#f9f9f9] px-4 py-2.5">
                      <span className="text-[10px] leading-none text-[#0d0d0d]/50">Size</span>
                      <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                        {type.size}
                      </span>
                    </div>
                    <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-[#f9f9f9] px-4 py-2.5">
                      <span className="text-[10px] leading-none text-[#0d0d0d]/50">Weight</span>
                      <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                        {type.weight}
                      </span>
                    </div>
                    <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-[#f9f9f9] px-4 py-2.5">
                      <span className="text-[10px] leading-none text-[#0d0d0d]/50">Line height</span>
                      <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                        {type.lineHeight}
                      </span>
                    </div>
                    <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-[#f9f9f9] px-4 py-2.5">
                      <span className="text-[10px] leading-none text-[#0d0d0d]/50">Letter spacing</span>
                      <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                        {type.letterSpacing}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
