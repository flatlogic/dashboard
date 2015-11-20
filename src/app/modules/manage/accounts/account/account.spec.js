describe('Controller: AccountController', function() {

    var $scope;
    var resolvedAccount,
        objectEdit,
        type = 'type',
        data = 'data',
        path = 'path',
        key = 'key';

    beforeEach(function(){
        module('ui.router');
        module('qorDash.manage.accounts');
    });

    objectEdit = {
        dataChanged: function(e) {
            return e;
        }
    };

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            spyOn(objectEdit, 'dataChanged').and.callThrough();
            _$controller_('AccountController as vm', {$scope:$scope, resolvedAccount: resolvedAccount, objectEdit: objectEdit});

        })
    });

    it('should populate $scope.vm.config with {".services": "add"}',function(){
        expect($scope.vm.config).toEqual({".services": "add"});
    });

    it('should $scope.vm.isDataChanged to be false',function(){
        expect($scope.vm.isDataChanged).toBe(false);
    });

    describe('call $scope.vm.dataChanged()', function () {
        beforeEach(function () {
            $scope.vm.dataChanged(type,path,data,key);
        });
        it('should call objectEdit.dataChanged($scope.vm.account, type, path, data, key)',function(){
            expect(objectEdit.dataChanged).toHaveBeenCalledWith($scope.vm.account, type, path, data, key);
        });

        it('should $scope.vm.isDataChanged to be true',function(){
            expect($scope.vm.isDataChanged).toBe(true);
        });
    });

    describe('call $scope.vm.save()', function () {
        beforeEach(function () {
            $scope.vm.isDataChanged = true;
            $scope.vm.save();
        });

        it('should $scope.vm.isDataChanged to be false',function(){
            expect($scope.vm.isDataChanged).toBe(false);
        });
    });
});
