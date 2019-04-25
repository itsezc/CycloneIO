import HeaderLanding from '../layouts/landing/header.jsx'
import Login from '../components/login.index.jsx'

class Home extends React.Component {
	componentDidMount() {
		$(document).ready(() => {
			$('.parallax').parallax()
		})

		let typewriter = new Typewriter('#typewriter', {
			autoStart: true
		})

		typewriter
			.changeDelay(35)
			.changeDeleteSpeed(2)
			.typeString('Did you know that Cyclone has 10 users from Southampton online?')
			.deleteAll(2)
			.typeString('Join them now and say Hello!')
			.deleteAll(2)
			.typeString('You could have a chat, play games, design your own room and much more!')
			.deleteAll(2)
			.typeString('On a phone? no problem, Cyclone is designed in HTML5 so game on!')
			.deleteAll(2)
			.typeString('So what are you waiting for? Hop on for the best hotel experience ever PERIOD.')
			.start()
	}

	render() {
		return (
			<div>
				<HeaderLanding page='home' />
				<div className='parallax-container'>
					<div className='parallax'>
						<img src='https://i.imgur.com/GkLHzA4.png' />
						<div className='valign-wrapper'>
							<div className='container'>
								<div className='row'>

									<div className='col s12 m12 l8'>
										<div className='valign-wrapper'>
											<a className='waves-effect waves-light btn-large'>REGISTER NOW</a>
										</div>
									</div>

									<div className='col s12 m12 l4'>
										<Login />

									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='section white'>
					<div className='container row'>
						<h4 className='header' id='typewriter'>Hello World Join Cyclone Now and get 1000 Credits and 2500 Duckets</h4>
					</div>
				</div>
				<div className='section blue darken-2 white-text'>
					<div className='container row'>
						<div className='col s12 m6'>
							<h5 className='header'>Why Cyclone?</h5>
						</div>
						<div className='col s12 m6'>
							<h5 className='header'>Whats New in Cyclone?</h5>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default Home
