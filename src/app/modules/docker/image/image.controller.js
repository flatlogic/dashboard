(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.images.image')
        .controller('DockerImageController', dockerImageController)
        .controller('CreateImageModalController', createImageModalController);

    function dockerImageController($q, $stateParams, $modal, Image, Container, DockerViewModel, Settings, Messages, resolvedDockerImage, resolvedDockerImageHistory) {
        var urlParams = angular.extend({id: $stateParams.imageId}, Settings.urlParams);
        var vm = this;
        vm.tag1 = {repo: '', force: false};
        vm.history = resolvedDockerImageHistory;
        vm.image = resolvedDockerImage;
        vm.tag = resolvedDockerImage.id;

        var t = $stateParams.imageTag;
        if (t && t !== ":") {
            vm.tag = t;
            var promise = getContainersFromImage($q, Container, t);

            promise.then(function (containers) {
                vm.containers = containers;
            });
        }


        vm.remove = function () {
            Image.remove(urlParams, function (d) {
                Messages.send("Image Removed", $stateParams.imageId);
            }, function (e) {
                vm.error = e.data;
            });
        };

        vm.getHistory = function () {
            Image.history(urlParams, function (d) {
                vm.history = d;
            });
        };

        vm.updateTag = function () {
            var tag = vm.tag1;
            Image.tag(angular.extend({repo: tag.repo, force: tag.force ? 1 : 0}, urlParams), function (d) {
                Messages.send("Tag Added", $stateParams.imageId);
            }, function (e) {
                vm.error = e.data;
            });
        };

        vm.openCreateImageModal = function() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/docker/image/create-modal.html',
                controller: 'CreateImageModalController',
                controllerAs: 'vm'
            });
        };

        function getContainersFromImage($q, Container, tag) {
            var defer = $q.defer();

            Container.query(angular.extend({all: 1, notruc: 1}, Settings.urlParams), function (d) {
                var containers = [];
                for (var i = 0; i < d.length; i++) {
                    var c = d[i];
                    if (c.Image === tag) {
                        containers.push(DockerViewModel.container(c));
                    }
                }
                defer.resolve(containers);
            });

            return defer.promise;
        }
    }

    function createImageModalController($scope, $stateParams, $location, Settings, Container, Messages, containernameFilter, errorMsgFilter, $modalInstance) {

        var urlParams = Settings.urlParams;

        Container.query(angular.extend({all: 1}, urlParams), function (d) {
            $scope.containerNames = d.map(function (container) {
                return containernameFilter(container);
            });
        });

        $scope.config = {
            Env: [],
            Volumes: [],
            SecurityOpts: [],
            HostConfig: {
                PortBindings: [],
                Binds: [],
                Links: [],
                Dns: [],
                DnsSearch: [],
                VolumesFrom: [],
                CapAdd: [],
                CapDrop: [],
                Devices: [],
                LxcConf: [],
                ExtraHosts: []
            }
        };

        $scope.menuStatus = {
            containerOpen: true,
            hostConfigOpen: false
        };

        function failedRequestHandler(e, Messages) {
            Messages.error('Error', errorMsgFilter(e));
        }

        function rmEmptyKeys(col) {
            for (var key in col) {
                if (col[key] === null || col[key] === undefined || col[key] === '' || $.isEmptyObject(col[key]) || col[key].length === 0) {
                    delete col[key];
                }
            }
        }

        function getNames(arr) {
            return arr.map(function (item) {
                return item.name;
            });
        }

        $scope.close = function() {
            $modalInstance.close();
        };

        $scope.create = function () {
            // Copy the config before transforming fields to the remote API format
            var config = angular.copy($scope.config);

            config.Image = $stateParams.imageId;

            if (config.Cmd && config.Cmd[0] === "[") {
                config.Cmd = angular.fromJson(config.Cmd);
            } else if (config.Cmd) {
                config.Cmd = config.Cmd.split(' ');
            }

            config.Env = config.Env.map(function (envar) {
                return envar.name + '=' + envar.value;
            });

            config.Volumes = getNames(config.Volumes);
            config.SecurityOpts = getNames(config.SecurityOpts);

            config.HostConfig.VolumesFrom = getNames(config.HostConfig.VolumesFrom);
            config.HostConfig.Binds = getNames(config.HostConfig.Binds);
            config.HostConfig.Links = getNames(config.HostConfig.Links);
            config.HostConfig.Dns = getNames(config.HostConfig.Dns);
            config.HostConfig.DnsSearch = getNames(config.HostConfig.DnsSearch);
            config.HostConfig.CapAdd = getNames(config.HostConfig.CapAdd);
            config.HostConfig.CapDrop = getNames(config.HostConfig.CapDrop);
            config.HostConfig.LxcConf = config.HostConfig.LxcConf.reduce(function (prev, cur, idx) {
                prev[cur.name] = cur.value;
                return prev;
            }, {});
            config.HostConfig.ExtraHosts = config.HostConfig.ExtraHosts.map(function (entry) {
                return entry.host + ':' + entry.ip;
            });

            var ExposedPorts = {};
            var PortBindings = {};
            config.HostConfig.PortBindings.forEach(function (portBinding) {
                var intPort = portBinding.intPort + "/tcp";
                if (portBinding.protocol === "udp") {
                    intPort = portBinding.intPort + "/udp";
                }
                var binding = {
                    HostIp: portBinding.ip,
                    HostPort: portBinding.extPort
                };
                if (portBinding.intPort) {
                    ExposedPorts[intPort] = {};
                    if (intPort in PortBindings) {
                        PortBindings[intPort].push(binding);
                    } else {
                        PortBindings[intPort] = [binding];
                    }
                } else {
                    Messages.send('Warning', 'Internal port must be specified for PortBindings');
                }
            });
            config.ExposedPorts = ExposedPorts;
            config.HostConfig.PortBindings = PortBindings;

            // Remove empty fields from the request to avoid overriding defaults
            rmEmptyKeys(config.HostConfig);
            rmEmptyKeys(config);

            Container.create(angular.extend(config, urlParams), function (d) {
                if (d.Id) {
                    var reqBody = config.HostConfig || {};
                    reqBody.id = d.Id;
                    Container.start(angular.extend(reqBody, urlParams), function (cd) {
                        if (cd.id) {
                            Messages.send('Container Started', d.Id);
                            $('#create-modal').modal('hide');
                            $location.path('/containers/' + d.Id + '/');
                        } else {
                            failedRequestHandler(cd, Messages);
                            Container.remove({id: d.Id}, function () {
                                Messages.send('Container Removed', d.Id);
                            });
                        }
                    }, function (e) {
                        failedRequestHandler(e, Messages);
                    });
                } else {
                    failedRequestHandler(d, Messages);
                }
            }, function (e) {
                failedRequestHandler(e, Messages);
            });
        };

        $scope.addEntry = function (array, entry) {
            array.push(entry);
        };
        $scope.rmEntry = function (array, entry) {
            var idx = array.indexOf(entry);
            array.splice(idx, 1);
        };
    }
})();
