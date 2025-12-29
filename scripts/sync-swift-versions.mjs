#!/usr/bin/env node

/**
 * Synchronize versions across Swift Package.swift files
 * 
 * This script updates version comments in all Swift Package.swift files
 * to match the root package.json version.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SWIFT_PACKAGES = [
  'swift/ChatUIFoundation',
  'swift/ChatUIComponents',
  'swift/ChatUIThemes',
  'swift/ChatUIShellChatGPT',
  'swift/ChatUISystemIntegration',
  'swift/ChatUIMCP',
  'swift/ui-swift',
  'apps/macos/ChatUIApp'
];

function syncVersions() {
  console.log('🔄 Synchronizing Swift package versions...\n');

  // Read root package.json version
  const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const version = rootPackageJson.version || '0.1.0';

  console.log(`Target version: ${version}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const packagePath of SWIFT_PACKAGES) {
    const packageSwiftPath = join(packagePath, 'Package.swift');
    
    if (!existsSync(packageSwiftPath)) {
      console.log(`⏭️  Skipping ${packagePath} (Package.swift not found)`);
      skipped++;
      continue;
    }

    try {
      let content = readFileSync(packageSwiftPath, 'utf8');
      const versionComment = `// Version: ${version}`;
      
      // Check if version comment exists
      if (content.includes('// Version:')) {
        // Update existing version comment
        const oldContent = content;
        content = content.replace(/\/\/ Version: .+/, versionComment);
        
        if (content !== oldContent) {
          writeFileSync(packageSwiftPath, content);
          console.log(`✅ Updated ${packagePath} to v${version}`);
          updated++;
        } else {
          console.log(`⏭️  ${packagePath} already at v${version}`);
          skipped++;
        }
      } else {
        // Add version comment after swift-tools-version
        content = content.replace(
          /^(\/\/ swift-tools-version: .+)$/m,
          `$1\n${versionComment}`
        );
        
        writeFileSync(packageSwiftPath, content);
        console.log(`✅ Added version to ${packagePath}: v${version}`);
        updated++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${packagePath}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  
  if (errors > 0) {
    console.log('\n❌ Version synchronization completed with errors');
    process.exit(1);
  } else {
    console.log('\n✅ Version synchronization complete');
    process.exit(0);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncVersions();
}

export { syncVersions };
