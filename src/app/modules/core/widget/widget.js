(function () {
    'use strict';

    angular.module('qorDash.widget')
        .directive('qlWidget', qlWidget)
    ;

    qlWidget.$inject = ['user', '$templateRequest', '$compile'];
    function qlWidget(user, $templateRequest, $compile) {
        return {
            replace: true,
            link: function ($scope, $element, $attr) {

                $scope.attributes = $attr;
                $scope.$watch($attr.wsUrl, function (wsUrl) {
                   $scope.wsUrl = wsUrl;
                });

                var loadWidget = function (widgetName, parentElement) {
                    $templateRequest('app/widgets/' + widgetName.toLowerCase() + '/' + widgetName.toLowerCase() + '.html', true).then(function (response) {
                        parentElement.append($compile(response)($scope));
                    }, function () {
                        // TODO Error
                    });
                };

                var value = $attr.qlWidget;
                if (value) {
                    if (!user.hasAccessTo(value)) {
                        $element.remove();
                        $element = null;
                    } else {
                        loadWidget(value, $element);
                    }
                }
            }
        }
    }

})();
