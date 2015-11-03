describe('Controller: DomainController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        id = 1,
        domain = {name: "blinker.com"},
        error = 'error',
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

            load: function() {
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
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            $stateParams = {id: id};
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            httpBackend.expectGET('data/permissions.json').respond('');
            spyOn(domainLoader, 'load').and.callThrough();
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DomainController', {$scope: $scope, errorHandler: errorHandler, $stateParams: $stateParams, domainLoader: domainLoader});
        })
    });

    describe('after loading', function(){

        it ('should load domains', function() {
            expect(domainLoader.load).toHaveBeenCalledWith($stateParams.id);
        });

        describe('after successful loading', function(){
            beforeEach(function(){
                deferred.resolve({data: domain});
                $scope.$root.$digest();
            });

            it ('should populate $scope.domain with response.data', function() {
                expect($scope.domain).toBe(domain);
            });
        });

        describe('after failed response', function() {
            beforeEach(function() {
                spyOn(errorHandler, 'showError').and.callThrough();
                // Симитируем ответ
                deferred.reject(error);
                $scope.$root.$digest();
            });
            // Нужно вызвать errorHandler и засунуть ошибку в scope.error
            it ('should call errorHandler and populate $scope.error', function() {
                expect(errorHandler.showError).toHaveBeenCalledWith(error);
                expect($scope.error).toBe(error);
            });
        });
    });


});
