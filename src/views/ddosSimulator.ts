import { layout } from './layout.js';
import { footer } from './footer.js';

export const ddosSimulatorView = (): string => layout({
  title: 'DDoS Simulator Â· Skiddle Toolbox',
  description: 'Educational incremental game simulating botnet and DDoS mechanics â€” fully client-side, no real network traffic.',
  canonicalPath: '/ddos-simulator',
  subtitle: 'Cloudflare Workers Edge Utility',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="ddos-stack">
    <div class="tb-page-header accent-red">
      <div class="tb-tool-icon">ðŸŒ©ï¸</div>
      <div class="tb-page-header__text">
        <h1>DDoS Simulator</h1>
        <p>Farm a botnet from scratch, pwn increasingly defended targets, and stay one step ahead of the trace â€” all on a live cyber-war map.</p>
      </div>
    </div>

    <div class="tb-card ddos-disclaimer">
      <span class="tb-tag tb-tag--green">100% Simulated</span>
      <p>This is an <strong>educational game</strong>. Every bot, packet, and attack arc is generated locally in your browser â€” <strong>no real network traffic ever leaves this page.</strong></p>
    </div>

    <div class="tb-card">
      <div class="ddos-controls">
        <div class="ddos-control">
          <label class="tb-label">Mode</label>
          <div class="ddos-mode-switch">
            <button type="button" id="sim-mode-campaign" class="ddos-mode-btn active">ðŸ§Ÿ Campaign</button>
            <button type="button" id="sim-mode-sandbox" class="ddos-mode-btn">ðŸ§ª Sandbox</button>
            <button type="button" id="sim-mode-defense" class="ddos-mode-btn">ðŸŽ® Defense</button>
          </div>
          <span class="ddos-hint" id="sim-mode-hint">Farm bots, pwn targets, spend credits. Trace is the enemy.</span>
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
        <div class="ddos-control" id="sim-target-ctrl">
          <label class="tb-label" for="sim-target">Target server</label>
          <select id="sim-target" class="tb-select" disabled>
            <option value="na">US East</option>
            <option value="sa">SÃ£o Paulo</option>
            <option value="eu">Frankfurt</option>
            <option value="af">Cape Town</option>
            <option value="as">Tokyo</option>
            <option value="oc">Sydney</option>
          </select>
          <span class="ddos-hint" id="sim-target-hint">Set by campaign level.</span>
        </div>
        <div class="ddos-control" id="sim-bots-ctrl">
          <label class="tb-label" for="sim-bots">Botnet size â€” <span id="sim-bots-val">120</span> bots</label>
          <input type="range" id="sim-bots" min="10" max="500" step="10" value="120" disabled>
          <span class="ddos-hint" id="sim-bots-hint">Farm bots on the map instead!</span>
        </div>
        <div class="ddos-control">
          <label class="tb-label" for="sim-intensity">Attack intensity â€” <span id="sim-intensity-val">5</span>/10</label>
          <input type="range" id="sim-intensity" min="1" max="10" step="1" value="5">
          <span class="ddos-hint" id="sim-intensity-hint">Higher intensity = faster trace.</span>
        </div>
        <div class="ddos-control ddos-control--launch">
          <button type="button" id="sim-launch" class="tb-btn">ðŸš€ Launch Attack</button>
        </div>
      </div>
    </div>

    <div id="sim-campaign-panel">
      <div class="tb-card">
        <div class="ddos-section-head">
          <h2 class="ddos-section-title">ðŸŽ¯ Current Target</h2>
          <div class="ddos-tag-row">
            <span class="tb-tag tb-tag--mauve tb-hidden" id="ct-prestige">ðŸŒŸ P1</span>
            <span class="tb-tag tb-tag--red" id="ct-level">Level 1</span>
          </div>
        </div>
        <div class="ddos-target-row">
          <div class="ddos-target-name" id="ct-name">Personal Blog</div>
          <div class="ddos-target-stats">
            <span>Capacity <b id="ct-cap">800</b> load</span>
            <span>Mitigation <b id="ct-block">0%</b></span>
            <span>Weakness <b id="ct-weak">UDP Flood</b></span>
            <span>Payout <b id="ct-payout">ðŸ’° 150</b></span>
          </div>
        </div>
        <div class="ddos-prestige tb-hidden" id="ct-prestige-row">
          <button type="button" id="sim-prestige" class="tb-btn">ðŸŒŸ Prestige</button>
          <span class="ddos-hint" id="sim-prestige-hint"></span>
        </div>
      </div>

      <div class="tb-card">
        <div class="ddos-section-head">
          <h2 class="ddos-section-title">ðŸ§Ÿ Your Botnet</h2>
          <div class="ddos-save-actions">
            <button type="button" id="sim-save-progress" class="tb-btn tb-btn-secondary ddos-save-btn">ðŸ’¾ Save progress</button>
            <button type="button" id="sim-export-save" class="tb-btn tb-btn-secondary ddos-save-btn">ðŸ“¤ Export</button>
            <button type="button" id="sim-import-save" class="tb-btn tb-btn-secondary ddos-save-btn">ðŸ“¥ Import</button>
            <button type="button" id="sim-reset-save" class="tb-btn tb-btn-secondary ddos-reset-btn">Reset save</button>
          </div>
        </div>
        <div class="ddos-botnet-grid">
          <div class="ddos-botnet-stat">
            <span class="ddos-stat__label">Bots</span>
            <span class="ddos-stat__value" id="cb-bots">0</span>
            <span class="ddos-stat__unit">of <span id="cb-cap">500</span> cap</span>
          </div>
          <div class="ddos-botnet-stat">
            <span class="ddos-stat__label">Credits</span>
            <span class="ddos-stat__value ddos-credits" id="cb-credits">0</span>
            <span class="ddos-stat__unit" id="cb-credits-unit">ðŸ’° spend below</span>
          </div>
          <div class="ddos-botnet-stat">
            <span class="ddos-stat__label">Auto-scan</span>
            <span class="ddos-stat__value" id="cb-rate">0.5</span>
            <span class="ddos-stat__unit">infections/s</span>
          </div>
          <div class="ddos-botnet-stat ddos-botnet-stat--trace">
            <span class="ddos-stat__label">ðŸ¥· Trace Level</span>
            <div class="ddos-tracebar"><div id="cb-trace-fill" class="ddos-tracebar__fill is-ok" style="width:0%"></div></div>
            <span class="ddos-stat__unit" id="cb-trace-label">0% â€” invisible</span>
          </div>
        </div>
        <div class="ddos-farm-row">
          <p class="ddos-hint ddos-farm-hint">ðŸ’¡ <strong>Click land on the map</strong> to infect devices manually â€” or use the button, same infection. Auto-scan and Worm Spread farm for you over time. Progress auto-saves every 5s â€” or hit <strong>ðŸ’¾ Save progress</strong> anytime.</p>
          <button type="button" id="sim-infect" class="tb-btn tb-btn-secondary ddos-infect-btn">ðŸ§Ÿ Infect devices <span id="sim-infect-n">+1</span></button>
        </div>
        <div class="ddos-io tb-hidden" id="sim-io-panel">
          <textarea id="sim-io-text" class="tb-textarea ddos-io-text" rows="3" spellcheck="false" placeholder="Paste a save string here and hit âœ… Apply import â€” or press ðŸ“¤ Export to fill this box with your current save."></textarea>
          <div class="ddos-io-actions">
            <button type="button" id="sim-io-copy" class="tb-btn tb-btn-secondary ddos-save-btn">ðŸ“‹ Copy</button>
            <button type="button" id="sim-io-apply" class="tb-btn tb-btn-secondary ddos-save-btn">âœ… Apply import</button>
            <button type="button" id="sim-io-close" class="tb-btn tb-btn-secondary ddos-save-btn">âœ• Close</button>
          </div>
        </div>
        <div class="ddos-lifetime">
          <span class="ddos-lifetime-title">ðŸ“ˆ Lifetime</span>
          <div class="ddos-lifetime-grid">
            <div class="ddos-lifetime-stat"><span>ðŸ§Ÿ Bots farmed</span><b id="lt-farmed">0</b></div>
            <div class="ddos-lifetime-stat"><span>ðŸ’° Credits earned</span><b id="lt-earned">0</b></div>
            <div class="ddos-lifetime-stat"><span>ðŸš¨ Busts</span><b id="lt-busts">0</b></div>
            <div class="ddos-lifetime-stat"><span>ðŸ† Targets pwned</span><b id="lt-pwned">0</b></div>
            <div class="ddos-lifetime-stat"><span>â±ï¸ Playtime</span><b id="lt-time">0m</b></div>
          </div>
        </div>
        <div class="ddos-shop-grid">
          <button type="button" class="ddos-shop-item" id="shop-kit">
            <span class="ddos-shop-top">ðŸ§  <strong>Exploit Kit</strong> <span class="ddos-shop-lv" id="shop-lv-kit">Lv.0</span></span>
            <span class="ddos-shop-desc">+1 bot per map click, +0.5 auto-scan/s</span>
            <span class="ddos-shop-cost" id="shop-cost-kit">ðŸ’° 100</span>
          </button>
          <button type="button" class="ddos-shop-item" id="shop-worm">
            <span class="ddos-shop-top">ðŸª± <strong>Worm Spread</strong> <span class="ddos-shop-lv" id="shop-lv-worm">Lv.0</span></span>
            <span class="ddos-shop-desc">Bots self-replicate +0.5%/s per level</span>
            <span class="ddos-shop-cost" id="shop-cost-worm">ðŸ’° 250</span>
          </button>
          <button type="button" class="ddos-shop-item" id="shop-clock">
            <span class="ddos-shop-top">âš¡ <strong>Bot Overclock</strong> <span class="ddos-shop-lv" id="shop-lv-clock">Lv.0</span></span>
            <span class="ddos-shop-desc">+25% packet rate per bot</span>
            <span class="ddos-shop-cost" id="shop-cost-clock">ðŸ’° 200</span>
          </button>
          <button type="button" class="ddos-shop-item" id="shop-proxy">
            <span class="ddos-shop-top">ðŸ¥· <strong>Proxy Chains</strong> <span class="ddos-shop-lv" id="shop-lv-proxy">Lv.0</span></span>
            <span class="ddos-shop-desc">Trace gain âˆ’20% per level</span>
            <span class="ddos-shop-cost" id="shop-cost-proxy">ðŸ’° 150</span>
          </button>
          <button type="button" class="ddos-shop-item" id="shop-c2">
            <span class="ddos-shop-top">ðŸ–¥ï¸ <strong>C2 Servers</strong> <span class="ddos-shop-lv" id="shop-lv-c2">Lv.0</span></span>
            <span class="ddos-shop-desc">Botnet capacity +500 per level</span>
            <span class="ddos-shop-cost" id="shop-cost-c2">ðŸ’° 300</span>
          </button>
        </div>
      </div>
    </div>

    <div class="tb-card ddos-map-card">
      <div class="ddos-canvas-wrap">
        <canvas id="sim-canvas" role="img" aria-label="Simulated world map showing botnet attack arcs converging on a target server"></canvas>
        <div id="sim-banner" class="ddos-banner tb-hidden"></div>
        <div id="sim-overlay" class="ddos-overlay tb-hidden">
          <div class="ddos-overlay-box">
            <div class="ddos-overlay-icon">ðŸ’¥</div>
            <h2>Server Offline</h2>
            <p>The target was overwhelmed and stopped responding. Legitimate users are now staring at timeout errors.</p>
            <div class="ddos-overlay-score">Score: <strong id="sim-overlay-score">0</strong></div>
            <div class="ddos-overlay-best">Best: <span id="sim-overlay-best">0</span></div>
            <button type="button" id="sim-overlay-restart" class="tb-btn">ðŸ”„ Play Again</button>
          </div>
        </div>
      </div>
      <div class="ddos-legend">
        <span><i class="ddos-dot" style="background:var(--ctp-surface2)"></i> Land</span>
        <span><i class="ddos-dot" style="background:var(--ctp-blue)"></i> Normal traffic</span>
        <span><i class="ddos-dot" style="background:var(--ctp-green)"></i> Your botnet</span>
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
        <span class="ddos-stat__label" id="st-wave-label">Campaign</span>
        <span class="ddos-stat__value" id="st-wave">Level 1</span>
        <span class="ddos-stat__unit" id="st-score">ðŸ’° 0</span>
      </div>
    </div>

    <div class="tb-card tb-hidden" id="sim-defenses-card">
      <div class="ddos-section-head">
        <h2 class="ddos-section-title">ðŸ›¡ï¸ Mitigations</h2>
        <span class="ddos-hint">Sandbox: combine freely. Defense Game: max 2 active.</span>
      </div>
      <div class="ddos-def-grid">
        <button type="button" class="ddos-def-chip" id="def-ratelimit">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">â±ï¸</span><strong>Rate Limiting</strong></span>
          <span class="ddos-def-desc">Caps requests per source. Great against floods that reuse the same bots.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-ratelimit">25%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-anycast">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">ðŸŒ</span><strong>Anycast Scrubbing</strong></span>
          <span class="ddos-def-desc">Spreads traffic across a global scrubbing network and absorbs volume at the edge.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-anycast">60%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-waf">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">ðŸ§±</span><strong>WAF Rules</strong></span>
          <span class="ddos-def-desc">Inspects application-layer requests and drops malicious patterns.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-waf">5%</b> of this attack</span>
        </button>
        <button type="button" class="ddos-def-chip" id="def-geoblock">
          <span class="ddos-def-chip__top"><span class="ddos-def-icon">ðŸš§</span><strong>Geo-Block</strong></span>
          <span class="ddos-def-desc">Drops traffic from regions you do not serve. Blunt but cheap.</span>
          <span class="ddos-def-eff">blocks <b id="def-eff-geoblock">30%</b> of this attack</span>
        </button>
      </div>
    </div>

    <div class="ddos-duo">
      <div class="tb-card">
        <h2 class="ddos-section-title">ðŸŽ¯ Attack Intel</h2>
        <div class="ddos-intel-head">
          <strong id="atk-name">UDP Flood</strong>
          <span class="tb-tag tb-tag--red" id="atk-layer">Volumetric Â· L3/L4</span>
        </div>
        <p id="atk-desc"></p>
      </div>
      <div class="tb-card">
        <h2 class="ddos-section-title">ðŸ“¡ Event Log</h2>
        <div id="sim-log" class="ddos-log"></div>
      </div>
    </div>

    <div class="ddos-edu">
      <div class="tb-card ddos-edu-card">
        <h3>ðŸ§Ÿ 1 Â· Farm the botnet</h3>
        <p>Every zombie starts somewhere: click land on the map to infect devices, let auto-scan find vulnerable hosts, and research Worm Spread so the botnet replicates itself. Your botnet even keeps farming while you're away (up to 4 hours).</p>
      </div>
      <div class="tb-card ddos-edu-card">
        <h3>ðŸŒŠ 2 Â· Flood the target</h3>
        <p>Each target has a capacity and its own mitigations â€” but also a weakness. Pick the attack type it is weak against, overwhelm it for 3 seconds, and collect the payout. Pwn all 7 targets to unlock ðŸŒŸ Prestige and start over stronger.</p>
      </div>
      <div class="tb-card ddos-edu-card">
        <h3>ðŸ¥· 3 Â· Manage your trace</h3>
        <p>Big, loud attacks raise your trace level. Hit 100% and the authorities seize 40% of your botnet. Throttle intensity or invest in Proxy Chains to stay dark.</p>
      </div>
      <div class="tb-card ddos-edu-card">
        <h3>ðŸ›¡ï¸ 4 Â· Or play defense</h3>
        <p>Flip to Defense mode to experience the other side: combine rate limiting, anycast scrubbing, WAF rules, and geo-blocking to survive escalating waves.</p>
      </div>
    </div>

    ${footer()}
    </div>

    <style>
      .ddos-stack > * + * { margin-top: 24px; }
      #sim-campaign-panel > * + * { margin-top: 24px; }

      .ddos-disclaimer { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .ddos-disclaimer p { margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; flex: 1; min-width: 240px; }

      .ddos-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 18px; align-items: end; }
      .ddos-control { display: flex; flex-direction: column; gap: 8px; }
      .ddos-control input[type="range"] { width: 100%; accent-color: var(--accent-primary); cursor: pointer; }
      .ddos-control.is-disabled { opacity: 0.45; }
      .ddos-control.is-disabled input, .ddos-control.is-disabled select { cursor: not-allowed; }
      .ddos-hint { font-size: 0.72rem; color: var(--text-muted); line-height: 1.5; }
      .ddos-farm-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 14px 0 0; }
      .ddos-farm-hint { margin: 0; font-size: 0.78rem; flex: 1; min-width: 260px; }
      .ddos-infect-btn { white-space: nowrap; }
      .ddos-farm-hint strong { color: var(--text-primary); }

      .ddos-mode-switch { display: flex; gap: 8px; }
      .ddos-mode-btn {
        flex: 1;
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        padding: 8px 6px;
        font-family: var(--font-sans);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .ddos-mode-btn:hover { border-color: var(--border-color-glow); color: var(--text-primary); }
      .ddos-mode-btn.active {
        background: var(--gradient-accent);
        color: var(--ctp-crust);
        border-color: transparent;
        box-shadow: 0 4px 14px color-mix(in srgb, var(--accent-primary) 30%, transparent);
      }

      .ddos-target-row { display: flex; flex-direction: column; gap: 10px; }
      .ddos-tag-row { display: flex; gap: 8px; align-items: center; }
      .ddos-prestige { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color); }
      .ddos-prestige .ddos-hint { flex: 1; min-width: 220px; }
      .ddos-target-name { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
      .ddos-target-stats { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 0.82rem; color: var(--text-secondary); }
      .ddos-target-stats b { color: var(--accent-primary); }

      .ddos-botnet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
      .ddos-botnet-stat { display: flex; flex-direction: column; gap: 6px; }
      .ddos-credits { color: var(--ctp-yellow); }
      .ddos-reset-btn { padding: 5px 12px; font-size: 0.75rem; }
      .ddos-save-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .ddos-save-btn { padding: 5px 12px; font-size: 0.75rem; }
      .ddos-save-btn.is-saved { border-color: var(--ctp-green); color: var(--ctp-green); }
      .ddos-io { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
      .ddos-io-text { font-size: 0.75rem; padding: 10px 12px; }
      .ddos-io-text.is-error { border-color: var(--ctp-red); }
      .ddos-io-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      .ddos-lifetime { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-color); }
      .ddos-lifetime-title { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted); margin-bottom: 10px; }
      .ddos-lifetime-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px; }
      .ddos-lifetime-stat { display: flex; flex-direction: column; gap: 3px; font-size: 0.72rem; color: var(--text-muted); }
      .ddos-lifetime-stat b { font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); }

      .ddos-tracebar { height: 8px; border-radius: 999px; background: color-mix(in srgb, var(--ctp-surface1) 60%, transparent); overflow: hidden; min-width: 140px; }
      .ddos-tracebar__fill { height: 100%; border-radius: 999px; transition: width 0.25s ease, background 0.25s ease; }
      .ddos-tracebar__fill.is-ok { background: var(--ctp-green); }
      .ddos-tracebar__fill.is-warn { background: var(--ctp-yellow); }
      .ddos-tracebar__fill.is-crit { background: var(--ctp-red); animation: ddosPulse 0.7s infinite; }

      .ddos-shop-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-top: 14px; }
      .ddos-shop-item {
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
      .ddos-shop-item:hover:not(:disabled) { border-color: var(--ctp-yellow); color: var(--text-primary); transform: translateY(-2px); }
      .ddos-shop-item:disabled { opacity: 0.55; cursor: not-allowed; }
      .ddos-shop-top { display: flex; align-items: center; gap: 7px; color: var(--text-primary); font-size: 0.9rem; flex-wrap: wrap; }
      .ddos-shop-lv { margin-left: auto; font-size: 0.7rem; font-weight: 700; color: var(--ctp-mauve); }
      .ddos-shop-desc { font-size: 0.76rem; line-height: 1.5; }
      .ddos-shop-cost { font-size: 0.8rem; font-weight: 700; color: var(--ctp-yellow); }

      .ddos-canvas-wrap { position: relative; }
      #sim-canvas {
        width: 100%;
        display: block;
        box-sizing: border-box;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        background: color-mix(in srgb, var(--ctp-crust) 60%, transparent);
      }
      #sim-canvas.is-farmable { cursor: crosshair; }
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

      .ddos-section-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
      .ddos-section-title { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-secondary); margin: 0; }

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
          udp: { name: 'UDP Flood', layer: 'Volumetric Â· L3/L4', color: 'red', tag: 'red', pps: 8, bytes: 512, weight: 0.45, speed: 1.5,
            desc: 'Floods the target with junk UDP datagrams â€” no handshake, no replies, just raw bandwidth exhaustion. The server wastes resources answering packets that were never real conversations.' },
          syn: { name: 'SYN Flood', layer: 'Protocol Â· L4', color: 'peach', tag: 'peach', pps: 12, bytes: 64, weight: 0.35, speed: 1.7,
            desc: 'Starts thousands of TCP handshakes and never finishes them. Half-open connections pile up in the backlog queue until legitimate clients can no longer connect.' },
          http: { name: 'HTTP Flood', layer: 'Application Â· L7', color: 'mauve', tag: 'mauve', pps: 5, bytes: 800, weight: 0.8, speed: 1,
            desc: 'Bots request pages like real users â€” the most expensive attack to filter, because every single request looks legitimate until you compare patterns at scale.' },
          dnsamp: { name: 'DNS Amplification', layer: 'Volumetric Â· Reflection', color: 'yellow', tag: 'blue', pps: 3, bytes: 3400, weight: 2.2, speed: 1.2, amp: true,
            desc: 'Tiny spoofed DNS queries are sent to open resolvers, which reply with responses many times larger â€” aimed at the victim. Watch the two-hop arcs: bot â†’ reflector â†’ target.' },
          slowloris: { name: 'Slowloris', layer: 'Application Â· L7 Â· Slow', color: 'sky', tag: 'teal', pps: 0.6, bytes: 120, weight: 9, speed: 0.4, slow: true,
            desc: 'Low and slow. Opens many connections and dribbles partial HTTP headers forever, never completing. Very few packets â€” but each one holds a server worker hostage.' }
        };
        var DEFENSES = {
          ratelimit: { name: 'Rate Limiting', block: { udp: 0.25, syn: 0.5, http: 0.7, dnsamp: 0.2, slowloris: 0.65 } },
          anycast: { name: 'Anycast Scrubbing', block: { udp: 0.6, syn: 0.5, http: 0.4, dnsamp: 0.7, slowloris: 0.3 } },
          waf: { name: 'WAF Rules', block: { udp: 0.05, syn: 0.3, http: 0.75, dnsamp: 0.1, slowloris: 0.6 } },
          geoblock: { name: 'Geo-Block', block: { udp: 0.3, syn: 0.3, http: 0.35, dnsamp: 0.25, slowloris: 0.2 } }
        };
        var TARGETS = {
          na: { c: 22, r: 10, name: 'US East' },
          sa: { c: 24, r: 21, name: 'SÃ£o Paulo' },
          eu: { c: 38, r: 7, name: 'Frankfurt' },
          af: { c: 40, r: 23, name: 'Cape Town' },
          as: { c: 63, r: 10, name: 'Tokyo' },
          oc: { c: 65, r: 24, name: 'Sydney' }
        };
        var CAPACITY = 1200;
        var DEF_CAP = 2;

        /* ---------- Campaign model ---------- */
        var CAMPAIGN_TARGETS = [
          { name: 'Personal Blog', loc: 'na', cap: 800, block: 0, weak: 'udp', payout: 150 },
          { name: 'Small E-Shop', loc: 'sa', cap: 2200, block: 0.25, weak: 'syn', payout: 300 },
          { name: 'News Portal', loc: 'eu', cap: 5000, block: 0.4, weak: 'http', payout: 600 },
          { name: 'Online Bank', loc: 'af', cap: 12000, block: 0.55, weak: 'slowloris', payout: 1200 },
          { name: 'Tech Giant', loc: 'as', cap: 30000, block: 0.7, weak: 'dnsamp', payout: 2500 },
          { name: 'Government Grid', loc: 'oc', cap: 70000, block: 0.82, weak: 'udp', payout: 6000 },
          { name: 'Edge Network Titan', loc: 'na', cap: 160000, block: 0.9, weak: 'http', payout: 15000 }
        ];
        var UPGRADES = {
          kit: { name: 'Exploit Kit', base: 100, mult: 1.8 },
          worm: { name: 'Worm Spread', base: 250, mult: 2.2 },
          clock: { name: 'Bot Overclock', base: 200, mult: 2.0 },
          proxy: { name: 'Proxy Chains', base: 150, mult: 2.0 },
          c2: { name: 'C2 Servers', base: 300, mult: 2.2 }
        };
        var UPGRADE_MAX = 10;
        var TRACE_K = 0.0015;
        var TAKEDOWN_SECONDS = 3;
        var OFFLINE_CAP_SECONDS = 4 * 3600;
        var OFFLINE_MIN_SECONDS = 60;
        var TRACE_OFFLINE_DECAY = 0.5;

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
          mode: 'campaign', running: false, phase: 'idle',
          attack: 'udp', target: 'na', bots: 120, intensity: 5,
          defenses: { ratelimit: false, anycast: false, waf: false, geoblock: false },
          health: 100, rps: 0, blockedRps: 0, mbps: 0,
          totalBlocked: 0, wave: 0, score: 0, best: 0, survived: 0,
          nextType: 'udp', waveTimer: 0,
          campaign: {
            bots: 0, credits: 0, trace: 0, level: 1, offline: 0,
            prestige: 0, finalPwned: false,
            up: { kit: 0, worm: 0, clock: 0, proxy: 0, c2: 0 },
            stats: { farmed: 0, earned: 0, busts: 0, pwned: 0, time: 0 }
          }
        };
        try { state.best = Number(localStorage.getItem('toolbox-ddos-best') || 0) || 0; } catch (e) {}

        function botCap() { return 500 + 500 * state.campaign.up.c2; }
        function upCost(k) { return Math.floor(UPGRADES[k].base * Math.pow(UPGRADES[k].mult, state.campaign.up[k])); }
        function creditMult() { return 1 + 0.25 * state.campaign.prestige; }
        function startingBots() { return 50 * state.campaign.prestige; }

        function campaignSnapshot() {
          return {
            b: Math.floor(state.campaign.bots),
            c: Math.floor(state.campaign.credits),
            l: state.campaign.level,
            tr: state.campaign.trace,
            t: Date.now(),
            pr: state.campaign.prestige,
            fp: state.campaign.finalPwned ? 1 : 0,
            up: state.campaign.up,
            st: {
              f: Math.floor(state.campaign.stats.farmed),
              e: Math.floor(state.campaign.stats.earned),
              b: state.campaign.stats.busts,
              p: state.campaign.stats.pwned,
              t: Math.floor(state.campaign.stats.time)
            }
          };
        }
        function saveCampaign() {
          try {
            localStorage.setItem('toolbox-ddos-campaign', JSON.stringify(campaignSnapshot()));
          } catch (e) {}
        }
        function offlineBotsAfter(bots, elapsed, kitLv, wormLv) {
          var flat = 0.5 + 0.5 * kitLv;
          var w = 0.005 * wormLv;
          if (w <= 0) return bots + flat * elapsed;
          return (bots + flat / w) * Math.exp(w * elapsed) - flat / w;
        }
        function applySave(d) {
          var offline = null;
          state.campaign.credits = Number(d.c) || 0;
          state.campaign.level = Math.min(Math.max(Number(d.l) || 1, 1), CAMPAIGN_TARGETS.length);
          Object.keys(UPGRADES).forEach(function (k) {
            state.campaign.up[k] = Math.min(Math.max(Number(d.up && d.up[k]) || 0, 0), UPGRADE_MAX);
          });
          var st = d.st || {};
          state.campaign.stats.farmed = Math.max(0, Number(st.f) || 0);
          state.campaign.stats.earned = Math.max(0, Number(st.e) || 0);
          state.campaign.stats.busts = Math.max(0, Math.floor(Number(st.b) || 0));
          state.campaign.stats.pwned = Math.max(0, Math.floor(Number(st.p) || 0));
          state.campaign.stats.time = Math.max(0, Number(st.t) || 0);
          state.campaign.bots = Math.min(Math.max(Number(d.b) || 0, 0), botCap());
          state.campaign.trace = Math.min(Math.max(Number(d.tr) || 0, 0), 100);
          state.campaign.prestige = Math.max(0, Math.floor(Number(d.pr) || 0));
          state.campaign.finalPwned = d.fp === 1 || d.fp === true;
          var t = CAMPAIGN_TARGETS[state.campaign.level - 1];
          state.target = t.loc;
          var elapsed = (Date.now() - (Number(d.t) || 0)) / 1000;
          if (d.t && elapsed >= OFFLINE_MIN_SECONDS) {
            elapsed = Math.min(elapsed, OFFLINE_CAP_SECONDS);
            var before = state.campaign.bots;
            state.campaign.bots = Math.min(botCap(), offlineBotsAfter(before, elapsed, state.campaign.up.kit, state.campaign.up.worm));
            var traceBefore = state.campaign.trace;
            state.campaign.trace = Math.max(0, state.campaign.trace - TRACE_OFFLINE_DECAY * elapsed);
            offline = {
              seconds: elapsed,
              bots: Math.max(0, Math.floor(state.campaign.bots - before)),
              traceDropped: Math.max(0, traceBefore - state.campaign.trace)
            };
            state.campaign.stats.farmed += offline.bots;
          }
          return offline;
        }
        function loadCampaign() {
          try {
            var raw = localStorage.getItem('toolbox-ddos-campaign');
            if (!raw) return null;
            var d = JSON.parse(raw);
            if (!d || typeof d !== 'object') return null;
            return applySave(d);
          } catch (e) { return null; }
        }
        function copyText(text, cb) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(false); });
            return;
          }
          try {
            var ta = document.getElementById('sim-io-text');
            ta.value = text;
            ta.select();
            cb(document.execCommand('copy'));
          } catch (e) { cb(false); }
        }
        function importSave(text) {
          var d;
          try { d = JSON.parse(text); } catch (e) { return 'not valid JSON.'; }
          if (!d || typeof d !== 'object' || Array.isArray(d)) return 'save data must be a JSON object.';
          if (typeof d.b === 'undefined' && typeof d.c === 'undefined' && typeof d.l === 'undefined' && typeof d.up === 'undefined') {
            return 'no campaign data found in that string.';
          }
          state.running = false;
          state.health = 100;
          arcs = []; conns = []; flashes = [];
          var offline = applySave(d);
          saveCampaign();
          document.getElementById('sim-target').value = state.target;
          syncFarmVisuals();
          renderCampaign();
          renderShop();
          renderStats();
          updateLaunchLabel();
          var msg = 'Save imported â€” ' + fmt(Math.floor(state.campaign.bots)) + ' bots, ðŸ’°' + fmt(Math.floor(state.campaign.credits)) + ', Level ' + state.campaign.level + '.';
          if (offline && offline.bots > 0) msg += ' (+' + fmt(offline.bots) + ' bots farmed while away)';
          log(msg);
          banner('ðŸ“¥ Save imported!');
          return null;
        }

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
        var bots = [], farmVisuals = [], arcs = [], flashes = [], conns = [], floaters = [];

        function rebuildBots() {
          bots = [];
          var n = Math.min(state.bots, 160);
          for (var i = 0; i < n; i++) {
            var p = LAND[Math.floor(Math.random() * LAND.length)];
            bots.push({ c: p.c, r: p.r, phase: Math.random() * 6.2832 });
          }
        }

        function syncFarmVisuals() {
          var target = Math.min(Math.floor(state.campaign.bots), 160);
          while (farmVisuals.length < target) {
            var p = LAND[Math.floor(Math.random() * LAND.length)];
            farmVisuals.push({ c: p.c, r: p.r, phase: Math.random() * 6.2832 });
          }
          if (farmVisuals.length > target) farmVisuals.length = target;
        }

        function playerBlockFrac() {
          var f = 0;
          Object.keys(state.defenses).forEach(function (k) {
            if (state.defenses[k]) f = 1 - (1 - f) * (1 - DEFENSES[k].block[state.attack]);
          });
          return f;
        }

        function effectiveBlock() {
          if (state.mode === 'campaign') {
            var t = CAMPAIGN_TARGETS[state.campaign.level - 1];
            return t.block * (state.attack === t.weak ? 0.5 : 1);
          }
          return playerBlockFrac();
        }

        function activeBots() {
          return state.mode === 'campaign' ? Math.floor(state.campaign.bots) : state.bots;
        }

        function spawnArc(ambient) {
          var atk = ATTACKS[state.attack];
          var srcPool = state.mode === 'campaign' ? farmVisuals : bots;
          var srcCell = ambient
            ? LAND[Math.floor(Math.random() * LAND.length)]
            : srcPool[Math.floor(Math.random() * srcPool.length)];
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
            blocked: !ambient && Math.random() < effectiveBlock(),
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
        var ambAcc = 0, atkAcc = 0, simAcc = 0, saveAcc = 0;
        var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

        function update(dt) {
          ambAcc += dt * (REDUCED ? 0.6 : 2);
          while (ambAcc >= 1) { ambAcc -= 1; spawnArc(true); }
          if (state.running && activeBots() > 0) {
            atkAcc += dt * Math.min(16, 2.5 + state.intensity * 1.1 + activeBots() / 90);
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
          for (i = floaters.length - 1; i >= 0; i--) {
            floaters[i].t += dt;
            if (floaters[i].t >= floaters[i].ttl) floaters.splice(i, 1);
          }
          simAcc += dt;
          if (simAcc >= 0.2) { simTick(simAcc); simAcc = 0; }
        }

        function simTick(dt) {
          if (state.mode === 'campaign') {
            campaignTick(dt);
            renderStats();
            return;
          }
          if (state.running) {
            var atk = ATTACKS[state.attack];
            var pps = state.bots * atk.pps * state.intensity;
            var frac = playerBlockFrac();
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

        /* ---------- Campaign ---------- */
        function campaignTick(dt) {
          var c = state.campaign;
          var t = CAMPAIGN_TARGETS[c.level - 1];
          var cap = botCap();
          var before = Math.floor(c.bots);
          c.bots = Math.min(cap, c.bots + (0.5 + 0.5 * c.up.kit) * dt + c.bots * 0.005 * c.up.worm * dt);
          if (Math.floor(c.bots) !== before) syncFarmVisuals();
          c.stats.farmed += Math.max(0, c.bots - before);
          c.stats.time += dt;

          if (state.running && Math.floor(c.bots) > 0) {
            var atk = ATTACKS[state.attack];
            var block = effectiveBlock();
            var n = Math.floor(c.bots);
            var pps = n * atk.pps * state.intensity * (1 + 0.25 * c.up.clock);
            var delivered = pps * (1 - block);
            state.rps = pps;
            state.blockedRps = pps * block;
            state.mbps = delivered * atk.bytes * 8 / 1000000;
            state.totalBlocked += state.blockedRps * dt;
            var load = delivered * atk.weight;
            if (load > t.cap) {
              state.health = Math.max(0, state.health - (load - t.cap) / t.cap * 22 * dt);
            } else {
              state.health = Math.min(100, state.health + 10 * dt);
            }
            c.trace = Math.min(100, c.trace + n * state.intensity * TRACE_K * Math.pow(0.8, c.up.proxy) * dt);
            if (state.health <= 0) {
              c.offline += dt;
              var trickle = c.level * 2 * dt * creditMult();
              c.credits += trickle;
              c.stats.earned += trickle;
              if (c.offline >= TAKEDOWN_SECONDS) levelComplete();
            } else {
              c.offline = 0;
            }
            if (c.trace >= 100) busted();
          } else {
            state.rps = 0;
            state.blockedRps = 0;
            state.mbps = 0;
            state.health = Math.min(100, state.health + 14 * dt);
            c.trace = Math.max(0, c.trace - 10 * dt);
            c.offline = 0;
          }

          saveAcc += dt;
          if (saveAcc >= 5) { saveAcc = 0; saveCampaign(); }
          renderCampaign();
        }

        function levelComplete() {
          var c = state.campaign;
          var t = CAMPAIGN_TARGETS[c.level - 1];
          var gain = t.payout * creditMult();
          c.credits += gain;
          c.stats.earned += gain;
          c.stats.pwned += 1;
          c.offline = 0;
          state.health = 100;
          banner('ðŸ† ' + t.name + ' PWNED â€” +ðŸ’°' + fmt(gain));
          log('Target offline for ' + TAKEDOWN_SECONDS + 's. Payout received: ' + fmt(gain) + ' credits.');
          if (c.level < CAMPAIGN_TARGETS.length) {
            c.level += 1;
            var nt = CAMPAIGN_TARGETS[c.level - 1];
            state.target = nt.loc;
            document.getElementById('sim-target').value = nt.loc;
            log('New target acquired: ' + nt.name + ' (Level ' + c.level + ').');
          } else if (!c.finalPwned) {
            c.finalPwned = true;
            banner('ðŸŒŸ PRESTIGE UNLOCKED');
            log('Every target pwned! ðŸŒŸ Prestige is now available â€” reset to Level 1 with permanent bonuses.');
          } else {
            log('Final target pwned again â€” the internet is yours.');
          }
          saveCampaign();
          renderCampaign();
          renderShop();
        }

        function doPrestige() {
          var c = state.campaign;
          if (!c.finalPwned) return;
          if (!window.confirm('Prestige and restart the campaign at Level 1? Bots, credits, trace, and upgrades reset â€” you keep lifetime stats and gain permanent bonuses.')) return;
          c.prestige += 1;
          c.bots = startingBots();
          c.credits = 0;
          c.trace = 0;
          c.level = 1;
          c.offline = 0;
          c.up = { kit: 0, worm: 0, clock: 0, proxy: 0, c2: 0 };
          c.finalPwned = false;
          state.health = 100;
          state.running = false;
          state.target = CAMPAIGN_TARGETS[0].loc;
          document.getElementById('sim-target').value = state.target;
          arcs = []; conns = []; flashes = [];
          syncFarmVisuals();
          renderCampaign();
          renderShop();
          renderStats();
          updateLaunchLabel();
          saveCampaign();
          banner('ðŸŒŸ PRESTIGE ' + c.prestige + ' â€” richer, faster, louder');
          log('Prestige ' + c.prestige + '! Permanent bonuses: +' + c.prestige * 25 + '% credits, ' + fmt(startingBots()) + ' starting bots. Level 1 awaits.');
        }

        function busted() {
          var c = state.campaign;
          var lost = Math.floor(c.bots * 0.4);
          c.bots = Math.max(0, c.bots - lost);
          c.trace = 35;
          c.stats.busts += 1;
          state.running = false;
          syncFarmVisuals();
          banner('ðŸš¨ BUSTED â€” ' + fmt(lost) + ' bots seized!');
          log('Authorities traced the C2 network. ' + fmt(lost) + ' bots lost. Lay low while trace decays.');
          updateLaunchLabel();
          saveCampaign();
        }

        function buyUpgrade(k) {
          var c = state.campaign;
          if (c.up[k] >= UPGRADE_MAX) return;
          var cost = upCost(k);
          if (c.credits < cost) {
            log('Not enough credits for ' + UPGRADES[k].name + ' (need ' + fmt(cost) + ').');
            return;
          }
          c.credits -= cost;
          c.up[k] += 1;
          log('Purchased ' + UPGRADES[k].name + ' Lv.' + c.up[k] + ' for ' + fmt(cost) + ' credits.');
          if (k === 'c2') syncFarmVisuals();
          renderShop();
          renderCampaign();
          saveCampaign();
        }

        function infectAt(cell, x, y) {
          var c = state.campaign;
          var cap = botCap();
          if (Math.floor(c.bots) >= cap) {
            floaters.push({ x: x, y: y, t: 0, ttl: 0.9, text: 'CAP', color: COL.peach });
            return;
          }
          var n = 1 + c.up.kit;
          var beforeBots = c.bots;
          c.bots = Math.min(cap, c.bots + n);
          c.stats.farmed += c.bots - beforeBots;
          syncFarmVisuals();
          flashes.push({ x: x, y: y, t: 0, ttl: 0.5, color: COL.green, size: 8 });
          floaters.push({ x: x, y: y, t: 0, ttl: 0.9, text: '+' + n, color: COL.green });
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
          banner('Wave 1 incoming: ' + ATTACKS[state.nextType].name + ' â€” try ' + bestDefenseFor(state.nextType));
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
          banner('WAVE ' + state.wave + ' â€” ' + ATTACKS[state.attack].name);
          log('Wave ' + state.wave + ': ' + ATTACKS[state.attack].name + ' with ' + state.bots + ' bots.');
          updateAttackInfo();
          updateDefPanel();
          pickNextType();
        }

        function endWave() {
          state.phase = 'prep';
          state.waveTimer = 6;
          state.running = false;
          banner('Next: ' + ATTACKS[state.nextType].name + ' â€” adjust mitigations!');
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
          document.getElementById('sim-overlay-best').textContent = String(state.best) + (isBest ? ' â€” new best!' : '');
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

        /* ---------- Rendering ---------- */
        function draw(time) {
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(mapLayer, 0, 0, W, H);
          var atk = ATTACKS[state.attack];
          var tp = px(TARGETS[state.target]);
          var i, j;

          var visualBots = state.mode === 'campaign' ? farmVisuals : bots;
          if (visualBots.length > 0 && (state.running || state.mode === 'campaign')) {
            ctx.fillStyle = state.running ? COL[atk.color] : COL.green;
            for (i = 0; i < visualBots.length; i++) {
              var q = px(visualBots[i]);
              ctx.globalAlpha = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(time * 3 + visualBots[i].phase));
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
          if (anyDef && state.running && state.mode !== 'campaign') {
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

          for (i = 0; i < floaters.length; i++) {
            var fl = floaters[i], fk = fl.t / fl.ttl;
            ctx.font = '700 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = fl.color;
            ctx.globalAlpha = Math.max(0, 1 - fk);
            ctx.fillText(fl.text, fl.x, fl.y - 8 - fk * 18);
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
          var targetLabel = state.mode === 'campaign'
            ? CAMPAIGN_TARGETS[state.campaign.level - 1].name
            : TARGETS[state.target].name;
          ctx.fillText(targetLabel, tp.x, tp.y + 24);
          ctx.globalAlpha = 1;

          if (state.health <= 0) {
            ctx.fillStyle = COL.red;
            ctx.globalAlpha = 0.07 + 0.03 * Math.sin(time * 4);
            ctx.fillRect(0, 0, W, H);
            ctx.globalAlpha = 1;
          }
        }

        /* ---------- UI ---------- */
        function fmt(n) {
          if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
          if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
          return String(Math.floor(n));
        }

        function durStr(s) {
          var h = Math.floor(s / 3600);
          var m = Math.round((s % 3600) / 60);
          if (h > 0) return h + 'h ' + m + 'm';
          return Math.max(1, m) + 'm';
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
          document.getElementById('st-bots').textContent = state.mode === 'campaign'
            ? fmt(Math.floor(state.campaign.bots))
            : (state.running ? fmt(state.bots) : '0');
          if (state.mode === 'campaign') {
            document.getElementById('st-wave-label').textContent = 'Campaign';
            document.getElementById('st-wave').textContent = 'Level ' + state.campaign.level;
            document.getElementById('st-score').textContent = 'ðŸ’° ' + fmt(Math.floor(state.campaign.credits));
          } else if (state.mode === 'defense') {
            document.getElementById('st-wave-label').textContent = 'Defense Game';
            document.getElementById('st-wave').textContent = state.wave > 0 ? 'Wave ' + state.wave : 'Get ready';
            document.getElementById('st-score').textContent = 'score ' + fmt(state.score) + ' Â· best ' + fmt(state.best);
          } else {
            document.getElementById('st-wave-label').textContent = 'Mode';
            document.getElementById('st-wave').textContent = 'Sandbox';
            document.getElementById('st-score').textContent = 'free play';
          }
        }

        function renderCampaign() {
          var c = state.campaign;
          var t = CAMPAIGN_TARGETS[c.level - 1];
          document.getElementById('ct-level').textContent = 'Level ' + c.level;
          document.getElementById('ct-name').textContent = t.name;
          document.getElementById('ct-cap').textContent = fmt(t.cap);
          document.getElementById('ct-block').textContent = Math.round(t.block * 100) + '%';
          document.getElementById('ct-weak').textContent = ATTACKS[t.weak].name;
          document.getElementById('ct-payout').textContent = 'ðŸ’° ' + fmt(t.payout);
          document.getElementById('cb-bots').textContent = fmt(Math.floor(c.bots));
          document.getElementById('cb-cap').textContent = fmt(botCap());
          document.getElementById('cb-credits').textContent = fmt(Math.floor(c.credits));
          document.getElementById('cb-rate').textContent = (0.5 + 0.5 * c.up.kit).toFixed(1);
          var tr = Math.round(c.trace);
          var tf = document.getElementById('cb-trace-fill');
          tf.style.width = tr + '%';
          tf.className = 'ddos-tracebar__fill ' + (tr < 40 ? 'is-ok' : tr < 75 ? 'is-warn' : 'is-crit');
          document.getElementById('cb-trace-label').textContent = tr + '% â€” ' + (tr < 40 ? 'invisible' : tr < 75 ? 'noticed' : 'hunted');
          var pTag = document.getElementById('ct-prestige');
          pTag.classList.toggle('tb-hidden', c.prestige < 1);
          if (c.prestige > 0) pTag.textContent = 'ðŸŒŸ P' + c.prestige;
          document.getElementById('ct-prestige-row').classList.toggle('tb-hidden', !c.finalPwned);
          if (c.finalPwned) {
            document.getElementById('sim-prestige-hint').textContent = c.prestige === 0
              ? 'Reset to Level 1 and restart with permanent bonuses: +25% credits and +50 starting bots per prestige. Lifetime stats are kept.'
              : 'Reset to Level 1 again. Current bonuses: +' + c.prestige * 25 + '% credits and ' + fmt(50 * c.prestige) + ' starting bots â€” next prestige raises both.';
          }
          document.getElementById('cb-credits-unit').textContent = c.prestige > 0
            ? 'ðŸŒŸ +' + c.prestige * 25 + '% from prestige'
            : 'ðŸ’° spend below';
          document.getElementById('sim-infect-n').textContent = '+' + (1 + c.up.kit);
          document.getElementById('sim-infect').disabled = Math.floor(c.bots) >= botCap();
          renderLifetime();
          renderShopAfford();
        }

        function renderLifetime() {
          var s = state.campaign.stats;
          document.getElementById('lt-farmed').textContent = fmt(s.farmed);
          document.getElementById('lt-earned').textContent = fmt(s.earned);
          document.getElementById('lt-busts').textContent = fmt(s.busts);
          document.getElementById('lt-pwned').textContent = fmt(s.pwned);
          document.getElementById('lt-time').textContent = durStr(s.time);
        }

        function renderShop() {
          Object.keys(UPGRADES).forEach(function (k) {
            var lv = state.campaign.up[k];
            document.getElementById('shop-lv-' + k).textContent = 'Lv.' + lv;
            var costEl = document.getElementById('shop-cost-' + k);
            if (lv >= UPGRADE_MAX) costEl.textContent = 'MAX';
            else costEl.textContent = 'ðŸ’° ' + fmt(upCost(k));
          });
          renderShopAfford();
        }

        function renderShopAfford() {
          Object.keys(UPGRADES).forEach(function (k) {
            var btn = document.getElementById('shop-' + k);
            btn.disabled = state.campaign.up[k] >= UPGRADE_MAX || state.campaign.credits < upCost(k);
          });
        }

        function updateLaunchLabel() {
          var btn = document.getElementById('sim-launch');
          if (state.mode === 'defense') {
            btn.innerHTML = state.phase !== 'idle' ? 'â¹ Abort Game' : 'ðŸŽ® Start Defense Game';
          } else {
            btn.innerHTML = state.running ? 'â¹ Stop Attack' : 'ðŸš€ Launch Attack';
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
          ['campaign', 'sandbox', 'defense'].forEach(function (m) {
            document.getElementById('sim-mode-' + m).classList.toggle('active', m === mode);
          });
          var hints = {
            campaign: 'Farm bots, pwn targets, spend credits. Trace is the enemy.',
            sandbox: 'Free play â€” pick an attack and watch the map burn.',
            defense: 'Survive escalating waves. Max ' + DEF_CAP + ' mitigations active at once!'
          };
          document.getElementById('sim-mode-hint').textContent = hints[mode];
          document.getElementById('sim-campaign-panel').classList.toggle('tb-hidden', mode !== 'campaign');
          document.getElementById('sim-defenses-card').classList.toggle('tb-hidden', mode === 'campaign');
          var botsCtrl = document.getElementById('sim-bots-ctrl');
          botsCtrl.classList.toggle('is-disabled', mode === 'campaign');
          document.getElementById('sim-bots').disabled = mode === 'campaign';
          document.getElementById('sim-bots-hint').textContent = mode === 'campaign'
            ? 'Farm bots on the map instead!'
            : 'Used in Sandbox & Defense modes.';
          var targetCtrl = document.getElementById('sim-target-ctrl');
          targetCtrl.classList.toggle('is-disabled', mode === 'campaign');
          document.getElementById('sim-target').disabled = mode === 'campaign';
          document.getElementById('sim-target-hint').textContent = mode === 'campaign'
            ? 'Set by campaign level.'
            : 'Pick any region to target.';
          document.getElementById('sim-intensity-hint').textContent = mode === 'campaign'
            ? 'Higher intensity = faster trace.'
            : 'Packets per bot.';
          canvas.classList.toggle('is-farmable', mode === 'campaign');
          if (mode === 'campaign') {
            syncFarmVisuals();
            renderCampaign();
            log('Campaign mode â€” click land on the map to start farming your botnet.');
          } else if (mode === 'defense') {
            log('Defense Game mode â€” press Start when ready.');
          } else {
            log('Sandbox mode.');
          }
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
        document.getElementById('sim-mode-campaign').addEventListener('click', function () { setMode('campaign'); });
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
        Object.keys(UPGRADES).forEach(function (k) {
          document.getElementById('shop-' + k).addEventListener('click', function () { buyUpgrade(k); });
        });
        document.getElementById('sim-prestige').addEventListener('click', doPrestige);
        document.getElementById('sim-infect').addEventListener('click', function () {
          var p = LAND[Math.floor(Math.random() * LAND.length)];
          var q = px(p);
          infectAt(p, q.x, q.y);
        });
        document.getElementById('sim-reset-save').addEventListener('click', function () {
          if (!window.confirm('Reset campaign progress? Your botnet, credits, upgrades, and prestige will be wiped.')) return;
          state.campaign.bots = 0;
          state.campaign.credits = 0;
          state.campaign.trace = 0;
          state.campaign.level = 1;
          state.campaign.offline = 0;
          state.campaign.prestige = 0;
          state.campaign.finalPwned = false;
          state.campaign.up = { kit: 0, worm: 0, clock: 0, proxy: 0, c2: 0 };
          state.campaign.stats = { farmed: 0, earned: 0, busts: 0, pwned: 0, time: 0 };
          state.target = CAMPAIGN_TARGETS[0].loc;
          document.getElementById('sim-target').value = state.target;
          state.running = false;
          syncFarmVisuals();
          try { localStorage.removeItem('toolbox-ddos-campaign'); } catch (e) {}
          document.getElementById('sim-io-panel').classList.add('tb-hidden');
          renderCampaign();
          renderShop();
          renderStats();
          updateLaunchLabel();
          log('Campaign reset. Time to rebuild from zero.');
        });
        var saveBtn = document.getElementById('sim-save-progress');
        var saveBtnTimer = null;
        saveBtn.addEventListener('click', function () {
          saveAcc = 0;
          saveCampaign();
          log('Progress saved â€” botnet, credits, and upgrades stored in this browser.');
          saveBtn.classList.add('is-saved');
          saveBtn.textContent = 'âœ“ Saved';
          if (saveBtnTimer) clearTimeout(saveBtnTimer);
          saveBtnTimer = setTimeout(function () {
            saveBtn.classList.remove('is-saved');
            saveBtn.textContent = 'ðŸ’¾ Save progress';
          }, 1400);
        });
        window.addEventListener('beforeunload', saveCampaign);
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'hidden') saveCampaign();
        });
        var ioPanel = document.getElementById('sim-io-panel');
        var ioText = document.getElementById('sim-io-text');
        document.getElementById('sim-export-save').addEventListener('click', function () {
          var data = JSON.stringify(campaignSnapshot());
          ioPanel.classList.remove('tb-hidden');
          ioText.classList.remove('is-error');
          ioText.value = data;
          ioText.select();
          copyText(data, function (ok) {
            log(ok ? 'Save exported â€” copied to clipboard. Keep it somewhere safe.' : 'Save exported â€” copy it from the box below.');
          });
        });
        document.getElementById('sim-import-save').addEventListener('click', function () {
          ioPanel.classList.remove('tb-hidden');
          ioText.classList.remove('is-error');
          ioText.value = '';
          ioText.focus();
          log('Paste a save string into the box and hit Apply import.');
        });
        document.getElementById('sim-io-copy').addEventListener('click', function () {
          if (!ioText.value) { log('Nothing to copy â€” export first.'); return; }
          ioText.select();
          copyText(ioText.value, function (ok) {
            log(ok ? 'Copied to clipboard.' : 'Copy failed â€” select and copy the text manually.');
          });
        });
        document.getElementById('sim-io-apply').addEventListener('click', function () {
          var err = importSave(ioText.value);
          if (err) {
            ioText.classList.add('is-error');
            log('Import failed: ' + err);
            return;
          }
          ioPanel.classList.add('tb-hidden');
        });
        document.getElementById('sim-io-close').addEventListener('click', function () {
          ioPanel.classList.add('tb-hidden');
        });
        document.getElementById('sim-launch').addEventListener('click', function () {
          if (state.mode === 'defense') {
            if (state.phase === 'idle') startDefenseGame();
            else { stopAll(); log('Defense game aborted.'); }
          } else if (state.mode === 'campaign') {
            if (state.running) {
              state.running = false;
              log('Attack halted. Trace decaying.');
            } else if (Math.floor(state.campaign.bots) < 1) {
              log('Farm some bots first â€” click land on the map!');
              banner('ðŸ§Ÿ Click land on the map to infect your first devices');
            } else {
              state.running = true;
              var t = CAMPAIGN_TARGETS[state.campaign.level - 1];
              log('Attack launched: ' + ATTACKS[state.attack].name + ' targeting ' + t.name + ' (' + fmt(Math.floor(state.campaign.bots)) + ' bots).');
            }
          } else {
            state.running = !state.running;
            if (state.running) {
              rebuildBots();
              log('Attack launched: ' + ATTACKS[state.attack].name + ' targeting ' + TARGETS[state.target].name + ' (' + state.bots + ' bots).');
            } else {
              log('Attack halted. Server recovering.');
            }
          }
          updateLaunchLabel();
        });
        document.getElementById('sim-overlay-restart').addEventListener('click', function () {
          document.getElementById('sim-overlay').classList.add('tb-hidden');
          startDefenseGame();
        });

        canvas.addEventListener('pointerdown', function (e) {
          if (state.mode !== 'campaign') return;
          var rect = canvas.getBoundingClientRect();
          var x = e.clientX - rect.left, y = e.clientY - rect.top;
          var gc = x / cellW - 0.5, gr = y / cellH - 0.5;
          var best = null, bd = 1.6;
          for (var i = 0; i < LAND.length; i++) {
            var d = Math.sqrt((LAND[i].c - gc) * (LAND[i].c - gc) + (LAND[i].r - gr) * (LAND[i].r - gr));
            if (d < bd) { bd = d; best = LAND[i]; }
          }
          if (!best) return;
          infectAt(best, x, y);
        });

        /* ---------- Init ---------- */
        var offline = loadCampaign();
        document.getElementById('sim-target').value = state.target;
        refreshColors();
        resize();
        window.addEventListener('resize', resize);
        rebuildBots();
        syncFarmVisuals();
        updateAttackInfo();
        updateDefPanel();
        renderCampaign();
        renderShop();
        renderStats();
        updateLaunchLabel();
        if (state.campaign.bots < 1 && state.campaign.credits < 1) {
          log('Welcome, script kiddie. Click land on the map to infect your first devices.');
        } else if (offline && (offline.bots > 0 || offline.traceDropped >= 1)) {
          var awayBits = [];
          if (offline.bots > 0) awayBits.push('+' + fmt(offline.bots) + ' bots farmed');
          if (offline.traceDropped >= 1) awayBits.push('trace cooled to ' + Math.round(state.campaign.trace) + '%');
          log('Welcome back â€” away ' + durStr(offline.seconds) + ': ' + awayBits.join(', ') + '.');
          if (offline.bots > 0) banner('ðŸ˜´ While you were away: +' + fmt(offline.bots) + ' bots');
        } else {
          log('Welcome back. Botnet and credits restored from save.');
        }
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
