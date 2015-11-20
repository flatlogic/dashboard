(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainNodeController', domainNodeController);

    function domainNodeController($scope, $stateParams, resolvedNetworkData) {
        var vm = this;
        vm.node = {};
        vm.node = findNode(resolvedNetworkData, $stateParams.node, parseInt($stateParams.depth));
        function findNode(currentNode, name, depth) {
            var _depth = 0;
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
    }
})();
