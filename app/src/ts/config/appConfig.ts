import * as controllers from "../controllers";
import * as services from "../services";

export function appConfig($stateProvider: ng.ui.IStateProvider, 
	$urlRouterProvider: ng.ui.IUrlRouterProvider) {

    $stateProvider

    .state('home', {
        url: '/',
        templateUrl: './views/landing.html',
        controller: controllers.AppCtrl,
        controllerAs: 'ac', 
        resolve: {
            auth: (storageService: services.IStorageService, $q: angular.IQService) => {
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
        templateUrl: './views/account.html',
        controller: controllers.AccntCtrl,
        controllerAs: 'atc',
        resolve: {
        	auth: (storageService: services.IStorageService, $q: angular.IQService) => {
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