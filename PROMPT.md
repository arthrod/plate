## Daily pruning prompt

Follow `general_daily_pruning.md` as the canonical pruning policy.

If you are operating in a Ralph loop or multi-iteration mode, also follow
`general_daily_pruning_ralph.md` for execution style and loop discipline.

## Default discovery rule

Use the default discovery window from `general_daily_pruning.md`:

- AI-authored or AI-generated PRs
- created or updated in the last **48 hours**

## Allowed prompt override for pruning volume

This prompt may override the 48-hour discovery rule.

If this file or the user explicitly specifies a different discovery window,
use that override for PR discovery **instead of** the default 48-hour rule.

Examples of valid overrides:

- last 7 days
- last 30 days
- all open AI-authored PRs
- all open AI-authored PRs except already-processed ones

If no override is explicitly given, keep the default 48-hour rule.

### Current discovery-window override

- none

## Folder scope

By default, apply pruning to **all folders** covered by this pruning setup.

If this file or the user explicitly narrows folder scope, follow that scope exactly.

Examples of valid folder-scope overrides:

- only `plate`
- only `1-sama-3` and `plate`
- all folders except `plate`

### Current folder-scope override

- all folders

## Non-negotiable rules

- Still follow all other rules from `general_daily_pruning.md`.
- Inspect review feedback and the changed files before merging.
- Run the smallest feasible validation that gives a meaningful signal.
- Preserve design explorations to `devdesign` before merging when applicable.
- If the current repository is `plate`, DO NOT PUSH TO THE ORIGINAL PLATE REPOSITORY. ONLY PUSH TO THE INTENDED FORK.

## Completion

When the qualifying queue is empty, output `PRUNING_COMPLETE`.
<!-- SPECIAL_SCOPE_OVERRIDE_START -->
## TEMPORARY PRUNING OVERRIDE

PROCESS ONLY THE FOLLOWING UNMERGED AI-AUTHORED PRS.
DO NOT RE-DISCOVER PRS BY TIME WINDOW. USE THIS EXPLICIT LIST ONLY.
SKIP ANY PR ALREADY LISTED IN PRUNING_STATE.md.

