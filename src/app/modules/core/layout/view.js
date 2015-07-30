(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('horizontalUiView', $ViewDirective)
        .directive('horizontalUiSheet', $ViewDirectiveSheet)
        .directive('horizontalUiSheetContent', $ViewDirectiveSheetContent)
        .directive('horizontalUiSheetHeader', $ViewDirectiveSheetHeader);

    $ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate', '$controller', '$compile', 'jQuery'];
    function $ViewDirective($state, $injector, $uiViewScroll, $interpolate, $controller, $compile, $) {

        var directive = {
            restrict: 'ECA',
            terminal: true,
            priority: 400,
            compile: function () {
                return function (scope, $element, attrs) {
                    var onloadExp = attrs.onload || '';

                    $element.addClass('qor-container');

                    scope.$on('$stateChangeSuccess', function () {
                        updateHorizontalView(false);
                    });
                    scope.$on('$viewContentLoading', function () {
                        updateHorizontalView(false);
                    });

                    scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                        if (!$state.includes(fromState)) { //if transitioning to parent state
                            scrollToPreviousSheetIfHidden($);
                        }
                    });

                    //============================= Helpers
                    function _getState(name) {
                        return name && $state.$current && $state.$current.locals[name];
                    }

                    function _computeHorizontalUiViewName(inheritedData, rootViewName) {
                        return rootViewName.indexOf('@') >= 0 ? rootViewName : (rootViewName + '@' + (inheritedData ? inheritedData.state.name : ''));
                    }

                    function _getRootViewName() {
                        return _computeHorizontalUiViewName(null, $interpolate(attrs.horizontalUiView || attrs.name || '')(scope));
                    }

                    function getHorizontalUiViewName(inheritedData) {
                        if (inheritedData.name === '') {
                            return _getRootViewName();
                        } else {
                            return _computeHorizontalUiViewName(inheritedData, '');
                        }
                    }

                    //============================= /Helpers

                    //============================= State View
                    function StateView(name) {
                        this._viewName = name;
                        this._locals = _getState(name);
                    }

                    StateView.prototype.renderView = function (parentScope) {
                        var locals = this._locals;
                        if (locals) {
                            var currentScope = this._scope = parentScope.$new();

                            var newElement = this._element = angular.element(locals.$template || '');
                            $element.append(newElement[0]);
                            newElement.data('$uiView', { name: this._viewName, state: locals.$$state });
                            var link = $compile(newElement[0]);

                            if (locals.$$controller) {
                                locals.$scope = currentScope;
                                var controller = $controller(locals.$$controller, locals);
                                if (locals.$$controllerAs) {
                                    currentScope[locals.$$controllerAs] = controller;
                                }
                                newElement.data('$ngControllerController', controller);
                                newElement.children().data('$ngControllerController', controller);
                            }
                            link(currentScope);
                            scrollToNewSheetIfLackSpace($);
                        }
                        this._scope.$emit('$viewContentLoaded');
                        this._scope.$eval(onloadExp);
                    };

                    StateView.prototype.matchState = function (currentName) {
                        return this._locals === _getState(currentName);
                    };

                    StateView.prototype.tryCreateChildViews = function () {
                        var newName = getHorizontalUiViewName({ name: this._viewName, state: this._locals.$$state });
                        if (newName && _getState(newName)) {
                            var childStateView = this._childStateView = new StateView(newName);
                            childStateView.renderView(this._scope);
                            childStateView.tryCreateChildViews();
                        }
                    };

                    StateView.prototype.destroy = function () {
                        if (this._childStateView) {
                            this._childStateView.destroy();
                        }
                        this._element.remove();
                        this._scope.$destroy();
                    };

                    StateView.prototype.invalidateStates = function () {
                        var newName = getHorizontalUiViewName({ name: this._viewName, state: this._locals.$$state });

                        // TODO: simplify if
                        if (newName) {
                            if (this._childStateView) {
                                if (this._childStateView.matchState(newName)) {
                                    this._childStateView.invalidateStates();
                                } else {
                                    this._childStateView.destroy();
                                    this._childStateView = null;
                                    this.tryCreateChildViews();
                                }
                            } else {
                                this.tryCreateChildViews();
                            }
                        } else {
                            if (this._childStateView) {
                                this._childStateView.destroy();
                            }
                            this._childStateView = null;
                        }
                    };
                    //============================= /State View

                    var rootStateView = new StateView('');
                    rootStateView._scope = scope;

                    function updateHorizontalView(firstTime) {
                        if (!firstTime) {
                            rootStateView.invalidateStates();
                        }
                    }

                    updateHorizontalView(true);
                };
            }
        };

        return directive;
    }

    function scrollToNewSheetIfLackSpace($) {
        var $container = $('.qor-container'),
            allSheetsLength = $container.find('> .qor-sheet').map(function () {
                return $(this).width();
            }).splice(0).reduce(function (acc, el) {
                return acc + el;
            }, 0),
            containerVisibleWidth = $container.width(),
            scrollLeftNew = allSheetsLength - containerVisibleWidth,
            availableWidth = containerVisibleWidth - (allSheetsLength - $container[0].scrollLeft);
        if (availableWidth < 0) {
            $container.animate({
                scrollLeft: scrollLeftNew
            });
        }
    }

    function scrollToPreviousSheetIfHidden($) {
        var $container = $('.qor-container'),
            containerScrollLeft = $container[0].scrollLeft,
            lastSheet = $container.find('> .qor-sheet:last-child');
        if (lastSheet.length) {
            var lastOffset = lastSheet.offset().left,
                sidebarWidth = $(window).width() < 768 ? 0 : 80;
            if (containerScrollLeft > 0 && (lastOffset - sidebarWidth < 0)) {
                $container.animate({
                    scrollLeft: $container[0].scrollLeft + (lastOffset - sidebarWidth)
                });
            }
        }
    }

    function $ViewDirectiveSheet() {
        function link(scope, $element) {
            $element.addClass('qor-sheet');
        }

        controller.$inject = ['$scope', '$state'];
        function controller($scope, $state) {
            var $currentState = $state.$current;
            $scope.sheet = {
                close: function () {
                    $state.go($currentState.parent);
                }
            };
        }

        return {
            controller: controller,
            link: link
        };
    }

    function $ViewDirectiveSheetContent() {
        return {
            link: function (scope, $element) {
                $element.addClass('qor-sheet-content');
            }
        };
    }

    $ViewDirectiveSheetHeader.$inject = ['$compile'];
    function $ViewDirectiveSheetHeader($compile) {
        return {
            require: '^horizontalUiSheet',
            transclude: true,
            replace: true,
            template: '<header class="qor-sheet-header">' +
                '  <div class="qor-sheet-statusbar">' +
                '    <div class="qor-sheet-actions">' +
                '      <button class="qor-sheet-close" ui-sref="^">&times;</button>' +
                '    </div>' +
                '    <h5 class="qor-sheet-title">{{title}}</h5>' +
                '  </div>' +
                '  <div class="qor-sheet-header-content" ng-transclude></div>' +
                '</header>',
            scope: {
                title: '@'
            }
        };
    }

})();
