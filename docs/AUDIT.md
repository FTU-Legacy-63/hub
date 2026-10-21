# Independent showcase audit

Audit scope: FTU Legacy K63 showcase, handoff dated 15 October 2026, K62 public showcase, and the user's subsequent choices. This checklist is an audit gate, not a claim that every item already passes.

## Authority and approved differences

- Destination: dedicated `FTU-Legacy-63/hub`, GitHub Pages at `/hub/`.
- Art direction: the supplied HTML canvases and DOCX take precedence over generic taste guidelines. Their blue gradient, glass panels, monospace, numbered product sections, and dark-to-light transition are intentional.
- Feedback: the user superseded the handoff's names/email and GitHub Issues proposal. The user subsequently explicitly approved releasing an honest pending/placeholder state until they create the Google Form. The initial release must not claim to receive or save feedback. Future activation requires a real no-login Google Form, no personal name/email collection, with responses private to its administrators. Do not claim success without a real response path.
- Do not invent product functionality, team members, launch state, survey findings, dates, endorsements, or contact consent. Missing public metadata must be described honestly.

## Handoff requirements and evidence

| Area | Requirement | Evidence needed |
| --- | --- | --- |
| Delivery | Dedicated repo and public GitHub Pages | Remote repo plus live successful Pages deployment and HTTP/render checks |
| Coverage | Every current K63 group product included | Current organization repository inventory reconciled against `products.json` |
| Data | One shared products JSON | Home/detail both consume same source; unique stable IDs and valid categories |
| Sources | Product claims and links grounded | Per-product source register and current README/docs/demo checks |
| Home | Hero, project introduction, catalog, feedback, footer | Rendered desktop and mobile screenshots |
| Hero | Explore anchor and class repository CTA | Real clicks; external links safely open new tabs |
| About | Course, instructor, cohort, program, source block | Verified content; K62 and K63 links; no unapproved instructor email |
| Catalog | All + six categories and counts | Filter counts reconcile; combination with search works |
| Search | Vietnamese accent-insensitive search | Search for accented and unaccented product terms, including đ/d |
| Catalog states | Count, empty state, clear filters | Runtime search yielding zero and reset action |
| Carousel | Previous/next about 80% viewport and scroll snap | Runtime position change and end-state button handling |
| Cards | 16:10 media, category, group, title, description | Visual inspection; no false screenshots |
| Card actions | Correct detail, demo, repository | Every product ID opens distinct correct content; unavailable demo honestly indicated |
| Detail | Shared template by stable product ID | Direct deep link and browser refresh on GitHub Pages |
| Detail hero | Breadcrumb, group/category, value proposition, demo/source, metadata, main image | Content and navigation inspection |
| Detail menu | Six sticky anchors; mobile horizontal scroll | Scroll test; no overflow-hidden ancestor breaking sticky |
| Users | Primary, secondary, context | Three factual blocks per product or explicitly disclosed metadata gap |
| Features | Selection expands description and changes image | Click at least two features; keyboard behavior and image descriptions |
| Benefits | User and organization perspectives | Accurate, readable two-column/one-column layout |
| Rationale | Why product exists and five-step journey | Source-grounded narrative without invented research/results |
| Team | Lead, members, repo, README | Source-verified names/roles; email only when approved/publicly intended |
| Feedback | DEFERRED with explicit user approval | Current initial release clearly says feedback is not yet received/stored; no submit button. Future Form activation needs product context, required stars/content and no-login settings |
| Feedback delivery | DEFERRED with explicit user approval | No fake submission or success message. Real delivery/thank-you/repeat-path testing belongs to future Form activation |
| Feedback privacy | PASS for approved pending state; future backend unverified | No input collection or backend is active. Future Form must disable names/emails/login/one-response restriction and keep response access private |
| Navigation | Detail links return to home anchors | Actual cross-page clicks under `/hub/` base path |
| Art direction | IBM Plex Mono 300/400/500/600 with Vietnamese | Self-hosted font files plus browser computed styles/glyph inspection |
| Colors | #02040A/#03060F, navy #061235/#0A1F66, blues #1F5FE0/#1546C4/#0B2C8F, sky #8EC2F0/#CFE6F8/#F4F9FE | CSS tokens and screenshot comparison with handoff |
| Surfaces | Glass 6–22%, borders35–40%, blur14–18px | CSS and visual inspection; performant mobile fallback |
| Shapes | 28px cards,40px hero,999px controls; standout corner72px | CSS and canvas comparison |
| Layout | max1280px; horizontal clamp16px/4vw/48px | CSS and desktop/mobile bounding boxes |
| Decoration | Real rendered chrome WebP <300KB each | Inspect assets and file sizes; star hidden below760px |
| Accessibility | 44px controls; 4.5:1 text; icon labels | Bounding-box/contrast checks; accessibility tree; visible focus |
| Keyboard | Tab navigation, feature selection, carousel/form | Browser keyboard interaction; no focus traps |
| Responsive | Chrome + Safari engine;390px and desktop | Screenshots and no page horizontal overflow |
| SEO | Per-page title, description, OG image, favicon | Served head and static detail metadata where feasible |
| Cleanup | No placeholder domains/labels, no secrets | Source scan, link audit, repo status |

