import React from 'react'
import { inject } from 'mobx-react'
import { Form, Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import '../style.css'
import axios from 'axios'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
const { TabPane } = Tabs

const WrappedLogin = Form.create({ name: 'login_form' })(LoginForm)
const WrappedRegister = Form.create({ name: 'register_form' })(RegisterForm)

@inject('rootStore')
class Authentication extends React.Component {
  state = {
    loginMsg: '',
    loginMsgStatus: 0,
    registerMsgStatus: 0,
    registerMsg: '',
    currentTabKey: null
  }

  loginRef = React.createRef()
  registerRef = React.createRef()

  handleLoginChange = e => {
    if (this.state.loginMsg !== null) this.setState({ loginMsg: '' })
  }

  handleRegisterChange = e => {
    if (this.state.registerMsg !== null) this.setState({ registerMsg: '' })
  }

  handleLogin = e => {
    e.preventDefault()
    const _that = this
    this.loginRef.current.validateFields((err, values) => {
      this.setState({ loginMsg: '' })
      if (!err) {
        const { email, password } = values
        axios.post('http://34.87.24.184:8080/user/authenticate', {
          email,
          password
        })
          .then(res => {
            if (res && res.status === 200) {
              const { history } = _that.props
              const { token } = res.data
              window.localStorage.setItem('token', token)
              this.props.rootStore.setAuthenticationState(true)
              history.push('/home')
            }
          })
          .catch(err => {
            this.loginRef.current && this.loginRef.current.resetFields()
            if (!err.response) {
              return this.setState({ loginMsg: 'Operation failed', loginMsgStatus: 0 })
            }
            const { status } = err.response
            if (status === 401) {
              this.setState({ loginMsg: 'You have entered an invalid username or password', loginMsgStatus: 0 })
            } else if (status === 500) {
              this.setState({ loginMsg: 'Something went wrong on server', loginMsgStatus: 0 })
            }
          })
      }
    })
  }

  handleRegister = (e) => {
    e.preventDefault()
    this.registerRef.current.validateFields((err, values) => {
      if (!err) {
        const { email, password, firstName, lastName } = values
        axios.post('http://34.87.24.184:8080/user/create', {
          email,
          password,
          firstName,
          lastName
        })
          .then(res => {
            if (res && res.status === 200) {
              this.setState({
                loginMsgStatus: 1,
                currentTabKey: '1',
                loginMsg: 'Register successfully! Enjoy walkie!'
              })
            }
          })
          .catch(err => {
            this.registerRef.current.resetFields()
            console.log(err)
            if (!err.response) {
              return this.setState({ registerMsg: 'Operation failed', msgStatus: 0 })
            }
            const { status } = err.response
            if (status === 409) {
              this.setState({ registerMsg: 'Username was taken by another user', msgStatus: 0 })
            }
          })
      }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.registerRef.current
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.registerRef.current
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key
    })
  }

  render() {
    return (
      <React.Fragment>
      <div className='login-wrapper'>
          <h1 className='logo'>Walkie</h1>
          <Tabs activeKey={this.state.currentTabKey || '1'} onChange={this.handleTabChange} type='card' className='form'>
            <TabPane tab='Login' key='1'>
              <WrappedLogin
                msg={this.state.loginMsg}
                handleLogin={this.handleLogin}
                handleChange={this.handleLoginChange}
                ref={this.loginRef}
                msgStatus={this.state.loginMsgStatus}
              />
            </TabPane>
            <TabPane tab='Register' key='2'>
              <WrappedRegister
                handlerRegister={this.handleRegister}
                validateToNextPassword={this.validateToNextPassword}
                compareToFirstPassword={this.compareToFirstPassword}
                handleConfirmBlur={this.handleConfirmBlur}
                handleChange={this.handleRegisterChange}
                ref={this.registerRef}
                msg={this.state.registerMsg}
                msgStatus={this.state.registerMsgStatus}
              />
            </TabPane>
          </Tabs>
      </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Authentication)
