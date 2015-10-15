describe('Controller: OrchestrateHistoryController', function() {

    var $scope, q, stateParams,
        errorHandler,
        orchestrateService,
        rootScope,
        id = 'id',
        inst = 'inst',
        opt = 'opt',
        serverResponse = {data: 'response'},
        deferred;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.orchestrate'));


    beforeEach(function() {
        orchestrateService = {
            loadHistory: function() {
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
        spyOn(orchestrateService, 'loadHistory').and.callThrough();
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
            stateParams.inst = inst;
            stateParams.opt = opt;
            spyOn(state, 'go').and.returnValue(true);
            _$controller_('OrchestrateHistoryController as vm', {$scope: $scope, errorHandler: errorHandler, orchestrateService: orchestrateService});
            $httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    it ('call loadHistory with id, inst, opt from stateParams', function() {
        expect(orchestrateService.loadHistory).toHaveBeenCalledWith(id, inst, opt);
    });

    describe ('after success loading', function() {
        beforeEach(function() {
            deferred.resolve(serverResponse);
            $scope.$digest();
        });
        it ('should set vm.previousCalls to the response value', function() {
            expect($scope.vm.previousCalls).toBe(serverResponse.data);
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