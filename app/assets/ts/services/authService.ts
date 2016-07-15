import {ICredentials} from "../controllers/loginCtrl";
import * as appApiConfig from "../config/apiConfig";
import * as storageService from "../services/storageService"; 

export interface IAuthService {
	login(cresdentials: ICredentials): any;
}
export class AuthService implements IAuthService {	
	static $inject = ['$http', 'appApiConfig', 'storageService'];

	constructor(private $http: ng.IHttpService,
	private appApiConfig: appApiConfig.IApiConfig,
	private storageService: storageService.IStorageService) {}

	login(cresdentials: ICredentials): any {
		let loginUrl = this.appApiConfig.apiUrl + 'login';
		let res:any;

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
			this.storageService.saveUserToken(angular.fromJson(res.data).accessToken);
			return res;
		});
		return res;
	}
}