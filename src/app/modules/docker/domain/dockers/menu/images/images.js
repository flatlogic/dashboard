(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.images')
        .controller('DockerImagesController', dockerImagesController);

    dockerImagesController.$inject = ['$scope', 'Image', 'Messages'];
    function dockerImagesController($scope, Image, Messages) {
        $scope.toggle = false;
        $scope.predicate = '-Created';

        $scope.showBuilder = function () {
            $('#build-modal').modal('show');
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
                    Image.remove({id: i.Id}, function (d) {
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

        Image.query({}, function (d) {
            $scope.images = d.map(function (item) {
                return new ImageViewModel(item);
            });
        }, function (e) {
            Messages.error("Failure", e.data);
        });
    }

})();