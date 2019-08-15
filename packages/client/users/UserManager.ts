import IUser from './IUser'
import IUserManager from "./IUserManager";

export default class UserManager implements IUserManager {
	private users: IUser[]

	/**
	 * This class is a service which is assigned to a room
	 * to have storage of all the users that room has.
	 *
	 * @param users The starting users if there are.
	 */
	public constructor(users?: IUser[]) {
		this.users = users || []
	}

	/**
	 * Gets a specific user by its id.
	 *
	 * @param id The id to search.
	 */
	public getUser(id: number): IUser | undefined {
		return this.users.find(u => u.id === id)
	}

	/**
	 * Adds a specific user to the users array.
	 *
	 * @param user The user wanted to add
	 */
	public addUser(user: IUser) {
		this.users.push(user)
	}

	/**
	 * Removes a specific user by its id from the users array.
	 *
	 * @param id The id of the user wanted to remove
	 * @returns boolean If removal is successful
	 */
	public removeUser(id: number): boolean {
		const oldUserLength = this.users.length

		this.users = this.users.filter(u => u.id !== id)

		return oldUserLength !== this.users.length
	}
}