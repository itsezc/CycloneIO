import React, { Component } from 'react'

export default class Footer extends Component {
	render() {
		return (
			<habbo-footer>
				<footer className="wrapper">
					<div className="footer__media">
						<p className="footer__media__label" translate="FOLLOW_HABBO">Follow Habbo</p>
						<ul itemScope="" itemType="http://schema.org/Organization">
							<link itemProp="url" href="https://www.habbo.com" />
							<li className="footer__media__item">
								<a href="https://www.facebook.com/Habbo" className="footer__media__link" target="_blank" itemProp="sameAs" rel="noopener noreferrer">
									<i className="icon icon--facebook"></i>
								</a>
							</li>
							<li className="footer__media__item">
								<a href="https://twitter.com/Habbo" className="footer__media__link" target="_blank" itemProp="sameAs" rel="noopener noreferrer">
									<i className="icon icon--twitter"></i>
								</a>
							</li>
							<li className="footer__media__item">
								<a href="https://www.youtube.com/user/Habbo" className="footer__media__link" target="_blank" itemProp="sameAs" rel="noopener noreferrer">
									<i className="icon icon--youtube"></i>
								</a>
							</li>
							<li className="footer__media__item">
								<a href="https://www.instagram.com/habboofficial" className="footer__media__link" target="_blank" itemProp="sameAs" rel="noopener noreferrer">
									<i className="icon icon--instagram"></i>
								</a>
							</li>
							<li className="footer__media__item">
								<a href="https://www.habbo.com/rss.xml" className="footer__media__link" target="_blank" itemProp="sameAs" rel="noopener noreferrer">
									<i className="icon icon--rss"></i>
								</a>
							</li>
						</ul>
					</div>
					<div className="footer__content">
						<ul className="footer__nav">
							<li ng-repeat="link in FooterController.links" className="footer__nav__item">
								<a ng-href="http://help.habbo.com" className="footer__nav__link" target="_blank" rel="noopener noreferrer" translate="FOOTER_SUPPORT" href="http://help.habbo.com">Customer Support &amp; Helpdesk</a>
							</li>
							<li ng-repeat="link in FooterController.links" className="footer__nav__item">
								<a ng-href="/playing-habbo/safety" className="footer__nav__link" target="_blank" rel="noopener noreferrer" translate="FOOTER_SAFETY" href="/playing-habbo/safety">Safety</a>
							</li>
							<li ng-repeat="link in FooterController.links" className="footer__nav__item">
								<a ng-href="https://help.habbo.com/forums/144065-information-for-parents" className="footer__nav__link" target="_blank" rel="noopener noreferrer" translate="FOOTER_PARENTS" href="https://help.habbo.com/forums/144065-information-for-parents">For parents</a>
							</li>
							<li ng-repeat="link in FooterController.links" className="footer__nav__item">
								<a ng-href="https://help.habbo.com/entries/23096348-Terms-of-Service-and-Privacy-Policy" className="footer__nav__link" target="_blank" rel="noopener noreferrer" translate="FOOTER_TOS_AND_PRIVACY" href="https://help.habbo.com/entries/23096348-Terms-of-Service-and-Privacy-Policy">Terms of Service &amp; Privacy Policy</a>
							</li>
							<li ng-repeat="link in FooterController.links" className="footer__nav__item">
								<a ng-href="mailto:advertising@sulake.com" className="footer__nav__link" target="_blank" rel="noopener noreferrer" translate="FOOTER_ADVERTISERS" href="mailto:advertising@sulake.com">advertising@sulake.com</a>
							</li>
						</ul>
						<p className="footer__copyright" translate="FOOTER_COPYRIGHT">© 2004 - 2019 Sulake Oy. HABBO is a registered trademark of Sulake Oy in the European Union, the USA, Japan, the People's Republic of China and various other jurisdictions. All rights reserved.</p>
						<a href="http://www.sulake.com" target="_blank" rel="noopener noreferrer" className="footer__sulake">Sulake</a>
					</div>
				</footer>
			</habbo-footer>
		)
	}
}