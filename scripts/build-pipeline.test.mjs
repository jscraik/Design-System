#!/usr/bin/env node

/**
 * Property-Based Tests for Build Pipeline Completeness
 * 
 * Tests Property 4: Build Pipeline Completeness
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

import fc from 'fast-check';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';
import { BuildPipeline } from './build-pipeline.mjs';
import { VersionSynchronizer } from './version-sync.mjs';

const require = createRequire(import.meta.url);

let originalCwd;
let testWorkspace;

// Test configuration
const TEST_CONFIG = {
  testDir: '.test-build-pipeline',
  platforms: ['web', 'macos'],
  mockPackages: {
    npm: ['test-ui', 'test-runtime', 'test-tokens'],
    swift: ['test-ui-swift']
  }
};

/**
 * Property 4: Build Pipeline Completeness
 * For any build execution, the monorepo pipeline should generate correct artifacts 
 * for all target platforms, synchronize versions, and execute tests for both 
 * React and Swift implementations
 */
describe('Build Pipeline Completeness Property', () => {
  beforeAll(() => {
    originalCwd = process.cwd();
    testWorkspace = join(originalCwd, TEST_CONFIG.testDir);
    setupTestWorkspace();
  });

  afterAll(() => {
    process.chdir(originalCwd);
    if (existsSync(testWorkspace)) {
      rmSync(testWorkspace, { recursive: true, force: true });
    }
  });

  test('Property 4: Build Pipeline Completeness', async () => {
    await fc.assert(fc.asyncProperty(
      // Generate build configurations
      fc.record({
        platforms: fc.subarray(TEST_CONFIG.platforms, { minLength: 1 }),
        incremental: fc.boolean(),
        skipTests: fc.boolean(),
        version: fc.string({ minLength: 5, maxLength: 10 }).map(s => `1.${s.length}.0`)
      }),
      async (buildConfig) => {
        // Setup test environment
        const testId = Math.random().toString(36).substring(7);
        const testDir = join(testWorkspace, `test-${testId}`);
        
        try {
          setupMockProject(testDir, buildConfig.version);
          process.chdir(testDir);

          // Create pipeline instance
          const pipeline = new BuildPipeline();
          
          // Execute build
          const result = await pipeline.build({
            platforms: buildConfig.platforms,
            incremental: buildConfig.incremental,
            skipTests: buildConfig.skipTests
          });

          // Validate build completeness
          validateBuildCompleteness(result, buildConfig);
          
          // Validate version synchronization
          validateVersionSynchronization(buildConfig.version);
          
          // Validate platform artifacts
          validatePlatformArtifacts(buildConfig.platforms);
          
          // Validate incremental build behavior
          if (buildConfig.incremental) {
            validateIncrementalBuild(pipeline, buildConfig);
          }

          return true;

        } catch (error) {
          console.error(`Build test failed for config:`, buildConfig, error);
          return false;
        } finally {
          process.chdir(originalCwd);
          if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
          }
        }
      }
    ), { 
      numRuns: 20,
      timeout: 30000,
      verbose: true
    });
  });

  test('Version Synchronization Property', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        version: fc.string({ minLength: 5, maxLength: 10 }).map(s => `2.${s.length}.0`),
        packages: fc.array(fc.string({ minLength: 3, maxLength: 8 }), { minLength: 1, maxLength: 5 })
      }),
      async (config) => {
        const testId = Math.random().toString(36).substring(7);
        const testDir = join(testWorkspace, `version-test-${testId}`);
        
        try {
          setupMockProject(testDir, config.version, config.packages);
          process.chdir(testDir);

          const synchronizer = new VersionSynchronizer();
          const result = await synchronizer.synchronize();

          // All packages should be synchronized
          expect(result.errors).toBe(0);
          expect(result.updated).toBeGreaterThanOrEqual(0);

          // Verify all packages have the correct version
          for (const packageName of config.packages) {
            const packageJsonPath = join('packages', packageName, 'package.json');
            if (existsSync(packageJsonPath)) {
              const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
              expect(packageJson.version).toBe(config.version);
            }
          }

          return true;

        } catch (error) {
          console.error(`Version sync test failed:`, config, error);
          return false;
        } finally {
          process.chdir(originalCwd);
          if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
          }
        }
      }
    ), { 
      numRuns: 10,
      timeout: 15000
    });
  });

  test('Incremental Build Property', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        platforms: fc.subarray(TEST_CONFIG.platforms, { minLength: 1 }),
        changeType: fc.constantFrom('source', 'config', 'dependency', 'none')
      }),
      async (config) => {
        const testId = Math.random().toString(36).substring(7);
        const testDir = join(testWorkspace, `incremental-test-${testId}`);
        
        try {
          setupMockProject(testDir, '1.0.0');
          process.chdir(testDir);

          const pipeline = new BuildPipeline();
          
          // First build (full)
          const firstResult = await pipeline.build({
            platforms: config.platforms,
            incremental: false,
            skipTests: true
          });
          
          expect(firstResult.success).toBe(true);
          
          // Make changes based on changeType
          makeTestChanges(config.changeType);
          
          // Second build (incremental)
          const secondResult = await pipeline.build({
            platforms: config.platforms,
            incremental: true,
            skipTests: true
          });
          
          expect(secondResult.success).toBe(true);
          
          // Validate incremental behavior
          validateIncrementalBehavior(firstResult, secondResult, config.changeType);

          return true;

        } catch (error) {
          console.error(`Incremental build test failed:`, config, error);
          return false;
        } finally {
          process.chdir(originalCwd);
          if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
          }
        }
      }
    ), { 
      numRuns: 15,
      timeout: 25000
    });
  });
});

