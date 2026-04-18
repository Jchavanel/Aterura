/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — js/clasificaciones.js
   ─────────────────────────────────────────────────────────
   Motor del sistema de clasificaciones.
   Depende de: data/standings-config.js + data/demo-data.js
   (cargados antes en el HTML)
═══════════════════════════════════════════════════════════ */

const Clasificaciones = (() => {
  'use strict';

  /* ══════════════════════════════════════
     CACHÉ — localStorage con TTL
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
        console.warn('[Clasificaciones] localStorage lleno o bloqueado:', e);
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
        return entry;  /* { data, ts, expires } */
      } catch {
        return null;
      }
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
     FETCH GOOGLE SHEETS (CSV público)
  ══════════════════════════════════════ */
  async function fetchSheet(sheetId, tabName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseCSV(await res.text());
  }

  /* Parsea el CSV respetando celdas con comas entre comillas */
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

  /* Convierte filas CSV al formato interno del motor
     Fila 0: cabeceras (POS, PILOTO, COPILOTO, EQUIPO, VEHICULO, R1, R2, ..., TOTAL)
     Fila 1: nombres de pruebas (los 5 primeros cols se ignoran)
     Filas 2+: datos                                                         */
  function csvToDataset(rows) {
    if (!rows || rows.length < 3) return null;
    const headers  = rows[0].map(h => h.toUpperCase());
    const roundRow = rows[1];
    const fixedCols = 5; /* POS, PILOTO, COPILOTO, EQUIPO, VEHICULO */
    const roundCount = headers.length - fixedCols - 1; /* -1 = TOTAL */

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
     OBTENER DATOS (cache → sheets → demo)
  ══════════════════════════════════════ */
  async function getData(champKey, discKey, catKey, forceRefresh = false) {
    const key   = `${champKey}::${discKey}::${catKey}`;
    const champ = STANDINGS_CONFIG.championships[champKey];
    const cat   = champ?.disciplines?.[discKey]?.categories?.[catKey];
    const days  = champ?.cache_days ?? STANDINGS_CONFIG.default_cache_days;

    /* 1. Caché válida */
    if (!forceRefresh) {
      const cached = Cache.get(key);
      if (cached) return { ...cached.data, _fromCache: true, _ts: cached.ts, _expires: cached.expires };
    }

    /* 2. Google Sheets */
    if (champ?.sheet_id && cat?.sheet_tab) {
      try {
        const csv     = await fetchSheet(champ.sheet_id, cat.sheet_tab);
        const dataset = csvToDataset(csv);
        if (dataset) {
          Cache.set(key, dataset, days);
          return { ...dataset, _fromCache: false, _ts: Date.now(), _expires: Date.now() + days * 864e5 };
        }
      } catch (err) {
        console.warn(`[Clasificaciones] Sheets error para ${key}:`, err);
      }
    }

    /* 3. Demo data */
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
    const maxRounds = rounds.length;

    let html = `
      <div class="st-table-wrap">
        <table class="st-table" role="grid">
          <thead>
            <tr>
              <th class="st-th-pos"  scope="col">Pos</th>
              <th class="st-th-name" scope="col">Piloto / Equipo</th>
              <th class="st-th-veh"  scope="col">Vehículo</th>`;

    rounds.forEach((r, i) => {
      html += `<th class="st-th-round" scope="col" title="${r}">R${i + 1}</th>`;
    });

    html += `      <th class="st-th-total" scope="col">Total</th>
            </tr>
            <tr class="st-rounds-row">
              <td></td><td></td><td></td>`;
    rounds.forEach(r => {
      html += `<td class="st-round-name" title="${r}">${r}</td>`;
    });
    html += `  <td></td></tr>
          </thead>
          <tbody>`;

    rows.forEach((row, idx) => {
      const podium = idx < 3 ? `st-row-p${idx + 1}` : '';
      const leader = idx === 0;

      html += `<tr class="st-row ${podium}" role="row">
        <td class="st-pos" role="gridcell">
          <span class="st-pos-num">${row.pos}</span>
          ${leader ? '<span class="st-leader-dot" aria-label="Líder"></span>' : ''}
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

      html += `<td class="st-total" role="gridcell"><strong>${row.total}</strong></td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  /* ══════════════════════════════════════
     STATUS BAR — última actualización
  ══════════════════════════════════════ */
  function renderStatus(el, dataset, champKey) {
    if (!el || !dataset) return;
    const champ    = STANDINGS_CONFIG.championships[champKey];
    const days     = champ?.cache_days ?? STANDINGS_CONFIG.default_cache_days;
    const isDemo   = dataset._demo;
    const ts       = dataset._ts;
    const expires  = dataset._expires;
    const fmtDate  = t => t ? new Date(t).toLocaleString('es-ES', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    const diff     = expires ? Math.ceil((expires - Date.now()) / 864e5) : days;

    el.innerHTML = isDemo
      ? `<span class="st-status-demo">⚠ Datos de ejemplo — conecta Google Sheets para datos reales</span>`
      : `<span class="st-status-ok">
           <span class="st-status-dot"></span>
           Actualizado: <strong>${fmtDate(ts)}</strong>
           &nbsp;·&nbsp;
           Próxima actualización en <strong>${Math.max(0, diff)} día${diff !== 1 ? 's' : ''}</strong>
         </span>`;
  }

  /* ══════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════ */
  return { getData, renderTable, renderStatus, Cache };

})();
