import React from 'react'
import {
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Col
} from 'antd'


const RegisterForm = (props) => {
  const { getFieldDecorator } = props.form
  const { handlerRegister, msgStatus, validateToNextPassword, compareToFirstPassword, handleConfirmBlur, msg, handleChange } = props
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }
  return (
    <Form onChange={handleChange} {...formItemLayout} onSubmit={handlerRegister}>
      <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Row gutter={15}>
        <Col span={12}>
          <Form.Item label="First name">
            {getFieldDecorator('firstName', {
              // initialValue: { number: 0, currency: 'rmb' },
              // rules: [{ validator: this.checkPrice }],
              rules: [{ required: true, message: 'First name is required' }]
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Last name'>
            {getFieldDecorator('lastName', {
              rules: [{ required: true, message: 'Last name is required' }]
            })(<Input />)}
          </Form.Item>
        </Col>
        </Row>
        {/* <Form.Item label='Last name'>
            {getFieldDecorator('lastname', {
              rules: [{ required: true, message: 'Last name is required' }]
            })(<Input />)}
          </Form.Item> */}
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
      <Form.Item label="Confirm Password" hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        {getFieldDecorator('agreement', {
          valuePropName: 'checked',
          rules: [{ required: true, message: "You have not agreed with our policy" }]
        })(
          <Checkbox>
            I have read the <a href="/">agreement</a>
          </Checkbox>,
        )}
      </Form.Item>
      {msg !== null && <div style={{ textAlign: 'center', color: msgStatus ? 'green' : 'red' }}>{msg}</div>}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" style={{ width: '100%' }} htmlType="submit">
          Register
      </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm