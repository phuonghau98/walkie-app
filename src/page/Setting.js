import React from 'react'
import { Button } from 'antd'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react'

@inject('rootStore')
@observer
class Setting extends React.Component {
  logout = () => {
    this.props.rootStore.logout()
  }

  render () {
    // const { firstName, lastName } = this.props.rootStore.userProfile
    const shortenFullname = this.props.rootStore.userProfile ? this.props.rootStore.userProfile.shortenFullname : ''
    return (
      <div className='setting-page'>
        <div className='profile-logo'>{shortenFullname}</div>
        <Button onClick={this.logout} className='logout-btn' type='danger'>Log out</Button>
      </div>
    )
  }
}

export default Setting