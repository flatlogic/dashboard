describe('Controller: AccountsController', function() {

    var $scope, q, state, stateParams,
        errorHandler,
        domainsLoader,
        rootScope,
        deferred,
        serverResponse = 'response';

    var domains = [{id: 'one'}, {id: 'two'}],
        oneDomainArray = [{ id: 'one'}];

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.orchestrate'));


    beforeEach(function() {
        domainsLoader = {
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
        spyOn(domainsLoader, 'load').and.callThrough();
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
            state = $state;
            stateParams = $stateParams;
            spyOn(state, 'go').and.returnValue(true);
            _$controller_('OrchestrateController as vm', {$scope: $scope, errorHandler: errorHandler, domainsLoader: domainsLoader});
            $httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    it ("should load domains", function() {
        expect(domainsLoader.load).toHaveBeenCalled();
    });

    describe ('after success loading', function() {
        beforeEach(function() {
            stateParams.id = domains[0].id;
            state.current.name = 'app.orchestrate';
        });

        describe ('with multiple domains', function() {
            beforeEach(function(){
                deferred.resolve({data: domains});
                $scope.$digest();
            });
            it ('should set vm.domains to the response value', function(){
                expect($scope.vm.domains).toEqual(domains);
            });
            it ('should set vm.domain to domain with id == stateParams.id', function() {
                expect($scope.vm.domain).toBe(domains[0]);
            });
        });

        describe ('with single domains', function() {
            beforeEach(function(){
                deferred.resolve({data: oneDomainArray});
                $scope.$digest();
            });
            it ('should set vm.domains to the response value', function(){
                expect($scope.vm.domains).toEqual(oneDomainArray);
            });
            it ('should go to app.orchestrate.domain with id', function() {
                expect(state.go).toHaveBeenCalledWith('app.orchestrate.domain', {id : oneDomainArray[0].id})
            });
            it ('should set vm.domain to oneDomainArray[0]', function() {
                expect($scope.vm.domain).toBe(oneDomainArray[0]);
            });
        });
    });

    describe('after failed loading', function() {
        beforeEach(function(){
            spyOn(errorHandler, 'showError').and.callThrough();
            deferred.reject(serverResponse);
            $scope.$digest();
        });
        it ('should call showError and set response value to vm.error', function() {
            expect(errorHandler.showError).toHaveBeenCalledWith(serverResponse);
            expect($scope.vm.error).toBe(serverResponse);
        });
    });
});