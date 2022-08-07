import { env } from "./src/env/server.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "i.scdn.co",
      "t.scdn.co",
      "newjams-images.scdn.co",
      "dailymix-images.scdn.co",
      "seed-mix-image.spotifycdn.com",
      "charts-images.scdn.co",
      "daily-mix.scdn.co",
      "mixed-media-images.spotifycdn.com",
      "mosaic.scdn.co",
      "lineup-images.scdn.co",
      "blend-playlist-covers.spotifycdn.com",
    ],
  },
});
