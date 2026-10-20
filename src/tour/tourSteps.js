// Gramene's gene-search tour: the site-specific search intro and wording,
// composed with the shared chapters from gramene-search-tour.
//
// The tour runs a real search from the search bar: it types "jasmonic" and
// accepts the "Jasmonic acid biosynthesis" pathway, which matches genes across
// every genome in the release. The gene chapter then ANDs on Arabidopsis
// thaliana — showing how a species filter narrows a pan-genome result — to
// reach LOX2 (AT3G45140), the lipoxygenase at the first committed step of the
// pathway. Expression and enrichment are shown for Arabidopsis too.

import {
  createTourKit,
  resultSetSteps,
  geneSteps,
  refineSteps,
  viewsSteps,
  expressionSteps,
  setToolsSteps,
  revealTarget,
  waitForElement,
  waitFor,
  sleep
} from 'gramene-search-tour'

const SEARCH_TERM = 'jasmonic'
const PATHWAY_LABEL = 'Jasmonic acid biosynthesis'
const EXAMPLE_GENE = 'AT3G45140'
const EXAMPLE_GENE_NAME = 'LOX2'
const ARABIDOPSIS_GENOME = 3702001

// The filters the tour's searches produce. Applied directly when a visitor
// jumps into the middle of the tour from the contents list, so every chapter
// has the result set its steps assume.
const PATHWAY_SUGGESTION = {
  fq_field: 'pathways__ancestors',
  fq_value: '1119332',
  name: PATHWAY_LABEL,
  category: 'Plant Reactome: Pathway'
}
const ARABIDOPSIS_SUGGESTION = {
  fq_field: 'taxonomy__ancestors',
  fq_value: 3702,
  name: 'Arabidopsis thaliana',
  category: 'Taxonomy'
}
const GENE_SEARCH = [PATHWAY_SUGGESTION, ARABIDOPSIS_SUGGESTION]

const SEARCH_INPUT = '#search-input'

