export interface IAuthEvents{
	loginSuccess: string;
	loginFailed: string;
}

export class AuthEvents implements IAuthEvents{
	loginSuccess: string;
	loginFailed: string;

	constructor() {
		this.loginSuccess = 'auth-login-success';
		this.loginFailed = 'auth-login-fail';
	}

	static factory(): IAuthEvents{
		return new AuthEvents();
	}
}