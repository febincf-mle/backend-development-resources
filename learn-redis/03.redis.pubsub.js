const { client } = require("./01.redis.basics");


async function main() {
    try {
        await client.connect();

        const subscriber = await client.duplicate();
        await subscriber.connect();
        await subscriber.subscribe("alerts", (message, channel) => {
            console.log(`received sub ${channel} and the message is ${message}`);
        })
    } catch (error) {
        console.log(error);
        console.log("[ERROR]: error in redis client");
    } finally {
        await client.quit();
    }
};


main();