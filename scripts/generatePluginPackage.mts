#!/usr/bin/env node

/**
 * Generate plugin package script
 * Creates necessary package structure for the specified plugin
 */

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const pluginIndex = args.indexOf('--plugin');

if (pluginIndex === -1 || !args[pluginIndex + 1]) {
  console.error('Error: --plugin parameter is required');
  process.exit(1);
}

const plugin = args[pluginIndex + 1];
const pluginDir = path.join(process.cwd(), 'plugins', plugin);

// Ensure plugin directory exists
if (!fs.existsSync(pluginDir)) {
  fs.mkdirSync(pluginDir, { recursive: true });
}

// Create a basic package.json if it doesn't exist
const packageJsonPath = path.join(pluginDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  const packageJson = {
    name: `@ibm-storage-odf/${plugin}-plugin`,
    version: '1.9.0',
    private: true,
    description: `IBM Storage ODF ${plugin} Plugin`
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Created package.json for plugin: ${plugin}`);
} else {
  console.log(`Package.json already exists for plugin: ${plugin}`);
}

console.log(`Plugin package generation completed for: ${plugin}`);
process.exit(0);

