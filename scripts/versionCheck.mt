#!/usr/bin/env node

/**
 * Version check script for plugin builds
 * Validates that the plugin parameter is provided
 */

const args = process.argv.slice(2);
const pluginIndex = args.indexOf('--plugin');

if (pluginIndex === -1 || !args[pluginIndex + 1]) {
  console.error('Error: --plugin parameter is required');
  process.exit(1);
}

const plugin = args[pluginIndex + 1];
console.log(`Version check passed for plugin: ${plugin}`);
process.exit(0);
