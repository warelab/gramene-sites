// Guided tour of the gene search, on sites whose config sets `tour: true`.
// The engine is gramene-search-tour; ./tourSteps is Gramene's own script.
// Offered from its own /tour page (linked from the tool grid and the menu
// bar) and the Help / Demo view; loading the home page with ?tour=N starts
// it at step N.

import React from 'react'
import { connect } from 'redux-bundler-react'
import { useHistory } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { GeneSearchTour, TourContents, tourChapters } from 'gramene-search-tour'
import 'gramene-search-tour/dist/tour.css'
import buildSteps from './tourSteps'

// Bootstrap's success green, as on the search bar's help button.
const ACCENT = '#198754'

const SiteTourCmp = ({ configuration }) =>
  configuration.tour ? <GeneSearchTour buildSteps={buildSteps} primaryColor={ACCENT}/> : null

// Mounted on the home route only: the steps drive the search bar there.
export const SiteTour = connect('selectConfiguration', SiteTourCmp)

const chapters = tourChapters(buildSteps)

// /tour: the chapter list. The tour runs where the search bar is (the home
// page, or /gramene on a split-home build), so picking a chapter goes there
// with ?tour=<chapter step, 1-based>.
const TourPageCmp = ({ configuration }) => {
  const history = useHistory()
  if (!configuration.tour) return null
  return (
    <Container style={{paddingTop: '20px', paddingBottom: '100px', maxWidth: '900px'}}>
      <TourContents
        chapters={chapters}
        title="Guided tour of the gene search"
        onStart={index => history.push(`${configuration.splitHome ? '/gramene' : '/'}?tour=${index + 1}`)}
      />
    </Container>
  )
}

export const TourPage = connect('selectConfiguration', TourPageCmp)
