describe('Controller: AuthenticationDomainController', function() {

    var $scope;
    var $controller,
        httpBackend,
        authenticationService,
        deferred,
        q,
        errorHandler,
        currentUser;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.settings.authentication.domain'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
        $provide.constant("Notification", "1");
        $provide.constant("resolvedDomain", "1");
    }));

    beforeEach(function() {
        authenticationService = {
            response : {
                data: {
                    "domain": "blinker.com"
                }
            },

            getDomainInfo: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function() {
                return false;
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
            _$controller_('AuthenticationDomainController as vm', {$scope: $scope, authenticationService: authenticationService, errorHandler: errorHandler, currentUser: currentUser, resolvedToken : 'token'});
        })
    });
});
