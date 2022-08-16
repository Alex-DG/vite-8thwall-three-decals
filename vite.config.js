import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

const assetExtensions = [
  '**/*.glb',
  '**/*.gltf',
  '**/*.png',
  '**/*.jpg',
  '**/*.mp3',
  '**/*.flac',
  '**/*.wav',
]

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    https: true,
  },
  server: {
    https: true,
  },
  plugins: [glsl()],
  assetsInclude: assetExtensions,
})
