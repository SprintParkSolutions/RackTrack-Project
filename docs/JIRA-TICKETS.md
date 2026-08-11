# RackTrack Website - Jira Ticket Sheet

Copy each block below into Jira as-is.

**Structure**
- One Task (parent): *Create the RackTrack website*
- 19 Sub-tasks underneath it, each carrying a **Weight**
  - **01 - 14** are the foundation and the page builds, one ticket each
  - **15 - 19** are cross-cutting sweeps; each one touches all 23 pages

**Weight field** - the weight lives on the **Sub-task issue type only**.

- The parent Task carries **no weight of its own**. Leave its Weight / Story
  Points field empty. Its number is whatever its 19 sub-tasks add up to, which
  Jira calculates for you.
- Do **not** put a weight on any other issue type - no Epic weight, no Story
  weight, no parent weight. Every point in this project sits on a sub-task.
- Scale is Fibonacci: **3, 5, 8, 13, 21**. Nothing is weighted 1 or 2 - if a
  piece of work is small enough to be a 1, it belongs inside another sub-task
  rather than being its own ticket.
- The 19 sub-tasks total **230**.

**Each ticket has four parts**
| Part | Goes in Jira as |
|---|---|
| Title | Summary |
| Instruction | Description |
| Comment | a comment posted on the ticket when it moves to Done |
| Screenshot | an attachment on that same comment |

House style note: the site copy uses hyphens, never em dashes. Keep that in
ticket text too so pasted snippets match the source.

---

## Weight summary

All 19 weights below go on **sub-tasks**. The parent Task gets none.

| # | Sub-task | Weight |
|---|---|---|
| 01 | Capture and document the existing racktrack.ai content | 13 |
| 02 | Define the design system and design tokens | 13 |
| 03 | Stand up the Tailwind build pipeline | 8 |
| 04 | Build the global header, navigation and footer | 13 |
| 05 | Build the Home page | 21 |
| 06 | Build the Why RackTrack page | 8 |
| 07 | Build the Solutions page | 13 |
| 08 | Build the Use Cases hub page | 5 |
| 09 | Build the six use-case role pages | 13 |
| 10 | Build the Trust and Security page | 8 |
| 11 | Build the Resources hub page | 5 |
| 12 | Build the nine resource articles | 13 |
| 13 | Build the About Us page | 5 |
| 14 | Build the Contact Us page | 8 |
| 15 | Unify the visual system across all 23 pages | 21 |
| 16 | Self-host every asset and ship retina imagery | 13 |
| 17 | Make the site work on phones, and add the motion layer | 21 |
| 18 | SEO metadata, sitemap and the cPanel deploy pipeline | 21 |
| 19 | Final QA pass, repository hygiene and handover | 8 |
| | **Sub-task total** | **230** |
| | **Parent Task weight** | **none - leave empty** |

**Two phases**

| Phase | Sub-tasks | Weight | Shape |
|---|---|---|---|
| Foundation and page builds | 01 - 14 | 146 | One ticket per page or per system. Parallelisable. |
| Cross-cutting sweeps | 15 - 19 | 84 | Each one touches all 23 pages, so each is deliberately broad. |

**What was merged into 15 - 19**

The cross-cutting work was originally eleven tickets. Splitting it that finely
meant sweeping all 23 pages eleven separate times, and the tickets could not be
closed independently anyway - you cannot sign off the hero pass without the
drawings that sit inside the heroes. They are now five:

| Sub-task | Absorbs |
|---|---|
| 15 | hero treatments + generated drawing sheets + craft layer |
| 16 | self-hosted fonts + image pipeline and retina exports |
| 17 | phone/responsive pass + motion layer |
| 18 | SEO metadata + sitemap + cPanel deploy pipeline |
| 19 | QA sweep + repository hygiene + README/handover |

The phase total is unchanged at 84, so the project still adds up to 230.

**Distribution**

| Band | Sub-tasks | Weight |
|---|---|---|
| 21 - Home, and the sweeps that touch all 23 pages | 05, 15, 17, 18 | 84 |
| 13 - substantial builds | 01, 02, 04, 07, 09, 12, 16 | 91 |
| 8 - single pages and contained systems | 03, 06, 10, 14, 19 | 40 |
| 5 - hub pages | 08, 11, 13 | 15 |

---

# PARENT TASK

### Title
Create the RackTrack website

**Weight: none.** Leave the Weight / Story Points field empty on this ticket.
The parent's number is the sum of its 19 sub-tasks (230), which Jira rolls up
automatically. Putting a weight here as well would double-count the project.

### Instruction / Description
Design and build the complete RackTrack.ai marketing website as a static site
that can be uploaded to the existing cPanel host, replacing the current live
site without breaking inbound links.

**Scope**
- 23 pages: Home, 7 top-level pages, 6 use-case role pages, 9 resource articles
- One compiled stylesheet, one design system, no per-page CSS drift
- All content carried over from the live site, rewritten to the new structure
- Self-contained: no CDN, no framework, no server, works from the filesystem
- Ships as an uploadable `dist/` folder plus a zip for cPanel File Manager

