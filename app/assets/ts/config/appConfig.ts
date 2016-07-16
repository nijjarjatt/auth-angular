import * as appController from "../controllers/appCtrl";
import * as storageService from "../services/storageService";

export function appConfig($stateProvider: ng.ui.IStateProvider, 
	$urlRouterProvider: ng.ui.IUrlRouterProvider) {
	$stateProvider

    .state('home', {
        url: '/',
        templateUrl: 'assets/views/landing.html',
        controller: appController.AppCtrl,
        controllerAs: 'ac',
        resolve: {
            auth: (storageService: storageService.IStorageService, $q: angular.IQService) => {
                let deferred = $q.defer();
                if(!storageService.isAuthenticated()){
                    deferred.resolve();
                }else{
                    deferred.reject({authenticated: true});
                }
                return deferred.promise;
            }
        }
    })
    .state('account', {
        url: '/my-account',
        template: '<p>My Account</p>',
        resolve: {
        	auth: (storageService: storageService.IStorageService, $q: angular.IQService) => {
        		let deferred = $q.defer();
        		if(storageService.isAuthenticated()){
        			deferred.resolve();
        		}else{
        			deferred.reject({authenticated: false});
        		}
        		return deferred.promise;
        	}
        }
    })

    $urlRouterProvider.otherwise("/");
}