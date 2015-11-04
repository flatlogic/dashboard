(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork);

    function qlNetwork($window, $stateParams, $state, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                networkData: '=',
                showDetails: '='
            },
            bindToController: true,
            controller: networkViewController,
            controllerAs: 'vm'
        };

        function networkViewController($scope, $element, $attrs) {
            var vm = this;

            $scope.$watch('vm.networkData', function(networkData) {
                if (networkData && Object.keys(networkData).length !== 0) {
                    render(networkData);
                }
            });

            function render(data) {
                $element.html('');

                vm.root = data;
                vm.levels = [];
                vm.queue = [];
                vm.unusedRect = [];

                initSvg($element);

                detalizationRect();
            }

            function initSvg($element) {
                var margin = {top: 20, right: 0, bottom: 0, left: 0},
                    width = $element.width(),
                    height = $window.innerHeight - margin.top - margin.bottom - 80;


                vm.zoom = d3.behavior.zoom();

                var svg = d3.select($element[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.bottom + margin.top)
                    .style("margin-left", -margin.left + "px")
                    .style("margin-right", -margin.right + "px")
                    .classed('network-svg', true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .style("shape-rendering", "crispEdges")
                    .call(vm.zoom);

                vm.g = svg.append('g');

                vm.queue.push(vm.root);
                vm.node = vm.queue.shift();

                vm.node.width =  (width + margin.left + margin.right) * 9/10;
                vm.node.height = (height + margin.bottom + margin.top) * 8/10;
                vm.node.headerheight = (vm.node.height) * 1/10;
                vm.node.x = (vm.node.width) * 1/20;
                vm.node.y = (vm.node.height) * 1/20;
                vm.node.depth = 1;

                BFS(vm.node);

                vm.depth = Math.pow(2, vm.levels.length - 1);

                vm.zoom.scaleExtent([1, vm.depth])
                    .on("zoom", zoomed);
            }

            function BFS (node) {
                for (var i in node.children) {
                    node.children[i].parent = node;
                    node.children[i].depth = node.depth + 1;
                    vm.queue.push(node.children[i]);
                }

                if('parent' in node) {

                    if (!vm.curParent || vm.curParent !== node.parent) {
                        vm.curChildNodeRow = 1;
                        vm.curChildNodeColumn = 0;
                        vm.numChildNode = 1;

                        vm.curParent = node.parent;

                        if(vm.queue.length !== 0) {
                            while (vm.queue[vm.numChildNode - 1].parent === vm.curParent) {
                                vm.numChildNode++;
                            }
                        }
                    }

                    countColumn();

                    vm.marginWidth = node.parent.width/20;
                    vm.marginHeight = node.parent.height/20;

                    node.width = node.parent.width/vm.numColumn - vm.marginWidth * 1.5;
                    node.height = node.parent.height/vm.numColumn - vm.marginHeight * 1.5;
                    node.x = node.parent.x + vm.marginWidth * vm.curChildNodeRow + node.width * (vm.curChildNodeRow - 1) ;
                    node.y = node.parent.headerheight + node.parent.y + vm.marginHeight * vm.curChildNodeColumn + node.height * (vm.curChildNodeColumn - 1) ;
                    node.height = node.height * 9/10;
                    node.headerheight = node.height * 1/10;
                }

                drawRect(node);
                setLevels(node);

                if(vm.queue.length !== 0) {
                    BFS(vm.queue.shift());
                }
            }

            function drawRect (node) {
                vm.g.append("rect")
                    .style("fill", "#ffffff")
                    .style("stroke", "#949da5")
                    .style("stroke-width", "1.4")
                    .classed('network-body', true)
                    .attr("rx", "3px")
                    .attr("x", node.x)
                    .attr("y", node.y)
                    .attr("width", node.width)
                    .attr("height", node.height + node.headerheight)
                    .on("click", function() {
                        if (d3.event.defaultPrevented) return;
                        vm.showDetails(node);
                    });

                vm.g.append("rect")
                    .style("fill", "#dae0ed")
                    .style("stroke", "none")
                    .style("stroke-width", "1.4")
                    .classed('network-title', true)
                    .attr("rx", "3px")
                    .attr("x", node.x)
                    .attr("y", node.y)
                    .attr("width", node.width)
                    .attr("height", node.headerheight)
                    .append("title")
                    .text(node.name);

                vm.g.append("text")
                    .style("fill", "#476bb8")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width/2)
                    .attr("y", node.y + node.headerheight / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 14)  + "px")
                    .text(node.name);
            }

            function setLevels(node) {

                if(!vm.levels[node.depth]) {
                    vm.levels[node.depth] = [];
                }

                vm.levels[node.depth].push(node);
            }

            function zoomed() {
                preventDefaultScroll($element);
                detalizationRect();
                vm.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function detalizationRect () {
                var scrollLevel = Math.round(vm.zoom.scale());

                if(vm.preScrollLevel === scrollLevel)    return;

                vm.preScrollLevel = scrollLevel;

                removeUnusedRect();

                if(vm.levels[scrollLevel+2]) {
                    vm.levels[scrollLevel + 2].forEach(function (item, i) {

                        var rect = {};

                        rect.body = vm.g.append("rect")
                            .style("fill", "#fff")
                            .style("stroke", "#949da5")
                            .style("stroke-width", 1.4/scrollLevel)
                            .classed('network-body', true)
                            .attr("rx", 3/scrollLevel + "px")
                            .attr("x", item.x)
                            .attr("y", item.y)
                            .attr("width", item.width)
                            .attr("height", item.height + item.headerheight)
                            .on("click", function() {
                                if (d3.event.defaultPrevented) return;
                                vm.showDetails(item);
                            });

                        rect.text = vm.g.append("text")
                            .style("fill", "#476bb8")
                            .attr("x", item.x + item.width/2)
                            .attr("y", item.y + item.height / 2)
                            .attr("text-anchor", "middle")
                            .attr("dy", ".35em")
                            .attr("font-size", item.height / 3  + "px")
                            .text(item.name);

                        vm.unusedRect.push(rect);
                    });
                }

                d3.selectAll(".network-body")
                    .style("stroke-width", 1.4/scrollLevel)
                    .attr("rx", 3/scrollLevel + "px");

                d3.selectAll(".network-title")
                    .style("stroke-width", 1.4/scrollLevel)
                    .attr("rx", 3/scrollLevel + "px")
            }

            function countColumn() {

                vm.numColumn = Math.round( Math.sqrt(vm.numChildNode));

                if( vm.numColumn*vm.numColumn < vm.numChildNode) {
                    vm.numColumn++;
                }

                if(vm.curChildNodeColumn < vm.numColumn) {
                    vm.curChildNodeColumn++;
                }
                else {
                    vm.curChildNodeColumn = 1;
                    vm.curChildNodeRow++;
                }
            }

            function removeUnusedRect() {
                vm.unusedRect.forEach(function(item){
                    item.body.remove();
                    item.text.remove();
                });
                vm.unusedRect = [];
            }
        }

        function preventDefaultScroll(element) {
            $(element).on({
                'mousewheel': function(e) {
                    if (e.target.id == 'el') return;
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

    }

})();
