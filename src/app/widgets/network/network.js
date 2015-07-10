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

                        var margin = {top: 20, right: 0, bottom: 160, left: 0},
                            width = element.width(),
                            height = $window.innerHeight - margin.top - margin.bottom - 150,
                            formatNumber = d3.format(",.1f"),
                            transitioning;

                        var x = d3.scale.linear()
                            .domain([0, width])
                            .range([0, width]);

                        var y = d3.scale.linear()
                            .domain([0, height])
                            .range([0, height]);

                        var treemap = d3.layout.treemap()
                            .children(function(d, depth) { return depth ? null : d._children; })
                            .sort(function(a, b) { return a.amount - b.amount; })
                            .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
                            .round(false)
                            .value(function(d) { return d.amount; });

                        var svg = d3.select(element[0]).append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.bottom + margin.top)
                            .style("margin-left", -margin.left + "px")
                            .style("margin-right", -margin.right + "px")
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .style("shape-rendering", "crispEdges");

                        var grandparent = svg.append("g")
                            .attr("class", "grandparent");

                        grandparent.append("rect")
                            .attr("y", -margin.top)	// -20px to force it to appear above the main plotting area.
                            .attr("width", width)
                            .attr("height", margin.top)
                            .attr("rx", "5px");

                        grandparent.append("text")
                            .attr("x", 6)
                            .attr("y", 6 - margin.top)
                            .attr("dy", ".75em");


                        function subRender(root) {		// Loads the JSON into memory as an object. The name 'root' is simply a reminder that the object is a hierarchical.
                            initialize(root);
                            accumulate(root);
                            layout(root);
                            display(root);

                            function initialize(root) {
                                root.x = root.y = 0;	// Root node is drawn in top-left corner...
                                root.dx = width;			// ... and fills the SVG area...
                                root.dy = height;
                                root.depth = 0;
                            }

                            function accumulate(d) {
                                return (d._children = d.children)
                                    ? d.amount = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
                                    : 1;
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
                                            c.parent = d;
                                            _layout(c);
                                        });
                                        _depth--;
                                    }
                                }
                            }

                            function display(d) {
                                grandparent
                                    .datum(d.parent)					// MC: Associate the top bar with the value of the parent of the current node? See https://github.com/mbostock/d3/wiki/Selections#wiki-datum
                                    .on("click", transition)	// MC: Adds an onclick('transition') listener to the grandparent
                                    .select("text")							// MC: Go to the TEXT element in the grandparent and...
                                    .text(name(d));						// MC: Call the name() function and change the text in the TEXT node to the returned value.

                                var g1 = svg.insert("g", ".grandparent")	// MC: inserts a new 'g' before the node with class 'grandparent. Call it 'g1'.
                                    .datum(d)															// MC: Still not sure here but something to do with copying the data from the JSON to the node
                                    .attr("class", "depth");							// MC: Add the attribute as follows: <g class="depth">...</g>

                                var g = g1.selectAll("g")									// MC: Confusingly defines a new collection 'g' which contains all the children in 'g1'.
                                    .data(d._children)										// MC: Loads the data from the (copy of the) JSON file data.
                                    .enter().append("g");										// MC: Creates a new 'g' node for each child.

                                g.filter(function(d) { return d._children; })		// MC: Create a new collection, which is a subset of g. Not sure how this works yet but it's only the nodes with children.
                                    .classed("children", true)									// MC: Assigns each of these node to class="children",
                                    .on("click", transition);										// MC: and onclick('transition'), which is a function listed below. So only those with children are clickable?

                                g.selectAll(".child")																		// MC: Select all the children of 'g'.
                                    .data(function(d) { return d._children || [d]; })		// MC: || is logical OR
                                    .enter().append("rect")																// MC: Create a RECT for each of the new nodes
                                    .attr("class", "child")															// MC: Make <rect class="child">...</rect>
                                    .call(rect);																				// MC: Call the rect function listed below. [Why not just write ".rect()" then?]

                                g.append("rect")																// MC: After all the children, create a rect with .parent
                                    .attr("class", "parent")										// MC: It's at the end so that it's clickable and has the title displayed on hover
                                    .call(rect)
                                    .append("title")								// MC: SVG TITLE *element* is displayed as a tooltip on hover like the HTML title *attribute*
                                    .text(function(d) { return formatNumber(d.value); });  // MC: The value in this tag is the sum of the values of all the child nodes. Check rounding format if not showing up!

                                g.append("text")				// MC: Here is my attempt to get the rounded dollar amount at the centre of each rect.
                                    .classed("overlaidText",true)
                                    .text(function(d) { return d.name; })
                                    .call(middletext);

                                function transition(d) {
                                    if (transitioning || !d) return;		// MC: I think this prevents further transitioning if you're in the middle of a transition.
                                    transitioning = true;

                                    var g2 = display(d),
                                        t1 = g1.transition().duration(750),
                                        t2 = g2.transition().duration(750);

                                    // Update the domain only after entering new elements.
                                    x.domain([d.x, d.x + d.dx]);
                                    y.domain([d.y, d.y + d.dy]);

                                    // Enable anti-aliasing during the transition.
                                    svg.style("shape-rendering", null);

                                    // Draw child nodes on top of parent nodes.
                                    svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                                    // Fade-in entering text.
                                    g2.selectAll("text").style("fill-opacity", 0);

                                    // Transition to the new view.
                                    t2.selectAll(".overlaidText").call(middletext).style("fill-opacity", 1);
                                    t1.selectAll("rect").call(rect);
                                    t2.selectAll("rect").call(rect);

                                    // Remove the old node when the transition is finished.
                                    t1.remove().each("end", function() {
                                        svg.style("shape-rendering", "crispEdges");
                                        transitioning = false;
                                    });

                                    showDetails(d);
                                }

                                return g;
                            }

                            function middletext(text) {
                                text.attr("x", function(d) { return x(d.x + d.dx / 2); })
                                    .attr("y", function(d) { return y(d.y + d.dy / 2) + 16; });
                            }

                            function rect(rect) {
                                rect.attr("x", function(d) { return x(d.x); })
                                    .attr("y", function(d) { return y(d.y); })
                                    .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                                    .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                                    .attr("rx","5px");
                            }

                            function name(d) {
                                return d.parent ? name(d.parent) + " / " + d.name : d.name;		// MC: Recursive. If there is no parent just return the name attribute of this node, otherwise return the name of the parent node followed by '/' and the name attribute of this node
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