**Acceptance criteria**
- Every page opens and renders correctly by double-clicking the file locally
- Every internal link resolves; no 404s across the 23 pages
- Site is legible and usable from 320px up to 2560px wide
- `./deploy.sh --clean-urls --domain=https://racktrack.ai` produces a
  deployable folder with sitemap, robots and .htaccess
- Old `/WhyRackTrack/` URL still resolves after cutover

**Definition of done**
All 19 sub-tasks closed, weights summing to 230, QA pass signed off.

### Comment (post on completion)
The site is done and deployable. We ended up with 23 static HTML pages sharing a
single compiled stylesheet, which turned out to be the right call - there is no
build server to keep alive, no framework to upgrade, and the whole thing opens
from a file path if you need to check something without a host. The content came
across from the live site more or less intact but the structure changed a lot:
what used to be one long page per topic is now a hub with proper deep-dives
underneath it. The build produces a `dist/` folder and a zip, so the cutover is
a File Manager upload rather than a deploy pipeline. The old `/WhyRackTrack/`
URL is redirected, so nothing that already points at us breaks.

### Screenshot
Home page hero at 1440px wide, full-colour, plus the terminal output of a
successful `./deploy.sh --clean-urls --domain=https://racktrack.ai` run showing
the file count and folder size.

---

# SUB-TASKS

---

## ST-01

### Title
Capture and document the existing racktrack.ai content

**Weight: 13**

### Instruction / Description
Before writing any markup, capture everything the current live site says so
nothing is lost in the rebuild.

- Walk every page on https://racktrack.ai and screenshot each one
- Transcribe all copy: headings, body, CTAs, nav labels, footer, form fields
- Record the existing sitemap with URL, priority and change frequency per page
- Inventory every image and asset the live site loads
- Pull out the key claims and statistics used in marketing copy so they can be
  reused verbatim and not accidentally reworded
- Capture the existing SEO metadata: title tags and meta descriptions per page
- Write it all into `docs/RackTrack-Website-Content.md` as the single source of
  truth for the rebuild

**Acceptance criteria**
- Every live page appears in the doc with its full copy
- Appendices exist for SEO metadata, asset inventory and key claims
- Any writer or developer can build a page from the doc without visiting the
  live site

### Comment (post on completion)
We captured the whole live site before touching anything - 49 page screenshots
and a full transcription into `docs/RackTrack-Website-Content.md`. That document
ran to about 1,800 lines by the end and it became the thing we actually built
from, which saved a lot of back-and-forth later. The appendices were worth the
extra effort: having the SEO metadata, the asset inventory and the key claims
pulled out separately meant we could reuse the exact statistics and product
claims rather than paraphrasing them and quietly changing what the company
asserts. We noted the capture date and the site's last-modified date at the top
so it is obvious how stale the snapshot is if someone picks it up months later.

### Screenshot
The table of contents and site map table from
`docs/RackTrack-Website-Content.md`, plus a contact sheet of the captured page
screenshots.

---

## ST-02

### Title
Define the design system and design tokens

**Weight: 13**

### Instruction / Description
Establish one visual system for the whole site so pages cannot drift apart.

- **Type**: one nine-step ramp - 11, 13, 15, 18, 20, 26, 30, 38, 46. Headings
  use named component classes (`.h1`, `.h2`, `.h2-sm`, `.h3`, `.h4`), never
  per-element size overrides and never `!important`
- **Typeface**: Geist throughout; Geist Mono for labels, captions and anything
  drawing-related
- **Colour**: navy shell, white and tinted-white grounds, muted grey body text,
  one blue accent (`#1a3fd4`). Dark bands punctuate the page; they are not the
  ground
- Encode the tokens in `tailwind.config.js` so they are the only source of
  colour, spacing and type values
- Write `docs/DESIGN.md` with the full rationale

**Acceptance criteria**
- No page defines its own font size or colour outside the token set
- `grep '!important'` returns nothing in page markup
- `docs/DESIGN.md` explains every token and when to use it

### Comment (post on completion)
The type ramp was the fix that made everything else fall into line. Before this
we had sizes being nudged per page with `!important` to win specificity fights,
and the result read as slightly different on every page. Collapsing to nine
sizes with named heading classes meant a change to `.h2` propagates everywhere
instead of needing 23 edits, and the `!important` declarations all came out. On
colour we made a deliberate decision that the dark navy is punctuation, not the
background - it appears in bands to break up long runs of white rather than
being the ground the site sits on. That one rule stopped the site from going
uniformly dark and heavy as pages got added. All of it lives in
`tailwind.config.js` and is documented in `docs/DESIGN.md`.

### Screenshot
The type ramp rendered as a specimen (all nine sizes with their names) beside
the colour swatch set.

---

## ST-03

### Title
Stand up the Tailwind build pipeline

**Weight: 8**

### Instruction / Description
Replace browser-generated CSS with a compiled stylesheet.

- `tw-input.css` holds the three `@tailwind` directives
- `tailwind.config.js` holds the design tokens and the content glob
- `build.sh` runs Tailwind and emits a minified `racktrack.css`
- Every page links `racktrack.css`; no page carries a `<script>` that builds
  CSS at runtime
