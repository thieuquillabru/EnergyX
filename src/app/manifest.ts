import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return {
    name: 'EnergyX — Développement personnel',
    short_name: 'EnergyX',
    description: 'Application complète de développement personnel : habitudes, objectifs, journal, méditation et plus.',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'any',
    categories: ['lifestyle', 'productivity', 'health'],
    icons: [
      {
        src: `${basePath}/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
