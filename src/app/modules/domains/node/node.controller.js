(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainNodeController', domainNodeController);

    function domainNodeController($scope, $stateParams, resolvedNetworkData, $http) {
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
                } else if (currentNode.children || currentNode.url) {
                    if (currentNode.url) {
                        var globalChildrenNodes = $scope.$parent.vm.globalChildren;
                        for (var i = 0, l = globalChildrenNodes.length; i < l; i++) {
                            if (globalChildrenNodes[i].name == currentNode.name) {
                                currentNode = globalChildrenNodes[i];
                                break;
                            }
                        }
                    }
                    if (currentNode.children) {
                        for (i = 0, l = currentNode.children.length; i < l; i++) {
                            currentChild = currentNode.children[i];
                            result = findNodeInner(currentChild, name, depth);
                            _depth--;
                            if (result) {
                                return result;
                            }
                        }
                    }
                }
                else {
                    return void 0;
                }
            }
        }
    }
})();
