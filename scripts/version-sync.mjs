#!/usr/bin/env node

/**
 * Version Synchronization Script
 * 
 * Synchronizes versions across npm packages and Swift Package Manager
 * using agvtool when available, with fallback to Package.swift comments.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Configuration
const CONFIG = {
  packages: {
    npm: [
      'packages/ui',
      'packages/runtime', 
      'packages/tokens',
      'packages/widgets',
      'packages/cloudflare-template'
    ],
    swift: [
      'swift/ChatUIFoundation',
      'swift/ChatUIComponents',
      'swift/ChatUIThemes',
      'swift/ChatUIShellChatGPT',
      'swift/ChatUISystemIntegration',
      'swift/ChatUIMCP',
      'swift/ui-swift',
      'apps/macos/ChatUIApp'
    ]
  }
};

class VersionSynchronizer {
  constructor() {
    this.rootVersion = this.getRootVersion();
    this.hasAgvtool = this.checkAgvtool();
  }

  /**
   * Get version from root package.json
   */
  getRootVersion() {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      return packageJson.version || '0.1.0';
    } catch (error) {
      console.warn('Warning: Could not read root package.json, using default version 0.1.0', error);
      return '0.1.0';
    }
  }

  /**
   * Check if agvtool is available
   */
  checkAgvtool() {
    try {
      execSync('which agvtool', { stdio: 'pipe' });
      return true;
    } catch (error) {
      console.warn('Warning: agvtool check failed', error);
      return false;
    }
  }

  /**
   * Synchronize all package versions
   */
  async synchronize() {
    console.log('🔄 Synchronizing versions...');
    console.log(`Target version: ${this.rootVersion}`);
    console.log(`agvtool available: ${this.hasAgvtool ? 'yes' : 'no'}`);
    console.log('='.repeat(50));

    let updated = 0;
    let errors = 0;

    // Update npm packages
    for (const packagePath of CONFIG.packages.npm) {
      try {
        if (await this.updateNpmPackage(packagePath)) {
          updated++;
        }
      } catch (error) {
        console.error(`❌ Failed to update ${packagePath}:`, error.message);
        errors++;
      }
    }

    // Update Swift packages
    for (const packagePath of CONFIG.packages.swift) {
      try {
        if (await this.updateSwiftPackage(packagePath)) {
          updated++;
        }
      } catch (error) {
        console.error(`❌ Failed to update ${packagePath}:`, error.message);
        errors++;
      }
    }

    console.log('='.repeat(50));
    console.log(`✅ Updated: ${updated} packages`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} packages`);
    }
    console.log('🔄 Version synchronization complete');

    return { updated, errors };
  }

  /**
   * Update npm package version
   */
  async updateNpmPackage(packagePath) {
    const packageJsonPath = join(packagePath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.log(`  ⏭️  Skipping ${packagePath} (no package.json)`);
      return false;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.version === this.rootVersion) {
      console.log(`  ✓  ${packagePath} already at v${this.rootVersion}`);
      return false;
    }

    packageJson.version = this.rootVersion;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`  ✅ Updated ${packagePath} to v${this.rootVersion}`);
    return true;
  }

  /**
   * Update Swift package version
   */
  async updateSwiftPackage(packagePath) {
    const packageSwiftPath = join(packagePath, 'Package.swift');
    
    if (!existsSync(packageSwiftPath)) {
      console.log(`  ⏭️  Skipping ${packagePath} (no Package.swift)`);
      return false;
    }

    // Try agvtool first
    if (this.hasAgvtool) {
      try {
        execSync(`cd ${packagePath} && agvtool new-marketing-version ${this.rootVersion}`, { 
          stdio: 'pipe' 
        });
        console.log(`  ✅ Updated ${packagePath} to v${this.rootVersion} (agvtool)`);
        return true;
      } catch (error) {
        console.warn(
          `  ⚠️  agvtool failed for ${packagePath}, falling back to Package.swift comment`,
          error,
        );
      }
    }

    // Fallback: update Package.swift version comment
    let content = readFileSync(packageSwiftPath, 'utf8');
    const versionComment = `// Version: ${this.rootVersion}`;
    
    if (content.includes('// Version:')) {
      // Update existing version comment
      const oldVersionMatch = content.match(/\/\/ Version: (.+)/);
      if (oldVersionMatch && oldVersionMatch[1] === this.rootVersion) {
        console.log(`  ✓  ${packagePath} already at v${this.rootVersion}`);
        return false;
      }
      
      content = content.replace(/\/\/ Version: .+/, versionComment);
    } else {
      // Add version comment after swift-tools-version
      content = content.replace(
        /^(\/\/ swift-tools-version: .+)$/m,
        `$1\n${versionComment}`
      );
    }
    
    writeFileSync(packageSwiftPath, content);
    console.log(`  ✅ Updated ${packagePath} to v${this.rootVersion} (Package.swift comment)`);
    return true;
  }

  /**
   * Get current version from package
   */
  getCurrentVersion(packagePath) {
    // For npm packages
    const packageJsonPath = join(packagePath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version;
    }

    // For Swift packages, try to extract from Package.swift comment
    const packageSwiftPath = join(packagePath, 'Package.swift');
    if (existsSync(packageSwiftPath)) {
      const content = readFileSync(packageSwiftPath, 'utf8');
      const versionMatch = content.match(/\/\/ Version: (.+)/);
      if (versionMatch) {
        return versionMatch[1];
      }
    }

    return null;
  }

  /**
   * List all package versions
   */
  listVersions() {
    console.log('📋 Current package versions:');
    console.log('='.repeat(50));

    const allPackages = [...CONFIG.packages.npm, ...CONFIG.packages.swift];
    
    for (const packagePath of allPackages) {
      const version = this.getCurrentVersion(packagePath);
      const status = version === this.rootVersion ? '✓' : '❌';
      console.log(`  ${status} ${packagePath}: ${version || 'unknown'}`);
    }

    console.log('='.repeat(50));
    console.log(`Root version: ${this.rootVersion}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const synchronizer = new VersionSynchronizer();

  if (args.includes('--list') || args.includes('-l')) {
    synchronizer.listVersions();
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Version Synchronization Script

Usage: node scripts/version-sync.mjs [options]

Options:
  --list, -l    List current package versions
  --help, -h    Show this help message

Examples:
  node scripts/version-sync.mjs          # Synchronize all packages
  node scripts/version-sync.mjs --list   # List current versions
    `);
    return;
  }

  const result = await synchronizer.synchronize();
  
  if (result.errors > 0) {
    process.exit(1);
  }
}

// Export for testing
export { VersionSynchronizer };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
