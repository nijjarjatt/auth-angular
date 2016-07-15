import {ICredentials} from "../controllers/loginCtrl.ts";
import * as appApiConfig from "../config/apiConfig.ts";

export interface IAuthService {
	login(cresdentials: ICredentials): any;
}
export class AuthService implements IAuthService {	
	static $inject = ['$http', 'appApiConfig'];

	constructor(private $http: ng.IHttpService,
	private appApiConfig: appApiConfig.IApiConfig){

	}

	login(cresdentials: ICredentials): any{
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
		);
		return res;
	}
}