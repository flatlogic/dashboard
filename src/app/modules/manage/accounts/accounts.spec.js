describe('Controller: AccountsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        accountsService,
        AUTH_API_URL = 'AUTH_API_URL',
        modal,
        serverResponse = 'serverResponse',
        deferred,
        username = 'username',
        email = 'email',
        password = 'password',
        custom_object = 'custom_object',
        token = 'token',
        q,
        errorHandler,
        currentUser,
        rootScope,
        notification;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
    }));
    beforeEach(module('qorDash.manage.accounts'));



    beforeEach(function() {
        accountsService = {
            accounts: {data : [1, 2]},
            createResponse: {
                data: {
                    id : 'id'
                }
            },
            getAccounts: function(token) {
                deferred = q.defer();
                return deferred.promise;
            },
            createAccount: function(username, password, custom_object, token) {
                deferred = q.defer();
                return deferred.promise;
            },
            createGoogleAccount: function(username, email, token) {
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

        notification = {
            success: function(message) {
                return message;
            }
        };

        modal = {
            open: function() {
                return true;
            }
        };
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountsController as vm', {$scope: $scope, accountsService: accountsService, errorHandler: errorHandler, Notification: notification, currentUser: currentUser, $modal: modal, resolvedToken: token, resolvedAccounts: []});
        })
    });

    describe ('newUser', function() {
        beforeEach(function() {
            spyOn(modal, 'open');
            $scope.vm.newUser();
        });
        it ('should call $modal.open', function() {
            expect(modal.open).toHaveBeenCalled();
        });
    });
});
