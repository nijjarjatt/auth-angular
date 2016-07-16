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
        controllerAs: 'ac',
        resolve: {
            auth: function (storageService, $q) {
                var deferred = $q.defer();
                if (!storageService.isAuthenticated()) {
                    deferred.resolve();
                }
                else {
                    deferred.reject({ authenticated: true });
                }
                return deferred.promise;
            }
        }
    })
        .state('account', {
        url: '/my-account',
        template: '<p>My Account</p>',
        resolve: {
            auth: function (storageService, $q) {
                var deferred = $q.defer();
                if (storageService.isAuthenticated()) {
                    deferred.resolve();
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
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (!error.authenticated) {
            console.log('Redirecting to Home: No authentication');
            $state.go('home');
        }
        else {
            console.log('Redirecting to Account: already authenticated');
            $state.go('account');
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcGlDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hcHBDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hdXRoQ29kZXNDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2FwcEN0cmwudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2xvZ2luQ3RybC50cyIsImFwcC9hc3NldHMvdHMvbWFpbi50cyIsImFwcC9hc3NldHMvdHMvc2VydmljZXMvYXV0aFNlcnZpY2UudHMiLCJhcHAvYXNzZXRzL3RzL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBO0lBR0M7UUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUE0QixDQUFDO0lBQzVDLENBQUM7SUFFTSxpQkFBTyxHQUFkO1FBQ0MsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNGLGdCQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSxpQkFBUyxZQVVyQixDQUFBOzs7QUNkRCxJQUFZLGFBQWEsV0FBTSx3QkFBd0IsQ0FBQyxDQUFBO0FBR3hELG1CQUEwQixjQUFvQyxFQUM3RCxrQkFBNEM7SUFDNUMsY0FBYztTQUVWLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxPQUFPO1FBQ2pDLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE9BQU8sRUFBRTtZQUNMLElBQUksRUFBRSxVQUFDLGNBQThDLEVBQUUsRUFBcUI7Z0JBQ3hFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDMUIsRUFBRSxDQUFBLENBQUMsQ0FBQyxjQUFj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QUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2pELENBQUM7SUFFRCxxQ0FBWSxHQUFaO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCx3Q0FBZSxHQUFmO1FBQ0MsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUE7SUFDL0QsQ0FBQztJQWRNLHNCQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQWdCOUIscUJBQUM7QUFBRCxDQWpCQSxBQWlCQyxJQUFBO0FBakJZLHNCQUFjLGlCQWlCMUIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgaW50ZXJmYWNlIElBcGlDb25maWd7XHJcblx0YXBpVXJsOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUNvbmZpZyBpbXBsZW1lbnRzIElBcGlDb25maWd7XHJcblx0YXBpVXJsOiBzdHJpbmc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5hcGlVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS8nO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGZhY3RvcnkoKTogSUFwaUNvbmZpZ3tcclxuXHRcdHJldHVybiBuZXcgQXBpQ29uZmlnKCk7XHJcblx0fVxyXG59IiwiaW1wb3J0ICogYXMgYXBwQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlcnMvYXBwQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBzdG9yYWdlU2VydmljZSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZVNlcnZpY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHBDb25maWcoJHN0YXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyLCBcclxuXHQkdXJsUm91dGVyUHJvdmlkZXI6IG5nLnVpLklVcmxSb3V0ZXJQcm92aWRlcikge1xyXG5cdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG4gICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXNzZXRzL3ZpZXdzL2xhbmRpbmcuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogYXBwQ29udHJvbGxlci5BcHBDdHJsLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2FjJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIGF1dGg6IChzdG9yYWdlU2VydmljZTogc3RvcmFnZVNlcnZpY2UuSVN0b3JhZ2VTZXJ2aWNlLCAkcTogYW5ndWxhci5JUVNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICBpZighc3RvcmFnZVNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7YXV0aGVudGljYXRlZDogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnN0YXRlKCdhY2NvdW50Jywge1xyXG4gICAgICAgIHVybDogJy9teS1hY2NvdW50JyxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxwPk15IEFjY291bnQ8L3A+JyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgXHRhdXRoOiAoc3RvcmFnZVNlcnZpY2U6IHN0b3JhZ2VTZXJ2aWNlLklTdG9yYWdlU2VydmljZSwgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgXHRcdGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgXHRcdGlmKHN0b3JhZ2VTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcclxuICAgICAgICBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgXHRcdH1lbHNle1xyXG4gICAgICAgIFx0XHRcdGRlZmVycmVkLnJlamVjdCh7YXV0aGVudGljYXRlZDogZmFsc2V9KTtcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQXV0aEV2ZW50c3tcclxuXHRsb2dpblN1Y2Nlc3M6IHN0cmluZztcclxuXHRsb2dpbkZhaWxlZDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXV0aEV2ZW50cyBpbXBsZW1lbnRzIElBdXRoRXZlbnRze1xyXG5cdGxvZ2luU3VjY2Vzczogc3RyaW5nO1xyXG5cdGxvZ2luRmFpbGVkOiBzdHJpbmc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5sb2dpblN1Y2Nlc3MgPSAnYXV0aC1sb2dpbi1zdWNjZXNzJztcclxuXHRcdHRoaXMubG9naW5GYWlsZWQgPSAnYXV0aC1sb2dpbi1mYWlsJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmYWN0b3J5KCk6IElBdXRoRXZlbnRze1xyXG5cdFx0cmV0dXJuIG5ldyBBdXRoRXZlbnRzKCk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQXBwQ3RybCB7XHJcblx0bG9naW5NZXNzYWdlOiBzdHJpbmc7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwQ3RybCBpbXBsZW1lbnRzIElBcHBDdHJse1x0XHJcblx0bG9naW5NZXNzYWdlOiBzdHJpbmc7XHJcblxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ0FVVEhfRVZFTlRTJ107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0cHJpdmF0ZSBhdXRoX2V2ZW50czogYW55KXtcclxuXHRcdHRoaXMubG9naW5NZXNzYWdlID0gJyc7XHJcblx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXV0aF9ldmVudHMubG9naW5TdWNjZXNzLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMubG9naW5NZXNzYWdlID0gZGF0YTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmF1dGhfZXZlbnRzLmxvZ2luRmFpbGVkLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMubG9naW5NZXNzYWdlID0gZGF0YTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSUNyZWRlbnRpYWxze1xyXG5cdHVzZXJuYW1lOiBzdHJpbmcgfCBudW1iZXIsXHJcblx0cGFzc3dvcmQ6IHN0cmluZyB8IG51bWJlclx0XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb2dpbkN0cmwge1xyXG5cdGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHM7XHJcblx0bG9naW4oY3JlZGVudGlhbHM6IElDcmVkZW50aWFscyk6IHZvaWQ7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5DdHJsIGltcGxlbWVudHMgSUxvZ2luQ3RybHtcdFxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ0FVVEhfRVZFTlRTJywgJ2F1dGhTZXJ2aWNlJywgJyRzdGF0ZSddO1xyXG5cdGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHM7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG5cdHByaXZhdGUgYXV0aF9ldmVudHM6IGFueSxcclxuXHRwcml2YXRlIGF1dGhTZXJ2aWNlOiBhbnksXHJcblx0cHJpdmF0ZSAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2Upe1xyXG5cdFx0dGhpcy5jcmVkZW50aWFscyA9IHtcclxuXHRcdFx0dXNlcm5hbWU6ICcnLFxyXG5cdFx0XHRwYXNzd29yZDogJydcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvZ2luKGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiB2b2lke1x0XHRcclxuXHRcdHRoaXMuYXV0aFNlcnZpY2UubG9naW4oY3JlZGVudGlhbHMpXHJcblx0XHQudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCh0aGlzLmF1dGhfZXZlbnRzLmxvZ2luU3VjY2VzcywgJ0xvZ2luIFN1Y2Nlc3NmdWwnKTtcclxuXHRcdFx0dGhpcy4kc3RhdGUuZ28oJ2FjY291bnQnKTtcclxuXHRcdH0sIChlcnJvcjogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KHRoaXMuYXV0aF9ldmVudHMubG9naW5GYWlsZWQsICdMb2dpbiBGYWlsZWQnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCAqIGFzIGFwcENvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvYXBwQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBsb2dpbkNvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvbG9naW5DdHJsXCI7XHJcbmltcG9ydCAqIGFzIGF1dGhDb2Rlc0NvbmZpZyBmcm9tIFwiLi9jb25maWcvYXV0aENvZGVzQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwaUNvbmZpZyBmcm9tIFwiLi9jb25maWcvYXBpQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwcENvbmZpZyBmcm9tIFwiLi9jb25maWcvYXBwQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGF1dGhTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL2F1dGhTZXJ2aWNlXCI7XHJcbmltcG9ydCAqIGFzIHN0b3JhZ2VTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL3N0b3JhZ2VTZXJ2aWNlXCI7XHJcblxyXG5sZXQgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2F1dGhBcHAnLCBbJ3VpLnJvdXRlciddKTtcclxuYXBwXHJcblx0XHJcbi5jb25maWcoYXBwQ29uZmlnLmFwcENvbmZpZylcclxuXHJcbi5ydW4oKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2UpID0+IHtcclxuXHQkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCAoZXZlbnQ6IGFueSwgdG9TdGF0ZTogYW55LCB0b1BhcmFtczogYW55LCBmcm9tU3RhdGU6IGFueSwgZnJvbVBhcmFtczogYW55LCBlcnJvcjogYW55KSA9PiB7XHJcblx0XHRpZighZXJyb3IuYXV0aGVudGljYXRlZCl7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdSZWRpcmVjdGluZyB0byBIb21lOiBObyBhdXRoZW50aWNhdGlvbicpO1x0XHRcclxuXHRcdFx0JHN0YXRlLmdvKCdob21lJyk7XHRcdFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdSZWRpcmVjdGluZyB0byBBY2NvdW50OiBhbHJlYWR5IGF1dGhlbnRpY2F0ZWQnKTtcdFxyXG5cdFx0XHQkc3RhdGUuZ28oJ2FjY291bnQnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufSlcclxuXHJcbi5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCBhdXRoQ29kZXNDb25maWcuQXV0aEV2ZW50cy5mYWN0b3J5KCkpXHRcclxuLmNvbnN0YW50KCdhcHBBcGlDb25maWcnLCBhcGlDb25maWcuQXBpQ29uZmlnLmZhY3RvcnkoKSlcclxuXHJcbi5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlLkF1dGhTZXJ2aWNlKVxyXG4uc2VydmljZSgnc3RvcmFnZVNlcnZpY2UnLCBzdG9yYWdlU2VydmljZS5TdG9yYWdlU2VydmljZSlcclxuXHJcbi5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBsb2dpbkNvbnRyb2xsZXIuTG9naW5DdHJsKTtcclxuXHJcbiIsImltcG9ydCB7SUNyZWRlbnRpYWxzfSBmcm9tIFwiLi4vY29udHJvbGxlcnMvbG9naW5DdHJsXCI7XHJcbmltcG9ydCAqIGFzIGFwcEFwaUNvbmZpZyBmcm9tIFwiLi4vY29uZmlnL2FwaUNvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyBzdG9yYWdlU2VydmljZSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZVNlcnZpY2VcIjsgXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXRoU2VydmljZSB7XHJcblx0bG9naW4oY3Jlc2RlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiBhbnk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIGltcGxlbWVudHMgSUF1dGhTZXJ2aWNlIHtcdFxyXG5cdHN0YXRpYyAkaW5qZWN0ID0gWyckaHR0cCcsICdhcHBBcGlDb25maWcnLCAnc3RvcmFnZVNlcnZpY2UnXTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLFxyXG5cdHByaXZhdGUgYXBwQXBpQ29uZmlnOiBhcHBBcGlDb25maWcuSUFwaUNvbmZpZyxcclxuXHRwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBzdG9yYWdlU2VydmljZS5JU3RvcmFnZVNlcnZpY2UpIHt9XHJcblxyXG5cdGxvZ2luKGNyZXNkZW50aWFsczogSUNyZWRlbnRpYWxzKTogYW55IHtcclxuXHRcdGxldCBsb2dpblVybCA9IHRoaXMuYXBwQXBpQ29uZmlnLmFwaVVybCArICdsb2dpbic7XHJcblx0XHRsZXQgcmVzOmFueTtcclxuXHJcblx0XHRyZXMgPSB0aGlzLiRodHRwLnBvc3QoXHJcblx0XHRcdGxvZ2luVXJsLCBcclxuXHRcdFx0Y3Jlc2RlbnRpYWxzLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVhZGVyczp7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uKG9iajphbnkpIHtcclxuXHRcdFx0ICAgICAgICB2YXIgc3RyOiBhbnlbXSA9IFtdO1xyXG5cclxuXHRcdFx0ICAgICAgICBmb3IodmFyIHAgaW4gb2JqKXtcclxuXHRcdFx0ICAgICAgICBcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xyXG5cdFx0XHQgICAgICAgIH1cdFx0XHQgICAgICAgIFx0XHRcdCAgICAgICAgXHJcblx0XHRcdCAgICAgICAgcmV0dXJuIHN0ci5qb2luKFwiJlwiKTtcclxuXHRcdFx0ICAgIH1cclxuXHRcdFx0fVxyXG5cdFx0KS50aGVuKChyZXM6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldFVzZXJUb2tlbihhbmd1bGFyLmZyb21Kc29uKHJlcy5kYXRhKS5hY2Nlc3NUb2tlbik7XHJcblx0XHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKHJlcy5kYXRhKS51c2VyO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSVN0b3JhZ2VTZXJ2aWNlIHtcclxuXHRzZXRVc2VyVG9rZW4odG9rZW46IHN0cmluZyk6IHZvaWQ7XHJcblx0Z2V0VXNlclRva2VuKCk6IHN0cmluZztcclxuXHRpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgY2xhc3MgU3RvcmFnZVNlcnZpY2UgaW1wbGVtZW50cyBJU3RvcmFnZVNlcnZpY2Uge1x0XHJcblx0c3RhdGljICRpbmplY3QgPSBbJyR3aW5kb3cnXTtcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlKSB7fVxyXG5cclxuXHRzZXRVc2VyVG9rZW4odG9rZW46IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0dGhpcy4kd2luZG93LmxvY2FsU3RvcmFnZVsndXNlci10b2tlbiddID0gdG9rZW47XHJcblx0fVxyXG5cclxuXHRnZXRVc2VyVG9rZW4oKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLiR3aW5kb3cubG9jYWxTdG9yYWdlWyd1c2VyLXRva2VuJ107XHJcblx0fVxyXG5cclxuXHRpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKHRoaXMuJHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ3VzZXItdG9rZW4nXSAhPT0gdW5kZWZpbmVkKVxyXG5cdH1cclxuXHJcbn0iXX0=
