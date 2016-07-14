export interface ICredentials{
	username: string | number,
	password: string | number	
};

export interface ILoginCtrl {
	credentials: ICredentials;
	login(credentials: ICredentials): void;
};

export class LoginCtrl implements ILoginCtrl{	
	static $inject = ['$rootScope', 'AUTH_EVENTS'];
	credentials: ICredentials;

	constructor(private $rootScope: ng.IRootScopeService, 
	private auth_events: any){
		this.credentials = {
			username: '',
			password: ''
		}
	}

	login(credentials: ICredentials): void{
		console.log(this.auth_events);
		this.$rootScope.$broadcast(this.auth_events.loginSuccess);
	}

}