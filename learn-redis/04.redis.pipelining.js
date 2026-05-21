const { client } = require("./01.redis.basics");


/**
 * Redis pipelining is a performance optimization technique where multiple commands are sent to Redis together in a single
 * network round trip instead of waiting for a response after each command. Redis still executes the commands sequentially 
 * one by one, but commands from other clients can interleave between them because a pipeline does not provide atomicity or 
 * isolation. Pipelines are mainly used to reduce network overhead and improve throughput for bulk operations like caching, 
 * analytics, or batch inserts.
 */
async function main() {
    try {
        await client.connect();

        const pipeline = client.multi()
        Array.from([1, 2, 3, 4]).forEach(item => {
            pipeline.set(`user:${item}`, item);
        });

        const pipelineResponse = await pipeline.exec(); // performs bulk inserts.
        console.log(pipelineResponse);
    } catch (error) {
        console.log(error);
        console.log("[ERROR]: error in redis client");
    } finally {
        await client.quit();
    }
};


main();