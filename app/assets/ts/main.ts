/// <reference path="../../../typings/index.d.ts" />

import * as loginController from "./controllers/loginCtrl";
import * as appController from "./controllers/appCtrl";
import * as authCodesConfig from "./config/authCodesConfig";
import * as apiConfigService from "./config/apiConfig";
import * as authService from "./services/authService";

let app = angular.module('authApp', []);
app
	.controller('loginController', loginController.LoginCtrl)
	.controller('appController', appController.AppCtrl)
	.constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())	
	.constant('appApiConfig', apiConfigService.ApiConfig.factory())
	.service('authService', authService.AuthService);

