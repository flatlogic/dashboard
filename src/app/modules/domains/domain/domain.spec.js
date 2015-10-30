describe('Controller: DomainController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        state,
        domainLoader,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.domains'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", "https://ops-dev.blinker.com");
    }));

    beforeEach(function() {
        domainLoader = {

            load: function(domainId) {
                deferred = q.defer();
                return [deferred.promise, domainId]
            }
        };
        errorHandler = {
            showError: function() {
                return false;
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
            _$controller_('DomainController', {$scope: $scope, errorHandler: errorHandler, $stateParams: $stateParams, domainLoader: domainLoader});
        })
    });

    describe('after get request', function(){

        beforeEach(function(){
            spyOn(domainLoader, 'load').and.callThrough();
            spyOn(errorHandler, 'showError').and.callThrough();
        });



        it('it should go to domain path if it exists only one', function() {
            domainLoader.load(1);
            errorHandler.showError();
            expect(domainLoader.load).toHaveBeenCalledWith(1);
            expect(errorHandler.showError).toHaveBeenCalled();
        });
    });
});
