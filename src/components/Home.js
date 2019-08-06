import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Tone from 'tone'


var synth = new Tone.DuoSynth()
var synthB = new Tone.PolySynth()
var synthC = new Tone.DuoSynth()

var freeverb = new Tone.Freeverb().toMaster()
var pingPong = new Tone.PingPongDelay('4n', 0.2).toMaster()
var chorus = new Tone.Chorus(4, 2.5, 5)
var cheby = new Tone.Chebyshev(51)

synth.toMaster().chain(freeverb, chorus)
synthB.chain(pingPong,chorus,cheby).toMaster()
synthC.toMaster().chain(freeverb, chorus)



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

  handleSubmit(e) {
    e.preventDefault()
    this.toneSetup()
  }


  toneSetup(){


    const arrLabel = this.state.here.Label.toUpperCase().split('')
    console.log(arrLabel)
    let notes = arrLabel.filter(x => x.charCodeAt(0) >= 65 && x.charCodeAt(0) <= 71 )
    let notesH = notes.map(x => x = x +4)
    let notesL = notes.map(x => x = x +2)
    let notesM = notes.map(x => x = x +3)

    const arrName = this.state.name.toUpperCase().split('')

    console.log(parseInt(this.state.age)/100)
    freeverb.dampening.value = this.state.age*10

    var pattern = new Tone.Pattern(function(time, note){
      synth.triggerAttackRelease(note, 0.45)
    }, notesH, "random")

    var pattern2 = new Tone.Pattern(function(time, note){
      synthB.triggerAttackRelease(note, 0.2)
    }, notesL.reverse().concat(notes.map(x => x = x +1)), "random")

    var pattern3 = new Tone.Pattern(function(time, note){
      synthC.triggerAttackRelease(note, 1.85)
    }, notesM, "random")

    pattern.start(0)
    pattern2.start(0)
    pattern3.start(0)

    Tone.Transport.start()
    Tone.Transport.bpm.value = this.state.age
    Tone.Transport.bpm.rampTo((this.state.age *5), 300)


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
        <canvas id="myCanvas" width="500" height="500" style={{border: '5px solid #000000'}}>
        </canvas>
      </div>



    )
  }
}
export default Home
