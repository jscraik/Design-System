import svgPathsSettings from "../../../../imports/svg-74gqp9fq2y";

// Type assertion for SVG path objects to allow dynamic key access
const pathsSettings = svgPathsSettings as Record<string, string>;

// Settings Icons
export function IconSettings({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p2e3fc980} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconCheckCircle({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={pathsSettings.p14636100} fill="currentColor" />
          <path d={pathsSettings.p3b37b000} fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

export function IconCheckmark({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p3a3cee00} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconInfo({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p2e21f680} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconQuestion({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p2dafc300} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconWarning({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p2d048900} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconError({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p1acdb480} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconSun({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p2ae1bb00} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconMoon({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p27fe9f80} fill="currentColor" />
      </svg>
    </div>
  );
}

export function IconLightBulb({ className = "size-6" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={pathsSettings.p38bb8600} fill="currentColor" />
      </svg>
    </div>
  );
}
