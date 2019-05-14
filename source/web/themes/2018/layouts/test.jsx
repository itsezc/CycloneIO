import React, { Component } from 'react'

export default class Test extends Component {
    render() {
        return (
			pug`
				.header-large
					.login-form
                        input.email(type='email', name='email')
                        input.password(type='password', name='password')
						p.claim-password
                        button.login
                        .social
                            button.facebook-connect
                            a.login
                    .register-banner
                        p.title
                        button.register		
                    .logo
                
                .navigation

                        
        )
    }
}