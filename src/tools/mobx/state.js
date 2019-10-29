import { observable } from 'mobx'

class RootState {
  @observable isAuthenticated = false
}