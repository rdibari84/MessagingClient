# MessagingApp
This project is an messaging application written in angular typescript. It uses twitter bootstrap for design, angular routing for navigation and `httpclient`& `socket.io` for its communication with the API. The API is a separate project, located at https://github.com/rdibari84/MessagingServer. This project was generated with using angular cli version 8.3.21.

## To Run
PreReqs: 
- Docker and docker-compose are installed
- The associated api is also running

`docker-compose up -d --build`
- navigate to http://localhost:4200

## To Stop
`docker-compose down`

## Hard Coded Users:
```
username: sheepppl, password: sheepppl
username: corgibutt, password: corgibutt
username: nightowl, password: nightowl
```

## To Use
1. (tab1) Open new tab, navigate to http://localhost:4200 & login as `sheepppl`
2. (tab2) Open new tab, navigate to http://localhost:4200 & login as `corgibutt`
3. (tab2) Click "Message" `sheepppl`
4. (tab1) Click "Message" `corgibutt`
5. Start messaging

Other things to note:
1. Refresh still displays messages
2. Navigating back to home and then again to messages shows message history
3. Logout redirects to login and removes username from sessionStorage
2. (tab3) Open new tab, navigate to http://localhost:4200 & login as `nightowl` and notice list of online users update

## Design Considerations
- Chose Angular because it's a standard framework with lots of resources and I have past experience using it
- Uses a REST call for login and websockets for everything else to enable real time updates
- The websocket connection is instantiated once, on construction of the apiService
- Uses a sessionStore to save login information on the browser

## Limitations
- This application only supports messaging one other user at a time
- There is no notification for when a new message is sent
- A user must be on the "message" page to see the messages
- The api limits the number of messages it sends back; need to rethink 
- Styling needs to be fixed
- No unit tests; need to go back and write
- Update templates to bind to the observables using an async pipe instead of subscribing and managing subscriptions manually
- Investiage using Subjects. They're both observables and observers and can push out new values as they recieve them from the websocket

## Description Of Functionality
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
