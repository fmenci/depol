# Localisation audit and plan

Audit of the project against [Instructions.md](../Instructions.md), re-run on 2026-10-08 after the migration to `aiSuiteLanguageJS`.

## Current state

- All labels of the screen live in `aiSuiteLanguageJS` (`src/index.html`), formula `Predim`, languages `fr`, `en`, `es` (es-ES), 43 tags each. Every tag used in templates and TS exists in the three languages; there are no duplicate or unused tags.
- Components read labels with the `linsceLocalisation` pipe or `LanguageService.label`. This includes `aria-label` and SVG `<title>` texts.
- The language is `opLingua` (`index.html` in development, the containing page in production). There is no language switch component; `linguaExport` (in `src/models/corrosion-view.model.ts`) selects that language out of `aiSuiteLanguageJS` at startup, falling back to `en`.
- No default or fallback text in another language than UK English remains in `src/app` or `src/models`.
- XML ready for WDR source feeding: [aisuite-labels.xml](aisuite-labels.xml), generated from `aiSuiteLanguageJS` (3 formulas, 129 `LinTag`). Regenerate it whenever tags change.

## Resolved since the first audit

| Finding | Resolution |
|---|---|
| Local `CORROSION_STRINGS` table bypassing WDR | Removed; labels moved to `aiSuiteLanguageJS`; file renamed `corrosion-view.model.ts` |
| `TaffelFormula` tag missing | Template uses `depolFormula` |
| Duplicate `placeholderRefEtude` (`en`) | Single entry |
| `chartYLabel` `A/m²` vs `mA/m²` | `mA/m²` in every language |
| `rsurf` lowercase | "Surface" |
| French typos ("courrent", "fourni", "Galvaniques") | Corrected |
| Hardcoded `aria-label` (zoom, slider) | New tags `zoomOut`, `zoomIn`, `ariaSlider`; Surface field uses `rsurf` |
| Date locale from a `fr`/`en` test | Derived from `opLingua` (`en` gives `en-GB`) |
| Language switch (`LangSwitchComponent`) | Removed: the language comes from `opLingua` |

## Remaining items

1. **`index.html` host texts** (French `<title>` and footer title, `Toggle navigation`, `scrool to end` typo, `alt`/`title` of logos, copyright line): out of scope, the file is only used during development. In production the host page (Razor tag helper) provides them.
2. **Developer-only debug panel** (`Debug`, `status`, `dirty` in `corrosionpreventioncurve.component.html`), shown only when `environment.production` is false. Left unlocalised on purpose.
3. **`00` (language agnostic) labels**: none are needed today. Symbols and units (`mA/m²`, `ΔE`, `I app`, `X on`, `X off`, `β a 60 mV · β c 120 mV`), "Predim V5 · Depol" are literals in the templates. If any of them must become a label, give it its own formula (for example `PredimCommon`, lingua `00`), because the language service takes the first formula of a given name.
4. **`README.md`** has English and French sections only; a Spanish section would follow the other two.
5. **Spanish review**: the `es` texts were written without a native review.
6. **Specs**: no spec covers `linguaExport` (selection of `opLingua`, fallback to `en`). Worth adding.

## Rules for new work

See [CLAUDE.md](../CLAUDE.md): every new label gets a tag in `aiSuiteLanguageJS` for `fr`, `en` and `es`, is read through the pipe or `LanguageService.label`, and the XML export is regenerated.
