import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Authentication from './Authentication'
import Home from './Home'
import Message from './Message/Message'
import AuthenticatedWrapper from './AuthenticatedWrapper'
import Map from './Map'
import Setting from './Setting'

const App = (props) => {
  const { setAuthenticationState } = props.rootStore
  const issetedToken = window.localStorage.getItem('token')
  if (issetedToken) setAuthenticationState.call(props.rootStore, true)
  const { isAuthenticated } = props.rootStore
  return (
    <Router>
      {!isAuthenticated && <Redirect to='/authentication' />}
      <Switch>
        <Route exact path='/' render={() => {
          if (!isAuthenticated) return <Redirect to='/authentication' />
          return <Redirect to='/home' />
        }} />
        <Route path='/authentication' component={Authentication} />
        <AuthenticatedWrapper>
          <Route path='/home' component={Home} />
          <Route path='/message/:chatID?' component={Message} />
          <Route path='/map/:userID?' component={Map} />
          <Route path='/setting' component={Setting} />
        </AuthenticatedWrapper>
      </Switch>
    </Router>
  )
}

export default inject('rootStore')(observer(App))