- Document in the README that `./build.sh` must be run after **any** markup
  change, and explain the failure mode: Tailwind only emits classes it finds in
  the HTML, so a newly typed class does not exist in the stylesheet until the
  build runs, and nothing errors - the element just silently falls back to its
  inherited style

**Acceptance criteria**
- `./build.sh` completes clean and rewrites `racktrack.css`
- No page loads Tailwind from a CDN or generates CSS in the browser
- The build-after-markup-change rule is documented in the README

### Comment (post on completion)
Generating the CSS in the browser was costing us a visible flash of unstyled
content on every page load and made the site dependent on a CDN being reachable,
so we moved to a compiled stylesheet. `./build.sh` scans the HTML, emits only
the classes actually used and minifies the result. The one sharp edge is worth
repeating because it bit us twice: if you type a new utility class and do not
rebuild, nothing errors - the class simply does not exist and the element
inherits whatever it would have inherited, which looks exactly like a layout bug
rather than a missing build. We wrote that warning into the README in plain
language so the next person loses ten minutes to it instead of an afternoon.

### Screenshot
Terminal showing a successful `./build.sh` run with the "racktrack.css rebuilt"
line, next to the file listing showing the minified stylesheet size.

---

## ST-04

### Title
Build the global header, navigation and footer

**Weight: 13**

### Instruction / Description
Build the chrome that wraps all 23 pages.

- Header with the RackTrack logo, primary nav and the primary CTA
- Dropdown menus for the nav items that have children (Solutions, Use Cases,
  Resources); the three items with dropdowns must be optically aligned with the
  items that do not
- Footer with the full site map, company details and legal links
- Mobile: hamburger toggle that opens a full-height menu
- The header and footer markup must be identical across every page

**Acceptance criteria**
- Nav is pixel-consistent on all 23 pages
- Every footer link resolves
- Current page is indicated in the nav
- Dropdown items align with non-dropdown items

### Comment (post on completion)
The header and footer are duplicated into all 23 pages rather than templated,
which sounds worse than it is - the site has no build step for HTML and flat,
relative links are what let it run from the filesystem. The trade is that any
nav change is a find-and-replace across every page, so we kept the markup
deliberately simple. The alignment fix was the fiddly part: the three nav items
carrying dropdowns had a caret that pushed their text off the baseline the other
items sat on, so the row read as slightly crooked without it being obvious why.
We corrected the optical alignment rather than the mathematical one, which is
what actually made it look straight.

### Screenshot
Header at 1440px with a dropdown open, and the full footer, side by side.

---

## ST-05

### Title
Build the Home page

**Weight: 21**

### Instruction / Description
Build `index.html`, the entry point and the page that sets the visual language
every other page follows.

- Image-led hero with the data hall plate running edge to edge
- Positioning statement and primary CTA above the fold
- Product evidence sections: real capability, not invented metrics
- Five-step walkthrough of how RackTrack works
- Interactive guide that points at the relevant part of the drawing
- Inline media band breaking the page rhythm
- Resource and use-case entry points lower down
- Full SEO metadata

**Acceptance criteria**
- Renders correctly from a `file://` path with no network access
- Hero image loads at retina resolution without layout shift
- Every section below the hero is reachable and links out correctly
- Page is the reference other pages are checked against

### Comment (post on completion)
Home went through the most iteration of any page, because whatever we settled on
here became the pattern the other 22 pages had to follow. The biggest single
change was pulling out the invented metrics - we had placeholder numbers standing
in for proof, and they read as fake because they were. Replacing them with actual
product evidence made the page more convincing with less shouting. The hero also
moved from a boxed image to a plate that runs edge to edge, and the section
immediately below it was reworked because the original opened with a dark band
that ran straight into the dark hero and made the top of the page read as one
undifferentiated slab. The five-step walkthrough and the guide came last, once
the page structure had stopped moving.

### Screenshot
Full-page capture of `index.html` at 1440px wide, top to bottom.

---

## ST-06

### Title
Build the Why RackTrack page

**Weight: 8**

### Instruction / Description
Build `why-racktrack.html` - the argument page.

- Hero using the assigned hero treatment for this page
- The problem statement: why physical infrastructure data goes stale
- The layers diagram showing where RackTrack sits
- Comparison matrix against the alternatives, readable at a glance
- Principles section
- CTA into Solutions or Contact

**Acceptance criteria**
- Comparison matrix is scannable without reading every cell
- Principles are stated as principles, not as a numbered list of features
- Page URL is `why-racktrack.html`; the legacy `/WhyRackTrack/` path is handled
  in the deploy step (see ST-18)

### Comment (post on completion)
The comparison matrix was the part that needed real work. The first version was
a dense grid you had to read cell by cell to get anything out of, which defeats
the purpose - a comparison table exists so someone can glance at it and see the
shape of the answer. We reworked it so the pattern is visible before you read
any of the text. The Principles section also lost its numbering. Numbering
implied a sequence and a ranking that were not real, and it was making a set of
independent commitments look like a process you follow in order.

### Screenshot
The comparison matrix and the Principles section, in one capture at 1440px.

---

## ST-07

### Title
Build the Solutions page

**Weight: 13**

### Instruction / Description
Build `solutions.html` - what the product actually does.

- Hero with the assigned treatment
- Capability sections mapped to the content doc
- The technical schematic drawing, inlined as SVG
- Supporting photography where it adds information, not decoration
- CTA into Contact

