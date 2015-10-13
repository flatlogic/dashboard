describe("Directive: buttonLoading", function() {
    var $compile, $scope, element;
    $scope = element = $compile = void 0;

    beforeEach(module("qorDash.helpers"));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
    }));

    it("should set button text to the value of `data-loading-text` attribute and add 'disabled' class if attr value is true", function() {
        element = angular.element('<button data-loading-text="Loading" data-button-loading="loadingState">Text</div>');

        $scope.loadingState = true;

        $compile(element)($scope);
        $scope.$digest();

        expect(element.hasClass('disabled')).toBe(true);
        expect(element.text()).toBe('Loading');
    });

    describe ("if attr value is true and element", function() {
        describe ("if element has `data-loading-text` attribute", function() {
            beforeEach(function() {
                element = angular.element('<button data-loading-text="Loading" data-button-loading="loadingState">Text</div>');
            });
            it("should set button text to the value of `data-loading-text` attribute and add 'disabled' class", function() {
                $scope.loadingState = true;

                $compile(element)($scope);
                $scope.$digest();

                expect(element.hasClass('disabled')).toBe(true);
                expect(element.text()).toBe('Loading');
            });
        });
        describe ("if element hasn't `data-loading-text` attribute", function() {
            beforeEach(function () {
                element = angular.element('<button data-button-loading="loadingState">Text</div>');
            });
            it("should set button text to 'Loading...' and add 'disabled' class", function () {
                $scope.loadingState = true;

                $compile(element)($scope);
                $scope.$digest();

                expect(element.hasClass('disabled')).toBe(true);
                expect(element.text()).toBe('Loading...');
            });
        });
    });

    describe ("if attr value is false and element has 'disabled' class", function() {
        beforeEach(function() {
            element = angular.element('<button data-button-loading="loadingState">Text</div>');
        });
        it("should set button text to old value and remove 'disabled' class", function () {
            $scope.loadingState = true;

            $compile(element)($scope);
            $scope.$digest();

            $scope.loadingState = false;
            $scope.$digest();

            expect(element.hasClass('disabled')).toBe(false);
            expect(element.text()).toBe('Text');
        });
    });

    describe ("if attr value is false and element hasn't 'disabled' class", function() {
        beforeEach(function() {
            element = angular.element('<button data-button-loading="loadingState">Text</div>');
            spyOn(element, 'hasClass').and.callThrough();
            spyOn(element, 'text');
        });
        it("should do nothing", function () {
            $scope.loadingState = false;
            $scope.$digest();

            expect(element.hasClass).not.toHaveBeenCalled();
            expect(element.text).not.toHaveBeenCalled();
        });

    });

});