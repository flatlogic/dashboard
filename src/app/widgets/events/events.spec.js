describe('Controller: EventsController', function(){
    var $controller,
    $rootScope,
    scope,
    pubSubStub;
    beforeEach(function(){
        module('qorDash.widget.events')
    });
    beforeEach(inject(function(_$controller_, _$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));
    beforeEach(function(){
        pubSubStub = {
            subscribe: function(){
                return {
                    remove: function(){}
                }
            }
        };
    });
    function createCtrl() {
        return $controller('EventsController', {
            $scope: scope,
            pubSub: pubSubStub
        })
    }

    describe('init', function(){
        it('defines $scope.events', function(){
            createCtrl();
            expect(scope.events).toBeDefined();
        });
        it('calls pubSub.subscribe', function(){
            spyOn(pubSubStub, 'subscribe');

            createCtrl();

            expect(pubSubStub.subscribe).toHaveBeenCalled();
        });
        describe('when the $destroy event is broadcasted', function(){
            it('removes the subscription', function(){
                createCtrl();
                spyOn(scope.subscription, 'remove');
                scope.$broadcast('$destroy');

                expect(scope.subscription.remove).toHaveBeenCalled();
            });
        });
    });
});
