(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork);

    function qlNetwork() {
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

        function networkViewController($scope, $element, $window) {
            var nv = this;

            $scope.$watch('nv.networkData', function(networkData) {
                if (networkData && Object.keys(networkData).length !== 0) {
                    render(networkData);
                }
            });

            angular.element($window).bind('resize', function() {
                render(nv.networkData);
            });

            function render(data) {
                $element.html('');

                nv.root = data;
                nv.levels = [];
                nv.queue = [];
                nv.close = [];

                initSvg($element);
                drawFirstClosedRect();
            }

            function initSvg($element) {

                var node,
                    margin = {top: 20, right: 0, bottom: 0, left: 0},
                    width = $element.width(),
                    height = $window.innerHeight - margin.top - margin.bottom - 80;

                nv.zoom = d3.behavior.zoom();
                nv.scrollLevel = 1;

                nv.width = width + margin.left + margin.right;
                nv.height =  height + margin.bottom + margin.top;

                nv.svg = d3.select($element[0])
                    .append("svg")
                    .attr("width", nv.width)
                    .attr("height", nv.height)
                    .style("margin-left", -margin.left + "px")
                    .style("margin-right", -margin.right + "px")
                    .classed('network-svg', true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .style("shape-rendering", "crispEdges")
                    .call(nv.zoom);

                nv.g = nv.svg.append('g');

                nv.queue.push(nv.root);
                node = nv.queue.shift();

                node.width =  nv.width * 9/10;
                node.height = nv.height * 8/10;
                node.headerheight = node.height * 1/10;
                node.x = node.width * 1/20;
                node.y = node.height * 1/20;
                node.depth = 1;

                BFS(node);

                nv.depth = Math.pow(2, nv.levels.length - 1);

                nv.zoom.scaleExtent([1, 100])
                    .on("zoom", zoomed);
            }

            function BFS (node) {
                var marginWidth,
                    marginHeight;

                for (var i in node.children) {
                //for(var i = 0, l = node.children; i < l; i++){
                    if(node.children.hasOwnProperty(i)) {
                        node.children[i].parent = node;
                        node.children[i].depth = node.depth + 1;
                        nv.queue.push(node.children[i]);
                    }
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

                    marginWidth = node.parent.width/20;
                    marginHeight = node.parent.height/20;

                    node.width = node.parent.width/nv.numColumn - marginWidth * 1.5;
                    node.height = node.parent.height/nv.numColumn - marginHeight * 1.5;
                    node.x = node.parent.x + marginWidth * nv.curChildNodeRow + node.width * (nv.curChildNodeRow - 1) ;
                    node.y = node.parent.headerheight + node.parent.y + marginHeight * nv.curChildNodeColumn + node.height * (nv.curChildNodeColumn - 1) ;
                    node.height = node.height * 9/10;
                    node.headerheight = node.height * 1/10;
                }

                if(!node.children) {
                    drawLastRect(node);
                }
                else {
                    drawRect(node);
                }

                setLevels(node);

                if(nv.queue.length !== 0) {
                    BFS(nv.queue.shift());
                }
            }

            function drawRect (node) {
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
                        focusOnNode(node);
                    });

                nv.g.append("rect")
                    .style("fill", "#dae0ed")
                    .style("stroke", "#949da5")
                    .style("stroke-width", "1.4")
                    .classed('network-title', true)
                    .attr("rx", "3px")
                    .attr("x", node.x)
                    .attr("y", node.y)
                    .attr("width", node.width)
                    .attr("height", node.headerheight)
                    //.append("title")
                    //.text(node.name)
                    .on("click", function() {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(node);
                        focusOnNode(node);
                    });

                nv.g.append("text")
                    .style("fill", "#476bb8")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width/2)
                    .attr("y", node.y + node.headerheight / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 14)  + "px")
                    .text(node.name);

            }

            function focusOnNode(node) {
                var gWidth = 9*nv.width/10,
                    gHeight = 9*nv.height/10,
                    gX = nv.width/20,
                    gY = nv.height/20,
                    scale = .9 / Math.max(node.width / nv.width, node.height / nv.height),
                    translate = [gWidth/2 - ( node.x + node.width/2) * scale + gX, gHeight/2 - (node.y  + (node.height + node.headerheight)/ 2) * scale + gY];

                nv.svg.transition()
                    .duration(750)
                    .call(nv.zoom.translate(translate).scale(scale).event);
            }

            function drawLastRect (node) {

                node.x += node.width/6;
                node.y += node.height/6;

                node.width = 2/3 * node.width;
                node.height = 2/3 * node.height;

                nv.g.append("rect")
                    .style("fill", "#d3d3e6")
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

                nv.g.append("text")
                    .style("fill", "#476bb8")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width/2)
                    .attr("y", node.y + node.height/2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 8)  + "px")
                    .text(node.name);
            }

            function setLevels(node) {
                if(!nv.levels[node.depth]) {
                    nv.levels[node.depth] = [];
                }
                nv.levels[node.depth].push(node);
            }

            function zoomed() {
                preventDefaultScroll($element);
                detalizationRect();
                nv.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function drawFirstClosedRect() {
                nv.levels[3].forEach(function (item) {
                    item.rect = drawClosedRect(item);
                    nv.close.push(item);
                });

                nv.preScrollLevel = 1;
            }

            function detalizationRect () {
                nv.scrollLevel = nv.zoom.scale();

                if(nv.preScrollLevel === nv.scrollLevel)    return;

                for(var i in nv.close) {
                    if (nv.close.hasOwnProperty(i)) {
                        var item = nv.close[i];
                        var remove = false;
                        if (nv.preScrollLevel < nv.scrollLevel) {
                            if (item.children) {
                                item.children.forEach(function (child) {
                                    if (item.headerheight * nv.scrollLevel > 15) {
                                        child.rect = drawClosedRect(child);
                                        child.draw = true;
                                        nv.close.push(child);
                                    } else {
                                        remove = true;
                                    }
                                });
                                if (!remove) {
                                    item.rect.body.remove();
                                    item.rect.text.remove();
                                    item.draw = false;
                                    delete nv.close[i];
                                    remove = true;
                                }

                            } else {
                                item.rect.body.remove();
                                item.rect.text.remove();
                            }

                        } else {
                            var parent = item.parent;
                            if (!parent.draw) {
                                if (parent.headerheight * nv.scrollLevel < 15 /*&& nv.scrollLevel + 2 < item.depth*/) {
                                    item.rect.body.remove();
                                    item.rect.text.remove();
                                    item.draw = false;
                                    delete nv.close[i];

                                    parent.rect = drawClosedRect(parent);
                                    parent.draw = true;
                                    nv.close.push(parent);
                                }
                            } else {
                                if (parent.headerheight * nv.scrollLevel < 15 /*&& nv.scrollLevel + 2 < item.depth*/) {
                                    item.rect.body.remove();
                                    item.rect.text.remove();
                                    item.draw = false;
                                    delete nv.close[i];
                                }
                            }
                        }
                    }
                }
                nv.preScrollLevel = nv.scrollLevel;

                d3.selectAll(".network-body")
                    .style("stroke-width", 1.4/nv.scrollLevel)
                    .attr("rx", 3/nv.scrollLevel + "px");

                d3.selectAll(".network-title")
                    .style("stroke-width", 1.4/nv.scrollLevel)
                    .attr("rx", 3/nv.scrollLevel + "px");

                d3.selectAll(".network-text")
                    .attr("font-size", 16/nv.scrollLevel + "px");

            }

            function drawClosedRect(node) {
                var rect = {},
                    textWidth,
                    fontSize = 16 / nv.zoom.scale();


                rect.body = nv.g.append("rect")
                    .style("fill", "#fff")
                    .style("stroke", "#949da5")
                    .style("stroke-width", 1.4 / nv.scrollLevel)
                    .classed('network-body', true)
                    .attr("rx", 3 / nv.scrollLevel + "px")
                    .attr("x", node.x)
                    .attr("y", node.y)
                    .attr("width", node.width)
                    .attr("height", node.height + node.headerheight)
                    .on("click", function () {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(node);
                        focusOnNode(node);
                    });

                rect.text = nv.g.append("text")
                    .style("fill", "#476bb8")
                    .classed('network-text', true)
                    .attr("x", node.x + node.width / 2)
                    .attr("y", node.y + node.height / 2)
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
                    .attr("font-size", fontSize + "px")
                    .text(node.name)
                    .each(function (d) {
                        textWidth = this.getBBox().width;
                    });

                return rect;
            }

            function countColumn() {
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
