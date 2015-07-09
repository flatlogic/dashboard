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
                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

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
                        var margin = 0,
                            height = element.parent().parent().height() - 10,
                            width = element.parent().width() - 10;

                        if (height < 1 || width < 1) {
                            return;
                        }

                        scope.width     = element.parent().width();
                        scope.height    = element.parent().parent().height();

                        var diameter = Math.min(height - 5, width - 5);

                        var color = d3.scale.linear()
                            .domain([-1, 5])
                            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                            .interpolate(d3.interpolateHcl);

                        var pack = d3.layout.pack()
                            .padding(2)
                            .size([diameter - margin, diameter - margin])
                            .value(function (d) {
                                return d.size;
                            });

                        var svg = d3.select(element[0]).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .style({"padding-left": (width - height) / 2})
                            .style({"padding-top": 5})
                            .style({"padding-top": (height - width) / 2})
                            .append("g")
                            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                        function subRender() {
                            var root = scope.sourceJson;

                            var focus = root,
                                nodes = pack.nodes(root),
                                view;

                            var tooltip = d3.select("body")
                                .append("div")
                                .style("position", "absolute")
                                .attr("class", "d3-tip")
                                .style("z-index", "10")
                                .style("visibility", "hidden");

                            var circle = svg.selectAll("circle")
                                .data(nodes)
                                .enter().append("circle")
                                .attr("class", function (d) {
                                    return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
                                })
                                .style("fill", function (d) {
                                    if (!d.children) {
                                        return 'rgb(255,215,215)';
                                    }
                                    switch (d.depth) {
                                        case 0:
                                            return 'rgb(132, 204, 193)';
                                        case 1:
                                            return 'rgb(238, 81, 74)';
                                        case 2:
                                            return 'rgb(255,255,255)';
                                        case 3:
                                            return 'rgb(2,47,50)';
                                        case 4:
                                            return 'rgb(8,112,112)';
                                        case 5:
                                            return 'rgb(132, 204, 193)';
                                        case 6:
                                            return 'rgb(32,50,73)';
                                        default:
                                            return color(d.depth);
                                    }
                                })
                                .on("click", function (d) {
                                    if (focus !== d) zoom(d), d3.event.stopPropagation();
                                })
                                .on("mouseover", function (d) {
                                    return tooltip.style("visibility", "visible").text(d.name);
                                })
                                .on("mousemove", function (d) {
                                    return tooltip.style("top", (event.pageY - 30) + "px").style("left", (event.pageX - 20) + "px").text(d.name);
                                })
                                .on("mouseout", function () {
                                    return tooltip.style("visibility", "hidden");
                                });

                            var text = svg.selectAll("text")
                                .data(nodes)
                                .enter().append("text")
                                .attr("class", "label")
                                .style("fill-opacity", function (d) {
                                    return d.parent === root ? 1 : 0;
                                })
                                .style("display", function (d) {
                                    return d.parent === root ? null : "none";
                                })
                                .text(function (d) {
                                    return d.name;
                                });

                            var node = svg.selectAll("circle,text");

                            d3.select(element[0])
                                .on("click", function () {
                                    zoom(root);
                                });

                            zoomTo([root.x, root.y, root.r * 2 + margin]);

                            function zoom(d) {
                                var focus0 = focus;
                                focus = d;

                                var transition = d3.transition()
                                    .duration(d3.event.altKey ? 7500 : 750)
                                    .tween("zoom", function (d) {
                                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                                        return function (t) {
                                            zoomTo(i(t));
                                        };
                                    });

                                transition.selectAll("text")
                                    .filter(function (d) {
                                        return d.parent === focus || this.style.display === "inline";
                                    })
                                    .style("fill-opacity", function (d) {
                                        return d.parent === focus ? 1 : 0;
                                    })
                                    .each("start", function (d) {
                                        if (d.parent === focus) this.style.display = "inline";
                                    })
                                    .each("end", function (d) {
                                        if (d.parent !== focus) this.style.display = "none";
                                    });

                                showDetails(d);
                            }

                            function zoomTo(v) {
                                var k = diameter / v[2];
                                view = v;
                                node.attr("transform", function (d) {
                                    return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                                });
                                circle.attr("r", function (d) {
                                    return d.r * k;
                                });
                            }

                            function showDetails(root) {
                                $state.go('app.domains.domain.env.network.node', {depth: root.depth, node: root.name});
                            }
                        }

                        if (!scope.sourceJson) {
                            initJson().then(function () {
                                subRender()
                            });
                        } else {
                            subRender();
                        }

                        d3.select(self.frameElement).style("height", diameter + "px");
                    }
                }).then(function () {
                    var rerender = function () {
                        jQuery(element).animate({
                            opacity: 0,
                            duration: 30
                        }, function () {
                            element.text("");
                            scope.render();
                            jQuery(element).animate({
                                opacity: 1,
                                duration: 30
                            });
                        });
                    };
                });
            }}
    }

})();
