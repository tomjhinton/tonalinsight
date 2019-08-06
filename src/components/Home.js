import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'




class Home extends React.Component{
  constructor(){
    super()
    this.state = {
      data: {},
      error: '',
      latitude: 37.7577,
      longitude: -122.4376
    }

    this.displayLocationInfo = this.displayLocationInfo.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }
  displayLocationInfo(position) {
    this.setState({
      ...this.state,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude


    }
    )
    axios.get(`https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${this.state.latitude},${this.state.longitude},355&mode=retrieveAddresses&maxresults=1&gen=9&app_id=${process.env.HereAppId}&app_code=${process.env.HereAppCode}`)
      .then(res => this.setState({ here: res.data.Response.View[0].Result[0].Location.Address

      }))

  }


  componentDidMount(){
    console.log(this)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo)



    }

  }

  handleChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value})
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value)
    event.preventDefault()
  }


  render() {

    console.log(this.state)
    return (
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <form onSubmit={this.handleSubmit}>
              <label>
              Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} name="name" />
              </label>
              <label>
              Age:
                <input type="number" value={this.state.value} onChange={this.handleChange} name="age" />
              </label>
              <label>
              Gender:
                <input type="text" value={this.state.value} onChange={this.handleChange} name="gender" />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
          <div className='column'>
            {this.state.longitude}<br/>
            {this.state.latitude}

            {this.state.here && <div>
              {`You're in ${this.state.here.City}`}
            </div>}
          </div>
        </div>
      </div>



    )
  }
}
export default Home
