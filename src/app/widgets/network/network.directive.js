(function () {
    'use strict';

    angular
        .module('qorDash.widget.network')
        .directive('qlNetwork', qlNetwork);

    function qlNetwork() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                showDetails: '=',
                networkData: '=',
                globalChildren: '='
            },
            bindToController: true,
            controller: networkViewController,
            controllerAs: 'nv'
        };

        function networkViewController($scope, $element, $window) {
            var nv = this;
            $scope.$watch('nv.networkData', function (networkData) {
                if (networkData && Object.keys(networkData).length !== 0) {
                    render(networkData);
                }
            });

            $scope.$watch('nv.globalChildren', function (globalChildren) {
                var children = globalChildren;
                if (children){
                    if (children.length == nv.globalChildrenCount) {
                        var node = nv.queue.shift();
                        for (var i = 0, l = children.length; i < l; i++) {
                            children[i].parent = node;
                            children[i].depth = node.depth + 1;
                            nv.queue.push(children[i]);
                            if (i == l - 1) {
                                setLevels(node);
                                BFS(nv.queue.shift());
                            }
                        }
                    }
                }
            }, true);

            angular.element($window).bind('resize', function () {
                render(nv.networkData);
            });

            function render(data) {
                $element.html('');

                nv.root = data;
                nv.levels = [];
                nv.queue = [];
                nv.close = [];
                nv.childrenLoaded = false;
                nv.globalChildrenCount = 0;

                initSvg($element);
            }

            function initSvg($element) {
                var node,
                    margin = {top: 20, right: 0, bottom: 0, left: 0},
                    width = $element.width(),
                    height = $window.innerHeight - margin.top - margin.bottom - 80;

                nv.zoom = d3.behavior.zoom();
                nv.scrollLevel = 1;

                nv.width = width + margin.left + margin.right;
                nv.height = height + margin.bottom + margin.top;

                var wrap = d3.select($element[0]);

                nv.grandparent = wrap.insert("ul", ":first-child")
                    .attr("class", "grandparent breadcrumb");

                nv.svg = wrap
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

                node.width = nv.width * 9 / 10;
                node.height = nv.height * 8 / 10;
                node.headerheight = node.height * 1 / 10;
                node.x = node.width * 1 / 20;
                node.y = node.height * 1 / 20;
                node.depth = 1;

                addPath(node);
                BFS(node);
            }

            function addPath(node) {

                var navigationItem = nv.grandparent
                    .selectAll("li")
                    .data(traverseParents(node));

                navigationItem.enter()
                    .append("li")
                    .append("a")
                    .text(function (d) {
                        return d.name;
                    })
                    .on('click', function (d) {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(d);
                        focusOnNode(d);
                        addPath(d);
                    });

                navigationItem.exit()
                    .remove('li');
            }

            function traverseParents(node) {
                var result = [];
                while (true) {
                    result.push(node);
                    if (node.parent) {
                        node = node.parent;
                    } else {
                        break;
                    }
                }

                result.reverse();
                return result;
            }

            /**
             * Breadth-first search(BFS) is an algorithm for
             * iterate each element in tree.
             * @param node(tree element)
             */
            function BFS(node) {
                var marginWidth,
                    marginHeight;

                for (var i in node.children) {
                    //for(var i = 0, l = node.children; i < l; i++){
                    if (node.children.hasOwnProperty(i)) {
                        node.children[i].parent = node;
                        node.children[i].depth = node.depth + 1;
                        nv.queue.push(node.children[i]);
                    }
                }

                if ('parent' in node) {
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

                    marginWidth = node.parent.width / 20;
                    marginHeight = node.parent.height / 20;

                    node.width = node.parent.width / nv.numColumn - marginWidth * 1.5;
                    node.height = node.parent.height / nv.numColumn - marginHeight * 1.5;
                    node.x = node.parent.x + marginWidth * nv.curChildNodeRow + node.width * (nv.curChildNodeRow - 1);
                    node.y = node.parent.headerheight + node.parent.y + marginHeight * nv.curChildNodeColumn + node.height * (nv.curChildNodeColumn - 1);
                    node.height = node.height * 9 / 10;
                    node.headerheight = node.height * 1 / 10;
                }

                setLevels(node);

                if (!node.children) {
                    var depth = Math.pow(2, nv.levels.length);
                    nv.zoom.scaleExtent([1, depth])
                        .on("zoom", zoomed);
                    drawLastRect(node);
                }
                else {
                    drawRect(node);
                }

                if (nv.childrenLoaded) {
                    if (nv.queue.length !== 0) {
                        BFS(nv.queue.shift());
                    } else {
                        drawFirstClosedRect();
                    }
                } else {
                    loadGlobalChildren(node);
                    nv.childrenLoaded = true;
                }
            }

            function loadGlobalChildren(node) {
                var children = nv.root.children;
                nv.globalChildrenCount = children.length;
                nv.queue = [];
                nv.queue.push(node);
                for (var i = 0, l = children.length; i < l; i++) {
                    $scope.$emit('loadChildrenEvent', children[i].url);
                }
            }

            function drawRect(node) {
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
                    .on("click", function () {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(node);
                        focusOnNode(node);
                        addPath(node);
                    });

                nv.g.append("rect")
                    .style("fill", "#474C62")
                    .style("stroke", "#949da5")
                    .style("stroke-width", "1.4")
                    .classed('network-title', true)
                    .attr("rx", "3px")
                    .attr("x", node.x)
                    .attr("y", node.y)
                    .attr("width", node.width)
                    .attr("height", node.headerheight)
                    .on("click", function () {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(node);
                        focusOnNode(node);
                        addPath(node);
                    });

                node.text = nv.g.append("text")
                    .style("fill", "#ffffff")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width / 2)
                    .attr("y", node.y + node.headerheight / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 14) + "px")
                    .text(node.name);

            }

            function focusOnNode(node) {
                var gWidth = 9 * nv.width / 10,
                    gHeight = 9 * nv.height / 10,
                    gX = nv.width / 20,
                    gY = nv.height / 20,
                    scale = .9 / Math.max(node.width / nv.width, node.height / nv.height),
                    translate = [gWidth / 2 - ( node.x + node.width / 2) * scale + gX, gHeight / 2 - (node.y + (node.height + node.headerheight) / 2) * scale + gY];

                nv.svg.transition()
                    .duration(750)
                    .call(nv.zoom.translate(translate).scale(scale).event);

                if(node.children) {
                    if(nv.textPressedNode) {
                        nv.textPressedNode
                            .style("fill", "#ffffff")
                            .style("font-weight", "300");
                    }
                    node.text
                        .style("fill", "#C75E5E")
                        .style("font-weight", "bold");

                    nv.textPressedNode = node.text;
                }
            }

            function drawLastRect(node) {

                node.x += node.width / 6;
                node.y += node.height / 6;

                node.width = 2 / 3 * node.width;
                node.height = 2 / 3 * node.height;

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
                    .on("click", function () {
                        if (d3.event.defaultPrevented) return;
                        nv.showDetails(node);
                        focusOnNode(node);
                        addPath(node);
                    });

                nv.g.append("text")
                    .style("fill", "#476bb8")
                    .attr("text-anchor", "middle")
                    .attr("x", node.x + node.width / 2)
                    .attr("y", node.y + node.height / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", (node.height / 8) + "px")
                    .text(node.name);
            }

            function setLevels(node) {
                if (!nv.levels[node.depth]) {
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
                if (nv.levels[3]) {

                    nv.levels[3].forEach(function (item) {
                        item.rect = drawClosedRect(item);
                        nv.close.push(item);
                    });
                }

                nv.preScrollLevel = 1;
            }

            function detalizationRect() {
                nv.scrollLevel = nv.zoom.scale();

                if (nv.preScrollLevel === nv.scrollLevel)    return;

                for (var i in nv.close) {
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
                                if (parent.headerheight * nv.scrollLevel < 15) {
                                    item.rect.body.remove();
                                    item.rect.text.remove();
                                    item.draw = false;
                                    delete nv.close[i];

                                    parent.rect = drawClosedRect(parent);
                                    parent.draw = true;
                                    nv.close.push(parent);
                                }
                            } else {
                                if (parent.headerheight * nv.scrollLevel < 15) {
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
                    .style("stroke-width", 1.4 / nv.scrollLevel)
                    .attr("rx", 3 / nv.scrollLevel + "px");

                d3.selectAll(".network-title")
                    .style("stroke-width", 1.4 / nv.scrollLevel)
                    .attr("rx", 3 / nv.scrollLevel + "px");

                d3.selectAll(".network-text")
                    .attr("font-size", 16 / nv.scrollLevel + "px");

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
                        addPath(node);
                    });

                rect.text = nv.g.append("text")
                    .style("fill", "#476bb8")
                    .classed('network-text', true)
                    .attr("x", node.x + node.width / 2)
                    .attr("y", node.y + node.height / 2)
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
                    .attr("font-size", fontSize + "px")
                    .text(node.name);

                return rect;
            }

            function countColumn() {
                nv.numColumn = Math.round(Math.sqrt(nv.numChildNode));

                if (nv.numColumn * nv.numColumn < nv.numChildNode) {
                    nv.numColumn++;
                }

                if (nv.curChildNodeColumn < nv.numColumn) {
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
                'mousewheel': function (e) {
                    if (e.target.id == 'el') return;
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

    }

})();
