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
var appController = require("./controllers/appCtrl");
var loginController = require("./controllers/loginCtrl");
var authCodesConfig = require("./config/authCodesConfig");
var apiConfig = require("./config/apiConfig");
var authService = require("./services/authService");
var storageService = require("./services/storageService");
var app = angular.module('authApp', []);
app
    .controller('loginController', loginController.LoginCtrl)
    .controller('appController', appController.AppCtrl)
    .constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())
    .constant('appApiConfig', apiConfig.ApiConfig.factory())
    .service('authService', authService.AuthService)
    .service('storageService', storageService.StorageService);
},{"./config/apiConfig":1,"./config/authCodesConfig":2,"./controllers/appCtrl":3,"./controllers/loginCtrl":4,"./services/authService":6,"./services/storageService":7}],6:[function(require,module,exports){
"use strict";
var AuthService = (function () {
    function AuthService($http, appApiConfig, storageService) {
        this.$http = $http;
        this.appApiConfig = appApiConfig;
        this.storageService = storageService;
    }
    AuthService.prototype.login = function (cresdentials) {
        var _this = this;
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
        }).then(function (res) {
            _this.storageService.saveUserToken(angular.fromJson(res.data).accessToken);
            return res;
        });
        return res;
    };
    AuthService.$inject = ['$http', 'appApiConfig', 'storageService'];
    return AuthService;
}());
exports.AuthService = AuthService;
},{}],7:[function(require,module,exports){
"use strict";
var StorageService = (function () {
    function StorageService($window) {
        this.$window = $window;
    }
    StorageService.prototype.saveUserToken = function (token) {
        this.$window.localStorage['user-token'] = token;
    };
    StorageService.prototype.getUserToken = function () {
        return this.$window.localStorage['user-token'];
    };
    StorageService.$inject = ['$window'];
    return StorageService;
}());
exports.StorageService = StorageService;
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcGlDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hdXRoQ29kZXNDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2FwcEN0cmwudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2xvZ2luQ3RybC50cyIsImFwcC9hc3NldHMvdHMvbWFpbi50cyIsImFwcC9hc3NldHMvdHMvc2VydmljZXMvYXV0aFNlcnZpY2UudHMiLCJhcHAvYXNzZXRzL3RzL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBO0lBR0M7UUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUE0QixDQUFDO0lBQzVDLENBQUM7SUFFTSxpQkFBTyxHQUFkO1FBQ0MsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNGLGdCQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSxpQkFBUyxZQVVyQixDQUFBOzs7QUNURDtJQUlDO1FBQ0MsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO0lBQ3RDLENBQUM7SUFFTSxrQkFBTyxHQUFkO1FBQ0MsTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNGLGlCQUFDO0FBQUQsQ0FaQSxBQVlDLElBQUE7QUFaWSxrQkFBVSxhQVl0QixDQUFBOzs7QUNmQSxDQUFDO0FBRUY7SUFLQyxpQkFBb0IsVUFBZ0MsRUFDNUMsV0FBZ0I7UUFOekIsaUJBZUM7UUFWb0IsZUFBVSxHQUFWLFVBQVUsQ0FBc0I7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQUs7UUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIs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Q3ZCLENBQUE7OztBQ3BDRDtJQUdDLHdCQUFvQixPQUEwQjtRQUExQixZQUFPLEdBQVAsT0FBTyxDQUFtQjtJQUFHLENBQUM7SUFFbEQsc0NBQWEsR0FBYixVQUFjLEtBQWE7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2pELENBQUM7SUFFRCxxQ0FBWSxHQUFaO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFWTSxzQkFBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFXOUIscUJBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQVpZLHNCQUFjLGlCQVkxQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBpbnRlcmZhY2UgSUFwaUNvbmZpZ3tcclxuXHRhcGlVcmw6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpQ29uZmlnIGltcGxlbWVudHMgSUFwaUNvbmZpZ3tcclxuXHRhcGlVcmw6IHN0cmluZztcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmFwaVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpLyc7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZmFjdG9yeSgpOiBJQXBpQ29uZmlne1xyXG5cdFx0cmV0dXJuIG5ldyBBcGlDb25maWcoKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElBdXRoRXZlbnRze1xyXG5cdGxvZ2luU3VjY2Vzczogc3RyaW5nO1xyXG5cdGxvZ2luRmFpbGVkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRoRXZlbnRzIGltcGxlbWVudHMgSUF1dGhFdmVudHN7XHJcblx0bG9naW5TdWNjZXNzOiBzdHJpbmc7XHJcblx0bG9naW5GYWlsZWQ6IHN0cmluZztcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmxvZ2luU3VjY2VzcyA9ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnO1xyXG5cdFx0dGhpcy5sb2dpbkZhaWxlZCA9ICdhdXRoLWxvZ2luLWZhaWwnO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGZhY3RvcnkoKTogSUF1dGhFdmVudHN7XHJcblx0XHRyZXR1cm4gbmV3IEF1dGhFdmVudHMoKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElBcHBDdHJsIHtcclxuXHRsb2dpbk1lc3NhZ2U6IHN0cmluZztcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBDdHJsIGltcGxlbWVudHMgSUFwcEN0cmx7XHRcclxuXHRsb2dpbk1lc3NhZ2U6IHN0cmluZztcclxuXHJcblx0c3RhdGljICRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnQVVUSF9FVkVOVFMnXTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRwcml2YXRlIGF1dGhfZXZlbnRzOiBhbnkpe1xyXG5cdFx0dGhpcy5sb2dpbk1lc3NhZ2UgPSAnJztcclxuXHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hdXRoX2V2ZW50cy5sb2dpblN1Y2Nlc3MsIChldmVudDogYW55LCBkYXRhOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy5sb2dpbk1lc3NhZ2UgPSBkYXRhO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXV0aF9ldmVudHMubG9naW5GYWlsZWQsIChldmVudDogYW55LCBkYXRhOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy5sb2dpbk1lc3NhZ2UgPSBkYXRhO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQ3JlZGVudGlhbHN7XHJcblx0dXNlcm5hbWU6IHN0cmluZyB8IG51bWJlcixcclxuXHRwYXNzd29yZDogc3RyaW5nIHwgbnVtYmVyXHRcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvZ2luQ3RybCB7XHJcblx0Y3JlZGVudGlhbHM6IElDcmVkZW50aWFscztcclxuXHRsb2dpbihjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzKTogdm9pZDtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkN0cmwgaW1wbGVtZW50cyBJTG9naW5DdHJse1x0XHJcblx0c3RhdGljICRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnQVVUSF9FVkVOVFMnLCAnYXV0aFNlcnZpY2UnXTtcclxuXHRjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuXHRwcml2YXRlIGF1dGhfZXZlbnRzOiBhbnksXHJcblx0cHJpdmF0ZSBhdXRoU2VydmljZTogYW55KXtcclxuXHRcdHRoaXMuY3JlZGVudGlhbHMgPSB7XHJcblx0XHRcdHVzZXJuYW1lOiAnJyxcclxuXHRcdFx0cGFzc3dvcmQ6ICcnXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2dpbihjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzKTogdm9pZHtcdFx0XHJcblx0XHR0aGlzLmF1dGhTZXJ2aWNlLmxvZ2luKGNyZWRlbnRpYWxzKVxyXG5cdFx0LnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QodGhpcy5hdXRoX2V2ZW50cy5sb2dpblN1Y2Nlc3MsICdMb2dpbiBTdWNjZXNzZnVsJyk7XHJcblx0XHR9LCAoZXJyb3I6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCh0aGlzLmF1dGhfZXZlbnRzLmxvZ2luRmFpbGVkLCAnTG9naW4gRmFpbGVkJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5pbXBvcnQgKiBhcyBhcHBDb250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL2FwcEN0cmxcIjtcclxuaW1wb3J0ICogYXMgbG9naW5Db250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL2xvZ2luQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBhdXRoQ29kZXNDb25maWcgZnJvbSBcIi4vY29uZmlnL2F1dGhDb2Rlc0NvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyBhcGlDb25maWcgZnJvbSBcIi4vY29uZmlnL2FwaUNvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyBhdXRoU2VydmljZSBmcm9tIFwiLi9zZXJ2aWNlcy9hdXRoU2VydmljZVwiO1xyXG5pbXBvcnQgKiBhcyBzdG9yYWdlU2VydmljZSBmcm9tIFwiLi9zZXJ2aWNlcy9zdG9yYWdlU2VydmljZVwiO1xyXG5cclxubGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhdXRoQXBwJywgW10pO1xyXG5hcHBcclxuXHQuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgbG9naW5Db250cm9sbGVyLkxvZ2luQ3RybClcclxuXHQuY29udHJvbGxlcignYXBwQ29udHJvbGxlcicsIGFwcENvbnRyb2xsZXIuQXBwQ3RybClcclxuXHQuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywgYXV0aENvZGVzQ29uZmlnLkF1dGhFdmVudHMuZmFjdG9yeSgpKVx0XHJcblx0LmNvbnN0YW50KCdhcHBBcGlDb25maWcnLCBhcGlDb25maWcuQXBpQ29uZmlnLmZhY3RvcnkoKSlcclxuXHQuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZS5BdXRoU2VydmljZSlcclxuXHQuc2VydmljZSgnc3RvcmFnZVNlcnZpY2UnLCBzdG9yYWdlU2VydmljZS5TdG9yYWdlU2VydmljZSk7XHJcblxyXG4iLCJpbXBvcnQge0lDcmVkZW50aWFsc30gZnJvbSBcIi4uL2NvbnRyb2xsZXJzL2xvZ2luQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBBcGlDb25maWcgZnJvbSBcIi4uL2NvbmZpZy9hcGlDb25maWdcIjtcclxuaW1wb3J0ICogYXMgc3RvcmFnZVNlcnZpY2UgZnJvbSBcIi4uL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlXCI7IFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXV0aFNlcnZpY2Uge1xyXG5cdGxvZ2luKGNyZXNkZW50aWFsczogSUNyZWRlbnRpYWxzKTogYW55O1xyXG59XHJcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSBpbXBsZW1lbnRzIElBdXRoU2VydmljZSB7XHRcclxuXHRzdGF0aWMgJGluamVjdCA9IFsnJGh0dHAnLCAnYXBwQXBpQ29uZmlnJywgJ3N0b3JhZ2VTZXJ2aWNlJ107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSxcclxuXHRwcml2YXRlIGFwcEFwaUNvbmZpZzogYXBwQXBpQ29uZmlnLklBcGlDb25maWcsXHJcblx0cHJpdmF0ZSBzdG9yYWdlU2VydmljZTogc3RvcmFnZVNlcnZpY2UuSVN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuXHRsb2dpbihjcmVzZGVudGlhbHM6IElDcmVkZW50aWFscyk6IGFueSB7XHJcblx0XHRsZXQgbG9naW5VcmwgPSB0aGlzLmFwcEFwaUNvbmZpZy5hcGlVcmwgKyAnbG9naW4nO1xyXG5cdFx0bGV0IHJlczphbnk7XHJcblxyXG5cdFx0cmVzID0gdGhpcy4kaHR0cC5wb3N0KFxyXG5cdFx0XHRsb2dpblVybCwgXHJcblx0XHRcdGNyZXNkZW50aWFscyxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlYWRlcnM6e1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0cmFuc2Zvcm1SZXF1ZXN0OiBmdW5jdGlvbihvYmo6YW55KSB7XHJcblx0XHRcdCAgICAgICAgdmFyIHN0cjogYW55W10gPSBbXTtcclxuXHJcblx0XHRcdCAgICAgICAgZm9yKHZhciBwIGluIG9iail7XHJcblx0XHRcdCAgICAgICAgXHRzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKTtcclxuXHRcdFx0ICAgICAgICB9XHRcdFx0ICAgICAgICBcdFx0XHQgICAgICAgIFxyXG5cdFx0XHQgICAgICAgIHJldHVybiBzdHIuam9pbihcIiZcIik7XHJcblx0XHRcdCAgICB9XHJcblx0XHRcdH1cclxuXHRcdCkudGhlbigocmVzOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zYXZlVXNlclRva2VuKGFuZ3VsYXIuZnJvbUpzb24ocmVzLmRhdGEpLmFjY2Vzc1Rva2VuKTtcclxuXHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHJlcztcclxuXHR9XHJcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElTdG9yYWdlU2VydmljZSB7XHJcblx0c2F2ZVVzZXJUb2tlbih0b2tlbjogc3RyaW5nKTogdm9pZDtcclxuXHRnZXRVc2VyVG9rZW4oKTogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlU2VydmljZSBpbXBsZW1lbnRzIElTdG9yYWdlU2VydmljZSB7XHRcclxuXHRzdGF0aWMgJGluamVjdCA9IFsnJHdpbmRvdyddO1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHdpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2UpIHt9XHJcblxyXG5cdHNhdmVVc2VyVG9rZW4odG9rZW46IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0dGhpcy4kd2luZG93LmxvY2FsU3RvcmFnZVsndXNlci10b2tlbiddID0gdG9rZW47XHJcblx0fVxyXG5cclxuXHRnZXRVc2VyVG9rZW4oKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLiR3aW5kb3cubG9jYWxTdG9yYWdlWyd1c2VyLXRva2VuJ107XHJcblx0fVxyXG59Il19
