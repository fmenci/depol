# Localisation audit and plan

Audit of the project against [Instructions.md](../Instructions.md) (2026-10-08).

## Findings

### 1. Parallel label table instead of WDR
`src/models/corrosion-strings.model.ts` holds ~55 EN/FR labels in a local `CORROSION_STRINGS` table, used by every component through `t()`. It exists because `LanguageService` has no runtime language switch. Only 21 of these labels exist in `aiSuiteLanguageJS`, under different tag names (e.g. `perfEval` vs `title`, `rsurf` vs `surface`).

### 2. Defaults not in UK English
| Where | Text | Issue |
|---|---|---|
| `src/index.html` `<title>` | "Predim software V5 courbe de dépolarisation" | French default |
| `src/index.html` footer `.pgtitle` | "Predim V5, courbe de dépolarisation" | French default |
| `formula.math.component.html` | `'TaffelFormula'\|linsceLocalisation:'Predim'` | No tag in `aiSuiteLanguageJS` (the existing tag is `depolFormula`), so the pipe has nothing to resolve and no English default is given. **Tag added** (see below). |

No other French default was found in templates or TS; French text lives only in the `fr` branch of `CORROSION_STRINGS`, `aiSuiteLanguageJS` and README.

### 3. Data defects in `aiSuiteLanguageJS`
- `en`: `placeholderRefEtude` appears twice ("This case study reference code", "Your case study reference").
- `en`: `chartYLabel` says `A/m²`, `fr` says `mA/m²` (code uses `mA/m²`).
- `fr`: `rsurf` is lowercase "surface" in both languages, where the table uses "Surface".
- `fr`: "courrent" (should be "courant"), "fourni" (should be "fournit"), "Galvaniques" capitalisation.

### 4. Hardcoded user-visible text (candidates for tags)
- `index.html`: `aria-label="Toggle navigation"`, `title="scrool to end"` (typo), `<title>Navigation wheel`, `alt="Depolarisation icon"`, `title="Realisation Arte Scriba"`, `alt="Piuma Arte Scriba"`, "Version 5.7.4", copyright line.
- `theecanvas.html`: `aria-label="Zoom out"`, `aria-label="Zoom in"`.
- `measurement.card.component.html`: `ariaLabel="I app"`, `"Surface"`, `"X on"`, `"X off"`.
- `measure.field.component.html`: `ariaLabel() + ' coarse'`.
- `corrosionpreventioncurve.component.html`: "Debug", "status", "dirty" (developer-only, low priority).
- `corrosionpreventioncurve.component.ts:122`: date locale chosen from `lang()`; acceptable, derive from `lingua`.
- Language switch labels `EN`/`FR` come from the table (`lang`); candidates for `00`.

### 5. Language-agnostic (`00`) candidates
`brand` ("Predim V5 — Depol"), `lang` codes, units (`mA`, `mV`, `m²`, `mA/m²`), `ΔE`, `I app`, `X on`, `X off`, `β a 60 mV · β c 120 mV`.

## Status (update)

Done: the local `CORROSION_STRINGS` table was removed and all its labels moved to `aiSuiteLanguageJS` (formula `Predim`, `en` + `fr`); components use `linsceLocalisation` with the language as 3rd argument; the FR/EN switch calls `LanguageService.switchLingua` (plan steps 2, 4, 5). Data defects of section 3 are fixed (`TaffelFormula` replaced by `depolFormula`). Still open: sections 2 (index.html French title/footer) and 4 (hardcoded aria/alt/title texts).

## Plan

1. **Done now:** added `TaffelFormula` (`en`/`fr`) to `aiSuiteLanguageJS`. No other code touched.
2. **Tag inventory:** give every `CORROSION_STRINGS` key a stable `Predim` tag, reusing the 21 existing tags where they match; add the rest to `aiSuiteLanguageJS` for `en` and `fr`; put language-agnostic values under `00`.
3. **Fix data defects** in section 3 (needs confirmation of the intended wording for the `fr` corrections).
4. **Runtime language switch:** extend the shared `LanguageService` (in `@aisuite-eu/ngtools`) with a settable lingua, or keep a thin local adapter that reads `label('Predim', tag)` per language. This is the blocker for retiring `CORROSION_STRINGS`; it touches the shared library, so it needs your decision.
5. **Migrate components** one at a time from `t().key` to `LinScePipe` / `label()`, with English defaults; delete `CORROSION_STRINGS` and update specs (`app.component.spec.ts` provides `uiLanguageJS: []`, so tests will exercise the defaults).
6. **Hardcoded text** (section 4): replace with tags; fix the `scrool` typo.
7. **index.html French defaults:** make `<title>` and footer title English defaults, localised via `aiSuiteLanguageJS` (the host page, not Angular, so it needs a small script or Razor tag helper in production).
8. **Handoff to WDR:** export the final `aiSuiteLanguageJS` as XML in the format shown in `CLAUDE.md`.
