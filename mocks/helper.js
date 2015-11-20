beforeEach(function(){
    module(function($provide) {
        $provide.provider("$state", function stateProvider() {
            this.$get = function() {

            };
            this.state = function() {

            };
            this.decorator = function() {

            };
        });
        $provide.provider("$qorSidebar", function qorSidebarProvider() {
            this.$get = function() {

            };
            this.config = function() {

            };
        });
        $provide.provider("$urlRouter", function() {
            this.$get = function() {

            };
            this.otherwise = function() {

            };
        });
    });
});
