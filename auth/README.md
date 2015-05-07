# Passport Authentication Service


## Introduction

The Passport authentication service is a REST service that provides authentication and authorization services
for multiple services (apps).  Applications can delegate the functions of user authentication and authorization
to this service and saves time from having to develop its own auth and account management features.

1. When user signs in, it returns a JWT token (see http://jwt.io) that encodes
  a. A user identity (as UUID in the system)
  b. Expiration timestamp (in unix time, seconds since epoch)
  c. Permissions -- called scopes, and attributes by application.
2. The JWT token is signed so that the system can verify authenticity and trust.
3. It also provides an API for application to create and update user accounts.  For these services,
an API key is required.

## The JWT Token

1. An example token looks like

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAxL0BpZCI6IjRlODk1NGEyLWQ5YzUtMTFlNC1iNjkzLTAyNDJhYzExMDAwZCIsImFwcDEvQHNjb3BlcyI6ImFwcDEtcmVhZG9ubHksYXBwMS13cml0ZSIsImFwcDEvQHN0YXR1cyI6IiIsImFwcDIvQGlkIjoiNGU4OTU0YTItZDljNS0xMWU0LWI2OTMtMDI0MmFjMTEwMDBkIiwiYXBwMi9Ac2NvcGVzIjoiYXBwMi1yZWFkb25seSIsImFwcDIvQHN0YXR1cyI6IiIsImRvbWFpbiI6InFvci5pbyIsImV4cCI6MTQzMzYyMDA5NywicGFzc3BvcnQvQGlkIjoiNGU4OTU0YTItZDljNS0xMWU0LWI2OTMtMDI0MmFjMTEwMDBkIiwicGFzc3BvcnQvQHNjb3BlcyI6Im15X2FjY291bnQiLCJwYXNzcG9ydC9Ac3RhdHVzIjoiIn0.jkgSQQb2GzpKTXM7UpKA-FqZ5BRdcMdl4GR1vHmHgQ8
```

This is a signed encoding of this JSON structure (from http://jwt.io) ![jwt_screen1](/auth/images/jwt1.png):

```
{
  "app1/@id": "4e8954a2-d9c5-11e4-b693-0242ac11000d",
  "app1/@scopes": "app1-readonly,app1-write",
  "app1/@status": "",
  "app2/@id": "4e8954a2-d9c5-11e4-b693-0242ac11000d",
  "app2/@scopes": "app2-readonly",
  "app2/@status": "",
  "domain": "qor.io",
  "exp": 1433619236,
  "passport/@id": "4e8954a2-d9c5-11e4-b693-0242ac11000d",
  "passport/@scopes": "my_account",
  "passport/@status": ""
}
```
In this example, the token expires on 1433619236, or Sat, 06 Jun 2015 19:33:56 GMT.
The user is identified as `4e8954a2-d9c5-11e4-b693-0242ac11000d` in the system, but has different ids in `app1` and `app2`, which are two different systems that uses this service for auth.

For `app1`, the user has the permissions (scopes): `app1-readonly` and `app1-write`.

For `app2`, the user has the permissions (scopes): `app2-readonly`

In the UI, these scopes are to be named like `app1:app1-readonly`, `app1:app1-write` and `app2:app2-readonly`.
This way, we have proper namespace for a dashboard app that needs to talk to multiple REST backend systems.

## How to Use the Service

A Postman collection is here: https://www.getpostman.com/collections/3627231e92577dba0792

or here: [postman](/auth/accounts.qor.io.json.postman_collection)


### Authenticate a user

+ Perform a POST to https://accounts.qor.io/v1/auth
+ HTTP Header:  `Content-Type: application/json`
+ No HTTP Authorization header required.
+ POST body

```
{
    "username": "dashboard-admin",
    "password": "password"
}
```

+ Response:

```
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAxL0BpZCI6Ijc3YTlkMGQzLWY0ZmMtMTFlNC05OTk3LTAyNDJhYzExMDAwYSIsImFwcDEvQHNjb3BlcyI6ImFwcDEtcmVhZG9ubHksYXBwMS13cml0ZSIsImFwcDEvQHN0YXR1cyI6IiIsImFwcDIvQGlkIjoiNzdhOWQwZDMtZjRmYy0xMWU0LTk5OTctMDI0MmFjMTEwMDBhIiwiYXBwMi9Ac2NvcGVzIjoiYXBwMi1yZWFkb25seSIsImFwcDIvQHN0YXR1cyI6IiIsImRvbWFpbiI6InFvci5pbyIsImV4cCI6MTQzMzYyNDcyMCwicGFzc3BvcnQvQGlkIjoiNzdhOWQwZDMtZjRmYy0xMWU0LTk5OTctMDI0MmFjMTEwMDBhIiwicGFzc3BvcnQvQHNjb3BlcyI6Im15X2FjY291bnQiLCJwYXNzcG9ydC9Ac3RhdHVzIjoiIn0.c1ltRxNORgv1Gyvs_sI0PrbekO51NEg3y5SXJJw8pZg"
}
```

The `token` field contains the JWT token to use in future API calls.

Some test users with their usernames, passwords, and permissions:

| Username        | Password | Scopes                                      |
|-----------------|----------|---------------------------------------------|
| dashboard1      | password | my_account,account_readonly                 |
| dashboard-admin | password | my_account,account_readonly,account_update  |



### Get Me

Returns the user's account information given the auth token set in the HTTP header:

+ GET https://accounts.qor.io/v1/account/me
+ HTTP Headers:

    Accept: application/json
    Authorization: Bearer <token>

+ Repsonse:

```
{
    "id": "a701e721-f4f7-11e4-9997-0242ac11000a",
    "created_timestamp": 1431030522,
    "services": [
    {
        "id": "passport",
         "scopes": [
             "my_account",
             "account_readonly"
         ]
    },
    {
        "id": "app1",
         "account_id": "a701e721-f4f7-11e4-9997-0242ac11000a",
             "scopes": [
             "app1-readonly",
             "app1-write",
             "app1-superuser",
             "can-tell-jokes"
         ]
    },
    {
        "id": "app2",
        "account_id": "a701e721-f4f7-11e4-9997-0242ac11000a",
        "scopes": [
            "app2-readonly"
        ],
        "start_timestamp": 1431030522
    }
    ],
    "primary": {
       "domain": "qor.io",
       "id": "a701e721-f4f7-11e4-9997-0242ac11000a",
        "username": "dashboard1"
    },
    "custom_json": "{ \ \"name\":\"dashboard1\",\ \"role\" : \"operations\"\ }"
}
```

### List service accounts

Lists user accounts in the system.  Requires the `account_readonly` permission for the `passport` app.

+ GET https://accounts.qor.io/v1/account/?limit=2&offset=3
+ Query Params:
  + `limit` is number of items to return.
  + `offset` is the starting point. This is for paging.
  + No query parameters will return the entire data set!!
+ HTTP Headers:

    Accept: application/json
    Authorization: Bearer <token>

+ Repsonse:  An array of accounts.

```
[
{
"id": "d0407397-efc4-11e4-9997-0242ac11000a",
"created_timestamp": 1430458931,
"services": [
{
"id": "passport",
"account_id": "d0407397-efc4-11e4-9997-0242ac11000a",
"scopes": [
"my_account"
],
"start_timestamp": 1430458931
},
{
...


```







