describe("Controller: NestedTableController", function () {
    var element, controller, scope;

    beforeEach(module('qorDash.core'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend, $controller) {
        $httpBackend.expectGET('data/permissions.json').respond('');
        $httpBackend.expectGET('app/modules/core/nested-table/nested-table.html').respond('');

        scope = $rootScope.$new();
        $controller('NestedTableController as vm', {$scope: scope});
    }));

    it("should init vm.displayOptions", inject(function() {
        expect(scope.vm.displayOptions).toBeDefined();
    }));

    describe("isObject()", function() {
        it("should return true if passed argument is object", function() {
            expect(scope.vm.isObject({1:2})).toBe(true);
        });
        it("should return false if passed argument is not an object", function() {
            expect(scope.vm.isObject(1)).toBe(false);
            expect(scope.vm.isObject("string")).toBe(false);
        });
    });

    describe("isArray()", function() {
        it("should return true if passed argument is array", function() {
            expect(scope.vm.isArray([1,2])).toBe(true);
        });
        it("should return false if passed argument is not an array", function() {
            expect(scope.vm.isArray(1)).toBe(false);
            expect(scope.vm.isArray("string")).toBe(false);
            expect(scope.vm.isArray({1:2})).toBe(false);
        });
    });

    describe("isEditable()", function() {
        beforeEach(function() {
            scope.vm.config = {
                ".one.two.three": "edit"
            };
        });
        it("should return false if argument is not defined", function() {
            expect(scope.vm.isEditable()).toBe(false);
        });
        it("should return true if path is editable", function() {
            expect(scope.vm.isEditable(".one.two.three")).toBe(true);
        });
        it("should return false if path is not editable", function() {
            expect(scope.vm.isEditable(".one.two")).toBe(false);
            expect(scope.vm.isEditable(".")).toBe(false);
            expect(scope.vm.isEditable(".one.two.three.four")).toBe(false);
        });
    });

    describe("isPlusAvailable()", function() {
        beforeEach(function() {
            scope.vm.config = {
                ".one.two.three": "add"
            };
        });
        it("should return false if argument is not defined", function() {
            expect(scope.vm.isPlusAvailable()).toBe(false);
        });
        it("should return true if add is available for path", function() {
            expect(scope.vm.isPlusAvailable(".one.two.three")).toBe(true);
        });
        it("should return false if add is not available for path", function() {
            expect(scope.vm.isPlusAvailable(".one.two")).toBe(false);
            expect(scope.vm.isPlusAvailable(".")).toBe(false);
            expect(scope.vm.isPlusAvailable(".one.two.three.four")).toBe(false);
        });
    });

    describe("isVisible()", function() {
        beforeEach(function() {
            scope.vm.displayOptions = {
                ".one.two": true
            };
        });
        it("should return true if argument is not defined", function() {
            expect(scope.vm.isVisible()).toBe(true);
        });
        it("should return true if value of vm.displayOptions for parent path is true or if parent is not defined", function() {
            expect(scope.vm.isVisible(".one.two.three")).toBe(true);
            expect(scope.vm.isVisible(".")).toBe(true);
        });
        it("should return true if value of vm.displayOptions for parent path is not true", function() {
            expect(scope.vm.isVisible(".one.two")).toBe(false);
            expect(scope.vm.isVisible(".one.two.three.four")).toBe(false);
        });
    });

    describe("changeDisplayState()", function() {
        beforeEach(function() {
            scope.vm.displayOptions = {
                ".one.two": true
            };
        });
        it ("should change value of vm.displayOptions to opposite by path", function() {
            scope.vm.changeDisplayState(".one.two");
            expect(scope.vm.displayOptions[".one.two"]).toBe(false);
        });
    });

    describe("getDisplayState()", function() {
        beforeEach(function() {
            scope.vm.displayOptions = {
                ".one.two": true
            };
        });
        it ("should return  value of vm.displayOptions to opposite by path", function() {
            scope.vm.changeDisplayState(".one.two");
            expect(scope.vm.displayOptions['.one.two']).toBe(false);
        });
    });

    describe("addElement()", function() {
        beforeEach(function() {
            scope.vm.onchange = function(){};
            spyOn(scope.vm, "onchange").and.callThrough();
        });
        describe("if vm.data is array", function() {
            beforeEach(function() {
                scope.vm.data = [1,2];
            });
            it("should call vm.onchange with 'add-value' and path", function() {
                scope.vm.addElement('path');
                expect(scope.vm.onchange).toHaveBeenCalledWith('add-value', 'path');
            });
        });
        describe("if vm.data is object", function() {
            beforeEach(function() {
                scope.vm.data = {1:2};
            });
            it("should call vm.onchange with 'add-object', path, lask object value and last key + new", function() {
                scope.vm.addElement('path');
                expect(scope.vm.onchange).toHaveBeenCalledWith('add-object', 'path', 2, '1-new');
            });
        });
    });

    describe("updateData()", function() {
        beforeEach(function() {
            scope.vm.onchange = function(){};
            spyOn(scope.vm, "onchange").and.callThrough();
        });
        describe("if type == 'key'", function() {
            it("should call vm.onchange with 'edit-key' and path", function() {
                scope.vm.updateData('path', 'data', 'oldValue', 'key');
                expect(scope.vm.onchange).toHaveBeenCalledWith('edit-key', 'path', 'data', 'oldValue');
            });
        });
        describe("if type !== 'key'", function() {
            it("should call vm.onchange with 'edit-key' and path", function() {
                scope.vm.updateData('path', 'data', 'oldValue', 'keys');
                expect(scope.vm.onchange).toHaveBeenCalledWith('edit-value', 'path', 'data');
            });
        });
    });
 });
