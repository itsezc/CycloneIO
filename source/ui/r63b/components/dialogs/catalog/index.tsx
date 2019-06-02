import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import Dialog from '../../../helpers/dialog'
import { dragElement } from '../../../utils/functions'

import CatalogBanner from './components/banner'

import CatalogFrontPage from './layouts/frontpage'
import CatalogFurniPage from './layouts/furniture'

type AlertState = {
    category: number
    catalogue: any[]
}

export default class Alert extends Component<any, AlertState> {

    private assets: any
    private categories: {}
    private defaultPages: {}

    constructor(props: any) {
        super(props)

        this.assets = {
            url: 'http://localhost:8080/catalogue/',
            icons: {
                directory: 'icons',
                format: 'png'
            },
            banners: {
                directory: 'banners',
                format: 'gif'
            }
		}

        this.state = {
            category: 0,

            // @@MOCK
            catalogue: [
                { id: 0, parent: -1, name: 'Front Page', icon: '213', banner: 'frontpage', layout: 'frontpage' },
                {
                    id: 1,
                    parent: -1,
                    name: 'Furni',
                    description: `Habbo Exchange is where you can convert your Credits into a tradable currency. You can then use this
                        currency to trade for Furni or just show off your riches in your room.`,
                    icon: 'icon_146',
                    banner: 'exchange',
                    layout: 'furniture'
                },
                {
                    id: 2,
                    parent: -1,
                    name: 'Clothing',
                    description: 'Need some inspiration? Look no further.',
                    icon: 'icon_195',
                    banner: 'clothing',
                    layout: 'furniture'
                },
                {
                    id: 3,
                    parent: -1,
                    name: 'Pets',
                    description: `Pets are inhabitants of Habbo Hotel so each pet owner needs to know a bit about them. If you want to look after your pet properly, 
                        make sure you read the following points carefully.`,
                    icon: '8',
                    banner: 'pets',
                    layout: 'furniture'
                },
                {
                    id: 4,
                    parent: -1,
                    name: 'Memberships',
                    icon: '5',
                    banner: 'club',
                    layout: 'furniture'
                },
                {
                    id: 5,
                    parent: 1,
                    name: 'Spaces',
                    description: 'This is an example description for spaces',
                    icon: '6',
                    layout: 'furniture'
                },
                {
                    id: 6,
                    parent: 1,
                    name: 'Backgrounds',
                    description: 'This is an example description for backgrounds',
                    icon: '7',
                    layout: 'furniture'
                }
            ]
        }

        this.categories = this.state.catalogue.map(page => {
            if (page.parent == -1) {
                return (
                    <Tab className='tab' key={page.id}>
                        {page.name}
                    </Tab>
                )
            }
        })

        this.defaultPages = this.state.catalogue.map(page => {
            if (page.parent == -1) {
                let layout = page.layout
                let content

                switch (layout) {
                    case 'frontpage':
                        content = <CatalogFrontPage />
                        break

                    default:
                        content = <CatalogFurniPage />
                        break
                }

                return (
                    <TabPanel key={page.id}>
                        <CatalogBanner
                            title={page.name}
                            description={page.description}
                            icon={this.assets.url.concat(
                                this.assets.icons.directory,
                                '/',
                                page.icon,
                                '.',
                                this.assets.icons.format
                            )}
                            banner={this.assets.url.concat(
                                this.assets.banners.directory,
                                '/',
                                page.banner,
                                '.',
                                this.assets.banners.format
                            )}
                        />
                        {content}
                    </TabPanel>
                )
            }
        })
    }

    componentDidMount() {
        dragElement(document.getElementById('catalog'))
    }

    render() {
        return (
            <Dialog
				id='catalog'
                title="Shop"
                resize={true}
                axis="y"
				width={570}
				height={630}>

                    <div className="catalog">

                        <Tabs
                            selectedTabClassName='active'
                            selectedIndex={this.state.category}
                            onSelect={(category: number) => this.setState({ category })}
                        >
                            <TabList className='tabs'>{this.categories}</TabList>

                            {this.defaultPages}
                        </Tabs>
                </div>
			</Dialog>
        )
    }
}
