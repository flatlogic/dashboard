describe('Controller: OrchestrateInstanceController', function() {

    var $scope;
    var q,
        deferred,
        $stateParams,
        workflows = {1: 2},
        error = 'error',
        orchestrateService,
        errorHandler;

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.loaders');
        module('qorDash.orchestrate');
    });

    beforeEach(function() {
        orchestrateService = {

            loadInstances: function() {
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
            $scope = _$rootScope_.$new();
            $stateParams = {
                id: 'id',
                inst: 'inst'
            };
            spyOn(orchestrateService, 'loadInstances').and.callThrough();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('OrchestrateInstanceController', {$scope: $scope, errorHandler: errorHandler, $stateParams: $stateParams, orchestrateService: orchestrateService});
        })
    });

    describe('after loading', function(){

        it ('should populate $scope.title with $stateParams.inst', function() {
            expect($scope.title).toBe($stateParams.inst);
        });

        it ('should define $scope.workflows', function() {
            expect($scope.workflows).toBeDefined();
        });

        it ('should load history', function() {
            expect(orchestrateService.loadInstances).toHaveBeenCalledWith($stateParams.id, $stateParams.inst);
        });

        describe('after successful loading', function(){
            beforeEach(function(){
                deferred.resolve({data: workflows});
                $scope.$root.$digest();
            });

            it ('should populate $scope.previousCalls with response.data', function() {
                expect($scope.workflows).toBe(workflows);
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
