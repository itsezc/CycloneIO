import Engine from '../engine'

const LOCAL_RESOURCES = 'https://images.bobba.io/resource'

export default class AvatarImager {

    private figuremap: any
    private figuredata: any
    private partsets: any
    private animations: any

    public constructor(private readonly engine: Engine) {
        this.engine = engine
    }

    public async initialize(): Promise<void> {
        await this.fetchResources().then(() => {
            console.info({ gamedata: { figuremap: this.figuremap, figuredata: this.figuredata,
                                       partsets: this.partsets, animations: this.animations }}, 'loaded')
        })
    }

    private async fetchResources(): Promise<void> {

        this.figuremap = await this.fetchResource(`${LOCAL_RESOURCES}/map.json`)

        this.figuredata = await this.fetchResource(`${LOCAL_RESOURCES}/figuredata.json`)

        this.partsets = await this.fetchResource(`${LOCAL_RESOURCES}/partsets.json`)

        this.animations = await this.fetchResource(`${LOCAL_RESOURCES}/animation.json`)

    }

    private async fetchResource(URL: string): Promise<any> {

        const options: RequestInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        }

        let response = await fetch(URL, options)
        let data = await response.json()

        return data
    }
}