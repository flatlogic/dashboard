(function () {
    'use strict';

    var networkModule = angular.module('qorDash.widget.network')
            .directive('qlNetwork', qlNetwork)
        ;
    qlNetwork.$inject = ['d3', '$window', '$interval', '$state', '$http', '$timeout'];
    function qlNetwork(d3, $window, $interval, $state, $http, $timeout) {
        return {
            link: function (scope, element, attrs) {
                function showDetails(root) {
                    $state.go('app.domains.domain.env.network.node', {depth: root.depth, node: root.name});
                }

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

                    function subRender() {

                        window.current_nodes = [];
                        var update = function (source) {
                            var link, node, nodeEnter, nodeExit, nodeUpdate;
                            var nodes = tree.nodes(root).reverse();
                            var links = tree.links(nodes);
                            nodes.forEach(function (d) {
                                return d.y = d.depth * 80;
                            });
                            node = vis.selectAll('g.node').data(nodes, function (d) {
                                return d.id || (d.id = ++i);
                            });
                            nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', function (d) {
                            }, {}, 'translate(' + source.y0 + ',' + source.x0 + ')').on('mouseover', function (d) {
                            }).on('click', function (d) {
                                showDetails(d);
                                var clicked_same_node = false;
                                if (window.current_nodes.length > 0) {
                                    if (d.id === window.current_nodes[window.current_nodes.length - 1][0].id) {
                                        clicked_same_node = true;
                                        d3.event.stopPropagation();
                                    }
                                }
                                if (!clicked_same_node) {
                                    return store_and_update(d);
                                }
                            });
                            nodeEnter.append('circle').attr('r', 0.000001).style('fill', function (d) {
                                if (d._children) {
                                    return 'lightsteelblue';
                                } else {
                                    return '#fff';
                                }
                            });
                            nodeEnter.append('text').attr('dy', '.31em').attr('text-anchor', function (d) {
                                if (d.x < 180) {
                                    return 'start';
                                } else {
                                    return 'end';
                                }
                            }).attr('transform', function (d) {
                                if (d.x < 180) {
                                    return 'translate(11)';
                                } else {
                                    return 'rotate(180)translate(-11)';
                                }
                            }).text(function (d) {
                                return d.name;
                            });
                            nodeUpdate = node.transition().duration(duration).attr('transform', function (d) {
                                return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
                            });
                            nodeUpdate.select('circle').attr('r', 10);
                            nodeUpdate.select('text').style('fill-opacity', 1).attr('dy', '.31em').attr('text-anchor', function (d) {
                                if (d.x < 180) {
                                    return 'start';
                                } else {
                                    return 'end';
                                }
                            }).attr('transform', function (d) {
                                if (d.x < 180) {
                                    return 'translate(11)';
                                } else {
                                    return 'rotate(180)translate(-11)';
                                }
                            });
                            nodeExit = node.exit().transition().duration(duration).attr('transform', function (d) {
                                return 'translate(' + source.y + ',' + source.x + ')';
                            }).remove();
                            nodeExit.select('circle').attr('r', 0.000001);
                            nodeExit.select('text').style('fill-opacity', 0.000001);
                            link = vis.selectAll('path.link').data(links, function (d) {
                                return d.target.id;
                            });
                            link.enter().insert('path', 'g').attr('class', 'link').attr('d', function (d) {
                                var o;
                                o = {
                                    x: source.x0,
                                    y: source.y0
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            });
                            link.transition().duration(duration).attr('d', diagonal);
                            link.exit().transition().duration(duration).attr('d', function (d) {
                                var o;
                                o = {
                                    x: source.x,
                                    y: source.y
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            }).remove();
                            return nodes.forEach(function (d) {
                                d.x0 = d.x;
                                return d.y0 = d.y;
                            });
                        };
                        var construct_generations = function (d) {
                            var c, generations;
                            c = d;
                            generations = [];
                            while (c.parent) {
                                generations.push(c.parent.children);
                                c = c.parent;
                            }
                            return generations;
                        };
                        var reform_focus = function () {
                            var count, d, set;
                            if (window.current_nodes.length > 0) {
                                set = window.current_nodes.pop();
                                d = set[0];
                                count = 0;
                                d.parent._children = set[1];
                                if (d.parent._children) {
                                    while (d.parent) {
                                        d.parent.children = set[1][count];
                                        count++;
                                        d = d.parent;
                                    }
                                    return update(d);
                                }
                            }
                        };
                        var store_and_update = function (d) {
                            window.current_nodes.push([
                                d,
                                construct_generations(d)
                            ]);
                            while (d.parent) {
                                d.parent._children = d.parent.children;
                                d.parent.children = d.parent.children.filter(function (e) {
                                    return e.name === d.name;
                                });
                                d = d.parent;
                            }
                            d3.event.stopPropagation();
                            return update(d);
                        };
                        var reconstruct_ancestors = function (n, generations) {
                            var count;
                            count = generations.length - 1;
                            while (n.parent) {
                                n.parent.children = generations[count];
                                count -= 1;
                                n = n.parent;
                            }
                            return n;
                        };
                        var root = void 0;
                        var tree = d3.layout.tree().size([
                            360,
                            360
                        ]);
                        var i = 0;
                        var duration = 2000;
                        var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                            return [
                                d.y,
                                d.x / 180 * Math.PI
                            ];
                        });
                        var zoomed = function () {
                            d3.event.sourceEvent.stopPropagation();
                            return vis.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                        };
                        var zoom = d3.behavior.zoom().scaleExtent([.25,8]).on('zoom', zoomed);
                        var drag = d3.behavior.drag()
                            .origin(function(d) { return d; })
                            .on("dragstart", dragstarted)
                            .on("drag", dragged)
                            .on("dragend", dragended);

                        function dragstarted(d) {
                            d3.event.sourceEvent.stopPropagation();
                            d3.select(this).classed("dragging", true);
                        }

                        function dragged(d) {
                            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
                        }

                        function dragended(d) {
                            d3.select(this).classed("dragging", false);
                        }
                        var div = d3.select(element[0]);
                        var svg = div.insert('svg');
                        svg.on('click', function () {
                            return reform_focus();
                        });
                        var vis = svg.append("g").attr("transform", function() {
                                return "translate(" + parseInt(svg.style('width'))/2 + "," + parseInt(svg.style('height'))/2 + ")"
                            })
                                .append('g')
                                .call(zoom)
                                .append('g')
                                .call(drag)
                            ;
                        vis.append('svg:rect')
                            .attr('width', '200%')
                            .attr('height', '1600px')
                            .attr('fill', '#f8f8f8')
                            .attr('class', 'drag-anchor')
                        ;
                        root = scope.sourceJson;
                        root.x0 = 0;//height / 2;
                        root.y0 = 0;
                        update(root);
                    }

                    scope.render = function (data) {

                        if (!scope.sourceJson) {
                            initJson().then(function () {
                                subRender()
                            });
                        } else {
                            subRender();
                        }
                    }
                }).then(function () {
                    scope.render();
                });
            }}
    }

})();
