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

    describe ('startLoginAnimation', function() {
        beforeEach(function() {
            spyOn($.fn, 'button');
        });
        it ('should change loginButtonState', function() {
            $scope.vm.startLoginAnimation();
            expect($.fn.button).toHaveBeenCalled();
        });
    });

    describe ('stopLoginAnimation', function() {
        beforeEach(function() {
            spyOn($.fn, 'button');
        });
        it ('should change loginButtonState', function() {
            $scope.vm.startLoginAnimation();
            expect($.fn.button).toHaveBeenCalled();
        });
    });

    describe('showErrorMessage', function() {
        it ('should set vm.errorMessage as value of a function', function() {
            setFixtures(sandbox({class: 'has-feedback'}));

            $scope.vm.showErrorMessage(message);

            expect($scope.vm.errorMessage).toBe(message);
            expect($('#sandbox')).toHaveClass('has-error')
        });
    });

    describe('login', function() {
        beforeEach(function() {
            spyOn($scope.vm, 'startLoginAnimation');
            spyOn($scope.vm, 'stopLoginAnimation');
            spyOn(user, 'login').and.callThrough();
        });
        describe('after call', function() {
            beforeEach(function() {
                $scope.vm.userCredentials.login = 'login';
                $scope.vm.userCredentials.password = 'password';
                $scope.vm.login();
            });
            it ('should call startLoginAnimation', function() {
                expect($scope.vm.startLoginAnimation).toHaveBeenCalled();
            });
            it ('should call user.login with credentials', function(){
                expect(user.login).toHaveBeenCalledWith($scope.vm.userCredentials.login, $scope.vm.userCredentials.password);
            });

            describe('after successful loading', function() {
                beforeEach(function() {
                    spyOn(state, 'go');
                    deferred.resolve(serverResponse);
                    $scope.$root.$digest();
                });
                it ('should go to the dashboard', function() {
                    expect(state.go).toHaveBeenCalledWith('app.dashboard');
                });
            });

            describe ('after failed login', function() {
                beforeEach(function() {
                    spyOn($scope.vm, 'showErrorMessage');
                });
                describe ('with error error-account-not-found', function() {
                    beforeEach(function() {
                        deferred.reject({data: {error: 'error-account-not-found'}});
                        $scope.$root.$digest();
                    });
                    it ('should call vm.showErrorMessage with "Account not found"', function() {
                        expect($scope.vm.showErrorMessage).toHaveBeenCalledWith('Account not found');
                    })
                });
                describe ('with error error-bad-credentials', function() {
                    beforeEach(function() {
                        deferred.reject({data: {error: 'error-bad-credentials'}});
                        $scope.$root.$digest();
                    });
                    it ('should call vm.showErrorMessage with "Bad credentials"', function() {
                        expect($scope.vm.showErrorMessage).toHaveBeenCalledWith('Bad credentials');
                    })
                });
                describe ('with no error', function() {
                    beforeEach(function() {
                        deferred.reject();
                        $scope.$root.$digest();
                    });
                    it ('should call vm.showErrorMessage with "Unknown server error"', function() {
                        expect($scope.vm.showErrorMessage).toHaveBeenCalledWith('Unknown server error');
                    })
                });
                describe ('and then', function() {
                    beforeEach(function() {
                        deferred.reject();
                        $scope.$root.$digest();
                    });
                    it ('should call vm.stopLoginAnimation', function() {
                        expect($scope.vm.stopLoginAnimation).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});