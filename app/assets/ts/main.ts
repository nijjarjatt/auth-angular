/// <reference path="../../../typings/index.d.ts" />

import * as loginController from "./controllers/loginCtrl";
import * as authCodesConfig from "./config/authCodesConfig";

let app = angular.module('authApp', []);


app
	.controller('loginController', loginController.LoginCtrl)
	.constant('AUTH_EVENTS', authCodesConfig.authEvents.factory());