**Acceptance criteria**
- Schematic renders as inline SVG and scales without blurring
- Every capability claim traces back to the content doc
- No filler imagery

### Comment (post on completion)
Solutions is where the technical schematic ended up. It started life on Home but
it was doing too much work there, competing with the hero for attention when
Home only needed the summary. Moving it here gave it the room it needed and gave
Solutions the visual anchor it was missing. We also cut two things that were not
earning their place: a port-state table that duplicated information already
stated in the copy, and a capture photograph that was decorative rather than
explanatory. The page got shorter and more convincing at the same time.

### Screenshot
The technical schematic section at 1440px, showing the inlined SVG at full size.

---

## ST-08

### Title
Build the Use Cases hub page

**Weight: 5**

### Instruction / Description
Build `use-cases.html` - the index that routes visitors to their role.

- Hero with the assigned treatment
- Six role cards, one per use-case page, each with a one-line framing of the
  problem that role has
- Each card links to its deep-dive page
- CTA at the foot

**Acceptance criteria**
- All six cards link to the correct `use-case-*.html`
- Cards read as six distinct problems, not six phrasings of one
- Grid reflows cleanly at tablet and phone widths

### Comment (post on completion)
The hub is a routing page, so we kept it deliberately thin - its job is to get
someone to the page written for their role in one click, not to make the
argument itself. The work went into the one-line framings on each card. The
first pass had all six saying roughly the same thing in different words, which
made the page useless as a router because nothing distinguished the options. We
rewrote each around the specific failure that role actually experiences, and the
cards started doing their job.

### Screenshot
The six-card grid at 1440px, with the same grid at 390px beside it showing the
reflow.

---

## ST-09

### Title
Build the six use-case role pages

**Weight: 13**

### Instruction / Description
Build one deep-dive page per role, in an editorial layout:

- `use-case-infrastructure-data-center-leaders.html`
- `use-case-network-architects-engineers.html`
- `use-case-security-vulnerability-teams.html`
- `use-case-compliance-audit-owners.html`
- `use-case-incident-responders-on-call.html`
- `use-case-m-a-migration-teams.html`

Each page needs: hero, the problem stated in that role's language, how
RackTrack addresses it, supporting evidence, a way across to the adjacent
use-case pages, and a CTA.

**Acceptance criteria**
- All six share one layout; only content differs
- Each page offers navigation to sibling use cases
- Full SEO metadata per page
- Copy is role-specific throughout, not generic copy with the job title swapped

### Comment (post on completion)
These six are built from one editorial layout with different content, which
keeps them consistent and makes a layout fix a single change repeated six times
rather than six separate decisions. The addition that mattered most was the way
across - a reader who lands on the compliance page from search is often not
purely a compliance person, and giving them a path to the adjacent roles keeps
them on the site instead of sending them back to the hub. The copy is genuinely
role-specific; we resisted the temptation to write one page and swap the job
title, because that is transparent to anyone who reads two of them.

### Screenshot
Two of the six pages side by side (Compliance and Incident Response) showing the
shared layout with different content, plus the cross-navigation block.

---

## ST-10

### Title
Build the Trust and Security page

**Weight: 8**

### Instruction / Description
Build `trust-security.html`.

- Hero with the assigned treatment
- Deployment models presented as a spectrum, from fully hosted to fully
  air-gapped, rather than as unrelated options
- Data flow diagram that shows where the data goes and, importantly, where it
  branches
- Certifications and compliance posture
- Security practices

**Acceptance criteria**
- Deployment models read as points on one axis
- The data flow diagram shows its branch clearly
- No security claim appears that is not in the content doc

### Comment (post on completion)
Two diagrams carry this page. The deployment models were originally three
separate boxes, which made customers ask "which one am I?" - presenting them as
a spectrum from hosted through to air-gapped answers that question visually,
because you can see where you sit. The data flow diagram had the opposite
problem: it showed a single path when the actual architecture branches, and the
branch is the interesting part for anyone evaluating us on security. Drawing the
branch explicitly turned the diagram from decoration into the argument. We kept
every claim on this page tied back to the content doc rather than writing
anything new, since security claims are the ones you least want to improvise.

### Screenshot
The deployment-model spectrum and the data flow diagram, both at 1440px.

---

## ST-11

### Title
Build the Resources hub page

**Weight: 5**

### Instruction / Description
Build `resources.html` - the index for the nine articles.

- Hero with the assigned treatment
- Article cards with title, standfirst and topic
- Consistent card hover behaviour
- Each card links to its `article-*.html`

**Acceptance criteria**
- All nine articles are listed and linked correctly
- Card grid reflows at tablet and phone
- No article appears twice or is missing

### Comment (post on completion)
Straightforward index page. The one thing we spent time on was the standfirst on
each card - a title alone does not tell you whether an article is worth your
time, and nine titles in a grid all start to look alike. A single line of
framing under each one turned the page from a list into something you can
actually choose from. Hover behaviour is shared with the use-case cards so the
two grids feel like the same site.

### Screenshot
The nine-article grid at 1440px with one card in its hover state.

---

## ST-12

### Title
Build the nine resource articles

