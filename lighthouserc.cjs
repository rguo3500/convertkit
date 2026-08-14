/** Signal Workshop quality gate: keep the instrument fast, readable, and keyboard-auditable. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm dev --host --port 4173',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 1,
      url: ['http://localhost:4173/', 'http://localhost:4173/converters', 'http://localhost:4173/format-converters', 'http://localhost:4173/meters-to-feet', 'http://localhost:4173/bulk-converter', 'http://localhost:4173/pricing'],
      settings: { preset: 'desktop', chromeFlags: '--no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.85 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './artifacts/lighthouse' },
  },
};
