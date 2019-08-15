import IUser from "./IUser";

export default interface IUserManager {
	/**
	 * Gets a specific user by its id.
	 *
	 * @param id The id to search.
	 */
	getUser(id: number): IUser | undefined

	/**
	 * Adds a specific user to the users array.
	 *
	 * @param user The user wanted to add
	 */
	addUser(user: IUser): void

	/**
	 * Removes a specific user by its id from the users array.
	 *
	 * @param id The id of the user wanted to remove
	 * @returns boolean If removal is successful
	 */
	removeUser(id: number): boolean
}