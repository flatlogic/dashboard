(function () {
    'use strict';

    function domainNodeController($scope, $stateParams) {
        $scope.$watch('networkData', function (networkData) {
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
                } else if (currentNode._children) {
                    for (i = 0; i < currentNode._children.length; i++) {
                        currentChild = currentNode._children[i];
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
    }

    angular.module('qorDash.domains')
        .controller('DomainNodeController', domainNodeController);
})();