**Weight: 13**

### Instruction / Description
Build all nine articles in a shared editorial layout:

- `article-the-hidden-cost-of-wrong-rack-inventory.html`
- `article-what-network-verified-actually-means.html`
- `article-dcim-vs-physical-reality-why-the-gap-matters.html`
- `article-free-port-discovery-and-rack-capacity-planning.html`
- `article-physical-layer-the-missing-link-in-infrastructure-security.html`
- `article-how-infrastructure-teams-prepare-for-soc-2-audits.html`
- `article-why-every-enterprise-cmdb-is-40-wrong-and-the-architecture-t.html`
- `article-the-hidden-cost-of-unreconciled-infrastructure-a-framework-f.html`
- `article-from-audit-to-autonomy-how-continuous-reconciliation-reshape.html`

Each needs a hero, readable measure for long-form body copy, pull quotes where
the content supports them, a route back to Resources, and full SEO metadata.

**Acceptance criteria**
- One layout across all nine
- Line length stays in the comfortable reading range at desktop widths
- Every article links back to the Resources hub
- Filenames stay as-is; they are already indexed

### Comment (post on completion)
We rebuilt the articles as proper editorial pages rather than marketing pages
with more text in them. That mostly meant constraining the measure - long-form
copy set to the full page width is unreadable, and the previous version ran
edge to edge. Setting a comfortable line length and giving the type room to
breathe made a real difference to whether these are actually readable. Two of
the filenames are truncated mid-word, which looks like a mistake but is
deliberate: they match URLs that are already indexed, and renaming them would
cost us that search equity for no benefit.

### Screenshot
One article at 1440px showing the constrained measure and a pull quote, plus a
phone-width capture of the same article.

---

## ST-13

### Title
Build the About Us page

**Weight: 5**

### Instruction / Description
Build `about-us.html`.

- Hero with the assigned treatment
- The convergence story: why the company exists now
- Team and company positioning
- Supporting photography
- CTA into Contact

**Acceptance criteria**
- Copy matches the content doc
- Page does not read as a generic About template
- Images are self-hosted and load offline

### Comment (post on completion)
About pages are usually the weakest page on a site because they default to
platitudes. We built this one around the convergence argument - the specific
reason this problem is solvable now and was not five years ago - which gives the
page an actual thesis instead of a mission statement. The photography here is
self-hosted like everywhere else on the site, so the page still looks right when
opened without a network connection, which matters more than it sounds when
someone is reviewing the site from a plane or a locked-down corporate network.

### Screenshot
Full-page capture of `about-us.html` at 1440px.

---

## ST-14

### Title
Build the Contact Us page

**Weight: 8**

### Instruction / Description
Build `contact-us.html`.

- Hero with the assigned treatment
- Contact form with clear labels and visible focus states
- Company address and direct contact details
- Supporting visual so the page is not a bare form on white
- Compact layout: the form should not require scrolling past its own fields

**Acceptance criteria**
- Every form field has a label and a visible focus state
- Form is usable at 390px wide with 44px minimum touch targets
- Page has visual interest without pushing the form below the fold

### Comment (post on completion)
The first version was a form floating on an empty white page, which is a cold
way to end a visit - the last thing someone sees before deciding whether to
contact you should not feel like a support ticket. We warmed it up with
supporting imagery and gave the page something to look at, then compacted the
layout so the whole form is visible without scrolling past your own fields.
Labels and focus states are explicit rather than relying on placeholder text,
which disappears the moment you start typing and leaves people unsure which
field they are in.

### Screenshot
The contact form at 1440px, with a 390px capture beside it showing the touch
targets.

---

## ST-15

### Title
Unify the visual system across all 23 pages

**Weight: 21**

*Merges the hero treatments, the generated technical drawings and the craft
detailing. They are one job: every page carries all three, and doing them
separately means touching all 23 pages three times.*

### Instruction / Description

**Heroes** - one hero language, variation that is intentional rather than
accidental.
- Heroes are image-led: one language, a different photograph per page
- Define **three** hero treatments and assign one to each page by role, rather
  than repeating a single treatment 23 times or inventing a new one per page
- Interior page titles are quieter than Home; Home is the loudest thing on the
  site
- Close the gap between title and subtitle so they read as one unit
- Clear the right rail on all seven interior pages
- The section immediately below the hero must open the page properly and must
  not collide with the hero's own background

**Technical drawings** - the CAD-style sheets that carry the site's identity.
- Write generator scripts in `tools/` that emit SVG (`tools/sheet-system.py`)
- Palette: white paper, `#1a1a1a` linework, `#6f6f6f` secondary, `#b8b8b8`
  hatch, one blue accent
- Inline the generated SVG directly into the pages; do not load it externally
- The sheet stamp is the shared hero furniture, replacing the seven different
  right-rail treatments the interior pages had
- Document the regenerate-and-reinject workflow in the README

**Craft layer** - the details that make the site feel made rather than
assembled.
- Travelling ink indicator on the nav that moves between items
- Sheet registration marks as recurring furniture
- Hand-drawn style underlines on key links
- Calm the rules: horizontal lines punctuate groups, not every single item