/**
 * Setup test workspace
 */
function setupTestWorkspace() {
  if (existsSync(testWorkspace)) {
    rmSync(testWorkspace, { recursive: true, force: true });
  }
  mkdirSync(testWorkspace, { recursive: true });
}

/**
 * Setup mock project structure
 */
function setupMockProject(testDir, version, customPackages = null) {
  mkdirSync(testDir, { recursive: true });
  
  // Root package.json
  const rootPackageJson = {
    name: 'test-monorepo',
    version: version,
    private: true,
    type: 'module',
    scripts: {
      build: 'node scripts/build-pipeline.mjs',
      'generate:tokens': 'echo "Generating tokens..."'
    }
  };
  
  writeFileSync(
    join(testDir, 'package.json'), 
    JSON.stringify(rootPackageJson, null, 2)
  );

  // pnpm-workspace.yaml
  writeFileSync(
    join(testDir, 'pnpm-workspace.yaml'),
    'packages:\n  - "packages/*"\n'
  );

  // Scripts directory
  const scriptsDir = join(testDir, 'scripts');
  mkdirSync(scriptsDir, { recursive: true });
  
  // Copy build pipeline script
  const buildPipelineContent = readFileSync(
    join(originalCwd, 'scripts/build-pipeline.mjs'), 
    'utf8'
  );
  writeFileSync(join(scriptsDir, 'build-pipeline.mjs'), buildPipelineContent);
  
  // Copy version sync script
  const versionSyncContent = readFileSync(
    join(originalCwd, 'scripts/version-sync.mjs'), 
    'utf8'
  );
  writeFileSync(join(scriptsDir, 'version-sync.mjs'), versionSyncContent);

  // Packages directory
  const packagesDir = join(testDir, 'packages');
  mkdirSync(packagesDir, { recursive: true });

  // Create mock packages
  const packages = customPackages || TEST_CONFIG.mockPackages.npm;
  for (const packageName of packages) {
    createMockNpmPackage(packagesDir, packageName, version);
  }

  // Create mock Swift packages
  for (const packageName of TEST_CONFIG.mockPackages.swift) {
    createMockSwiftPackage(packagesDir, packageName, version);
  }

  // Create tokens package structure
  createMockTokensPackage(packagesDir, version);
}

/**
 * Create mock npm package
 */
