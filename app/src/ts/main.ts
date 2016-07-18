/// <reference path="../../../typings/index.d.ts" />

import * as config from "./config";
import * as controllers from "./controllers";
import * as services from "./services";

let app = angular.module('authApp', ['ui.router']);

app
	
.config(config.appConfig)
.run(config.appRun)
.constant('AUTH_EVENTS', config.AuthEvents.factory())	
.constant('appApiConfig', config.ApiConfig.factory())
.service('authService', services.AuthService)
.service('storageService', services.StorageService)
.controller('loginController', controllers.LoginCtrl);

