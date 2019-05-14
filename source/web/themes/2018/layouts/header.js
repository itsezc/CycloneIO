import React, { Component } from 'react'

export default class Header extends Component {
	render() {
		return (
			<habbo-header-large>
				<div habbo-sticky-header='true' className='header__top sticky-header sticky-header--top'>
					<div className='wrapper'>
						<div className='header__top__content'>
							<div className='header__login-form'>
								<habbo-login-form>
									<form habbo-shake='true' className='login-form__form'>
										<fieldset className='form__fieldset login-form__fieldset'>
											<div className='form__field'>
												<input 
													className='form__input login-form__input'
													name='email'
													habbo-email='true'
													placeholder='Email'
													autoFocus
													required
												/>
											</div>
										</fieldset>
										<fieldset className='form__fieldset login-form__fieldset'>
											<div className='form__field'>
												<input 
													className='form__input login-form__input'
													name='password'
													type='password'
													placeholder='Password'
													required
												/>
											</div>
											<habbo-claim-password className="form__helper login-form__helper">
												<small><a>I've forgotten my password</a></small>
											</habbo-claim-password>
										</fieldset>
										
										<button type="submit" className="login-form__button">Let's go!</button>
									</form>
									<div className="login-form__social">
										<habbo-facebook-connect on-login="LoginController.onLogin()" type="large">
											<button className="facebook-connect">Login with Facebook</button>
										</habbo-facebook-connect>
										<habbo-facebook-connect on-login="LoginController.onLogin()" type="small">
											<button className="facebook-connect"></button>
										</habbo-facebook-connect>
										<div className="login-form__rpx">
											<habbo-rpx-login>
												<a className="janrainEngage">More ways to login</a>
											</habbo-rpx-login>
										</div>
									</div>
								</habbo-login-form>
							</div>
						</div>
					</div>
				</div>
				<div className="header__content">
					<habbo-register-banner>
						<div className="register-banner__hotel"></div>
						<div className="register-banner__wrapper">
							<div className="register-banner__register">
								<h1 className="register-banner__logo">Habbo</h1>
								<h2 className="register-banner__title">Make friends &amp; chat with millions in a virtual world</h2>
								<a href="/registration" habbo-android-download-link="" habbo-ios-download-link="" className="register-banner__button" translate="REGISTER_PROMPT">
									Join for free!
								</a>
								<habbo-local-register-banner></habbo-local-register-banner>
							</div>
						</div>
					</habbo-register-banner></div>
				<header className="header__wrapper wrapper">
					<a href="/" className="header__habbo__logo">
						<h1 className="header__habbo__name" id="ga-linkid-habbo-large">Habbo</h1>
					</a>
				</header>
				<habbo-navigation active="home">
					<nav className="navigation">
						<ul className="navigation__menu">
							<li className="navigation__item">
								<a href="/" className="navigation__link navigation__link--home navigation__link--active" id="ga-linkid-home">Home</a>
							</li>
							<li className="navigation__item">
								<a href="/community" className="navigation__link navigation__link--community" id="ga-linkid-community">Community</a>
							</li>
							<li className="navigation__item">
								<a href="/shop" className="navigation__link navigation__link--shop" id="ga-linkid-shop">Shop</a>
							</li>
							<li className="navigation__item">
								<a href="/playing-habbo" className="navigation__link navigation__link--playing-habbo" id="ga-linkid-playing-habbo">Playing Habbo</a>
							</li>
						</ul>
					</nav>
				</habbo-navigation>
			</habbo-header-large>
        )
	}
}