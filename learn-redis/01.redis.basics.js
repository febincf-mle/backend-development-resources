const redis = require("redis");

// Before creating the client make sure you have 
// redis server running locally, use docker docker run redis:latest
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});


// event listener from the client
client.on('error', (error) => {
    console.log("[ERROR]: redis client error occured")
})



// Basic operation with redis
const basicOperations = async () => {
    // string based operations
    const getActionResponse = await client.get("game");
    const setActionResponse = await client.set("name", "jeslin");
    const deleteActionResponse = await client.del("name");

    // numeric operations.
    const numericValue = await client.set("count", 0);
    const incrementResponse = await client.incr("count")
    const incrByResponse = await client.incrBy("count", 10)
    const incrByFloatResponse = await client.incrByFloat("count", 18.9)

    // exploring the options object.
    const withOptionsResponse = await client.set("game", "days gone", {
        expiration: {
            type: "EX",
            value: 10,
        },
        condition: "NX",
    })

    console.log(getActionResponse, setActionResponse, deleteActionResponse);
    console.log(numericValue, incrementResponse, incrByResponse, incrByFloatResponse);
    console.log(withOptionsResponse);
}


const main = async () => {
    try {
        await client.connect();
        await basicOperations();

    } catch (error) {
        console.log(error);
        console.log("[ERROR]: redis client connection error");
    } finally {
        await client.quit();
    }
}

module.exports = {
    client
}