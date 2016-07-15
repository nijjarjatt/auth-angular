(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var ApiConfig = (function () {
    function ApiConfig() {
        this.apiUrl = 'http://localhost:3000/api/';
    }
    ApiConfig.factory = function () {
        return new ApiConfig();
    };
    return ApiConfig;
}());
exports.ApiConfig = ApiConfig;
},{}],2:[function(require,module,exports){
"use strict";
var AuthEvents = (function () {
    function AuthEvents() {
        this.loginSuccess = 'auth-login-success';
        this.loginFailed = 'auth-login-fail';
    }
    AuthEvents.factory = function () {
        return new AuthEvents();
    };
    return AuthEvents;
}());
exports.AuthEvents = AuthEvents;
},{}],3:[function(require,module,exports){
"use strict";
;
var AppCtrl = (function () {
    function AppCtrl($rootScope, auth_events) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.auth_events = auth_events;
        this.loginMessage = '';
        this.$rootScope.$on(this.auth_events.loginSuccess, function (event, data) {
            _this.loginMessage = data;
        });
        this.$rootScope.$on(this.auth_events.loginFailed, function (event, data) {
            _this.loginMessage = data;
        });
    }
    AppCtrl.$inject = ['$rootScope', 'AUTH_EVENTS'];
    return AppCtrl;
}());
exports.AppCtrl = AppCtrl;
},{}],4:[function(require,module,exports){
"use strict";
;
;
var LoginCtrl = (function () {
    function LoginCtrl($rootScope, auth_events, authService) {
        this.$rootScope = $rootScope;
        this.auth_events = auth_events;
        this.authService = authService;
        this.credentials = {
            username: '',
            password: ''
        };
    }
    LoginCtrl.prototype.login = function (credentials) {
        var _this = this;
        this.authService.login(credentials)
            .then(function (response) {
            _this.$rootScope.$broadcast(_this.auth_events.loginSuccess, 'Login Successful');
        }, function (error) {
            _this.$rootScope.$broadcast(_this.auth_events.loginFailed, 'Login Failed');
        });
    };
    LoginCtrl.$inject = ['$rootScope', 'AUTH_EVENTS', 'authService'];
    return LoginCtrl;
}());
exports.LoginCtrl = LoginCtrl;
},{}],5:[function(require,module,exports){
/// <reference path="../../../typings/index.d.ts" />
"use strict";
var loginController = require("./controllers/loginCtrl");
var appController = require("./controllers/appCtrl");
var authCodesConfig = require("./config/authCodesConfig");
var apiConfigService = require("./config/apiConfig");
var authService = require("./services/authService");
var app = angular.module('authApp', []);
app
    .controller('loginController', loginController.LoginCtrl)
    .controller('appController', appController.AppCtrl)
    .constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())
    .constant('appApiConfig', apiConfigService.ApiConfig.factory())
    .service('authService', authService.AuthService);
},{"./config/apiConfig":1,"./config/authCodesConfig":2,"./controllers/appCtrl":3,"./controllers/loginCtrl":4,"./services/authService":6}],6:[function(require,module,exports){
"use strict";
var AuthService = (function () {
    function AuthService($http, appApiConfig) {
        this.$http = $http;
        this.appApiConfig = appApiConfig;
    }
    AuthService.prototype.login = function (cresdentials) {
        var loginUrl = this.appApiConfig.apiUrl + 'login';
        var res;
        res = this.$http.post(loginUrl, cresdentials, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        });
        return res;
    };
    AuthService.$inject = ['$http', 'appApiConfig'];
    return AuthService;
}());
exports.AuthService = AuthService;
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcGlDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hdXRoQ29kZXNDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2FwcEN0cmwudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2xvZ2luQ3RybC50cyIsImFwcC9hc3NldHMvdHMvbWFpbi50cyIsImFwcC9hc3NldHMvdHMvc2VydmljZXMvYXV0aFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDSUE7SUFHQztRQUNDLElBQUksQ0FBQyxNQUFNLEdBQUcsNEJBQTRCLENBQUM7SUFDNUMsQ0FBQztJQUVNLGlCQUFPLEdBQWQ7UUFDQyxNQUFNLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ0YsZ0JBQUM7QUFBRCxDQVZBLEFBVUMsSUFBQTtBQVZZLGlCQUFTLFlBVXJCLENBQUE7OztBQ1REO0lBSUM7UUFDQyxJQUFJLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7SUFDdEMsQ0FBQztJQUVNLGtCQUFPLEdBQWQ7UUFDQyxNQUFNLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0YsaUJBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQVpZLGtCQUFVLGFBWXRCLENBQUE7OztBQ2ZBLENBQUM7QUFFRjtJQUtDLGlCQUFvQixVQUFnQyxFQUM1QyxXQUFnQjtRQU56QixpQkFlQztRQVZvQixlQUFVLEdBQVYsVUFBVSxDQUFzQjtRQUM1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBSztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FB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LEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3BCLFFBQVEsRUFDUixZQUFZLEVBQ1o7WUFDQyxPQUFPLEVBQUM7Z0JBQ1AsY0FBYyxFQUFFLG1DQUFtQzthQUNuRDtZQUNELGdCQUFnQixFQUFFLFVBQVMsR0FBTztnQkFDM0IsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO2dCQUVwQixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQSxDQUFDO29CQUNqQixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRSxDQUFDO2dCQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7U0FDSixDQUNELENBQUM7UUFDRixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ1osQ0FBQztJQTlCTSxtQkFBTyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBK0I1QyxrQkFBQztBQUFELENBaENBLEFBZ0NDLElBQUE7QUFoQ1ksbUJBQVcsY0FnQ3ZCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGludGVyZmFjZSBJQXBpQ29uZmlne1xyXG5cdGFwaVVybDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlDb25maWcgaW1wbGVtZW50cyBJQXBpQ29uZmlne1xyXG5cdGFwaVVybDogc3RyaW5nO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYXBpVXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmYWN0b3J5KCk6IElBcGlDb25maWd7XHJcblx0XHRyZXR1cm4gbmV3IEFwaUNvbmZpZygpO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSUF1dGhFdmVudHN7XHJcblx0bG9naW5TdWNjZXNzOiBzdHJpbmc7XHJcblx0bG9naW5GYWlsZWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEF1dGhFdmVudHMgaW1wbGVtZW50cyBJQXV0aEV2ZW50c3tcclxuXHRsb2dpblN1Y2Nlc3M6IHN0cmluZztcclxuXHRsb2dpbkZhaWxlZDogc3RyaW5nO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMubG9naW5TdWNjZXNzID0gJ2F1dGgtbG9naW4tc3VjY2Vzcyc7XHJcblx0XHR0aGlzLmxvZ2luRmFpbGVkID0gJ2F1dGgtbG9naW4tZmFpbCc7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZmFjdG9yeSgpOiBJQXV0aEV2ZW50c3tcclxuXHRcdHJldHVybiBuZXcgQXV0aEV2ZW50cygpO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSUFwcEN0cmwge1xyXG5cdGxvZ2luTWVzc2FnZTogc3RyaW5nO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcEN0cmwgaW1wbGVtZW50cyBJQXBwQ3RybHtcdFxyXG5cdGxvZ2luTWVzc2FnZTogc3RyaW5nO1xyXG5cclxuXHRzdGF0aWMgJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdBVVRIX0VWRU5UUyddO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdHByaXZhdGUgYXV0aF9ldmVudHM6IGFueSl7XHJcblx0XHR0aGlzLmxvZ2luTWVzc2FnZSA9ICcnO1xyXG5cdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmF1dGhfZXZlbnRzLmxvZ2luU3VjY2VzcywgKGV2ZW50OiBhbnksIGRhdGE6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLmxvZ2luTWVzc2FnZSA9IGRhdGE7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hdXRoX2V2ZW50cy5sb2dpbkZhaWxlZCwgKGV2ZW50OiBhbnksIGRhdGE6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLmxvZ2luTWVzc2FnZSA9IGRhdGE7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElDcmVkZW50aWFsc3tcclxuXHR1c2VybmFtZTogc3RyaW5nIHwgbnVtYmVyLFxyXG5cdHBhc3N3b3JkOiBzdHJpbmcgfCBudW1iZXJcdFxyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG9naW5DdHJsIHtcclxuXHRjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzO1xyXG5cdGxvZ2luKGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiB2b2lkO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2luQ3RybCBpbXBsZW1lbnRzIElMb2dpbkN0cmx7XHRcclxuXHRzdGF0aWMgJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdBVVRIX0VWRU5UUycsICdhdXRoU2VydmljZSddO1xyXG5cdGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHM7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG5cdHByaXZhdGUgYXV0aF9ldmVudHM6IGFueSxcclxuXHRwcml2YXRlIGF1dGhTZXJ2aWNlOiBhbnkpe1xyXG5cdFx0dGhpcy5jcmVkZW50aWFscyA9IHtcclxuXHRcdFx0dXNlcm5hbWU6ICcnLFxyXG5cdFx0XHRwYXNzd29yZDogJydcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvZ2luKGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiB2b2lke1x0XHRcclxuXHRcdHRoaXMuYXV0aFNlcnZpY2UubG9naW4oY3JlZGVudGlhbHMpXHJcblx0XHQudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCh0aGlzLmF1dGhfZXZlbnRzLmxvZ2luU3VjY2VzcywgJ0xvZ2luIFN1Y2Nlc3NmdWwnKTtcclxuXHRcdH0sIChlcnJvcjogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KHRoaXMuYXV0aF9ldmVudHMubG9naW5GYWlsZWQsICdMb2dpbiBGYWlsZWQnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCAqIGFzIGxvZ2luQ29udHJvbGxlciBmcm9tIFwiLi9jb250cm9sbGVycy9sb2dpbkN0cmxcIjtcclxuaW1wb3J0ICogYXMgYXBwQ29udHJvbGxlciBmcm9tIFwiLi9jb250cm9sbGVycy9hcHBDdHJsXCI7XHJcbmltcG9ydCAqIGFzIGF1dGhDb2Rlc0NvbmZpZyBmcm9tIFwiLi9jb25maWcvYXV0aENvZGVzQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwaUNvbmZpZ1NlcnZpY2UgZnJvbSBcIi4vY29uZmlnL2FwaUNvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyBhdXRoU2VydmljZSBmcm9tIFwiLi9zZXJ2aWNlcy9hdXRoU2VydmljZVwiO1xyXG5cclxubGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhdXRoQXBwJywgW10pO1xyXG5hcHBcclxuXHQuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgbG9naW5Db250cm9sbGVyLkxvZ2luQ3RybClcclxuXHQuY29udHJvbGxlcignYXBwQ29udHJvbGxlcicsIGFwcENvbnRyb2xsZXIuQXBwQ3RybClcclxuXHQuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywgYXV0aENvZGVzQ29uZmlnLkF1dGhFdmVudHMuZmFjdG9yeSgpKVx0XHJcblx0LmNvbnN0YW50KCdhcHBBcGlDb25maWcnLCBhcGlDb25maWdTZXJ2aWNlLkFwaUNvbmZpZy5mYWN0b3J5KCkpXHJcblx0LnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UuQXV0aFNlcnZpY2UpO1xyXG5cclxuIiwiaW1wb3J0IHtJQ3JlZGVudGlhbHN9IGZyb20gXCIuLi9jb250cm9sbGVycy9sb2dpbkN0cmwudHNcIjtcclxuaW1wb3J0ICogYXMgYXBwQXBpQ29uZmlnIGZyb20gXCIuLi9jb25maWcvYXBpQ29uZmlnLnRzXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXRoU2VydmljZSB7XHJcblx0bG9naW4oY3Jlc2RlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiBhbnk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIGltcGxlbWVudHMgSUF1dGhTZXJ2aWNlIHtcdFxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckaHR0cCcsICdhcHBBcGlDb25maWcnXTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLFxyXG5cdHByaXZhdGUgYXBwQXBpQ29uZmlnOiBhcHBBcGlDb25maWcuSUFwaUNvbmZpZyl7XHJcblxyXG5cdH1cclxuXHJcblx0bG9naW4oY3Jlc2RlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiBhbnl7XHJcblx0XHRsZXQgbG9naW5VcmwgPSB0aGlzLmFwcEFwaUNvbmZpZy5hcGlVcmwgKyAnbG9naW4nO1xyXG5cdFx0bGV0IHJlczphbnk7XHJcblxyXG5cdFx0cmVzID0gdGhpcy4kaHR0cC5wb3N0KFxyXG5cdFx0XHRsb2dpblVybCwgXHJcblx0XHRcdGNyZXNkZW50aWFscyxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlYWRlcnM6e1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0cmFuc2Zvcm1SZXF1ZXN0OiBmdW5jdGlvbihvYmo6YW55KSB7XHJcblx0XHRcdCAgICAgICAgdmFyIHN0cjogYW55W10gPSBbXTtcclxuXHJcblx0XHRcdCAgICAgICAgZm9yKHZhciBwIGluIG9iail7XHJcblx0XHRcdCAgICAgICAgXHRzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKTtcclxuXHRcdFx0ICAgICAgICB9XHRcclxuXHRcdFx0ICAgICAgICBcdFx0XHQgICAgICAgIFxyXG5cdFx0XHQgICAgICAgIHJldHVybiBzdHIuam9pbihcIiZcIik7XHJcblx0XHRcdCAgICB9XHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxufSJdfQ==
