describe('Service: accountsService ', function() {
    var accountsService, httpBackend;

    var token = 'token',
        serverResponse = 'response',
        accountId = 'accountId',
        username = 'username',
        password = 'password',
        custom_object = 'custom_object',
        token = 'token',
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", AUTH_API_URL);
    }));

    beforeEach(function() {
        inject(function (_accountsService_, $httpBackend, _dataLoader_, _user_, $state) {
            accountsService = _accountsService_;
            httpBackend = $httpBackend;

            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);

            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should get all accounts", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', AUTH_API_URL + '/account/', undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(serverResponse);

        accountsService.getAccounts(token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should get account by id', function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', AUTH_API_URL + '/account/' + accountId, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(serverResponse);

        accountsService.getAccountById(accountId, token)
            .then(function(response){
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it ('should create an account', function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
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
});