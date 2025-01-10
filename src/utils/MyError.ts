class MyError extends Error {
	code: number

	constructor(code: number, message: string) {
		super(message)
		this.code = code
		this.name = 'MyError'
	}

}

export default MyError;