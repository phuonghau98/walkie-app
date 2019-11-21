import React from 'react'

class Home extends React.Component {
  state = {
    lng: null,
    lat: null
  }
  componentDidMount () {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords
      this.setState({
        lng: longitude,
        lat: latitude
      })
    })
  }

  render () {
    return (
      <div className='home-wrapper'>

      </div>
    )
  }
}

export default Home