# Attempt 2 — independent fidelity audit

Audit date: 22 October 2026. This report applies to the local Attempt 2 build, not the earlier published design. Production publication/parity is a separate publisher gate.

## Authoritative reference and method

- Supplied ZIP: `ftu-legacy-k63-web1.zip`, extracted under `.reference/attempt-2/ftu-legacy-k63-web/`.
- Read the supplied README, tokens, complete home and product HTML, and home interaction script. These are design reference data, not authority to submit forms or publish personal information.
- Compared the unchanged reference on port 8182 with the implementation on port 8180 in isolated Chromium at 1440 × 900 and 390 × 844. Independently opened the implementation in WebKit at 390 × 844.
- Captured and visually inspected full-page reference/implementation screenshots at both widths. Full-page captures can show gradient placeholders for offscreen lazy-loaded product photos; the publisher separately captured the scrolled, loaded catalog. This is not evidence of broken image delivery.

## Fidelity results

| Element | Reference | Implementation | Result |
| --- | --- | --- | --- |
| Desktop hero height | 1146 px, content-expanded beyond 860 px minimum | 1146 px | Match |
| Desktop hero H1 rectangle | x189, y275.1875, width598, height399.53125 | Same | Match |
| Desktop H1 type | IBM Plex Mono, 74 px / 79.92 px | Same | Match |
| Desktop carousel card | x128, width362 px including border | Same | Match |
| Mobile H1 rectangle | x45, y345.1875, width300, height205.15625 | x45, y347.1875, width300, height205.15625 | Same line wrapping and size; 2 px vertical offset, non-blocking |
| Mobile carousel card | x16, width274 px including border | Same | Match |
| Mobile page overflow | scrollWidth390 at viewport390 | Same in Chromium and WebKit | Pass |
| Decorative assets | Wireframe globe, chrome star, separate glass rings; star hidden on mobile | Original compositions retained | Visually verified |
| About/catalog/feedback composition | Four glass about cards; small horizontal cards with partial fourth at desktop; split feedback | Retained | Visually verified |

Not claiming pixel-identical complete page height. At 1440 px, reference section heights were About960/Catalog1058/Feedback998 px; implementation982/1103/965 px. At390 px, reference About2095/Catalog1315/Feedback1823 px; implementation2123/1438/1692 px. Real project descriptions, category labels and privacy changes alter content wrapping and height without changing the reference's spacing system. The hero retains the deliberately narrow, tall left panel; no old statistics strip or wide-card redesign remains.

Reference constants checked against source: container1280; gutter clamp16/4vw/48; hero panel max720/padding clamp28/4.4vw/60/radius40; H1 weight400/clamp38/5.4vw/74/line1.08; about padding150/130 and gap56; catalog card flex-basis clamp272/28vw/360 and gap24; feedback padding150/130 with two-column auto-fit grid. Supplied SVGs must not be replaced by approximate generated artwork. Publisher reports byte-exact manifest verification of all30 supplied source/token/SVG files; that test result is publisher evidence, not a separate manual hash audit here.

## Functional and privacy evidence

| Check | Evidence | Status |
| --- | --- | --- |
| Ten real project detail documents | Browser fetch/DOM parse: g01–g10 all HTTP200, correct distinct H1, seven sections including hero, three feature controls each | Pass for generated documents; not ten separate interactive browser journeys |
| Detail privacy | All ten documents contained zero email inputs or mailto links | Pass for those selectors; not a blanket anonymity guarantee |
| G09 actual deep navigation | Chromium navigated directly to `/san-pham/g09/`; title Finfolio2.0, real demo/repo links, six section navigation links | Pass |
| Feature dialog | Clicked first G09 feature; dialog opened, captioned image completed loading, focus moved to close button | Pass |
| Escape and focus return | Pressed Escape; dialog closed and active element returned to feature0 | Pass |
| WebKit home | Ten cards, IBM Plex Mono font available,390px viewport/390px document width; no console errors | Pass |
| Search | WebKit entered `finfolio`; URL became `?q=finfolio`, count1, sole card Finfolio2.0 | Pass; publisher tests cover broader filter/reset cases |
| Feedback state in audited build | Disabled rating/text/submit controls, explicit “Biểu mẫu sắp mở / Chưa nhận hoặc lưu phản hồi”, no name/email | Honest placeholder, not working submission |

One WebKit warning observed: `products.json` preload was not consumed within a few seconds. No accompanying console error or failure to render ten cards. Reference Chromium had a resource console error on initial opening; do not attribute it to the implementation.

## Necessary, intentional deviations

1. Replace the reference's twelve dummy projects with the ten actual groups and current verified content. Four groups without verified public demo links show documentation rather than invented runtime functionality.
2. Replace sample lecturer/course/member data using verified information. Do not publish personal email or student IDs merely because a source document contains them.
3. Use real project screenshots and captioned feature images rather than placeholder icon panels. Three evidenced features replace four dummy reference features.
4. Remove name/email collection and fake console-only submission/success behavior from the reference prototype. Earlier user approval allowed a pending preview; **the latest user request now asks to enable real feedback, so that new requirement remains open**. The audited build must not be described as receiving feedback. Account/Google Form selection and genuine end-to-end submission require a separate implementation and re-test.

## Performance and remaining gates

- Read local `attempt2-lighthouse-home-v3.json`: performance94, accessibility100, best practices100, SEO100; CLS0, TBT0 ms, LCP2956 ms. These are local lab measurements, not field INP or a guarantee for all devices. LCP remains above the2.5 s target.
- `attempt2-lighthouse-detail.json` had null category scores when inspected; no successful detail performance claim is made in this report.
- Publisher reports20/20 automated tests and zero npm vulnerabilities for the latest build. This independent audit did not rerun that suite.
- No blocking visual-fidelity issue found in the bounded home/detail checks. The2px mobile header/H1 offset is a minor residual, not grounds for changing the supplied composition.
- Real feedback activation is pending the user's latest request. Production deployment, live base-path validation and final byte parity are publisher-owned gates and not asserted here.

Screenshots: `output/playwright/attempt2-reference-1440.png`, `attempt2-implementation-1440.png`, `attempt2-reference-390.png`, `attempt2-implementation-390.png`.
