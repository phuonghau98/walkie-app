import React from 'react'
import { Home, Map, MessageSquare, Settings } from 'react-feather'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
const BottomNavBarBtn = (props) => {
  const { Icon, name, goto } = props
  return (
    <div className='btn' onClick={goto}>
      {<Icon size={30} />}
      <span>{name}</span>
    </div>
  )
}

@inject('rootStore')
@observer
class BottomNavBar extends React.Component {
  goto = (path) => {
    this.props.history.push(path)
  }

  render () {
    return (
      <div className='bottom-nav-bar'>
        <BottomNavBarBtn goto={() => this.goto('/home')} Icon={Home} name='Home' />
        <BottomNavBarBtn goto={() => this.goto('/message')} Icon={MessageSquare} name='Message' />
        <BottomNavBarBtn goto={() => this.goto('/map')} Icon={Map} name='Map'/>
        <BottomNavBarBtn goto={() => this.goto('/setting')} Icon={Settings} name='Setting' />
      </div>
    )
  }
}

export default withRouter(BottomNavBar)