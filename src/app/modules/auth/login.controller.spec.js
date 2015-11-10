describe('Controller: LoginController', function() {

    var $scope,
        httpBackend,
        deferred, q,
        location,
        user,
        LOGIN_PAGE_ICON_URL = 'LOGIN_PAGE_ICON_URL',
        serverResponse = 'serverResponse',
        message = 'message;',
        window,
        $controller,
        githubOauth;

    beforeEach(module('qorDash.auth', function($provide){
        // Stubbing constants is necessary (for now) because of the way the application
        // is bootstrapped in index.js.
        $provide.constant('AUTH_API_URL', 'api url');
        $provide.constant('GITHUB_CLIENT_ID', 'github client id');
    }));
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
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state, _githubOauth_)  {
            q = $q;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            $controller = _$controller_;
            githubOauth = _githubOauth_;
            $.fn.button = function() {};
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            httpBackend.expectGET('data/permissions.json').respond('');
        })
    });

    function createCtrl() {
        return $controller('LoginController as vm', {$scope: $scope, $state : state, user: user, LOGIN_PAGE_ICON_URL: LOGIN_PAGE_ICON_URL});
    }

    describe('after loading', function() {
        it ('should set ICON_URL to the LOGIN_PAGE_ICON_URL value from injector and init vm.userCredentials & loginButtonState', function() {
            createCtrl();

            expect($scope.vm.ICON_URL).toBe(LOGIN_PAGE_ICON_URL);
            expect($scope.vm.userCredentials).toBeDefined();
            expect($scope.vm.isLoading).toBeDefined();
        });

        it ('should check is user authenticated and send her to the dashboard if yes', function() {
            createCtrl();

            expect(user.isAuthed).toHaveBeenCalled();
            expect(state.go).toHaveBeenCalledWith('app.dashboard');
        });

        it ('should call githubOauth.loginWithGitHubIfRedirectedByPopup', function() {
            spyOn(githubOauth, 'loginWithGitHubIfRedirectedByPopup');

            createCtrl();

            expect(githubOauth.loginWithGitHubIfRedirectedByPopup).toHaveBeenCalled();
        });
    });

    describe('login', function() {
        beforeEach(function(){
            createCtrl();
        });
        beforeEach(function() {
            $scope.vm.loginForm = {
                $setValidity: function(){}
            };
            spyOn(user, 'login').and.callThrough();
            spyOn($scope.vm.loginForm, '$setValidity').and.callThrough();
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
                describe ('after normal server response', function() {
                    beforeEach(function() {
                        deferred.reject({data: {error: serverResponse}});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error[serverResponse] to true', function() {
                        expect($scope.vm.loginForm.$setValidity).toHaveBeenCalledWith(serverResponse, false);
                    });
                });
                describe ('after empty response', function() {
                    beforeEach(function() {
                        deferred.reject();
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$setValidity).toHaveBeenCalledWith('unknown', false);
                    });
                });
                describe ('after response without data field', function() {
                    beforeEach(function() {
                        deferred.reject({});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$setValidity).toHaveBeenCalledWith('unknown', false);
                    });
                });
                describe ('after response without error field', function() {
                    beforeEach(function() {
                        deferred.reject({data: {}});
                        $scope.$root.$digest();
                    });
                    it ('should set vm.loginForm.$error["unknown"] to be true', function() {
                        expect($scope.vm.loginForm.$setValidity).toHaveBeenCalledWith('unknown', false);
                    });
                });
            });
        });
    });
});
