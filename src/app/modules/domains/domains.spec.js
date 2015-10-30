describe('Controller: DomainsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        state,
        domainsLoader,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.domains'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", "https://ops-dev.blinker.com");
    }));

    beforeEach(function() {
        domainsLoader = {

            load: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
        errorHandler = {
            showError: function() {
                return false;
            }
        };
        state = {
            go: function(path) {
                return path;
            },
            current: {
                name: 'app.domains'
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DomainsController', {$scope: $scope, errorHandler: errorHandler, $state: state, $stateParams: $stateParams, domainsLoader: domainsLoader});
        })
    });

    describe('after get request', function(){

        beforeEach(function(){
            spyOn(domainsLoader, 'load').and.callThrough();
            spyOn(errorHandler, 'showError').and.callThrough();
            spyOn(state, 'go').and.callThrough();
            $scope.domains = ['domain'];
        });



        it('it should go to domain path if it exists only one', function() {
            domainsLoader.load();
            errorHandler.showError();
            expect(domainsLoader.load).toHaveBeenCalled();
            expect(errorHandler.showError).toHaveBeenCalled();
            expect($scope.domains.length).toBe(1);
            expect(state.current.name).toBe('app.domains');
            state.go('app.domains.domain');
            expect(state.go).toHaveBeenCalledWith('app.domains.domain');

        });
    });
});
