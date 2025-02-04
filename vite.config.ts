import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/react-chess/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "%PUBLIC_URL%/favicon.ico",
        "%PUBLIC_URL%/apple-touc-icon.png",
        "%PUBLIC_URL%/masked-icon.svg",
      ],
      manifest: {
        name: "React-vite-app",
        short_name: "react-vite-app",
        description: "I am a simple vite app",
        icons: [
          {
            src: "/%PUBLIC_URL%/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/%PUBLIC_URL%/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/%PUBLIC_URL%/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/%PUBLIC_URL%/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#171717",
        background_color: "#f0e7db",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
    }),
    tsconfigPaths(),
  ],
});
