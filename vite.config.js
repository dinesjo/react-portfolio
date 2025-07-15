/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current `mode`
  // from the project's root directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Check the loaded environment variable.
  const isGitHubPages = env.VITE_GITHUB_PAGES === 'true';

  return {
    plugins: [react()],
    // Set the base path conditionally.
    base: isGitHubPages ? '/react-portfolio/' : '/',
  }
});
