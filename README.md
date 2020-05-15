[![Maintainability](https://api.codeclimate.com/v1/badges/6a2268d17d0fcae99c56/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/social-media-strategy-be/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/6a2268d17d0fcae99c56/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/social-media-strategy-be/test_coverage)

# API Documentation

#### Backend deployed at [AWS](https://api.so-me.net) <br>

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm server** to start the local server
- **npm test** to start server using testing environment

### Backend framework goes here

- Express
- Knex
- Postgres

## Endpoints

# SoMe Back End

**Endpoints**

https://api.so-me.net

| Method | URL                    | Description                                                                                                     |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| POST   | /api/auth/register     | Creates a user ( **Email, Password, Role**)                                                                     |
| POST   | /api/auth/login        | Login into account (**Email, Password**)                                                                        |
| POST   | /api/:id/callback      | After Twitter Oauth sign-in, it sends oauth id to Okta for secure storage(`Auth Required`)                      |
| POST   | /api/auth/dsteam       | Creates a new user login for DS team to secure routes between web BE and DS flask (`Auth Required`)             |
| POST   | /api/posts/:id/user    | Submits a Tweet to DS for an optimal time and adds it to a user profile (`Auth Required`)                       |
| POST   | /api/topics/:id/user   | Creates a Topic to store all Post cards for the Font-End **CARDS ARE STORED AS JSON STRINGS** (`Auth Required`) |
| POST   | /api/posts/:id/postnow | Posts a Tweet to Twitter immediately without scheduling or getting DS input (`Auth Required`)                   |
| GET    | /api/:id/oauth         | Retrieves an OAuth token from Twitter for API use (`Auth Required`)                                             |
| GET    | /api/auth/userInfo     | Retrieves a user's Twitter Information (`Auth Required`)                                                        |
| GET    | /api/auth/userStream   | Retrieves a user's Twitter stream Homepage information (`Auth Required`)                                        |
| GET    | /api/users/            | Retrieves a list of users (`Auth Required`)                                                                     |
| GET    | /api/users/user        | Retrieves current active user's info (`Auth Required`)                                                          |
| GET    | /api/users/:id         | Retrieves user based on given id (`Auth Required`)                                                              |
| GET    | /api/posts/            | Retrieves a list of all posts (`Auth Required`)                                                                 |
| GET    | /api/posts/:id/user    | Retrieves all the Tweets by a specific user's ID (`Auth Required`)                                              |
| GET    | /api/posts/:id/        | Retrieves a post by id (`Auth Required`)                                                                        |
| GET    | /api/topics/           | Retrieves a list of all topics (`Auth Required`)                                                                |
| GET    | /api/topics/:id        | Retrieves a topic by id (`Auth Required`)                                                                       |
| GET    | /api/topics/:id/user   | Retrieves all topics of a specific user(`Auth Required`)                                                        |
| PUT    | /api/users/:id         | Updates a user in the local database (`Auth Required`) (`Admin role required`)                                  |
| PUT    | /api/posts/:id         | Updates a Tweet in our database without posting to Twitter (`Auth Required`)                                    |
| PUT    | /api/posts/:id/twitter | Updates a Tweet's contents and posts it to Twitter (`AuthRequired`)                                             |
| PUT    | /api/topics/:id        | Updates a topic (`Auth Required`)                                                                               |
| DELETE | /api/users/:id         | Delete user from local and Okta database (`Auth Required`)                                                      |
| DELETE | /api/users/:id/local   | Delete user locally only (`Auth Required`)(`Admin role required`)                                               |
| DELETE | /api/posts/:id         | Delete and cancel a scheduled Tweet from database (`Auth Required`)                                             |
| DELETE | /api/posts/:id/local   | Delete a Tweet from the database only (`Auth Required`)                                                         |
| DELETE | /api/topics/:id        | Delete a topic, it will delete all cards associated (`Auth Required`)                                           |

**Endpoint Specifics -**

# POST # /api/auth/register

<https://api.so-me.net/api/auth/register>

#### ### --- register account in Both OKTA and in the Database

## Email: _Required/Unique_ | Password: _Required_ | role: \_Not Required_defaults to user

```
{
"email": "test@test.com"
"password": "",
"role": user
}
```

# POST # /api/auth/login

<https://api.so-me.net/api/auth/login>

#### ### --- login to account -- get Token

## Email: _Required/Unique_ | Password: _Required_

**Store JWT Token**  
Store as: localStorage.setItem('token', res.data.token)

`--Authorization is checked via headers when accessing PrivateRoute--`

```
{
"email": "test@test.com"
"password": ""
}
```

# POST # /api/users/:id/callback

<https://api.so-me.net/api/auth/:id/callback>

**Authorization Required**

#### ### -- Sends Oauth id to Okta for secure storage

### This is set up by Front-end using QueryString parse npm package

```
  {
  parse: {
   Oauth_token: parsed_data.oauth_token,
  Oauth_secret: parsed_data.oauth_token_secret,
  oauth_verifier: req.body.parse.oauth_verifier
  },
 location: current URL Location
  }


```

# POST # /api/auth/dsteam

<https://api.so-me.net/api/auth/dsteam>

**Authorization Required**

#### ### -- Creates a new user login for DS team to secure routes between web BE and DS flask

```
{
  "email":"ds10@lasersharks.com"
  "password": ""
}
```

# POST # /api/posts/:id/user

<https://api.so-me.net/api/posts/:id/user>

**Authorization Required**

#### ### -- Submits a Tweet to DS for an optimal time and adds it to a user profile

> note Requires an ID created by Front-end , doesn't auto increment ID

```
 {
  id: '44353',
  post_text: 'Hello World!'
}
```

# POST # /api/topics/:id/user

<https://api.so-me.net/api/topics/:id/user>

**Authorization Required**

#### ### -- Creates a new topic which stores cards for the front end

> note Requires an ID created by Front-end , doesn't auto increment ID

```
{
"id": "",
"title": "Drafts",
}
```

# POST # /api/posts/:id/postnow

<https://api.so-me.net/api/posts/:id/postnow>

**Authorization Required**

#### ### -- Posts a Tweet to Twitter immediately without scheduling or getting DS input

```
 {
  id: '44353',
  post_text: 'Hello World!'
}
```

# GET # /api/auth/:id/oauth

<https://api.so-me.net/api/auth/:id/oauth>

**Authorization Required**

#### ### -- Retrieves Twitter URL needed to activate Oauth process, front-end will redirect user to this url

```
"https://api.twitter.com/oauth/authorize?oauth_token="
```

# GET # /api/posts/:id/userInfo

<https://api.so-me.net/api/posts/:id/userInfo>

**Authorization Required**

#### ### -- Retrieves a user's Twitter Information

```
 {
      "screen_name": "DunderMiffler45",
      "total_followers": 2,
      "total_following": 1287,
      "total_post": 754,
      "profile_img": "https://propic.img.url.whatever.png",
      "location": "Scranton, PA",
      "name": "Michael Gary Scott",
}
```

# GET # /api/auth/userStream

<https://api.so-me.net/api/auth/userStream>

**Authorization Required**

#### ### -- Retrieves a user's Twitter Stream_Data Information

```
{
    "stream_data": [
        {
            "created_at": "Tue Apr 28 20:17:05 +0000 2020",
            "id": 1255229569751228400,
            "id_str": "1255229569751228418",
            "text": "The 2020 Olympics, which have been postponed because of the coronavirus pandemic, could still be canceled if the ou… https://t.co/HlNtksxfmo",
            "truncated": true,
            "entities": {
                "hashtags": [],
                "symbols": [],
                "user_mentions": [],
                "urls": [
                    {
                        "url": "https://t.co/HlNtksxfmo",
                        "expanded_url": "https://twitter.com/i/web/status/1255229569751228418",
                        "display_url": "twitter.com/i/web/status/1…",
                        "indices": [
                            117,
                            140
                        ]
                    }
                ]
            },
            "source": "<a href=\"http://www.socialflow.com\" rel=\"nofollow\">SocialFlow</a>",
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "user": {
                "id": 14173315,
                "id_str": "14173315",
                "name": "NBC News",
                "screen_name": "NBCNews",
                "location": "New York, NY",
                "description": "#Coronavirus updates: https://t.co/jDVrrt2hNZ",
                "url": "https://t.co/Z73is4fJ3x",
                "entities": {
                    "url": {
                        "urls": [
                            {
                                "url": "https://t.co/Z73is4fJ3x",
                                "expanded_url": "http://NBCNews.com",
                                "display_url": "NBCNews.com",
                                "indices": [
                                    0,
                                    23
                                ]
                            }
                        ]
                    },
                    "description": {
                        "urls": [
                            {
                                "url": "https://t.co/jDVrrt2hNZ",
                                "expanded_url": "http://nbcnews.com/health/coronavirus",
                                "display_url": "nbcnews.com/health/coronav…",
                                "indices": [
                                    22,
                                    45
                                ]
                            }
                        ]
                    }
                },
                "protected": false,
                "followers_count": 7546472,
                "friends_count": 1823,
                "listed_count": 44857,
                "created_at": "Tue Mar 18 23:19:17 +0000 2008",
                "favourites_count": 788,
                "utc_offset": null,
                "time_zone": null,
                "geo_enabled": true,
                "verified": true,
                "statuses_count": 255208,
                "lang": null,
                "contributors_enabled": false,
                "is_translator": false,
                "is_translation_enabled": false,
                "profile_background_color": "062131",
                "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
                "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
                "profile_background_tile": true,
                "profile_image_url": "http://pbs.twimg.com/profile_images/1108426393287868423/CyLn5GVQ_normal.png",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/1108426393287868423/CyLn5GVQ_normal.png",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/14173315/1583954614",
                "profile_link_color": "5172A0",
                "profile_sidebar_border_color": "FFFFFF",
                "profile_sidebar_fill_color": "FFFFFF",
                "profile_text_color": "000000",
                "profile_use_background_image": true,
                "has_extended_profile": false,
                "default_profile": false,
                "default_profile_image": false,
                "following": true,
                "follow_request_sent": false,
                "notifications": false,
                "translator_type": "none"
            },
            "geo": null,
            "coordinates": null,
            "place": null,
            "contributors": null,
            "is_quote_status": false,
            "retweet_count": 3,
            "favorite_count": 4,
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "possibly_sensitive_appealable": false,
            "lang": "en"
        },
}
```

# GET # /api/users

<https://api.so-me.net/api/users>

**Authorization Required**

#### ### -- Retrieves a list of all users information

```
[
    {
        "id": 30,
        "email": "test@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
    {
        "id": 31,
        "email": "jrivetest@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
]
```

# GET # /api/users/user

<https://api.so-me.net/api/users/user>

**Authorization Required**

#### ### -- Retrieves a list of current user information by decoding Token

```
{
    "subject": 30,
    "email": "test@test.com",
    "okta_userid": "",
    "role": "user",
    "iat": 1588079945,
    "exp": 1588166345
}
```

# GET # /api/users/:id

<https://api.so-me.net/api/users/:id>

**Authorization Required**

#### ### -- Retrieves user based on a given ID

```
    {
        "id": 12,
        "email": "test@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    }
```

# GET # /api/posts

<https://api.so-me.net/api/posts>

**Authorization Required**

#### ### -- Retrieves a list of all post information

```
[
    {
        "id": "card-a52bf45f-af51-4218-bb46-ff0d02142800",
        "user_id": 33,
        "post_text": "ssafasdf",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Mon Apr 27 2020 19:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Your Handle Here"
    },
    {
        "id": "1588039521219",
        "user_id": 30,
        "post_text": "Live tweet for lambda",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": null,
        "post_score": null,
        "screenname": null
    },
    {
        "id": "card-fd1bb0ac-564b-4573-aed4-26c86f64a495",
        "user_id": 30,
        "post_text": "Testing",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Tue Apr 28 2020 23:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Jrive204"
    },
]
```

# GET # /api/posts/:id/user

<https://api.so-me.net/api/posts/:id/user>

**Authorization Required**

#### ### -- Retrieves a list of posts of user based on the user id param

```
if :id = 30 ---- All posts from user with id=30 will be shown!!

[
    {
        "id": "card-a52bf45f-af51-4218-bb46-ff0d02142800",
        "user_id": 30,
        "post_text": "ssafasdf",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Mon Apr 27 2020 19:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Your Handle Here"
    },
    {
        "id": "1588039521219",
        "user_id": 30,
        "post_text": "Live tweet for lambda",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": null,
        "post_score": null,
        "screenname": null
    },
    {
        "id": "card-fd1bb0ac-564b-4573-aed4-26c86f64a495",
        "user_id": 30,
        "post_text": "Testing",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Tue Apr 28 2020 23:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Jrive204"
    },
]
```

# GET # /api/posts/:id/

<https://api.so-me.net/api/posts/:id>

**Authorization Required**

#### ### -- Retrieves a posts based on the post's ID

```
if :id = 1588039521219 ---- Post with id=1588039521219 will be shown!!

    {
        "id": "1588039521219",
        "user_id": 30,
        "post_text": "Live tweet for lambda",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": null,
        "post_score": null,
        "screenname": null
    },


```

# GET # /api/topics/

<https://api.so-me.net/api/topics>

**Authorization Required**

#### ### -- Retrieves a list of all topics

```
[
 {
        "id": "topic-6fe6a56f-ba36-46cb-b780-6ffb93f848bb topic-0",
        "title": "Drafts",
        "user_id": 32,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-8a41f1ab-4e75-4a8f-b95c-31decea57ce7 topic-0",
        "title": "Drafts",
        "user_id": 33,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\",\"date\":null}",
            "{\"content\":\"ssafasdf\",\"id\":\"card-a52bf45f-af51-4218-bb46-ff0d02142800\",\"date\":\"2020-04-28T19:30:00.000Z\",\"screenName\":\"Your Handle Here\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-5bcc2a2f-1d6e-4e69-a9f9-4ab3d77b12e5 topic-0",
        "title": "Drafts",
        "user_id": 34,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-00980213-e2f9-45d1-9fe3-25f74686159c topic-0",
        "title": "Drafts",
        "user_id": 35,
        "cards": [
            "{\"content\":\"schedule post 12:44\",\"id\":\"card-590ed280-d5aa-4514-853b-3d578e9ef396\",\"date\":\"2020-04-28T16:44:02.703Z\",\"screenName\":\"SoMe_Strategy\"}",
            "{\"content\":\" third idea\",\"id\":\"card-0e5e1948-98c7-47b8-8e8e-fed96a474820\",\"date\":null,\"screenName\":\"SoMe_Strategy\"}"
        ],
        "index": 0
    },
]
```

# GET # /api/topics/:id

<https://api.so-me.net/api/topics/:id>

**Authorization Required**

#### ### -- Retrieves a topic by id

```
 {
        "id": "topic-6fe6a56f-ba36-46cb-b780-6ffb93f848bb topic-0",
        "title": "Conspiracy Theories",
        "user_id": 42,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
}
```

# GET # /api/topics/:id/user

<https://api.so-me.net/api/topics/:id/user>

**Authorization Required**

#### ### -- Retrieves all topics of a specific user

```
if :id = 12 ---- All topics from user with id=12 will be shown!!

[
 {
        "id": "topic-6fe6a56f-ba36-46cb-b780-6ffb93f848bb topic-0",
        "title": "Drafts",
        "user_id": 12,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-8a41f1ab-4e75-4a8f-b95c-31decea57ce7 topic-0",
        "title": "Drafts",
        "user_id": 12,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\",\"date\":null}",
            "{\"content\":\"ssafasdf\",\"id\":\"card-a52bf45f-af51-4218-bb46-ff0d02142800\",\"date\":\"2020-04-28T19:30:00.000Z\",\"screenName\":\"Your Handle Here\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-5bcc2a2f-1d6e-4e69-a9f9-4ab3d77b12e5 topic-0",
        "title": "Drafts",
        "user_id": 12,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-00980213-e2f9-45d1-9fe3-25f74686159c topic-0",
        "title": "Drafts",
        "user_id": 12,
        "cards": [
            "{\"content\":\"schedule post 12:44\",\"id\":\"card-590ed280-d5aa-4514-853b-3d578e9ef396\",\"date\":\"2020-04-28T16:44:02.703Z\",\"screenName\":\"SoMe_Strategy\"}",
            "{\"content\":\" third idea\",\"id\":\"card-0e5e1948-98c7-47b8-8e8e-fed96a474820\",\"date\":null,\"screenName\":\"SoMe_Strategy\"}"
        ],
        "index": 0
    }
]
```

# PUT # /api/users/:id

<https://api.so-me.net/api/users/:id>

**Authorization Required** --- --- **_ADMIN ROLE REQUIRED_**

#### ### -- Update user based on a given ID

```
if :id = 12 ---- user  with id=12 will be updated!!
    {
        "email": "test@test33.com",
    }
```

# PUT # /api/posts/:id

<https://api.so-me.net/api/posts/:id>

**Authorization Required**

#### ### -- Update post based on a given ID

```
if :id = 1588039521219 ---- Post with id=1588039521219 will be updated!!

    {
        "post_text": "Live tweet for lambda update",
        "date": "2020-04-28T16:44:02.703Z",
        "screenname": "SoMe_Strategy"
    },
```

# PUT # /api/posts/:id/twitter

<https://api.so-me.net/api/posts/:id/twitter>

**Authorization Required**

#### ### -- Update post based on a given ID and then posts it to twitter based on date given, if no date is given it will post instantly

```
if :id = 1588039521219 ---- Post with id=1588039521219 will be updated!!

    {
        "post_text": "Live tweet for lambda update",
        "date": "2020-04-28T16:44:02.703Z",
        "screenname": "SoMe_Strategy"
    },
```

# PUT # /api/topics/:id

<https://api.so-me.net/api/topics/:id>

**Authorization Required**

#### ### -- Updates a topic which stores cards for the front end

> NOTE -- All topic cards are stored as JSON strings

```
if :id = topic-5d8c67ef-52cf-48d5-a4fd-64d2076904d5 ---- Topic with id= topic-5d8c67ef-52cf-48d5-a4fd-64d2076904d5 will be updated!!


{
"title": "Sports",
 "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
}
```

# DELETE # /api/users/:id

<https://api.so-me.net/api/users/:id>

**Authorization Required** --- --- **_ADMIN ROLE REQUIRED_**

#### ### -- Delete user from local and Okta database

Returns all users in DB, verifying that specified one was deleted.

```
  [
    {
        "id": 30,
        "email": "test@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
    {
        "id": 31,
        "email": "jrivetest@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
]
```

# DELETE # /api/users/:id/local

<https://api.so-me.net/api/users/:id/local>

**Authorization Required**

#### ### -- Delete user locally only

Returns all users in DB, verifying that specified one was deleted.

```
  [
    {
        "id": 30,
        "email": "test@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
    {
        "id": 31,
        "email": "jrivetest@test.com",
        "password": "",
        "okta_userid": "",
        "role": "user"
    },
]
```

# DELETE # /api/posts/:id/

<https://api.so-me.net/api/posts/:id>

**Authorization Required**

#### ### -- Delete and cancels a scheduled Tweet from database

Returns all posts in DB, verifying that specified one was deleted.

```
[
    {
        "id": "card-a52bf45f-af51-4218-bb46-ff0d02142800",
        "user_id": 33,
        "post_text": "ssafasdf",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Mon Apr 27 2020 19:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Your Handle Here"
    },
    {
        "id": "1588039521219",
        "user_id": 30,
        "post_text": "Live tweet for lambda",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": null,
        "post_score": null,
        "screenname": null
    },
]
```

# DELETE # /api/posts/:id/local

<https://api.so-me.net/api/posts/:id/local>

**Authorization Required**

#### ### -- Delete a post locally only, will not cancel the Tweet if it is scheduled

Returns all posts in DB, verifying that specified one was deleted.

```
[
    {
        "id": "card-a52bf45f-af51-4218-bb46-ff0d02142800",
        "user_id": 33,
        "post_text": "ssafasdf",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": "Mon Apr 27 2020 19:30:00 UTC+0000",
        "post_score": null,
        "screenname": "Your Handle Here"
    },
    {
        "id": "1588039521219",
        "user_id": 30,
        "post_text": "Live tweet for lambda",
        "completed": false,
        "date": null,
        "tz": null,
        "optimal_time": null,
        "post_score": null,
        "screenname": null
    },
]
```

# DELETE # /api/topics/:id/

<https://api.so-me.net/api/topics/:id>

**Authorization Required**

#### ### -- Delete a Topic

Returns a topics in DB based on ID provided

```
if :id = topic-5d8c67ef-52cf-48d5-a4fd-64d2076904d5 ---- Topic with id= topic-5d8c67ef-52cf-48d5-a4fd-64d2076904d5 will be Deleted!!

All remaining topics will be returned after deleted topic is gone

  [
 {
        "id": "topic-6fe6a56f-ba36-46cb-b780-6ffb93f848bb topic-0",
        "title": "Drafts",
        "user_id": 32,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\"}"
        ],
        "index": 0
    },
    {
        "id": "topic-8a41f1ab-4e75-4a8f-b95c-31decea57ce7 topic-0",
        "title": "Drafts",
        "user_id": 33,
        "cards": [
            "{\"id\":\"card-0\",\"content\":\"This is an example of a post that you could draft. Feel free to express yourself!\",\"date\":null}",
            "{\"content\":\"ssafasdf\",\"id\":\"card-a52bf45f-af51-4218-bb46-ff0d02142800\",\"date\":\"2020-04-28T19:30:00.000Z"\",\"screenName\":\"Your Handle Here\"}"
        ],
        "index": 0
    },
]
```

## Actions

Dynamic helper model - works with `users` and `posts` tables
<br>

Located in `helper.js`

`find(table, filter)` -> Query the db(`${table}`) by a `filter`
<br>

`add(table, payload)` -> Insert `payload` into db(`${table}`)
<br>

`remove(table, id)` -> Remove entry with `id` from db(`${table}`)
<br>

`update(table, payload, id)` -> Update entry with `id` in db(`${table}`)
<br>

`findByID(table, id)` -> Query the db(`${table}`) by a `filter`

<br>
<br>

Model functions unique to the `topics` table
<br>

Located in `topics-model.js`

`getTopicCards()` -> Get a list of tweet cards under a specific topic - formats from JSON to array of objects for front end

<br>
<br>

## Environment Variables

JWT_SECRETS=""
<br>
NODE_ENV='development'
<br>
EMAIL_TEST='test@test.com'
<br>
PASSWORD_TEST='test'
<br>
CONSUMER_KEY=""
<br>
CONSUMER_SECRET=""
<br>
OKTA_AUTH=""
<br>
OKTA_DOMAIN=
<br>
DB_USER=""
<br>
DB_PW=""
<br>
DB_DB=""
<br>
DB_HOST=""
<br>

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/social-media-strategy-fe/blob/master/README.md) for details on the frontend of our project.
