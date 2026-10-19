# Language and visual refinement

This version proofreads the website and introduces a research-journal design: warm paper, deep ink, botanical teal and copper accents, editorial serif typography, distinct case-study covers and a dark footer. All three project tables retain exactly the same numeric entries as the live pre-edit website. See LANGUAGE-REVIEW.md for wording examples.

Your live site already uses the three selected case studies, so this update needs an upload of all new dist contents only; no additional work-folder deletion is required. The assistant has not changed the live website.

# Asif Hussain — focused research consultancy portfolio

This update is prepared for your existing GitHub Pages website. It has not been uploaded or deployed by the assistant. Follow **UPDATE-GITHUB.md** to upload the new `dist` contents to your existing repository.

## What changed

- Homepage targets research consultancies, policy organisations and independent consultants.
- Three leading offers: economic/policy research, quantitative research support and research quality review. Existing specialist service pages remain available.
- Only the three source-supported case studies are built. Each has a project brief, scope, presented output and practical interpretation before the detailed methods and limits.
- 39 unfinished or unverified inventory records are retained in local structured content but excluded from site pages, links and sitemap.
- “Discuss a Project” is primary. A scoped paid pilot precedes the limited optional free trial on How I Work.
- Public-safe `/profile/` page supports browser print/save-as-PDF without exposing the supplied CV's CGPA, phone or referee information.
- Only the five training entries with supplied credential URLs appear in the gallery. The rest remain in local content pending documentation.
- Public indexing metadata, canonical URLs and sitemap use the existing GitHub Pages address. This does not itself publish anything.

## Local preview

Requires Python 3. From this directory:

```sh
python3 build.py
python3 preview.py
```

On Windows, double-click `Preview-Website.bat` for an easy preview, or use `py build.py` and `py preview.py`. Visit http://127.0.0.1:4175 on the same computer. Keep the terminal open. Optional `py preview.py --auth` prompts for a password; username `reviewer`. This is a loopback preview, not a remotely shareable address. The preview server adds noindex/no-store headers even though built HTML is prepared for public indexing.

## Content and source

The maintained static implementation uses Python standard-library templates, semantic HTML, responsive CSS, native SVG and small vanilla-JavaScript controllers. No package installation is required to build or run it.

- `content/site.json`: identity, services, source figures, contact details, trial conditions, FAQs and document-sharing flags. `site_url` controls public canonical/sitemap URLs.
- `content/projects.json`: all 42 original records. Only records explicitly set to `visible_on_site: true` enter the build. The present templates intentionally show the three supported samples; review evidence and add the appropriate renderer before enabling another record.
- `content/certifications.json`: original 20 training records. Entries without a supplied credential URL are retained locally and filtered from the public gallery.
- `build.py`: focused homepage, layouts, professional profile, selected-work cards and output generation. It cleans `dist` before rebuilding.
- `components.py`: retained sample narratives, charts, shared workflow/FAQ and form markup.
- `assets/`: editable CSS and JavaScript. Edit these source assets, not generated `dist/assets`.
- `dist/`: 20 generated pages and public assets, ready for root-domain static hosting.
- `preview.py`: local preview with optional authentication.
- `qa/`: validation scripts, results and screenshot previews.

Pages: nine existing main pages, seven service pages, three supported project pages and one professional profile. The three project routes are `/work/south-asia/`, `/work/health-statistics/`, `/work/retail-analysis/`.

## Accuracy and privacy

Supported sample figures remain based on user-supplied summaries and revised PDFs. Client results, testimonials, paid-client relationships and independent replication are not invented. Research samples and academic background are clearly distinguished from ZAR employment. AI evaluation remains a related available service; no AI-lab employment or completed AI-training contract is claimed.

No original PDF is served: every document flag remains `public_approved: false`. Private evidence is outside `dist` and excluded from this ZIP. No trackers, analytics, nonessential cookies, billing or payment collection were added. A custom domain or domain email has not been purchased/configured.

## Enquiry workflow

The form validates inputs and prepares an email draft with service, project overview, deliverable, reference, timing and budget. It never claims delivery or stores a submission. The visitor opens their email application and sends the draft, or copies it into webmail. Direct backend delivery would require separately configured provider credentials, validation, abuse prevention and real delivery testing.

## Updating

Edit the JSON/text source, rebuild, preview and verify. Follow `UPDATE-GITHUB.md` to replace files and delete retired routes. For future removals, delete the corresponding repository files as well as changing links. A Git-based deployment is preferable for larger updates because it can apply replacements and deletions in one commit.

Missing evidence and permissions remain in `OUTSTANDING.md`. The public build excludes those records rather than presenting pending evidence to prospective clients. Original sample download approval, underlying datasets/scripts and a custom business domain remain separate decisions.
