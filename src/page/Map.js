import React from 'react'
import { observer, inject } from 'mobx-react'
import { Map as LeaMap, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
})
L.Marker.prototype.options.icon = DefaultIcon

@inject('rootStore')
@observer
class Map extends React.Component {
  state = {
    zoom: 17,
    lng: 106.62965,
    lat: 10.82302
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords
        console.log(longitude, latitude)
      })
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }

  render () {
    let position = null
    const myId = this.props.rootStore.userProfile.id
    const sharedLocations = this.props.rootStore.sharedLocations
    const { friends } = this.props.rootStore
    const { lng, lat } = this.state
    return (
      <div style={{ height: '100%' }}>
        <div className='map-navigator' style={{ height: 100, color: 'white' }}>
          <div style={{ fontSize: 20 }}>Available locations:</div>
          {this.props.rootStore.sharedLocations.map(location => {
            // console.log(toJS(location.))
            const friend = friends.find(friend => friend.id === location.userID)
            // console.log(friend.firstName)
            if (!friend) return null
            const { firstName, lastName } = friend
            const { longitude, latitude } = location
            return (
              <div onClick={() => this.setState({ lng: longitude, lat: latitude })} className='navigator-btn' key={location.userID}>
                {friend.id === myId ? 'Your Location' : firstName + ' ' + lastName}
              </div>
            )
          })}
        </div>
        <LeaMap style={{ height: 'calc(100% - 100px)'}} center={{ lng, lat }} zoom={this.state.zoom}>
          <TileLayer
            attribution=''
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position !== null && <Marker position={position} />}
          {sharedLocations.map((location) => {
            const { longitude, latitude } = location
            return (<Marker key={location.userID} position={{ lng: longitude, lat: latitude }} />)
          })}
        </LeaMap>
      </div>
    )
  }
}

export default Map