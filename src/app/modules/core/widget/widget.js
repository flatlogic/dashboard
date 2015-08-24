(function () {
    'use strict';

    angular.module('qorDash.widget')
        .directive('qlWidget', qlWidget)
        .directive('qlPage', qlPage)
    ;

    qlWidget.$inject = ['user', '$templateRequest', '$compile'];
    function qlWidget(user, $templateRequest, $compile) {
        return {
            replace: true,
            scope:  {
              wsUrl: '='
            },
            link: function ($scope, $element, $attr) {

                $scope.attributes = $attr;

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

    /**
     * Render page as defined in json file.
     * Using: insert attribute ql-page in the parent div of the page with name of the file/controlle.
     * Example: <div ql-page="DashboardController"></div>
     */
    qlPage.$inject = ['user', 'dataLoader', '$templateRequest', '$compile'];
    function qlPage(user, dataLoader, $templateRequest, $compile) {
        return {

            link: function ($scope, $element, $attr) {
                // Global variables to store rows
                var gl = {};
                gl.rows = [];

                /**
                 * Load widget from template and append to row
                 * @param widgetName name of widget
                 * @param sectionIndex index of section in gl.rows array
                 */
                var loadWidget = function (widgetName, parentElement) {
                    $templateRequest('app/widgets/' + widgetName.toLowerCase() + '/' + widgetName.toLowerCase() + '.html', true).then(function (response) {
                        parentElement.append($compile(response)($scope));
                    }, function () {
                        // TODO Error
                    });
                };

                var pageControllerName = $attr.qlPage;
                if (!user.hasAccessTo(pageControllerName)) {
                    return;
                }

                // Load sections list
                dataLoader.getPageSections(pageControllerName).then(function (sectionsObject) {
                    for (var sectionIndex = 0; sectionIndex < sectionsObject.length; sectionIndex++) {
                        var section = sectionsObject[sectionIndex];

                        // Create new row and append to parent div
                        gl.rows[sectionIndex] = angular.element('<div class="row"></div>');
                        $element.append(gl.rows[sectionIndex]);

                        Object.keys(section).forEach(function (sectionName) {
                            var widgets = section[sectionName];
                            for (var widgetIndex = 0; widgetIndex < widgets.length; widgetIndex++) {
                                var widget = widgets[widgetIndex];
                                var parent = angular.element('<div class="col-md-4"></div>');
                                gl.rows[sectionIndex].append(parent);
                                loadWidget(widget, parent);
                            }
                        })
                    }
                });
            }
        }
    }
})();
