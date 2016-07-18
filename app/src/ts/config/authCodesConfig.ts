export interface IAuthEvents{
	loginSuccess: string;
	loginFailed: string;
	logoutSuccess: string;
	logoutFailed: string;
}

export class AuthEvents implements IAuthEvents{
	loginSuccess: string;
	loginFailed: string;
	logoutSuccess: string;
	logoutFailed: string;

	constructor() {
		this.loginSuccess = 'auth-login-success';
		this.loginFailed = 'auth-login-fail';		
		this.logoutSuccess= 'auth-logout-success';
		this.logoutFailed = 'auth-logout-fail';
	}

	static factory(): IAuthEvents{
		return new AuthEvents();
	}
}