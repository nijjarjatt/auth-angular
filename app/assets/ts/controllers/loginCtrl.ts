export interface ICredentials{
	username: string | number,
	password: string | number	
};

export interface ILoginCtrl {
	credentials: ICredentials;
	login(credentials: ICredentials): void;
};

export class LoginCtrl implements ILoginCtrl{	
	static $inject = ['$rootScope', 'AUTH_EVENTS', 'authService'];
	credentials: ICredentials;

	constructor(private $rootScope: ng.IRootScopeService, 
	private auth_events: any,
	private authService: any){
		this.credentials = {
			username: '',
			password: ''
		}
	}

	login(credentials: ICredentials): void{		
		this.authService.login(credentials)
		.then((response: any) => {
			this.$rootScope.$broadcast(this.auth_events.loginSuccess, 'Login Successful');
		}, (error: any) => {
			this.$rootScope.$broadcast(this.auth_events.loginFailed, 'Login Failed');
		});
	}

}