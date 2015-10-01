(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.images')
        .controller('DockerImagesController', dockerImagesController)
        .controller('DockerPullImageController', dockerPullImageController);

    dockerImagesController.$inject = ['$scope', 'Image', 'Settings', 'Messages', '$modal'];
    function dockerImagesController($scope, Image, Settings, Messages, $modal) {
        $scope.toggle = false;
        $scope.predicate = '-Created';

        var urlParams = Settings.urlParams;

        $scope.showBuilder = function () {
            $('#build-modal').modal('show');
        };

        $scope.pullImage = function() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/docker/domain/dockers/menu/images/pull-image.html',
                controller: 'DockerPullImageController'
            });
        };

        $scope.removeAction = function () {
            var counter = 0;
            var complete = function () {
                counter = counter - 1;
                if (counter === 0) {
                }
            };
            angular.forEach($scope.images, function (i) {
                if (i.Checked) {
                    counter = counter + 1;
                    Image.remove(angular.extend({id: i.Id}, urlParams), function (d) {
                        angular.forEach(d, function (resource) {
                            Messages.send("Image deleted", resource.Deleted);
                        });
                        var index = $scope.images.indexOf(i);
                        $scope.images.splice(index, 1);
                        complete();
                    }, function (e) {
                        Messages.error("Failure", e.data);
                        complete();
                    });
                }
            });
        };

        $scope.toggleSelectAll = function () {
            angular.forEach($scope.images, function (i) {
                i.Checked = $scope.toggle;
            });
        };

        Image.query(urlParams, function (d) {
            $scope.images = d.map(function (item) {
                return new ImageViewModel(item);
            });
        }, function (e) {
            Messages.error("Failure", e.data);
        });
    }

    dockerPullImageController.$inject = ['$scope', 'Messages', 'Image', '$modalInstance'];
    function dockerPullImageController ($scope, Messages, Image, $modalInstance) {
        $scope.template = 'app/components/pullImage/pullImage.html';

        var urlParams = Settings.urlParams;

        $scope.init = function () {
            $scope.config = {
                registry: '',
                repo: '',
                fromImage: '',
                tag: 'latest'
            };
        };

        $scope.init();

        function failedRequestHandler(e, Messages) {
            Messages.error('Error', errorMsgFilter(e));
        }

        $scope.close = function() {
            $modalInstance.close();
        };

        $scope.pull = function () {
            $('#error-message').hide();
            var config = angular.copy($scope.config);
            var imageName = (config.registry ? config.registry + '/' : '' ) +
                (config.repo ? config.repo + '/' : '') +
                (config.fromImage) +
                (config.tag ? ':' + config.tag : '');

            $('#pull-modal').modal('hide');
            $modalInstance.close();

            Image.create(angular.extend(config, urlParams), function (data) {
                if (data.constructor === Array) {
                    var f = data.length > 0 && data[data.length - 1].hasOwnProperty('error');
                    //check for error
                    if (f) {
                        var d = data[data.length - 1];
                        $scope.error = "Cannot pull image " + imageName + " Reason: " + d.error;
                        $('#pull-modal').modal('show');
                        $('#error-message').show();
                    } else {
                        Messages.send("Image Added", imageName);
                        $scope.init();
                    }
                } else {
                    Messages.send("Image Added", imageName);
                    $scope.init();
                }
            }, function (e) {
                $scope.error = "Cannot pull image " + imageName + " Reason: " + e.data;
                $('#pull-modal').modal('show');
                $('#error-message').show();
            });
        };
    }

})();
