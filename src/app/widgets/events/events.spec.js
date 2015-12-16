describe('Controller: EventsController', function(){
    var $controller,
    $rootScope,
    scope,
    $rootScopeStub;
    beforeEach(function(){
        module('qorDash.widget.events')
    });
    beforeEach(inject(function(_$controller_, _$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));
    beforeEach(function(){
        $rootScopeStub = {
            $on: function(){
                return function(){}
            }
        };
    });
    function createCtrl() {
        return $controller('EventsController', {
            $scope: scope,
            $rootScope: $rootScopeStub
        })
    }

    describe('init', function(){
        it('defines $scope.events', function(){
            createCtrl();
            expect(scope.events).toBeDefined();
        });
        it('subscribes to eventBus events', function(){
            spyOn($rootScopeStub, '$on');

            createCtrl();

            expect($rootScopeStub.$on).toHaveBeenCalled();
        });
        describe('when the $destroy event is broadcasted', function(){
            it('removes the subscription', function(){
                createCtrl();
                spyOn(scope, 'removeSubscription');
                scope.$broadcast('$destroy');

                expect(scope.removeSubscription).toHaveBeenCalled();
            });
        });
    });
});