**Acceptance criteria**
- All 23 pages use one of the three defined treatments; no page invents its own
- No dark hero runs into a dark section below it
- Drawings scale to any width without blurring and render offline with no
  external requests
- A sheet can be regenerated by running its script and re-injecting the output
- Steps 1 through 6 in the walkthrough do not collide at any width
- Nav indicator animates smoothly and respects reduced-motion preferences
- Rules appear between groups only, never between every list item

### Comment (post on completion)
This was the pass that turned 23 separately built pages into one site, and it
took several attempts to get right. A few things did not survive contact with
the real pages: two heroes stacked on one page read as a mistake rather than a
choice, and a per-page hero switch added configurability nobody needed. What
worked was three treatments assigned by page role, which gives interior pages
enough variety that the site does not feel repetitive while keeping them
recognisably one family. The other hero fix was volume. Interior titles were set
as loud as Home's, so nothing had priority and every page shouted equally;
dropping the interior sizes made Home read as the front door again. We also had
to break the dark run under the hero on several pages, where a dark hero flowed
straight into a dark section and the top of the page collapsed into one
unreadable slab.

The drawings are what make this look like an infrastructure company's site
rather than a generic SaaS one. They are generated by Python scripts in `tools/`
and inlined as SVG, so they stay crisp at any zoom, cost no extra network
requests and still render with the network off. Inlining does bloat the HTML,
but for a static site with no server that is a trade worth making. Two specific
bugs: the step markers in the walkthrough overlapped at certain widths so 1
through 6 ran into each other, and the guide was pointing at empty space instead
of the dot it was meant to indicate. Both looked fine at the width we happened
to be designing at and were broken everywhere else. The sheet stamp also
replaced seven different right-rail treatments across the interior pages, which
was seven separate chances to be inconsistent.

The craft details were a small pass with a disproportionate effect. The
travelling nav ink and the drawn underlines are the kind of thing nobody
consciously notices but that separate a site somebody made from a site somebody
assembled. The rules were the useful correction: we had a horizontal line under
every item in every list, meant to add structure and actually adding noise until
nothing was grouped because everything was separated equally. Using rules to
punctuate groups rather than items gave the lists real structure.

### Screenshot
Three captures in one attachment: (1) the three hero treatments side by side,
each labelled with the pages it is assigned to; (2) one generated drawing sheet
at full size with a zoomed detail showing the linework staying sharp; (3) the
nav ink mid-travel plus a before/after of the rules treatment on a list.

---

## ST-16

### Title
Self-host every asset and ship retina imagery

**Weight: 13**

*Merges font self-hosting and the image pipeline. Both are "the assets the
pages load", and both are verified by the same offline check.*

### Instruction / Description

**Fonts** - the site must work with no external network requests.
- Download the Geist and Geist Mono woff2 subsets into `assets/fonts/`
- Write `assets/fonts/fonts.css` with the full `@font-face` set and correct
  `unicode-range` per subset
- Remove every reference to Google Fonts and any other CDN across all pages
- Set `font-display` so text is never invisible while fonts load

**Images** - get the photography right at every screen density.
- Keep source photography, recordings and superseded assets in `media/`, which
  stays untracked
- Put only the sized, compressed derivative each page actually loads into
  `assets/`
- Export every hero and inline image at retina resolution so it stays sharp on
  2x displays
- Compress hard enough that retina resolution does not double page weight
- Set explicit width and height on every image so nothing shifts as it loads
- Replace the hero data hall plate with the wider, deeper-aisle version and crop
  it to keep the middle band

**Acceptance criteria**
- Network panel shows zero third-party requests on any page
- Fonts and images render correctly from a `file://` path with wifi off
- No image looks soft on a retina display
- No layout shift on load
- `media/` is untracked; `assets/` contains only what pages serve

### Comment (post on completion)
Self-hosting the fonts closed the last external dependency. Twelve woff2 subset
files went into `assets/fonts/` with a hand-written `fonts.css` carrying the
`unicode-range` declarations, so the browser still downloads only the subsets it
actually needs. The payoff is that the site now renders identically with the
network off, which matters for two real cases: reviewers opening the files
locally, and visitors on corporate networks that block third-party font CDNs
outright. It also removes a privacy question nobody had asked yet but somebody
eventually would.

The images had the opposite problem: everything looked fine until we opened it
on a retina laptop, where every photograph was visibly soft because we had
exported at 1x. Re-exporting at 2x fixed the sharpness but roughly doubled the
page weight, so we went back and compressed harder on each one. A few images
actually came out smaller than their 1x predecessors after recompression, which
was a pleasant surprise. The hero plate went through three versions before we
were happy - the final one is a wider shot with a deeper aisle and a cleaner
floor, cropped to keep only the middle band. We also split the directories
properly: `media/` holds the raw inputs and stays out of git, `assets/` holds
only the derivative each page actually loads.

### Screenshot
Browser network panel on a page load with the third-party filter applied showing
an empty list, beside a retina detail crop before and after at 200% zoom with
the two file sizes labelled.

---

## ST-17

### Title
Make the site work on phones, and add the motion layer

**Weight: 21**

*Merges the responsive pass and the motion layer. Both are behaviour rather
than layout, both touch all 23 pages, and both are verified in the same sweep.*

