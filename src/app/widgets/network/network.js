(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork)
        ;
    qlNetwork.$inject = ['d3', '$window', '$interval', '$state', '$http', '$timeout'];
    function qlNetwork(d3, $window, $interval, $state, $http, $timeout) {
        return {
            restrict: 'EA',
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

                    function showDetails(root) {
                        $state.go('app.domains.domain.env.network.node', {depth: root.depth, node: root.name});
                    }

                    scope.render = function (data) {
                        var root = data;

                        var margin = {top: 20, right: 0, bottom: 0, left: 0},
                            width = element.width(),
                            height = $window.innerHeight - margin.top - margin.bottom - 120,
                            formatNumber = d3.format(",d"),
                            transitioning;

                        var x = d3.scale.linear()
                            .domain([0, width])
                            .range([0, width]);

                        var y = d3.scale.linear()
                            .domain([0, height])
                            .range([0, height]);

                        var treemap = d3.layout.treemap()
                            .children(function(d, depth) { return depth ? null : d._children; })
                            .sort(function(a, b) { return -a.name.localeCompare(b.name); })
                            .ratio(1)
                            .round(false)
                            .value(function(d) { return d.amount; });

                        var svg = d3.select(element[0]).append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.bottom + margin.top)
                            .style("margin-left", -margin.left + "px")
                            .style("margin-right", -margin.right + "px")
                            .classed('network-svg', true)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .style("shape-rendering", "crispEdges");

                        var grandparent = svg.append("g")
                            .attr("class", "grandparent");

                        grandparent.append("rect")
                            .attr("y", -margin.top)
                            .attr("x", -1)
                            .attr("width", width)
                            .attr("height", margin.top)
                            .attr("rx", "3px")
                        ;

                        grandparent.append("text")
                            .attr("x", 6)
                            .attr("y", 4 - margin.top)
                            .attr("dy", ".75em")
                            .attr("fill", '#fff')
                        ;


                        function subRender(root) {
                            initialize(root);
                            squarify(root);
                            balance(root);
                            accumulate(root);
                            layout(root);
                            display(root);

                            function initialize(root) {
                                root.x = root.y = 0;
                                root.dx = width;
                                root.dy = height;
                                root.depth = 0;
                            }

                            function _hasIntegerSquareRoot(n) {
                                var sqrt = Math.sqrt(n);
                                return sqrt - Math.floor(sqrt) == 0;
                            }

                            function _nextSquareRootInteger(n) {
                                return Math.pow(Math.floor(Math.sqrt(n)) + 1, 2);
                            }


                            function _fillWithPlaceholders(array, count) {
                                for (var i = 0; i < count; i++) {
                                    array.push({
                                        "name": "ztest-0",
                                        "type": "__placeholder__"
                                    })
                                }
                            }

                            /**
                             * Adds up children to a node so it has an integer square root.
                             * E.g. if a node has 3 children, adds one more so nodes are displayed as squares (total 4 nodes)
                             *   * *
                             *   * *
                             * E.g. if a node has 5 children, adds four more so nodes are displayed as squares (total 9 nodes_
                             *   * * *
                             *   * * *
                             *   * * *
                             *
                             * @param d root node
                             */
                            function squarify(d) {
                                var n = d.children ? d.children.length : 0;
                                if (n) {
                                    if (!_hasIntegerSquareRoot(n)) {
                                        var N = _nextSquareRootInteger(n);
                                        _fillWithPlaceholders(d.children, N - n);
                                    }
                                    d.children.forEach(squarify);
                                }
                            }

                            function balance(d) {
                                if (!d.children) {
                                    return
                                }
                                var maxGrandchildren = d3.max(d.children, function (c) {
                                    return c.children ? c.children.length : 0;
                                });
                                d.children.forEach(function (c) {
                                    if (c.children && c.children.length < maxGrandchildren) {
                                        _fillWithPlaceholders(c.children, maxGrandchildren - c.children.length)
                                    }
                                });
                                d.children.forEach(balance);
                            }

                            function accumulate(d) {
                                d._children = d.children;
                                d.amount = 1;
                                if (d._children) {
                                    d._children.forEach(accumulate)
                                }
                            }

                            function layout(d) {
                                var _depth = 0;
                                return _layout(d);
                                function _layout(d) {
                                    d.depth = _depth;
                                    if (d._children) {
                                        treemap.nodes({_children: d._children});
                                        _depth++;
                                        d._children.forEach(function(c) {
                                            c.x = d.x + c.x * d.dx;
                                            c.y = d.y + c.y * d.dy;
                                            c.dx *= d.dx;
                                            c.dy *= d.dy;
                                            var k = .75;
                                            c.x += c.dx * (1 - k) / 2;
                                            c.y += c.dy * (1 - k) / 2;
                                            c.dx *= k;
                                            c.dy *= k;
                                            //c.dy = c.dx = d3.min([c.dx, c.dy]);
                                            c.parent = d;
                                            _layout(c);
                                        });
                                        _depth--;
                                    }
                                }
                            }

                            function display(d) {

                                grandparent
                                    .datum(d.parent)
                                    .on("click", transition)
                                    .select("text")
                                    .text(name(d));

                                var g1 = svg.insert("g", ".grandparent")
                                    .datum(d)
                                    .attr("class", "depth");

                                var g = g1.selectAll("g")
                                    .data((d._children || [d]).filter(_isNotPlaceholder))
                                    .enter().append("g");

                                g.filter(function(d) { return d._children; })
                                    .classed("children", true)
                                ;

                                g.append("rect")
                                    .attr("class", "parent")
                                    .call(rect)
                                    .on("click", transition)
                                    .append("title")
                                    .text(function(d) { return formatNumber(d.value); });

                                g.selectAll(".child")
                                    .data(function(d) {
                                        return (d._children || [d]).filter(_isNotPlaceholder);
                                    })
                                    .enter().append("rect")
                                    .attr("class", "child")
                                    .call(rect)
                                    .on("click", transition)
                                ;

                                g.selectAll(".child-text")
                                    .data(function(d) {
                                        return (d._children || [d]).filter(_isNotPlaceholder);
                                    })
                                    .enter().append("text")
                                    .classed("child-text", true)
                                    .text(function(d) { return d.name; })
                                    .call(text)
                                ;

                                g.append("text")
                                    .text(function(d) { return d.name; })
                                    .classed("parent-text", true)
                                    .call(parentText)
                                ;

                                return g;

                                function transition(d) {
                                    if (transitioning || !d) return;
                                    transitioning = true;

                                    var g2 = display(d),
                                        t1 = g1.transition().duration(750),
                                        t2 = g2.transition().duration(750);


                                    x.domain([d.x, d.x + d.dx]);
                                    y.domain([d.y, d.y + d.dy]);


                                    svg.style("shape-rendering", null);


                                    svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                                    t1.selectAll(".parent-text").call(parentText).style("fill-opacity", 0);
                                    t2.selectAll(".parent-text").call(parentText).style("fill-opacity", 1);

                                    t1.selectAll(".child-text").call(parentText).style("fill-opacity", 0);
                                    t2.selectAll(".child-text").call(text).style("fill-opacity", 1);
                                    t1.selectAll("rect").call(rect);
                                    t2.selectAll("rect").call(rect);


                                    t1.remove().each("end", function() {
                                        svg.style("shape-rendering", "crispEdges");
                                        transitioning = false;
                                    });

                                    showDetails(d);
                                }

                                function _isPlaceholder(d) {
                                    return d.type == "__placeholder__";
                                }

                                function _isNotPlaceholder(d) {
                                    return !_isPlaceholder(d);
                                }

                            }

                            function text(text) {
                                text.attr("x", function(d) { return x(d.x) + 6; })
                                    .attr("y", function(d) { return y(d.y) + 16; });
                            }

                            function parentText(text) {
                                text.attr("x", function(d) { return x(d.x) + 6; })
                                    .attr("y", function(d) { return y(d.y) - 6; });
                            }

                            function rect(rect) {
                                rect.attr("x", function(d) { return x(d.x); })
                                    .attr("y", function(d) { return y(d.y); })
                                    .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                                    .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                                    .attr("rx", "3px")
                                ;
                            }

                            function name(d) {
                                return d.parent ? name(d.parent) + " > " + d.name : d.name;
                            }

                        }

                        if (!scope.sourceJson) {
                            initJson().then(function () {
                                subRender(scope.sourceJson)
                            });
                        } else {
                            subRender(scope.sourceJson);
                        }
                    };
                    scope.render();
                });
            }}
    }

})();
