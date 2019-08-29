export default interface IMessageHandler {
    handleOpenConnection: () => void,
    handleCloseConnection: () => void,
    handleMessage: (rawMessage: string) => void,
    handleConnectionError: () => void
}