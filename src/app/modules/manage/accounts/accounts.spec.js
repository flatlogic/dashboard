describe('Controller: AccountsController', function() {

    var $scope,
        $controller,
        modal,
        token = 'token',
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('qorDash.manage.accounts');
        module(function($provide) {
            $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
            $provide.service('modal', function() {
                this.open = jasmine.createSpy('open').and.callThrough();
            });
        });
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _modal_)  {
            $controller = _$controller_;
            modal = _modal_;
            $scope = _$rootScope_.$new();
            _$controller_('AccountsController as vm', {$scope: $scope, $modal: modal, resolvedToken: token, resolvedAccounts: []});
        })
    });

    describe ('newUser', function() {
        beforeEach(function() {
            $scope.vm.newUser();
        });
        it ('should call $modal.open', function() {
            expect(modal.open).toHaveBeenCalled();
        });
    });
});
