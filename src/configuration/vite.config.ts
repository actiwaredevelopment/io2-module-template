import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    const port = parseInt(process.env.PORT ?? '30100');

    return {
        build: {
            outDir: 'build'
        },
        // COMMENT IN IF YOU ARE USING THE MONACO EDITOR
        // define: {
        //     'process.env': process.env
        // },
        plugins: [react()],
        server: {
            port: port,
            strictPort: true
        }
    };
});

