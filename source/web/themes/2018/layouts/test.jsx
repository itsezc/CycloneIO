import React, { Component } from 'react'

export default class Test extends Component {
    render() {
		let path = '../../../..'
		let webBuild = path.concat('/', 'web-build', '/')
		let icons = path.concat(webBuild, 'icons', '.png')

        return (
			
            pug`
                .header
                    .login-form
                        input.email(type='email', name='email')
                        input.password(type='password', name='password')
                        p.claim-password
                        button.login(type='submit', name='login')
                        a.facebook-connect(href='/')
                            img(src=${icons})

                    .register-banner
                        p.title 
                        button.register(type='submit', name='register')
                    .logo

                .navigation
                    .home
                    .community
                    .shop
                    .playing-habbo

                .tabs
                    .news
                        p.latest
                        .header
                            p.title
                            p.date
                            p.category
                            a.logo(href='/')
                                img(src=${icons})

                        a.more

                    .web-pages
                        p.title
                        .box
                            p.content

                .footer
                    p.follow

                    a.facebook(href='/')
                        img(src=${icons})

                    a.twitter(href='/')
                        img(src=${icons})

                    a.youtube(href='/')
                        img(src=${icons})

                    a.instagram(href='/')
                        img(src=${icons})

                    a.support
                    a.safety
                    a.parents
                    a.terms-of-service
                    p.copyright
                    a.company Sulake
            `
        )
    }
}