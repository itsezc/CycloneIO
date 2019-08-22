export default abstract class Logger {
    private readonly consoleStyle: string
    private readonly className: string

    protected constructor(consoleColor: string, className: string) {
        this.consoleStyle = `color: ${consoleColor}; font-weight: bold; padding: 5px 5px 5px 0`
        this.className = className
    }

    protected log(message: string): void {
        console.log(`%c [${this.className}] ${message}`, this.consoleStyle)
    }
}