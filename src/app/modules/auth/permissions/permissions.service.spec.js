describe('Factory: permissions', function() {
    var serverResponse = {"data":{"acls":[{"resource":"docker","permissions":["read","kill"]},{"resource":"manage","permissions":["read"]},{"resource":"dashboard","permissions":["read"]},{"resource":"domains","permissions":["read"]},{"resource":"compose","permissions":["read"]},{"resource":"configurations","permissions":["read"]},{"resource":"orchestrate","permissions":["read"]}]},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"https://accounts.qor.io/v1/auth","data":{"username":"dashboard-admin","password":"password"},"headers":{"Accept":"application/json","Content-Type":"application/json"}},"statusText":"OK"};
    var permissionsObjMock = {"docker":["read","kill"],"manage":["read"],"dashboard":["read"],"domains":["read"],"compose":["read"],"configurations":["read"],"orchestrate":["read"]};
    var permissions,
        $timeout,
        $window,
        USER_HAS_NO_ACCESS;

    beforeEach(function(){
        module('qorDash.auth.permissions');
        module(function($provide){
            $provide.constant('USER_HAS_NO_ACCESS', 'User has no permissions');
        });
    });

    beforeEach(function() {
        inject(function(_permissions_, _$timeout_, _USER_HAS_NO_ACCESS_, _$window_) {
            permissions = _permissions_;
            $timeout = _$timeout_;
            $window = _$window_;
            $window.localStorage.getItem = jasmine.createSpy('getItem').and.callFake(function(){
                return JSON.stringify(permissionsObjMock);
            });;
            $window.localStorage.setItem = jasmine.createSpy('setItem');
            $window.localStorage.removeItem = jasmine.createSpy('removeItem');
            USER_HAS_NO_ACCESS = _USER_HAS_NO_ACCESS_;
        });
    });

    describe('map', function() {
        it ('should create object with permissions', function() {
            expect(permissions.map(serverResponse.data.acls)).toEqual(permissionsObjMock);
        });
    });

    describe('clear', function() {
        it ('should set current permissions to null and clear localStorage object', function() {
            permissions.current = permissionsObjMock;
            permissions.clear();
            expect(permissions.current).toBe(null);
            expect($window.localStorage.removeItem).toHaveBeenCalledWith(permissions.storageKey);
        });
    });

    describe('save', function() {
        it ('should do nothing if permissions list is empty', function() {
            permissions.save();
            expect($window.localStorage.setItem).not.toHaveBeenCalledWith();
        });
        it ('should do nothing if wrong argument has been passed', function() {
            permissions.save([]);
            expect($window.localStorage.setItem).not.toHaveBeenCalledWith();
        });
        it ('should do nothing if wrong argument has been passed', function() {
            permissions.save(null);
            expect($window.localStorage.setItem).not.toHaveBeenCalledWith();
        });
        it ('should map permissions from the response and save it to the localStorage', function() {
            expect(permissions.current).toBe(null);
            permissions.save(serverResponse);
            expect($window.localStorage.setItem).toHaveBeenCalledWith(permissions.storageKey, JSON.stringify(permissionsObjMock));
        });
    });

    describe('parse', function() {
        it ('should return permissions object from localStorage', function() {
            permissions.parse();
            expect($window.localStorage.getItem).toHaveBeenCalledWith(permissions.storageKey);
        });
    });

    describe('resolveState', function() {
        beforeEach(function() {
            permissions.current = permissionsObjMock;
        });
        it ('should return true if user has permission for selected state', function() {
            expect(permissions.resolveState('app.docker')).toBe(true);
        });
        it ('should reject promise if state is not specified', function() {
            permissions.resolveState().catch(function(error){
                expect(error).toEqual(USER_HAS_NO_ACCESS);
            });
            $timeout.flush();
        });
        it ('should reject promise if user has no read permission for selected state', function() {
            permissions.resolveState('app.events').catch(function(error){
                expect(error).toEqual(USER_HAS_NO_ACCESS);
            });
            $timeout.flush();
        });
    });

    describe('hasAccess', function() {
        describe('permissions exist', function(){
            beforeEach(function() {
                permissions.current = permissionsObjMock;
            });
            it ('should return false if state is not specified', function() {
                expect(permissions.hasAccess()).toBe(false);
            });
            it ('should return false if state is root', function() {
                expect(permissions.hasAccess('app')).toBe(false);
            });
            it ('should return true if state is in white list', function() {
                expect(permissions.hasAccess('login')).toBe(true);
            });
            it ('should return true if user has read permissions for selected state', function() {
                expect(permissions.hasAccess('app.docker')).toBe(true);
            });
            it ('should return false if user has no update permissions for selected state', function() {
                expect(permissions.hasAccess('app.docker', 'update')).toBe(false);
            });
        });
        describe('permissions are not exist', function(){
            beforeEach(function() {
                permissions.current = null;
                permissions.parse = jasmine.createSpy('parse').and.callThrough();
            });
            it ('should check localStorage if there is no cached permissions', function() {
                permissions.hasAccess();
                expect(permissions.parse).toHaveBeenCalledWith();
            });
        });
    });
});
