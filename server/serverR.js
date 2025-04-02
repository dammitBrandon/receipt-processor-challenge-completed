'use strict';

const app =  require('./config/express');

const server = app.listen(3000, () => {
    console.log('Express server listening on port 3000');
    server.setTimeout(3000);
});