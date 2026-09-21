// FR/EN label table for the corrosion evaluation screen, carried verbatim from the design
// handoff's strings.js (itself sourced from src/index.html's aiSuiteLanguageJS).
//
// Why a local table instead of the repo's LanguageService/localise pipe: that mechanism resolves
// a single fixed string table once per app load (from the `opLingua` global in index.html) and has
// no API to switch language at runtime. The redesign calls for a live EN/FR segmented control that
// swaps the whole screen's text; adding that to the shared service would mean changing app-wide
// infrastructure, which the brief rules out ("don't restructure services"). This table keeps that
// interaction local to the one screen while still starting from the app's configured language
// (see CorrosionPreventionCurveComponent, which seeds `lang` from LanguageService.operationLingua).

export type CorrosionLang = 'en' | 'fr';
export type VerdictKey = 'unset' | 'passive' | 'low' | 'moderate' | 'high';

export interface CorrosionStrings {
    lang: string;
    brand: string;
    title: string;
    chartTitle: string;
    xLabel: string;
    yLabel: string;
    appliedLoad: string;
    potentials: string;
    surface: string;
    evaluation: string;
    density: string;
    depol: string;
    ref: string;
    refPlaceholder: string;
    print: string;
    yourCurve: string;
    refCurves: string;
    logScale: string;
    linScale: string;
    reset: string;
    zoom: string;
    verdict: Record<VerdictKey, string>;
    hintXon: string;
    hintZero: string;
    formulaTitle: string;
    illustTitle: string;
    illustPurpose: string;
    illustDesc: string;
    iappDesc: string;
    xonoffDesc: string;
    cstDesc: string;
    figAlt: string;
    figMonitoringUnit: string;
    figReferenceElectrode: string;
    figSteel: string;
    figZincAnodes: string;
    readout: string;
    measure: string;
    operating: string;
    sliders: string;
    hide: string;
    show: string;
    dragHint: string;
}

export const CORROSION_STRINGS: Record<CorrosionLang, CorrosionStrings> = {
    en: {
        lang: 'EN', brand: 'Predim V5 — Depol', title: 'Corrosion speed evaluation',
        chartTitle: 'Corrosion performance evaluation curve',
        xLabel: 'Depolarisation ΔE (mV)', yLabel: 'Corrosion rate i corr (mA/m²)',
        appliedLoad: 'Applied load', potentials: 'Measured potential',
        surface: 'Surface', evaluation: 'Corrosion evaluation', density: 'Applied density',
        depol: 'Depolarisation', ref: 'Project reference', refPlaceholder: 'Your case study reference',
        print: 'Print', yourCurve: 'Your curve', refCurves: 'Reference curves',
        logScale: 'Log i corr', linScale: 'Linear', reset: 'Reset view', zoom: 'Zoom',
        verdict: { unset: 'undefined', passive: 'passive', low: 'low risk', moderate: 'moderate risk', high: 'high risk' },
        hintXon: 'X on should exceed X off — depolarisation is their difference.',
        hintZero: 'All four measurements must be greater than zero.',
        formulaTitle: 'Tafel, Butler-Volmer equation',
        illustTitle: 'Galvanic protection',
        illustPurpose: 'Concrete steel reinforced structure corrosion prevention with galvanic anodes',
        illustDesc: 'This application provides a calculation from measured parameters on a steel reinforced concrete structure (see illustration). The mathematical formula is deduced from Tafel and Butler-Volmer equations',
        iappDesc: 'Input current intensity applied on green circuit before depolarisation in milliampere.',
        xonoffDesc: 'Feed measured potentials on yellow circuit at Xon and Xoff points in millivolt to obtain the parameter',
        cstDesc: 'These constants were determined empirically following experiences carried out on galvanic anodes.',
        figAlt: 'Depolarisation measurement illustration (Predim software V5)',
        figMonitoringUnit: 'Potential and current monitoring unit', figReferenceElectrode: 'Reference electrode',
        figSteel: 'Steel', figZincAnodes: 'Zinc anodes',
        readout: 'Readout', measure: 'Measurement', operating: 'Operating point',
        sliders: 'sliders', hide: 'hide', show: 'show',
        dragHint: 'Drag the point to adjust X off and I app.'
    },
    fr: {
        lang: 'FR', brand: 'Predim V5 — Depol', title: 'Evaluation de la vitesse de corrosion',
        chartTitle: "Courbe d'évaluation de la performance de protection de corrosion",
        xLabel: 'Dépolarisation ΔE (mV)', yLabel: 'Taux de corrosion i corr (mA/m²)',
        appliedLoad: 'Charge appliquée', potentials: 'Potentiels mesurés',
        surface: 'Surface', evaluation: 'Evaluation de la corrosion', density: 'Densité appliquée',
        depol: 'Dépolarisation', ref: "Référence de l'étude", refPlaceholder: 'Votre référence de cette étude',
        print: 'Imprimer', yourCurve: 'Votre courbe', refCurves: 'Courbes de référence',
        logScale: 'Log i corr', linScale: 'Linéaire', reset: 'Vue initiale', zoom: 'Zoom',
        verdict: { unset: 'indéfini', passive: 'passif', low: 'peu de risque', moderate: 'modéré', high: 'risque élevé' },
        hintXon: 'X on doit être supérieur à X off — la dépolarisation est leur différence.',
        hintZero: 'Les quatre mesures doivent être supérieures à zéro.',
        formulaTitle: 'Équation de Tafel, Butler-Volmer',
        illustTitle: 'Protection galvanique',
        illustPurpose: 'Prévention de la corrosion avec anodes galvaniques dans les structures en béton armé',
        illustDesc: "Cette application fourni la méthode de calcul depuis un ensemble de paramètres mesurés sur une structure en béton armé (voir illustration). La formule mathématique est déduite de l'équation de Tafel et Butler-Volmer",
        iappDesc: "Entrer la densité de courrant appliquée, sur le circuit vert, avant dépolarisation en milliampères.",
        xonoffDesc: 'Entrer les potentiels mesurés sur le circuit jaune aux points Xon et Xoff en millivolt pour obtenir le paramètre.',
        cstDesc: 'Ces constantes sont déterminées de façon empirique suite aux expériences menées sur les anodes Galvaniques.',
        figAlt: 'Illustration de la mesure de dépolarisation (logiciel Predim V5)',
        figMonitoringUnit: 'Unité de mesure du potentiel et du courant', figReferenceElectrode: 'Électrode de référence',
        figSteel: 'Acier', figZincAnodes: 'Anodes en zinc',
        readout: 'Lecture', measure: 'Mesure', operating: 'Point de fonctionnement',
        sliders: 'curseurs', hide: 'masquer', show: 'afficher',
        dragHint: 'Glisser le point pour ajuster X off et I app.'
    }
};

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
