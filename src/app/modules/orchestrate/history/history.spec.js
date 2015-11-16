describe('Controller: OrchestrateHistoryController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        previousCalls = {1: 2},
        error = 'error',
        orchestrateService,
        errorHandler;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.orchestrate'));

    beforeEach(function() {
        orchestrateService = {

            loadHistory: function() {
                deferred = q.defer();
                return deferred.promise
            }
        };
        errorHandler = {
            showError: function(error) {
                return error;
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            $stateParams = {
                id: 'id',
                inst: 'inst',
                opt: 'opt'
            };
            spyOn(orchestrateService, 'loadHistory').and.callThrough();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('OrchestrateHistoryController', {$scope: $scope, errorHandler: errorHandler, $stateParams: $stateParams, orchestrateService: orchestrateService});
        })
    });

    describe('after loading', function(){

        it ('should load history', function() {
            expect(orchestrateService.loadHistory).toHaveBeenCalledWith($stateParams.id, $stateParams.inst, $stateParams.opt);
        });

        describe('after successful loading', function(){
            beforeEach(function(){
                deferred.resolve({data: previousCalls});
                $scope.$root.$digest();
            });

            it ('should populate $scope.previousCalls with response.data', function() {
                expect($scope.previousCalls).toBe(previousCalls);
            });
        });

        describe('after failed response', function() {
            beforeEach(function() {
                spyOn(errorHandler, 'showError').and.callThrough();
                deferred.reject(error);
                $scope.$root.$digest();
            });
            it ('should call errorHandler and populate $scope.error', function() {
                expect(errorHandler.showError).toHaveBeenCalledWith(error);
                expect($scope.error).toBe(error);
            });
        });
    });


});
