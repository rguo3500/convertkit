# Production AdSense readiness audit

Target: https://lovexiaoyue.cc.cd
Generated: 2026-08-17T10:09:51.798Z
Mode: report-only

| Check | Status | Detail |
| --- | --- | --- |
| Home renders Cookie Consent Banner for a fresh context | PASS | banner=true; rejectButtons=1 |
| Fresh visit has no optional Google/analytics request before consent | PASS | none |
| Home does not expose an AdSense placeholder before consent | PASS | DOM text does not contain ad script markers |
| /privacy contains the current legal page and operator record | PASS | marker=true; placeholder=false; operator=true |
| /cookie-policy contains the current legal page and operator record | PASS | marker=true; placeholder=false; operator=true |
| /terms contains the current legal page and operator record | PASS | marker=true; placeholder=false; operator=true |
| Contact page contains real support and operator information | PASS | placeholder=false; operator=true |
| robots.txt is reachable and declares the production sitemap | PASS | status=200 |
| sitemap.xml is reachable and uses the production host | PASS | status=200 |

Result: all checks passed
