import IUser from "./IUser";

export default interface IUserManager {
	/**
	 * Gets a specific user by its id.
	 *
	 * @param id The id to search.
	 */
	getUser(id: number): IUser | undefined

	/**
	 * Adds a specific user to the users map.
	 *
	 * @param user The user wanted to add
	 */
	addUser(user: IUser): void

	/**
	 * Adds more than one user to the users map.
	 *
	 * @param users The users wanted to add
	 */
	addUsers(users: IUser[]): void

	/**
	 * Removes a specific user by its id from the users map.
	 *
	 * @param id The id of the user wanted to remove
	 * @returns boolean If removal is successful
	 */
	removeUser(id: number): boolean
}