| Repo | PR | Title | Author | Size |
|------|-----|-------|--------|------|
| 1-cicero-blog | #2 | Implement buttons and i18n | app/google-labs-jules | +49/-18 (4 files) |
| 1-cicero-blog | #10 | ⚡ Bolt: Enable SSG for blog pages | app/google-labs-jules | +14/-7 (5 files) |
| 1-cicero-blog | #15 | 🎨 Palette: Add Skip to Content Link | app/google-labs-jules | +49/-1 (4 files) |
| 1-cicero-blog | #67 | chore(deps): update dependency eslint to v10 | app/renovate | +40/-28 (2 files) |
| 1-cicero-blog | #68 | 🎨 Palette: [UX improvement] Fix dead-end post 404 state | app/google-labs-jules | +24/-4 (3 files) |
| 1-cicero-blog | #69 | ⚡ Bolt: [performance improvement] Cache expensive Markdoc parsing | app/google-labs-jules | +35/-8 (3 files) |
| 1-cicero-blog | #70 | 🛡️ Sentinel: [HIGH] Remove 'unsafe-eval' from CSP | app/google-labs-jules | +9/-1 (3 files) |
| 1-cicero-marketing-page | #169 | Cicero Template Design Exploration | app/google-labs-jules | +753/-17 (7 files) |
| 1-cicero-marketing-page | #170 | feat: Cicero Blog Design Exploration - Article Page | app/google-labs-jules | +843/-17 (6 files) |
| 1-cicero-marketing-page | #171 | Design Cicero Template Editor Artifact | app/google-labs-jules | +725/-18 (7 files) |
| 1-cicero-marketing-page | #172 | sidebar: style-03 dark-panel design iteration | app/google-labs-jules | +761/-22 (5 files) |
| 1-cicero-marketing-page | #173 | Cicero Auth Page Design Exploration | app/google-labs-jules | +220/-4 (4 files) |
| 1-cicero-marketing-page | #174 | Sidebar Style 1: Tight Monochrome | app/google-labs-jules | +605/-0 (3 files) |
| 1-cicero-marketing-page | #176 | ⚡ Bolt: Optimize static data in Review and Features pages | app/google-labs-jules | +288/-288 (2 files) |
| 1-cicero-marketing-page | #177 | feat: Add Cicero Chat Onboarding design artifact | app/google-labs-jules | +728/-3 (4 files) |
| 1-cicero-marketing-page | #178 | 🎨 Palette: Add Skip to Content link | app/google-labs-jules | +10872/-9326 (8 files) |
| 1-cicero-marketing-page | #179 | Add Dashboard Overview artifact and desktop screenshot script | app/google-labs-jules | +711/-0 (4 files) |
| 1-cicero-marketing-page | #180 | Add Cicero Workspace Design Artifact | app/google-labs-jules | +752/-1 (5 files) |
| 1-cicero-marketing-page | #181 | 🎨 Palette: Add focus indicators for keyboard accessibility | app/google-labs-jules | +16/-16 (5 files) |
| 1-cicero-marketing-page | #182 | 🛡️ Sentinel: [MEDIUM] Add security headers to Cloudflare Worker | app/google-labs-jules | +35/-5 (1 files) |
| 1-cicero-marketing-page | #184 | feat: Add Cicero Newsletter Design Exploration | app/google-labs-jules | +844/-337 (7 files) |
| 1-cicero-marketing-page | #185 | Cicero Template System Design Artifact | app/google-labs-jules | +741/-4 (6 files) |
| 1-cicero-marketing-page | #186 | Cicero Blog Design: Article Page | app/google-labs-jules | +811/-17 (6 files) |
| 1-cicero-marketing-page | #187 | Design Cicero Template Editor | app/google-labs-jules | +697/-20 (5 files) |
| 1-cicero-marketing-page | #188 | feat: Implement split-screen auth page design | app/google-labs-jules | +402/-0 (3 files) |
| 1-cicero-marketing-page | #189 | sidebar: style-03 dark-panel | app/google-labs-jules | +483/-6 (4 files) |
| 1-cicero-marketing-page | #190 | ⚡ Bolt: Implement Route-based Code Splitting | app/google-labs-jules | +80/-14 (4 files) |
| 1-cicero-marketing-page | #191 | Sidebar Design Iteration: Style 03 (Dark Panel) | app/google-labs-jules | +432/-14 (3 files) |
| 1-cicero-marketing-page | #192 | Add Cicero Intern Chat Onboarding Artifact | app/google-labs-jules | +777/-10 (5 files) |
| 1-cicero-marketing-page | #193 | Palette: Enhance BurgerMenu accessibility and focus states | app/google-labs-jules | +3/-2 (1 files) |
| 1-cicero-marketing-page | #194 | 🎨 Palette: Enhance Burger Menu keyboard accessibility | app/google-labs-jules | +2/-2 (1 files) |
| 1-cicero-marketing-page | #195 | Add Comparison Diff View Artifact | app/google-labs-jules | +525/-4 (4 files) |
| 1-cicero-marketing-page | #196 | Design: Dashboard Overview Artifact | app/google-labs-jules | +561/-5 (4 files) |
| 1-cicero-marketing-page | #197 | 🎨 Palette: Improve Burger Menu Keyboard Accessibility | app/google-labs-jules | +6/-2 (2 files) |
| 1-cicero-marketing-page | #198 | ⚡ Bolt: Implement Code Splitting for Secondary Pages | app/google-labs-jules | +10932/-9331 (7 files) |
| 1-cicero-marketing-page | #199 | 🛡️ Sentinel: Add security headers to Cloudflare Worker | app/google-labs-jules | +35/-5 (2 files) |
| 1-cicero-marketing-page | #200 | Design Cicero Newsletter Issue 001 | app/google-labs-jules | +419/-334 (5 files) |
| 1-cicero-marketing-page | #201 | feat: Add Teardown Blog Article Design | app/google-labs-jules | +906/-17 (7 files) |
| 1-cicero-marketing-page | #202 | Cicero Template Editor Design Prototype | app/google-labs-jules | +873/-17 (7 files) |
| 1-cicero-marketing-page | #203 | Implement Cicero Template Editor Design | app/google-labs-jules | +406/-0 (5 files) |
| 1-cicero-marketing-page | #204 | ⚡ Bolt: Implement Code Splitting for Secondary Pages | app/google-labs-jules | +129/-16 (5 files) |
| 1-cicero-marketing-page | #205 | Design: Chat Onboarding (Option B) | app/google-labs-jules | +675/-0 (4 files) |
| 1-cicero-marketing-page | #206 | Cicero Auth Page Design: Split-Screen Sign In | app/google-labs-jules | +446/-22 (5 files) |
| 1-cicero-marketing-page | #207 | Sidebar Design Iteration - Style 3: Dark Panel | app/google-labs-jules | +586/-22 (5 files) |
| 1-cicero-marketing-page | #208 | 🎨 Palette: Enhance Burger Menu keyboard accessibility | app/google-labs-jules | +6/-2 (2 files) |
| 1-cicero-marketing-page | #209 | sidebar: style-01 tight-monochrome | app/google-labs-jules | +483/-0 (3 files) |
| 1-cicero-marketing-page | #210 | 🎨 Palette: Improve Burger Menu Keyboard Accessibility | app/google-labs-jules | +45/-2 (4 files) |
| 1-cicero-marketing-page | #211 | Design: Batch Analysis Queue scene | app/google-labs-jules | +844/-0 (3 files) |
| 1-cicero-marketing-page | #212 | Add Matter Dashboard Design Artifact | app/google-labs-jules | +661/-1 (4 files) |
| 1-cicero-marketing-page | #213 | 🛡️ Sentinel: Add security headers to worker | app/google-labs-jules | +24/-4 (1 files) |
| 1-cicero-marketing-page | #214 | ⚡ Bolt: Consolidate BurgerMenu focus management hooks | app/google-labs-jules | +87/-60 (4 files) |
| 1-cicero-marketing-page | #216 | Cicero Newsletter Template System | app/google-labs-jules | +731/-8 (6 files) |
| 1-cicero-marketing-page | #217 | Design Cicero Template Editor | app/google-labs-jules | +771/-22 (7 files) |
| 1-cicero-marketing-page | #218 | Add Template Editor Design Artifact | app/google-labs-jules | +917/-18 (7 files) |
| 1-cicero-marketing-page | #219 | feat(blog): design exploration for Cicero blog article page | app/google-labs-jules | +854/-3 (10 files) |
| 1-cicero-marketing-page | #221 | Sidebar Design Iteration: Style 3 (Dark Panel) | app/google-labs-jules | +878/-22 (5 files) |
| 1-cicero-marketing-page | #222 | Cicero Auth Page Design Artifact | app/google-labs-jules | +608/-1 (4 files) |
| 1-cicero-marketing-page | #223 | Sidebar Design: Style 1 - Tight Monochrome | app/google-labs-jules | +721/-1 (4 files) |
| 1-cicero-marketing-page | #224 | Add Chat Onboarding Design Artifact | app/google-labs-jules | +806/-0 (5 files) |
| 1-cicero-marketing-page | #227 | feat: Cicero Document Analysis Workspace Design | app/google-labs-jules | +795/-1 (5 files) |
| 1-cicero-marketing-page | #228 | Add Cicero Matter Dashboard Artifact | app/google-labs-jules | +718/-1 (4 files) |
| 1-cicero-marketing-page | #229 | 🛡️ Sentinel: [HIGH] Add security headers to Cloudflare Worker | app/google-labs-jules | +27/-4 (1 files) |
| 1-cicero-marketing-page | #232 | Design Newsletter Digest Format | app/google-labs-jules | +556/-28 (9 files) |
| 1-cicero-marketing-page | #233 | feat(design): implement blog article page layout and typography | app/google-labs-jules | +6420/-42 (21 files) |
| 1-cicero-marketing-page | #234 | Design: Cicero Template Editor and Variable UI | app/google-labs-jules | +5526/-0 (6 files) |
| 1-cicero-marketing-page | #235 | Add Template Editor design and brand rules exploration | app/google-labs-jules | +6358/-37 (9 files) |
| 1-cicero-marketing-page | #236 | feat: add chat onboarding design exploration | app/google-labs-jules | +17537/-9335 (18 files) |
| 1-cicero-marketing-page | #237 | Feat: Cicero Auth Split-Screen Sign In Design | app/google-labs-jules | +6363/-20 (5 files) |
| 1-cicero-marketing-page | #238 | 🎨 Palette: Add keyboard focus rings & navigation tooltips | app/google-labs-jules | +34/-26 (4 files) |
| 1-cicero-marketing-page | #239 | sidebar: style-02 warm-paper — elegant serif table of contents, high density feels natural, but lacks visual boundary for quick scanning | app/google-labs-jules | +6727/-20 (5 files) |
| 1-cicero-marketing-page | #240 | ⚡ Bolt: Optimize Header.tsx scroll performance | app/google-labs-jules | +10891/-9328 (6 files) |
| 1-cicero-marketing-page | #241 | sidebar: style-04 card-nesting | app/google-labs-jules | +11330/-9317 (10 files) |
| 1-cicero-marketing-page | #242 | 🎨 Palette: [Add Tooltips to Dot Navigation] | app/google-labs-jules | +33/-23 (3 files) |
| 1-cicero-marketing-page | #243 | feat: Add Comparison Diff View (Scene 10) Artifact | app/google-labs-jules | +613/-7 (5 files) |
| 1-cicero-marketing-page | #244 | feat: Pricing section design exploration artifact | app/google-labs-jules | +692/-1 (5 files) |
| 1-cicero-marketing-page | #245 | ⚡ Bolt: Optimize Header scroll performance by removing layout thrashing | app/google-labs-jules | +10899/-9332 (7 files) |
| 1-cicero-marketing-page | #246 | 🛡️ Sentinel: [MEDIUM] Add missing security headers in Cloudflare Worker | app/google-labs-jules | +35/-19 (3 files) |
| 1-cicero-marketing-page | #247 | 🎨 Palette: Add aria-hidden to decorative SVGs | app/google-labs-jules | +7/-3 (2 files) |
| 1-cicero-marketing-page | #248 | feat(newsletter): add digest format newsletter design | app/google-labs-jules | +328/-5 (5 files) |
| 1-cicero-marketing-page | #249 | feat: implement template editor and variable formatting design | app/google-labs-jules | +713/-20 (5 files) |
| 1-cicero-marketing-page | #250 | feat(blog): initial article page design exploration | app/google-labs-jules | +984/-452 (20 files) |
| 1-cicero-marketing-page | #251 | Add template editor design exploration | app/google-labs-jules | +11588/-9319 (10 files) |
| 1-cicero-marketing-page | #252 | Add Chat Onboarding exploration for Cicero | app/google-labs-jules | +6708/-64 (11 files) |
| 1-cicero-marketing-page | #253 | Auth Page Design Exploration (Split-Screen) | app/google-labs-jules | +6273/-51 (9 files) |
| 1-cicero-marketing-page | #254 | sidebar: style-05 left-border-accent | app/google-labs-jules | +740/-0 (3 files) |
| 1-cicero-marketing-page | #255 | feat(sidebar): Implement Style 5 Left-Border Accent | app/google-labs-jules | +5302/-0 (4 files) |
| 1-cicero-marketing-page | #256 | ⚡ Bolt: optimize header scroll event | app/google-labs-jules | +10891/-9329 (8 files) |
| 1-cicero-marketing-page | #257 | Configure Renovate | app/renovate | +6/-0 (1 files) |
| 1-cicero-marketing-page | #260 | 🎨 Palette: Add tooltips to Dot Navigation | app/google-labs-jules | +11166/-9650 (13 files) |
| 1-cicero-marketing-page | #261 | feat: create high-fidelity cicero editor workspace design artifact | app/google-labs-jules | +739/-111 (6 files) |
| 1-cicero-marketing-page | #263 | 🎨 Palette: Improve Language Selector search accessibility | app/google-labs-jules | +16/-9 (3 files) |
| 1-cicero-marketing-page | #264 | ⚡ Bolt: Optimize Header scroll performance | app/google-labs-jules | +43/-13 (3 files) |
| 1-cicero-marketing-page | #266 | feat: Cicero newsletter digest exploration | app/google-labs-jules | +6493/-479 (23 files) |
| 1-cicero-marketing-page | #267 | feat: Cicero Blog Design Exploration - Article Page | app/google-labs-jules | +6697/-364 (21 files) |
| 1-cicero-marketing-page | #268 | Design Template Editor Fill Mode & Extract Brand Rules | app/google-labs-jules | +6922/-457 (27 files) |
| 1-cicero-marketing-page | #269 | feat: Add Style 1 Tight Monochrome sidebar design | app/google-labs-jules | +6825/-354 (18 files) |
| 1-cicero-marketing-page | #272 | 🎨 Palette: Add explicitly associated label to LanguageSelector search input | app/google-labs-jules | +13/-6 (4 files) |
| 1-cicero-marketing-page | #281 | feat(blog): implement article page design and screenshot generation | app/google-labs-jules | +715/-199 (7 files) |
| 1-cicero-marketing-page | #282 | feat: Cicero Template Editor / Fill Mode Exploration | app/google-labs-jules | +617/-16 (6 files) |
| 1-cicero-marketing-page | #283 | feat(onboarding): add First Email Coach onboarding pattern | app/google-labs-jules | +734/-7 (5 files) |
| 1-cicero-marketing-page | #284 | ⚡ Bolt: Optimize relative luminance calculation | app/google-labs-jules | +100/-332 (5 files) |
| 1-cicero-marketing-page | #285 | Add full-page immersive auth page mockup | app/google-labs-jules | +311/-0 (3 files) |
| 1-cicero-marketing-page | #286 | Add Sidebar Style 2: Warm Paper | app/google-labs-jules | +929/-0 (4 files) |
| 1-cicero-marketing-page | #290 | feat: design citation engine feature deep-dive | app/google-labs-jules | +529/-0 (4 files) |
| 1-cicero-marketing-page | #293 | ⚡ Bolt: Optimize relativeLuminance calculation | app/google-labs-jules | +111/-340 (5 files) |
| 1-cicero-marketing-page | #294 | feat: implement newsletter web archive view | app/google-labs-jules | +805/-2 (5 files) |
| 1-cicero-marketing-page | #295 | Add template preview design exploration | app/google-labs-jules | +672/-6 (5 files) |
| 1-cicero-marketing-page | #297 | Implement Cicero Blog Article Page Design | app/google-labs-jules | +564/-6 (5 files) |
| 1-cicero-marketing-page | #298 | Add Card Nesting sidebar design style | app/google-labs-jules | +741/-0 (3 files) |
| 1-cicero-marketing-page | #299 | ⚡ Bolt: Unroll relativeLuminance calculations to prevent GC churn | app/google-labs-jules | +104/-90 (2 files) |
| 1-cicero-marketing-page | #301 | feat: Add Full-Page Immersive authentication design | app/google-labs-jules | +290/-0 (3 files) |
| 1-cicero-marketing-page | #302 | sidebar: implement style 05 left-border accent | app/google-labs-jules | +610/-1 (4 files) |
| 1-cicero-marketing-page | #303 | 🎨 Palette: Improve keyboard focus styles in footer | app/google-labs-jules | +17/-14 (1 files) |
| 1-cicero-marketing-page | #304 | feat(artifacts): Implement Entity Inspector workspace scene | app/google-labs-jules | +815/-19 (6 files) |
| 1-cicero-marketing-page | #305 | Add Text Editor Workspace Artifact | app/google-labs-jules | +586/-19 (5 files) |
| 1-cicero-marketing-page | #306 | 🎨 Palette: Add keyboard focus states to footer links | app/google-labs-jules | +22/-38 (1 files) |
| 1-cicero-marketing-page | #307 | ⚡ Bolt: Replace scroll listener with IntersectionObserver in Header | app/google-labs-jules | +70/-35 (2 files) |
| 1-cicero-marketing-page | #308 | 🛡️ Sentinel: [MEDIUM] Enhance Content-Security-Policy headers | app/google-labs-jules | +42/-47 (2 files) |
| 1-cicero-marketing-page | #309 | feat: newsletter web archive design | app/google-labs-jules | +623/-22 (6 files) |
| 1-cicero-marketing-page | #310 | Blog Article Page Design Exploration | app/google-labs-jules | +641/-22 (6 files) |
| 1-cicero-marketing-page | #311 | feat: Cicero Template Gallery and Preview Design Exploration | app/google-labs-jules | +759/-22 (6 files) |
| 1-cicero-marketing-page | #312 | feat: Template Gallery Landing Page & Variable Design Exploration | app/google-labs-jules | +820/-22 (6 files) |
| 1-cicero-marketing-page | #313 | Create Chat Onboarding Design | app/google-labs-jules | +396/-648 (6 files) |
| 1-cicero-marketing-page | #314 | Add Full-Page Immersive Auth Page Mockup | app/google-labs-jules | +309/-24 (6 files) |
| 1-cicero-marketing-page | #315 | sidebar: implement style-01 tight-monochrome | app/google-labs-jules | +722/-22 (5 files) |
| 1-cicero-marketing-page | #316 | Implement Style 01 (Tight Monochrome) for Workspace Sidebar | app/google-labs-jules | +647/-22 (5 files) |
| 1-cicero-marketing-page | #317 | 🎨 Palette: Add focus visible states for keyboard navigation | app/google-labs-jules | +21/-18 (2 files) |
| 1-cicero-marketing-page | #318 | feat: implement Research Integration design artifact | app/google-labs-jules | +530/-22 (6 files) |
| 1-cicero-marketing-page | #319 | feat: Add Settings and Workspace Configuration design artifact | app/google-labs-jules | +736/-0 (7 files) |
| 1-cicero-marketing-page | #320 | 🎨 Palette: Add Tooltips & Improve Accessibility for Dot Navigation | app/google-labs-jules | +10/-6 (3 files) |
| 1-cicero-marketing-page | #321 | ⚡ Bolt: Optimize luminance calculation memory allocations in observers | app/google-labs-jules | +266/-252 (3 files) |
| 1-cicero-marketing-page | #322 | Design: Newsletter Web Archive Layout | app/google-labs-jules | +712/-22 (6 files) |
| 1-cicero-marketing-page | #323 | feat: implement template detail preview (option b) | app/google-labs-jules | +707/-22 (6 files) |
| 1-cicero-marketing-page | #324 | feat(templates): Implement Template Gallery UI and Variable States | app/google-labs-jules | +894/-12 (6 files) |
| 1-cicero-marketing-page | #325 | Add Cicero Blog Teardown Design | app/google-labs-jules | +633/-0 (4 files) |
| 1-cicero-marketing-page | #326 | Sidebar Design Iteration: Style 6 (Typographic Hierarchy) | app/google-labs-jules | +716/-22 (5 files) |
| 1-cicero-marketing-page | #327 | feat: Add Chat Onboarding design prototype | app/google-labs-jules | +372/-649 (6 files) |
| 1-cicero-marketing-page | #329 | sidebar: implement Style 07 (Status-Forward) | app/google-labs-jules | +877/-42 (8 files) |
| 1-cicero-marketing-page | #330 | ✨ Artifact: Auth Page Design Exploration - Full-Page Immersive | app/google-labs-jules | +275/-0 (2 files) |
| 1-cicero-marketing-page | #335 | Add Cicero Newsletter First Issue Design | app/google-labs-jules | +348/-371 (5 files) |
| 1-cicero-marketing-page | #336 | feat: implement Template Gallery Landing Page | app/google-labs-jules | +751/-24 (6 files) |
| 1-cicero-marketing-page | #339 | ⚡ perf: unroll map in relativeLuminance for ~5.8x speedup | app/google-labs-jules | +95/-90 (2 files) |
| 1-cicero-marketing-page | #340 | ⚡ Optimize useContrastColor performance by hoisting constants | app/google-labs-jules | +105/-90 (3 files) |
| 1-cicero-marketing-page | #341 | ⚡ Optimize relativeLuminance array allocation | app/google-labs-jules | +97/-90 (2 files) |
| 1-cicero-marketing-page | #343 | Add full-page immersive auth design exploration | app/google-labs-jules | +297/-0 (3 files) |
| 1-cicero-marketing-page | #344 | feat: implement document sidebar Style 8 (Compact Table) | app/google-labs-jules | +896/-22 (5 files) |
| 1-cicero-marketing-page | #345 | feat: implement first email coach onboarding | app/google-labs-jules | +672/-6 (4 files) |
| 1-cicero-marketing-page | #346 | 🎨 Palette: Improve dot navigation focus states for mouse users | app/google-labs-jules | +52/-1 (6 files) |
| 1-cicero-marketing-page | #347 | Implement Style 4: Card Nesting for Sidebar Iterate | app/google-labs-jules | +507/-0 (3 files) |
| 1-cicero-marketing-page | #348 | ⚡ Bolt: Optimize Header Scroll Performance (Eliminate Layout Thrashing) | app/google-labs-jules | +68/-43 (2 files) |
| 1-cicero-marketing-page | #349 | 🎨 Palette: Improve keyboard accessibility with focus-visible states | app/google-labs-jules | +79/-4 (10 files) |
| 1-cicero-marketing-page | #350 | feat: add cicero pricing page design artifact | app/google-labs-jules | +412/-0 (3 files) |
| 1-cicero-marketing-page | #351 | ⚡ Bolt: Memoize landing navigation to prevent UI thrashing | app/google-labs-jules | +21/-11 (3 files) |
| 1-cicero-marketing-page | #353 | feat(newsletter): add issue 01 design exploration | app/google-labs-jules | +450/-358 (4 files) |
| 1-cicero-marketing-page | #354 | Add Template Editor / Fill Mode Exploration | app/google-labs-jules | +609/-0 (4 files) |
| 1-cicero-marketing-page | #355 | feat(blog): implement blog index/archive design option B | app/google-labs-jules | +498/-22 (6 files) |
| 1-cicero-marketing-page | #356 | feat: First Email Coach Onboarding Prototype | app/google-labs-jules | +701/-0 (4 files) |
| 1-cicero-marketing-page | #357 | feat: Add full-page immersive auth mockup | app/google-labs-jules | +368/-0 (3 files) |
| 1-cicero-marketing-page | #358 | feat(sidebar): Implement Style 5 Left-Border Accent | app/google-labs-jules | +744/-0 (3 files) |
| 1-cicero-marketing-page | #360 | Add Mobile Editor UI Explorations | app/google-labs-jules | +553/-10 (6 files) |
| 1-cicero-marketing-page | #361 | feat: add citation verification design artifact | app/google-labs-jules | +803/-0 (2 files) |
| 1-cicero-marketing-page | #362 | feat: implement Scene 1 Hero Night Mode for marketing landing page | app/google-labs-jules | +661/-0 (1 files) |
| 1-cicero-marketing-page | #364 | ⚡ Bolt: Replace scroll listener with IntersectionObserver in Header | app/google-labs-jules | +77/-40 (1 files) |
| 1-cicero-marketing-page | #365 | feat(newsletter): add web archive layout and evaluation | app/google-labs-jules | +399/-2 (5 files) |
| 1-cicero-marketing-page | #366 | feat: Cicero Template Editor Exploration | app/google-labs-jules | +578/-6 (5 files) |
| 1-cicero-marketing-page | #367 | feat(design): implement Cicero Blog Index exploration | app/google-labs-jules | +345/-6 (6 files) |
| 1-cicero-marketing-page | #368 | sidebar: implement style 05 left border accent | app/google-labs-jules | +515/-11 (3 files) |
| 1-cicero-marketing-page | #369 | Design: Cicero Full-Page Immersive Auth Mockup | app/google-labs-jules | +262/-11 (3 files) |
| 1-cicero-marketing-page | #371 | Design Exploration: Chat Onboarding for Cicero | app/google-labs-jules | +265/-635 (4 files) |
| 1-cicero-marketing-page | #372 | ⚡ Bolt: Replace scroll listener with IntersectionObserver for header | app/google-labs-jules | +88/-38 (1 files) |
| 1-cicero-marketing-page | #373 | 🎨 Palette: Add external link indicators | app/google-labs-jules | +45/-4 (3 files) |
| 1-cicero-marketing-page | #374 | feat: implement Cicero Dashboard Overview artifact | app/google-labs-jules | +982/-0 (1 files) |
| 1-cicero-marketing-page | #375 | Add Redline Analysis Dashboard Design Artifact | app/google-labs-jules | +422/-351 (3 files) |
| 1-cicero-marketing-page | #376 | 🛡️ Sentinel: [HIGH] Enforce Strict CSP Nonce for scripts | app/google-labs-jules | +67/-42 (1 files) |
| 1-cicero-marketing-page | #377 | ⚡ Bolt: Optimize Header scroll performance with IntersectionObserver | app/google-labs-jules | +101/-281 (5 files) |
| 1-cicero-marketing-page | #378 | feat: Add Cicero newsletter 'Web Archive' design exploration | app/google-labs-jules | +784/-11 (7 files) |
| 1-cicero-marketing-page | #379 | feat: Add Cicero Blog Index Archive Design | app/google-labs-jules | +387/-0 (4 files) |
| 1-cicero-marketing-page | #380 | Design: Template Editor View and Variable UI Exploration | app/google-labs-jules | +724/-11 (5 files) |
| 1-cicero-marketing-page | #381 | Design Exploration: The First Email Coach Onboarding | app/google-labs-jules | +780/-11 (4 files) |
| 1-cicero-marketing-page | #382 | feat: Implement Tight Monochrome Sidebar Style (Style 01) | app/google-labs-jules | +794/-0 (4 files) |
| 1-cicero-marketing-page | #383 | ⚡ Bolt: Optimize Header scroll performance with IntersectionObserver | app/google-labs-jules | +84/-42 (2 files) |
| 1-cicero-marketing-page | #384 | Add Full-Page Immersive Auth Design Exploration | app/google-labs-jules | +303/-0 (3 files) |
| 1-cicero-marketing-page | #385 | Add Batch Analysis Queue design artifact | app/google-labs-jules | +761/-610 (1 files) |
| 1-cicero-marketing-page | #386 | Add text editor workspace mockup exploration | app/google-labs-jules | +470/-0 (3 files) |
| 1-cicero-marketing-page | #387 | ⚡ Bolt: Replace scroll listener with IntersectionObserver in Header | app/google-labs-jules | +108/-41 (2 files) |
| 1-cicero-marketing-page | #388 | 🛡️ Sentinel: [HIGH] Harden Content-Security-Policy with script nonces | app/google-labs-jules | +69/-42 (2 files) |
| 1-cicero-marketing-page | #389 | feat(newsletter): add subscribe landing section exploration | app/google-labs-jules | +272/-4 (5 files) |
| 1-cicero-marketing-page | #390 | feat: Implement Template Detail Page Exploration | app/google-labs-jules | +783/-6 (5 files) |
| 1-cicero-marketing-page | #391 | feat(blog): implement blog index/archive design exploration | app/google-labs-jules | +473/-7 (5 files) |
| 1-cicero-marketing-page | #392 | Implement Chat Onboarding (Option B) Mockup | app/google-labs-jules | +312/-586 (4 files) |
| 1-cicero-marketing-page | #393 | ⚡ Bolt: Optimize BurgerMenu DOM Querying on Tab Keydown | app/google-labs-jules | +20/-62 (1 files) |
| 1-cicero-marketing-page | #394 | ✨ Artifact: Full-Page Immersive Auth Page Design | app/google-labs-jules | +338/-0 (3 files) |
| 1-cicero-marketing-page | #395 | sidebar: style-04 card-nesting — deep nesting reads well, status dots too subtle at small size | app/google-labs-jules | +527/-10 (4 files) |
| 1-cicero-marketing-page | #396 | 🎨 Palette: Add focus-visible rings to inline links and back buttons | app/google-labs-jules | +11344/-9820 (21 files) |
| 1-cicero-marketing-page | #397 | Design Exploration: Template Library Workspace Redesign | app/google-labs-jules | +468/-0 (4 files) |
| 1-cicero-marketing-page | #398 | feat: add Report Preview scene for Cicero (Scene 11) | app/google-labs-jules | +467/-0 (1 files) |
| 1-cicero-marketing-page | #399 | 🎨 Palette: Fix BurgerMenu focus trap and ARIA linkages | app/google-labs-jules | +21/-10 (2 files) |
| 1-cicero-marketing-page | #400 | ⚡ Bolt: Optimize Focus Management in BurgerMenu | app/google-labs-jules | +37/-74 (1 files) |
| 1-cicero-marketing-page | #401 | 🛡️ Sentinel: [CRITICAL] Harden CSP script-src with secure nonce | app/google-labs-jules | +67/-40 (2 files) |
| 1-cicero-marketing-page | #402 | feat: Cicero Newsletter - Web Archive Issue 1 Design | app/google-labs-jules | +502/-25 (6 files) |
| 1-cicero-marketing-page | #403 | feat(blog): implement data insight post format | app/google-labs-jules | +488/-5 (6 files) |
| 1-cicero-marketing-page | #404 | feat: Template detail page design (Option B) | app/google-labs-jules | +687/-5 (6 files) |
| 1-cicero-marketing-page | #405 | feat: Add first email coach onboarding design | app/google-labs-jules | +717/-25 (6 files) |
| 1-cicero-marketing-page | #406 | ⚡ Bolt: Optimize focus trap and unify keydown handlers in BurgerMenu | app/google-labs-jules | +39/-75 (1 files) |
| 1-cicero-marketing-page | #407 | Implement Sidebar Prototype: Style 6 Typographic Hierarchy | app/google-labs-jules | +864/-25 (7 files) |
| 1-cicero-marketing-page | #408 | Design Cicero Auth Page Mockup (Full-Page Immersive) | app/google-labs-jules | +318/-5 (5 files) |
| 1-cicero-marketing-page | #409 | 🎨 Palette: Add external link indicators to footer | app/google-labs-jules | +30/-3 (2 files) |
| 1-cicero-templates | #10 | chore: Configure Renovate | app/renovate | +6/-0 (1 files) |
| 1-sama-3 | #4 | Migrate from Cloudflare to Vercel deployment | app/google-labs-jules | +40/-26847 (8 files) |
| 1-sama-3 | #8 | 🎨 Palette: Improve Newsletter Accessibility | app/google-labs-jules | +30/-8 (2 files) |
| 1-sama-3 | #9 | chore(deps): update dependency @biomejs/biome to v2.4.6 | app/renovate | +12/-11 (2 files) |
| 1-sama-3 | #10 | chore(deps): update dependency oxlint to v1.53.0 | app/renovate | +34/-11 (2 files) |
| 1-sama-3 | #12 | chore(deps): update actions/checkout action to v6 | app/renovate | +1/-1 (1 files) |
| 1-sama-3 | #14 | 🎨 Palette: Improve newsletter loading state and accessibility | app/google-labs-jules | +35/-2 (1 files) |
| 1-sama-3 | #15 | 🛡️ Sentinel: Add security headers to next.config.mjs | app/google-labs-jules | +42/-14 (3 files) |
| 1-sama-3 | #16 | ⚡ Bolt: Use SSG for content pages | app/google-labs-jules | +35/-51 (7 files) |
| 1-sama-3 | #18 | chore(deps): update dependency eslint to v10 | app/renovate | +36/-29 (2 files) |
| 1-sama-3 | #19 | chore(deps): update dependency eslint-config-next to v16 | app/renovate | +63/-20 (2 files) |
| 1-sama-3 | #20 | chore(deps): update node.js to v24.14.0 | app/renovate | +1/-1 (1 files) |
| 1-sama-3 | #21 | 🎨 Palette: Improve Newsletter success feedback accessibility | app/google-labs-jules | +97/-57 (3 files) |
| 1-sama-3 | #22 | 🎨 Palette: Newsletter UX Improvement - Persistent Success Message | app/google-labs-jules | +763/-634 (18 files) |
| 1-sama-3 | #23 | ⚡ Bolt: Optimize Google Analytics loading | app/google-labs-jules | +42/-31 (4 files) |
| 1-sama-3 | #24 | 🛡️ Sentinel: [MEDIUM] Add Security Headers | app/google-labs-jules | +668/-580 (20 files) |
| 1-sama-3 | #25 | 🎨 Palette: Add Skip to Main Content Link | app/google-labs-jules | +37/-17 (2 files) |
| 1-sama-3 | #26 | feat: replace static newsletter form with accessible interactive component | app/google-labs-jules | +745/-586 (20 files) |
| 1-sama-3 | #27 | Cicero Design Exploration | app/google-labs-jules | +641/-24 (6 files) |
| 1-sama-3 | #28 | 🎨 Palette: Improve Newsletter Success UX | app/google-labs-jules | +22/-10 (2 files) |
| 1-sama-3 | #29 | 🛡️ Sentinel: [HIGH] Add security headers | app/google-labs-jules | +49/-39 (3 files) |
| 1-sama-3 | #30 | Enhance Newsletter UX with animations and loading state | app/google-labs-jules | +9455/-10827 (6 files) |
| 1-sama-3 | #31 | feat: Add Cicero design exploration | app/google-labs-jules | +587/-28 (4 files) |
| 1-sama-3 | #32 | ⚡ Bolt: Optimize Google Analytics loading | app/google-labs-jules | +18/-9 (3 files) |
| 1-sama-3 | #33 | 🛡️ Sentinel: Add HTTP Security Headers | app/google-labs-jules | +56/-32 (6 files) |
| 1-sama-3 | #35 | 🎨 Palette: Enhanced Newsletter Success State | app/google-labs-jules | +143/-110 (3 files) |
| 1-sama-3 | #36 | Cicero Design Exploration | app/google-labs-jules | +2445/-7 (2 files) |
| 1-sama-3 | #37 | 🎨 Palette: Newsletter UX Enhancement | app/google-labs-jules | +136/-79 (3 files) |
| 1-sama-3 | #39 | 🛡️ Sentinel: Add HTTP security headers | app/google-labs-jules | +56/-30 (4 files) |
| 1-sama-3 | #40 | chore(deps): update dependency @types/node to v25 | app/renovate | +9/-4 (2 files) |
| 1-sama-3 | #41 | 🎨 Palette: Enhance Newsletter Success UX | app/google-labs-jules | +119/-51 (3 files) |
| 1-sama-3 | #42 | Cicero Email Service Marketing Design | app/google-labs-jules | +647/-12 (6 files) |
| 1-sama-3 | #43 | feat: Add Cicero email service design exploration | app/google-labs-jules | +546/-13 (6 files) |
| 1-sama-3 | #44 | Design Cicero Email Service standalone page (Option G) | app/google-labs-jules | +496/-0 (5 files) |
| 1-sama-3 | #47 | feat: Design Email Service Marketing Page | app/google-labs-jules | +566/-12 (6 files) |
| 1-sama-3 | #48 | feat: Add Cicero marketing design exploration | app/google-labs-jules | +465/-23 (3 files) |
| 1-sama-3 | #49 | 🛡️ Sentinel: [Security Enhancement] Add HTTP Security Headers | app/google-labs-jules | +34/-13 (2 files) |
| 1-sama-3 | #50 | ⚡ Bolt: Preload next slide in HeroSlideshow | app/google-labs-jules | +20/-14 (2 files) |
| 1-sama-3 | #51 | 🎨 Palette: Add loading spinner and a11y improvements to Newsletter | app/google-labs-jules | +77/-37 (2 files) |
| 1-sama-3 | #52 | ⚡ Bolt: Enable SSG for major performance boost | app/google-labs-jules | +611/-556 (18 files) |
| 1-sama-3 | #54 | feat: Add Cicero email service landing page | app/google-labs-jules | +600/-13 (6 files) |
| 1-sama-3 | #55 | Design: Cicero Email Service Standalone Page | app/google-labs-jules | +571/-13 (6 files) |
| 1-sama-3 | #56 | Add Cicero email service marketing page | app/google-labs-jules | +518/-12 (5 files) |
| 1-sama-3 | #57 | feat: add initial Cicero design exploration | app/google-labs-jules | +545/-16 (6 files) |
| 1-sama-3 | #58 | ⚡ Bolt: Preload next slide image in HeroSlideshow | app/google-labs-jules | +20/-28 (4 files) |
| 1-sama-3 | #59 | 🎨 Palette: Enhance newsletter UX with animated success state | app/google-labs-jules | +3/-29 (2 files) |
| 1-sama-3 | #60 | 🛡️ Sentinel: [Medium] Add security headers | app/google-labs-jules | +35/-16 (2 files) |
| 1-sama-3 | #61 | Enhance Newsletter Success State UX | app/google-labs-jules | +132/-2492 (4 files) |
| 1-sama-3 | #62 | Cicero Email Service Marketing Page Design | app/google-labs-jules | +513/-17 (7 files) |
| 1-sama-3 | #63 | Design: Cicero Email Service Standalone Page | app/google-labs-jules | +513/-16 (6 files) |
| 1-sama-3 | #64 | Cicero Email Service Design Exploration | app/google-labs-jules | +620/-16 (7 files) |
| 1-sama-3 | #65 | Cicero Landing Page Design Exploration | app/google-labs-jules | +496/-17 (4 files) |
| 1-sama-3 | #66 | ⚡ Bolt: Preload next slide in HeroSlideshow | app/google-labs-jules | +25/-32 (4 files) |
| 1-sama-3 | #67 | 🎨 Palette: Enhanced Newsletter Interaction | app/google-labs-jules | +163/-109 (3 files) |
| 1-sama-3 | #68 | 🛡️ Sentinel: [HIGH] Add HTTP Security Headers | app/google-labs-jules | +36/-16 (2 files) |
| 1-sama-3 | #69 | feat(a11y): add live region for newsletter status updates | app/google-labs-jules | +26/-29 (4 files) |
| 1-sama-3 | #70 | feat: Add Cicero Email Service marketing page design | app/google-labs-jules | +706/-29 (6 files) |
| 1-sama-3 | #71 | feat: Cicero Email Service Marketing Page | app/google-labs-jules | +475/-29 (5 files) |
| 1-sama-3 | #72 | feat: Add Cicero Email Service marketing page design | app/google-labs-jules | +518/-13 (6 files) |
| 1-sama-3 | #73 | feat: Add Cicero contract analysis design exploration | app/google-labs-jules | +519/-12 (5 files) |
| 1-sama-3 | #74 | 🛡️ Sentinel: [HIGH] Add security headers | app/google-labs-jules | +40/-18 (3 files) |
| 1-sama-3 | #75 | Add Skip to Content Link | app/google-labs-jules | +100/-19 (13 files) |
| 1-sama-3 | #76 | ⚡ Bolt: Preload next slide in HeroSlideshow | app/google-labs-jules | +55/-33 (8 files) |
| 1-sama-3 | #77 | feat(ui): enhance newsletter form UX | app/google-labs-jules | +77/-14 (3 files) |
| 1-sama-3 | #78 | Cicero Email Service Marketing Design | app/google-labs-jules | +478/-18 (7 files) |
| 1-sama-3 | #79 | Add Cicero email service marketing page | app/google-labs-jules | +707/-37 (7 files) |
| 1-sama-3 | #80 | Add Cicero email service marketing design | app/google-labs-jules | +658/-40 (9 files) |
| 1-sama-3 | #81 | feat(cicero): add contract analysis workspace design exploration | app/google-labs-jules | +503/-26 (3 files) |
| 1-sama-3 | #82 | feat(newsletter): enhance accessibility and error handling | app/google-labs-jules | +35/-29 (2 files) |
| 1-sama-3 | #83 | 🛡️ Sentinel: Add HTTP Security Headers | app/google-labs-jules | +54/-21 (2 files) |
| 1-sama-3 | #85 | 🎨 Palette: Enhance Newsletter Accessibility & Feedback | app/google-labs-jules | +34/-28 (4 files) |
| 1-sama-3 | #86 | Add Cicero email service marketing page | app/google-labs-jules | +488/-21 (6 files) |
| 1-sama-3 | #87 | Add Cicero email service workflow design exploration | app/google-labs-jules | +617/-27 (8 files) |
| 1-sama-3 | #88 | feat: Add Cicero Email Service standalone design | app/google-labs-jules | +572/-28 (9 files) |
| 1-sama-3 | #89 | Design Exploration: Cicero Clarification Step | app/google-labs-jules | +463/-34 (5 files) |
| 1-sama-3 | #90 | 🛡️ Sentinel: [Enhancement] Add security headers and harden config | app/google-labs-jules | +56/-40 (6 files) |
| 1-sama-3 | #91 | feat(newsletter): accessible status messages and loading state | app/google-labs-jules | +16/-28 (4 files) |
| 1-sama-3 | #92 | ⚡ Bolt: Preload next slide in HeroSlideshow | app/google-labs-jules | +84/-25 (5 files) |
| 1-sama-3 | #93 | 🎨 Palette: Enhance Newsletter Form UX & Accessibility | app/google-labs-jules | +82/-28 (3 files) |
| 1-sama-3 | #94 | feat: Add Cicero email service marketing design | app/google-labs-jules | +726/-29 (9 files) |
| 1-sama-3 | #95 | Design Cicero Email Service Marketing Page | app/google-labs-jules | +843/-251 (9 files) |
| 1-sama-3 | #96 | Cicero Email Service Design Exploration | app/google-labs-jules | +654/-28 (9 files) |
| 1-sama-3 | #97 | feat: add Cicero clarification step design exploration | app/google-labs-jules | +608/-22 (3 files) |
| 1-sama-3 | #98 | ⚡ Bolt: Migrate to filesystem reader for SSG and remove runtime revalidation | app/google-labs-jules | +30/-45 (6 files) |
| 1-sama-3 | #99 | 🛡️ Sentinel: [CRITICAL] Add security headers and remove X-Powered-By | app/google-labs-jules | +60/-25 (8 files) |
| 1-sama-3 | #100 | 🎨 Palette: Enhance Newsletter form accessibility and interaction | app/google-labs-jules | +55/-19 (4 files) |
| 1-sama-3 | #101 | 🎨 Palette: Enhance newsletter form accessibility and UX | app/google-labs-jules | +35/-25 (3 files) |
| 1-sama-3 | #102 | feat: Add Cicero email service design exploration | app/google-labs-jules | +657/-29 (8 files) |
| 1-sama-3 | #103 | feat: Add Cicero Email Service marketing design exploration (Workflow Timeline) | app/google-labs-jules | +705/-28 (8 files) |
| 1-sama-3 | #104 | feat: Cicero Email Service Design Exploration | app/google-labs-jules | +809/-28 (10 files) |
| 1-sama-3 | #183 | chore(deps): update dependency bun to v1.3.10 | app/renovate | +1/-1 (1 files) |
| 1-sama-3 | #186 | 🎨 Palette: Add loading spinner to newsletter submit button | app/google-labs-jules | +52/-9 (2 files) |
| 1-sama-3 | #187 | 🎨 Palette: Cicero Email Service Standalone Page | app/google-labs-jules | +759/-1 (7 files) |
| 1-sama-3 | #188 | feat: add Cicero email service marketing page exploration | app/google-labs-jules | +668/-1 (7 files) |
| 1-sama-3 | #189 | feat: add cicero email service marketing design exploration | app/google-labs-jules | +585/-2 (9 files) |
| 1-sama-3 | #190 | 🎨 Palette: [Cicero Design Exploration] Email Workflow Visualization | app/google-labs-jules | +588/-0 (1 files) |
| 1-sama-3 | #191 | 🎨 Palette: [UX improvement] Make hero scroll indicator interactive | app/google-labs-jules | +8/-3 (1 files) |
| 1-sama-3 | #192 | 🛡️ Sentinel: Add Content-Security-Policy header | app/google-labs-jules | +4/-0 (1 files) |
| 1-sama-3 | #193 | ⚡ Bolt: [performance] Replace GitHub reader with local filesystem reader on homepage | app/google-labs-jules | +29/-8 (4 files) |
| 1-sama-3 | #194 | 🎨 Palette: Accessible Navigation Dots in Hero Slideshow | app/google-labs-jules | +0/-0 (0 files) |
| 1-sama-3 | #195 | 🎨 Palette: [Cicero] Email Service Design Exploration | app/google-labs-jules | +785/-2 (9 files) |
| 1-sama-3 | #196 | feat: implement cicero email service marketing design | app/google-labs-jules | +723/-1 (8 files) |
| 1-sama-3 | #197 | feat(cicero): add standalone email service landing page | app/google-labs-jules | +668/-1 (7 files) |
| 1-sama-3 | #198 | 🎨 Design: Cicero Hero Exploration | app/google-labs-jules | +511/-0 (1 files) |
| 1-sama-3 | #199 | 🛡️ Sentinel: [CRITICAL] Fix authentication bypass on Keystatic admin layout | app/google-labs-jules | +8/-0 (2 files) |
| 1-sama-3 | #200 | 🎨 Palette: [Hero Slideshow Accessibility] | app/google-labs-jules | +2/-1 (1 files) |
| 1-sama-3 | #201 | ⚡ Bolt: Use local filesystem reader for Keystatic SSG | app/google-labs-jules | +2/-7 (1 files) |
| 1-sama-3 | #202 | 🎨 Palette: [UX improvement] Add focus states & aria-current to Hero carousel dots | app/google-labs-jules | +6/-2 (2 files) |
| 1-sama-3 | #203 | 🎨 Palette: Cicero Email Service Before/After Split | app/google-labs-jules | +711/-1 (8 files) |
| 1-sama-3 | #204 | 🎨 Palette: [Cicero Email Marketing Design] | app/google-labs-jules | +697/-1 (7 files) |
| 1-sama-3 | #205 | Cicero Email Service Marketing Design Exploration | app/google-labs-jules | +1385/-600 (28 files) |
| 1-sama-3 | #206 | feat(design): add Cicero workflow exploration artifact | app/google-labs-jules | +460/-0 (2 files) |
| 1-sama-3 | #207 | 🎨 Palette: Add accessible focus state and ARIA current to hero slideshow pagination | app/google-labs-jules | +6/-2 (2 files) |
| 1-sama-3 | #208 | 🛡️ Sentinel: [HIGH] Fix layout-level authentication bypass in Keystatic Admin | app/google-labs-jules | +28/-23 (3 files) |
| 1-sama-3 | #209 | ⚡ Bolt: Remove unnecessary 'use client' directives | app/google-labs-jules | +4/-4 (2 files) |
| cicero-mail-pydantic-ptbr | #1 | chore(deps): update pre-commit hook charliermarsh/ruff-pre-commit to v0.14.7 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #2 | chore(deps): update pre-commit hook crate-ci/typos to v1.40.0 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #5 | chore(deps): update tschm/cradle action to v0.3.06 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #6 | chore(deps): update mcr.microsoft.com/devcontainers/python docker tag to v3.14 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #7 | chore(deps): update pre-commit hook python-jsonschema/check-jsonschema to v0.35.0 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #8 | chore(deps): lock file maintenance | app/renovate | +895/-759 (1 files) |
| cicero-mail-pydantic-ptbr | #13 | Hardening suggestions for cicero-mail-pydantic-ptbr / anda | app/pixeebot | +9/-9 (3 files) |
| cicero-mail-pydantic-ptbr | #16 | chore(deps): update codecov/codecov-action action to v5 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #17 | chore(deps): update docker/build-push-action action to v6 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #20 | chore(deps): update pre-commit hook asottile/pyupgrade to v3.21.2 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #39 | chore(deps): update pre-commit hook igorshubovych/markdownlint-cli to v0.46.0 | app/renovate | +1/-1 (1 files) |
| cicero-mail-pydantic-ptbr | #172 | Implement pydantic-graph Gateway State Machine | app/google-labs-jules | +314/-0 (1 files) |
| cicero-mail-pydantic-ptbr | #174 | Add pydantic-graph orchestrator module | app/google-labs-jules | +355/-597 (2 files) |
| cicero-mail-pydantic-ptbr | #175 | Create pydantic-graph gateway state machine module | app/google-labs-jules | +367/-0 (3 files) |
| cicero-mail-pydantic-ptbr | #183 | Refactor Language Handling and Messenger Logic for DRY | app/google-labs-jules | +369/-519 (13 files) |
| cicero-mail-pydantic-ptbr | #204 | Create email_agent with tests and mock server | app/google-labs-jules | +4054/-1591 (103 files) |
| cicero-mail-pydantic-ptbr | #205 | Unused Dependencies Report | app/google-labs-jules | +53/-39 (2 files) |
| cicero-mail-pydantic-ptbr | #208 | Cicero Design Screenshot Pipeline | app/google-labs-jules | +1156/-2455 (17 files) |
| cicero-mail-pydantic-ptbr | #209 | Add Cicero Design Screenshot Pipeline | app/google-labs-jules | +484/-0 (14 files) |
| cicero-mail-pydantic-ptbr | #210 | Implement Cicero Design Screenshot Pipeline | app/google-labs-jules | +573/-0 (13 files) |
| cicero-mail-pydantic-ptbr | #217 | Add Cicero Design Screenshot Pipeline | app/google-labs-jules | +1359/-0 (11 files) |
| cicero-mail-pydantic-ptbr | #221 | Implement Cicero Design Screenshot Pipeline | app/google-labs-jules | +596/-0 (6 files) |
| cicero-mail-pydantic-ptbr | #222 | Add Cicero Design Screenshot Pipeline | app/google-labs-jules | +598/-0 (10 files) |
| cicero-mail-pydantic-ptbr | #223 | Implement Cicero Design Screenshot Pipeline | app/google-labs-jules | +477/-0 (6 files) |
| cicero-mail-pydantic-ptbr | #224 | Add Cicero Design Screenshot Pipeline | app/google-labs-jules | +611/-0 (7 files) |
| cicero-mail-pydantic-ptbr | #226 | Implement Cicero Design Screenshot Pipeline | app/google-labs-jules | +77694/-0 (73 files) |
| cicero-mail-pydantic-ptbr | #227 | Add Cicero Design Screenshot Pipeline | app/google-labs-jules | +597/-0 (5 files) |
| cicero-mail-pydantic-ptbr | #228 | Design Screenshot Pipeline | app/google-labs-jules | +25521/-0 (9 files) |
| cicero-mail-pydantic-ptbr | #235 | Fix strict validation fallback for design screenshot pipeline | app/google-labs-jules | +628/-0 (6 files) |
| cicero-mail-pydantic-ptbr | #241 | feat(cicero-design-shots): enhance design validation pipeline logic | app/google-labs-jules | +4685/-60 (78 files) |
| cicero-mail-pydantic-ptbr | #242 | chore: update design pipeline evaluation constraints and commit format | app/google-labs-jules | +64/-15 (2 files) |
| cicero-mail-pydantic-ptbr | #251 | 🛡️ Sentinel: [HIGH] Fix use of weak MD5 hash for security | app/google-labs-jules | +7/-3 (3 files) |
| cicero-mail-pydantic-ptbr | #252 | ⚡ Bolt: Optimize sanitize_filename with precompiled regexes | app/google-labs-jules | +11/-5 (1 files) |
| cicero-mail-pydantic-ptbr | #253 | ⚡ Bolt: Precompile regexes in sanitize_filename for performance | app/google-labs-jules | +72/-5 (2 files) |
| cicero-mail-pydantic-ptbr | #254 | 🛡️ Sentinel: [CRITICAL/HIGH] Fix insecure deserialization in browser scraper | app/google-labs-jules | +11/-7 (2 files) |
| cicero-mail-pydantic-ptbr | #255 | ⚡ Bolt: Pre-compile regexes in utils for performance | app/google-labs-jules | +47/-40 (4 files) |
| cicero-mail-pydantic-ptbr | #256 | 🛡️ Sentinel: [CRITICAL] Fix insecure deserialization in browser scraper | app/google-labs-jules | +6/-6 (1 files) |
| potion_deploy | #859 | Add Email Service 'Use Case Gallery' Design Exploration | app/google-labs-jules | +497/-0 (4 files) |
| potion_deploy | #860 | feat(design): Add standalone email service marketing page | app/google-labs-jules | +491/-0 (4 files) |
| potion_deploy | #861 | Add Precedent Library design exploration | app/google-labs-jules | +1772/-0 (6 files) |
| potion_deploy | #863 | Add document analysis report design exploration | app/google-labs-jules | +677/-0 (2 files) |
| potion_deploy | #864 | Design Exploration: Cicero Newsletter Digest Format | app/google-labs-jules | +652/-0 (5 files) |
| potion_deploy | #865 | Refactor Tailwind arbitrary variables to v4 in feature-section | app/google-labs-jules | +34/-34 (3 files) |
| potion_deploy | #866 | Add Template Preview Design Exploration | app/google-labs-jules | +773/-0 (4 files) |
| potion_deploy | #867 | Add Blog Teardown Format Design Exploration | app/google-labs-jules | +1907/-1 (8 files) |
| potion_deploy | #868 | Add Template Preview Design Artifact | app/google-labs-jules | +744/-0 (4 files) |
| potion_deploy | #869 | feat(ui): implement humanized infinite canvas feature section | app/google-labs-jules | +543/-212 (6 files) |
| potion_deploy | #870 | Implement Style 5 Sidebar Exploration | app/google-labs-jules | +605/-0 (4 files) |
| potion_deploy | #871 | Add First Email Coach onboarding exploration | app/google-labs-jules | +310/-0 (4 files) |
| potion_deploy | #872 | feat(design): Progressive Disclosure Dashboard Onboarding Exploration | app/google-labs-jules | +434/-0 (4 files) |
| potion_deploy | #873 | Auth: Split-Screen Sign In Design Exploration | app/google-labs-jules | +341/-0 (3 files) |
| potion_deploy | #874 | 🛡️ Sentinel: [HIGH] Fix XSS vulnerability in template modal | app/google-labs-jules | +3452/-20258 (3 files) |
| potion_deploy | #875 | feat(onboarding): add First Email Coach design exploration | app/google-labs-jules | +305/-0 (5 files) |
| potion_deploy | #876 | feat: Add sidebar Style 05 (Left-Border Accent) design exploration | app/google-labs-jules | +521/-0 (4 files) |
| potion_deploy | #877 | Design: Progressive Disclosure Dashboard Onboarding | app/google-labs-jules | +344/-0 (4 files) |
| potion_deploy | #878 | feat: Toolbar Tour Onboarding Design Exploration | app/google-labs-jules | +1462/-0 (10 files) |
| potion_deploy | #880 | Add workspace sidebar design exploration (Style 05: Left-Border Accent) | app/google-labs-jules | +522/-0 (4 files) |
| potion_deploy | #881 | Add "First Email Coach" Onboarding Design Exploration | app/google-labs-jules | +331/-0 (4 files) |
| potion_deploy | #883 | feat(onboarding): Add empty state exploration | app/google-labs-jules | +1489/-3 (8 files) |
| potion_deploy | #884 | Design: Split-Screen Auth Mockup | app/google-labs-jules | +1439/-0 (6 files) |
| potion_deploy | #885 | feat: i18n support for toolbar tooltips including pt-BR and es | app/google-labs-jules | +539/-10 (9 files) |
| potion_deploy | #886 | feat: Email Service Marketing Page Design Exploration | app/google-labs-jules | +361/-3 (5 files) |
| potion_deploy | #887 | feat(design): Email Service Use Case Gallery Marketing Exploration | app/google-labs-jules | +450/-0 (5 files) |
| potion_deploy | #888 | Email Service Marketing Exploration (Before/After Split) | app/google-labs-jules | +357/-0 (4 files) |
| potion_deploy | #890 | feat: add cicero feature deep-dive design exploration | app/google-labs-jules | +1512/-0 (7 files) |
| potion_deploy | #892 | Design Exploration: Cicero Digest Newsletter | app/google-labs-jules | +489/-4 (5 files) |
| potion_deploy | #893 | feat: Humanized Infinite Canvas and Anti-Grid Layout | app/google-labs-jules | +48/-26 (2 files) |
| potion_deploy | #894 | feat: add Cicero blog design exploration | app/google-labs-jules | +592/-1 (5 files) |
| potion_deploy | #895 | Add Template Editor Fill Mode Exploration | app/google-labs-jules | +468/-0 (4 files) |
| potion_deploy | #896 | feat(design): implement template editor design exploration | app/google-labs-jules | +652/-0 (4 files) |
| potion_deploy | #897 | Add conversational chat onboarding design artifact | app/google-labs-jules | +1612/-0 (7 files) |
| potion_deploy | #898 | sidebar: style-01 tight monochrome | app/google-labs-jules | +406/-0 (2 files) |
| potion_deploy | #899 | feat(design): Add Chat Onboarding exploration | app/google-labs-jules | +285/-0 (4 files) |
| potion_deploy | #900 | 🛡️ Sentinel: [MEDIUM] Use CF-Connecting-IP for more reliable rate limiting IP extraction | app/google-labs-jules | +53/-7 (9 files) |
| potion_deploy | #901 | Design: Split-Screen Sign In Flow | app/google-labs-jules | +246/-8 (3 files) |
| potion_deploy | #902 | Design Exploration: Chat Onboarding | app/google-labs-jules | +388/-0 (4 files) |
| potion_deploy | #903 | Add Sidebar Style 01 - Tight Monochrome Exploration | app/google-labs-jules | +594/-8 (3 files) |
| potion_deploy | #904 | Add Cicero Chat Onboarding Design Exploration | app/google-labs-jules | +431/-8 (4 files) |
| potion_deploy | #905 | ⚡ Bolt: Debounce word count calculation to reduce keystroke latency | app/google-labs-jules | +15/-11 (2 files) |
| potion_deploy | #906 | feat: Cicero split-screen auth design exploration | app/google-labs-jules | +271/-0 (4 files) |
| potion_deploy | #907 | feat: add chat onboarding design exploration | app/google-labs-jules | +349/-0 (4 files) |
| potion_deploy | #908 | Add Style 02 Warm Paper Sidebar | app/google-labs-jules | +735/-0 (3 files) |
| potion_deploy | #909 | Design: Chat Onboarding Exploration | app/google-labs-jules | +348/-0 (3 files) |
| potion_deploy | #910 | Design Exploration: Chat Onboarding | app/google-labs-jules | +306/-0 (4 files) |
| potion_deploy | #912 | feat: implement i18n for tooltips in UI components | app/google-labs-jules | +64/-17 (9 files) |
| potion_deploy | #913 | feat(marketing): add email service before/after split design | app/google-labs-jules | +375/-4 (5 files) |
| potion_deploy | #919 | feat: add first issue newsletter design exploration | app/google-labs-jules | +469/-4 (5 files) |
| potion_deploy | #921 | feat: Add Cicero blog deep legal analysis design exploration | app/google-labs-jules | +1746/-0 (7 files) |
| potion_deploy | #922 | feat(design): add template editor fill mode exploration | app/google-labs-jules | +866/-3 (7 files) |
| potion_deploy | #924 | Design Exploration: Onboarding Quick-Start Palette | app/google-labs-jules | +441/-0 (4 files) |
| potion_deploy | #925 | feat(design): implement Cicero split-screen sign in exploration | app/google-labs-jules | +252/-0 (4 files) |
| potion_deploy | #926 | feat(onboarding): Implement 'The Empty State' design exploration | app/google-labs-jules | +227/-0 (4 files) |
| potion_deploy | #927 | feat: Add empty workspace onboarding exploration | app/google-labs-jules | +319/-0 (4 files) |
| potion_deploy | #928 | 🛡️ Sentinel: [HIGH] Fix IP Spoofing risk in rate limiting | app/google-labs-jules | +98/-7 (9 files) |
| potion_deploy | #930 | feat(onboarding): implement Setup Wizard design exploration | app/google-labs-jules | +306/-19 (4 files) |
| potion_deploy | #931 | Add Sample Analysis Walkthrough Onboarding Exploration | app/google-labs-jules | +276/-0 (4 files) |
| potion_deploy | #933 | sidebar: implement Style 07 (Status-Forward) for document workspace | app/google-labs-jules | +442/-19 (3 files) |
| potion_deploy | #934 | Design: Quick-Start Palette Onboarding Exploration | app/google-labs-jules | +310/-0 (4 files) |
| potion_deploy | #937 | Toolbar Tour Onboarding Design | app/google-labs-jules | +571/-19 (4 files) |
| potion_deploy | #942 | Add Live Demo Mockup for Email Service | app/google-labs-jules | +586/-30 (5 files) |
| potion_deploy | #943 | feat: i18n translation for editor tooltips | app/google-labs-jules | +1563/-1531 (8 files) |
| potion_deploy | #945 | ⚡ Bolt: Memoize comment UI components to prevent unnecessary re-renders | app/google-labs-jules | +12/-4 (2 files) |
| potion_deploy | #946 | Redesign welcome screen to align with brand guidelines | app/google-labs-jules | +364/-0 (3 files) |
| potion_deploy | #948 | feat(design): add Cicero newsletter exploration | app/google-labs-jules | +374/-30 (5 files) |
| potion_deploy | #949 | feat: implement template editor design exploration | app/google-labs-jules | +556/-1 (5 files) |
| potion_deploy | #950 | Design Exploration: Template Editor / Fill Mode | app/google-labs-jules | +618/-1 (5 files) |
| potion_deploy | #951 | Design Exploration: Blog Article Page | app/google-labs-jules | +759/-1 (12 files) |
| potion_deploy | #953 | Sidebar Iteration: Style 01 (Tight Monochrome) | app/google-labs-jules | +995/-0 (9 files) |
| potion_deploy | #954 | feat(onboarding): design quick-start palette exploration | app/google-labs-jules | +280/-30 (4 files) |
| potion_deploy | #955 | feat: Chat onboarding design exploration | app/google-labs-jules | +338/-323 (4 files) |
| potion_deploy | #956 | 🛡️ Sentinel: [MEDIUM] Fix error handling exposing stack traces in versionRouter | app/google-labs-jules | +14/-7 (2 files) |
| potion_deploy | #957 | feat(sidebar): add tight monochrome design iteration | app/google-labs-jules | +516/-0 (2 files) |
| potion_deploy | #959 | feat(onboarding): add empty state exploration | app/google-labs-jules | +283/-0 (3 files) |
| potion_deploy | #960 | Design: First Email Coach Onboarding Exploration | app/google-labs-jules | +488/-275 (3 files) |
| potion_deploy | #962 | feat(design): Toolbar Tour Onboarding Exploration | app/google-labs-jules | +268/-1 (4 files) |
| potion_deploy | #963 | feat(design): implement split-screen sign in authentication exploration | app/google-labs-jules | +258/-235 (3 files) |
| potion_deploy | #964 | sidebar: style-03 dark-panel | app/google-labs-jules | +753/-0 (3 files) |
| potion_deploy | #965 | Feat: Progressive Disclosure Dashboard Onboarding Exploration | app/google-labs-jules | +773/-0 (4 files) |
| potion_deploy | #966 | feat: add centered minimal auth page design exploration | app/google-labs-jules | +213/-0 (2 files) |
| potion_deploy | #970 | i18n for 5+ files with tooltips | app/google-labs-jules | +47/-20486 (10 files) |
| potion_deploy | #971 | feat(marketing): Add Before/After Split design for email service page | app/google-labs-jules | +366/-340 (4 files) |
| potion_deploy | #972 | ⚡ Bolt: [performance improvement] | app/google-labs-jules | +8/-4 (2 files) |
| potion_deploy | #974 | Add Document Workspace Design Exploration | app/google-labs-jules | +417/-0 (3 files) |
| potion_deploy | #975 | feat: design cicero newsletter 'first issue' exploration | app/google-labs-jules | +373/-2 (5 files) |
| potion_deploy | #976 | feat: Humanized Anti-Grids Infinite Canvas Feature Section | app/google-labs-jules | +1184/-0 (10 files) |
| potion_deploy | #977 | feat(design): implement template editor fill mode exploration | app/google-labs-jules | +617/-1 (5 files) |
| potion_deploy | #978 | Template Editor Design Exploration | app/google-labs-jules | +2125/-2 (6 files) |
| potion_deploy | #979 | Blog Article Page Design Exploration | app/google-labs-jules | +485/-0 (4 files) |
| potion_deploy | #980 | Design: Mobile Editor Interface Explorations | app/google-labs-jules | +1712/-1 (4 files) |
| potion_deploy | #981 | Design: Split-Screen Sign In Better Auth UI Exploration | app/google-labs-jules | +1565/-241 (6 files) |
| potion_deploy | #989 | feat(onboarding): add workspace empty state exploration | app/google-labs-jules | +302/-0 (3 files) |
| potion_deploy | #990 | Sidebar Design Iteration - Style 02: Warm Paper | app/google-labs-jules | +1909/-1 (5 files) |
| potion_deploy | #991 | feat(design): quick-start palette onboarding exploration | app/google-labs-jules | +263/-0 (3 files) |
| potion_deploy | #992 | Design The Empty State onboarding exploration | app/google-labs-jules | +1550/-1 (5 files) |
| potion_deploy | #993 | Add Centered Minimal Auth Design | app/google-labs-jules | +1440/-1 (4 files) |
| potion_deploy | #994 | feat(design): implement onboarding empty state exploration | app/google-labs-jules | +287/-0 (5 files) |
| potion_deploy | #995 | Sidebar Design Iteration: Style 1 (Tight Monochrome) | app/google-labs-jules | +1947/-1 (4 files) |
| potion_deploy | #997 | Design Iteration: Workspace Sidebar (Style 1 - Tight Monochrome) | app/google-labs-jules | +607/-0 (2 files) |
| potion_deploy | #998 | 🛡️ Sentinel: [HIGH] Fix IDOR in comment discussions router | app/google-labs-jules | +23/-0 (2 files) |
| potion_deploy | #999 | feat(auth): design multi-view showcase artifact for better auth ui | app/google-labs-jules | +384/-2 (3 files) |
| potion_deploy | #1000 | feat(onboarding): add sample analysis walkthrough design exploration | app/google-labs-jules | +1582/-1 (5 files) |
| potion_deploy | #1001 | feat(onboarding): implement empty state exploration | app/google-labs-jules | +583/-1 (4 files) |
| potion_deploy | #1004 | chore(deps): update dependency playwright to v1.55.1 [security] | app/renovate | +5/-4 (2 files) |
| potion_deploy | #1012 | 🧹 [Code Health] Move getCursorOverlayElement to core module | app/google-labs-jules | +8/-9 (5 files) |
| potion_deploy | #1017 | ✨ feat(design): implement workflow timeline section for email service | app/google-labs-jules | +348/-1 (5 files) |
| potion_deploy | #1018 | Reactour Integration: Clause Library Discovery Tour | app/google-labs-jules | +1215/-0 (3 files) |
| potion_deploy | #1019 | 🎨 Palette: Add tooltips and ARIA labels to column layout buttons | app/google-labs-jules | +10/-1 (2 files) |
| potion_deploy | #1020 | ✨ Add feature spotlight design exploration | app/google-labs-jules | +537/-0 (2 files) |
| potion_deploy | #1021 | ✨ feat(design): Precedent Library Exploration Artifact | app/google-labs-jules | +353/-0 (3 files) |
| potion_deploy | #1022 | ✨ [design exploration] Cicero Newsletter - First Issue | app/google-labs-jules | +222/-0 (4 files) |
| potion_deploy | #1023 | ✨ [design] Introduce "Humanized Infinite Canvas" UI Exploration | app/google-labs-jules | +432/-0 (4 files) |
| potion_deploy | #1025 | fix: Use `buildParagraph` for fallback in empty table cells | app/google-labs-jules | +5/-4 (1 files) |
| potion_deploy | #1026 | feat(templates): Template Editor / Fill Mode Design Exploration | app/google-labs-jules | +538/-1 (5 files) |
| potion_deploy | #1027 | feat(design): implement Cicero blog teardown exploration | app/google-labs-jules | +698/-1 (5 files) |
| potion_deploy | #1028 | feat: add Cicero Template Editor design exploration | app/google-labs-jules | +330/-1 (5 files) |
| potion_deploy | #1029 | ✨ [design] Auth UI and Mobile Editor Explorations | app/google-labs-jules | +804/-193 (5 files) |
| potion_deploy | #1030 | feat(design): Cicero mobile editor UI explorations | app/google-labs-jules | +1581/-0 (7 files) |
| potion_deploy | #1031 | feat: implement humanized infinite canvas design exploration | app/google-labs-jules | +325/-7 (4 files) |
| potion_deploy | #1032 | 🎨 add auth multi-view showcase design exploration | app/google-labs-jules | +1562/-0 (5 files) |
| potion_deploy | #1033 | ⚡ Bolt: Parallelize independent DB queries in tRPC routers | app/google-labs-jules | +22/-18 (3 files) |
| potion_deploy | #1034 | sidebar: style-08 compact table | app/google-labs-jules | +489/-0 (2 files) |
| potion_deploy | #1035 | ✨ [onboarding] The Empty State exploration | app/google-labs-jules | +521/-1 (5 files) |
| potion_deploy | #1036 | 🎨 design: sidebar style 05 left-border-accent exploration | app/google-labs-jules | +1640/-0 (6 files) |
| potion_deploy | #1037 | sidebar: style-01 tight-monochrome | app/google-labs-jules | +540/-0 (3 files) |
| potion_deploy | #1038 | feat: add toolbar tour onboarding exploration | app/google-labs-jules | +744/-1 (6 files) |
| potion_deploy | #1039 | feat(design): Add Sample Analysis Walkthrough onboarding exploration | app/google-labs-jules | +1543/-1 (8 files) |
| potion_deploy | #1040 | ✨ Design: Progressive Disclosure Dashboard Onboarding Exploration | app/google-labs-jules | +1522/-0 (6 files) |
| potion_deploy | #1041 | ✨ Design: Multi-View Auth Showcase Exploration | app/google-labs-jules | +308/-3 (3 files) |
| potion_deploy | #1042 | design: add empty state onboarding exploration and rationale | app/google-labs-jules | +303/-0 (3 files) |
| potion_deploy | #1043 | 🛡️ Sentinel: [HIGH] Fix IDOR in file creation | app/google-labs-jules | +22/-1 (1 files) |
| potion_deploy | #1044 | 🎨 [Design] Add Toolbar Tour onboarding exploration | app/google-labs-jules | +443/-1 (4 files) |
| potion_deploy | #1045 | ⚡ Bolt: Combine sequential DB queries for document versions | app/google-labs-jules | +14/-10 (1 files) |
| potion_deploy | #1046 | 🎨 Palette: Add accessibility labels to interactive elements | app/google-labs-jules | +10/-8 (4 files) |
| potion_deploy | #1047 | 🌐 [i18n] Add translations to toolbar tooltips | app/google-labs-jules | +34/-9 (8 files) |
| potion_deploy | #1049 | feat: Add Workflow Timeline Design Exploration for Email Service | app/google-labs-jules | +399/-0 (4 files) |
| potion_deploy | #1050 | ⚡ Bolt: [performance improvement] optimize documentVersion query | app/google-labs-jules | +15/-9 (2 files) |
| potion_deploy | #1051 | feat: reactour track changes redline comparison tour implementation | app/google-labs-jules | +0/-0 (0 files) |
| potion_deploy | #1052 | 🎨 Design: Assistant Triage Queue Exploration | app/google-labs-jules | +771/-0 (2 files) |
| potion_deploy | #1053 | 🎨 Marketing: Pricing Page Reimagination | app/google-labs-jules | +314/-0 (4 files) |
| potion_deploy | #1054 | 🎨 Palette: [UX improvement] Add tooltip to icon-only back button in TemplateModal | app/google-labs-jules | +1/-0 (2 files) |
| potion_deploy | #1055 | feat: Add Cicero newsletter design exploration | app/google-labs-jules | +2528/-2 (7 files) |
| potion_deploy | #1056 | ✨ design: Template Editor / Fill Mode Exploration | app/google-labs-jules | +2795/-1 (8 files) |
| potion_deploy | #1057 | ✨ Design Exploration: Template Editor / Fill Mode | app/google-labs-jules | +2568/-1 (7 files) |
| potion_deploy | #1058 | 🎨 Palette: [Blog Article Design Exploration] | app/google-labs-jules | +2716/-1 (7 files) |
| potion_deploy | #1059 | ✨ Design: Mobile Editor interface explorations | app/google-labs-jules | +2833/-0 (4 files) |
| potion_deploy | #1060 | ✨ [Design] Add Cicero Mobile Editor interface explorations | app/google-labs-jules | +711/-0 (5 files) |
| potion_deploy | #1061 | feat: implement Humanized Infinite Canvas landing section | app/google-labs-jules | +70/-42 (2 files) |
| potion_deploy | #1062 | ⚡ Bolt: Optimize document version query to prevent sequential latency | app/google-labs-jules | +16/-9 (2 files) |
| potion_deploy | #1063 | feat(onboarding): add quick-start palette design exploration | app/google-labs-jules | +2391/-0 (6 files) |
| potion_deploy | #1064 | feat: Quick-Start Palette Onboarding Exploration | app/google-labs-jules | +2411/-0 (5 files) |
| potion_deploy | #1065 | ✨ feat(sidebar): Apply Style 08 (Compact Table) to workspace sidebar | app/google-labs-jules | +2737/-0 (5 files) |
| potion_deploy | #1066 | Add Cicero Split-Screen Auth Page Design | app/google-labs-jules | +230/-214 (3 files) |
| potion_deploy | #1067 | Design Exploration: Onboarding Setup Wizard | app/google-labs-jules | +2721/-0 (5 files) |
| potion_deploy | #1068 | 🛡️ Sentinel: [MEDIUM] Fix reverse tabnabbing and phishing risk in template preview | app/google-labs-jules | +6/-129 (3 files) |
| potion_deploy | #1069 | Design Exploration: Onboarding Empty State | app/google-labs-jules | +253/-0 (3 files) |
| potion_deploy | #1070 | Design Exploration: Sample Analysis Walkthrough Onboarding | app/google-labs-jules | +2375/-0 (5 files) |
| potion_deploy | #1071 | feat: Add sidebar Style 09 (Grouped Sections) iteration | app/google-labs-jules | +2548/-0 (4 files) |
| potion_deploy | #1072 | 🎨 Design: Auth Split-Screen Exploration | app/google-labs-jules | +2463/-227 (4 files) |
| potion_deploy | #1073 | feat: add empty state onboarding design exploration | app/google-labs-jules | +2353/-0 (5 files) |
| potion_deploy | #1075 | ⚡ Bolt: [performance improvement] | app/google-labs-jules | +14/-9 (2 files) |
| potion_deploy | #1076 | 🎨 Palette: Add aria-label to Sidebar Sign In button | app/google-labs-jules | +1/-0 (1 files) |
| potion_deploy | #1077 | feat: add standalone marketing page for email service | app/google-labs-jules | +3008/-1 (7 files) |
| potion_deploy | #1078 | ⚡ Bolt: [performance improvement] Optimize documentVersion relational query | app/google-labs-jules | +16/-9 (2 files) |
| potion_deploy | #1079 | 🎨 Palette: [UX improvement] Add aria-labels to font size selector | app/google-labs-jules | +5/-0 (2 files) |
| potion_deploy | #1080 | feat: Zero-Friction Email Workflow Design Exploration | app/google-labs-jules | +316/-0 (1 files) |
| potion_deploy | #1081 | 🎨 Palette: Add Cicero Newsletter Issue 01 Exploration | app/google-labs-jules | +2395/-1 (7 files) |
| potion_deploy | #1082 | Add Cicero blog design exploration | app/google-labs-jules | +2760/-1 (8 files) |
| potion_deploy | #1083 | 🎨 Design: Template Editor / Fill Mode Exploration | app/google-labs-jules | +2540/-1 (7 files) |
| potion_deploy | #1084 | Implement Template Editor / Fill Mode Exploration | app/google-labs-jules | +2638/-1 (7 files) |
| potion_deploy | #1085 | feat: add mobile editor interface design explorations | app/google-labs-jules | +2657/-0 (5 files) |
| potion_deploy | #1086 | ✨ feat(design): mobile editor interface explorations | app/google-labs-jules | +2525/-3 (6 files) |
| potion_deploy | #1087 | feat: Implement Humanized Infinite Canvas feature section | app/google-labs-jules | +301/-15 (4 files) |
| potion_deploy | #1088 | 🎨 Palette: [UX improvement] Add ARIA labels to icon-only buttons | app/google-labs-jules | +3/-0 (2 files) |
| potion_deploy | #1089 | ⚡ Bolt: [performance improvement] | app/google-labs-jules | +15/-9 (2 files) |
| potion_deploy | #1090 | 🎨 Design: Add Progressive Disclosure Dashboard onboarding exploration | app/google-labs-jules | +2529/-0 (5 files) |
| potion_deploy | #1091 | sidebar: style-10 breadcrumb drill-down | app/google-labs-jules | +2456/-0 (5 files) |
| potion_deploy | #1092 | Design: Sidebar Style 08 (Compact Table) | app/google-labs-jules | +2896/-0 (5 files) |
| potion_deploy | #1093 | feat: Add Quick-Start Palette Design Exploration | app/google-labs-jules | +2373/-1 (6 files) |
| potion_deploy | #1094 | sidebar: style-08 compact-table — excellent information density, clear nested boundaries via columns | app/google-labs-jules | +2594/-0 (4 files) |
| potion_deploy | #1095 | feat(auth): multi-view showcase design exploration | app/google-labs-jules | +2393/-0 (4 files) |
| potion_deploy | #1096 | feat(auth): design full-page immersive auth page mockup | app/google-labs-jules | +2395/-0 (4 files) |
| potion_deploy | #1097 | feat(onboarding): add quick-start palette UI exploration | app/google-labs-jules | +2428/-0 (5 files) |
| potion_deploy | #1098 | 🛡️ Sentinel: [CRITICAL] Fix IDOR in file creation | app/google-labs-jules | +22/-1 (1 files) |
| potion_deploy | #1099 | feat: add quick-start palette onboarding exploration | app/google-labs-jules | +2427/-0 (5 files) |
| potion_deploy | #1100 | feat: add empty state onboarding design exploration | app/google-labs-jules | +2588/-0 (5 files) |
| potion_deploy | #1101 | 🎨 Design: Progressive Disclosure Dashboard Onboarding | app/google-labs-jules | +2526/-0 (6 files) |

APPLY PRUNING TO ALL FOLDERS COVERED BY THIS PRUNING SETUP.
IF THE CURRENT REPOSITORY IS `PLATE`, DO NOT PUSH TO THE ORIGINAL PLATE REPOSITORY. ONLY PUSH TO THE INTENDED FORK REMOTE, SUCH AS `ARTHROD/PLATE`.
THIS OVERRIDE IS ACTIVE UNTIL IT IS REPLACED OR REMOVED.
<!-- SPECIAL_SCOPE_OVERRIDE_END -->
