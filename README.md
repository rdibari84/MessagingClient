# MessagingApp
This project is an angular typescript application.
It uses twitter bootstrap for design, angular routing for navigation and httpclient/ socket.io for its communication with the API.

The API is a separate project, located at `git clone https://github.com/rdibari84/MessagingServer`

The Application contains a login page, home page and a messaging page. 
It additionally defines a logout url and an alerting service and api service.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## To Run
PreReqs: 
- Docker and docker-compose are installed
- The associated api is also running at http://localhost:3000

`docker-compose up -d --build`
navigate to http://localhost:4200

## To Stop
`docker-compose down`

## Hard Coded Users:
username: sheepppl, password: sheepppl
username: corgibutt, password: corgibutt
username: nightowl, password: nightowl

## Design Considerations
- The websocket connection is instansiated on the construction of the apiService
- The application uses sessionStorage to save the username; allows the user to be known on page refresh
- The login page on successful login 
    - Saves a user to the sessionStore
    - "registers" a user, allowing the API to map a user to it's websocket connection
- The home page on init
    - Detects page refresh and re-registers the user since websocket connection is lost on page refresh
    - Fetches all "logged in" users to show who's available for messaging
- The message page on init
    - Detects page refresh and re-registers the user since websocket connection is lost on page refresh
    - Fetches message history between the to and from user 
    - Gets a sent message 
- The logout page
    - Calls the api to remove the user websocket connection
    - Removes the user from the session store
    - Navigates to the login page

## Limitations
- This application only supports messaging one other user at a time
- There is no notification for when a new message is sent
- Styling