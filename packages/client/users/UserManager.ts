import IUser from './IUser'
import IUserManager from "./IUserManager";

export default class UserManager implements IUserManager {
	private users: Map<number, IUser>

	/**
	 * This class is a service which is assigned to a room
	 * to have storage of all the users that room has.
	 *
	 * @param users The starting users if there are.
	 */
	public constructor(users?: IUser[]) {
		this.users = new Map<number, IUser>()

		if (users) {
			this.addUsers(users)
		}
	}

	/**
	 * Gets a specific user by its id.
	 *
	 * @param id The id to search.
	 */
	public getUser(id: number): IUser | undefined {
		return this.users.get(id)
	}

	/**
	 * Adds a specific user to the users array.
	 *
	 * @param user The user wanted to add
	 */
	public addUser(user: IUser): void {
		this.users.set(user.id, user)
	}

	/**
	 * Adds more than one user to the users map.
	 *
	 * @param users The users wanted to add
	 */
	public addUsers(users: IUser[]): void {
		users.forEach(user => {
			this.addUser(user)
		})
	}

	/**
	 * Removes a specific user by its id from the users array.
	 *
	 * @param id The id of the user wanted to remove
	 * @returns boolean If removal is successful
	 */
	public removeUser(id: number): boolean {
		return this.users.delete(id)
	}
}