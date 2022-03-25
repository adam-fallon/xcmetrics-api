# XCMetrics Dashboard API
API to pull data from XCMetrics Postgres DB.

## Setup
- Create a .env file containing;
```
PG_HOST='<FILL_ME_IN>'
PG_USER='<FILL_ME_IN>'
PG_DB='<FILL_ME_IN>'
PG_PASS='<FILL_ME_IN>'
PG_PORT='<FILL_ME_IN>'
```
- Run `npm install`
- Run `npm run start`

## Endpoints
- `/builds` - GET - Returns all builds from `builds` table. 
- `/builds-by-user` - POST - Returns all builds from `builds` table, pass `user_id` in POST body.
- `/averages` - GET - Returns average duration, grouped by `user_id`
