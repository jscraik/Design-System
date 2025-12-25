export function SpacingShowcase() {
  const spacingTokens = [
    // Large spacing
    { size: '128px', token: 'space-64', value: 128 },
    { size: '64px', token: 'space-32', value: 64 },
    { size: '48px', token: 'space-24', value: 48 },
    { size: '40px', token: 'space-20', value: 40 },
    { size: '32px', token: 'space-16', value: 32 },
    
    // Medium spacing
    { size: '24px', token: 'space-12', value: 24 },
    { size: '16px', token: 'space-8', value: 16 },
    { size: '12px', token: 'space-6', value: 12 },
    { size: '8px', token: 'space-4', value: 8 },
    { size: '4px', token: 'space-2', value: 4 },
    
    // Small spacing
    { size: '2px', token: 'space-1', value: 2 },
    { size: '0', token: 'space-0', value: 0 },
  ];

  const largeSpacing = spacingTokens.slice(0, 5);
  const mediumSpacing = spacingTokens.slice(5, 10);
  const smallSpacing = spacingTokens.slice(10, 12);

  const SpacingBox = ({ size, token, value }: { size: string; token: string; value: number }) => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-32 items-center justify-center bg-[rgba(0,0,0,0.02)] p-6">
        <div
          className="border border-[#ff69b4] bg-[rgba(255,105,180,0.25)]"
          style={{
            width: value === 0 ? '100%' : `${value}px`,
            height: value === 0 ? '100%' : `${value}px`,
            opacity: value === 0 ? 0 : 1,
          }}
        />
      </div>
      <div className="flex flex-col items-center font-mono text-[12px] leading-[18px] tracking-[-0.32px]">
        <p className="text-[#0d0d0d]">{size}</p>
        <p className="text-[#0d0d0d]/50">{token}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-sm">
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
            <h1 className="text-[56px] font-semibold leading-[1.2] tracking-[0.416px]">Spacing</h1>
          </div>
        </div>

        {/* Definitions */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">Definitions</h3>
            <div className="h-px w-full bg-[#0d0d0d]" />
          </div>

          <div className="space-y-6">
            {/* Large Spacing Row */}
            <div className="flex flex-wrap gap-6">
              {largeSpacing.map((spacing) => (
                <SpacingBox key={spacing.token} {...spacing} />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#0d0d0d]/10" />

            {/* Medium Spacing Row */}
            <div className="flex flex-wrap gap-6">
              {mediumSpacing.map((spacing) => (
                <SpacingBox key={spacing.token} {...spacing} />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#0d0d0d]/10" />

            {/* Small Spacing Row */}
            <div className="flex flex-wrap gap-6">
              {smallSpacing.map((spacing) => (
                <SpacingBox key={spacing.token} {...spacing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
