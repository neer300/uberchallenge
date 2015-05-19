#Description
  As part of coding challenge from Uber, this web app uses 511 Real Time Transit service to fetch departure times for public transport stops.

##Focus
  This solution focusses more on backend, with a very minimal UI.

##Technical choices
  * This is my first attempt with Backbone.JS and Node.JS. My skillset is more on backend-track. Not surprisingly I struggled a lot with Backbone.JS.
  * Architecture 
    1. The web app is RESTFul. All responses to queries are in JSON format. The client is built in BackboneJS which maintains the collections of various agency names, corresponding routes, directions and stop information. BackboneJS views have 'itemselected' events which trigger call to server to update the individual models
      * Collection
          1.  AgencyCollection
          2.  RouteCollection
          3.  DirectionCollection
          4.  StopCollection
      * Model
          1.  BaseModel - Model with (code, name) schema. All information like transit agencies, routes, directions and stops are modeled as (code, name) pair. 'name' property is used for UI. 'code' property is used in RESTFul query lookups.
    2. Though RESTFul in a sense, the client doesn't represent the entire state of entire (agency, route, direction, stops) information. At any given point, State Representation is maintained just for a particular agency which user is interested in.
    3. I didn't feel the need to introduce a DB for the backend. The state of various agencies and route information can be collected on application startup and kept in memory. As no new state is created or deleted or no user data is generated, DB wasn't desired.
    4. As and when users request departure time information, this response is stored and valid for 30 sec. If the time of incoming request and last updated property of that stop is more than 30 sec, a new call is made to the API. With this feature, the number of calls to 511 API service significantly reduce and response time will improve.
  * Trade off -
    * Though it is unlikely that new routes or agencies are added all the time, a periodic check for looking for new agencies and their routes will help. This app just starts up and maintains whatever transport agency information it could gather and serves with necessary /departures API.
    * The conscious choice of not backing up with a DB was about avoiding the hassles of consistency. However, the current web app will need special routine which periodically checks for any changes to list of agencies and routing information.
  * Things I could do differently
    * I had to invest a lot of time learning BackboneJS. I think simple plain JS would have helped me deliver quickly as I wanted to focus on backend.
    * Client requires a refresh feature. BackboneJS StopCollection is missing the logic to periodically request for fresh departure information.
    * I had some creative ideas for the backend which I couldn't finish because of lack of time.
      * Public Transit Planner
        Public transit commuter often have to use multiple transport media to reach their destination. Often, in their plan they encounter a lot of wait times as the next train/bus doesn't arrive immediately. The idea I had was for following use cases.
          1. User doesn't mind biking or walking
              * As the backend knows the routes and the estimated departure times, it can take user's itinerary as input and recommend new routes such that at any point, user is not wasting time waiting for the next bus.
          2. User wants to explore places
              * Using Facebook profile and identifying likes, this service can possibly give ideas about new books stores/ coffee shops/ gift shops so that user can spend quality time while waiting for the next bus.
          3. User who is in no hurry, doesn't mind missing the next departing transit
              * Similar to number 2. serving can recommend more places to explore.
          4. Find buddies
              * Find out if there are other people user knows going on same route. May be share an Uber instead!

###Profile
  * Resume - https://drive.google.com/open?id=0B2dfSnd_zyvPb2F6c3dUY0NqaWs&authuser=1
  * LinkedIn - https://www.linkedin.com/in/neerajsjoshi

###Hosted here - http://secure-depths-2215.herokuapp.com/

####Steps
  * Run - ```npm start```
  * Unit Test - ```npm test```
