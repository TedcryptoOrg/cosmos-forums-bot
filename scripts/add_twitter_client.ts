import * as readline from "readline";
import * as sqlite3 from "sqlite3";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const util = require('util');
const question = util.promisify(rl.question).bind(rl);

// database is located in the root of the project
const db = new sqlite3.Database('./data/rss_topics.sqlite');

async function main(): Promise<void> {
    const name = await question('Enter name: ');
    const consumerKey = await question('Enter consumer key: ');
    const consumerSecret = await question('Enter consumer secret: ');
    const accessToken = await question('Enter access token: ');
    const accessTokenSecret = await question('Enter access token secret: ');
    const bearerToken = await question('Enter bearer token: ');

    db.run(`INSERT INTO twitter_clients (name, consumer_key, consumer_secret, access_token, access_token_secret, bearer_token)
                    VALUES (?, ?, ?, ?, ?, ?)`, [name, consumerKey, consumerSecret, accessToken, accessTokenSecret, bearerToken],
        function(err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Row inserted with ID ${this.lastID}`);
            }
            rl.close();
        });
}

Promise.resolve(main()).catch(console.error);