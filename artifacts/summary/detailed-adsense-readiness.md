# Production AdSense readiness audit

Target: https://lovexiaoyue.cc.cd
Generated: 2026-08-17T07:43:49.256Z
Mode: report-only

| Check | Status | Detail |
| --- | --- | --- |
| Home renders Cookie Consent Banner for a fresh context | PASS | banner=true; rejectButtons=1 |
| Fresh visit has no optional Google/analytics request before consent | PASS | none |
| Home does not expose an AdSense placeholder before consent | PASS | DOM text does not contain ad script markers |
| /privacy contains the current legal page | PASS | marker=true; placeholder=false |
| /cookie-policy contains the current legal page | PASS | marker=true; placeholder=false |
| Production readiness browser audit completed | REVIEW | page.goto: Timeout 45000ms exceeded.
Call log:
[2m  - navigating to "https://lovexiaoyue.cc.cd/terms?adsense-readiness=1", waiting until "networkidle"[22m
 |

Result: 1 check(s) need review
