# Production AdSense readiness audit

Target: https://lovexiaoyue.cc.cd
Generated: 2026-08-17T07:15:27.100Z
Mode: report-only

| Check | Status | Detail |
| --- | --- | --- |
| Home renders Cookie Consent Banner for a fresh context | REVIEW | banner=false; rejectButtons=0 |
| Fresh visit has no optional Google/analytics request before consent | PASS | none |
| Home does not expose an AdSense placeholder before consent | PASS | DOM text does not contain ad script markers |
| /privacy contains the current legal page | REVIEW | marker=false; placeholder=true |
| /cookie-policy contains the current legal page | REVIEW | marker=false; placeholder=true |
| /terms contains the current legal page | REVIEW | marker=false; placeholder=true |
| robots.txt is reachable and declares the production sitemap | PASS | status=200 |
| sitemap.xml is reachable and uses the production host | PASS | status=200 |

Result: 4 check(s) need review
