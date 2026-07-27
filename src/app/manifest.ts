import type { MetadataRoute } from 'next';

/**
 * Generated (rather than a static public/manifest.json) so that every URL
 * automatically picks up the base path when the app is deployed to a
 * GitHub Pages project site (https://<user>.github.io/EnergyX/).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EnergyX - Développement Personnel',
    short_name: 'EnergyX',
    description: 'Application complète de développement personnel, mentale et physique',
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    id: `${basePath}/`,
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    background_color: '#0ea5e9',
    theme_color: '#0ea5e9',
    orientation: 'portrait-primary',
    categories: ['productivity', 'lifestyle', 'health', 'fitness'],
    icons: [
      {
        src: `${basePath}/icons/icon-192x192.svg`,
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-512x512.svg`,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-maskable.svg`,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Habitudes',
        short_name: 'Habitudes',
        description: 'Gérer mes habitudes quotidiennes',
        url: `${basePath}/?page=habits`,
      },
      {
        name: 'Journal',
        short_name: 'Journal',
        description: 'Écrire dans mon journal',
        url: `${basePath}/?page=journal`,
      },
      {
        name: 'Méditation',
        short_name: 'Méditer',
        description: 'Commencer une méditation',
        url: `${basePath}/?page=meditation`,
      },
      {
        name: 'Pomodoro',
        short_name: 'Focus',
        description: 'Commencer une session de concentration',
        url: `${basePath}/?page=timer`,
      },
    ],
    prefer_related_applications: false,
  };
}
