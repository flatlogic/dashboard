describe('Controller: DomainsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        $state,
        domains = {1: 2},
        error = 'error',
        domainsLoader,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.domains'));

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
            _$controller_('DomainsController', {$scope: $scope, errorHandler: errorHandler, $state: state, $stateParams: $stateParams, domainsLoader: domainsLoader});
        })
    });

    // При запуске контроллера
    describe('after loding', function(){
        // должна вызываться функция domainsLoader.load()
        it ('should load domains', function() {
            // Проверим это
            expect(domainsLoader.load).toHaveBeenCalled();
        });

        // Наша функция может выполниться либо уcпешно, либо нет (в зависимости от ответа сервера)
        // После успешного ответа
        describe("after successful loading", function () {
            beforeEach(function() {
                // Симитируем успешный ответ с параметрами {data: domains}
                deferred.resolve({data: domains});
                $scope.$root.$digest();
            });
            // response.data должен появиться в скоупе
            it ('should populate $scope.domains with response.data', function() {
                // Проверим
                expect($scope.domains).toBe(domains);
            });

            // Если домен один и стейт текущий нужно редиректить
            it ('should redirect if domain length == 1 and state == app.domains', function() {
                // Зададим условия при которых должен произойти редирект
                beforeEach(function() {
                    // Один домен
                    $scope.domains = [{id: 1}];
                    // Текущий стейт
                    $state.current = {};
                    $state.current.name = 'app.domains';
                });

                // Нужно редиректить на домен
                it ('should not redirect to app.domains', function() {
                    // Проверим что он действительно редиректит и, помимо этого, на правильный домен
                    expect($state.go).toHaveBeenCalledWith('app.domains.domain', {id: 1});
                });
            });

            // Если стейт не текущий то не нужно редиректить
            it ('should not redirect if domain length !== 1 or state == app.domains', function() {
                // Зададим условия при которых должен произойти редирект
                beforeEach(function() {
                    // Один домен
                    $scope.domains = [{id: 1}];
                    // Не текущий стейт
                    $state.current = {};
                    $state.current.name = 'app.domain';
                });

                // Не нужно редиректить на домен
                it ('should not redirect to app.domains', function() {
                    // Проверим что функция не вызывается
                    expect($state.go).not.toHaveBeenCalled();
                });
            });
        });

        // Также ответ может быть с ошибкой
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
