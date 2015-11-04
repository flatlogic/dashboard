(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork);

    function qlNetwork($window, $stateParams, $state, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                networkData: '='
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

                var root = data,
                    depth,
                    preScrollLevel,
                    levels = [],
                    queue = [],
                    node,
                    curParent,
                    curChildNodeRow,
                    curChildNodeColumn,
                    numChildNode,
                    numColumn,
                    marginWidth,
                    marginHeight,
                    unusedRect = [];

                var margin = {top: 20, right: 0, bottom: 0, left: 0},
                    width = $element.width(),
                    height = $window.innerHeight - margin.top - margin.bottom - 80;


                var zoom = d3.behavior.zoom();

                var svg = d3.select($element[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.bottom + margin.top)
                    .style("margin-left", -margin.left + "px")
                    .style("margin-right", -margin.right + "px")
                    .classed('network-svg', true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .style("shape-rendering", "crispEdges")
                    .call(zoom);

                var g = svg.append('g');

                queue.push(root);
                node = queue.shift();

                node.width =  (width + margin.left + margin.right) * 9/10;
                node.height = (height + margin.bottom + margin.top) * 8/10;
                node.headerheight = (node.height) * 1/10;
                node.x = (node.width) * 1/20;
                node.y = (node.height) * 1/20;
                node.depth = 1;

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
                            curChildNodeColumn = 0;
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

                        node.width = node.parent.width/numColumn - marginWidth * 1.5;
                        node.height = node.parent.height/numColumn - marginHeight * 1.5;
                        node.x = node.parent.x + marginWidth * curChildNodeRow + node.width * (curChildNodeRow - 1) ;
                        node.y = node.parent.headerheight + node.parent.y + marginHeight * curChildNodeColumn + node.height * (curChildNodeColumn - 1) ;
                        node.height = node.height * 9/10;
                        node.headerheight = node.height * 1/10;
                    }

                    drawRect(node);
                    setLevels(node);

                    if(queue.length !== 0) {
                        BFS(queue.shift());
                    }
                }

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
                }

                function setLevels(node) {

                    if(!levels[node.depth]) {
                        levels[node.depth] = [];
                    }

                    levels[node.depth].push(node);
                }

                function countColumn() {

                    numColumn = Math.round( Math.sqrt(numChildNode));

                    if( numColumn*numColumn < numChildNode) {
                        numColumn++;
                    }

                    if(curChildNodeColumn < numColumn) {
                        curChildNodeColumn++;
                    }
                    else {
                        curChildNodeColumn = 1;
                        curChildNodeRow++;
                    }
                }

                function zoomed() {
                    preventDefaultScroll($element);
                    detalizationRect();
                    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }

                function detalizationRect () {

                    var scrollLevel = Math.round(zoom.scale());

                    if(preScrollLevel === scrollLevel)    return;

                    preScrollLevel = scrollLevel;

                    d3.selectAll(".network-body")
                        .style("fill", "none");

                    removeUnusedRect();

                    if(levels[scrollLevel+2]) {
                        levels[scrollLevel + 2].forEach(function (item, i) {

                            var rect = {};

                            rect.body = g.append("rect")
                                .style("fill", "#fff")
                                .style("stroke", "#949da5")
                                .style("stroke-width", 1.4/scrollLevel)
                                .classed('network-body', true)
                                .attr("rx", 3/scrollLevel + "px")
                                .attr("x", item.x)
                                .attr("y", item.y)
                                .attr("width", item.width)
                                .attr("height", item.height + item.headerheight);

                            rect.text = g.append("text")
                                .style("fill", "#476bb8")
                                .attr("x", item.x + item.width/20)
                                .attr("y", item.y + item.headerheight / 2)
                                .attr("dy", ".35em")
                                .attr("font-size", item.height / 10  + "px")
                                .text(node.name);

                            unusedRect.push(rect);
                        });
                    }

                    d3.selectAll(".network-body")
                        .style("stroke-width", 1.4/scrollLevel)
                        .attr("rx", 3/scrollLevel + "px");

                    d3.selectAll(".network-title")
                        .style("stroke-width", 1.4/scrollLevel)
                        .attr("rx", 3/scrollLevel + "px")
                }

                function removeUnusedRect() {
                    unusedRect.forEach(function(item){
                        item.body.remove();
                        item.text.remove();
                    });
                    unusedRect = [];
                }
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
