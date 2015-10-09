describe('Controller: AccountsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        accountsService,
        AUTH_API_URL = 'AUTH_API_URL',
        modal,
        serverResponse = 'serverResponse',
        deferred,
        q,
        errorHandler,
        currentUser;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.accounts'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", AUTH_API_URL);
        $provide.constant("Notification", "1");
    }));

    beforeEach(function() {
        accountsService = {
            accounts: {data : [1, 2]},
            getAccounts: function(token) {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function(response) {
                return response;
            }
        };

        currentUser = {
            then: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        modal = {
            open: function() {
                return true;
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
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountsController as vm', {$scope: $scope, accountsService: accountsService, errorHandler: errorHandler, currentUser: currentUser, $modal: modal});
        })
    });


    it('should load accounts array with accounts when token loaded', function() {
        httpBackend.expectGET('data/permissions.json').respond('');
        spyOn(accountsService, 'getAccounts').and.callThrough();

        $scope.vm.token = 'token';
        $scope.$apply();

        deferred.resolve(accountsService.accounts);
        $scope.$root.$digest();

        expect(accountsService.getAccounts).toHaveBeenCalled();
        expect($scope.vm.accounts).toBe(accountsService.accounts.data);
    });

    it('should call errorHandler.showError if domains loaded with errors and save error to vm.error', function() {
        httpBackend.expectGET('data/permissions.json').respond('');
        spyOn(errorHandler, 'showError').and.callThrough();

        $scope.vm.token = 'token';
        $scope.$apply();

        deferred.reject(serverResponse);
        $scope.$root.$digest();

        expect(errorHandler.showError).toHaveBeenCalledWith(serverResponse);
        expect($scope.vm.error).toBe(serverResponse);
    });
});