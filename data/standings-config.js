/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — data/standings-config.js
   Configuración central del sistema de clasificaciones.
═══════════════════════════════════════════════════════════ */

const STANDINGS_CONFIG = {

  default_cache_days: 3,
  season: 2025,

  championships: {

    wrc: {
      label: 'Mundial WRC',
      icon:  '🌍',
      cache_days: 3,
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'WRC-Asfalto-Pilotos' },
            equipos: { label: 'Equipos', sheet_tab: 'WRC-Asfalto-Equipos' },
          }
        }
      }
    },

    cera: {
      label: 'CERA España',
      icon:  '🇪🇸',
      cache_days: 3,
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'CERA-Asfalto-Pilotos' },
            equipos: { label: 'Equipos', sheet_tab: 'CERA-Asfalto-Equipos' },
          }
        },
        montana: {
          label: 'Montaña',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'CERA-Montana-Pilotos' },
          }
        }
      }
    },

    canarias: {
      label: 'Campeonato Canarias',
      icon:  '🐉',
      cache_days: 3,
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'CAN-Asfalto-Pilotos' },
            equipos: { label: 'Equipos', sheet_tab: 'CAN-Asfalto-Equipos' },
          }
        },
        montana: {
          label: 'Montaña',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'CAN-Montana-Pilotos' },
          }
        },
        regularidad: {
          label: 'Regularidad',
          categories: {
            pilotos: { label: 'Pilotos', sheet_tab: 'CAN-Regular-Pilotos' },
          }
        }
      }
    }

  }

};
