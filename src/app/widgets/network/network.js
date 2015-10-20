(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork)
        ;

    qlNetwork.$inject = ['d3', '$window', '$stateParams', '$state', '$http', '$timeout'];
    function qlNetwork(d3, $window, $stateParams, $state, $http, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            link: function (scope, element, attrs) {
                d3.d3().then(function (d3) {
                    function initJson() {
                        return $http.get('data/network-data.json')
                            .then(function (res) {
                                scope.sourceJson = res.data;
                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.setNetworkData(scope.sourceJson);
                                    });
                                });
                            });
                    }

                    scope.render = function (data) {
                        var root = data,
                            depth = 7,
                            preScrolLevel = 0,
                            levels = [],
                            queue = [],
                            node;

                        var margin = {top: 20, right: 0, bottom: 0, left: 0},
                            width = element.width(),
                            height = $window.innerHeight - margin.top - margin.bottom - 120 - 45,
                            formatNumber = d3.format(",d"),
                            transitioning;

                        var x = d3.scale.linear()
                            .domain([0, width])
                            .range([0, width]);

                        var y = d3.scale.linear()
                            .domain([0, height])
                            .range([0, height]);

                        var wrap = d3.select(element[0]);

                        var zoom = d3.behavior.zoom()
                            .scaleExtent([1, depth])
                            .on("zoom", zoomed);

                        var svg = wrap.append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.bottom + margin.top)
                            .style("margin-left", -margin.left + "px")
                            .style("margin-right", -margin.right + "px")
                            .classed('network-svg', true)
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .style("shape-rendering", "crispEdges")
                            .call(zoom);

                        var g = svg.append('g');

                        d3.select(self.frameElement).style("height", height + "px");

                        function zoomed() {
                            detalizationRect();
                            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        }

                        function drawRectangle (node) {

                            var rect = g.append("rect")
                                .style("fill", "none")
                                .style("stroke", "blue")
                                .style("stroke-width", "2")
                                .attr("x", node.x)
                                .attr("y", node.y)
                                .attr("width", node.width)
                                .attr("height", node.height);

                            rect.depth = node.depth;

                            if(!levels[node.depth]) {
                                levels[node.depth] = [];
                            }

                            levels[node.depth].push(rect);
                        };

                        queue.push(root);
                        node = queue.shift();

                        node.width = 1350;
                        node.height = 800;
                        node.depth = 1;
                        node.x = 40;
                        node.y = 40;

                        var curParent,
                            curChildNodeRow = 0,
                            curChildNodeColomn = 0,
                            numChildNode,
                            numColomn,
                            marginWidth,
                            marginHeight;

                        var BFS = function(node) {

                            for (var i in node.children) {
                                node.children[i].parent = node;
                                node.children[i].depth = node.depth + 1;
                                queue.push(node.children[i]);
                            }

                            if('parent' in node) {
                                if (!curParent || curParent !== node.parent) {
                                    curChildNodeRow = 1;
                                    curChildNodeColomn = 0;

                                    numChildNode = 1;
                                    curParent = node.parent;

                                    if(queue.length !== 0) {
                                        while (queue[numChildNode - 1].parent === curParent) {
                                            numChildNode++;
                                        }
                                    }

                                    marginWidth = node.parent.width/20;
                                    marginHeight = node.parent.height/20;
                                    numColomn = Math.round( Math.sqrt(numChildNode));
                                }

                                if( numColomn*numColomn < numChildNode) {
                                    numColomn++;
                                }

                                if(curChildNodeColomn < numColomn) {
                                    curChildNodeColomn++;
                                }
                                else {
                                    curChildNodeColomn = 1;
                                    curChildNodeRow++;
                                }

                                node.width = node.parent.width/numColomn - marginWidth * 2;
                                node.height = node.parent.height/numColomn - marginHeight * 2;
                                node.x = node.parent.x + marginWidth * curChildNodeRow + node.width * (curChildNodeRow - 1) ;
                                node.y =  node.parent.y + marginHeight * curChildNodeColomn + node.height * (curChildNodeColomn - 1) ;
                            }

                            drawRectangle(node);

                            if(queue.length !== 0) {
                                BFS(queue.shift());
                            }
                        };

                        function detalizationRect () {

                            var scrolLevel = Math.round(zoom.scale());

                            if(preScrolLevel === scrolLevel)    return;

                            preScrolLevel = scrolLevel;

                            if(!levels[scrolLevel+2]) {
                                scrolLevel = depth - 2;
                            }

                            d3.selectAll("rect").style("fill", "none").style("stroke-width", 1.5/scrolLevel);
                            levels[scrolLevel + 2].forEach(function(item, i) {
                                item.style("fill", "red");
                            });
                        };

                        BFS(node);
                        detalizationRect();
                    };

                    if (!scope.sourceJson) {
                        initJson().then(function () {
                            scope.render(scope.sourceJson)
                        });
                    } else {
                        scope.render(scope.sourceJson);
                    }
                });
            }}
    }

})();
