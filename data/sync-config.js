/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — data/sync-config.js

   ESTE ARCHIVO SE SUBE AL REPOSITORIO (GitHub).
   La API Key NUNCA se sube — solo se guarda en el admin.

   remote_ttl_minutes: ya no se usa (los datos se leen
   siempre en fresco desde JSONBin para que los cambios
   sean inmediatos en todos los dispositivos).
═══════════════════════════════════════════════════════════ */

const SYNC_CONFIG = {
  bin_id: '69e5560faaba88219717f782',
  remote_ttl_minutes: 0,   /* 0 = siempre fresco, sin caché local */
  api_url: 'https://api.jsonbin.io/v3/b',
};
