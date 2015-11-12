describe('Controller: AccountsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        accountsService,
        modal,
        serverResponse = 'serverResponse',
        deferred,
        githubUsername = 'github_username',
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
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
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
        inject(function(_$rootScope_, _$controller_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountsController as vm', {$scope: $scope, accountsService: accountsService, errorHandler: errorHandler, Notification: notification, currentUser: currentUser, $modal: modal});
        })
    });

    describe('after loading token', function() {
        beforeEach(function(){
            spyOn(accountsService, 'getAccounts').and.callThrough();
            spyOn(errorHandler, 'showError').and.callThrough();

            $scope.vm.token = 'token';
            $scope.$apply();
        });

        it ('should call getAccounts from accountService', function() {
            expect(accountsService.getAccounts).toHaveBeenCalled();
        });

        describe ('if account loaded successfully', function() {
            beforeEach(function() {
                deferred.resolve(accountsService.accounts);
                $scope.$root.$digest();
            });

            it ('should populate accounts array with response', function() {
                expect($scope.vm.accounts).toBe(accountsService.accounts.data);
            });
        });

        describe ('if accounts loading failed', function() {
            beforeEach(function() {
                deferred.reject(serverResponse);
                $scope.$root.$digest();
            });

            it ('should show error and save response to the vm.error', function() {
                expect(errorHandler.showError).toHaveBeenCalledWith(serverResponse);
                expect($scope.vm.error).toBe(serverResponse);
            });
        });
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
