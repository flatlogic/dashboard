(function () {

    angular.module('qorDash.helpers')
        .directive('buttonLoading', buttonLoading);

    function buttonLoading() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var oldText = '';

            scope.$watch(attrs.buttonLoading, function(newValue) {
                if (newValue) {
                    oldText = element.text();
                    element.addClass('disabled');
                    element.text(attrs.loadingText ? attrs.loadingText : 'Loading...');
                } else {
                    if (element.hasClass('disabled') && oldText) {
                        element.removeClass('disabled');
                        element.text(oldText);
                    }
                }
            });
        }
    }
})();