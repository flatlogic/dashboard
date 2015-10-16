describe('Controller: OrchestrateOptionController', function() {

    var $scope, q, stateParams,
        errorHandler,
        orchestrateService,
        rootScope,
        id = 'id',
        domain = 'domain',
        inst = 'inst',
        WS_URL = 'WS_URL',
        opt = 'opt',
        opt_id = 'opt_id',
        logWsUrl = 'logWsUrl',
        serverResponse = {data: 'response'},
        deferred;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.orchestrate'));

    beforeEach(function() {
        orchestrateService = {
            loadOption: function() {
                deferred = q.defer();
                return deferred.promise;
            },
            loadLogUrl: function() {
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
        spyOn(orchestrateService, 'loadOption').and.callThrough();
        spyOn(orchestrateService, 'loadLogUrl').and.callThrough();
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
            stateParams.opt_id = opt_id;
            stateParams.instance = inst;
            spyOn(state, 'go').and.returnValue(true);
            _$controller_('OrchestrateOptionController as vm', {$scope: $scope, errorHandler: errorHandler, orchestrateService: orchestrateService, WS_URL : WS_URL});
            $httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    describe ('sendMessage', function() {
        describe ('if no vm.workflow.model', function() {
            beforeEach(function() {
                $scope.vm.workflow = {
                    model : undefined
                };
                $scope.vm.sendMessage();
                deferred.resolve({
                    data: {
                        log_ws_url: logWsUrl
                    }
                });
                $scope.$digest();
            });
            it ('should load timelineUrl from server', function() {
                expect(orchestrateService.loadLogUrl).toHaveBeenCalled();
                expect($scope.vm.timeLineUrl).toBe(WS_URL + logWsUrl);
            });
        });
        describe ('if vm.workflow.model is defined', function() {
            beforeEach(function() {
                $scope.vm.workflow = {
                    model : '...'
                };
                $scope.vm.sendMessage();
            });
            it ('should set timeLineUrl', function() {
                expect($scope.vm.timeLineUrl).toBe(WS_URL + '/v1/ws/orchestrate/'+ id +'/'+ inst +'/'+ opt +'/' + opt_id);
            });
        })
    });
});