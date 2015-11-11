describe('Service: accountsService ', function() {
    var accountsService, httpBackend;

    var token = 'token',
        serverResponse = 'response',
        accountId = 'accountId',
        githubUsername = 'githubUsername',
        username = 'username',
        password = 'password',
        custom_object = 'custom_object',
        token = 'token',
        email = 'email',
        AUTH_API_URL;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.constants'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(function() {
        inject(function (_accountsService_, $httpBackend, _user_, _AUTH_API_URL_, $state) {
            accountsService = _accountsService_;
            httpBackend = $httpBackend;
            AUTH_API_URL = _AUTH_API_URL_;

            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should get all accounts", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/account/', undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(serverResponse);

        accountsService.getAccounts(token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should get account by id', function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/account/' + accountId, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(serverResponse);

        accountsService.getAccountById(accountId, token)
            .then(function(response){
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should create an account', function(done) {
        httpBackend.expect('POST', AUTH_API_URL + '/register',
            {
                "identity": {
                    "username": username,
                    "password": password
                },
                "custom_object": custom_object
            },
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                "Accept":"application/json"
            }
        ).respond(serverResponse);

        accountsService.createAccount(username, password, custom_object, token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should create Google account', function(done) {
        httpBackend.expect('POST', AUTH_API_URL + '/register',
            {
                "identity": {
                    "username": username,
                    "oauth2_provider" :"google.com",
                    "oauth2_account_id" : email
                }
            },
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                "Accept":"application/json"
            }
        ).respond(serverResponse);

        accountsService.createGoogleAccount(username, email, token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
    describe('createGitHubAccount', function() {
        it('should send a request', function() {
            httpBackend.expectPOST(AUTH_API_URL + '/register').respond(serverResponse);

            accountsService.createGitHubAccount(username, githubUsername, token)
                .then(function(res) {
                    expect(res.data).toEqual(serverResponse);
                });

            httpBackend.flush();
        });
    });
});
