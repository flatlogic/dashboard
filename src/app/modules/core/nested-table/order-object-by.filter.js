(function() {
    'use strict';

    angular.module('qorDash.core')
        .filter('orderObjectBy', orderObjectBy);

    function orderObjectBy() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
            return filtered;
        };
    }
})();
