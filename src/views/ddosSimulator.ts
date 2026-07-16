import { layout } from './layout.js';
import { footer } from './footer.js';

export const ddosSimulatorView = (): string => layout({
  title: 'DDoS Simulator · Skiddle Toolbox',
  subtitle: 'Cloudflare Workers Edge Utility',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="ddos-stack">
    <div class="tb-page-header accent-red">
      <div class="tb-tool-icon">🌩️</div>
      <div class="tb-page-header__text">
        <h1>DDoS Simulator</h1>
        <p>Watch how a distributed denial-of-service attack unfolds on a live cyber-war map — then flip on mitigations and fight back.</p>
      </div>
    </div>

    <div class="tb-card ddos-disclaimer">
      <span class="tb-tag tb-tag--green">100% Simulated</span>
      <p>This is an <strong>educational visualization</strong>. Every bot, packet, and attack arc is generated locally in your browser — <strong>no real network traffic ever leaves this page.</strong></p>
    </div>

    <div class="tb-card">
      <div class="ddos-controls">
        <div class="ddos-control">
          <label class="tb-label">Mode</label>
          <div class="ddos-mode-switch">
            <button type="button" id="sim-mode-sandbox" class="ddos-mode-btn active">🧪 Sandbox</button>
            <button type="button" id="sim-mode-defense" class="ddos-mode-btn">🎮 Defense Game</button>
          </div>
          <span class="ddos-hint" id="sim-mode-hint">Free play — pick an attack and watch the map burn.</span>
        </div>
        <div class="ddos-control">
          <label class="tb-label" for="sim-attack">Attack type</label>
          <select id="sim-attack" class="tb-select">
            <option value="udp">UDP Flood (Volumetric)</option>
            <option value="syn">SYN Flood (Protocol)</option>
            <option value="http">HTTP Flood (Application)</option>
            <option value="dnsamp">DNS Amplification (Reflection)</option>
            <option value="slowloris">Slowloris (Low &amp; Slow)</option>
          </select>
        </div>
        <div class="ddos-control">
          <label class="tb-label" for="sim-target">Target server</label>
          <select id="sim-target" class="tb-select">
            <option value="na">US East</option>
            <option value="sa">São Paulo</option>
            <option value="eu">Frankfurt</option>
            <option value="af">Cape Town</option>
            <option value="as">Tokyo</option>
            <option value="oc">Sydney</option>
          </select>
        </div>
        <div class="ddos-control">
          <label class="tb-label" for="sim-bots">Botnet size — <span id="sim-bots-val">120</span> bots</label>
          <input type="range" id="sim-bots" min="10" max="500" step="10" value="120">
        </div>
        <div class="ddos-control">
          <label class="tb-label" for="sim-intensity">Attack intensity — <span id="sim-intensity-val">5</span>/10</label>
          <input type="range" id="sim-intensity" min="1" max="10" step="1" value="5">
        </div>
        <div class="ddos-control ddos-control--launch">
          <button type="button" id="sim-launch" class="tb-btn">🚀 Launch Attack</button>
        </div>
      </div>
    </div>

    <div class="tb-card ddos-map-card">
      <div class="ddos-canvas-wrap">
        <canvas id="sim-canvas" role="img" aria-label="Simulated world map showing botnet attack arcs converging on a target server"></canvas>
        <div id="sim-banner" class="ddos-banner tb-hidden"></div>
        <div id="sim-overlay" class="ddos-overlay tb-hidden">
          <div class="ddos-overlay-box">
            <div class="ddos-overlay-icon">💥</div>
            <h2>Server Offline</h2>
            <p>The target was overwhelmed and stopped responding. Legitimate users are now staring at timeout errors.</p>
            <div class="ddos-overlay-score">Score: <strong id="sim-overlay-score">0</strong></div>
            <div class="ddos-overlay-best">Best: <span id="sim-overlay-best">0</span></div>
            <button type="button" id="sim-overlay-restart" class="tb-btn">🔄 Play Again</button>
          </div>
        </div>
      </div>
      <div class="ddos-legend">
        <span><i class="ddos-dot" style="background:var(--ctp-surface2)"></i> Land</span>
        <span><i class="ddos-dot" style="background:var(--ctp-blue)"></i> Normal traffic</span>
        <span><i class="ddos-dot" style="background:var(--ctp-red)"></i> Attack packets</span>
        <span><i class="ddos-dot" style="background:var(--ctp-teal)"></i> Mitigated</span>
        <span><i class="ddos-dot ddos-dot--pulse" style="background:var(--accent-primary)"></i> Target server</span>
      </div>
    </div>

    <div class="ddos-stats">
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label">Server Health</span>
        <div class="ddos-healthbar"><div id="st-health-fill" class="ddos-healthbar__fill is-ok" style="width:100%"></div></div>
        <span class="ddos-stat__value" id="st-health-label">ONLINE</span>
      </div>
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label">Incoming</span>
        <span class="ddos-stat__value" id="st-rps">0</span>
        <span class="ddos-stat__unit">req/s</span>
      </div>
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label">Mitigated</span>
        <span class="ddos-stat__value ddos-good" id="st-blocked">0</span>
        <span class="ddos-stat__unit">req/s</span>
      </div>
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label">Attack Bandwidth</span>
        <span class="ddos-stat__value" id="st-mbps">0 Mbps</span>
        <span class="ddos-stat__unit">delivered to target</span>
      </div>
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label">Bots Active</span>
        <span class="ddos-stat__value ddos-bad" id="st-bots">0</span>
        <span class="ddos-stat__unit">zombies</span>
      </div>
      <div class="tb-card ddos-stat">
        <span class="ddos-stat__label" id="st-wave-label">Mode</span>
        <span class="ddos-stat__value" id="st-wave">Sandbox</span>
        <span class="ddos-stat__unit" id="st-score">free play</span>
      </div>
    </div>

    <div class="tb-card">
      <div class="ddos-section-head">
        <h2 class="ddos-section-title">🛡️ Mitigations</h2>
        <span class="ddos-hint">Sandbox: combine freely. Defense Game: max 2 active.</span>
      </div>
      <div class="ddos-def-grid">
        <button type="button" class="ddos-def-chip" id="def-ratelimit">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">⏱️</span><strong>Rate Limiting</strong></span>
          <span class="ddos-def-desc">Caps requests per source. Great against floods that reuse the same bots.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-ratelimit">25%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-anycast">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">🌍</span><strong>Anycast Scrubbing</strong></span>
          <span class="ddos-def-desc">Spreads traffic across a global scrubbing network and absorbs volume at the edge.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-anycast">60%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-waf">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">🧱</span><strong>WAF Rules</strong></span>
          <span class="ddos-def-desc">Inspects application-layer requests and drops malicious patterns.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-waf">5%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-geoblock">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">🚧</span><strong>Geo-Block</strong></span>
          <span class="ddos-def-desc">Drops traffic from regions you do not serve. Blunt but cheap.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-geoblock">30%</b> of this attack</span>
        </button>
      </div>
    </div>

    <div class="ddos-duo">
      <div class="tb-card">
        <h2 class="ddos-section-title">🎯 Attack Intel</h2>
        <div class="ddos-intel-head">
          <strong id="atk-name">UDP Flood</strong>
          <span class="tb-tag tb-tag--red" id="atk-layer">Volumetric · L3/L4</span>
        </div>
        <p id="atk-desc"></p>
      </div>
      <div class="tb-card">
        <h2 class="ddos-section-title">📡 Event Log</h2>
        <div id="sim-log" class="ddos-log"></div>
      </div>
    </div>

    <div class="ddos-edu">
      <div class="tb-card ddos-edu-card">
        <h3>🧟 1 · Build a botnet</h3>
        <p>Attackers compromise thousands of devices — routers, cameras, old servers — and command them in unison. Each glowing dot on the map is one simulated zombie.</p>
      </div>
      <div class="tb-card ddos-edu-card">
        <h3>🌊 2 · Flood the target</h3>
        <p>Every server has a capacity. When fake requests drown it, real users get timeouts. Watch the health bar buckle as delivered traffic exceeds what the server can handle.</p>
      </div>
      <div class="tb-card ddos-edu-card">
        <h3>🛡️ 3 · Defenses absorb</h3>
        <p>Real-world mitigations filter or soak up junk traffic before it reaches the origin. Toggle mitigations and watch the mitigated counter climb and the shield ring appear.</p>
      </div>
    </div>

    ${footer()}
    </div>

    <style>
      .ddos-stack > * + * { margin-top: 24px; }

      .ddos-disclaimer { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .ddos-disclaimer p { margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; flex: 1; min-width: 240px; }

      .ddos-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 18px; align-items: end; }
      .ddos-control { display: flex; flex-direction: column; gap: 8px; }
      .ddos-control input[type="range"] { width: 100%; accent-color: var(--accent-primary); cursor: pointer; }
      .ddos-hint { font-size: 0.72rem; color: var(--text-muted); line-height: 1.5; }

      .ddos-mode-switch { display: flex; gap: 8px; }
      .ddos-mode-btn {
        flex: 1;
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        padding: 8px 10px;
        font-family: var(--font-sans);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .ddos-mode-btn:hover { border-color: var(--border-color-glow); color: var(--text-primary); }
      .ddos-mode-btn.active {
        background: var(--gradient-accent);
        color: var(--ctp-crust);
        border-color: transparent;
        box-shadow: 0 4px 14px color-mix(in srgb, var(--accent-primary) 30%, transparent);
      }

      .ddos-canvas-wrap { position: relative; }
      #sim-canvas {
        width: 100%;
        display: block;
        box-sizing: border-box;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        background: color-mix(in srgb, var(--ctp-crust) 60%, transparent);
      }
      .ddos-banner {
        position: absolute;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 18px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--ctp-mantle) 82%, transparent);
        border: 1px solid var(--border-color-glow);
        color: var(--text-primary);
        font-weight: 700;
        font-size: 0.85rem;
        white-space: nowrap;
        backdrop-filter: blur(8px);
        pointer-events: none;
        z-index: 6;
      }
      .ddos-banner--anim { animation: ddosBanner 2.7s ease forwards; }
      @keyframes ddosBanner {
        0% { opacity: 0; transform: translate(-50%, -8px); }
        12% { opacity: 1; transform: translate(-50%, 0); }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
      .ddos-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--ctp-crust) 74%, transparent);
        backdrop-filter: blur(6px);
        border-radius: var(--radius-md);
        z-index: 5;
      }
      .ddos-overlay-box { text-align: center; display: flex; flex-direction: column; gap: 10px; align-items: center; padding: 24px; }
      .ddos-overlay-icon { font-size: 3rem; }
      .ddos-overlay-box h2 { margin: 0; color: var(--ctp-red); font-size: 1.6rem; }
      .ddos-overlay-box p { margin: 0; color: var(--text-secondary); max-width: 340px; font-size: 0.9rem; line-height: 1.6; }
      .ddos-overlay-score { font-size: 1.1rem; color: var(--text-primary); }
      .ddos-overlay-best { color: var(--text-muted); font-size: 0.85rem; }

      .ddos-legend { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); }
      .ddos-legend span { display: inline-flex; align-items: center; gap: 6px; }
      .ddos-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
      .ddos-dot--pulse { animation: ddosPulse 1.6s infinite; }
      @keyframes ddosPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

      .ddos-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
      .ddos-stat { display: flex; flex-direction: column; gap: 7px; }
      .ddos-stat__label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted); }
      .ddos-stat__value { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); line-height: 1.1; }
      .ddos-stat__unit { font-size: 0.72rem; color: var(--text-muted); }
      .ddos-good { color: var(--ctp-green); }
      .ddos-bad { color: var(--ctp-red); }

      .ddos-healthbar { height: 8px; border-radius: 999px; background: color-mix(in srgb, var(--ctp-surface1) 60%, transparent); overflow: hidden; }
      .ddos-healthbar__fill { height: 100%; border-radius: 999px; transition: width 0.25s ease, background 0.25s ease; }
      .ddos-healthbar__fill.is-ok { background: var(--ctp-green); }
      .ddos-healthbar__fill.is-warn { background: var(--ctp-yellow); }
      .ddos-healthbar__fill.is-crit { background: var(--ctp-peach); }
      .ddos-healthbar__fill.is-down { background: var(--ctp-red); animation: ddosPulse 0.7s infinite; }

      .ddos-section-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
      .ddos-section-title { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-secondary); margin: 0 0 14px; }
      .ddos-section-head .ddos-section-title { margin-bottom: 0; }
      .ddos-section-head { margin-bottom: 14px; }

      .ddos-def-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
      .ddos-def-chip {
        text-align: left;
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 12px 14px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-family: var(--font-sans);
        color: var(--text-secondary);
        transition: all 0.2s ease;
      }
      .ddos-def-chip:hover { border-color: var(--border-color-glow); color: var(--text-primary); }
      .ddos-def-chip.active {
        border-color: var(--ctp-teal);
        background: color-mix(in srgb, var(--ctp-teal) 10%, transparent);
        color: var(--text-primary);
        box-shadow: 0 6px 18px color-mix(in srgb, var(--ctp-teal) 16%, transparent);
      }
      .ddos-def-chip__top { display: flex; align-items: center; gap: 8px; color: var(--text-primary); font-size: 0.92rem; }
      .ddos-def-icon { font-size: 1.1rem; }
      .ddos-def-desc { font-size: 0.78rem; line-height: 1.55; }
      .ddos-def-eff { font-size: 0.74rem; color: var(--text-muted); }
      .ddos-def-eff b { color: var(--ctp-teal); }

      .ddos-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      .ddos-intel-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
      .ddos-intel-head strong { font-size: 1.05rem; color: var(--text-primary); }
      #atk-desc { margin: 0; color: var(--text-secondary); font-size: 0.88rem; line-height: 1.65; }

      .ddos-log {
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: 0.75rem;
        line-height: 1.7;
        max-height: 190px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .ddos-log-line { color: var(--text-secondary); }
      .ddos-log-time { color: var(--text-muted); margin-right: 8px; }

      .ddos-edu { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
      .ddos-edu-card h3 { margin: 0 0 8px; font-size: 1rem; color: var(--text-primary); }
      .ddos-edu-card p { margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; }

      @media (max-width: 800px) {
        .ddos-duo { grid-template-columns: 1fr; }
        .ddos-banner { font-size: 0.75rem; white-space: normal; text-align: center; max-width: 86%; }
      }
    </style>

    <script>
      (function () {
        'use strict';

        /* ---------- World map: 72x36 equirectangular land spans ---------- */
        var COLS = 72, ROWS = 36;
        var SPANS = {
          1: [[20, 22], [29, 32]],
          2: [[18, 23], [25, 32], [38, 40], [46, 49], [53, 56], [62, 65]],
          3: [[3, 8], [10, 22], [25, 31], [46, 48], [50, 71]],
          4: [[0, 23], [26, 30], [32, 32], [37, 71]],
          5: [[0, 28], [32, 32], [37, 71]],
          6: [[0, 25], [34, 35], [37, 71]],
          7: [[11, 25], [34, 64]],
          8: [[11, 25], [34, 45], [47, 62], [64, 65]],
          9: [[11, 24], [34, 44], [45, 62], [64, 65]],
          10: [[11, 23], [34, 36], [38, 64]],
          11: [[12, 21], [34, 62]],
          12: [[14, 20], [34, 60]],
          13: [[15, 21], [33, 47], [49, 60]],
          14: [[15, 19], [21, 22], [33, 46], [50, 52], [54, 56], [59, 60]],
          15: [[17, 20], [33, 38], [40, 46], [50, 52], [55, 57], [59, 61]],
          16: [[19, 25], [33, 46], [52, 52], [56, 56], [58, 61]],
          17: [[20, 27], [37, 44], [55, 60], [62, 64]],
          18: [[20, 27], [38, 43], [55, 60], [62, 65]],
          19: [[20, 28], [38, 43], [57, 66]],
          20: [[21, 28], [38, 43], [45, 45], [62, 65]],
          21: [[21, 28], [39, 42], [45, 45], [60, 66]],
          22: [[22, 28], [39, 42], [45, 45], [59, 66]],
          23: [[22, 27], [39, 42], [59, 66]],
          24: [[22, 25], [39, 42], [59, 65]],
          25: [[21, 24], [64, 66], [70, 71]],
          26: [[21, 23], [65, 65], [69, 71]],
          27: [[21, 22]],
          28: [[21, 22]]
        };
        var LAND = [];
        Object.keys(SPANS).forEach(function (row) {
          SPANS[row].forEach(function (span) {
            for (var c = span[0]; c <= span[1]; c++) LAND.push({ c: c, r: Number(row) });
          });
        });

        /* ---------- Attack & defense model ---------- */
        var ATTACKS = {
          udp: { name: 'UDP Flood', layer: 'Volumetric · L3/L4', color: 'red', tag: 'red', pps: 8, bytes: 512, weight: 0.45, speed: 1.5,
            desc: 'Floods the target with junk UDP datagrams — no handshake, no replies, just raw bandwidth exhaustion. The server wastes resources answering packets that were never real conversations.' },
          syn: { name: 'SYN Flood', layer: 'Protocol · L4', color: 'peach', tag: 'peach', pps: 12, bytes: 64, weight: 0.35, speed: 1.7,
            desc: 'Starts thousands of TCP handshakes and never finishes them. Half-open connections pile up in the backlog queue until legitimate clients can no longer connect.' },
          http: { name: 'HTTP Flood', layer: 'Application · L7', color: 'mauve', tag: 'mauve', pps: 5, bytes: 800, weight: 0.8, speed: 1,
            desc: 'Bots request pages like real users — the most expensive attack to filter, because every single request looks legitimate until you compare patterns at scale.' },
          dnsamp: { name: 'DNS Amplification', layer: 'Volumetric · Reflection', color: 'yellow', tag: 'blue', pps: 3, bytes: 3400, weight: 2.2, speed: 1.2, amp: true,
            desc: 'Tiny spoofed DNS queries are sent to open resolvers, which reply with responses many times larger — aimed at the victim. Watch the two-hop arcs: bot → reflector → target.' },
          slowloris: { name: 'Slowloris', layer: 'Application · L7 · Slow', color: 'sky', tag: 'teal', pps: 0.6, bytes: 120, weight: 9, speed: 0.4, slow: true,
            desc: 'Low and slow. Opens many connections and dribbles partial HTTP headers forever, never completing. Very few packets — but each one holds a server worker hostage.' }
        };
        var DEFENSES = {
          ratelimit: { name: 'Rate Limiting', block: { udp: 0.25, syn: 0.5, http: 0.7, dnsamp: 0.2, slowloris: 0.65 } },
          anycast: { name: 'Anycast Scrubbing', block: { udp: 0.6, syn: 0.5, http: 0.4, dnsamp: 0.7, slowloris: 0.3 } },
          waf: { name: 'WAF Rules', block: { udp: 0.05, syn: 0.3, http: 0.75, dnsamp: 0.1, slowloris: 0.6 } },
          geoblock: { name: 'Geo-Block', block: { udp: 0.3, syn: 0.3, http: 0.35, dnsamp: 0.25, slowloris: 0.2 } }
        };
        var TARGETS = {
          na: { c: 22, r: 10, name: 'US East' },
          sa: { c: 24, r: 21, name: 'São Paulo' },
          eu: { c: 38, r: 7, name: 'Frankfurt' },
          af: { c: 40, r: 23, name: 'Cape Town' },
          as: { c: 63, r: 10, name: 'Tokyo' },
          oc: { c: 65, r: 24, name: 'Sydney' }
        };
        var CAPACITY = 1200;
        var DEF_CAP = 2;

        /* ---------- Theme colors ---------- */
        var COL = {};
        function cssVar(v) {
          var x = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
          return x || '';
        }
        function refreshColors() {
          ['red', 'peach', 'mauve', 'yellow', 'sky', 'teal', 'green', 'blue'].forEach(function (k) {
            COL[k] = cssVar('--ctp-' + k) || '#cdd6f4';
          });
          COL.dim = cssVar('--ctp-surface2') || '#45475a';
          COL.text = cssVar('--ctp-subtext0') || '#a6adc8';
          COL.accent = cssVar('--accent-primary') || '#cba6f7';
          if (cellW > 0) renderMapLayer();
        }

        /* ---------- State ---------- */
        var state = {
          mode: 'sandbox', running: false, phase: 'idle',
          attack: 'udp', target: 'na', bots: 120, intensity: 5,
          defenses: { ratelimit: false, anycast: false, waf: false, geoblock: false },
          health: 100, rps: 0, blockedRps: 0, mbps: 0,
          totalBlocked: 0, wave: 0, score: 0, best: 0, survived: 0,
          nextType: 'udp', waveTimer: 0
        };
        try { state.best = Number(localStorage.getItem('toolbox-ddos-best') || 0) || 0; } catch (e) {}

        /* ---------- Canvas ---------- */
        var canvas = document.getElementById('sim-canvas');
        var ctx = canvas.getContext('2d');
        var mapLayer = document.createElement('canvas');
        var W = 0, H = 0, DPR = 1, cellW = 0, cellH = 0;

        function px(p) { return { x: (p.c + 0.5) * cellW, y: (p.r + 0.5) * cellH }; }

        function renderMapLayer() {
          if (!W) return;
          var m = mapLayer.getContext('2d');
          m.setTransform(DPR, 0, 0, DPR, 0, 0);
          m.clearRect(0, 0, W, H);
          var rad = Math.max(1, Math.min(cellW, cellH) * 0.3);
          m.fillStyle = COL.dim || '#45475a';
          LAND.forEach(function (p) {
            var q = px(p);
            m.beginPath();
            m.arc(q.x, q.y, rad, 0, 6.2832);
            m.fill();
          });
        }

        function resize() {
          var rect = canvas.parentElement.getBoundingClientRect();
          DPR = Math.min(window.devicePixelRatio || 1, 2);
          W = Math.max(320, rect.width);
          H = Math.round(W * ROWS / COLS);
          canvas.width = Math.round(W * DPR);
          canvas.height = Math.round(H * DPR);
          canvas.style.height = H + 'px';
          mapLayer.width = canvas.width;
          mapLayer.height = canvas.height;
          cellW = W / COLS;
          cellH = H / ROWS;
          renderMapLayer();
        }

        /* ---------- Bots, arcs, particles ---------- */
        var bots = [], arcs = [], flashes = [], conns = [];

        function rebuildBots() {
          bots = [];
          var n = Math.min(state.bots, 160);
          for (var i = 0; i < n; i++) {
            var p = LAND[Math.floor(Math.random() * LAND.length)];
            bots.push({ c: p.c, r: p.r, phase: Math.random() * 6.2832 });
          }
        }

        function blockFrac() {
          var f = 0;
          Object.keys(state.defenses).forEach(function (k) {
            if (state.defenses[k]) f = 1 - (1 - f) * (1 - DEFENSES[k].block[state.attack]);
          });
          return f;
        }

        function spawnArc(ambient) {
          var atk = ATTACKS[state.attack];
          var srcCell = ambient
            ? LAND[Math.floor(Math.random() * LAND.length)]
            : bots[Math.floor(Math.random() * bots.length)];
          if (!srcCell) return;
          var dstCell = ambient
            ? LAND[Math.floor(Math.random() * LAND.length)]
            : TARGETS[state.target];
          var s = px(srcCell), d = px(dstCell);
          var dx = d.x - s.x, dy = d.y - s.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 8) return;
          var lift = dist * (0.15 + Math.random() * 0.15);
          var arc = {
            sx: s.x, sy: s.y,
            cx: (s.x + d.x) / 2 - dy / dist * lift,
            cy: (s.y + d.y) / 2 + dx / dist * lift - dist * 0.08,
            tx: d.x, ty: d.y,
            t: 0,
            dur: ambient ? 2.4 : (1.7 / atk.speed) * (0.8 + Math.random() * 0.5),
            color: ambient ? COL.blue : COL[atk.color],
            alpha: ambient ? 0.35 : 0.85,
            size: ambient ? 1.1 : (atk.amp ? 2.6 : 1.7),
            ambient: ambient,
            slow: !!atk.slow,
            blocked: !ambient && Math.random() < blockFrac(),
            via: null
          };
          if (!ambient && atk.amp) {
            arc.via = px(LAND[Math.floor(Math.random() * LAND.length)]);
          }
          arcs.push(arc);
          if (arcs.length > 220) arcs.splice(0, arcs.length - 220);
        }

        function qbez(s, c, e, t) {
          var u = 1 - t;
          return {
            x: u * u * s.x + 2 * u * t * c.x + t * t * e.x,
            y: u * u * s.y + 2 * u * t * c.y + t * t * e.y
          };
        }

        function arcPoint(a, t) {
          if (a.via) {
            if (t < 0.45) {
              return qbez(
                { x: a.sx, y: a.sy },
                { x: (a.sx + a.via.x) / 2, y: Math.min(a.sy, a.via.y) - 24 },
                a.via, t / 0.45
              );
            }
            return qbez(
              a.via,
              { x: (a.via.x + a.tx) / 2, y: Math.min(a.via.y, a.ty) - 48 },
              { x: a.tx, y: a.ty },
              (t - 0.45) / 0.55
            );
          }
          return qbez({ x: a.sx, y: a.sy }, { x: a.cx, y: a.cy }, { x: a.tx, y: a.ty }, t);
        }

        /* ---------- Simulation ---------- */
        var ambAcc = 0, atkAcc = 0, simAcc = 0;
        var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

        function update(dt) {
          ambAcc += dt * (REDUCED ? 0.6 : 2);
          while (ambAcc >= 1) { ambAcc -= 1; spawnArc(true); }
          if (state.running) {
            atkAcc += dt * Math.min(16, 2.5 + state.intensity * 1.1 + state.bots / 90);
            while (atkAcc >= 1) { atkAcc -= 1; spawnArc(false); }
          }
          if (state.mode === 'defense' && state.phase !== 'idle') {
            state.waveTimer -= dt;
            if (state.waveTimer <= 0) {
              if (state.phase === 'prep') startWave();
              else if (state.phase === 'wave') endWave();
            }
          }
          var i, a;
          for (i = arcs.length - 1; i >= 0; i--) {
            a = arcs[i];
            a.t += dt / a.dur;
            var endT = a.blocked ? 0.85 : 1;
            if (a.t >= endT) {
              if (!a.ambient) {
                var p = arcPoint(a, endT);
                if (a.blocked) {
                  flashes.push({ x: p.x, y: p.y, t: 0, ttl: 0.4, color: COL.teal, size: 7 });
                } else {
                  flashes.push({ x: p.x, y: p.y, t: 0, ttl: 0.5, color: a.color, size: 10 });
                  if (a.slow && conns.length < 50) {
                    conns.push({ t: 0, ttl: 3 + Math.random() * 4, seed: Math.random() * 6.2832 });
                  }
                }
              }
              arcs.splice(i, 1);
            }
          }
          for (i = flashes.length - 1; i >= 0; i--) {
            flashes[i].t += dt;
            if (flashes[i].t >= flashes[i].ttl) flashes.splice(i, 1);
          }
          for (i = conns.length - 1; i >= 0; i--) {
            conns[i].t += dt;
            if (conns[i].t >= conns[i].ttl) conns.splice(i, 1);
          }
          simAcc += dt;
          if (simAcc >= 0.2) { simTick(simAcc); simAcc = 0; }
        }

        function simTick(dt) {
          if (state.running) {
            var atk = ATTACKS[state.attack];
            var pps = state.bots * atk.pps * state.intensity;
            var frac = blockFrac();
            var delivered = pps * (1 - frac);
            state.rps = pps;
            state.blockedRps = pps * frac;
            state.mbps = delivered * atk.bytes * 8 / 1000000;
            state.totalBlocked += state.blockedRps * dt;
            var load = delivered * atk.weight;
            if (load > CAPACITY) {
              state.health = Math.max(0, state.health - (load - CAPACITY) / CAPACITY * 22 * dt);
            } else {
              state.health = Math.min(100, state.health + 10 * dt);
            }
            if (state.mode === 'defense') {
              state.survived += dt;
              state.score = Math.floor(state.totalBlocked / 10 + state.survived * 5 + state.wave * 250);
              if (state.health <= 0) gameOver();
            }
          } else {
            state.rps = 0;
            state.blockedRps = 0;
            state.mbps = 0;
            state.health = Math.min(100, state.health + 14 * dt);
          }
          renderStats();
        }

        /* ---------- Rendering ---------- */
        function draw(time) {
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(mapLayer, 0, 0, W, H);
          var atk = ATTACKS[state.attack];
          var tp = px(TARGETS[state.target]);
          var i, j;

          if (state.running) {
            ctx.fillStyle = COL[atk.color];
            for (i = 0; i < bots.length; i++) {
              var q = px(bots[i]);
              ctx.globalAlpha = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(time * 3 + bots[i].phase));
              ctx.beginPath();
              ctx.arc(q.x, q.y, Math.max(1.2, cellW * 0.3), 0, 6.2832);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }

          for (i = 0; i < arcs.length; i++) {
            var a = arcs[i];
            var upto = Math.min(a.t, a.blocked ? 0.85 : 1);
            ctx.beginPath();
            for (j = 0; j <= 20; j++) {
              var pt = arcPoint(a, upto * j / 20);
              if (j === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = a.alpha * 0.3;
            ctx.lineWidth = 1;
            ctx.stroke();
            var head = arcPoint(a, upto);
            ctx.globalAlpha = Math.min(1, a.alpha + 0.15);
            ctx.shadowColor = a.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = a.color;
            ctx.beginPath();
            ctx.arc(head.x, head.y, a.size, 0, 6.2832);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }

          var anyDef = state.defenses.ratelimit || state.defenses.anycast || state.defenses.waf || state.defenses.geoblock;
          if (anyDef && state.running) {
            ctx.beginPath();
            ctx.strokeStyle = COL.teal;
            ctx.globalAlpha = 0.45 + 0.2 * Math.sin(time * 2.5);
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.arc(tp.x, tp.y, 16, 0, 6.2832);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
          }

          for (i = 0; i < conns.length; i++) {
            var cn = conns[i];
            var ang = time * 0.6 + cn.seed;
            var x = tp.x + Math.cos(ang) * 16, y = tp.y + Math.sin(ang) * 16;
            var fade = Math.max(0, 1 - cn.t / cn.ttl);
            ctx.beginPath();
            ctx.moveTo(tp.x, tp.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = COL.sky;
            ctx.globalAlpha = 0.3 * fade;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = COL.sky;
            ctx.globalAlpha = 0.8 * fade;
            ctx.arc(x, y, 1.6, 0, 6.2832);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          for (i = 0; i < flashes.length; i++) {
            var f = flashes[i], k = f.t / f.ttl;
            ctx.beginPath();
            ctx.strokeStyle = f.color;
            ctx.globalAlpha = Math.max(0, 0.9 * (1 - k));
            ctx.lineWidth = 2;
            ctx.arc(f.x, f.y, f.size * (0.4 + k * 1.6), 0, 6.2832);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          var pulseCol = state.health <= 0 ? COL.red : (state.health < 40 ? COL.peach : COL.accent);
          ctx.beginPath();
          ctx.strokeStyle = pulseCol;
          ctx.globalAlpha = 0.4 + 0.25 * Math.sin(time * (state.running ? 6 : 2));
          ctx.lineWidth = 2;
          ctx.arc(tp.x, tp.y, 10, 0, 6.2832);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.shadowColor = pulseCol;
          ctx.shadowBlur = 12;
          ctx.fillStyle = pulseCol;
          ctx.fillRect(tp.x - 3.5, tp.y - 3.5, 7, 7);
          ctx.shadowBlur = 0;

          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = COL.text;
          ctx.globalAlpha = 0.9;
          ctx.fillText(TARGETS[state.target].name, tp.x, tp.y + 24);
          ctx.globalAlpha = 1;

          if (state.health <= 0) {
            ctx.fillStyle = COL.red;
            ctx.globalAlpha = 0.07 + 0.03 * Math.sin(time * 4);
            ctx.fillRect(0, 0, W, H);
            ctx.globalAlpha = 1;
          }
        }

        /* ---------- Defense Game ---------- */
        function pickNextType() {
          var types = Object.keys(ATTACKS);
          var next = types[Math.floor(Math.random() * types.length)];
          if (next === state.attack) next = types[(types.indexOf(next) + 1) % types.length];
          state.nextType = next;
        }

        function bestDefenseFor(type) {
          var best = 'ratelimit', bv = -1;
          Object.keys(DEFENSES).forEach(function (k) {
            if (DEFENSES[k].block[type] > bv) { bv = DEFENSES[k].block[type]; best = k; }
          });
          return DEFENSES[best].name;
        }

        function startDefenseGame() {
          state.health = 100;
          state.totalBlocked = 0;
          state.wave = 0;
          state.score = 0;
          state.survived = 0;
          arcs = []; conns = []; flashes = [];
          pickNextType();
          state.phase = 'prep';
          state.waveTimer = 5;
          state.running = false;
          banner('Wave 1 incoming: ' + ATTACKS[state.nextType].name + ' — try ' + bestDefenseFor(state.nextType));
          log('Defense game started. Keep the server alive!');
          updateLaunchLabel();
        }

        function startWave() {
          state.wave += 1;
          state.attack = state.nextType;
          document.getElementById('sim-attack').value = state.attack;
          state.bots = Math.min(500, 40 + state.wave * 30);
          state.intensity = Math.min(10, 2 + state.wave);
          syncSliders();
          rebuildBots();
          state.phase = 'wave';
          state.waveTimer = 30;
          state.running = true;
          banner('WAVE ' + state.wave + ' — ' + ATTACKS[state.attack].name);
          log('Wave ' + state.wave + ': ' + ATTACKS[state.attack].name + ' with ' + state.bots + ' bots.');
          updateAttackInfo();
          updateDefPanel();
          pickNextType();
        }

        function endWave() {
          state.phase = 'prep';
          state.waveTimer = 6;
          state.running = false;
          banner('Next: ' + ATTACKS[state.nextType].name + ' — adjust mitigations!');
          log('Wave ' + state.wave + ' repelled. Nice work.');
        }

        function gameOver() {
          state.running = false;
          state.phase = 'idle';
          state.health = 0;
          var isBest = state.score > state.best;
          if (isBest) {
            state.best = state.score;
            try { localStorage.setItem('toolbox-ddos-best', String(state.best)); } catch (e) {}
          }
          document.getElementById('sim-overlay-score').textContent = String(state.score);
          document.getElementById('sim-overlay-best').textContent = String(state.best) + (isBest ? ' — new best!' : '');
          document.getElementById('sim-overlay').classList.remove('tb-hidden');
          log('Server offline after ' + state.wave + ' wave(s). Final score: ' + state.score + '.');
          updateLaunchLabel();
        }

        function stopAll() {
          state.running = false;
          state.phase = 'idle';
          document.getElementById('sim-overlay').classList.add('tb-hidden');
          updateLaunchLabel();
        }

        /* ---------- UI ---------- */
        function fmt(n) {
          if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
          if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
          return String(Math.floor(n));
        }

        function renderStats() {
          var h = Math.round(state.health);
          var fill = document.getElementById('st-health-fill');
          fill.style.width = h + '%';
          fill.className = 'ddos-healthbar__fill ' + (h > 70 ? 'is-ok' : h > 40 ? 'is-warn' : h > 0 ? 'is-crit' : 'is-down');
          document.getElementById('st-health-label').textContent = h > 70 ? 'ONLINE' : h > 40 ? 'DEGRADED' : h > 0 ? 'CRITICAL' : 'OFFLINE';
          document.getElementById('st-rps').textContent = fmt(state.rps);
          document.getElementById('st-blocked').textContent = fmt(state.blockedRps);
          document.getElementById('st-mbps').textContent = state.mbps >= 1000
            ? (state.mbps / 1000).toFixed(2) + ' Gbps'
            : Math.round(state.mbps) + ' Mbps';
          document.getElementById('st-bots').textContent = state.running ? fmt(state.bots) : '0';
          if (state.mode === 'defense') {
            document.getElementById('st-wave-label').textContent = 'Defense Game';
            document.getElementById('st-wave').textContent = state.wave > 0 ? 'Wave ' + state.wave : 'Get ready';
            document.getElementById('st-score').textContent = 'score ' + fmt(state.score) + ' · best ' + fmt(state.best);
          } else {
            document.getElementById('st-wave-label').textContent = 'Mode';
            document.getElementById('st-wave').textContent = 'Sandbox';
            document.getElementById('st-score').textContent = 'free play';
          }
        }

        function updateLaunchLabel() {
          var btn = document.getElementById('sim-launch');
          if (state.mode === 'sandbox') {
            btn.innerHTML = state.running ? '⏹ Stop Attack' : '🚀 Launch Attack';
          } else {
            btn.innerHTML = state.phase !== 'idle' ? '⏹ Abort Game' : '🎮 Start Defense Game';
          }
        }

        function updateAttackInfo() {
          var atk = ATTACKS[state.attack];
          document.getElementById('atk-name').textContent = atk.name;
          var layer = document.getElementById('atk-layer');
          layer.textContent = atk.layer;
          layer.className = 'tb-tag tb-tag--' + atk.tag;
          document.getElementById('atk-desc').textContent = atk.desc;
        }

        function updateDefPanel() {
          Object.keys(DEFENSES).forEach(function (k) {
            document.getElementById('def-eff-' + k).textContent = Math.round(DEFENSES[k].block[state.attack] * 100) + '%';
            document.getElementById('def-' + k).classList.toggle('active', state.defenses[k]);
          });
        }

        function syncSliders() {
          document.getElementById('sim-bots').value = String(state.bots);
          document.getElementById('sim-bots-val').textContent = String(state.bots);
          document.getElementById('sim-intensity').value = String(state.intensity);
          document.getElementById('sim-intensity-val').textContent = String(state.intensity);
        }

        var logEl = document.getElementById('sim-log');
        var t0 = performance.now();
        function stamp() {
          var s = Math.floor((performance.now() - t0) / 1000);
          var m = Math.floor(s / 60);
          s = s % 60;
          return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
        }
        function log(msg) {
          logEl.insertAdjacentHTML('afterbegin', '<div class="ddos-log-line"><span class="ddos-log-time">' + stamp() + '</span>' + msg + '</div>');
          while (logEl.children.length > 9) logEl.removeChild(logEl.lastChild);
        }

        var bannerTimer = null;
        function banner(text) {
          var el = document.getElementById('sim-banner');
          el.textContent = text;
          el.classList.remove('tb-hidden', 'ddos-banner--anim');
          void el.offsetWidth;
          el.classList.add('ddos-banner--anim');
          if (bannerTimer) clearTimeout(bannerTimer);
          bannerTimer = setTimeout(function () { el.classList.add('tb-hidden'); }, 2700);
        }

        function setMode(mode) {
          if (state.mode === mode) return;
          stopAll();
          state.mode = mode;
          document.getElementById('sim-mode-sandbox').classList.toggle('active', mode === 'sandbox');
          document.getElementById('sim-mode-defense').classList.toggle('active', mode === 'defense');
          document.getElementById('sim-mode-hint').textContent = mode === 'sandbox'
            ? 'Free play — pick an attack and watch the map burn.'
            : 'Survive escalating waves. Max ' + DEF_CAP + ' mitigations active at once!';
          log(mode === 'sandbox' ? 'Sandbox mode.' : 'Defense Game mode — press Start when ready.');
          renderStats();
        }

        function toggleDefense(k) {
          if (!state.defenses[k] && state.mode === 'defense') {
            var active = Object.keys(state.defenses).filter(function (x) { return state.defenses[x]; }).length;
            if (active >= DEF_CAP) {
              log('Mitigation capacity reached (' + DEF_CAP + ' max in Defense Game).');
              return;
            }
          }
          state.defenses[k] = !state.defenses[k];
          document.getElementById('def-' + k).classList.toggle('active', state.defenses[k]);
          log((state.defenses[k] ? 'Mitigation enabled: ' : 'Mitigation disabled: ') + DEFENSES[k].name + '.');
        }

        /* ---------- Wiring ---------- */
        document.getElementById('sim-mode-sandbox').addEventListener('click', function () { setMode('sandbox'); });
        document.getElementById('sim-mode-defense').addEventListener('click', function () { setMode('defense'); });
        document.getElementById('sim-attack').addEventListener('change', function (e) {
          state.attack = e.target.value;
          updateAttackInfo();
          updateDefPanel();
        });
        document.getElementById('sim-target').addEventListener('change', function (e) {
          state.target = e.target.value;
          log('Target server relocated: ' + TARGETS[state.target].name + '.');
        });
        document.getElementById('sim-bots').addEventListener('input', function (e) {
          state.bots = Number(e.target.value);
          document.getElementById('sim-bots-val').textContent = String(state.bots);
          rebuildBots();
        });
        document.getElementById('sim-intensity').addEventListener('input', function (e) {
          state.intensity = Number(e.target.value);
          document.getElementById('sim-intensity-val').textContent = String(state.intensity);
        });
        Object.keys(DEFENSES).forEach(function (k) {
          document.getElementById('def-' + k).addEventListener('click', function () { toggleDefense(k); });
        });
        document.getElementById('sim-launch').addEventListener('click', function () {
          if (state.mode === 'sandbox') {
            state.running = !state.running;
            if (state.running) {
              rebuildBots();
              log('Attack launched: ' + ATTACKS[state.attack].name + ' targeting ' + TARGETS[state.target].name + ' (' + state.bots + ' bots).');
            } else {
              log('Attack halted. Server recovering.');
            }
          } else {
            if (state.phase === 'idle') startDefenseGame();
            else { stopAll(); log('Defense game aborted.'); }
          }
          updateLaunchLabel();
        });
        document.getElementById('sim-overlay-restart').addEventListener('click', function () {
          document.getElementById('sim-overlay').classList.add('tb-hidden');
          startDefenseGame();
        });

        /* ---------- Init ---------- */
        refreshColors();
        resize();
        window.addEventListener('resize', resize);
        rebuildBots();
        updateAttackInfo();
        updateDefPanel();
        renderStats();
        updateLaunchLabel();
        log('Simulator ready. All traffic on this page is fake — promise.');
        setInterval(refreshColors, 2000);

        var last = performance.now();
        function frame(now) {
          var dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          update(dt);
          draw(now / 1000);
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      })();
    </script>
  `
});
