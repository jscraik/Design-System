#!/usr/bin/env node

/**
 * Enhanced Monorepo Build Pipeline
 * 
 * Supports cross-platform builds for both npm and Swift Package Manager
 * with version synchronization, incremental builds, and multi-platform testing.
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';

// Configuration
const CONFIG = {
  platforms: ['web', 'macos'],
  packages: {
    npm: ['packages/ui', 'packages/runtime', 'packages/tokens', 'packages/widgets'],
    swift: [
      'swift/ChatUIFoundation',
      'swift/ChatUIComponents',
      'swift/ChatUIThemes',
      'swift/ChatUIShellChatGPT',
      'swift/ChatUISystemIntegration',
      'swift/ChatUIMCP',
      'apps/macos/ChatUIApp'
    ],
  },
  outputs: {
    web: ['packages/ui/dist', 'packages/runtime/dist', 'packages/tokens/dist', 'packages/widgets/dist'],
    macos: [
      'swift/ChatUIFoundation/.build',
      'swift/ChatUIComponents/.build',
      'swift/ChatUIThemes/.build',
      'swift/ChatUIShellChatGPT/.build',
      'swift/ChatUISystemIntegration/.build',
      'swift/ChatUIMCP/.build',
      'apps/macos/ChatUIApp/.build'
    ],
  },
  cacheDir: '.build-cache',
  manifestFile: '.build-cache/build-manifest.json',
};

class BuildPipeline {
  constructor() {
    this.startTime = Date.now();
    this.results = [];
    this.manifest = this.loadManifest();
  }

  /**
   * Main build entry point
   */
  async build(options = {}) {
    const { platforms = CONFIG.platforms, incremental = true, skipTests = false } = options;
    
    console.log('🚀 Enhanced Monorepo Build Pipeline');
    console.log(`Platforms: ${platforms.join(', ')}`);
    console.log(`Incremental: ${incremental ? 'enabled' : 'disabled'}`);
    console.log('='.repeat(60));

    try {
      // Step 1: Version synchronization
      await this.synchronizeVersions();

      // Step 2: Token generation (cross-platform)
      await this.generateTokens(incremental);

      // Step 3: Platform builds
      for (const platform of platforms) {
        await this.buildPlatform(platform, incremental);
      }

      // Step 4: Testing (if not skipped)
      if (!skipTests) {
        await this.runTests(platforms);
      }

      // Step 5: Update manifest
      await this.updateManifest();

      this.printSummary();
      return { success: true, results: this.results };

    } catch (error) {
      console.error('❌ Build failed:', error.message);
      return { success: false, error: error.message, results: this.results };
    }
  }

  /**
   * Synchronize versions across npm and Swift Package Manager using agvtool
   */
  async synchronizeVersions() {
    console.log('\n📋 Synchronizing versions...');
    
    const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const version = rootPackageJson.version || '0.1.0';

    // Update npm packages
    for (const packagePath of CONFIG.packages.npm) {
      const packageJsonPath = join(packagePath, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.version !== version) {
          packageJson.version = version;
          writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
          console.log(`  ✅ Updated ${packagePath} to v${version}`);
        }
      }
    }

    // Update Swift packages using agvtool
    for (const swiftPath of CONFIG.packages.swift) {
      if (existsSync(join(swiftPath, 'Package.swift'))) {
        try {
          // Use agvtool for version management (if available)
          if (this.hasAgvtool()) {
            execSync(`cd ${swiftPath} && agvtool new-marketing-version ${version}`, { stdio: 'pipe' });
            console.log(`  ✅ Updated ${swiftPath} to v${version} (agvtool)`);
          } else {
            // Fallback: update Package.swift version comment
            const packageSwiftPath = join(swiftPath, 'Package.swift');
            let content = readFileSync(packageSwiftPath, 'utf8');
            
            // Add or update version comment
            const versionComment = `// Version: ${version}`;
            if (content.includes('// Version:')) {
              content = content.replace(/\/\/ Version: .+/, versionComment);
            } else {
              content = content.replace(
                /^(\/\/ swift-tools-version: .+)$/m,
                `$1\n${versionComment}`
              );
            }
            
            writeFileSync(packageSwiftPath, content);
            console.log(`  ✅ Updated ${swiftPath} to v${version} (Package.swift comment)`);
          }
        } catch (error) {
          console.warn(`  ⚠️  Could not update Swift version for ${swiftPath}: ${error.message}`);
        }
      }
    }

    this.results.push({ step: 'version-sync', success: true, version });
  }

  /**
   * Generate design tokens for all platforms
   */
  async generateTokens(incremental = true) {
    console.log('\n🎨 Generating design tokens...');

    const needsRegeneration = incremental ? this.needsTokenRegeneration() : true;

    if (!needsRegeneration) {
      console.log('  ⏭️  Tokens up to date, skipping generation');
      this.results.push({ step: 'token-generation', success: true, skipped: true });
      return;
    }

    try {
      // Generate tokens using existing script
      await this.runCommand('pnpm', ['generate:tokens'], { cwd: process.cwd() });
      
      // Verify outputs exist
      const expectedOutputs = [
        'packages/tokens/src/foundations.css',
        'swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets',
        'packages/tokens/outputs/manifest.json'
      ];

      for (const output of expectedOutputs) {
        if (!existsSync(output)) {
          throw new Error(`Expected token output not found: ${output}`);
        }
      }

      // Validate Swift Asset Catalog colors match CSS custom properties
      await this.validateTokenConsistency();

      console.log('  ✅ Token generation complete');
      this.results.push({ step: 'token-generation', success: true });

    } catch (error) {
      console.error('  ❌ Token generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Build platform-specific artifacts
   */
  async buildPlatform(platform, incremental = true) {
    console.log(`\n🔨 Building ${platform} platform...`);

    switch (platform) {
      case 'web':
        await this.buildWebPlatform(incremental);
        break;
      case 'macos':
        await this.buildMacOSPlatform(incremental);
        break;
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  /**
   * Build web platform (npm packages)
   */
  async buildWebPlatform(incremental = true) {
    const packages = CONFIG.packages.npm;

    for (const packagePath of packages) {
      if (!existsSync(join(packagePath, 'package.json'))) {
        console.log(`  ⏭️  Skipping ${packagePath} (no package.json)`);
        continue;
      }

      const needsBuild = incremental ? this.needsPackageBuild(packagePath) : true;
      
      if (!needsBuild) {
        console.log(`  ⏭️  ${packagePath} up to date, skipping build`);
        continue;
      }

      try {
        console.log(`  🔨 Building ${packagePath}...`);
        await this.runCommand('pnpm', ['build'], { cwd: packagePath });
        console.log(`  ✅ ${packagePath} build complete`);
        
        this.results.push({ 
          step: 'web-build', 
          package: packagePath, 
          success: true 
        });

      } catch (error) {
        console.error(`  ❌ ${packagePath} build failed:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Build macOS platform (Swift Package Manager)
   */
  async buildMacOSPlatform(incremental = true) {
    const swiftPackages = CONFIG.packages.swift;

    for (const packagePath of swiftPackages) {
      if (!existsSync(join(packagePath, 'Package.swift'))) {
        console.log(`  ⏭️  Skipping ${packagePath} (no Package.swift)`);
        continue;
      }

      const needsBuild = incremental ? this.needsSwiftBuild(packagePath) : true;
      
      if (!needsBuild) {
        console.log(`  ⏭️  ${packagePath} up to date, skipping build`);
        continue;
      }

      try {
        console.log(`  🔨 Building ${packagePath}...`);
        
        // Build Swift package
        await this.runCommand('swift', ['build'], { cwd: packagePath });
        
        // Run Swift tests
        await this.runCommand('swift', ['test'], { cwd: packagePath });
        
        console.log(`  ✅ ${packagePath} build and test complete`);
        
        this.results.push({ 
          step: 'macos-build', 
          package: packagePath, 
          success: true 
        });

      } catch (error) {
        console.error(`  ❌ ${packagePath} build failed:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Run tests for specified platforms
   */
  async runTests(platforms) {
    console.log('\n🧪 Running tests...');

    const testSuites = [];

    if (platforms.includes('web')) {
      testSuites.push(
        { name: 'Unit Tests', command: 'pnpm', args: ['test'], cwd: 'packages/ui' },
        { name: 'MCP Contract Tests', command: 'pnpm', args: ['test:mcp-contract'], cwd: process.cwd() },
        { name: 'E2E Tests', command: 'pnpm', args: ['test:e2e:web'], cwd: process.cwd() },
        { name: 'A11y Tests', command: 'pnpm', args: ['test:a11y:widgets'], cwd: process.cwd() }
      );
    }

    if (platforms.includes('macos')) {
      // Swift tests for all four packages
      const swiftPackages = [
        'swift/ChatUIFoundation',
        'swift/ChatUIComponents',
        'swift/ChatUIThemes',
        'swift/ChatUIShellChatGPT',
        'swift/ChatUISystemIntegration',
        'swift/ChatUIMCP',
        'apps/macos/ChatUIApp'
      ];
      
      for (const packagePath of swiftPackages) {
        const packageName = packagePath.split('/').pop();
        testSuites.push({
          name: `Swift Tests (${packageName})`,
          command: 'swift',
          args: ['test'],
          cwd: packagePath
        });
      }
    }

    for (const suite of testSuites) {
      try {
        console.log(`  🧪 Running ${suite.name}...`);
        await this.runCommand(suite.command, suite.args, { cwd: suite.cwd });
        console.log(`  ✅ ${suite.name} passed`);
        
        this.results.push({ 
          step: 'test', 
          suite: suite.name, 
          success: true 
        });

      } catch (error) {
        console.error(`  ❌ ${suite.name} failed:`, error.message);
        this.results.push({ 
          step: 'test', 
          suite: suite.name, 
          success: false, 
          error: error.message 
        });
        // Continue with other tests
      }
    }
  }

  /**
   * Validate that Swift Asset Catalog colors match CSS custom properties
   */
  async validateTokenConsistency() {
    console.log('  🔍 Validating token consistency...');

    try {
      const normalizeHex = (value) => value.trim().toLowerCase();
      const componentsToHex = (components) => {
        const toInt = (v) => Math.round(parseFloat(v) * 255);
        const toHex = (v) => v.toString(16).padStart(2, '0');
        return `#${toHex(toInt(components.red))}${toHex(toInt(components.green))}${toHex(toInt(components.blue))}`;
      };

      // Read CSS custom properties
      const cssPath = 'packages/tokens/src/foundations.css';
      const cssContent = readFileSync(cssPath, 'utf8');
      
      // Extract CSS color variables
      const cssColors = new Map();
      const cssColorRegex = /--foundation-([\w-]+):\s*([^;]+);/g;
      let match;
      
      while ((match = cssColorRegex.exec(cssContent)) !== null) {
        const [, name, value] = match;
        cssColors.set(name, value.trim());
      }

      // Read Swift Asset Catalog colorsets
      const assetCatalogPath = 'swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets';
      const swiftColors = new Map();
      
      // Read all .colorset directories
      const colorsets = readdirSync(assetCatalogPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.endsWith('.colorset'))
        .map(dirent => dirent.name.replace('.colorset', ''));

      for (const colorset of colorsets) {
        const contentsPath = join(assetCatalogPath, `${colorset}.colorset`, 'Contents.json');
        if (existsSync(contentsPath)) {
          const contents = JSON.parse(readFileSync(contentsPath, 'utf8'));
          swiftColors.set(colorset, contents);
        }
      }

      const catalogToCss = [
        { asset: 'foundation-bg-app', light: 'foundation-bg-light-1', dark: 'foundation-bg-dark-1' },
        { asset: 'foundation-bg-card', light: 'foundation-bg-light-2', dark: 'foundation-bg-dark-2' },
        { asset: 'foundation-bg-card-alt', light: 'foundation-bg-light-3', dark: 'foundation-bg-dark-3' },
        { asset: 'foundation-text-primary', light: 'foundation-text-light-primary', dark: 'foundation-text-dark-primary' },
        { asset: 'foundation-text-secondary', light: 'foundation-text-light-secondary', dark: 'foundation-text-dark-secondary' },
        { asset: 'foundation-text-tertiary', light: 'foundation-text-light-tertiary', dark: 'foundation-text-dark-tertiary' },
        { asset: 'foundation-icon-primary', light: 'foundation-icon-light-primary', dark: 'foundation-icon-dark-primary' },
        { asset: 'foundation-icon-secondary', light: 'foundation-icon-light-secondary', dark: 'foundation-icon-dark-secondary' },
        { asset: 'foundation-icon-tertiary', light: 'foundation-icon-light-tertiary', dark: 'foundation-icon-dark-tertiary' },
        { asset: 'foundation-accent-blue', light: 'foundation-accent-blue-light', dark: 'foundation-accent-blue' },
        { asset: 'foundation-accent-red', light: 'foundation-accent-red-light', dark: 'foundation-accent-red' },
        { asset: 'foundation-accent-orange', light: 'foundation-accent-orange-light', dark: 'foundation-accent-orange' },
        { asset: 'foundation-accent-green', light: 'foundation-accent-green-light', dark: 'foundation-accent-green' },
        { asset: 'foundation-divider', light: 'foundation-bg-light-3', dark: 'foundation-bg-dark-3' },
      ];

      // Validate consistency
      const mismatches = [];
      const missing = [];

      for (const mapping of catalogToCss) {
        const swiftContents = swiftColors.get(mapping.asset);
        if (!swiftContents) {
          missing.push(`Swift colorset '${mapping.asset}' not found in Asset Catalog`);
          continue;
        }

        const lightValue = cssColors.get(mapping.light);
        const darkValue = cssColors.get(mapping.dark);

        if (!lightValue) {
          missing.push(`CSS color '${mapping.light}' not found in foundations.css`);
        }
        if (!darkValue) {
          missing.push(`CSS color '${mapping.dark}' not found in foundations.css`);
        }

        const lightEntry = swiftContents.colors?.find((entry) => !entry.appearances);
        const darkEntry = swiftContents.colors?.find((entry) => entry.appearances?.some((appearance) => appearance.value === 'dark'));

        if (!lightEntry || !darkEntry) {
          mismatches.push(`Swift colorset '${mapping.asset}' is missing light/dark variants`);
          continue;
        }

        if (lightValue && normalizeHex(lightValue) !== componentsToHex(lightEntry.color.components)) {
          mismatches.push(`Light mismatch for '${mapping.asset}': CSS ${mapping.light}=${lightValue} != Swift ${componentsToHex(lightEntry.color.components)}`);
        }
        if (darkValue && normalizeHex(darkValue) !== componentsToHex(darkEntry.color.components)) {
          mismatches.push(`Dark mismatch for '${mapping.asset}': CSS ${mapping.dark}=${darkValue} != Swift ${componentsToHex(darkEntry.color.components)}`);
        }
      }

      if (mismatches.length > 0 || missing.length > 0) {
        console.error('  ❌ Token consistency validation failed:');
        for (const error of [...mismatches, ...missing]) {
          console.error(`     ${error}`);
        }
        throw new Error('Token consistency validation failed');
      }

      console.log(`  ✅ Validated ${catalogToCss.length} colorsets across CSS and Swift`);
      this.results.push({ 
        step: 'token-validation', 
        success: true, 
        colorCount: catalogToCss.length 
      });

    } catch (error) {
      console.error('  ❌ Token validation failed:', error.message);
      throw error;
    }
  }

  /**
   * Check if tokens need regeneration based on source file changes
   */
  needsTokenRegeneration() {
    const sourceFiles = [
      'packages/tokens/src/colors.ts',
      'packages/tokens/src/spacing.ts',
      'packages/tokens/src/typography.ts',
      'packages/tokens/src/generator.ts'
    ];

    const outputFiles = [
      'packages/tokens/src/foundations.css',
      'swift/ChatUIFoundation/Sources/ChatUIFoundation/DesignTokens.swift',
      'swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets'
    ];

    return this.needsRebuild(sourceFiles, outputFiles);
  }

  /**
   * Check if npm package needs rebuild
   */
  needsPackageBuild(packagePath) {
    const sourceGlobs = [
      join(packagePath, 'src/**/*'),
      join(packagePath, 'package.json'),
      join(packagePath, 'tsconfig.json')
    ];

    const outputDir = join(packagePath, 'dist');
    
    if (!existsSync(outputDir)) {
      return true;
    }

    // Simple heuristic: check if any source file is newer than dist directory
    const distStat = statSync(outputDir);
    
    for (const glob of sourceGlobs) {
      try {
        const files = this.expandGlob(glob);
        for (const file of files) {
          if (existsSync(file)) {
            const fileStat = statSync(file);
            if (fileStat.mtime > distStat.mtime) {
              return true;
            }
          }
        }
      } catch (error) {
        void error;
        // If we can't check, assume rebuild needed
        return true;
      }
    }

    return false;
  }

  /**
   * Check if Swift package needs rebuild
   */
  needsSwiftBuild(packagePath) {
    const sourceFiles = [
      join(packagePath, 'Sources/**/*.swift'),
      join(packagePath, 'Package.swift')
    ];

    const buildDir = join(packagePath, '.build');
    
    if (!existsSync(buildDir)) {
      return true;
    }

    // Check if any source file is newer than build directory
    const buildStat = statSync(buildDir);
    
    for (const glob of sourceFiles) {
      try {
        const files = this.expandGlob(glob);
        for (const file of files) {
          if (existsSync(file)) {
            const fileStat = statSync(file);
            if (fileStat.mtime > buildStat.mtime) {
              return true;
            }
          }
        }
      } catch (error) {
        void error;
        return true;
      }
    }

    return false;
  }

  /**
   * Simple glob expansion (basic implementation)
   */
  expandGlob(pattern) {
    // This is a simplified implementation
    // In production, you'd use a proper glob library
    if (pattern.includes('**/*')) {
      const baseDir = pattern.split('**/*')[0];
      if (existsSync(baseDir)) {
        return this.getAllFiles(baseDir);
      }
    }
    
    return existsSync(pattern) ? [pattern] : [];
  }

  /**
   * Recursively get all files in directory
   */
  getAllFiles(dir) {
    const files = [];
    try {
      const items = require('fs').readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      void error;
      // Ignore errors
    }
    return files;
  }

  /**
   * Generic rebuild check based on source and output files
   */
  needsRebuild(sourceFiles, outputFiles) {
    // If any output file is missing, rebuild needed
    for (const output of outputFiles) {
      if (!existsSync(output)) {
        return true;
      }
    }

    // Find the newest source file and oldest output file
    let newestSource = 0;
    let oldestOutput = Infinity;

    for (const source of sourceFiles) {
      if (existsSync(source)) {
        const stat = statSync(source);
        newestSource = Math.max(newestSource, stat.mtime.getTime());
      }
    }

    for (const output of outputFiles) {
      if (existsSync(output)) {
        const stat = statSync(output);
        oldestOutput = Math.min(oldestOutput, stat.mtime.getTime());
      }
    }

    return newestSource > oldestOutput;
  }

  /**
   * Check if agvtool is available
   */
  hasAgvtool() {
    try {
      execSync('which agvtool', { stdio: 'pipe' });
      return true;
    } catch (error) {
      void error;
      return false;
    }
  }

  /**
   * Load build manifest
   */
  loadManifest() {
    if (existsSync(CONFIG.manifestFile)) {
      try {
        return JSON.parse(readFileSync(CONFIG.manifestFile, 'utf8'));
      } catch (error) {
        console.warn('Warning: Could not load build manifest, starting fresh');
        void error;
      }
    }
    
    return {
      version: '1.0.0',
      builds: {},
      lastBuild: null
    };
  }

  /**
   * Update build manifest
   */
  async updateManifest() {
    await mkdir(dirname(CONFIG.manifestFile), { recursive: true });
    
    this.manifest.lastBuild = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results: this.results,
      success: this.results.every(r => r.success !== false)
    };

    writeFileSync(CONFIG.manifestFile, JSON.stringify(this.manifest, null, 2));
  }

  /**
   * Run command with promise interface
   */
  runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Print build summary
   */
  printSummary() {
    const duration = Date.now() - this.startTime;
    const successful = this.results.filter(r => r.success === true).length;
    const failed = this.results.filter(r => r.success === false).length;
    const skipped = this.results.filter(r => r.skipped === true).length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Build Summary');
    console.log('='.repeat(60));
    console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Skipped: ${skipped}`);
    
    if (failed === 0) {
      console.log('\n✅ Build completed successfully!');
    } else {
      console.log('\n❌ Build completed with errors.');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--platforms':
        options.platforms = args[++i]?.split(',') || CONFIG.platforms;
        break;
      case '--no-incremental':
        options.incremental = false;
        break;
      case '--skip-tests':
        options.skipTests = true;
        break;
      case '--help':
        console.log(`
Enhanced Monorepo Build Pipeline

Usage: node scripts/build-pipeline.mjs [options]

Options:
  --platforms <list>    Comma-separated list of platforms (web,macos)
  --no-incremental      Disable incremental builds
  --skip-tests          Skip running tests
  --help                Show this help message

Examples:
  node scripts/build-pipeline.mjs
  node scripts/build-pipeline.mjs --platforms web
  node scripts/build-pipeline.mjs --no-incremental --skip-tests
        `);
        process.exit(0);
        break;
    }
  }

  const pipeline = new BuildPipeline();
  const result = await pipeline.build(options);

  process.exit(result.success ? 0 : 1);
}

// Export for testing
export { BuildPipeline };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
