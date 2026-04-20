/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — clasificaciones.js  v7
   ─────────────────────────────────────────────────────────
   UNA sola lectura de JSONBin por carga de página.
   Prioridad: caché local → JSONBin → Google Sheets → demo
═══════════════════════════════════════════════════════════ */

const Clasificaciones = (() => {
  'use strict';

  /* ─── Caché localStorage ─── */
  const Cache = {
    PREFIX: 'aterura_standings_',

    set(key, data, days) {
      try {
        localStorage.setItem(this.PREFIX + key, JSON.stringify({
          data, ts: Date.now(), expires: Date.now() + days * 864e5
        }));
      } catch (e) { console.warn('[Cache.set]', e); }
    },

    get(key) {
      try {
        const e = JSON.parse(localStorage.getItem(this.PREFIX + key) || 'null');
        if (!e) return null;
        if (Date.now() > e.expires) { localStorage.removeItem(this.PREFIX + key); return null; }
        return e;
      } catch { return null; }
    },

    clear(key)  { try { localStorage.removeItem(this.PREFIX + key); } catch {} },

    clearAll()  {
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(this.PREFIX))
          .forEach(k => localStorage.removeItem(k));
      } catch {}
    }
  };

  /* ─── Sync JSONBin ─── */
  const Sync = {
    BIN_ID_LS:    'aterura_sync_binid',
    REMOTE_TS:    'aterura_remote_ts',
    REMOTE_DATA:  'aterura_remote_full',   /* caché del bin completo */
    API_URL:      'https://api.jsonbin.io/v3/b',
    TIMEOUT_MS:   15000,

    getBinId() {
      const fromFile    = (typeof SYNC_CONFIG !== 'undefined') ? SYNC_CONFIG.bin_id : '';
      const fromStorage = localStorage.getItem(this.BIN_ID_LS) || '';
      return fromFile || fromStorage;
    },

    getApiUrl() {
      return (typeof SYNC_CONFIG !== 'undefined' && SYNC_CONFIG.api_url)
        ? SYNC_CONFIG.api_url : this.API_URL;
    },

    /** fetch con AbortController timeout */
    async fetchTimeout(url, opts = {}) {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.TIMEOUT_MS);
      try {
        const res = await fetch(url, { ...opts, signal: ctrl.signal });
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError')
          throw new Error(`Timeout ${this.TIMEOUT_MS/1000}s sin respuesta de JSONBin`);
        throw err;
      }
    },

    /** Lee el bin completo — SIN cabeceras para evitar preflight CORS */
    async readAll() {
      const binId = this.getBinId();
      if (!binId) throw new Error('bin_id vacío');
      const res = await this.fetchTimeout(`${this.getApiUrl()}/${binId}/latest`);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`JSONBin HTTP ${res.status}: ${body.substring(0,120)}`);
      }
      const json = await res.json();
      return json.record || null;
    },

    /** Escribe el bin completo (solo admin, requiere API key) */
    async writeAll(apiKey, data) {
      const binId = this.getBinId();
      if (!binId)  throw new Error('bin_id vacío');
      if (!apiKey) throw new Error('API Key no configurada');
      const res = await this.fetchTimeout(`${this.getApiUrl()}/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type':     'application/json',
          'X-Master-Key':     apiKey,
          'X-Bin-Versioning': 'false',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`JSONBin write HTTP ${res.status}: ${body.substring(0,200)}`);
      }
      return await res.json();
    },

    async createBin(apiKey) {
      const res = await this.fetchTimeout(this.getApiUrl(), {
        method: 'POST',
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
        throw new Error(`JSONBin create HTTP ${res.status}: ${body.substring(0,200)}`);
      }
      const json = await res.json();
      return json.metadata?.id || null;
    },

    lastFetchAge() {
      return Date.now() - parseInt(localStorage.getItem(this.REMOTE_TS) || '0');
    },

    markFetch() { localStorage.setItem(this.REMOTE_TS, String(Date.now())); },

    /**
     * Lee el bin UNA SOLA VEZ y devuelve el objeto completo.
     * Guarda las clasificaciones en caché local.
     * Devuelve { classifications, _config, _next_rally } o null.
     *
     * force=true ignora el TTL de 60 min.
     * skipTtl=true solo salta el TTL pero no fuerza si la caché sigue válida.
     */
    async syncFull(force = false) {
      const binId = this.getBinId();
      if (!binId) return null;

      /* Sin caché local de control — siempre lee JSONBin en fresco.
         Los cambios del admin se ven de inmediato en cualquier dispositivo. */
      const remote = await this.readAll();
      if (!remote) return null;

      console.info(`[Sync] Bin leído — ${Object.keys(remote).filter(k=>!k.startsWith('_')).length} clasificaciones`);
      return remote;
    }
  };

  /* ─── Google Sheets (CSV público) ─── */
  async function fetchSheet(sheetId, tabName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sheets HTTP ${res.status}`);
    return parseCSV(await res.text());
  }

  function parseCSV(text) {
    return text.trim().split('\n').map(line => {
      const cells = []; let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') inQ = !inQ;
        else if (ch === ',' && !inQ) { cells.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      cells.push(cur.trim());
      return cells;
    });
  }

  function csvToDataset(rows) {
    if (!rows || rows.length < 3) return null;
    const headers = rows[0].map(h => h.toUpperCase());
    const roundRow = rows[1];
    const fixedCols = 5;
    const roundCount = headers.length - fixedCols - 1;
    const rounds = [];
    for (let i = fixedCols; i < fixedCols + roundCount; i++)
      rounds.push(roundRow[i] || headers[i] || `R${i - fixedCols + 1}`);
    const dataRows = rows.slice(2).filter(r => r[0]).map(r => ({
      pos:      parseInt(r[0]) || 0,
      piloto:   r[1] || '—',
      copiloto: r[2] || '—',
      equipo:   r[3] || '—',
      vehiculo: r[4] || '—',
      pts:      rounds.map((_, i) => { const v = parseInt(r[fixedCols+i]); return isNaN(v) ? null : v; }),
      total:    parseInt(r[fixedCols + roundCount]) || 0
    }));
    return { rounds, rows: dataRows };
  }

  /* ─── getData — punto de entrada principal ─── */
  async function getData(champKey, discKey, catKey, forceRefresh = false) {
    const key   = `${champKey}::${discKey}::${catKey}`;
    const champ = STANDINGS_CONFIG.championships[champKey];
    const cat   = champ?.disciplines?.[discKey]?.categories?.[catKey];
    const days  = champ?.cache_days ?? STANDINGS_CONFIG.default_cache_days;

    /* Si hay bin_id configurado → siempre lee JSONBin directamente.
       Los datos llegan frescos en cada visita sin caché intermedia. */
    if (Sync.getBinId()) {
      console.info(`[getData] "${key}" → JSONBin`);
      const remote = await Sync.syncFull(true).catch(err => {
        console.warn('[getData] JSONBin error:', err.message);
        return null;
      });

      if (remote) {
        const dataset = remote[key];
        if (dataset?.rows?.length) {
          console.info(`[getData] "${key}" → OK (${dataset.rows.length} filas)`);
          return { ...dataset, _fromCache: false, _ts: Date.now(), _expires: Date.now() + days * 864e5 };
        }
        console.info(`[getData] "${key}" no está en el bin → demo`);
      }
    } else {
      /* Sin bin_id → usa caché local si existe */
      if (!forceRefresh) {
        const cached = Cache.get(key);
        if (cached) {
          console.info(`[getData] "${key}" → caché local`);
          return { ...cached.data, _fromCache: true, _ts: cached.ts, _expires: cached.expires };
        }
      }
    }

    /* 3. Google Sheets */
    if (champ?.sheet_id && cat?.sheet_tab) {
      try {
        console.info(`[getData] "${key}" → intentando Google Sheets`);
        const csv     = await fetchSheet(champ.sheet_id, cat.sheet_tab);
        const dataset = csvToDataset(csv);
        if (dataset) {
          Cache.set(key, dataset, days);
          return { ...dataset, _fromCache: false, _ts: Date.now(), _expires: Date.now() + days * 864e5 };
        }
      } catch (err) { console.warn('[getData] Sheets error:', err.message); }
    }

    /* 4. Demo data */
    const demo = (typeof DEMO_DATA !== 'undefined') ? DEMO_DATA[key] : null;
    if (demo) {
      console.info(`[getData] "${key}" → demo data`);
      return { ...demo, _fromCache: false, _demo: true, _ts: Date.now(), _expires: Date.now() + days * 864e5 };
    }

    console.warn(`[getData] "${key}" → null (sin fuentes disponibles)`);
    return null;
  }

  /* ─── Render tabla ─── */
  function renderTable(container, dataset) {
    if (!dataset?.rows?.length) {
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
    html += `<td></td></tr></thead><tbody>`;
    rows.forEach((row, idx) => {
      const podium = idx < 3 ? `st-row-p${idx+1}` : '';
      html += `<tr class="st-row ${podium}" role="row">
        <td class="st-pos"><span class="st-pos-num">${row.pos}</span>${idx===0?'<span class="st-leader-dot"></span>':''}</td>
        <td class="st-name">
          <span class="st-piloto">${row.piloto}</span>
          ${row.copiloto&&row.copiloto!=='—'&&row.copiloto!==row.piloto?`<span class="st-copiloto">${row.copiloto}</span>`:''}
          ${row.equipo&&row.equipo!=='—'?`<span class="st-equipo">${row.equipo}</span>`:''}
        </td>
        <td class="st-veh">${row.vehiculo}</td>`;
      row.pts.forEach(p => {
        const isNull = p === null;
        const isBest = !isNull && p === Math.max(...row.pts.filter(v=>v!==null));
        html += `<td class="st-pt ${isBest?'st-pt-best':''} ${isNull?'st-pt-dns':''}">${isNull?'DNS':p}</td>`;
      });
      html += `<td class="st-total"><strong>${row.total}</strong></td></tr>`;
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  /* ─── Render status bar ─── */
  function renderStatus(el, dataset, champKey) {
    if (!el || !dataset) return;
    const days  = STANDINGS_CONFIG.championships[champKey]?.cache_days ?? STANDINGS_CONFIG.default_cache_days;
    const ts    = dataset._ts;
    const exp   = dataset._expires;
    const fmt   = t => t ? new Date(t).toLocaleString('es-ES',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
    const diff  = exp ? Math.ceil((exp - Date.now()) / 864e5) : days;
    el.innerHTML = `<span class="st-status-ok">
      <span class="st-status-dot"></span>
      Actualizado: <strong>${fmt(ts)}</strong>
      &nbsp;·&nbsp; Próxima sync en <strong>${Math.max(0,diff)} día${diff!==1?'s':''}</strong>
    </span>`;
  }

  return { getData, renderTable, renderStatus, Cache, Sync };

})();
