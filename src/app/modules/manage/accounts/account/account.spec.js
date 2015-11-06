describe('Controller: AccountController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        accountsService,
        $stateParams = {id: 1},
        errorHandler,
        currentUser,
        accountId = $stateParams.id,
        token = 'token';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.accounts'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
    }));

    beforeEach(function() {
        accountsService = {
            getAccountById: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
        errorHandler = {
            showError: function(error) {
                return error;
            }
        };
        currentUser = {
            then: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            spyOn(accountsService, 'getAccountById').and.callThrough();
            spyOn(errorHandler, 'showError').and.callThrough();
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expectGET('https://accounts.qor.io/v1/account/1').respond('');
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountController', {$scope: $scope, accountsSrevice: accountsService, $stateParams: $stateParams, errorHandler: errorHandler, currentUser: currentUser});
        })
    });

    describe('after loading', function(){

        it('', function(){
            $scope.token = '';
            $scope.$apply();
            expect(accountsService.getAccountById).not.toHaveBeenCalled();
            $scope.token = token;
            $scope.$apply();
            expect(accountsService.getAccountById).toHaveBeenCalled();
        });


    });


});
