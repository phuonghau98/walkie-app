import React, { Fragment } from 'react'
import { Input } from 'antd'
import { withRouter, Redirect } from 'react-router-dom'
import axios from 'axios'
import ConservationContainer from './ConversationContainer'
import Chatting from './Chatting'
import { inject, observer } from 'mobx-react'
const Search = Input.Search

@inject('rootStore')
@observer
class Message extends React.Component {

  navigateToChatRoom = (chatID) => {
    this.props.history.push('/message/' + chatID)
  }

  navigateBack = () => {
    this.props.history.push('/message')
  }

  navigateToLocation = (userID) => {
    this.props.history.push('/map/' + userID)
  }

  shareLocation = (userID, isRemove, callback) => {
    const token = window.localStorage.getItem('token')
      axios.post('http://34.87.24.184:8080/geolocation/share',
        {
          userID,
          isRemove: isRemove || 0
        },
        {
          headers: { 'Authorization': token }
      }).then(result => {
        if (result && result.data) {
          console.log(result.status)
          if (result.status === 200) {
            if (callback instanceof Function) callback()
          }
          // const { firstName, lastName, email } = result.data
          // this.props.rootStore.updateProfile(email, firstName, lastName)
          // this.props.rootStore.setAppReadyState(true)
        }
      })
      .catch(err => {
        console.log(err)
    })
  }

  handleSendMsg = (msg, receiver, callback) => {
    if (msg) {
      const token = window.localStorage.getItem('token')
      axios.post('http://34.87.24.184:8080/message/send',
        {
          content: msg,
          receiver: receiver
        },
        {
          headers: { 'Authorization': token }
      }).then(result => {
        if (result && result.data) {
          if (result.status === 200) {
            if (callback instanceof Function) callback()
          }
          // const { firstName, lastName, email } = result.data
          // this.props.rootStore.updateProfile(email, firstName, lastName)
          // this.props.rootStore.setAppReadyState(true)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  render () {
    if (this.props.match && this.props.match.params && this.props.match.params.chatID) {
        const { sharedLocations, messages } = this.props.rootStore
        try {
          const { chatID } = this.props.match.params
          const friend = this.props.rootStore.friends.find(friend => friend.id === chatID)
          const { firstName, lastName, id } = friend
          return (<Chatting
            navigateToLocation={this.navigateToLocation}
            fullName={firstName + ' ' + lastName}
            navigateBack={this.navigateBack}
            chatID={id}
            sharedLocation={sharedLocations && sharedLocations.filter(location => location.userID === this.props.rootStore.userProfile.id)[0]}
            shareLocation={this.shareLocation}
            handleSendMsg={this.handleSendMsg}
            messages={messages && messages.filter((message) => message.receiver === chatID || message.sender === chatID)}
          />)
        } catch (err) {
          console.log(err)
          return <Redirect to='/message' />
        }
    }

    const { friends } =this.props.rootStore
    return (
      <Fragment>
        <div className='message-page'>
          <div className='search-wrapper'>
            <Search
              placeholder="Find some friends..."
              onSearch={value => console.log(value)}
              style={{ width: '60%' }}
              size='large'
            />
          </div>
          <div className='message-wrapper'>
            {friends.map(friend => {
              const { firstName, lastName, id } = friend
              if (id === this.props.rootStore.userProfile.id) return null
              return <ConservationContainer key={id} onClick={this.navigateToChatRoom} chatID={id} name={firstName + ' ' + lastName} />
            })}
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(Message)