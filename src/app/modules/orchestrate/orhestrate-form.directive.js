(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .directive('orchestrateForm', orchestrateForm);

    /**
     * Directive for creating dynamic for on the orchestrate page. You should pass object to the attribute. With the following syntax:
     * {
     *     index: '...',
     *     value: '...'
     * }
     * @returns {{restrict: string, link: link}}
     */
    function orchestrateForm() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            scope.$watch(attrs.orchestrateForm, function(newValue, oldValue){
                if (newValue == oldValue) {
                    createAndAppend(newValue);
                } else if (newValue.length > oldValue.length) {
                    var newElements = $(newValue).not(oldValue).get();
                    createAndAppend(element, newElements);
                }
            }, true);

            /**
             * Create elements based on its properties and append it to parent
             * @param parent
             * @param elementsArray
             */
            function createAndAppend(parent, elementsArray) {
                if (elementsArray) {
                    elementsArray.forEach(function (element) {
                        parent.append(getElement(element.index, element.value));
                    });
                }
            }

            // Get value type
            function getType(value) {
                return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            }

            function getElement(index, value) {
                switch (getType(value)) {
                    case "string":
                        return '<div class="form-group" > ' +
                            '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                            '<div class="col-md-4">' +
                            '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                            '</div>' +
                            '</div>';
                        break;
                    case "number":
                        return '<div class="form-group" > ' +
                            '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                            '<div class="col-md-4">' +
                            '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                            '</div>' +
                            '</div>';
                        break;
                    case "boolean":
                        var checked = value ? 'checked' : '';
                        return '<div class="form-group" > ' +
                            '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                            '<div class="col-md-4">' +
                            '<input class="new-checkbox" id="input-' + index + '" name="input-' + index + '" type="checkbox" ' + checked + '>' + '<label for="input-' + index + '"></label>' +
                            '</div>' +
                            '</div>';
                        break;
                    default:
                        break;
                }
            }
        }
    }
})();