## Reference observations

K62 at `https://ftu-legacy-62.github.io/hub/` was fetched successfully on 21 October 2026. It contains ten real product entries, screenshot cards, category filters, live-demo/source links, and detail modal sections for users, features, benefits, rationale/story, and named team members. It is an information architecture/usability reference, not the K63 color/type specification. K63 should not inherit K62's green palette or single-modal limitation when the handoff explicitly calls for separate detail pages.

## Verification status

Handoff review, local visual/function checks, public route checks and the accepted feedback deferral are verified below. Earlier work-in-progress observations are retained as history; the final acceptance matrix at the end governs current status. The detail-page layout performance issue was traced and corrected, with the measured results retained below.

### Checks completed on 21 October 2026

- Organization inventory via authenticated read-only GitHub CLI: exactly `G01` through `G10`, plus the course repository and the new hub. All ten group repository homepage fields were empty, so homepage metadata alone cannot establish a deployed demo.
- K62 inspected in WebKit 26.6 and isolated Chrome for Testing 155 (Chromium engine). Desktop screenshot saved outside the new repository at `output/playwright/k62-audit-desktop.png`.
- Chromium QA uses an isolated Playwright cache executable and temporary browser profile. The user's desktop browser and personal profile are not used or modified.
- The current repository snapshot shows stale README stages for some groups. Product selection must consider later documents/source, rather than publishing every original candidate as a current product.
- G08 independently rechecked after an update around 16:06 UTC: main contained the problem/proposal/structure documents, input JSON, and an empty `WEEK_4/D`; no deployed demo or app source was published in the checked tree. Its README identifies **The Last Heir**. The midterm Drive link is a case attachment, not a verified app demo.
- G10 independently scanned across every published Markdown file: no real external demo URL was present. Its Week 6 technical route contains malformed `http://docs/...` links; these must not be treated as deployed products. Its official latest MVP document is `Week 6/OFFICIAL MVP (1C - CAPACITY).md`. Absence of a public demo is a metadata status, not a reason to omit the product.
- Initial `products.json` independently reconciled: ten distinct IDs (`g01` to `g10`); all listed source paths and README paths exist in the collected official repository trees; 49 member entries (G03 publicly lists four). This checks coverage and reference integrity, not every functionality claim.
- Six published demo addresses returned HTTP 200 (G02/G03/G05/G06/G07/G09). G06 required a second check with curl after a Node fetch failure. HTTP status alone does not prove app behavior; rendered demo and showcase checks remain required.

### Initial local runtime audit (Chromium, before final imagery)

- Visited every generated product URL `/san-pham/g01/` through `/san-pham/g10/` at 390px. Every page displayed the correct distinct product name, six section links, three user blocks, three feature buttons, and five journey steps. Every document width was exactly 390px (no page-level horizontal overflow).
- Search `dau tu` matched six relevant entries without requiring Vietnamese accents. A nonexistent keyword produced zero results, a visible empty state, and a hidden product track.
- G09 feature accordion changed `aria-expanded` and the visible description correctly. At this initial stage, all buttons still used the same cover image: feature-specific media remains a release check.
- G09 sticky menu remained at viewport `y=0` after navigation to the journey section. At 390px the menu has 620px of scrollable content, preserving all six links without page overflow.
- G09 links/buttons inspected at 390px had no visible targets below 44px in height after the initial CSS adjustment. Breadcrumb separators needed vertical alignment; this was reported to the implementer.
- Self-hosted IBM Plex Mono CSS includes Vietnamese, Latin extended, and Latin subsets for weights 300/400/500/600. Browser computed font resolves to IBM Plex Mono; visible Vietnamese glyphs inspected in desktop/mobile screenshots.
- Initial screenshots contain missing image assets while asset production is in progress. These are not final release artifacts and do not establish a completed visual gate.

### Media and keyboard follow-up

