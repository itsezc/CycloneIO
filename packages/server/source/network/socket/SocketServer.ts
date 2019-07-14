import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Routes from './routes'
import CycloneConfig from '../../../../common/types/config'

export const createEmulatorServer = async (config: CycloneConfig): Promise<Hapi.Server> => {

    const { server } = config
    const { port } = server

    const emulator = new Hapi.Server(
        {
            port
        }
    )

    await emulator.register(Inert)
    await emulator.route(Routes)

    return emulator
}

export default createEmulatorServer;