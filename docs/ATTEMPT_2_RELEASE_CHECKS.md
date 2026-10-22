# Attempt 2 — publisher checks

23 October 2026. Complements, rather than replaces, the independent visual audit.

## Local checks

- Build generates home and ten distinct detail documents with self-hosted Vietnamese font subsets.
- 23 automated tests pass. Coverage includes original reference-file hashes, key original inline style values, real catalog content, source paths, output exclusions and honest feedback state.
- Feedback tests render the activated branch for home and every product, asserting a blank home selection and the exact corresponding product in both iframe and new-tab URLs. This uses a test-only URL, not a Google deployment.
- An Apps Script mock checks one form/one private Sheet across repeated runs, the three actual questions, no email collection, no response summary and no response submission while generating the prefilled URL. This is not proof that the script ran in the owner's Google account.
- Local mobile Lighthouse home: performance94, accessibility100, best practices100, SEO100; LCP2.956s, CLS0, TBT0ms.
- Local mobile Lighthouse G09 detail: performance95, accessibility100, best practices100, SEO100; LCP approximately2.9s, CLS0, TBT0ms. Correct route: /san-pham/g09/. An earlier run used an incorrect route and returned404; that failed run is not successful evidence.

## Open activation gate

The user has requested working Google Forms feedback. The owner must run setup/create-feedback-form.gs and return its real formUrl/embedUrl/productEntry. Until then, site.config.json intentionally remains null and the website clearly displays a disabled preview.

After configuration, verify signed-out access, all ten prefilled products, real form submission and stored response. A Google Forms prefill is editable by respondents, not a locked product binding. Neither an iframe load nor local tests prove a response was stored.

## Publication

GitHub Actions deployment and live byte parity are separate release checks. Do not use the previous deployment or the local Lighthouse results as evidence that this version is already public.
