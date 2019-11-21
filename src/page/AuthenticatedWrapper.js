import React from 'react'
import { Icon } from 'antd'
import BottomNavBar from '../component/BottomNavBar'
import { inject, observer } from 'mobx-react'
import { withRouter, Redirect } from 'react-router'
import axios from 'axios'

@inject('rootStore')
@observer
class AuthenticatedWrapper extends React.Component {
  componentDidMount () {
    const { isAppReady, isAuthenticated } = this.props.rootStore
    if (!isAppReady && isAuthenticated) {
      const token = window.localStorage.getItem('token')
      axios.get('http://34.87.24.184:8080/user/getprofile', {
        headers: { 'Authorization': token}
      }).then(result => {
        if (result && result.data) {
          const { firstName, lastName, email, id } = result.data
          this.props.rootStore.updateProfile(email, firstName, lastName, id)
          this.props.rootStore.setAppReadyState(true)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  render () {
    const { isAppReady, isAuthenticated } = this.props.rootStore
    if (!isAppReady && isAuthenticated) {
      return (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <Icon style={{ fontSize: 80, color: 'white' }} type='loading' spin />
          <span style={{ marginTop: 10, color: 'white', fontSize: 30, letterSpacing: 5 }}>Please wait...</span>
        </div>
      )
    } else if (!isAppReady && !isAuthenticated) return <Redirect to='/authentication' />
    return (
      <div className='authenticated-wrapper'>
        <div className='page-wrapper'>
          {this.props.children}
        </div>
        <BottomNavBar />
      </div>
    )
  }
}

export default withRouter(AuthenticatedWrapper)