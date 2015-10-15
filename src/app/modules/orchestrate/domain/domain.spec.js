describe('Controller: OrchestrateDomainController', function() {

    var $scope, q, stateParams,
        errorHandler,
        domainLoader,
        rootScope,
        id = 'id',
        serverResponse = {data: 'response'},
        deferred;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.orchestrate'));


    beforeEach(function() {
        domainLoader = {
            load: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function(response) {
                return response;
            }
        };
    });

    beforeEach(function() {
        spyOn(domainLoader, 'load').and.callThrough();
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state, $stateParams)  {
            q = $q;
            rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            stateParams = $stateParams;
            stateParams.id = id;
            spyOn(state, 'go').and.returnValue(true);
            _$controller_('OrchestrateDomainController as vm', {$scope: $scope, errorHandler: errorHandler, domainLoader: domainLoader});
            $httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    it ('should call domainLoader.load with stateParams.id', function() {
         expect(domainLoader.load).toHaveBeenCalledWith(id);
    });

    describe ('after success loading', function() {
        beforeEach(function() {
            deferred.resolve(serverResponse);
            $scope.$digest();
        });
        it ('should set vm.domain to the response value', function() {
            expect($scope.vm.domain).toBe(serverResponse.data);
        })
    });

    describe ('after failed loading', function() {
        beforeEach(function() {
            spyOn(errorHandler, 'showError').and.callThrough();
            deferred.reject(serverResponse);
            $scope.$digest();
        });
        it ('should call showError with response and set vm.error', function() {
            expect(errorHandler.showError).toHaveBeenCalledWith(serverResponse);
            expect($scope.vm.error).toBe(serverResponse);
        })
    });
});