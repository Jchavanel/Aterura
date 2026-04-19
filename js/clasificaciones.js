/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — js/clasificaciones.js
   ─────────────────────────────────────────────────────────
   Motor del sistema de clasificaciones.
   Fuentes de datos (prioridad):
   1. localStorage — caché rápida local (TTL configurable)
   2. JSONBin.io   — fuente de verdad compartida entre dispositivos
   3. Google Sheets — fuente alternativa (si está configurado)
   4. Demo data    — fallback de ejemplo

   Depende de: data/standings-config.js + data/sync-config.js
               + data/demo-data.js
═══════════════════════════════════════════════════════════ */

const Clasificaciones = (() => {
  'use strict';

  /* ══════════════════════════════════════
     CACHÉ localStorage con TTL
  ══════════════════════════════════════ */
  const Cache = {
    PREFIX: 'aterura_standings_',

    set(key, data, days) {
      const entry = {
        data,
        ts:      Date.now(),
        expires: Date.now() + days * 864e5
      };
      try {
        localStorage.setItem(this.PREFIX + key, JSON.stringify(entry));
      } catch (e) {
        console.warn('[Clasificaciones] localStorage lleno:', e);
      }
    },

    get(key) {
      try {
        const raw = localStorage.getItem(this.PREFIX + key);
        if (!raw) return null;
        const entry = JSON.parse(raw);
        if (Date.now() > entry.expires) {
          localStorage.removeItem(this.PREFIX + key);
          return null;
        }
        return entry;
      } catch { return null; }
    },

    clear(key) {
      try { localStorage.removeItem(this.PREFIX + key); } catch {}
    },

    clearAll() {
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(this.PREFIX))
          .forEach(k => localStorage.removeItem(k));
      } catch {}
    }
  };

  /* ══════════════════════════════════════
     JSONBIN — fuente de verdad remota
  ══════════════════════════════════════ */
  const Sync = {
    REMOTE_TS_KEY: 'aterura_remote_ts',
    BIN_ID_LS:     'aterura_sync_binid',
    API_URL:       'https://api.jsonbin.io/v3/b',

    /** Obtiene el bin_id: primero sync-config.js, luego localStorage */
    getBinId() {
      const fromConfig  = (typeof SYNC_CONFIG !== 'undefined') ? SYNC_CONFIG.bin_id : '';
      const fromStorage = localStorage.getItem(this.BIN_ID_LS) || '';
      return fromConfig || fromStorage;
    },

    /** URL base de la API */
    getApiUrl() {
      return (typeof SYNC_CONFIG !== 'undefined' && SYNC_CONFIG.api_url)
        ? SYNC_CONFIG.api_url
        : this.API_URL;
    },

    /** ¿Cuándo fue la última lectura remota? */
    lastFetchAge() {
      const ts = parseInt(localStorage.getItem(this.REMOTE_TS_KEY) || '0');
      return Date.now() - ts;
    },

    markFetch() {
      localStorage.setItem(this.REMOTE_TS_KEY, String(Date.now()));
    },

    /** Lee el bin completo de JSONBin (lectura pública, sin API key) */
    async readAll() {
      const binId = this.getBinId();
      if (!binId) throw new Error('bin_id no configurado');

      const url = `${this.getApiUrl()}/${binId}/latest`;
      const res = await fetch(url, { headers: { 'X-JSON-Privacy': 'false' } });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`JSONBin read HTTP ${res.status}: ${body.substring(0, 120)}`);
      }
      const json = await res.json();
      return json.record || null;
    },

    /** Escribe el bin completo (requiere API key — solo desde admin) */
    async writeAll(apiKey, data) {
      const binId = this.getBinId();
      if (!binId) throw new Error('bin_id no configurado — completa el setup en el admin');
      if (!apiKey) throw new Error('API Key no configurada');

      const url = `${this.getApiUrl()}/${binId}`;
      const res = await fetch(url, {
        method:  'PUT',
        headers: {
          'Content-Type':      'application/json',
          'X-Master-Key':      apiKey,
          'X-Bin-Versioning':  'false',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`JSONBin write HTTP ${res.status}: ${body.substring(0, 200)}`);
      }
      return await res.json();
    },

    /** Crea un nuevo bin (solo en el setup inicial del admin) */
    async createBin(apiKey) {
      const res = await fetch(this.getApiUrl(), {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'X-Master-Key':  apiKey,
          'X-Bin-Name':    'aterura-clasificaciones',
          'X-Bin-Private': 'false',
        },
        body: JSON.stringify({ _info: 'Escudería Aterura — Clasificaciones' }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`JSONBin create HTTP ${res.status}: ${body.substring(0, 200)}`);
      }
      const json = await res.json();
      return json.metadata?.id || null;
    },

    /**
     * Sincroniza el localStorage con el bin remoto.
     * Solo ejecuta si han pasado más de remote_ttl_minutes desde la última sync.
     */
    async syncToLocal(force = false) {
      const ttlMs = ((typeof SYNC_CONFIG !== 'undefined' ? SYNC_CONFIG.remote_ttl_minutes : 60) || 60) * 60000;
      if (!force && this.lastFetchAge() < ttlMs) return false;

      const remote = await this.readAll();
      if (!remote) return false;

      const days = (typeof STANDINGS_CONFIG !== 'undefined')
        ? STANDINGS_CONFIG.default_cache_days : 3;

      let count = 0;
      Object.entries(remote).forEach(([key, dataset]) => {
        if (key.startsWith('_')) return;
        if (dataset?.rows?.length) {
          Cache.set(key, dataset, days);
          count++;
        }
      });

      this.markFetch();
      console.info(`[Sync] ${count} clasificaciones sincronizadas desde JSONBin`);
      return count > 0;
    }
  };

  /* ══════════════════════════════════════
     FETCH GOOGLE SHEETS (CSV público)
  ══════════════════════════════════════ */
  async function fetchSheet(sheetId, tabName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseCSV(await res.text());
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const cells = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cells.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      cells.push(cur.trim());
      return cells;
    });
  }

  function csvToDataset(rows) {
    if (!rows || rows.length < 3) return null;
    const headers  = rows[0].map(h => h.toUpperCase());
    const roundRow = rows[1];
    const fixedCols = 5;
    const roundCount = headers.length - fixedCols - 1;

    const rounds = [];
    for (let i = fixedCols; i < fixedCols + roundCount; i++) {
      rounds.push(roundRow[i] || headers[i] || `R${i - fixedCols + 1}`);
    }

    const dataRows = rows.slice(2).filter(r => r[0] && r[0] !== '').map(r => ({
      pos:      parseInt(r[0]) || 0,
      piloto:   r[1] || '—',
      copiloto: r[2] || '—',
      equipo:   r[3] || '—',
      vehiculo: r[4] || '—',
      pts:      rounds.map((_, i) => { const v = parseInt(r[fixedCols + i]); return isNaN(v) ? null : v; }),
      total:    parseInt(r[fixedCols + roundCount]) || 0
    }));

    return { rounds, rows: dataRows };
  }

  /* ══════════════════════════════════════
     OBTENER DATOS
     Prioridad: caché local → JSONBin → Sheets → demo
  ══════════════════════════════════════ */
  async function getData(champKey, discKey, catKey, forceRefresh = false) {
    const key   = `${champKey}::${discKey}::${catKey}`;
    const champ = STANDINGS_CONFIG.championships[champKey];
    const cat   = champ?.disciplines?.[discKey]?.categories?.[catKey];
    const days  = champ?.cache_days ?? STANDINGS_CONFIG.default_cache_days;

    /* 1. Caché local válida (y no forzamos refresco) */
    if (!forceRefresh) {
      const cached = Cache.get(key);
      if (cached) return { ...cached.data, _fromCache: true, _ts: cached.ts, _expires: cached.expires };
    }

    /* 2. JSONBin — sincroniza TODO el bin a local y reintenta la caché */
    if (Sync.getBinId()) {
      try {
        await Sync.syncToLocal(forceRefresh);
        const cached = Cache.get(key);
        if (cached) return { ...cached.data, _fromCache: false, _ts: cached.ts, _expires: cached.expires };
      } catch (err) {
        console.warn('[Clasificaciones] JSONBin sync error:', err);
      }
    }

    /* 3. Google Sheets */
    if (champ?.sheet_id && cat?.sheet_tab) {
      try {
        const csv     = await fetchSheet(champ.sheet_id, cat.sheet_tab);
        const dataset = csvToDataset(csv);
        if (dataset) {
          Cache.set(key, dataset, days);
          return { ...dataset, _fromCache: false, _ts: Date.now(), _expires: Date.now() + days * 864e5 };
        }
      } catch (err) {
        console.warn(`[Clasificaciones] Sheets error ${key}:`, err);
      }
    }

    /* 4. Demo data */
    const demo = DEMO_DATA[key];
    if (demo) return { ...demo, _fromCache: false, _demo: true, _ts: Date.now(), _expires: Date.now() + days * 864e5 };

    return null;
  }

  /* ══════════════════════════════════════
     RENDER — tabla de clasificación
  ══════════════════════════════════════ */
  function renderTable(container, dataset) {
    if (!dataset || !dataset.rows?.length) {
      container.innerHTML = '<p class="st-empty">No hay datos disponibles para esta categoría.</p>';
      return;
    }

    const { rounds, rows } = dataset;

    let html = `<div class="st-table-wrap"><table class="st-table" role="grid">
      <thead>
        <tr>
          <th class="st-th-pos"  scope="col">Pos</th>
          <th class="st-th-name" scope="col">Piloto / Equipo</th>
          <th class="st-th-veh"  scope="col">Vehículo</th>`;

    rounds.forEach((_, i) => { html += `<th class="st-th-round" scope="col">R${i+1}</th>`; });
    html += `<th class="st-th-total" scope="col">Total</th></tr>
        <tr class="st-rounds-row"><td></td><td></td><td></td>`;
    rounds.forEach(r => { html += `<td class="st-round-name" title="${r}">${r}</td>`; });
    html += `<td></td></tr>
      </thead><tbody>`;

    rows.forEach((row, idx) => {
      const podium = idx < 3 ? `st-row-p${idx + 1}` : '';
      html += `<tr class="st-row ${podium}" role="row">
        <td class="st-pos" role="gridcell">
          <span class="st-pos-num">${row.pos}</span>
          ${idx === 0 ? '<span class="st-leader-dot" aria-label="Líder"></span>' : ''}
        </td>
        <td class="st-name" role="gridcell">
          <span class="st-piloto">${row.piloto}</span>
          ${row.copiloto && row.copiloto !== '—' && row.copiloto !== row.piloto
            ? `<span class="st-copiloto">${row.copiloto}</span>` : ''}
          ${row.equipo && row.equipo !== '—'
            ? `<span class="st-equipo">${row.equipo}</span>` : ''}
        </td>
        <td class="st-veh" role="gridcell">${row.vehiculo}</td>`;

      row.pts.forEach((p, i) => {
        const isNull = p === null;
        const isBest = !isNull && p === Math.max(...row.pts.filter(v => v !== null));
        html += `<td class="st-pt ${isBest ? 'st-pt-best' : ''} ${isNull ? 'st-pt-dns' : ''}"
                     role="gridcell">${isNull ? 'DNS' : p}</td>`;
      });

      html += `<td class="st-total" role="gridcell"><strong>${row.total}</strong></td></tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  /* ══════════════════════════════════════
     STATUS BAR
  ══════════════════════════════════════ */
  function renderStatus(el, dataset, champKey) {
    if (!el || !dataset) return;
    const champ    = STANDINGS_CONFIG.championships[champKey];
    const days     = champ?.cache_days ?? STANDINGS_CONFIG.default_cache_days;
    const ts       = dataset._ts;
    const expires  = dataset._expires;
    const fmtDate  = t => t ? new Date(t).toLocaleString('es-ES', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    const diff     = expires ? Math.ceil((expires - Date.now()) / 864e5) : days;

    el.innerHTML = `<span class="st-status-ok">
        <span class="st-status-dot"></span>
        Actualizado: <strong>${fmtDate(ts)}</strong>
        &nbsp;·&nbsp;
        Próxima sync en <strong>${Math.max(0, diff)} día${diff !== 1 ? 's' : ''}</strong>
      </span>`;
  }

  /* ══════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════ */
  return { getData, renderTable, renderStatus, Cache, Sync };

})();
