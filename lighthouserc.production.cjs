module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [
        "/",
        "/meters-to-feet",
        "/format-converters",
        "/bulk-converter",
        "/pricing",
      ].map(path => `${process.env.PRODUCTION_SITE_URL || "https://lovexiaoyue.cc.cd"}${path}`),
      settings: { preset: "desktop", chromeFlags: "--no-sandbox" },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.7 }],
        "categories:seo": ["warn", { minScore: 0.85 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./artifacts/production-lighthouse" },
  },
};
