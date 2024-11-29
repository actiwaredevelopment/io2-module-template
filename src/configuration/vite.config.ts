import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    const port = parseInt(process.env.PORT ?? '30100');

    return {
        build: {
            outDir: 'build'
        },
        plugins: [react()],
        server: {
            port: port,
            strictPort: true
        }
    };
});

