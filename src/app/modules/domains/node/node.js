(function() {
    'use strict';

    domainNodeController.$inject = ['$scope', '$stateParams'];
    function domainNodeController($scope, $stateParams) {
        $scope.$watch('networkData', function(networkData) {
            if (!networkData) return;
            $scope.node = findNode(networkData, $stateParams.node, parseInt($stateParams.depth));
        });

        function findNode(currentNode, name, depth) {
            var _depth = -1;
            return findNodeInner(currentNode, name, depth);
            function findNodeInner(currentNode, name, depth) {
                var i, currentChild, result;
                _depth++;
                if (name == currentNode.name && (depth == _depth)) {
                    return currentNode;
                } else if (currentNode.children) {
                    for (i = 0; i < currentNode.children.length; i++) {
                        currentChild = currentNode.children[i];
                        result = findNodeInner(currentChild, name, depth);
                        _depth--;
                        if (result) {
                            return result;
                        }
                    }
                } else {
                    return void 0;
                }
            }
        }
    };

    angular.module('qorDash.domains')
        .controller('DomainNodeController', domainNodeController);
})();
