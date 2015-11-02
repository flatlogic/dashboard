(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork)
        ;

    function preventDefault() {
        $('.network').on({
            'mousewheel': function(e) {
                if (e.target.id == 'el') return;
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };

    qlNetwork.$inject = ['d3', '$window', '$stateParams', '$state', 'networkViewService', '$timeout'];
    function qlNetwork(d3, $window, $stateParams, $state, networkViewService, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            link: function (scope, element, attrs) {

                d3.d3().then(function (d3) {
                    function initJson() {
                        return networkViewService.load()
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
                            depth,
                            preScrolLevel,
                            levels = [],
                            queue = [],
                            node,
                            curParent,
                            curChildNodeRow,
                            curChildNodeColomn,
                            numChildNode,
                            numColomn,
                            marginWidth,
                            marginHeight,
                            unusedRect = [];

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

                        var zoom = d3.behavior.zoom();

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

                        d3.select(self.frameElement)
                            .style("height", height + "px");

                        queue.push(root);
                        node = queue.shift();

                        node.width = 1200;
                        node.height = 720;
                        node.headerheight = 80;
                        node.depth = 1;
                        node.x = 40;
                        node.y = 40;

                        BFS(node);

                        depth = Math.pow(2, levels.length - 1);

                        zoom.scaleExtent([1, depth])
                            .on("zoom", zoomed);

                        detalizationRect();

                        function BFS (node) {

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
                                }
                                countColumn();

                                marginWidth = node.parent.width/20;
                                marginHeight = node.parent.height/20;

                                node.width = node.parent.width/numColomn - marginWidth * 1.5;
                                node.height = node.parent.height/numColomn - marginHeight * 1.5;
                                node.x = node.parent.x + marginWidth * curChildNodeRow + node.width * (curChildNodeRow - 1) ;
                                node.y = node.parent.headerheight + node.parent.y + marginHeight * curChildNodeColomn + node.height * (curChildNodeColomn - 1) ;
                                node.height = node.height * 9/10;
                                node.headerheight = node.height * 1/10;
                            }

                            drawRect(node);

                            if(queue.length !== 0) {
                                BFS(queue.shift());
                            }
                        };

                        function drawRect (node) {

                            g.append("rect")
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

                            var rect = g.append("rect")
                                .style("fill", "none")
                                .style("stroke", "#949da5")
                                .style("stroke-width", "1.4")
                                .classed('network-body', true)
                                .attr("rx", "3px")
                                .attr("x", node.x)
                                .attr("y", node.y)
                                .attr("width", node.width)
                                .attr("height", node.height + node.headerheight);

                            g.append("text")
                                .style("fill", "#476bb8")
                                .attr("x", node.x + node.width/20)
                                .attr("y", node.y + node.headerheight / 2)
                                .attr("dy", ".35em")
                                .attr("font-size", node.height / 14  + "px")
                                .text(node.name);

                            setLevels(rect, node);
                        };

                        function setLevels(rect, node) {

                            rect.x = node.x;
                            rect.y = node.y;
                            rect.width = node.width;
                            rect.height = node.height;
                            rect.headerheight = node.headerheight;

                            rect.depth = node.depth;

                            if(!levels[node.depth]) {
                                levels[node.depth] = [];
                            }

                            levels[node.depth].push(rect);
                        };

                        function countColumn() {

                            numColomn = Math.round( Math.sqrt(numChildNode));

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
                        };

                        function zoomed() {
                            preventDefault();
                            detalizationRect();
                            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        };

                        function detalizationRect () {

                            var scrolLevel = Math.round(zoom.scale());

                            if(preScrolLevel === scrolLevel)    return;

                            preScrolLevel = scrolLevel;

                            d3.selectAll(".network-body")
                                .style("fill", "none")
                                .style("stroke-width", 1.4/scrolLevel)
                                .attr("rx", 3/scrolLevel + "px");

                            d3.selectAll(".network-title")
                                .style("stroke-width", 1.4/scrolLevel)
                                .attr("rx", 3/scrolLevel + "px");

                            removeUnusedRect();

                            if(levels[scrolLevel+2]) {
                                levels[scrolLevel + 2].forEach(function (item, i) {

                                    var rect = g.append("rect")
                                        .style("fill", "#fff")
                                        .style("stroke", "#949da5")
                                        .style("stroke-width", 1.4 / scrolLevel)
                                        .attr("rx", 3 / scrolLevel + "px")
                                        .attr("x", item.x)
                                        .attr("y", item.y)
                                        .attr("width", item.width)
                                        .attr("height", item.height + item.headerheight);

                                    unusedRect.push(rect);
                                });
                            }
                        };

                        function removeUnusedRect() {
                            unusedRect.forEach(function(item){
                                item.remove();
                            })
                            unusedRect = [];
                        };
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
