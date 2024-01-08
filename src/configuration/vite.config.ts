import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    const port = parseInt(process.env.PORT ?? '31234');

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