### Instruction / Description

**Phones** - audit and fix every page at phone widths.
- Every interactive element gets a minimum 44px touch target
- Fix the hamburger menu: the toggle must swap between two drawn icons, not set
  text content on the icon element
- Check every grid, table and diagram reflows rather than overflowing
- No horizontal page scroll at any width from 320px up
- Long-form article copy must stay readable at phone widths

**Motion** - restrained motion that supports reading rather than performing.
- Reveal-on-scroll entrances that follow the reading direction:
  `[data-reveal="left"]` and `[data-reveal="right"]`
- Slow zoom on `[data-zoom]` images
- Micro-transitions on rows, cards and link arrows
- Drive reveals with `IntersectionObserver` where available
- Include a hard failsafe: if `IntersectionObserver` is missing or the user
  prefers reduced motion, everything must be visible immediately and never
  stuck at `opacity: 0`
- Respect `prefers-reduced-motion: reduce` throughout

**Acceptance criteria**
- All 23 pages pass a 320px, 390px and 768px check
- No horizontal overflow anywhere
- Every tap target measures at least 44px
- Menu open and close both work and show the correct icon
- Content is never permanently hidden if JavaScript fails or is disabled
- Reduced-motion users see a static site with all content present
- No motion runs longer than about a second

### Comment (post on completion)
The mobile bug worth recording: the hamburger literally turned into the word
"close" when you opened the menu. When we inlined the icons as SVG, the old
click handler was still setting `.textContent` on the icon span, which wiped the
SVG element out and replaced it with the string. It now swaps between two drawn
icons properly. Beyond that this was a systematic sweep - every page at 320, 390
and 768, fixing overflow wherever a grid or a diagram refused to reflow, and
bumping every tap target to at least 44px. Several links were technically
tappable but small enough that you would miss them on the first try, which is
the kind of thing that never shows up on a desktop review.

For motion, the rule we held to is that it should follow the reading direction,
so elements enter from the side they belong on rather than all sliding up
together. The important engineering detail is the failsafe. Reveal-on-scroll
works by setting elements to `opacity: 0` and then revealing them, which means
any failure in that chain - no `IntersectionObserver`, JavaScript blocked, a
script error earlier on the page - leaves the content permanently invisible.
That is a catastrophic failure mode for a marketing site, so there is a hard
failsafe that makes everything visible immediately if the observer is
unavailable, and the reduced-motion path skips the hiding entirely rather than
hiding and then instantly showing.

### Screenshot
Three-up phone captures of Home, Solutions and one article at 390px plus the
open mobile menu showing the correct close icon, beside a reveal caught
mid-transition and the same section with reduced-motion forced on showing
everything fully visible.

---

## ST-18

### Title
SEO metadata, sitemap and the cPanel deploy pipeline

**Weight: 21**

*Merges SEO and deploy. The sitemap is written by the deploy script and its
URLs differ per build mode, so the two cannot be sensibly separated.*

### Instruction / Description

**SEO** - every page needs complete, unique metadata.
- Unique `<title>` and meta description per page, carried from the content doc
- Canonical URLs
- Open Graph and Twitter card tags with an image
- Semantic heading hierarchy: exactly one `h1` per page, no skipped levels
- Descriptive `alt` text on every image
- `tools/write-sitemap.py` generates `sitemap.xml` from the page set using the
  priorities and change frequencies recorded in the content doc
- Generate `robots.txt` pointing at the sitemap

**Deploy** - produce an uploadable build that can replace the live site.

`./deploy.sh` must:
1. Rebuild the stylesheet
2. Assemble `dist/` with only what the site serves: pages, `racktrack.css`,
   `assets/`. Exclude `node_modules`, `media/`, `docs/`, `tools/` and build
   config
3. Write `.htaccess` with `DirectoryIndex`, gzip compression for text assets,
   and cache headers: 7 days for CSS, 1 year for woff2, 30 days for images,
   0 seconds for HTML
4. Write `sitemap.xml` and `robots.txt` when `--domain` is given
5. Zip `dist/` into `racktrack-site.zip` for cPanel File Manager

Support two modes:
- default: flat URLs, `/about-us.html`
- `--clean-urls`: nested URLs, `/about-us/`, matching the current live site

Add a 301 from the legacy `/WhyRackTrack/` to `/why-racktrack/`.

**Acceptance criteria**
- No duplicate titles or descriptions across the 23 pages
- Exactly one `h1` per page
- `./deploy.sh --clean-urls --domain=https://racktrack.ai` completes clean and
  reports file count and folder size
- `dist/` contains no build tooling or source media
- Clean-URL build has every internal link rewritten to the nested form, and
  `sitemap.xml` lists all 23 pages with URLs matching that mode
- `/WhyRackTrack/` redirects with a 301

### Comment (post on completion)
Metadata came straight from the appendix in the content doc, so the titles and
descriptions match what the live site was already ranking on rather than being
rewritten from scratch and losing that history. The sitemap is generated at
deploy time rather than maintained by hand, and that turned out to be necessary
rather than merely tidy: the URLs differ between the flat and clean-URL builds,
so a hand-maintained sitemap would have been permanently wrong for one of the
two modes. The generator reads the mode and the domain and writes the right URLs
for whichever build is running, which is also why this ended up in the same
ticket as the deploy work.

