wotf-cyoa
=========
Wizards of the Future: Code Your Own Adventure

Come uncover the secrets of the magical craft of programming. You will explore a
text adventure game written in the Ruby programming language. While you play
through the story, you will empower your actions with simple program commands.
As you begin, you will soon find that the story leads to a dead-end; at which
point, you will have to leap into the source code and code your way to your own
ending. Or a new beginning! No prior programming experience is necessary.

setup
-----

Install [Node.js](http://nodejs.org)

This app uses the [Brunch](http://brunch.io) build tool. Install it globally via
[npm](https://www.npmjs.org/):

    npm install -g brunch

Then install the other dependencies with

    npm install

To run the Websockets server that executes the game:

    node server.js

To run the frontend:

    brunch w -s

Navigate to [localhost:3333](http://localhost:3333) to see the running app.
While `brunch w -s` is running, changes to the frontend of the application
will happen live (browser will reload for HTML and JS pages, CSS will reapply
for CSS changes). Changes to `server.js` require a restart. Simply `Ctrl+C` the
`node server.js` process and run it again.