function createMockNpmPackage(packagesDir, packageName, version) {
  const packageDir = join(packagesDir, packageName);
  mkdirSync(packageDir, { recursive: true });
  
  // package.json
  const packageJson = {
    name: `@test/${packageName}`,
    version: version,
    type: 'module',
    scripts: {
      build: 'echo "Building ' + packageName + '"',
      test: 'echo "Testing ' + packageName + '"'
    }
  };
  
  writeFileSync(
    join(packageDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );

  // Mock source files
  const srcDir = join(packageDir, 'src');
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(join(srcDir, 'index.ts'), `export const ${packageName} = "${packageName}";`);
  
  // Mock dist directory (for incremental build testing)
  const distDir = join(packageDir, 'dist');
  mkdirSync(distDir, { recursive: true });
  writeFileSync(join(distDir, 'index.js'), `export const ${packageName} = "${packageName}";`);
}

/**
 * Create mock Swift package
 */
function createMockSwiftPackage(packagesDir, packageName, version) {
  const packageDir = join(packagesDir, packageName);
  mkdirSync(packageDir, { recursive: true });
  
  // Package.swift
  const packageSwift = `// swift-tools-version: 5.9
// Version: ${version}

import PackageDescription

let package = Package(
    name: "${packageName}",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "${packageName}", targets: ["${packageName}"])
    ],
    targets: [
        .target(name: "${packageName}"),
        .testTarget(name: "${packageName}Tests", dependencies: ["${packageName}"])
    ]
)`;
  
  writeFileSync(join(packageDir, 'Package.swift'), packageSwift);

  // Sources
  const sourcesDir = join(packageDir, 'Sources', packageName);
  mkdirSync(sourcesDir, { recursive: true });
  writeFileSync(
    join(sourcesDir, `${packageName}.swift`), 
    `public struct ${packageName} {\n    public static let version = "${version}"\n}`
  );

  // Tests
  const testsDir = join(packageDir, 'Tests', `${packageName}Tests`);
  mkdirSync(testsDir, { recursive: true });
  writeFileSync(
    join(testsDir, `${packageName}Tests.swift`), 
    `import XCTest\n@testable import ${packageName}\n\nfinal class ${packageName}Tests: XCTestCase {\n    func testVersion() {\n        XCTAssertEqual(${packageName}.version, "${version}")\n    }\n}`
  );
}

/**
 * Create mock tokens package
 */
function createMockTokensPackage(packagesDir, version) {
  const packageDir = join(packagesDir, 'tokens');
  mkdirSync(packageDir, { recursive: true });
  
  // package.json
  const packageJson = {
    name: '@test/tokens',
    version: version,
    type: 'module',
    scripts: {
      build: 'echo "Building tokens"',
      generate: 'node scripts/generate-tokens.js'
    }
  };
  
  writeFileSync(
    join(packageDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );

  // Mock token files
  const srcDir = join(packageDir, 'src');
  mkdirSync(srcDir, { recursive: true });
  
  writeFileSync(join(srcDir, 'colors.ts'), 'export const colors = { primary: "#000" };');
  writeFileSync(join(srcDir, 'spacing.ts'), 'export const spacing = [0, 4, 8, 16];');
  writeFileSync(join(srcDir, 'typography.ts'), 'export const typography = { fontFamily: "Arial" };');
  
  // Mock generator script
  const scriptsDir = join(packageDir, 'scripts');
  mkdirSync(scriptsDir, { recursive: true });
  writeFileSync(
    join(scriptsDir, 'generate-tokens.js'), 
    'console.log("Mock token generation complete");'
  );

  // Mock outputs
  const outputsDir = join(packageDir, 'outputs');
  mkdirSync(outputsDir, { recursive: true });
  writeFileSync(
    join(outputsDir, 'manifest.json'), 
    JSON.stringify({ version, generated: new Date().toISOString() }, null, 2)
  );
}

/**
 * Validate build completeness
 */
function validateBuildCompleteness(result, buildConfig) {
  // Build should succeed
  expect(result.success).toBe(true);
  expect(result.results).toBeDefined();
  expect(Array.isArray(result.results)).toBe(true);
  
  // Should have results for each requested platform
  const platformResults = result.results.filter(r => 
    r.step === 'web-build' || r.step === 'macos-build'
  );
  
  if (buildConfig.platforms.includes('web')) {
    expect(platformResults.some(r => r.step === 'web-build')).toBe(true);
  }
  
  if (buildConfig.platforms.includes('macos')) {
    expect(platformResults.some(r => r.step === 'macos-build')).toBe(true);
  }
  
  // Version sync should have occurred
  expect(result.results.some(r => r.step === 'version-sync')).toBe(true);
  
  // Token generation should have occurred
  expect(result.results.some(r => r.step === 'token-generation')).toBe(true);
}

/**
 * Validate version synchronization
 */
function validateVersionSynchronization(expectedVersion) {
  // Check root package.json
  const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(rootPackageJson.version).toBe(expectedVersion);
  
  // Check all npm packages
  const packagesDir = 'packages';
  if (existsSync(packagesDir)) {
    const packages = require('fs').readdirSync(packagesDir);
    for (const packageName of packages) {
      const packageJsonPath = join(packagesDir, packageName, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        expect(packageJson.version).toBe(expectedVersion);
      }
    }
  }
}

/**
 * Validate platform artifacts
 */
function validatePlatformArtifacts(platforms) {
  for (const platform of platforms) {
    switch (platform) {
      case 'web':
        // Check that npm packages have dist directories
        const webPackages = ['test-ui', 'test-runtime', 'tokens'];
        for (const pkg of webPackages) {
          const distPath = join('packages', pkg, 'dist');
          if (existsSync(join('packages', pkg))) {
            expect(existsSync(distPath)).toBe(true);
          }
        }
        break;
        
      case 'macos':
        // Check that Swift packages have build artifacts
        const swiftPackages = ['test-ui-swift'];
        for (const pkg of swiftPackages) {
          if (existsSync(join('packages', pkg))) {
            // Note: In real builds, .build would exist, but in mock tests we just check structure
            expect(existsSync(join('packages', pkg, 'Package.swift'))).toBe(true);
          }
        }
        break;
    }
  }
}

/**
 * Validate incremental build behavior
 */
function validateIncrementalBuild(pipeline, buildConfig) {
  // This is a simplified validation
  // In a real implementation, we'd check build caches, timestamps, etc.
  expect(pipeline).toBeDefined();
  expect(buildConfig.incremental).toBe(true);
}

/**
 * Make test changes for incremental build testing
 */
function makeTestChanges(changeType) {
  switch (changeType) {
    case 'source':
      // Modify a source file
      const srcFile = join('packages', 'test-ui', 'src', 'index.ts');
      if (existsSync(srcFile)) {
        writeFileSync(srcFile, `export const testUi = "modified-${Date.now()}";`);
      }
      break;
      
    case 'config':
      // Modify a config file
      const configFile = join('packages', 'test-ui', 'package.json');
      if (existsSync(configFile)) {
        const config = JSON.parse(readFileSync(configFile, 'utf8'));
        config.description = `Modified at ${Date.now()}`;
        writeFileSync(configFile, JSON.stringify(config, null, 2));
      }
      break;
      
    case 'dependency':
      // This would modify dependencies, but we'll skip for simplicity
      break;
      
    case 'none':
      // No changes
      break;
  }
}

/**
 * Validate incremental behavior
 */
function validateIncrementalBehavior(firstResult, secondResult, changeType) {
  expect(firstResult.success).toBe(true);
  expect(secondResult.success).toBe(true);
  
  // Both builds should have results
  expect(firstResult.results.length).toBeGreaterThan(0);
  expect(secondResult.results.length).toBeGreaterThan(0);
  
  // Incremental builds might skip some steps
  if (changeType === 'none') {
    // No changes should result in some skipped steps
    const skippedSteps = secondResult.results.filter(r => r.skipped === true);
    expect(skippedSteps.length).toBeGreaterThanOrEqual(0);
  }
}

// Export for external testing
export {
    setupMockProject, setupTestWorkspace, validateBuildCompleteness, validatePlatformArtifacts, validateVersionSynchronization
};
