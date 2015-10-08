(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('tableFixedHeader', $TableFixedHeader);

    $TableFixedHeader.$inject = ['jQuery', '$document'];
    function $TableFixedHeader($, $document) {

        var width = [],
            height = [];

        function setStyle(fixedHeader) {
            fixedHeader.find('th').each(function(i, box){
                $(box).css(
                    {   width : width[i],
                        height : height[i],
                        padding: '8px',
                        margin: '80px'}
                );
            });
        };

        function getSize(element){
            width = [];
            element.find('th').each(function(i, box) {
                width.push(box.offsetWidth);
                height.push(box.offsetHeight);
            });
        };

        return {

            restrict: 'A',
            link: function (scope, element, attrs) {
                var headerSheet,
                    header,
                    content,
                    clonElement,
                    firstAdd =  true;

                header = element.parents('[qor-sidebar-container]').find('.qor-header');
                headerSheet = element.parents('[horizontal-ui-sheet]').find('.qor-sheet-header');
                content = element.parents('[horizontal-ui-sheet]').find('[horizontal-ui-sheet-content]');

                content.on('scroll', function() {
                    
                    if(element.offset().top < headerSheet.height() && firstAdd) {
                        getSize(element);

                        clonElement = element.clone();
                        clonElement.addClass('table-fixed-header');

                        setStyle(clonElement);

                        clonElement.appendTo(headerSheet);
                        firstAdd = false;
                    }

                    if(element.offset().top > headerSheet.height() && !firstAdd) {
                        headerSheet.find('[table-fixed-header]').remove();
                        firstAdd = true;
                    }
                });

                $(window).on('resize', function() {
                    if(headerSheet.find('[table-fixed-header]').is('thead')){
                        getSize(element);
                        setStyle(headerSheet.find('[table-fixed-header]'));
                    }
                })
            }
        };
    }

})();
