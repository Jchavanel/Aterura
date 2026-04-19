/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — data/sync-config.js
   ─────────────────────────────────────────────────────────
   Configuración de sincronización cross-dispositivo.
   Este archivo SE SUBE AL REPOSITORIO (GitHub).

   El BIN_ID es público — permite leer las clasificaciones.
   La API KEY es privada — solo la guarda el administrador
   en su navegador y NUNCA se sube al repositorio.

   PASOS DE ACTIVACIÓN (una sola vez):
   1. Crea cuenta gratuita en https://jsonbin.io
   2. Ve al panel de administración → sección "Sincronización"
   3. Pega tu API Key (Master Key de JSONBin)
   4. Pulsa "Crear bin y activar sincronización"
   5. Copia el BIN_ID que aparece y pégalo en bin_id abajo
   6. Sube este archivo al repositorio (git commit + push)
   7. A partir de ese momento todas las clasificaciones
      guardadas en el admin se sincronizan a todos los dispositivos
═══════════════════════════════════════════════════════════ */

const SYNC_CONFIG = {
  bin_id: '69e5560faaba88219717f782',
  remote_ttl_minutes: 60,
  api_url: 'https://api.jsonbin.io/v3/b',
}; */
  bin_id: '69e5560faaba88219717f782',

  /* Tiempo mínimo entre lecturas remotas (minutos).
     Evita saturar la API gratuita (10k req/mes).
     Valor recomendado: 60 minutos */
  remote_ttl_minutes: 60,

  /* URL base de la API (no modificar) */
  api_url: 'https://api.jsonbin.io/v3/b',
};
