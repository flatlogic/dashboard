describe('Compose example controller test', function() {

    var $scope;
    var $controller;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.compose'));

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            _$controller_('ComposeController', {$scope: $scope});
        })
    });

    it('$scope.number', function(){
        expect($scope.number).toEqual(1);
        $scope.plus();
        expect($scope.number).toEqual(2);
    });

});
