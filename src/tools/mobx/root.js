import { observable, action, computed } from 'mobx'
import axios from 'axios'

class Position {
  @observable longitude
  @observable latitude
  @observable timeStamp
  constructor () {
    this.longitude = null
    this.latitude = null
    this.timeStamp = new Date().valueOf()
  }

  @action
  updatePosition () {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords
      if (position && longitude && latitude) {
        this.longitude = longitude
        this.latitude = latitude
        this.timeStamp = position.timestamp
        const token = window.localStorage.getItem('token')
        axios.post('http://34.87.24.184:8080/geolocation/update',
          { 'longitude': this.longitude, 'latitude': this.latitude },
          { headers: { 'Authorization': token } })
          .then(({ data }) => {
            console.log(data)
          }).catch(err => {
            console.log(err)
          })
      }
    })
  }
}

class UserProfile {
  @observable firstName = ''
  @observable lastName = ''
  @observable email = ''
  @observable id = ''
  constructor (email, firstName, lastName, id) {
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.id = id
  }

  @computed
  get shortenFullname () {
    return this.firstName.concat(' ' + this.lastName || '').split(' ').map((ch) => ch.length > 0 ? ch[0] : '').join('')
  }
}

class RootStore {
  @observable isAuthenticated = false
  @observable position = new Position()
  @observable isAppReady = false
  @observable userProfile = null
  @observable friends = []
  @observable messages = []
  @observable sharedLocations = []

  @action
  setAuthenticationState (v) {
    this.isAuthenticated = v
  }

  @action
  updateProfile (email, firstName, lastName, id) {
    this.userProfile = new UserProfile(email, firstName, lastName, id)
    this.fetchFriends()
    this.fetchSharedLocations()
    this.position.updatePosition()
    setInterval(() => {
      this.getNewMessages()
    }, 2000)
    if (!this.position.longitude && !this.position.latitude) this.position.updatePosition()
    setInterval(() => {
      this.position.updatePosition()
    }, 5000)
    setInterval(() => {
      this.fetchSharedLocations()
    }, 3000)
    setInterval(() => {
      this.fetchFriends()
    }, 3000)
  }

  @action
  setAppReadyState (v) {
    this.isAppReady = v
  }

  @action
  logout () {
    window.localStorage.removeItem('token')
    window.location.reload()
  }

  @action
  updateFriends (newFriendsList) {
    const prevFriendsList = this.friends.length
    this.friends = [...newFriendsList]
    if (newFriendsList.length > prevFriendsList) {
      this.initiallyFetchMsg()
    }
  }

  fetchFriends () {
    axios.get('http://34.87.24.184:8080/user/userlist').then(result => {
      if (result && result.data) {
        this.updateFriends(result.data.users)
      }
    })
      .catch(err => {
        console.log(err)
      })
  }

  initiallyFetchMsg () {
    const token = window.localStorage.getItem('token')
    const friendIDs = this.friends.map(friend => friend.id)
    axios.post('http://34.87.24.184:8080/message/lastmessages', { 'userIDs': friendIDs }, { headers: { 'Authorization': token }}).then(({ data }) => {
      if (data) {
        this.messages = data.messages
      }
    }).catch(err => {
      console.log(err)
    })
  }

  fetchSharedLocations () {
    const token = window.localStorage.getItem('token')
    axios.get('http://34.87.24.184:8080/geolocation/get',
    { headers: { 'Authorization': token } })
    .then(({ data }) => {
      if (data.locations) {
        this.sharedLocations = data.locations.map(location => {
          if (!location.sharedIDs) location.sharedIDs = []
          return location
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  getNewMessages () {
    let maxTimestamp = 0
    if (this.messages) {
      for (const msg of this.messages) {
        if (msg.createdAt > maxTimestamp) maxTimestamp = msg.createdAt
      }
      const token = window.localStorage.getItem('token')
      axios.post('http://34.87.24.184:8080/message/receive',
        { 'milestone': maxTimestamp * 1000 + 1000 },
        { headers: { 'Authorization': token } })
        .then(({ data }) => {
          if (data.messages) {
            if (!data.messages) data.messages = []
            for (const msg of data.messages) {
              this.messages.push(msg)
            }
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
}

export default RootStore