On deploy, the constraint was that the existing host is cPanel, so this had to
end in an upload rather than a pipeline. `./deploy.sh` rebuilds the CSS,
assembles only the files the site actually serves, writes the `.htaccess` and
zips the result, so the cutover is a File Manager upload. The clean-URL mode was
necessary because the live site uses nested paths - shipping flat `.html` URLs
would have broken every existing inbound link and every bookmark.
`tools/nest-urls.py` restructures the pages and rewrites the links for that
mode. The `/WhyRackTrack/` redirect is a small thing that is very annoying if
you forget it: that URL exists in the wild and would have started 404ing the
moment we cut over. Cache headers are set so HTML always revalidates while fonts
and images cache long, which means a content fix goes live immediately without
the assets being re-downloaded.

### Screenshot
Terminal output of a full `./deploy.sh --clean-urls --domain=https://racktrack.ai`
run showing all four steps, the file count and the zip size, beside the
generated `sitemap.xml` open in a browser and the `<head>` blocks of two
different pages showing their unique metadata.

---

## ST-19

### Title
Final QA pass, repository hygiene and handover

**Weight: 8**

*Merges the QA sweep with the repository and documentation cleanup. Both are
"leave it in a state someone else can pick up", and both happen last.*

### Instruction / Description

**QA** - verify the whole site before cutover.
- Open every one of the 23 pages and confirm it renders
- Click every internal link; confirm zero 404s
- Check every page at 320px, 390px, 768px, 1440px and 2560px
- Verify offline: open from `file://` with wifi off and confirm fonts, images
  and drawings all render
- Check the browser console on every page for errors
- Confirm no external network requests on any page
- Verify all form fields, focus states and keyboard navigation
- Cross-browser: Chrome, Safari, Firefox
- Check with reduced motion forced on

**Repository and documentation** - leave it pickup-ready.
- `.gitignore` for `node_modules`, `dist`, `racktrack-site.zip`, `.DS_Store`
  and `media/`
- Stop tracking the roughly 35 MB of source media that was in git
- Organise the directory: `assets/` for served files, `media/` for raw inputs,
  `docs/` for source copy and design notes, `tools/` for generators
- Write the README: build instructions, the build-after-markup-change warning,
  the file layout, a design system summary and the media policy
- Explain in the README why all 23 pages sit at the repository root

**Acceptance criteria**
- Zero broken links, zero console errors, zero external requests
- No horizontal overflow at any tested width
- Site fully functional offline
- `git status` is clean after a build and a deploy
- Repository clone size is reasonable
- A new developer can build and deploy from the README alone

### Comment (post on completion)
We went through all 23 pages at five widths, in three browsers, online and off.
The offline check is the one we would recommend keeping in any future QA pass,
because it catches anything that has quietly slipped back onto a CDN - those
pages look completely normal until the network goes away. Console was clean, no
links broken, no external requests on any page, and the reduced-motion pass
confirmed every piece of content is present and visible with the motion layer
disabled.

The repository needed the same kind of tidying before handover. It was carrying
about 35 MB of source photography, screen recordings and superseded assets, none
of which is served, all of which made clones slow. That moved to an untracked
`media/` directory with only the sized derivatives kept in `assets/`. The README
documents the one non-obvious layout decision explicitly: all 23 pages sit at
the root because their links are flat and relative, which is exactly what lets
the site work identically from the filesystem and from any static host. Moving
them into a subfolder would mean rewriting every link and every asset path for
no functional gain, and that is worth writing down before someone tidies it and
breaks the site. Site is ready for cutover.

### Screenshot
The QA matrix - 23 pages by 5 widths - with pass marks, plus a clean console on
Home and an empty third-party network panel, beside the README file layout
section and `git status` clean after a full build and deploy run.

---

## Notes for the person creating these in Jira

1. Create the parent Task first, then create all 19 sub-tasks under it so the
   weight rolls up.
2. Put a weight on the **sub-tasks only**. The parent Task's Weight / Story
   Points field stays empty - Jira sums the children for you, and filling it in
   as well counts the project twice in every report.
3. If your `Weight` field is not on the Sub-task screen, add it via
   **Project settings > Issue types > Sub-task > Field layout**, or use Story
   Points instead - the numbers work either way. Make sure the field is on the
   Sub-task screen specifically; adding it at project level tends to put it on
   every issue type, which is what leads to someone weighting the parent.
4. The Comment on each ticket is written to be posted when the ticket moves to
   Done, with the screenshot attached to that same comment. Posting the comment
   and the screenshot together keeps the evidence next to the explanation.
5. **Sequencing.** ST-01 through ST-04 come first and block everything else.
   ST-05 through ST-14 are the page builds and can run in parallel once the
   foundation is done. ST-15 through ST-18 are cross-cutting sweeps that touch
   all 23 pages, so they follow the page builds rather than running alongside
   them. ST-19 is last.
6. **The merged tickets carry more than one screenshot.** ST-15 through ST-19
   each cover work that was previously several tickets, so their Screenshot
   line asks for a combined attachment. Attach them as separate images on the
   same comment rather than trying to fit everything into one frame.
