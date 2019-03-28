class Header extends React.Component {
	render() {
		return (
			<div>
				<nav className='blue'>
					<div className='container'>
						<div className='nav-wrapper'>
						 <a href='#' className='brand-logo'>
						 	<img src='https://upload.wikimedia.org/wikipedia/commons/6/6f/Habbo-logo.png' width='150' />
						 </a>
						 <ul id='nav-mobile' className='right hide-on-med-and-down'>
						   <li><a class='green waves-effect waves-light btn' href='collapsible.html'>Register</a></li>
						 </ul>
						</div>
					</div>
				</nav>
			</div>
		)
	}
}

export default Header
