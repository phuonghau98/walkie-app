import React from 'react'

class ConservationContainer extends React.Component {
  render () {
    const { onClick, chatID, name } = this.props
    const shortenName = name && name.split(' ').map((ch) => ch.length > 0 ? ch[0] : '').join('')
    return (
      <div onClick={() => onClick(chatID)} className='conversation-container'>
        <div className='avatar'>{shortenName}</div>
        <div className='brief-msg-container'>
          <div className='name'>{name}</div>
          <div className='last-msg'></div>
          <div className='last-msg-time'></div>
        </div>
      </div>
    )
  }
}

export default ConservationContainer 