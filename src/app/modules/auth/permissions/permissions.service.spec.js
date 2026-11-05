describe('Factory: permissions', function() {
    var serverResponse = {"data":{"acls":[{"resource":"docker","permissions":["read","kill"]},{"resource":"manage","permissions":["read"]},{"resource":"dashboard","permissions":["read"]},{"resource":"domains","permissions":["read"]},{"resource":"compose","permissions":["read"]},{"resource":"configurations","permissions":["read"]},{"resource":"orchestrate","permissions":["read"]}]},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"https://accounts.qor.io/v1/auth","data":{"username":"dashboard-admin","password":"password"},"headers":{"Accept":"application/json","Content-Type":"application/json"}},"statusText":"OK"};
    var permissionsObjMock = {"docker":["read","kill"],"manage":["read"],"dashboard":["read"],"domains":["read"],"compose":["read"],"configurations":["read"],"orchestrate":["read"]};
    var permissions,
        $rootScope,
        $window,
        USER_HAS_NO_ACCESS;

    beforeEach(function(){
        module('qorDash.auth.permissions');
        module(function($provide){
            $provide.constant('USER_HAS_NO_ACCESS', 'User has no permissions');
        });
    });

    beforeEach(function() {
        inject(function(_permissions_, _$rootScope_, _USER_HAS_NO_ACCESS_, _$window_) {
            permissions = _permissions_;
            $rootScope = _$rootScope_;
            $window = _$window_;
            spyOn($window.localStorage, 'getItem').and.returnValue(JSON.stringify(permissionsObjMock));
            spyOn($window.localStorage, 'setItem');
            spyOn($window.localStorage, 'removeItem');
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
            expect($window.localStorage.setItem).not.toHaveBeenCalled();
        });
        it ('should do nothing if wrong argument has been passed', function() {
            permissions.save([]);
            expect($window.localStorage.setItem).not.toHaveBeenCalled();
        });
        it ('should do nothing if wrong argument has been passed', function() {
            permissions.save(null);
            expect($window.localStorage.setItem).not.toHaveBeenCalled();
        });
        it ('should map permissions from the response and save it to the localStorage', function() {
            expect(permissions.current).toBe(null);
            permissions.save(serverResponse);
            expect($window.localStorage.setItem).toHaveBeenCalledWith(permissions.storageKey, JSON.stringify(permissionsObjMock));
        });
    });

    describe('get', function() {
        it ('should return permissions object from localStorage', function() {
            expect(permissions.get()).toEqual(permissionsObjMock);
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
        it ('should allow an unspecified state in the local demo', function() {
            expect(permissions.resolveState()).toBe(true);
        });
        it ('should reject with the access error when hasAccess denies a state', function() {
            spyOn(permissions, 'hasAccess').and.returnValue(false);
            var rejected = jasmine.createSpy('rejected');
            permissions.resolveState('app.events').catch(rejected);
            $rootScope.$digest();
            expect(permissions.hasAccess).toHaveBeenCalledWith('app.events');
            expect(rejected).toHaveBeenCalledWith(USER_HAS_NO_ACCESS);
        });
    });

    describe('hasAccess', function() {
        describe('permissions exist', function(){
            beforeEach(function() {
                permissions.current = permissionsObjMock;
            });
            it ('should allow an unspecified state in the local demo', function() {
                expect(permissions.hasAccess()).toBe(true);
            });
            it ('should allow the root state in the local demo', function() {
                expect(permissions.hasAccess('app')).toBe(true);
            });
            it ('should return true if state is in white list', function() {
                expect(permissions.hasAccess('login')).toBe(true);
            });
            it ('should return true if user has read permissions for selected state', function() {
                expect(permissions.hasAccess('app.docker')).toBe(true);
            });
            it ('should allow demo actions regardless of stored ACLs', function() {
                expect(permissions.hasAccess('app.docker', 'update')).toBe(true);
            });
        });
        describe('permissions are not exist', function(){
            beforeEach(function() {
                permissions.current = null;
            });
            it ('should allow demo access without reading stored ACLs', function() {
                expect(permissions.hasAccess()).toBe(true);
                expect($window.localStorage.getItem).not.toHaveBeenCalled();
            });
        });
    });
});
