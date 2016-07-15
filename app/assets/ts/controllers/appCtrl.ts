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
			this.loginMessage = data;
		});
		this.$rootScope.$on(this.auth_events.loginFailed, (event: any, data: any) => {
			this.loginMessage = data;
		});
	}
}