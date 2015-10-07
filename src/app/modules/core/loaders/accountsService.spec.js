describe('Service: accountsService ', function() {
    var accountsService, httpBackend;

    var token = 'token';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
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
        httpBackend.expect('GET', /.*account\//, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(
            [
                {
                    "id": "1230e852-4c55-11e5-af87-0242ac11000e",
                    "created_timestamp": 1440636396,
                    "services": [
                        {
                            "id": "passport",
                            "account_id": "1230e852-4c55-11e5-af87-0242ac11000e",
                            "scopes": [
                                "my_account"
                            ],
                            "start_timestamp": 1440636396
                        }
                    ],
                    "primary": {
                        "domain": "qor.io",
                        "id": "1230e852-4c55-11e5-af87-0242ac11000e",
                        "password": "JDJhJDEwJHZna2xDQUpMVVZ3Y3ZiOEtzRzBpbU9XQWE4QTREb0oveGZSQURXb0hlQW1PbTVmUUkzVG9X",
                        "username": "dashboard-admin2"
                    },
                    "custom_json": "{ \\\n        \"name\":\"dashboard-user\" \\\n    }"
                }
            ]
        );

        accountsService.getAccounts(token)
            .success(function(response) {
                expect(response).toBeDefined();
                expect(response[0].id).toMatch(/\d\w+/);
                done();
            })
            .error(function(response) {
                //TODO
                done();
            });

        httpBackend.flush();
    });

    it ('should get account by id', function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', /.*account\/1/, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(
            [
                {
                    "id": "1",
                    "created_timestamp": 1440636396,
                    "services": [
                        {
                            "id": "passport",
                            "account_id": "1230e852-4c55-11e5-af87-0242ac11000e",
                            "scopes": [
                                "my_account"
                            ],
                            "start_timestamp": 1440636396
                        }
                    ],
                    "primary": {
                        "domain": "qor.io",
                        "id": "1230e852-4c55-11e5-af87-0242ac11000e",
                        "password": "JDJhJDEwJHZna2xDQUpMVVZ3Y3ZiOEtzRzBpbU9XQWE4QTREb0oveGZSQURXb0hlQW1PbTVmUUkzVG9X",
                        "username": "dashboard-admin2"
                    },
                    "custom_json": "{ \\\n        \"name\":\"dashboard-user\" \\\n    }"
                }
            ]
        );

        accountsService.getAccountById(1, token)
            .success(function(response){
                expect(response).toBeDefined();
                expect(response[0].id).toEqual('1');
                done();
            })
            .error(function(response) {
                //TODO
                done();
            });

        httpBackend.flush();
    });

    it ('should create an account', function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', /.*\/register/,
            {
                "identity": {
                    "username": 'username',
                    "password": 'password'
                },
                "custom_object": 'custom_object'
            },
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                "Accept":"application/json"
            }
        ).respond({});

        accountsService.createAccount('username', 'password', 'custom_object', token)
            .success(function(response) {
                expect(response).toBeDefined();
                done();
            })
            .error(function(response) {
                //TODO
                done();
            });

        httpBackend.flush();
    });
});