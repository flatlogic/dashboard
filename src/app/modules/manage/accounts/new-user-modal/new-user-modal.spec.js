describe('Controller: NewUserModalController', function() {
    var $scope;
    var $controller,
        httpBackend,
        accountsService,
        AUTH_API_URL,
        modal,
        serverResponse = 'serverResponse',
        deferred,
        githubUsername = 'githubUusername',
        username = 'username',
        email = 'email',
        password = 'password',
        custom_object = 'custom_object',
        token = 'token',
        q,
        errorHandler,
        rootScope,
        notification;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.api'));
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
            },
            createGitHubAccount: function(username, githubUsername, token) {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function(response) {
                return response;
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
            },
            dismiss: function() {
                return true;
            }
        };
    });
    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, $state, _AUTH_API_URL_)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            AUTH_API_URL = _AUTH_API_URL_;
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('NewUserModalController as vm', {$scope: $scope, accountsService: accountsService, errorHandler: errorHandler, Notification: notification, $modalInstance: modal, resolvedAccounts: [], resolvedToken: '123'});
        })
    });

    describe('init', function(){
        it('defines vm.accounts', function() {
            expect($scope.vm.accounts).toBeDefined();
        });
        it('defines vm.token', function() {
            expect($scope.vm.token).toBeDefined();
        });
    });
    describe('_addUserResolve', function() {
        it('populates vm.accounts', function() {
            $scope.vm._addUserResolve(accountsService.createResponse);
            expect($scope.vm.accounts).not.toEqual([]);
        });
        it('calls Notification.success', function() {
            spyOn(notification, 'success');

            $scope.vm._addUserResolve(accountsService.createResponse);

            expect(notification.success).toHaveBeenCalled();
        });
    });
    describe('addUser', function() {
        it('calls accountsService.createAccount', function() {
            spyOn(accountsService, 'createAccount').and.callThrough();

            $scope.vm.addUser(username, password, custom_object);

            expect(accountsService.createAccount).toHaveBeenCalled();
        });
        describe('when the promise resolves', function() {
            it('calls _addUserResolve', function() {
                var deferred = q.defer();
                spyOn(accountsService, 'createAccount').and.returnValue(deferred.promise);
                spyOn($scope.vm, '_addUserResolve');

                $scope.vm.addUser(username, password, custom_object);
                deferred.resolve(accountsService.createResponse);
                rootScope.$digest();

                expect($scope.vm._addUserResolve).toHaveBeenCalledWith(accountsService.createResponse);
            });
        });
    });
    describe('addGoogleUser', function() {
        it('calls accountsService.createGoogleAccount', function() {
            spyOn(accountsService, 'createGoogleAccount').and.callThrough();

            $scope.vm.addGoogleUser(username, email);

            expect(accountsService.createGoogleAccount).toHaveBeenCalled();
        });
        describe('when the promise resolves', function() {
            it('calls _addUserResolve', function() {
                var deferred = q.defer();
                spyOn(accountsService, 'createAccount').and.returnValue(deferred.promise);
                spyOn($scope.vm, '_addUserResolve');

                $scope.vm.addUser(username, password);
                deferred.resolve(accountsService.createResponse);
                rootScope.$digest();

                expect($scope.vm._addUserResolve).toHaveBeenCalledWith(accountsService.createResponse);
            });
        });
    });
    describe('addGitHubUser', function() {
        it('calls accountsService.createGitHubAccount', function() {
            spyOn(accountsService, 'createGitHubAccount').and.callThrough();

            $scope.vm.addGitHubUser(username, githubUsername);

            expect(accountsService.createGitHubAccount).toHaveBeenCalled();
        });
        describe('when the promise resolves', function() {
            it('calls _addUserResolve', function() {
                var deferred = q.defer();
                spyOn(accountsService, 'createAccount').and.returnValue(deferred.promise);
                spyOn($scope.vm, '_addUserResolve');

                $scope.vm.addUser(username, password);
                deferred.resolve(accountsService.createResponse);
                rootScope.$digest();

                expect($scope.vm._addUserResolve).toHaveBeenCalled();
            });
        });
    });
});