export default function buildSteps(getProps) {
  const kit = createTourKit(getProps, {
    prefix: 'gramene',
    search: PATHWAY_SUGGESTION,
    // gramene-search derives the reference from the largest anchor group in
    // /maps (barley, on the plants release); the tour's genes are Arabidopsis.
    taxon: ARABIDOPSIS_GENOME
  })

  // Suggestions render only while there is a query, so the panel and the
  // pathway button both wait on the fetch for SEARCH_TERM.
  const typeSearchTerm = async () => {
    kit.act('doChangeSuggestionsTab', 'gramene')
    kit.act('doChangeSuggestionsQuery', SEARCH_TERM)
    return waitFor(() => kit.findSuggestion(PATHWAY_LABEL), { timeout: 20000 })
  }

  return [
    // ── 1. Run the search, for real ───────────────────────────────────
    {
      chapter: { title: 'Run a search', blurb: 'Find genes by pathway, not by ID' },
      target: 'body',
      placement: 'center',
      title: 'Welcome to the gene search',
      content:
        `Let's run a real search together. We'll look for genes in the jasmonic ` +
        `acid biosynthesis pathway across every genome in Gramene, then use that ` +
        `result set to walk through the interface — the gene evidence tabs, ` +
        `TBrowse, and the tools for working on a whole set of genes at once.`,
      before: async () => {
        // Start from a clean slate so the demo is the same every time.
        kit.act('doClearGrameneFilters')
        kit.act('doClearSuggestions')
        window.scrollTo(0, 0)
        await sleep(200)
      }
    },
    {
      target: '#searchbar-parent',
      placement: 'bottom',
      title: 'Type what you are looking for',
      content:
        `Every search starts in this box. It accepts far more than gene IDs: gene ` +
        `names and synonyms, pathways, protein domains, ontology terms and species ` +
        `all work, and none of it is case sensitive. We've typed "${SEARCH_TERM}".`,
      before: async () => {
        await waitForElement(SEARCH_INPUT, { timeout: 8000 })
        await typeSearchTerm()
        return revealTarget('#searchbar-parent', { block: 'start' })
      }
    },
    {
      target: '.search-suggestions',
      placement: 'top',
      title: 'Suggestions, grouped and counted',
      content:
        `As you type, matching terms are grouped by what they are — pathways, ` +
        `ontology terms, gene names — and each one shows how many genes it would ` +
        `find. That number tells you whether a term is broad or specific before you ` +
        `commit to it.`,
      before: async () => {
        await typeSearchTerm()
        return revealTarget('.search-suggestions', { block: 'start' })
      }
    },
    {
      target: () => kit.findSuggestion(PATHWAY_LABEL),
      placement: 'bottom',
      title: 'Pick the pathway',
      content:
        `Under Plant Reactome: Pathway, "${PATHWAY_LABEL}" matches genes in ` +
        `hundreds of plant genomes. Choosing it turns the term into a search ` +
        `filter — that's what we'll do next.`,
      before: async () => {
        await typeSearchTerm()
        return revealTarget(() => kit.findSuggestion(PATHWAY_LABEL), { block: 'center' })
      }
    },

    // ── 2. The result set ─────────────────────────────────────────────
    ...resultSetSteps(kit, {
      chapter: { title: 'Read the results', blurb: 'Filters, distribution and the gene list' },
      filterLabel: PATHWAY_LABEL,
      // Perform the click the previous step pointed at; ensureSearch applies
      // the filter directly if it didn't happen (jumped here).
      enter: async () => {
        const btn = kit.findSuggestion(PATHWAY_LABEL)
        if (btn) btn.click()
        kit.act('doClearSuggestions')
      },
      copy: {
        neighborhood: {
          content:
            `Neighborhood takes the ten genes either side of each match along the ` +
            `chromosome — genomic context rather than homology. Picking the selected ` +
            `option again clears it, which is what happens as we leave this step, so ` +
            `the rest of the tour runs on the plain pathway genes.`
        }
      }
    }),

    // ── 3. One gene: LOX2 ─────────────────────────────────────────────
    {
      chapter: { title: `One gene: ${EXAMPLE_GENE_NAME}`, blurb: 'Add a species, then read the evidence for one gene' },
      target: '.gramene-filter-container',
      placement: 'right',
      title: 'Narrow to one species',
      content:
        `The pathway matches genes in hundreds of genomes. Adding a species is just ` +
        `another filter, ANDed onto the first: we've added Arabidopsis thaliana, ` +
        `which leaves the handful of Arabidopsis genes in the pathway. Search for a ` +
        `species name to find its taxonomy suggestion.`,
      before: async () => {
        if (!(await kit.ensureSearch(GENE_SEARCH))) return false
        await kit.ensureView('list', '.result-gene')
        return revealTarget('.gramene-filter-container', { block: 'start' })
      }
    },
    ...geneSteps(kit, {
      chapter: null,
      gene: EXAMPLE_GENE,
      search: GENE_SEARCH,
      copy: {
        card: {
          title: `${EXAMPLE_GENE_NAME} is one of these genes`,
          content:
            `${EXAMPLE_GENE} (${EXAMPLE_GENE_NAME}, lipoxygenase 2) catalyses the ` +
            `first committed step of jasmonic acid biosynthesis in Arabidopsis ` +
            `leaves. Let's look at the evidence behind it.`
        },
        pathways: {
          content:
            `Pathways is what put ${EXAMPLE_GENE_NAME} in this result set. ` +
            `The tree on the left lists every Plant Reactome pathway and reaction the ` +
            `gene takes part in; the diagram shows the selected one with the gene ` +
            `flagged.`
        },
        tree: {
          content:
            `Opening Homology draws the gene family tree in TBrowse, with the ` +
            `lipoxygenases of every genome in the release, and the multiple sequence ` +
            `alignment zone (MSA). Click a triangle to expand or collapse a branch, or ` +
            `a gene name for more details. Protein domains are color coded; zoom in to ` +
            `the amino acid sequence level.`
        }
      }
    }),

    // ── 4. Tools for the whole set ────────────────────────────────────
    ...refineSteps(kit, {
      chapter: { title: 'Refine the set', blurb: 'Count your results by category' }
    }),

    ...viewsSteps(kit, {
      chapter: { title: 'Views', blurb: 'Read the same genes another way' }
    }),

    ...expressionSteps(kit, {
      chapter: { title: 'Expression', blurb: 'Heatmap, parallel coordinates, brushing' },
      copy: {
        exprViz: {
          content:
            `Expression data is per genome, so this view opens on a tab per genome in ` +
            `your results that has expression studies. We've picked Arabidopsis ` +
            `thaliana, and now need to choose which samples to plot.`
        }
      }
    }),

    ...setToolsSteps(kit, {
      chapter: {
        title: 'Enrichment, lists & export',
        blurb: 'Over-represented terms, your own gene lists, and taking data with you'
      },
      copy: {
        enrichment: {
          content:
            `Enrichment asks which GO, Plant Ontology or Trait Ontology terms turn up ` +
            `in your results more often than chance would predict, with fold enrichment ` +
            `and an adjusted p-value for each. Pick the species on the left — we've ` +
            `selected Arabidopsis thaliana.`
        }
      }
    })
  ]
}
