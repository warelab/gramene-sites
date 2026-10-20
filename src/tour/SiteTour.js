// Guided tour of the gene search, on sites whose config sets `tour: true`.
// The engine is gramene-search-tour; ./tourSteps is Gramene's own script.
// Started from the Welcome page's contents list, the Help / Demo view, or by
// loading the page with ?tour=1.

import React from 'react'
import { connect } from 'redux-bundler-react'
import { GeneSearchTour, TourContents, tourChapters } from 'gramene-search-tour'
import 'gramene-search-tour/dist/tour.css'
import buildSteps from './tourSteps'

// Bootstrap's success green, as on the search bar's help button.
const ACCENT = '#198754'

const SiteTourCmp = ({ configuration }) =>
  configuration.tour ? <GeneSearchTour buildSteps={buildSteps} primaryColor={ACCENT}/> : null

export const SiteTour = connect('selectConfiguration', SiteTourCmp)

const chapters = tourChapters(buildSteps)

const SiteTourContentsCmp = ({ configuration }) =>
  configuration.tour ? <TourContents chapters={chapters}/> : null

export const SiteTourContents = connect('selectConfiguration', SiteTourContentsCmp)
