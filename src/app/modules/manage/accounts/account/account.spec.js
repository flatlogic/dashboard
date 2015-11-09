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
        token = 'token',
        error = 'error';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.accounts'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
    }));

    beforeEach(function() {
        accountsService = {
            account: {data : [1, 2]},
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
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountController', {$scope: $scope, accountsService: accountsService, $stateParams: $stateParams, errorHandler: errorHandler, currentUser: currentUser});
        })
    });

    describe('after loading', function(){
        it('should watch token', function(){
            $scope.token = '';
            $scope.$apply();
            expect(accountsService.getAccountById).not.toHaveBeenCalled();
            $scope.token = token;
            $scope.$apply();
            expect(accountsService.getAccountById).toHaveBeenCalledWith(accountId, $scope.token);


        });

        describe('after wathcing and successful getting accountById',function(){
            beforeEach(function(){
                $scope.token = token;
                $scope.$apply();
            });

            it('should populate $scope.account with response.data if success calling accountsService.getAccountById', function(){
                deferred.resolve(accountsService.account);
                $scope.$root.$digest();
                expect($scope.account).toBe(accountsService.account.data);
            });

            it('should call errorHandler and populate $scope.error', function(){
                deferred.reject(error);
                $scope.$root.$digest();
                expect(errorHandler.showError).toHaveBeenCalledWith(error);
                expect($scope.error).toBe(error);
            })
        });



    });


});
