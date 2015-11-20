describe('Factory: permissions', function() {
    var permissions, auth, $timeout, USER_HAS_NO_ACCESS;
    var mockPermissionsObj = {
        'passport/@id': '77a9d0d3-f4fc-11e4-9997-0242ac11000a',
        'passport/@scopes': 'my_account,account_update,passport_admin,account_readonly',
        'passport/@status': '',
        'dashboard/@id': '77a9d0d3-f4fc-11e4-9997-0242ac11000a',
        'dashboard/@scopes': 'update',
        'dashboard/@status': '',
        'docker/@id': '77a9d0d3-f4fc-11e4-9997-0242ac11000a',
        'docker/@scopes': 'read',
        'docker/@status': ''
    };

    beforeEach(function(){
        module('qorDash.auth.permissions');
        module(function($provide){
            $provide.constant('USER_HAS_NO_ACCESS', 'User has no permissions');
            $provide.service('auth', function(){
                this.getParsedToken = jasmine.createSpy('getParsedToken').and.callFake(function(num) {
                    return mockPermissionsObj;
                });
            });
        });
    });

    beforeEach(function() {
        inject(function(_permissions_, _auth_, _$timeout_, _USER_HAS_NO_ACCESS_) {
            permissions = _permissions_;
            auth = _auth_;
            $timeout = _$timeout_;
            USER_HAS_NO_ACCESS = _USER_HAS_NO_ACCESS_;
        });
    });

    describe('_createPermissionsMap', function() {
        it ('should get permissions from the token and create permissions map', function() {
            expect(permissions._createPermissionsMap()).toEqual({ dashboard: ['update'], docker: ['read'] });
        });
    });

    describe('hasAccess', function() {
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

    describe('resolveState', function() {
        it ('should reject promise if state is not specified', function() {
            permissions.resolveState().catch(function(error){
                expect(error).toEqual(USER_HAS_NO_ACCESS);
            });
            $timeout.flush();
        });
        it ('should return true if user has permission for selected state', function() {
            expect(permissions.resolveState('app.docker')).toBe(true);
        });
        it ('should reject promise if user has no read permission for selected state', function() {
            permissions.resolveState('app.dashboard').catch(function(error){
                expect(error).toEqual(USER_HAS_NO_ACCESS);
            });
            $timeout.flush();
        });
    });

});
