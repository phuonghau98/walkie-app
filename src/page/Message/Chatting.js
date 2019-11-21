import React from 'react'
import { Input, Button, Icon, Form } from 'antd'

const Message = (props) => {
  const { content, isSender, messageTime } = props
  return (
    <div className='msg-content-wp'>
      <div className={`msg-content ${isSender ? 'sender' : 'receiver'}`}>
        {content}
        <div className='time'>{new Date(messageTime * 1000).toLocaleString()}</div>
      </div>
    </div>
  )
}

class Chatting extends React.Component {
  state = {
    typingMsg: null
  }

  dialogRef = React.createRef()

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.messages.length < this.props.messages.length) this.scrollToBottom()
  }

  scrollToBottom () {
    this.dialogRef.current.scrollTop = this.dialogRef.current.scrollHeight - this.dialogRef.current.clientHeight
  }

  render () {
    const { navigateBack, fullName, navigateToLocation, chatID, messages, shareLocation, sharedLocation, handleSendMsg } = this.props
    const shortenName = fullName && fullName.split(' ').map((ch) => ch.length > 0 ? ch[0] : '').join('')
    messages.sort((a, b) => a.createdAt - b.createdAt)
    return (
      <div className='chatting' ref={ref => this.myRef = ref}>
          <div className='header'>
            <div className='back-btn' onClick={navigateBack}><Icon style={{ fontSize: 40, transform: 'translateY(-50%)', marginTop: '50%', color: 'white', marginLeft: 10 }} type='arrow-left' /></div>
            <div className='avatar'>{shortenName}</div>
            <div className='top-left'>
              <div className='name'>{fullName}</div>
            </div>
            {sharedLocation && (
            <Button
              type={sharedLocation.sharedIDs.includes(chatID) ? 'danger' : 'primary'}
              onClick={() => {
                if (sharedLocation.sharedIDs.includes(chatID)) {
                  shareLocation(chatID, 1, () => handleSendMsg('I stopped sharing my location with you', chatID))
                } else shareLocation(chatID, 0, () => handleSendMsg('I start sharing my location with you', chatID))
              }}
              className='share-location-btn'
            >
              <Icon type='environment' /><br />{sharedLocation.sharedIDs.includes(chatID) ? 'Stop' : 'Start'} share LOC.
            </Button>
            )}
          </div>
          <div className='chat-dialog' ref={this.dialogRef}>
            {messages.map(message => (
                <Message
                  key={message.id}
                  messageTime={message.createdAt}
                  content={message.content}
                  isSender={message.receiver === chatID}
                />
              )
            )}
          </div>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              this.props.handleSendMsg(this.state.typingMsg, chatID, () => this.setState({ typingMsg: null }))
            }}
            className='msg-input' style={{ width: '100%' }}>
            <Input
              value={this.state.typingMsg}
              onChange={(e) => this.setState({ typingMsg: e.target.value })}
              placeholder='Type something...'
              size='large'
              addonAfter={(
                <Button htmlType='submit'
                  onClick={this.handleSend}
                  style={{ width: 100 }}
                >
                  Send
                </Button>
              )}
            />
          </Form>
      </div>
    )
  }
}


export default Chatting