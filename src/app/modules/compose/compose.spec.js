describe('Compose example controller test', function() {

    var $scope;
    var $controller;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.compose'));

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            _$controller_('ComposeController', {$scope: $scope});
        })
    });

    it('$scope.number', function(){
        expect($scope.number).toEqual(1);
        $scope.plus();
        expect($scope.number).toEqual(2);
    });

});
