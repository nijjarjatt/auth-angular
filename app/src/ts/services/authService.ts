import {ICredentials} from "../controllers";
import * as config from "../config";
import * as services from "../services"; 

export interface IAuthService {
	login(cresdentials: ICredentials): any;
	logOut(userToken: any): any
}
export class AuthService implements IAuthService {	
	static $inject = ['$http', 'appApiConfig', 'storageService'];

	constructor(private $http: ng.IHttpService,
	private appApiConfig: config.IApiConfig,
	private storageService: services.IStorageService) {}

	login(cresdentials: ICredentials): any {
		let res:any;
		let loginUrl = this.appApiConfig.apiUrl + 'login';

		res = this.$http.post(
			loginUrl, 
			cresdentials,
			{
				headers:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj:any) {
			        var str: any[] = [];

			        for(var p in obj){
			        	str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        }			        			        
			        return str.join("&");
			    }
			}
		).then((res: any) => {
			this.storageService.setUserToken(angular.fromJson(res.data).accessToken);
			return angular.fromJson(res.data).user;
		});
		return res;
	}

	logOut(userToken: any): any {
		let res:any;
		let logOutUrl = this.appApiConfig.apiUrl + 'logout';

		res = this.$http.post(
			logOutUrl, 
			{
				userToken: userToken
			}
		).then((response: any) => {
			this.storageService.resetUserToken();
			return response;
		});
		return res;
	}
}