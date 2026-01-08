import { useState } from "react";

import { DiscoverySettingsModal } from "../DiscoverySettingsModal";

export function DiscoverySettingsModalDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const [promptEnhancement, setPromptEnhancement] = useState<'rewrite' | 'augment' | 'preserve'>('rewrite');
  const [targetSize, setTargetSize] = useState(60);

  return (
    <div className="min-h-screen bg-foundation-bg-dark-1 p-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Current Settings Display */}
        <div className="bg-foundation-bg-dark-2 rounded-2xl border border-foundation-bg-dark-3 p-8">
          <h3 className="text-heading-3 text-foundation-text-dark-primary mb-4">
            Current Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-small text-foundation-text-dark-secondary">Target Size</span>
              <span className="text-body-small font-medium text-foundation-text-dark-primary">{targetSize}k</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-foundation-text-dark-secondary">Enhancement</span>
              <span className="text-body-small font-medium text-foundation-accent-green capitalize">{promptEnhancement}</span>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-3 bg-foundation-accent-green text-white hover:bg-foundation-accent-green/90 rounded-xl transition-colors font-medium text-body"
        >
          Open Discovery Settings
        </button>

        {/* Feature List */}
        <div className="bg-foundation-bg-dark-2 rounded-2xl border border-foundation-bg-dark-3 p-6">
          <h4 className="text-body font-medium text-foundation-text-dark-primary mb-3">
            Features
          </h4>
          <ul className="space-y-2 text-caption text-foundation-text-dark-secondary">
            <li>• Token budget sliders (20k-100k)</li>
            <li>• Auto Plan Budget (collapsible)</li>
            <li>• Prompt enhancement modes</li>
            <li>• Clarifying questions toggles</li>
            <li>• Text format selection</li>
            <li>• Reasoning effort levels</li>
            <li>• Verbosity controls</li>
            <li>• Store logs toggle</li>
            <li>• Reset to defaults</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div className="bg-foundation-bg-dark-2 rounded-2xl border border-foundation-bg-dark-3 p-6">
          <h4 className="text-body font-medium text-foundation-text-dark-primary mb-3">
            Use Cases
          </h4>
          <ul className="space-y-2 text-caption text-foundation-text-dark-secondary">
            <li>• AI agent configuration</li>
            <li>• Discovery tool settings</li>
            <li>• Context builder parameters</li>
            <li>• Prompt engineering controls</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      <DiscoverySettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        promptEnhancement={promptEnhancement}
        onPromptEnhancementChange={setPromptEnhancement}
        targetSize={targetSize}
        onTargetSizeChange={setTargetSize}
      />
    </div>
  );
}
