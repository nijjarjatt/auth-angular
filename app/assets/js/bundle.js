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
var appController = require("../controllers/appCtrl");
function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
        url: '/',
        templateUrl: 'assets/views/landing.html',
        controller: appController.AppCtrl,
        controllerAs: 'ac'
    })
        .state('account', {
        url: '/my-account',
        template: '<p>My Account</p>',
        resolve: {
            auth: function (storageService, $q) {
                var deferred = $q.defer();
                if (storageService.isAuthenticated()) {
                    deferred.resolve({ authenticated: true });
                }
                else {
                    deferred.reject({ authenticated: false });
                }
                return deferred.promise;
            }
        }
    });
    $urlRouterProvider.otherwise("/");
}
exports.appConfig = appConfig;
},{"../controllers/appCtrl":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";
;
;
var LoginCtrl = (function () {
    function LoginCtrl($rootScope, auth_events, authService, $state) {
        this.$rootScope = $rootScope;
        this.auth_events = auth_events;
        this.authService = authService;
        this.$state = $state;
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
            _this.$state.go('account');
        }, function (error) {
            _this.$rootScope.$broadcast(_this.auth_events.loginFailed, 'Login Failed');
        });
    };
    LoginCtrl.$inject = ['$rootScope', 'AUTH_EVENTS', 'authService', '$state'];
    return LoginCtrl;
}());
exports.LoginCtrl = LoginCtrl;
},{}],6:[function(require,module,exports){
/// <reference path="../../../typings/index.d.ts" />
"use strict";
var loginController = require("./controllers/loginCtrl");
var authCodesConfig = require("./config/authCodesConfig");
var apiConfig = require("./config/apiConfig");
var appConfig = require("./config/appConfig");
var authService = require("./services/authService");
var storageService = require("./services/storageService");
var app = angular.module('authApp', ['ui.router']);
app
    .config(appConfig.appConfig)
    .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, data) {
        console.log('Redirecting due to no authentication');
        $state.go('home');
    });
})
    .constant('AUTH_EVENTS', authCodesConfig.AuthEvents.factory())
    .constant('appApiConfig', apiConfig.ApiConfig.factory())
    .service('authService', authService.AuthService)
    .service('storageService', storageService.StorageService)
    .controller('loginController', loginController.LoginCtrl);
},{"./config/apiConfig":1,"./config/appConfig":2,"./config/authCodesConfig":3,"./controllers/loginCtrl":5,"./services/authService":7,"./services/storageService":8}],7:[function(require,module,exports){
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
            _this.storageService.setUserToken(angular.fromJson(res.data).accessToken);
            return angular.fromJson(res.data).user;
        });
        return res;
    };
    AuthService.$inject = ['$http', 'appApiConfig', 'storageService'];
    return AuthService;
}());
exports.AuthService = AuthService;
},{}],8:[function(require,module,exports){
"use strict";
var StorageService = (function () {
    function StorageService($window) {
        this.$window = $window;
    }
    StorageService.prototype.setUserToken = function (token) {
        this.$window.localStorage['user-token'] = token;
    };
    StorageService.prototype.getUserToken = function () {
        return this.$window.localStorage['user-token'];
    };
    StorageService.prototype.isAuthenticated = function () {
        return (this.$window.localStorage['user-token'] !== undefined);
    };
    StorageService.$inject = ['$window'];
    return StorageService;
}());
exports.StorageService = StorageService;
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcGlDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcHBDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hdXRoQ29kZXNDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2FwcEN0cmwudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2xvZ2luQ3RybC50cyIsImFwcC9hc3NldHMvdHMvbWFpbi50cyIsImFwcC9hc3NldHMvdHMvc2VydmljZXMvYXV0aFNlcnZpY2UudHMiLCJhcHAvYXNzZXRzL3RzL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBO0lBR0M7UUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUE0QixDQUFDO0lBQzVDLENBQUM7SUFFTSxpQkFBTyxHQUFkO1FBQ0MsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNGLGdCQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSxpQkFBUyxZQVVyQixDQUFBOzs7QUNkRCxJQUFZLGFBQWEsV0FBTSx3QkFBd0IsQ0FBQyxDQUFBO0FBR3hELG1CQUEwQixjQUFvQyxFQUM3RCxrQkFBNEM7SUFDNUMsY0FBYztTQUVWLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxPQUFPO1FBQ2pDLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUM7U0FDRCxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ2QsR0FBRyxFQUFFLGFBQWE7UUFDbEIsUUFBUSxFQUFFLG1CQUFtQjtRQUM3QixPQUFPLEVBQUU7WUFDUixJQUFJLEVBQUUsVUFBQyxjQUE4QyxFQUFFLEVBQXFC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VyxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDWixDQUFDO0lBL0JNLG1CQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFnQzlELGtCQUFDO0FBQUQsQ0FqQ0EsQUFpQ0MsSUFBQTtBQWpDWSxtQkFBVyxjQWlDdkIsQ0FBQTs7O0FDbkNEO0lBR0Msd0JBQW9CLE9BQTBCO1FBQTFCLFlBQU8sR0FBUCxPQUFPLENBQW1CO0lBQUcsQ0FBQztJQUVsRCxxQ0FBWSxHQUFaLFVBQWEsS0FBYTtRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDakQsQ0FBQztJQUVELHFDQUFZLEdBQVo7UUFDQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHdDQUFlLEdBQWY7UUFDQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0lBZE0sc0JBQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBZ0I5QixxQkFBQztBQUFELENBakJBLEFBaUJDLElBQUE7QUFqQlksc0JBQWMsaUJBaUIxQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBpbnRlcmZhY2UgSUFwaUNvbmZpZ3tcclxuXHRhcGlVcmw6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpQ29uZmlnIGltcGxlbWVudHMgSUFwaUNvbmZpZ3tcclxuXHRhcGlVcmw6IHN0cmluZztcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmFwaVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpLyc7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZmFjdG9yeSgpOiBJQXBpQ29uZmlne1xyXG5cdFx0cmV0dXJuIG5ldyBBcGlDb25maWcoKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgKiBhcyBhcHBDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVycy9hcHBDdHJsXCI7XHJcbmltcG9ydCAqIGFzIHN0b3JhZ2VTZXJ2aWNlIGZyb20gXCIuLi9zZXJ2aWNlcy9zdG9yYWdlU2VydmljZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcENvbmZpZygkc3RhdGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIsIFxyXG5cdCR1cmxSb3V0ZXJQcm92aWRlcjogbmcudWkuSVVybFJvdXRlclByb3ZpZGVyKSB7XHJcblx0JHN0YXRlUHJvdmlkZXJcclxuXHJcbiAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhc3NldHMvdmlld3MvbGFuZGluZy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBhcHBDb250cm9sbGVyLkFwcEN0cmwsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAnYWMnXHJcbiAgICB9KVxyXG4gICAgLnN0YXRlKCdhY2NvdW50Jywge1xyXG4gICAgICAgIHVybDogJy9teS1hY2NvdW50JyxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxwPk15IEFjY291bnQ8L3A+JyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgXHRhdXRoOiAoc3RvcmFnZVNlcnZpY2U6IHN0b3JhZ2VTZXJ2aWNlLklTdG9yYWdlU2VydmljZSwgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgXHRcdGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgXHRcdGlmKHN0b3JhZ2VTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcclxuICAgICAgICBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHthdXRoZW50aWNhdGVkOiB0cnVlfSk7XHJcbiAgICAgICAgXHRcdH1lbHNle1xyXG4gICAgICAgIFx0XHRcdGRlZmVycmVkLnJlamVjdCh7YXV0aGVudGljYXRlZDogZmFsc2V9KTtcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQXV0aEV2ZW50c3tcclxuXHRsb2dpblN1Y2Nlc3M6IHN0cmluZztcclxuXHRsb2dpbkZhaWxlZDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXV0aEV2ZW50cyBpbXBsZW1lbnRzIElBdXRoRXZlbnRze1xyXG5cdGxvZ2luU3VjY2Vzczogc3RyaW5nO1xyXG5cdGxvZ2luRmFpbGVkOiBzdHJpbmc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5sb2dpblN1Y2Nlc3MgPSAnYXV0aC1sb2dpbi1zdWNjZXNzJztcclxuXHRcdHRoaXMubG9naW5GYWlsZWQgPSAnYXV0aC1sb2dpbi1mYWlsJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmYWN0b3J5KCk6IElBdXRoRXZlbnRze1xyXG5cdFx0cmV0dXJuIG5ldyBBdXRoRXZlbnRzKCk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQXBwQ3RybCB7XHJcblx0bG9naW5NZXNzYWdlOiBzdHJpbmc7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwQ3RybCBpbXBsZW1lbnRzIElBcHBDdHJse1x0XHJcblx0bG9naW5NZXNzYWdlOiBzdHJpbmc7XHJcblxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ0FVVEhfRVZFTlRTJ107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0cHJpdmF0ZSBhdXRoX2V2ZW50czogYW55KXtcclxuXHRcdHRoaXMubG9naW5NZXNzYWdlID0gJyc7XHJcblx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXV0aF9ldmVudHMubG9naW5TdWNjZXNzLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMubG9naW5NZXNzYWdlID0gZGF0YTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmF1dGhfZXZlbnRzLmxvZ2luRmFpbGVkLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMubG9naW5NZXNzYWdlID0gZGF0YTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSUNyZWRlbnRpYWxze1xyXG5cdHVzZXJuYW1lOiBzdHJpbmcgfCBudW1iZXIsXHJcblx0cGFzc3dvcmQ6IHN0cmluZyB8IG51bWJlclx0XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb2dpbkN0cmwge1xyXG5cdGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHM7XHJcblx0bG9naW4oY3JlZGVudGlhbHM6IElDcmVkZW50aWFscyk6IHZvaWQ7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5DdHJsIGltcGxlbWVudHMgSUxvZ2luQ3RybHtcdFxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ0FVVEhfRVZFTlRTJywgJ2F1dGhTZXJ2aWNlJywgJyRzdGF0ZSddO1xyXG5cdGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHM7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG5cdHByaXZhdGUgYXV0aF9ldmVudHM6IGFueSxcclxuXHRwcml2YXRlIGF1dGhTZXJ2aWNlOiBhbnksXHJcblx0cHJpdmF0ZSAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2Upe1xyXG5cdFx0dGhpcy5jcmVkZW50aWFscyA9IHtcclxuXHRcdFx0dXNlcm5hbWU6ICcnLFxyXG5cdFx0XHRwYXNzd29yZDogJydcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvZ2luKGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiB2b2lke1x0XHRcclxuXHRcdHRoaXMuYXV0aFNlcnZpY2UubG9naW4oY3JlZGVudGlhbHMpXHJcblx0XHQudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCh0aGlzLmF1dGhfZXZlbnRzLmxvZ2luU3VjY2VzcywgJ0xvZ2luIFN1Y2Nlc3NmdWwnKTtcclxuXHRcdFx0dGhpcy4kc3RhdGUuZ28oJ2FjY291bnQnKTtcclxuXHRcdH0sIChlcnJvcjogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KHRoaXMuYXV0aF9ldmVudHMubG9naW5GYWlsZWQsICdMb2dpbiBGYWlsZWQnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCAqIGFzIGFwcENvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvYXBwQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBsb2dpbkNvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvbG9naW5DdHJsXCI7XHJcbmltcG9ydCAqIGFzIGF1dGhDb2Rlc0NvbmZpZyBmcm9tIFwiLi9jb25maWcvYXV0aENvZGVzQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwaUNvbmZpZyBmcm9tIFwiLi9jb25maWcvYXBpQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwcENvbmZpZyBmcm9tIFwiLi9jb25maWcvYXBwQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGF1dGhTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL2F1dGhTZXJ2aWNlXCI7XHJcbmltcG9ydCAqIGFzIHN0b3JhZ2VTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlXCI7XHJcblxyXG5sZXQgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2F1dGhBcHAnLCBbJ3VpLnJvdXRlciddKTtcclxuYXBwXHJcblx0XHJcbi5jb25maWcoYXBwQ29uZmlnLmFwcENvbmZpZylcclxuXHJcbi5ydW4oKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2UpID0+IHtcclxuXHQkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZygnUmVkaXJlY3RpbmcgZHVlIHRvIG5vIGF1dGhlbnRpY2F0aW9uJyk7XHRcdFx0XHJcblx0XHQkc3RhdGUuZ28oJ2hvbWUnKTtcclxuXHR9KTtcclxufSlcclxuXHJcbi5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCBhdXRoQ29kZXNDb25maWcuQXV0aEV2ZW50cy5mYWN0b3J5KCkpXHRcclxuLmNvbnN0YW50KCdhcHBBcGlDb25maWcnLCBhcGlDb25maWcuQXBpQ29uZmlnLmZhY3RvcnkoKSlcclxuXHJcbi5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlLkF1dGhTZXJ2aWNlKVxyXG4uc2VydmljZSgnc3RvcmFnZVNlcnZpY2UnLCBzdG9yYWdlU2VydmljZS5TdG9yYWdlU2VydmljZSlcclxuXHJcbi5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBsb2dpbkNvbnRyb2xsZXIuTG9naW5DdHJsKTtcclxuXHJcbiIsImltcG9ydCB7SUNyZWRlbnRpYWxzfSBmcm9tIFwiLi4vY29udHJvbGxlcnMvbG9naW5DdHJsXCI7XHJcbmltcG9ydCAqIGFzIGFwcEFwaUNvbmZpZyBmcm9tIFwiLi4vY29uZmlnL2FwaUNvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyBzdG9yYWdlU2VydmljZSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZVNlcnZpY2VcIjsgXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXRoU2VydmljZSB7XHJcblx0bG9naW4oY3Jlc2RlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiBhbnk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIGltcGxlbWVudHMgSUF1dGhTZXJ2aWNlIHtcdFxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckaHR0cCcsICdhcHBBcGlDb25maWcnLCAnc3RvcmFnZVNlcnZpY2UnXTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLFxyXG5cdHByaXZhdGUgYXBwQXBpQ29uZmlnOiBhcHBBcGlDb25maWcuSUFwaUNvbmZpZyxcclxuXHRwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBzdG9yYWdlU2VydmljZS5JU3RvcmFnZVNlcnZpY2UpIHt9XHJcblxyXG5cdGxvZ2luKGNyZXNkZW50aWFsczogSUNyZWRlbnRpYWxzKTogYW55IHtcclxuXHRcdGxldCBsb2dpblVybCA9IHRoaXMuYXBwQXBpQ29uZmlnLmFwaVVybCArICdsb2dpbic7XHJcblx0XHRsZXQgcmVzOmFueTtcclxuXHJcblx0XHRyZXMgPSB0aGlzLiRodHRwLnBvc3QoXHJcblx0XHRcdGxvZ2luVXJsLCBcclxuXHRcdFx0Y3Jlc2RlbnRpYWxzLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVhZGVyczp7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uKG9iajphbnkpIHtcclxuXHRcdFx0ICAgICAgICB2YXIgc3RyOiBhbnlbXSA9IFtdO1xyXG5cclxuXHRcdFx0ICAgICAgICBmb3IodmFyIHAgaW4gb2JqKXtcclxuXHRcdFx0ICAgICAgICBcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xyXG5cdFx0XHQgICAgICAgIH1cdFx0XHQgICAgICAgIFx0XHRcdCAgICAgICAgXHJcblx0XHRcdCAgICAgICAgcmV0dXJuIHN0ci5qb2luKFwiJlwiKTtcclxuXHRcdFx0ICAgIH1cclxuXHRcdFx0fVxyXG5cdFx0KS50aGVuKChyZXM6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldFVzZXJUb2tlbihhbmd1bGFyLmZyb21Kc29uKHJlcy5kYXRhKS5hY2Nlc3NUb2tlbik7XHJcblx0XHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKHJlcy5kYXRhKS51c2VyO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSVN0b3JhZ2VTZXJ2aWNlIHtcclxuXHRzZXRVc2VyVG9rZW4odG9rZW46IHN0cmluZyk6IHZvaWQ7XHJcblx0Z2V0VXNlclRva2VuKCk6IHN0cmluZztcclxuXHRpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgY2xhc3MgU3RvcmFnZVNlcnZpY2UgaW1wbGVtZW50cyBJU3RvcmFnZVNlcnZpY2Uge1x0XHJcblx0c3RhdGljICRpbmplY3QgPSBbJyR3aW5kb3cnXTtcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlKSB7fVxyXG5cclxuXHRzZXRVc2VyVG9rZW4odG9rZW46IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0dGhpcy4kd2luZG93LmxvY2FsU3RvcmFnZVsndXNlci10b2tlbiddID0gdG9rZW47XHJcblx0fVxyXG5cclxuXHRnZXRVc2VyVG9rZW4oKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLiR3aW5kb3cubG9jYWxTdG9yYWdlWyd1c2VyLXRva2VuJ107XHJcblx0fVxyXG5cclxuXHRpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKHRoaXMuJHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ3VzZXItdG9rZW4nXSAhPT0gdW5kZWZpbmVkKVxyXG5cdH1cclxuXHJcbn0iXX0=
