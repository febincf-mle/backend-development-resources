const { client } = require("./01.redis.basics");



// array datastructure in redis: 
// methods: LPUSH, RPUSH, LRANGE, LPOP, RPOP
const arrayDatastructureOps = async () => {
    const lpushResponse = await client.lPush("users", ["user:001", "user:002"]);
    const lRangeResponse = await client.lRange("users", 0, -1);
    const lpopResponse = await client.lPop("users");
    const rpopResponse = await client.rPop("users");
    const lRangeResponse2 = await client.lRange("users", 0, -1);

    console.log(lpushResponse, lRangeResponse, lpopResponse, rpopResponse, lRangeResponse2);
}

// SET datastructure in redis.
// methods: SADD, SREMOVE
const setDatastructureOps = async () => {
    const saddResponse = await client.sAdd("user:01:perm", ["perm01", "perm02", "perm03"]);
    const sremResposne = await client.sRem("user:01:perm", ["perm02"]);
    const smembersResponse = await client.sMembers("user:01:perm");
    const ismemberResponse = await client.sIsMember("user:01:perm", "perm01")

    console.log(saddResponse, sremResposne, smembersResponse, ismemberResponse);
}

// Sorted sets in redis.
// methods: ZADD, ZRANGE, ZRANK, ZREM
const sortedSetDatastructureOps = async () => {
    const addResponse = await client.zAdd("leaderboard", [
        {
            score: 90,
            value: "Febin",
        },
        {
            score: 80,
            value: "Jeslin",
        }
    ]);

    const rangeResponse = await client.zRange("leaderboard", 0, -1);
    const rankResponse = await client.zRank("leaderboard", "Febin");

    console.log(addResponse, rangeResponse, rankResponse);
}


// Hashed set in redis
// methods: HSET, HGET
const hashedSetDatastructureOps = async () => {
    const hsetAddResponse = await client.hSet("user:001", {
        name: "febin",
        age: 30,
        gender: "male",
    });

    const hsetGetResponse = await client.hGet("user:001", "name");
    const hsetGetAllResponse = await client.hGetAll("user:001");

    console.log(hsetAddResponse, hsetGetResponse, hsetGetAllResponse);
}

async function main() {
    try {
        await client.connect();
        await arrayDatastructureOps();
        await setDatastructureOps();
        await sortedSetDatastructureOps();
        await hashedSetDatastructureOps();
        console.log("[INFO]: redis client connected");
    } catch (error) {
        console.log(error)
        console.log("[ERROR]: redis client error");
    } finally {
        await client.quit();
    }
}

main();