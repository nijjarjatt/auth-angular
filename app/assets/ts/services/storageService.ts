export interface IStorageService {
	saveUserToken(token: string): void;
	getUserToken(): string;
}
export class StorageService implements IStorageService {	
	static $inject = ['$window'];
	
	constructor(private $window: ng.IWindowService) {}

	saveUserToken(token: string): void {
		this.$window.localStorage['user-token'] = token;
	}

	getUserToken(): string {
		return this.$window.localStorage['user-token'];
	}
}