/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — data/standings-config.js
   ─────────────────────────────────────────────────────────
   Configuración central del sistema de clasificaciones.

   PASOS PARA ACTIVAR GOOGLE SHEETS:
   1. Crea un Google Sheet con tus datos (ver estructura abajo)
   2. Archivo → Compartir → "Cualquier persona con el enlace puede ver"
   3. Archivo → Compartir → Publicar en la web → Publicar
   4. Copia el ID del Sheet de la URL:
      https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   5. Pega el ID en sheet_id del campeonato correspondiente
   6. Nombra cada pestaña con el sheet_tab exacto

   ESTRUCTURA DE CADA PESTAÑA DEL SHEET:
   Fila 1 (cabeceras): POS | PILOTO | COPILOTO | EQUIPO | VEHICULO | R1 | R2 | R3 | ... | TOTAL
   Fila 2 (nombres de pruebas): - | - | - | - | - | Montecarlo | Suecia | Kenya | ... | -
   Filas 3+: Datos de pilotos

   EJEMPLO DE URL CSV GENERADA:
   https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&sheet={TAB}
═══════════════════════════════════════════════════════════ */

const STANDINGS_CONFIG = {

  /* ── Caché global (días). Se puede sobreescribir por campeonato ── */
  default_cache_days: 3,

  /* ── Temporada activa ── */
  season: 2025,

  /* ══════════════════════════════════
     CAMPEONATOS
  ══════════════════════════════════ */
  championships: {

    /* ─── WRC ─── */
    wrc: {
      label: 'Mundial WRC',
      icon:  '🌍',
      cache_days: 3,
      /* ID de tu Google Sheet para WRC (dejar vacío = usa datos demo) */
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos:   { label: 'Pilotos',   sheet_tab: 'WRC-Asfalto-Pilotos'   },
            copilotos: { label: 'Copilotos', sheet_tab: 'WRC-Asfalto-Copilotos' },
            equipos:   { label: 'Equipos',   sheet_tab: 'WRC-Asfalto-Equipos'   },
          }
        }
        /* WRC no tiene disciplina Montaña ni Regularidad */
      }
    },

    /* ─── CERA — Campeonato España de Rallyes de Asfalto ─── */
    cera: {
      label: 'CERA España',
      icon:  '🇪🇸',
      cache_days: 3,
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos:   { label: 'Pilotos',   sheet_tab: 'CERA-Asfalto-Pilotos'   },
            copilotos: { label: 'Copilotos', sheet_tab: 'CERA-Asfalto-Copilotos' },
            equipos:   { label: 'Equipos',   sheet_tab: 'CERA-Asfalto-Equipos'   },
          }
        },
        montana: {
          label: 'Montaña',
          categories: {
            pilotos:   { label: 'Pilotos',   sheet_tab: 'CERA-Montana-Pilotos'   },
            copilotos: { label: 'Copilotos', sheet_tab: 'CERA-Montana-Copilotos' },
          }
        }
      }
    },

    /* ─── Campeonato de Canarias ─── */
    canarias: {
      label: 'Campeonato Canarias',
      icon:  '🐉',
      cache_days: 3,
      sheet_id: '',
      disciplines: {
        asfalto: {
          label: 'Asfalto',
          categories: {
            pilotos:   { label: 'Pilotos',   sheet_tab: 'CAN-Asfalto-Pilotos'   },
            copilotos: { label: 'Copilotos', sheet_tab: 'CAN-Asfalto-Copilotos' },
            equipos:   { label: 'Equipos',   sheet_tab: 'CAN-Asfalto-Equipos'   },
          }
        },
        montana: {
          label: 'Montaña',
          categories: {
            pilotos:   { label: 'Pilotos',   sheet_tab: 'CAN-Montana-Pilotos'   },
            copilotos: { label: 'Copilotos', sheet_tab: 'CAN-Montana-Copilotos' },
          }
        },
        regularidad: {
          label: 'Regularidad',
          categories: {
            pilotos:    { label: 'Pilotos',    sheet_tab: 'CAN-Regular-Pilotos'    },
            navegantes: { label: 'Navegantes', sheet_tab: 'CAN-Regular-Navegantes' },
          }
        }
      }
    }

  } /* end championships */

}; /* end STANDINGS_CONFIG */
