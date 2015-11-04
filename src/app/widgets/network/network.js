(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork);

    function qlNetwork($window) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                networkData: '=',
                showDetails: '='
            },
            bindToController: true,
            controller: networkViewController,
            controllerAs: 'nv'
        };

        function networkViewController($scope, $element) {
            var nv = this;

            $scope.$watch('nv.networkData', function(networkData) {
                if (networkData && Object.keys(networkData).length !== 0) {
                    render(networkData);
                }
            });

            function render(data) {
                $element.html('');

                nv.root = data;
                nv.levels = [];
                nv.queue = [];
                nv.unusedRect = [];

                Promise.resolve()
                    .then(initSvg($element))
                    .then(detalizationRect());
            }

            function initSvg($element) {
                console.log('initSvg');
                var margin = {top: 20, right: 0, bottom: 0, left: 0},
                    width = $element.width(),
                    height = $window.innerHeight - margin.top - margin.bottom - 80;

                nv.zoom = d3.behavior.zoom();

                var svg = d3.select($element[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.bottom + margin.top)
                    .style("margin-left", -margin.left + "px")
                    .style("margin-right", -margin.right + "px")
                    .classed('network-svg', true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .style("shape-rendering", "crispEdges")
                    .call(nv.zoom);

                nv.g = svg.append('g');

                nv.queue.push(nv.root);
                nv.node = nv.queue.shift();

                nv.node.width =  (width + margin.left + margin.right) * 9/10;
                nv.node.height = (height + margin.bottom + margin.top) * 8/10;
                nv.node.headerheight = nv.node.height * 1/10;
                nv.node.x = nv.node.width * 1/20;
                nv.node.y = nv.node.height * 1/20;
                nv.node.depth = 1;

                BFS(nv.node);

                nv.depth = Math.pow(2, nv.levels.length - 1);

                nv.zoom.scaleExtent([1, 100])
                    .on("zoom", zoomed);
            }

            function BFS (node) {
                console.log('BFS');
                for (var i in node.children) {
                    node.children[i].parent = node;
                    node.children[i].depth = node.depth + 1;
                    nv.queue.push(node.children[i]);
                }

                if('parent' in node) {

                    if (!nv.curParent || nv.curParent !== node.parent) {
                        nv.curChildNodeRow = 1;
                        nv.curChildNodeColumn = 0;
                        nv.numChildNode = 1;

                        nv.curParent = node.parent;

                        if(nv.queue.length !== 0) {
                            while (nv.queue[nv.numChildNode - 1].parent === nv.curParent) {
                                nv.numChildNode++;
                            }
                        }
                    }

                    countColumn();

                    nv.marginWidth = node.parent.width/20;
                    nv.marginHeight = node.parent.height/20;

                    node.width = node.parent.width/nv.numColumn - nv.marginWidth * 1.5;
                    node.height = node.parent.height/nv.numColumn - nv.marginHeight * 1.5;
                    node.x = node.parent.x + nv.marginWidth * nv.curChildNodeRow + node.width * (nv.curChildNodeRow - 1) ;
                    node.y = node.parent.headerheight + node.parent.y + nv.marginHeight * nv.curChildNodeColumn + node.height * (nv.curChildNodeColumn - 1) ;
                    node.height = node.height * 9/10;
                    node.headerheight = node.height * 1/10;
                }

                drawRect(node);
                setLevels(node);

                if(nv.queue.length !== 0) {
                    BFS(nv.queue.shift());
                }
            }

            function drawRect (node) {
                console.log('drawRect');
                nv.g.append("rect")
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
                        nv.showDetails(node);
                    });

                nv.g.append("rect")
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

                nv.g.append("text")
                    .style("fill", "#476bb8")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width/2)
                    .attr("y", node.y + node.headerheight / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 14)  + "px")
                    .text(node.name);
            }

            function setLevels(node) {
                console.log('setLevels');
                if(!nv.levels[node.depth]) {
                    nv.levels[node.depth] = [];
                }

                nv.levels[node.depth].push(node);
            }

            function zoomed() {
                console.log('zoomed');
                preventDefaultScroll($element);
                detalizationRect();
                nv.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function detalizationRect () {
                console.log('detalizationRect');
                var scrollLevel = Math.round(nv.zoom.scale());

                if(nv.preScrollLevel === scrollLevel)    return;

                nv.preScrollLevel = scrollLevel;

                removeUnusedRect();

                if(nv.levels[scrollLevel+2]) {
                    nv.levels[scrollLevel + 2].forEach(function (item, i) {
                        var rect = {};

                        rect.body = nv.g.append("rect")
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
                                nv.showDetails(item);
                            });

                        var fontSize = (item.width / (item.name.length)) * 4/3;

                        rect.text = nv.g.append("text")
                            .style("fill", "#476bb8")
                            .attr("x", item.x + item.width/2)
                            .attr("y", item.y + item.height / 2)
                            .attr("text-anchor", "middle")
                            .attr("dy", ".35em")
                            .attr("font-size", fontSize  + "px")
                            .text(item.name);

                        nv.unusedRect.push(rect);
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
                console.log('countColumn');
                nv.numColumn = Math.round( Math.sqrt(nv.numChildNode));

                if( nv.numColumn*nv.numColumn < nv.numChildNode) {
                    nv.numColumn++;
                }

                if(nv.curChildNodeColumn < nv.numColumn) {
                    nv.curChildNodeColumn++;
                }
                else {
                    nv.curChildNodeColumn = 1;
                    nv.curChildNodeRow++;
                }
            }

            function removeUnusedRect() {
                console.log('removeUnusedRect');
                nv.unusedRect.forEach(function(item){
                    item.body.remove();
                    item.text.remove();
                });
                nv.unusedRect = [];
            }
        }

        /**
         * Prevent page scrolling when zooming network view
         * @param element parent html element
         */
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
