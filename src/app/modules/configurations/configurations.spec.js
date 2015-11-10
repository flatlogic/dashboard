describe('Controller: ConfigurationsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams = {id: 1},
        $state,
        domains = [{id: 2}, {id: 3}, {id: 1}],
        domain = {},
        error = 'error',
        domainsLoader,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.configurations'));

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
            showError: function(error) {
                return error;
            }
        };
        $state = {
            go: function(path) {
                return path;
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
            httpBackend.expectGET('data/permissions.json').respond('');
            spyOn(domainsLoader, 'load').and.callThrough();
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('ConfigurationsController', {$scope: $scope, errorHandler: errorHandler, $state: state, $stateParams: $stateParams, domainsLoader: domainsLoader});
        })
    });

    describe('after loding', function(){
        it ('should load domains', function() {
            expect(domainsLoader.load).toHaveBeenCalled();
        });

        describe("after successful loading", function () {
            beforeEach(function() {
                deferred.resolve({data: domains});
                $scope.$root.$digest();
            });
            it ('should populate $scope.domains with response.data', function() {
                expect($scope.domains).toBe(domains);
            });

            it ('should redirect if domain length == 1 and state == app.configurations', function() {
                beforeEach(function() {
                    $scope.domains = [{id: 1}];
                    $state.current = {};
                    $state.current.name = 'app.configurations';
                });

                it ('should not redirect to app.domains', function() {
                    expect($state.go).toHaveBeenCalledWith('app.configurations.services', {id: 1});
                });
            });

            it ('should not redirect if domain length !== 1 or state == app.configurations', function() {
                beforeEach(function() {
                    $scope.domains = [{id: 1}];
                    $state.current = {};
                    $state.current.name = 'app.configurations';
                });

                it ('should not redirect to app.configurations', function() {
                    expect($state.go).not.toHaveBeenCalled();
                });
            });

            it('should populate $scope.domain if domain.id == stateParams.id', function(){
                domain.id = $stateParams.id;
                expect($scope.domain).toEqual(domain);
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
