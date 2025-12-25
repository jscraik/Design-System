import { 
  IconSearch, 
  IconSettings, 
  IconCheckmark, 
  IconUser,
  IconEdit,
  IconTrash,
  IconCopy,
  IconShare,
  IconStar,
  IconChevronRightMd,
  IconPlusLg,
  IconArrowUpSm,
  IconThumbUp,
  IconCompose
} from './icons/ChatGPTIcons';

export function DesignSystemDocs() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-6 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-semibold leading-[18px] tracking-[-0.32px]">ChatGPT Design System</h2>
          </div>
          <div className="mb-4 h-px w-full bg-[#0d0d0d]" />
          <div>
            <h1 className="mb-4 text-[56px] font-semibold leading-[1.2] tracking-[0.416px]">Complete Reference</h1>
            <p className="text-[16px] leading-[24px] tracking-[-0.32px] text-[#5d5d5d]">
              Typography, Spacing, Colors, and Iconography standards for building ChatGPT interfaces
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">200+</div>
            <div className="text-[14px] leading-[20px] tracking-[-0.3px] text-[#5d5d5d]">Icons</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">12</div>
            <div className="text-[14px] leading-[20px] tracking-[-0.3px] text-[#5d5d5d]">Spacing Tokens</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">6</div>
            <div className="text-[14px] leading-[20px] tracking-[-0.3px] text-[#5d5d5d]">Typography Styles</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">30+</div>
            <div className="text-[14px] leading-[20px] tracking-[-0.3px] text-[#5d5d5d]">Color Variables</div>
          </div>
        </div>

        {/* Icon Categories */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">Icon Library</h2>
          
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {/* Navigation Icons */}
            <div className="rounded-lg bg-[#f9f9f9] p-6">
              <h3 className="mb-4 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Navigation</h3>
              <div className="flex flex-wrap gap-4">
                <IconArrowUpSm className="size-6" />
                <IconChevronRightMd className="size-6" />
                <IconSearch className="size-6" />
                <IconPlusLg className="size-6" />
              </div>
              <p className="mt-4 text-[12px] leading-[18px] tracking-[-0.32px] text-[#5d5d5d]">
                Arrows, Chevrons, Plus, Search
              </p>
            </div>

            {/* Interface Icons */}
            <div className="rounded-lg bg-[#f9f9f9] p-6">
              <h3 className="mb-4 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Interface</h3>
              <div className="flex flex-wrap gap-4">
                <IconCheckmark className="size-6" />
                <IconSettings className="size-6" />
                <IconEdit className="size-6" />
                <IconTrash className="size-6" />
              </div>
              <p className="mt-4 text-[12px] leading-[18px] tracking-[-0.32px] text-[#5d5d5d]">
                Settings, Edit, Delete, Checkmark
              </p>
            </div>

            {/* Chat Icons */}
            <div className="rounded-lg bg-[#f9f9f9] p-6">
              <h3 className="mb-4 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Chat</h3>
              <div className="flex flex-wrap gap-4">
                <IconThumbUp className="size-6" />
                <IconCompose className="size-6" />
                <IconCopy className="size-6" />
                <IconShare className="size-6" />
              </div>
              <p className="mt-4 text-[12px] leading-[18px] tracking-[-0.32px] text-[#5d5d5d]">
                Thumbs, Compose, Copy, Share
              </p>
            </div>

            {/* User Icons */}
            <div className="rounded-lg bg-[#f9f9f9] p-6">
              <h3 className="mb-4 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Account</h3>
              <div className="flex flex-wrap gap-4">
                <IconUser className="size-6" />
                <IconStar className="size-6" />
              </div>
              <p className="mt-4 text-[12px] leading-[18px] tracking-[-0.32px] text-[#5d5d5d]">
                User, Profile, Star, Plus
              </p>
            </div>
          </div>
        </div>

        {/* Typography Reference */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">Typography</h2>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-[#0d0d0d]/10 p-6">
              <div className="mb-2 text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">heading1</div>
              <code className="text-[12px] text-[#5d5d5d]">
                text-[36px] font-semibold leading-[40px] tracking-[-0.1px]
              </code>
            </div>
            
            <div className="rounded-lg border border-[#0d0d0d]/10 p-6">
              <div className="mb-2 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">heading2</div>
              <code className="text-[12px] text-[#5d5d5d]">
                text-[24px] font-semibold leading-[28px] tracking-[-0.25px]
              </code>
            </div>
            
            <div className="rounded-lg border border-[#0d0d0d]/10 p-6">
              <div className="mb-2 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">heading3</div>
              <code className="text-[12px] text-[#5d5d5d]">
                text-[18px] font-semibold leading-[26px] tracking-[-0.45px]
              </code>
            </div>
            
            <div className="rounded-lg border border-[#0d0d0d]/10 p-6">
              <div className="mb-2 text-[16px] font-semibold leading-[24px] tracking-[-0.32px]">body-large / emphasized</div>
              <code className="text-[12px] text-[#5d5d5d]">
                text-[16px] font-semibold leading-[24px] tracking-[-0.32px]
              </code>
            </div>
          </div>
        </div>

        {/* Spacing Reference */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">Spacing Scale</h2>
          
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { token: 'space-64', value: '128px' },
              { token: 'space-32', value: '64px' },
              { token: 'space-24', value: '48px' },
              { token: 'space-20', value: '40px' },
              { token: 'space-16', value: '32px' },
              { token: 'space-12', value: '24px' },
              { token: 'space-8', value: '16px' },
              { token: 'space-6', value: '12px' },
              { token: 'space-4', value: '8px' },
              { token: 'space-2', value: '4px' },
              { token: 'space-1', value: '2px' },
              { token: 'space-0', value: '0' },
            ].map((spacing) => (
              <div key={spacing.token} className="rounded-lg bg-[#f9f9f9] p-4">
                <div className="mb-2 font-mono text-[14px] font-semibold leading-[20px] tracking-[-0.3px]">
                  {spacing.value}
                </div>
                <div className="font-mono text-[12px] leading-[18px] tracking-[-0.32px] text-[#5d5d5d]">
                  {spacing.token}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Reference */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">Color Reference</h2>
          
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {/* Surface Colors */}
            <div>
              <h3 className="mb-4 text-[14px] font-semibold leading-[20px] tracking-[-0.3px]">Surfaces (Dark Mode)</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#171717]" />
                  <div>
                    <code className="block text-[12px]">#171717</code>
                    <span className="text-[10px] text-[#5d5d5d]">Modal BG</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#2a2a2a]" />
                  <div>
                    <code className="block text-[12px]">#2a2a2a</code>
                    <span className="text-[10px] text-[#5d5d5d]">Input BG</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#212121]" />
                  <div>
                    <code className="block text-[12px]">#212121</code>
                    <span className="text-[10px] text-[#5d5d5d]">Chat BG</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#2C2C2C]" />
                  <div>
                    <code className="block text-[12px]">#2C2C2C</code>
                    <span className="text-[10px] text-[#5d5d5d]">Header/Input</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="mb-4 text-[14px] font-semibold leading-[20px] tracking-[-0.3px]">Text (Dark Mode)</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-white" />
                  <div>
                    <code className="block text-[12px]">#FFFFFF</code>
                    <span className="text-[10px] text-[#5d5d5d]">Primary</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#ababab]" />
                  <div>
                    <code className="block text-[12px]">#ababab</code>
                    <span className="text-[10px] text-[#5d5d5d]">Secondary</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="mb-4 text-[14px] font-semibold leading-[20px] tracking-[-0.3px]">Accents</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#2f7a4f]" />
                  <div>
                    <code className="block text-[12px]">#2f7a4f</code>
                    <span className="text-[10px] text-[#5d5d5d]">Primary Green</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#40C977]" />
                  <div>
                    <code className="block text-[12px]">#40C977</code>
                    <span className="text-[10px] text-[#5d5d5d]">Bright Green</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#48AAFF]" />
                  <div>
                    <code className="block text-[12px]">#48AAFF</code>
                    <span className="text-[10px] text-[#5d5d5d]">Blue</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-[#BA8FF7]" />
                  <div>
                    <code className="block text-[12px]">#BA8FF7</code>
                    <span className="text-[10px] text-[#5d5d5d]">Purple</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="mt-8 space-y-4">
            <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px]">Component Examples</h3>
            
            {/* Primary Button */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-[#2f7a4f] hover:bg-[#2f7a4f]/80 text-white rounded-lg transition-all text-[14px] font-normal">
                Primary Button
              </button>
              <code className="text-[12px]">bg-[#2f7a4f] hover:bg-[#2f7a4f]/80</code>
            </div>

            {/* Pill Toggle */}
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-0 bg-[#2a2a2a] rounded-lg p-1">
                <button className="px-4 py-1.5 rounded-md bg-[#2f7a4f] text-white text-[14px]">
                  Active
                </button>
                <button className="px-4 py-1.5 rounded-md text-[#ababab] text-[14px]">
                  Inactive
                </button>
              </div>
              <code className="text-[12px]">Pill-style toggle (container: #2a2a2a)</code>
            </div>

            {/* Input Field */}
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                placeholder="Input field"
                className="w-64 bg-[#2a2a2a] border border-[#0d0d0d]/10 rounded-lg px-4 py-2.5 text-[14px]"
              />
              <code className="text-[12px]">bg-[#2a2a2a] border-[#0d0d0d]/10</code>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">Usage Guidelines</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Icons</h3>
              <div className="rounded-lg bg-[#f9f9f9] p-4">
                <code className="text-[14px]">
                  import &#123; IconSearch &#125; from './components/icons/ChatGPTIcons';<br />
                  <br />
                  &lt;IconSearch className="size-6" /&gt;
                </code>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Typography</h3>
              <div className="rounded-lg bg-[#f9f9f9] p-4">
                <code className="text-[14px]">
                  import &#123; DesignTokens &#125; from './design-system/DesignTokens';<br />
                  <br />
                  &lt;h1 className=&#123;DesignTokens.typography.heading1&#125;&gt;Title&lt;/h1&gt;
                </code>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">Spacing</h3>
              <div className="rounded-lg bg-[#f9f9f9] p-4">
                <code className="text-[14px]">
                  {/* Use gap-[16px] for 16px spacing (space-8 token) */}<br />
                  &lt;div className="flex gap-[16px]"&gt;...&lt;/div&gt;<br />
                  <br />
                  {/* Use p-[24px] for 24px padding (space-12 token) */}<br />
                  &lt;div className="p-[24px]"&gt;...&lt;/div&gt;
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}