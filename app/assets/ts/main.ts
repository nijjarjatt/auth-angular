/// <reference path="../../../typings/index.d.ts" />

import * as appController from "./controllers/appCtrl";
import * as loginController from "./controllers/loginCtrl";
import * as authCodesConfig from "./config/authCodesConfig";
import * as apiConfig from "./config/apiConfig";
import * as authService from "./services/authService";
import * as storageService from "./services/storageService";

let app = angular.module('authApp', []);
app
	.controller('loginController', loginController.LoginCtrl)
	.controller('appController', appController.AppCtrl)
	.constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())	
	.constant('appApiConfig', apiConfig.ApiConfig.factory())
	.service('authService', authService.AuthService)
	.service('storageService', storageService.StorageService);

