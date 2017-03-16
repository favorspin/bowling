# Bowling API

## Setup

### Dependencies
- Node.js 6.6.0
- Mongo DB 3.2.9

### Config
Update `app/config/env/development.js` with your db connction string. An example is provided.

For production use `app/config/env/production.js`

### Install
`$ npm install`

### Run
`$ node server`

## API
A collection of Postman reqeusts is stored in the root directory
`Bowling.postman_collection.json`

## Considerations

### Data Storage
Some parts of the data storage model are unnecessary or redundant (specifically, `display_score`, `roll_count` and `total_score`), however, this can allow more flexibility where querying the data model for future analysis.

i.e. Games that contain spares can be queried either by searching the display_score array for cells containing `'/'` or multi-turn frames that score 10 points. Similary, analysis based on the number of rolls needed to complete a game, can be done using `roll_count` rather `rolls.length`. Final scores of a game can also be found by querying `total_score` instead of the last value in `score`.

Rolls are also stored so that a game can be rebuilt from scratch, or in future implementations, an array of rolls (partial or full game) could be run through the API (no current route exists), scored and the game can be continued or completed.

### Future Development
Several improvements to this API can be made:

- Scoring in this state is fairly brute-force. While it is accurate, there are more effective ways (specifically, recursion through the use of linked lists) that could likely make the alogorithm more eloquent.

- Currently, the API can only keep track of a number of pins per roll. Future versions should take into account which pins were hit, to properly track splits, and fuel more interactive displays on a front end.

- There is no current functionality to edit an existing roll in a game.

- The data model supports soft deletes with a deleted timestamp. The current DELETE route will only hard delete a game. The addition of additional parameters to the body of the request and handling of those parameters will add the optionality to the request.

- Future versions should include multi-player games.