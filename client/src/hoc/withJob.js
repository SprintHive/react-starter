import React from 'react';
import PropTypes from 'prop-types'
import {compose, setDisplayName, setPropTypes, lifecycle, withProps} from 'recompose'

import {withStore} from './withStore'
import {nonOptimalStates} from './nonOptimalStates'
import {getJob} from '../api/BreadApi'
import LoadingMessage from '../ui/LoadingMessage'

const withBreadTicketStub = compose(
  withStore,
  withProps((props) => ({breadTicketStub: props.store.login.breadTicketStub}))
)

const loadJobData = lifecycle({
  state: {loading: true},
  componentDidMount() {
    const {breadTicketStub, jobId} = this.props
    getJob({breadTicketStub, jobId})
      .then(res => {
        this.setState({job: res.data, error: undefined, loading: false})
      }, e => {
        console.error(e)
        this.setState({job: undefined, error: e, loading: false})
      })
  }
});

const requiredProps = setPropTypes({
  breadTicketStub: PropTypes.string.isRequired,
  jobId: PropTypes.string.isRequired
})

const hasError = ({error}) => error
const ErrorMessage = ({error}) => <h1>Oops, an error occurred when loading a Job</h1>

const loading = ({loading}) => loading

export const withJob = compose(
  setDisplayName("WithJob"),
  withBreadTicketStub,
  requiredProps,
  loadJobData,
  nonOptimalStates([
    {when: loading, render: LoadingMessage},
    {when: hasError, render: ErrorMessage}
  ])
)