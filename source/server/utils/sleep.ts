export default function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve: any) => setTimeout(resolve(), milliseconds))
}