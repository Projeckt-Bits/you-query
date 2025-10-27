export const metadata = {
  title: "Design System | YouQuery",
};

export default function DesignSystemPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-[--color-primary-900]">Design Tokens</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Deep Blue", var: "--color-deep-blue" },
            { name: "Electric Blue", var: "--color-electric-blue" },
            { name: "Light Blue", var: "--color-light-blue" },
            { name: "White", var: "--color-white", border: true },
            { name: "Success", var: "--color-success" },
            { name: "Warning", var: "--color-warning" },
            { name: "Error", var: "--color-error" },
            { name: "Info", var: "--color-info" },
          ].map((t) => (
            <div key={t.name} className="space-y-2">
              <div
                className={`h-16 rounded-md shadow-sm ${t.border ? "border" : ""}`}
                style={{ background: `var(${t.var})` }}
                aria-label={`${t.name} swatch`}
                role="img"
              />
              <div className="text-sm text-[--muted]">
                <div>{t.name}</div>
                <code className="font-mono text-xs">{t.var}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Typography</h2>
        <div className="space-y-3">
          <p className="text-lg">Inter is used for UI text.</p>
          <p className="font-mono">Roboto Mono is used for code and data.</p>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">Heading XL</div>
            <div className="text-xl font-semibold">Heading L</div>
            <div className="text-lg font-medium">Heading M</div>
            <div className="text-base">Body base</div>
            <div className="text-sm text-[--muted]">Body small muted</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Components</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="text-sm text-[--muted] mb-2">Card</div>
            <p>Cards use surface, border, radius and shadow tokens.</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-[--muted]">Buttons</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-md text-white bg-[--color-primary-500] hover:opacity-90 transition-colors">Primary</button>
              <button className="px-3 py-1.5 rounded-md border border-[--border] hover:bg-[--color-surface-muted] transition-colors">Secondary</button>
              <button className="px-3 py-1.5 rounded-md text-white bg-[--color-success]">Success</button>
              <button className="px-3 py-1.5 rounded-md text-white bg-[--color-warning]">Warning</button>
              <button className="px-3 py-1.5 rounded-md text-white bg-[--color-error]">Error</button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-[--muted]">Inputs</div>
            <input
              aria-label="Sample input"
              placeholder="Type here..."
              className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Guidelines</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Use the provided CSS variables for colors, spacing, and radius.</li>
          <li>Maintain a consistent 4/8 spacing rhythm using Tailwind utilities and tokens.</li>
          <li>Interactive elements must have visible focus states and meet contrast requirements.</li>
          <li>Prefer semantic HTML and ARIA where needed.</li>
          <li>Respect user motion preferences and ensure responsive layouts from 320px upwards.</li>
        </ul>
      </section>
    </div>
  );
}
