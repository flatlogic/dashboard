describe('Controller: LoginController', function() {

    var $scope,
        httpBackend,
        deferred, q,
        location,
        user,
        LOGIN_PAGE_ICON_URL = 'LOGIN_PAGE_ICON_URL',
        serverResponse = 'serverResponse',
        message = 'message;',
        window;

    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        user = {
            login: function(login, password) {
                deferred = q.defer();
                return deferred.promise;
            },
            isAuthed : function() {
                return true;
            }
        };

        state = {
            go: function(path) {
                return path;
            }
        };
    });

    beforeEach(function() {
        spyOn(user, 'isAuthed').and.callThrough();
        spyOn(state, 'go').and.callThrough();
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            $.fn.button = function() {};
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('LoginController as vm', {$scope: $scope, $state : state, user: user, LOGIN_PAGE_ICON_URL: LOGIN_PAGE_ICON_URL});
            httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    describe('after loading', function() {
        it ('should set ICON_URL to the LOGIN_PAGE_ICON_URL value from injector and init vm.userCredentials & loginButtonState', function() {
            expect($scope.vm.ICON_URL).toBe(LOGIN_PAGE_ICON_URL);
            expect($scope.vm.userCredentials.login).toBeDefined();
            expect($scope.vm.userCredentials.password).toBeDefined();
            expect($scope.vm.loginButtonLoadingState).toBeDefined();
        });

        it ('should check is user authenticated and send her to the dashboard if yes', function() {
            expect(user.isAuthed).toHaveBeenCalled();
            expect(state.go).toHaveBeenCalledWith('app.dashboard');
        });
    });

    describe('login', function() {
        beforeEach(function() {
            spyOn(user, 'login').and.callThrough();
        });
        describe('after call', function() {
            beforeEach(function() {
                $scope.vm.userCredentials.login = 'login';
                $scope.vm.userCredentials.password = 'password';
                $scope.vm.login();
            });
            it ('should call user.login with credentials', function(){
                expect(user.login).toHaveBeenCalledWith($scope.vm.userCredentials.login, $scope.vm.userCredentials.password);
            });

            describe('after successful loading', function() {
                beforeEach(function() {
                    deferred.resolve(serverResponse);
                    $scope.$root.$digest();
                });
                it ('should go to the dashboard', function() {
                    expect(state.go).toHaveBeenCalledWith('app.dashboard');
                });
            });

            describe('after login fail', function() {
                beforeEach(function() {
                    $scope.vm.loginForm = {
                        $error : {}
                    };
                });
                describe ('after normal server response', function() {
                    beforeEach(function() {
                        deferred.reject({data: {error: serverResponse}});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error[serverResponse] to true', function() {
                        expect($scope.vm.loginForm.$error[serverResponse]).toBe(true);
                    });
                });
                describe ('after empty response', function() {
                    beforeEach(function() {
                        deferred.reject();
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$error['unknown']).toBe(true);
                    });
                });
                describe ('after response without data field', function() {
                    beforeEach(function() {
                        deferred.reject({});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$error['unknown']).toBe(true);
                    });
                });
                describe ('after response without error field', function() {
                    beforeEach(function() {
                        deferred.reject({data: {}});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$error['unknown']).toBe(true);
                    });
                });
            });
        });
    });
});