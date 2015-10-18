(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.images')
        .controller('DockerImagesController', dockerImagesController)
        .controller('DockerPullImageController', dockerPullImageController);

    function dockerImagesController($q, $modal, Image, Settings, DockerViewModel, resolvedDockerImages) {
        var urlParams = Settings.urlParams;
        var vm = this;
        vm.toggle = false;
        vm.predicate = '-Created';
        vm.images = resolvedDockerImages.map(DockerViewModel.image);

        vm.toggleSelectAll = function () {
            angular.forEach(vm.images, function (i) {
                i.Checked = vm.toggle;
            });
        };

        vm.removeAction = function () {
            var imagesToRemove = vm.images.filter(function(image){
                return image.Checked;
            });
            var promises = [];
            imagesToRemove.forEach(function(image){
                promises.push(Image.remove(angular.extend({id: image.Id}, urlParams)));
            });
            $q.all(promises).then(function(){
                Image.query(Settings.urlParams, function(response) {
                    vm.images = response.map(DockerViewModel.image);;
                });
            });
        };


        vm.pullImage = function() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/docker/images/pull-image.html',
                controller: 'DockerPullImageController',
                controllerAs: 'vm'
            });
        };

    }

    function dockerPullImageController (Settings, Messages, Image, $modalInstance) {
        var urlParams = Settings.urlParams;
        var vm = this;
        vm.template = 'app/components/pullImage/pullImage.html';

        vm.init = function () {
            vm.config = {
                registry: '',
                repo: '',
                fromImage: '',
                tag: 'latest'
            };
        };

        vm.close = function() {
            $modalInstance.close();
        };

        vm.init();

        function failedRequestHandler(e, Messages) {
            Messages.error('Error', errorMsgFilter(e));
        }


        vm.pull = function () {
            vm.error = null;
            var config = angular.copy(vm.config);
            var imageName = (config.registry ? config.registry + '/' : '' ) +
                (config.repo ? config.repo + '/' : '') +
                (config.fromImage) +
                (config.tag ? ':' + config.tag : '');

            $modalInstance.close();

            Image.create(angular.extend(config, urlParams), function (data) {
                if (data.constructor === Array) {
                    var f = data.length > 0 && data[data.length - 1].hasOwnProperty('error');
                    //check for error
                    if (f) {
                        var d = data[data.length - 1];
                        vm.error = "Cannot pull image " + imageName + " Reason: " + d.error;
                    } else {
                        Messages.send("Image Added", imageName);
                        vm.init();
                    }
                } else {
                    Messages.send("Image Added", imageName);
                    vm.init();
                }
            }, function (e) {
                vm.error = "Cannot pull image " + imageName + " Reason: " + e.data;
            });
        };
    }

})();
