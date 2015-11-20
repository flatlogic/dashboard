describe('Service: accountsService', function() {
    var accountsService, httpBackend;

    var token = 'token',
        serverResponse = 'response',
        accountId = 'accountId',
        username = 'username',
        password = 'password',
        custom_object = 'custom_object',
        email = 'email',
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function() {
        module('ui.router');
        module('qorDash.api');

        module(function($provide) {
            $provide.constant("AUTH_API_URL", AUTH_API_URL);
            $provide.constant("Notification", {error: function(){}});
            $provide.service('errorHandler', function(){
                this.showError = jasmine.createSpy('showError');
            });
        });
    });

    var errorHandler = {
        showError: function(e) {
            return e;
        }
    };

    beforeEach(function() {
        inject(function (_accountsService_, $httpBackend, _errorHandler_) {
            accountsService = _accountsService_;
            httpBackend = $httpBackend;
            errorHandler = _errorHandler_;
        });
    });

    it("should get all accounts", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/account/', undefined,
            {"Authorization":"Bearer " + token,"Accept":"application/json, text/plain, */*"}).respond(serverResponse);

        accountsService.getAccounts(token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should get account by id', function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/account/' + accountId, undefined,
            {"Authorization":"Bearer " + token,"Accept":"application/json, text/plain, */*"}).respond(serverResponse);

        accountsService.getAccountById(accountId, token)
            .then(function(response){
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should create an account', function() {
        httpBackend.expect('POST', AUTH_API_URL + '/register',
            {
                "identity": {
                    "username": username,
                    "password": password
                },
                "custom_object": custom_object
            },
            {
                "Content-Type":"application/json;charset=utf-8",
                'Authorization': 'Bearer ' + token,
                "Accept":"application/json, text/plain, */*"
            }
        ).respond(serverResponse);

        accountsService.createAccount(username, password, custom_object, token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
            });

        httpBackend.flush();
    });

    it ('should create Google account', function() {
        httpBackend.expect('POST', AUTH_API_URL + '/register',
            {
                "identity": {
                    "username": username,
                    "oauth2_provider" :"google.com",
                    "oauth2_account_id" : email
                }
            },
            {
                "Content-Type":"application/json;charset=utf-8",
                'Authorization': 'Bearer ' + token,
                "Accept":"application/json, text/plain, */*"
            }
        ).respond(serverResponse);

        accountsService.createGoogleAccount(username, email, token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
            });

        httpBackend.flush();
    });
});
