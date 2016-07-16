export interface IStorageService {
	setUserToken(token: string): void;
	getUserToken(): string;
	isAuthenticated(): boolean;
}
export class StorageService implements IStorageService {	
	static $inject = ['$window'];
	
	constructor(private $window: ng.IWindowService) {}

	setUserToken(token: string): void {
		this.$window.localStorage['user-token'] = token;
	}

	getUserToken(): string {
		return this.$window.localStorage['user-token'];
	}

	isAuthenticated(): boolean {
		return (this.$window.localStorage['user-token'] !== undefined)
	}

}