# wfh3_backend
a node implementation of the wfh api


#endpoints

| path       |  method | payload | details |
|------------|---------|---------|---------|
|   /workers |   GET   |         | get all workers, used by email cron and tv display |
|   /workers |   POST   |   `{"name":"John Snow", "email":"john.snow@pebblecode.com", status:"Sick" }`  | get all workers, used by email cron and tv display |
| /workers   | PUT | `{"email":"john.snow@pebblecode.com", "status":"Holiday"}` | Update status for worker|
