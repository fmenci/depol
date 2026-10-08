import { LinSceExportFormula } from '@aisuite-eu/ngtools';

// Presentation helpers of the corrosion evaluation screen. Every label of the screen lives in
// `aiSuiteLanguageJS` (src/index.html), formula `Predim`, and is read with the `linsceLocalisation`
// pipe or `LanguageService.label` (see Instructions.md).

export type VerdictKey = 'unset' | 'passive' | 'low' | 'moderate' | 'high';

/** Formula (label group) of this application in `aiSuiteLanguageJS`. */
export const PREDIM = 'Predim';

/** Tag of the verdict label for each verdict. */
export const VERDICT_TAG: Record<VerdictKey, string> = {
    unset: 'icorrDepolUnset',
    passive: 'icorrDepolPassif',
    low: 'icorrDepolLow',
    moderate: 'icorrDepolModerate',
    high: 'icorrDepolHigh'
};

declare const aiSuiteLanguageJS: string | LinSceExportFormula[] | undefined;

/**
 * The labels of one language out of `aiSuiteLanguageJS`, which holds all of them. The language
 * service reads a single language at a time (the first formula of a given name wins), so it is fed
 * this selection: the requested language plus the language agnostic `00`, or `en` when the page
 * carries nothing for the requested one.
 */
export function linguaExport(lingua: string): LinSceExportFormula[] | undefined {
    if (typeof aiSuiteLanguageJS === 'undefined') {
        return undefined;
    }
    const all: LinSceExportFormula[] = typeof aiSuiteLanguageJS === 'string' ? JSON.parse(aiSuiteLanguageJS) : aiSuiteLanguageJS;
    const pick = (code: string) => all.filter((f) => f.lingua === code || f.lingua === '00');
    const picked = pick(lingua);
    return picked.some((f) => f.lingua === lingua) ? picked : pick('en');
}

/**
 * Verdict ink/tint pairs (OKLCH), measured in the design handoff so white-on-ink text and the
 * ink-on-tint card background both clear 4.5:1. Presentation only — the passive/low/moderate/high
 * thresholds themselves stay in icorr.result.model.ts; this only maps its `effect` key to colour.
 */
export const VERDICT_THEME: Record<VerdictKey, { ink: string; tint: string }> = {
    unset: { ink: 'var(--color-neutral-600)', tint: 'var(--color-neutral-200)' },
    passive: { ink: 'oklch(0.52 0.09 160)', tint: 'oklch(0.94 0.035 160)' },
    low: { ink: 'oklch(0.48 0.10 100)', tint: 'oklch(0.95 0.045 100)' },
    moderate: { ink: 'oklch(0.48 0.13 55)', tint: 'oklch(0.94 0.055 60)' },
    high: { ink: 'oklch(0.52 0.17 25)', tint: 'oklch(0.93 0.05 25)' }
};

/** IcorrResultModel.effect is '' before the form is usable, then 'passive'|'low'|'moderate'|'high'. */
export function verdictKeyFor(effect: string): VerdictKey {
    return effect === 'passive' || effect === 'low' || effect === 'moderate' || effect === 'high' ? effect : 'unset';
}
