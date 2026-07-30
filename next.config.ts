import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Enables React's <ViewTransition>, which is how page transitions and the
    // goal-badge morph are done here. See app/globals.css for the animations.
    viewTransition: true,
  },
}

export default nextConfig
