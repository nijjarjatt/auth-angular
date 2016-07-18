export interface IAppCtrl {
	loginMessage: string;
};

export class AppCtrl implements IAppCtrl{	
	loginMessage: string;

	static $inject = ['$rootScope', 'AUTH_EVENTS'];

	constructor(private $rootScope: ng.IRootScopeService,
	private auth_events: any){
		this.loginMessage = '';
		this.$rootScope.$on(this.auth_events.loginSuccess, (event: any, data: any) => {
			console.log('Login Success');
		});
		this.$rootScope.$on(this.auth_events.loginFailed, (event: any, data: any) => {
			console.log('Login Fail');
		});
		this.$rootScope.$on(this.auth_events.logoutSuccess, (event: any, data: any) => {
			console.log('Logout Success');
		});
		this.$rootScope.$on(this.auth_events.logoutFailed, (event: any, data: any) => {
			console.log('Logout Fail');
		});
	}
}