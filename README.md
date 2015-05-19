#Description
  As part of coding challenge from Uber, this web app uses 511 Real Time Transit service tpo fetch departure times for public transport stops.

##Focus
  This solution focusses more on backend, with a very minimal UI.

##Technical choices
  * This is my first attempt with Backbone.JS and Node.JS. My skillset is more on backend-track. Not surprisingly I struggled a lot with Backbone.JS.
  * Architecture 
     ** The web app is RESTFul. All responses to queries are in JSON format. The client is built in BackboneJS which maintains the collections of various agency names, corresponding routes, directions and stop information. BackboneJS views have 'itemselected' events which trigger call to server to update the individual models
        ***Collection
            AgencyCollection
            RouteCollection
            DirectionCollection
            StopCollection
        ***Model
            BaseModel - Model with (code, name) schema. All information like transit agencies, routes, directions and stops are modeled as (code, name) pair. 'name' property is used for UI. 'code' property is used in RESTFul query lookups.
    ** Though RESTFul in a sense, the client doesn't represent the entire state of all (agency, route, direction, stops) state. At any given point, State Representation is maintained just for a particular agency which user is interested in.
     ** I didn't feel the need to introduce a DB for the backend. The state of various agencies and route information can be collected on application startup and kept in memory. As no new state is created or deleted or no user data is generated, DB wasn't desired.
  * Trade off -
    * Though it is unlikely that new routes or agencies are added all the time, a periodic check for looking for new agencies and their routes will help. This app just starts up and maintains whatever transport agency information it could gather and serves with necessary /departures API.
