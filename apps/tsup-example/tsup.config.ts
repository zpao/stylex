/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { defineConfig } from 'tsup';
import stylexPlugin from '@stylexjs/esbuild-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUILD_DIR_NAME = 'public/dist';
const STYLEX_BUNDLE_PATH = path.resolve(
  __dirname,
  BUILD_DIR_NAME,
  'stylex.css',
);

export default defineConfig({
  entry: { bundle: 'src/App.tsx' },
  outDir: BUILD_DIR_NAME,
  format: ['iife'],
  bundle: true,
  minify: true,
  replaceNodeEnv: true,
  esbuildPlugins: [
    stylexPlugin({
      dev: false,
      generatedCSSFileName: STYLEX_BUNDLE_PATH,
      stylexImports: ['@stylexjs/stylex'],
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: path.resolve(__dirname, '../../..'),
      },
    }),
  ],
  async onSuccess() {
    // This shouldn't be necessary but currently is. See #500.'
    await fsPromises.rename(path.resolve(__dirname, '<stdout>'), STYLEX_BUNDLE_PATH);
  }
});
