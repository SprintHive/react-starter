import React from 'react';
import PropTypes from 'prop-types'
import {compose, setDisplayName, setPropTypes, lifecycle, withProps} from 'recompose'

import {withStore} from './withStore'
import {nonOptimalStates} from './nonOptimalStates'
import {getJobContent} from '../api/BreadApi'
import LoadingMessage from '../ui/LoadingMessage'
import ErrorList from '../errors/ErrorList'

const withBreadTicketStub = compose(
  withStore,
  withProps((props) => ({breadTicketStub: props.store.login.breadTicketStub}))
)

const loadJobData = lifecycle({
  state: {loading: true},
  componentDidMount() {
    const {breadTicketStub, jobId} = this.props
    getJobContent({breadTicketStub, jobId})
      .then(res => {
        this.setState({jobContent: res.data, error: undefined, loading: false})
      }, error => {
        console.error(error)
        this.setState({jobContent: undefined, error: error, loading: false})
      })
  }
})

const requiredProps = setPropTypes({
  breadTicketStub: PropTypes.string.isRequired,
  jobId: PropTypes.string.isRequired
})

const hasError = ({error}) => error
const ErrorMessage = ({error}) => {
  console.error(error);
  return (
    <div>
      <h1>Oops something wrong with downloading the job content</h1>
      <ErrorList errors={error}/>
    </div>
  )
}

const loading = ({loading}) => loading

export const withJobContent = compose(
  setDisplayName("WithJob"),
  withBreadTicketStub,
  requiredProps,
  loadJobData,
  nonOptimalStates([
    {when: loading, render: LoadingMessage},
    {when: hasError, render: ErrorMessage}
  ])
)