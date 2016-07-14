export interface IAuthEvents{
	loginSuccess: string
}

export class authEvents implements IAuthEvents{
	loginSuccess: string;

	constructor() {
		this.loginSuccess = 'auth-login-success'
	}

	static factory(): authEvents{
		return new authEvents();
	}
}