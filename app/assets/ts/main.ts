/// <reference path="../../../typings/index.d.ts" />

import * as appController from "./controllers/appCtrl";
import * as loginController from "./controllers/loginCtrl";
import * as authCodesConfig from "./config/authCodesConfig";
import * as apiConfig from "./config/apiConfig";
import * as appConfig from "./config/appConfig";
import * as authService from "./services/authService";
import * as storageService from "./services/storageService";

let app = angular.module('authApp', ['ui.router']);
app
	
.config(appConfig.appConfig)

.run(($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService) => {
	$rootScope.$on('$stateChangeError', (event: any, data: any) => {
		console.log('Redirecting due to no authentication');			
		$state.go('home');
	});
})

.constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())	
.constant('appApiConfig', apiConfig.ApiConfig.factory())

.service('authService', authService.AuthService)
.service('storageService', storageService.StorageService)

.controller('loginController', loginController.LoginCtrl);

