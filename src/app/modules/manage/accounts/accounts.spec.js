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

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.accounts'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", AUTH_API_URL);
    }));

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
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AccountsController as vm', {$scope: $scope, accountsService: accountsService, errorHandler: errorHandler, Notification: notification, currentUser: currentUser, $modal: modal});
            httpBackend.expectGET('data/permissions.json').respond('');
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

    describe ('addUser', function() {
        describe('when called with email', function() {
            beforeEach(function() {
                spyOn(accountsService, 'createGoogleAccount').and.callThrough();
                this.resultPromise = $scope.vm.addUser(username, email, password, custom_object, token);
            });
            it ('should call createGoogleAccount', function() {
                expect(accountsService.createGoogleAccount).toHaveBeenCalledWith(username, email, $scope.vm.token);
            });
            it ('should return promise', function() {
                expect(typeof this.resultPromise.then).toEqual('function');
            });
            describe ('when loading completed successfully', function() {
                beforeEach(function() {
                    spyOn(notification, 'success');
                    deferred.resolve(accountsService.createResponse);
                    rootScope.$digest();
                });
                it ('should populate vm.accounts with response', function() {
                    expect($scope.vm.accounts).toContain({
                        id: accountsService.createResponse.data.id,
                        primary: accountsService.createResponse.data
                    });
                });
                it ('should show success message', function() {
                    expect(notification.success).toHaveBeenCalled();
                });
            });
            describe ('when loading failed', function() {
                beforeEach(function() {
                    spyOn(errorHandler, 'showError').and.callThrough();
                    deferred.reject(serverResponse);
                    rootScope.$digest();
                });
                it ('should show an error and set vm.error', function() {
                    expect(errorHandler.showError).toHaveBeenCalledWith(serverResponse);
                    expect($scope.vm.error).toEqual(serverResponse);
                });
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