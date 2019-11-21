import React from 'react'
import ReactDOM from 'react-dom'
import App from './page/App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'mobx-react'
import RootStore from './tools/mobx/root'

const rootStore = new RootStore()
ReactDOM.render(<Provider rootStore={rootStore}><App /></Provider>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