- All twelve draft-document screenshots (G01/G04/G08/G10 cover and two detail variants) were opened with the image viewer. They show real source documents, not invented product UI, and contain no visible student IDs or personal email addresses. G01's public GitHub author username is visible in its source-page chrome. G04 optional-scope screenshots require a document/limitations caption, not an implemented-feature caption.
- All six deployed-product covers were visually inspected. Improved G07 and G09 captures were subsequently produced from actual application interaction at 1280×800: G07 after starting the local game flow, G09 after running the default hypothetical FPT/HPG/GLD portfolio analysis. No account login, shared data edits, or decision saves were performed.
- G09's live analysis succeeded for the default VND100m hypothetical portfolio. Its account-save availability message is not a showcase feature claim and must not be presented as verified account functionality.
- Keyboard Tab reaches a visible skip link with a 3px outline; Enter transfers focus to `#main`.
- Selecting the empty SME category then pressing Space preserves focus on the newly rendered selected filter. The empty state remains accurate. Clearing filters restores ten products, removes the category query parameter, and returns focus to the search input.
- Carousel next-click followed by keyboard Enter advances two snapped cards on 390px (662px combined scroll for a 358px track), retains focus on Next, and enables Previous. Source implements the specified 80%-of-track move before snap.
- The actual chrome decoration WebP was inspected: a rendered chrome star and torus, transparent background, 139,792 bytes, below the 300KB handoff limit.
- G08 published additional Week 4/5/6 documentation during this audit. A second complete scan found no public app-distribution URL. Its new official guide documents a five-chapter integrated game and explicitly says the 120MB HTML is not included in the documentation package. Any previous observation of an almost-empty Week 4 directory is a timestamped earlier snapshot, not the final inventory. Later documents should be cited for the updated five-chapter/NST-01/governance-decision scope.

### Historical release gates (see final evidence below)

- Final imagery/media: subsequently verified loaded and visually inspected.
- Feature-specific image changes: subsequently verified for all ten products.
- Google Form activation: deferred with explicit user approval; honest pending UI verified.
- Final browsers and public routing: subsequently verified. Performance exception/retest is recorded in the final matrix.

### Final local browser verification

- Chrome-engine desktop (1440×900), Chrome-engine mobile (390×844), WebKit desktop (1440×900), and WebKit mobile (390×844) screenshots were captured and opened with the image viewer. The final home/detail typography renders Vietnamese accents cleanly. Mobile decoration is hidden and the about cards collapse to one column as required.
- Every product's three feature buttons was clicked in the browser. All ten products displayed three distinct media URLs; all thirty image assets decoded with nonzero dimensions. WebKit separately verified G09's second feature changes both the expanded panel and image to `g09-f2.webp`.
- Final WebKit mobile home inspection returned document width390 for viewport390, no broken loaded images, and IBM Plex Mono as computed typeface. The G09 detail sticky menu remained at viewport y0.
- Feedback is now the user-approved deferred state: visible text says feedback will open later and that nothing is received or stored; no submit button is rendered. This passes the accepted initial-release scope but is not evidence of a working collection backend.
- Previously reported breadcrumb alignment, touching team buttons, and two-column mobile about layout were corrected in CSS. Source links and card-title links were also given minimum44px target height.
- Independent visual artifacts are in ignored `output/playwright/audit-final-*.png`. They are QA evidence, not published site assets.

## Final acceptance matrix

| Requirement group | Result | Actual evidence |
| --- | --- | --- |
| Dedicated repository and Pages | PASS | Public `FTU-Legacy-63/hub`; workflow 39635737137 independently read as completed/success; public site and detail URLs return 200. Later release 516e02a and its 67-file byte-parity check were verified by the publisher. The final CSS/report commit still requires the same publisher release gate. |
| All current group products | PASS | Organization inventory reconciles exactly G01-G10. Ten unique products, 49 members, six published-demo links; four products without a verified public demo remain visible as honest source/document entries. |
| Source-grounded content | PASS within public evidence | All cited paths exist. Stale G01 Deal/Offer text was replaced with invest/reject wording. Newly published G08 Week 6 documentation was incorporated without claiming an available 120MB game download or completed browser testing. |
| Home architecture and navigation | PASS | Hero, introduction, catalog, deferred-feedback section and footer rendered in both engines. Explore and class-source links are real. Detail-to-home Sản phẩm navigation lands at `/hub/index.html#san-pham`. |
| Catalog categories and search | PASS | Seven chips, reconciled counts; accent-insensitive `dau tu` returns 6 products. SME with 0 entries and nonexistent keywords show the empty state; reset restores 10 and focuses search. Both local and public search checked. |
| Carousel and keyboard | PASS | 80%-width scroll implementation plus snap; two activations move 662px on a 358px mobile track, preserve Next focus and enable Previous. Keyboard Space retains selected-category focus. Skip link is visible and Enter focuses main. |
| Shared data and detail routing | PASS | Both templates consume products.json. All ten public deep URLs rendered correct distinct names; all returned 200 with script/CSS under `/hub/`. G10 browser reload succeeds. |
| Detail content and interactions | PASS | Every detail has six anchors, three user blocks, three feature panels and five journey steps, plus benefits/team/source links. All 30 feature choices decoded distinct valid images; WebKit separately confirmed G09 image/expanded-state change. |
| Sticky/mobile menus | PASS | Sticky detail menu at y=0 after section navigation; horizontal menu content 620px within a 390px viewport, without page overflow. |
| Invalid product and fetch failure | PASS | Public `product.html?id=not-real` shows not-found and returns to the 10-card catalog. A browser-only mock abort of products.json shows an alert; removing the mock and clicking Reload recovers 10 cards. This was a simulated failure test, not an actual production outage. |
| Typography and art direction | PASS | Self-hosted IBM Plex Mono weights 300/400/500/600 have Vietnamese/Latin-ext/Latin subsets. Four desktop/mobile-engine screenshots viewed; Vietnamese accents, blue gradients, glass surfaces and prescribed radii retained. |
| Images and privacy | PASS | All 30 source/live screenshots reviewed. No student-ID tables or personal email in final images; G02 author-ID handle removed by a fresh source capture. G05 blank-top capture replaced. Draft/document captions do not impersonate live UI. |
| Chrome decoration | PASS | Actual transparent chrome-star/torus WebP, 139,792 bytes; hidden below 760px. Not the temporary SVG. |
| Responsive/accessibility | PASS for checked scope | Chrome and WebKit at 1440×900 and 390×844 visually inspected; all ten mobile detail document widths are 390px. Mobile about cards are one column. Visible focus and 44px targets checked; automated accessibility 100 on home/detail. This is not a claim of exhaustive assistive-technology certification. |
| Feedback initial release | DEFERRED by explicit user approval | Render says feedback will open later and nothing is received/stored; zero submit buttons. No fake success. No account, personal name or email is collected. Future Google Form setup/delivery testing remains intentionally outside this release. |
| SEO and served assets | PASS | Static per-product titles/descriptions/canonicals, OG image, favicon, sitemap/robots. Independent public fetches returned 200 for 51 resources: 30 media assets, 12 font subsets and 9 code/config/branding assets. |
| Build and release parity | PASS for verified release; repeat on final CSS commit | Publisher reports 14 unit/build tests passing. Its live verifier recovered from 8 initial transport failures and then matched all 67 published files byte-for-byte with dist; there was no persistent hash mismatch. |
| Home performance | MEASURED, residual target noted | Inspected `lighthouse-home-v3.json`: performance 93, accessibility 100, best-practices 100, SEO 100; CLS 0, TBT 46ms, LCP 3094.8ms under local mobile throttling. LCP remains above the 2.5s target. |
| Detail performance fix | VERIFIED locally | Inspected `lighthouse-detail-wrap.json`: performance 97 and other categories 100; CLS 0, TBT 0ms, LCP 2564.5ms. Natural wrapping on detail headings fixes expensive balancing while retaining the hero design. A fresh 390px G09 screenshot was viewed; no layout/diacritic regression. LCP is still slightly above 2.5s. |

### Performance diagnosis and limits

The poor earlier detail result is not hidden: `lighthouse-detail-v2.json` measured performance 42 and TBT 16,785.5ms. Its trace's largest main-frame UpdateLayoutTree processed 42 elements in 1,505.855ms wall/990.048ms CPU. After scoping detail headings to natural wrapping, the corresponding largest update measured 47.435ms wall/17.883ms CPU. These are trace measurements, not an assumption that host load caused the problem.

Lighthouse figures above are local laboratory/mobile-throttling results, not production field INP or a real-user Core Web Vitals claim. Public WebKit inspection observed five unused-preload warnings on a cold load but no JavaScript errors; rendered content/fonts/assets subsequently loaded. One first deep-link navigation exceeded the browser's 30-second load-event wait; subsequent inspection showed a complete, correct page, and the full ten-route audit succeeded using DOM-content and actual-render readiness checks.

### Release conclusion

The independent functionality, content and visual audit passes the accepted initial-release scope. Public Pages routing and served assets are verified, not merely inferred from a local build. Deferred feedback is an approved scope decision, not a working backend. The publisher must repeat deployment-success and 67-file parity checks for the final detail-wrapping CSS commit; no remaining functional defect was identified by this audit. The measured LCP residuals above remain documented improvement opportunities, not concealed perfect scores.
