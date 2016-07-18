export function appRun($rootScope: ng.IRootScopeService, 
    $state: ng.ui.IStateService) {
    $rootScope.$on('$stateChangeError', (event: any, toState: any, toParams: any, fromState: any, fromParams: any, error: any) => {
        if(!error.authenticated){
            console.log('Redirecting to Home: No authentication');      
            $state.go('home');      
        }else{
            console.log('Redirecting to Account: already authenticated');   
            $state.go('account');
        }
    });
}