import * as services from "../services"; 

export interface IAccntCtrl {
	logOut(): void;
};

export class AccntCtrl implements IAccntCtrl{	
	static $inject = ['$rootScope', 'AUTH_EVENTS', 'authService', '$state', 'storageService'];

	constructor(private $rootScope: ng.IRootScopeService, 
		private auth_events: any,
		private authService: any,
		private $state: ng.ui.IStateService,
		private storageService: services.IStorageService){}

	logOut(): void {
		let userToken: string = this.storageService.getUserToken();			
	
		this.authService.logOut(userToken)

		.then((res: any) => {
			this.$rootScope.$broadcast(this.auth_events.logoutSuccess, 'Logout Successful');
			this.$state.go('home');
		}, () => {
			this.$rootScope.$broadcast(this.auth_events.logoutFailed, 'Logout Failed');
		});
	}
}