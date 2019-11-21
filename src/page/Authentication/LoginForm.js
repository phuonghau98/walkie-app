import React from 'react'
import { Form, Icon, Input, Button } from 'antd'


const LoginForm = (props) => {
  const { getFieldDecorator } = props.form
  const { handleChange, handleLogin, msg, msgStatus } = props
  return (
    <Form onSubmit={handleLogin} onChange={handleChange}>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'This field is required' }],
        })(
          <Input
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder='Email or phone number'
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'This field is required' }],
        })(
          <Input
            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            type='password'
            placeholder='Password'
          />
        )}
      </Form.Item>
      {msg !== null && <div style={{ textAlign: 'center', color: msgStatus ? 'green' : 'red' }}>{msg}</div>}
      <div style={{ textAlign: 'center' }}>
        <a className='login-form-forgot' href='/'>
          Forgot password
            </a>
        <div>
          <Button type='primary' htmlType='submit' className=''>
            Log in
            </Button>
        </div>
        Or <a href='/'>register now!</a>
      </div>
    </Form>
  )
}

export default LoginForm