import Engine from './engine'

export default class Environment {
	
	static instance: Engine 

	static getClient(): Engine {

		if (this.instance === null) {
			this.instance = new Engine()
		}

		return this.instance
	}
}