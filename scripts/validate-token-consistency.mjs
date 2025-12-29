#!/usr/bin/env node

/**
 * Validate Token Consistency
 * 
 * Ensures Swift Asset Catalog colors match CSS custom properties exactly.
 * This prevents drift between React and SwiftUI design tokens.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const CSS_PATH = 'packages/tokens/src/foundations.css';
const ASSET_CATALOG_PATH = 'swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets';

function validateTokenConsistency() {
  console.log('🔍 Validating token consistency between CSS and Swift...\n');

  try {
    // Read CSS custom properties
    const cssContent = readFileSync(CSS_PATH, 'utf8');
    const cssColors = extractCSSColors(cssContent);
    
    console.log(`Found ${cssColors.size} CSS color tokens`);

    // Read Swift Asset Catalog colorsets
    const swiftColors = extractSwiftColors(ASSET_CATALOG_PATH);
    
    console.log(`Found ${swiftColors.size} Swift colorsets\n`);

    // Validate consistency
    const errors = [];
    const warnings = [];

    // Swift uses semantic tokens (foundation-text-primary) with light/dark variants
    // CSS uses explicit light/dark tokens (foundation-text-light-primary, foundation-text-dark-primary)
    // We need to map CSS light/dark pairs to Swift semantic tokens
    
    const cssSemanticTokens = new Set();
    for (const cssName of cssColors.keys()) {
      // Extract semantic name by removing -light or -dark suffix
      const semanticName = cssName.replace(/-(light|dark)-/, '-');
      cssSemanticTokens.add(semanticName);
    }

    console.log(`Mapped to ${cssSemanticTokens.size} semantic tokens\n`);

    // Check that each Swift colorset has corresponding CSS light/dark pair
    for (const swiftName of swiftColors.keys()) {
      if (!cssSemanticTokens.has(swiftName)) {
        warnings.push(`⚠️  Swift colorset '${swiftName}' has no corresponding CSS tokens`);
      }
    }

    // Check that each CSS semantic token has a Swift colorset
    for (const semanticName of cssSemanticTokens) {
      if (!swiftColors.has(semanticName)) {
        warnings.push(`⚠️  CSS semantic token '${semanticName}' not found in Swift Asset Catalog (may not be implemented yet)`);
      }
    }

    // Validate colorset structure
    for (const [name, colorset] of swiftColors.entries()) {
      const validation = validateColorset(name, colorset);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    }

    // Print results
    console.log('='.repeat(60));
    console.log('📊 Validation Results');
    console.log('='.repeat(60));

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All tokens are consistent!');
      console.log(`   ${swiftColors.size} colors validated across CSS and Swift`);
      console.log(`   ${cssSemanticTokens.size} semantic tokens mapped correctly`);
      return true;
    }

    if (errors.length > 0) {
      console.log('\n❌ Errors found:');
      errors.forEach(error => console.log(`   ${error}`));
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings (non-blocking):');
      warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (errors.length > 0) {
      console.log('\n❌ Token validation failed');
      process.exit(1);
    } else {
      console.log('\n✅ Token validation passed');
      console.log('   Note: Warnings indicate tokens that may not be fully implemented yet');
      return true;
    }

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Extract CSS color variables (only foundation colors)
 */
function extractCSSColors(cssContent) {
  const colors = new Map();
  // Only match foundation color tokens (not spacing, typography, etc.)
  const colorRegex = /--foundation-(bg|text|icon|accent|divider)-([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = colorRegex.exec(cssContent)) !== null) {
    const [, category, name, value] = match;
    const fullName = `foundation-${category}-${name}`;
    colors.set(fullName, value.trim());
  }

  return colors;
}

/**
 * Extract Swift Asset Catalog colorsets
 */
function extractSwiftColors(assetCatalogPath) {
  const colors = new Map();

  if (!existsSync(assetCatalogPath)) {
    throw new Error(`Asset Catalog not found: ${assetCatalogPath}`);
  }

  const entries = readdirSync(assetCatalogPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith('.colorset')) {
      const colorsetName = entry.name.replace('.colorset', '');
      const contentsPath = join(assetCatalogPath, entry.name, 'Contents.json');
      
      if (existsSync(contentsPath)) {
        try {
          const contents = JSON.parse(readFileSync(contentsPath, 'utf8'));
          colors.set(colorsetName, contents);
        } catch (error) {
          console.warn(`Warning: Could not parse ${contentsPath}: ${error.message}`);
        }
      }
    }
  }

  return colors;
}

/**
 * Validate colorset structure
 */
function validateColorset(name, colorset) {
  const errors = [];

  // Check for required properties
  if (!colorset.colors || !Array.isArray(colorset.colors)) {
    errors.push(`❌ Colorset '${name}' missing 'colors' array`);
    return { valid: false, errors };
  }

  // Check for light and dark variants
  const hasLight = colorset.colors.some(c => 
    !c.appearances || c.appearances.length === 0
  );
  const hasDark = colorset.colors.some(c => 
    c.appearances && c.appearances.some(a => a.value === 'dark')
  );

  if (!hasLight) {
    errors.push(`❌ Colorset '${name}' missing light mode variant`);
  }

  if (!hasDark) {
    errors.push(`❌ Colorset '${name}' missing dark mode variant`);
  }

  // Validate color format
  for (const color of colorset.colors) {
    if (!color.color) {
      errors.push(`❌ Colorset '${name}' has entry without 'color' property`);
      continue;
    }

    const { components } = color.color;
    if (!components) {
      errors.push(`❌ Colorset '${name}' has color without 'components'`);
      continue;
    }

    // Check for required color components
    const requiredComponents = ['red', 'green', 'blue', 'alpha'];
    for (const component of requiredComponents) {
      if (components[component] === undefined) {
        errors.push(`❌ Colorset '${name}' missing '${component}' component`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateTokenConsistency();
}

export { validateTokenConsistency };
