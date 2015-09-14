(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.images.image')
        .controller('DockerImageController', dockerImageController);

    dockerImageController.$inject = ['$scope', '$q', '$stateParams', '$location', 'Image', 'Container', 'Messages', 'LineChart', '$modal'];
    function dockerImageController($scope, $q, $stateParams, $location, Image, Container, Messages, LineChart, $modal) {
        $scope.history = [];
        $scope.tag = {repo: '', force: false};

        $scope.remove = function () {
            Image.remove({id: $stateParams.imageId}, function (d) {
                Messages.send("Image Removed", $stateParams.imageId);
            }, function (e) {
                $scope.error = e.data;
                $('#error-message').show();
            });
        };

        $scope.getHistory = function () {
            Image.history({id: $stateParams.imageId}, function (d) {
                $scope.history = d;
            });
        };

        $scope.updateTag = function () {
            var tag = $scope.tag;
            Image.tag({id: $stateParams.imageId, repo: tag.repo, force: tag.force ? 1 : 0}, function (d) {
                Messages.send("Tag Added", $stateParams.imageId);
            }, function (e) {
                $scope.error = e.data;
                $('#error-message').show();
            });
        };

        function getContainersFromImage($q, Container, tag) {
            var defer = $q.defer();

            Container.query({all: 1, notruc: 1}, function (d) {
                var containers = [];
                for (var i = 0; i < d.length; i++) {
                    var c = d[i];
                    if (c.Image === tag) {
                        containers.push(new ContainerViewModel(c));
                    }
                }
                defer.resolve(containers);
            });

            return defer.promise;
        }

        Image.get({id: $stateParams.imageId}, function (d) {
            $scope.image = d;
            $scope.tag = d.id;
            var t = $stateParams.imageTag;
            if (t && t !== ":") {
                $scope.tag = t;
                var promise = getContainersFromImage($q, Container, t);

                promise.then(function (containers) {
                    LineChart.build('#containers-started-chart', containers, function (c) {
                        return new Date(c.Created * 1000).toLocaleDateString();
                    });
                });
            }
        }, function (e) {
            if (e.status === 404) {
                $('.detail').hide();
                $scope.error = "Image not found.<br />" + $stateParams.imageId;
            } else {
                $scope.error = e.data;
            }
            $('#error-message').show();
        });

        $scope.getHistory();
    }
})();
