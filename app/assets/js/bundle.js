(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var authEvents = (function () {
    function authEvents() {
        this.loginSuccess = 'auth-login-success';
    }
    authEvents.factory = function () {
        return new authEvents();
    };
    return authEvents;
}());
exports.authEvents = authEvents;
},{}],2:[function(require,module,exports){
"use strict";
;
;
var LoginCtrl = (function () {
    function LoginCtrl($rootScope, auth_events) {
        this.$rootScope = $rootScope;
        this.auth_events = auth_events;
        this.credentials = {
            username: '',
            password: ''
        };
    }
    LoginCtrl.prototype.login = function (credentials) {
        console.log(this.auth_events);
        this.$rootScope.$broadcast(this.auth_events.loginSuccess);
    };
    LoginCtrl.$inject = ['$rootScope', 'AUTH_EVENTS'];
    return LoginCtrl;
}());
exports.LoginCtrl = LoginCtrl;
},{}],3:[function(require,module,exports){
/// <reference path="../../../typings/index.d.ts" />
"use strict";
var loginController = require("./controllers/loginCtrl");
var authCodesConfig = require("./config/authCodesConfig");
var app = angular.module('authApp', []);
app
    .controller('loginController', loginController.LoginCtrl)
    .constant('AUTH_EVENTS', authCodesConfig.authEvents.factory());
},{"./config/authCodesConfig":1,"./controllers/loginCtrl":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXNzZXRzL3RzL2NvbmZpZy9hdXRoQ29kZXNDb25maWcudHMiLCJhcHAvYXNzZXRzL3RzL2NvbnRyb2xsZXJzL2xvZ2luQ3RybC50cyIsImFwcC9hc3NldHMvdHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNJQTtJQUdDO1FBQ0MsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQTtJQUN6QyxDQUFDO0lBRU0sa0JBQU8sR0FBZDtRQUNDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDRixpQkFBQztBQUFELENBVkEsQUFVQyxJQUFBO0FBVlksa0JBQVUsYUFVdEIsQ0FBQTs7O0FDWEEsQ0FBQztBQUtELENBQUM7QUFFRjtJQUlDLG1CQUFvQixVQUFnQyxFQUM1QyxXQUFnQjtRQURKLGVBQVUsR0FBVixVQUFVLENBQXNCO1FBQzVDLGdCQUFXLEdBQVgsV0FBVyxDQUFLO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUc7WUFDbEIsUUFBUSxFQUFFLEVBQUU7WUFDWixRQUFRLEVBQUUsRUFBRTtTQUNaLENBQUE7SUFDRixDQUFDO0lBRUQseUJBQUssR0FBTCxVQUFNLFdBQXlCO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQWRNLGlCQUFPLEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFnQmhELGdCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQWpCWSxpQkFBUyxZQWlCckIsQ0FBQTs7QUMzQkQsb0RBQW9EOztBQUVwRCxJQUFZLGVBQWUsV0FBTSx5QkFBeUIsQ0FBQyxDQUFBO0FBQzNELElBQVksZUFBZSxXQUFNLDBCQUEwQixDQUFDLENBQUE7QUFFNUQsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFHeEMsR0FBRztLQUNELFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDO0tBQ3hELFFBQVEsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBpbnRlcmZhY2UgSUF1dGhFdmVudHN7XHJcblx0bG9naW5TdWNjZXNzOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIGF1dGhFdmVudHMgaW1wbGVtZW50cyBJQXV0aEV2ZW50c3tcclxuXHRsb2dpblN1Y2Nlc3M6IHN0cmluZztcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmxvZ2luU3VjY2VzcyA9ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZmFjdG9yeSgpOiBhdXRoRXZlbnRze1xyXG5cdFx0cmV0dXJuIG5ldyBhdXRoRXZlbnRzKCk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJQ3JlZGVudGlhbHN7XHJcblx0dXNlcm5hbWU6IHN0cmluZyB8IG51bWJlcixcclxuXHRwYXNzd29yZDogc3RyaW5nIHwgbnVtYmVyXHRcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvZ2luQ3RybCB7XHJcblx0Y3JlZGVudGlhbHM6IElDcmVkZW50aWFscztcclxuXHRsb2dpbihjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzKTogdm9pZDtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkN0cmwgaW1wbGVtZW50cyBJTG9naW5DdHJse1x0XHJcblx0c3RhdGljICRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnQVVUSF9FVkVOVFMnXTtcclxuXHRjcmVkZW50aWFsczogSUNyZWRlbnRpYWxzO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuXHRwcml2YXRlIGF1dGhfZXZlbnRzOiBhbnkpe1xyXG5cdFx0dGhpcy5jcmVkZW50aWFscyA9IHtcclxuXHRcdFx0dXNlcm5hbWU6ICcnLFxyXG5cdFx0XHRwYXNzd29yZDogJydcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvZ2luKGNyZWRlbnRpYWxzOiBJQ3JlZGVudGlhbHMpOiB2b2lke1xyXG5cdFx0Y29uc29sZS5sb2codGhpcy5hdXRoX2V2ZW50cyk7XHJcblx0XHR0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCh0aGlzLmF1dGhfZXZlbnRzLmxvZ2luU3VjY2Vzcyk7XHJcblx0fVxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5cclxuaW1wb3J0ICogYXMgbG9naW5Db250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL2xvZ2luQ3RybFwiO1xyXG5pbXBvcnQgKiBhcyBhdXRoQ29kZXNDb25maWcgZnJvbSBcIi4vY29uZmlnL2F1dGhDb2Rlc0NvbmZpZ1wiO1xyXG5cclxubGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhdXRoQXBwJywgW10pO1xyXG5cclxuXHJcbmFwcFxyXG5cdC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBsb2dpbkNvbnRyb2xsZXIuTG9naW5DdHJsKVxyXG5cdC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCBhdXRoQ29kZXNDb25maWcuYXV0aEV2ZW50cy5mYWN0b3J5KCkpO1xyXG5cclxuIl19
