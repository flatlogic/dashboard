describe('Controller: OrchestrateOptionController', function() {

    var $scope;
    var $stateParams = {
            id: 1,
            inst: 'inst',
            opt: 'opt',
            opt_id: 'old'
        },
        orchestrateService,
        $compile,
        WS_URL = 'WS_URL',
        errorHandler,
        q,
        deferred,
        workflow = {1: 2},
        error = 'error';

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.orchestrate');
    });

    orchestrateService = {
        loadOption: function() {
            deferred = q.defer();
            return deferred.promise;
        },
        loadLogUrl : function() {
            deferred = q.defer();
            return deferred.promise;
        }
    };

    errorHandler = {
        showError: function(error) {
            return error;
        }
    };

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_, _$compile_, $q)  {
            q = $q;
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn(orchestrateService, 'loadOption').and.callThrough();
            spyOn(orchestrateService, 'loadLogUrl').and.callThrough();
            spyOn(errorHandler, 'showError').and.callThrough();
            _$controller_('OrchestrateOptionController', {$scope: $scope, $stateParams: $stateParams, orchestrateService: orchestrateService, $compile: $compile, WS_URL: WS_URL, errorHandler: errorHandler});

        })
    });

    it('shoould populate $scope.title with $stateParams.opt', function(){
        expect($scope.title).toBe($stateParams.opt);
    });

    describe('when optId != "new"', function(){

        it('should call orchestrateService.loadOption(domain, instance, opt, optId)',function(){
            expect(orchestrateService.loadOption).toHaveBeenCalledWith($stateParams.id,$stateParams.inst,$stateParams.opt,$stateParams.opt_id);
        });

        describe('after successful loading', function(){
            beforeEach(function(){
                deferred.resolve({data: workflow});
                $scope.$root.$digest();
            });

            it('', function(){
                expect($scope.workflow).toBe(workflow);
            })
        });

        describe('after failed response', function(){
            beforeEach(function(){
                deferred.reject(error);
                $scope.$root.$digest();
            });

            it ('should call errorHandler and populate $scope.error', function() {
                expect(errorHandler.showError).toHaveBeenCalledWith(error);
                expect($scope.error).toBe(error);
            })
        });
    });

    describe('$scope.sendMessage function', function(){

        describe('when $scope.workflow.model is undefined', function(){
            beforeEach(function(){
                $scope.workflow = {
                    model: '',
                    activate_url: 'activate_url'
                };
                $scope.sendMessage();
            });

            it('should call orchestrateService.loadLogUrl($scope.workflow.activate_url, data)', function(){
                expect(orchestrateService.loadLogUrl).toHaveBeenCalledWith($scope.workflow.activate_url, {});
            })
        });

        describe('when $scope.workflow.model is defined', function(){
            beforeEach(function(){
                $scope.workflow = {
                    model: 'model'
                };
                $scope.sendMessage();
            });

            it('should not call orchestrateService.loadLogUrl()', function(){
                expect(orchestrateService.loadLogUrl).not.toHaveBeenCalledWith();
            })
        })
    })
});
