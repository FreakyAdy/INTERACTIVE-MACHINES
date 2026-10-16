const MACHINES = [
  { name: "Astronomical Clock", zh: "水运仪象台", slug: "astroclock" },
  { name: "Seismoscope", zh: "候风地动仪", slug: "seismoscope" },
  { name: "Odometer Carriage", zh: "记里鼓车", slug: "odometer" },
  { name: "Pattern Loom", zh: "汉代提花织机", slug: "loom" },
];

export default function CoverPage() {
  return (
    <div className="cover-page" data-testid="cover-page" lang="en">
      <svg
        aria-hidden="true"
        className="cover-astrolabe"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="92" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="78" strokeDasharray="2 2.2" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="60" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="22" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="4" strokeWidth="0.4" />
        <path
          d="M100 8 V192 M8 100 H192 M35 35 L165 165 M165 35 L35 165"
          strokeWidth="0.2"
        />
        <circle cx="146" cy="54" r="14" strokeDasharray="1.4 1.4" strokeWidth="0.35" />
      </svg>

      <header className="cover-header">
        <span className="cover-brand">Mechanica</span>
        <span className="cover-pill">Interactive Exhibition</span>
      </header>

      <main className="cover-main">
        <p className="cover-eyebrow">Classical Mechanical Engineering · 3D Physical Simulation</p>
        <h1 className="cover-title">
          Ancient Machines Reborn <br className="cover-break" />
          in Operable 3D Reconstructions
        </h1>

        <div className="cover-columns">
          <section>
            <h2 className="cover-label">Empirical Precision</h2>
            <p>
              Four lost masterpieces of classical engineering restored from surviving dynastic treatises, 
              excavated relics, and calibrated kinematic ratios. Every tooth, linkage, and drop bearing carries 
              complete provenance.
            </p>
          </section>
          <section>
            <h2 className="cover-label">Driveable Mechanics</h2>
            <p>
              Not static turntables—driveable mechanisms. Advance water-regulated escapement chains, 
              test seismic monostable interlocks, gear down odometer drive shafts, and cycle four-pedal 
              harness sheds in real time.
            </p>
          </section>
        </div>

        <p className="cover-signature">
          Original creation by Caleb Wei and Mechanica contributors · Preserved and rendered in full interactive fidelity
        </p>

        <div className="cover-actions">
          <a className="cover-enter" data-testid="cover-enter" href="#/museum">
            Enter the museum
            <svg
              aria-hidden="true"
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <span className="cover-machines">{MACHINES.map((m) => m.name).join(" · ")}</span>
        </div>

        <div className="cover-quick-links">
          {MACHINES.map((m) => (
            <a
              key={m.slug}
              className="cover-quick-chip"
              href={`#/m/${m.slug}`}
              title={`View ${m.name}`}
            >
              <span className="chip-zh">{m.zh}</span>
              <span className="chip-en">{m.name}</span>
            </a>
          ))}
        </div>
      </main>

      <footer className="cover-footer">
        <span>Ancient Machines Reborn · Interactive Physical Reconstructions</span>
        <span>2026</span>
      </footer>
    </div>
  );
}
