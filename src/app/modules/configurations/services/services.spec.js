describe('Controller: ServicesController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams = {
            domain: 1
        },
        $state,
        data = {
            services: [{id: 1}]
        },
        error = 'error',
        domainLoader,
        domain = {id:1},
        errorHandler,
        obj = {id: 1, name: 'name'};

    it('Object.size()', function(){
        expect(Object.size(obj)).toBe(2);
    });


    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.configurations'));



    beforeEach(function() {
        domainLoader = {
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
            },
            current: {
                name: ''
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, _$state_)  {
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
            spyOn(domainLoader, 'load').and.callThrough();
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
            _$controller_('ServicesController', {$scope: $scope, errorHandler: errorHandler, $state: $state, $stateParams: $stateParams, domainLoader: domainLoader});
        })
    });

    describe('after loading', function(){
        describe('',function(){
            it('', function(){
                $scope.domains = [{id:1}, {id:2}];
                $scope.$apply();
                expect($scope.domain).toEqual(domain);
            });
        });


        it ('should load domain', function() {
            expect(domainLoader.load).toHaveBeenCalledWith($stateParams.domain);
        });


        describe("after successful loading", function () {
            beforeEach(function() {
                deferred.resolve({data: data});

            });
            it ('should populate $scope.domains with response.data', function() {
                $scope.$root.$digest();
                expect($scope.services).toBe(data.services);
            });

            describe ('should redirect if services length == 1 and state == app.configurations.services', function() {
                beforeEach(function() {
                    $state.current.name = 'app.configurations.services';
                });
                it('should redirect to app.configurations.domain',function(){
                    $scope.$root.$digest();
                    expect($state.go).toHaveBeenCalledWith('.state', {service: $scope.services[0]});
                });

            });

            describe ('should not redirect if services length !== 1 or state == app.configurations.services.service', function() {
                beforeEach(function() {
                    $state.current.name = 'app.configurations.services.service';
                });

                it ('should not redirect to app.configurations.services', function() {
                    $scope.$root.$digest();
                    expect($state.go).not.toHaveBeenCalled();
                });
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
