# depol (Predim V5 – Depol)

Angular front-end of the AI Suite family. Full localisation reference: [Instructions.md](Instructions.md).

## Localisation rules (apply to every future change)

AI Suite does not use `*.resx` or `i18n`. Labels come from the World desk reference (WDR) through `ILinguaScenario`
(API, XML, or the JSON variable `aiSuiteLanguageJS` injected in `src/index.html`).

- Key = `formula` (group, here `Predim`) + `tag` (unique within the formula). `lingua` is an ISO 639-1 code, plus `00` = identical in every language (also last-resort fallback).
- Default language is UK English (`en`). Any default/fallback value written in code or templates MUST be UK English, never French.
- In Angular, read labels with `LinScePipe` (`'tag' | linsceLocalisation:'Predim'`) or `LanguageService.label(formula, tag)`. A missing tag renders as `*tag`. Do not hardcode user-visible text (labels, titles, `aria-label`, `alt`, `title`, placeholders, messages) in templates or TS.
- Every new tag must be added to `aiSuiteLanguageJS` in `src/index.html` for `en`, `fr` and `es` (and any other language provided), keeping the tag names identical across languages. One entry per tag per language (no duplicates).
- Placeholders use `String.Format` syntax (`{0}`, `{1}`…), passed as `args`.
- Values identical in every language (units, symbols such as `mA/m²`, `ΔE`) use `lingua: '00'` or stay as literals.
- The current language is `opLingua`, a global defined in `src/index.html` during development and supplied by the containing page in production. There is no language switch in the app. The language service reads one language at a time, so `src/models/corrosion-view.model.ts` (`linguaExport`) selects `opLingua` (plus `00`) from `aiSuiteLanguageJS` in `app.config.ts`, falling back to `en`. Formula names must be unique per language selection, so `00` labels need their own formula name.
- To hand text to WDR source feeding, copy the `aiSuiteLanguageJS` entries, or produce XML in this shape (`PCMT` holds the stored value):

```xml
<AISuite>
  <AILabelFormula name="Predim" lingua="fr">
    <Formula>Predim</Formula>
    <Lingua>fr</Lingua>
    <LinTag AIModor="robot"><PCMT><![CDATA[Imprimer]]></PCMT><Tag>btnPrint</Tag></LinTag>
  </AILabelFormula>
</AISuite>
```

Regenerate [docs/aisuite-labels.xml](docs/aisuite-labels.xml) (WDR export of `aiSuiteLanguageJS`) when tags change. See [docs/localisation-plan.md](docs/localisation-plan.md) for the current audit.
