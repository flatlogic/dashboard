(function () {
    'use strict';

    var containerModule = angular.module('qorDash.widget.container')
            .directive('qlContainer', qlContainer)
        ;
    qlContainer.$inject = ['d3', '$window', '$interval', '$state', '$http'];
    function qlContainer(d3, $window, $interval, $state, $http) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {

                function chooseSource(value) {
                    switch (value) {
                        case 'hosts':
                            return 'data/container-h.json';
                        case 'services':
                            return 'data/container-s.json';
                        default:
                            return 'data/container-az.json';
                    }
                }

                function initJson() {
                    return $http.get(scope.sourceJsonLink)
                        .then(function (res) {
                            scope.sourceJson = res.data;
                            $('#select-prop').text('');
                            for (var selectorIndex in res.data.selectors) {
                                $('#select-prop').append('<option value="' + res.data.selectors[selectorIndex] + '">By ' + res.data.selectors[selectorIndex] + '</option>')
                            }
                        });
                }

                function myJson(o, fun) {
                    fun(o);
                }

                d3.d3().then(function (d3) {
                    scope.sourceJsonLink = chooseSource($("#select-type option:selected").val());

                    initJson();
                    scope.heightMargin  = 65;
                    scope.widthMargin   = 10;

                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    scope.render = function (data) {
                        // Render d3 graph here
                        var margin = 0;

                        var width   = element.parent().width() - scope.widthMargin,
                            height  = element.parent().parent().height() - scope.heightMargin,
                            x = d3.scale.linear().range([0, width]),
                            y = d3.scale.linear().range([0, height]),
                            color = d3.scale.category20c(),
                            root,
                            node;

                        if (width < 0) {
                            width = 0;
                        }

                        if (height < 0) {
                            height = 0;
                        }

                        scope.width     = element.parent().width();
                        scope.height    = height;

                        var treemap = d3.layout.treemap()
                            .round(false)
                            .size([width, height])
                            .sticky(true)
                            .value(function (d) {
                                return d.cpu;
                            });

                        var svg = d3.select(element[0]).append("div")
                            .attr("class", "chart")
                            .style("width", width + "px")
                            .style("height", height + "px")
                            .append("svg:svg")
                            .attr("width", width)
                            .attr("height", height)
                            .append("svg:g")
                            .attr("transform", "translate(.5,.5)");

                        function subRender() {
                            node = root = scope.sourceJson;
                            var nodes = treemap.nodes(root)
                                .filter(function (d) {
                                    return !d.children;
                                });

                            var cell = svg.selectAll("g")
                                .data(nodes)
                                .enter().append("svg:g")
                                .attr("class", "cell")
                                .attr("transform", function (d) {
                                    return "translate(" + d.x + "," + d.y + ")";
                                })
                                .on("click", function (d) {
                                    return zoom(node == d.parent ? root : d.parent);
                                });

                            cell.append("svg:rect")
                                .attr("width", function (d) {
                                    if (d.dx - 1 < 0) {
                                        return 0;
                                    }
                                    return d.dx - 1;
                                })
                                .attr("height", function (d) {
                                    if (d.dy - 1 < 0) {
                                        return 0;
                                    }
                                    return d.dy - 1;
                                })
                                .style("fill", function (d) {
                                    return color(d.parent.name);
                                });

                            cell.append("svg:text")
                                .attr("x", function (d) {
                                    return d.dx / 2;
                                })
                                .attr("y", function (d) {
                                    return d.dy / 2;
                                })
                                .attr("dy", ".35em")
                                .attr("text-anchor", "middle")
                                .text(function (d) {
                                    return d.name;
                                })
                                .style("opacity", function (d) {
                                    d.w = this.getComputedTextLength();
                                    return d.dx > d.w ? 1 : 0;
                                });

                            d3.select(window).on("click", function () {
                                zoom(root);
                            });

                            d3.select("#select-type").on("change", function () {
                                var selectedValue = d3.select(this).property('value');
                                scope.sourceJsonLink = chooseSource(selectedValue);
                                scope.sourceJson = null;
                                element.text("");
                                scope.render();
                                zoom(node);
                            });

                            d3.select("#select-prop").on("change", function () {
                                var selectedValue = d3.select(this).property('value');
                                switch (selectedValue) {
                                    case "cpu":
                                        treemap.value(cpu).nodes(root);
                                        break;
                                    case "memory":
                                        treemap.value(ram).nodes(root);
                                        break;
                                    case "disk":
                                        treemap.value(disk).nodes(root);
                                }
                                zoom(node);
                            });
                        }

                        if (!scope.sourceJson) {
                            initJson().then(function () {
                                subRender()
                            });
                        } else {
                            subRender();
                        }

                        function cpu(d) {
                            return d.cpu;
                        }

                        function ram(d) {
                            return d.memory;
                        }

                        function disk(d) {
                            if (d.disk) {
                                return d.disk;
                            }
                        }

                        function zoom(d) {
                            var kx = width / d.dx,
                                ky = height / d.dy;

                            x.domain([d.x, d.x + d.dx]);
                            y.domain([d.y, d.y + d.dy]);

                            var t = svg.selectAll("g.cell").transition()
                                .duration(d3.event.altKey ? 7500 : 750)
                                .attr("transform", function (d) {
                                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                                });

                            t.select("rect")
                                .attr("width", function (d) {
                                    if (kx * d.dx - 1 < 0) {
                                        return 0;
                                    }
                                    return kx * d.dx - 1;
                                })
                                .attr("height", function (d) {
                                    if (ky * d.dy - 1 < 0) {
                                        return 0;
                                    }
                                    return ky * d.dy - 1;
                                });

                            t.select("text")
                                .attr("x", function (d) {
                                    return kx * d.dx / 2;
                                })
                                .attr("y", function (d) {
                                    return ky * d.dy / 2;
                                })
                                .style("opacity", function (d) {
                                    return kx * d.dx > d.w ? 1 : 0;
                                });

                            node = d;

                            d3.event.stopPropagation();
                        }
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

                    $interval(function () {
                        // TODO fix width changing
                        if (element.parent().parent().height() - scope.heightMargin != scope.height) {
                            rerender();
                        }
                    }, 600);
                });
            }}
    }

})();
