import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Chakra UI dependencies
        '@chakra-ui/react',
        '@chakra-ui/icon',
        '@chakra-ui/system',
        '@chakra-ui/theme-tools',
        '@chakra-ui/styled-system',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        
        // If using Chakra UI icons
        '@chakra-ui/icons',
      ],
    },
  },
});