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

async function main() {
    try {
        await client.connect();
        await arrayDatastructureOps();
        await setDatastructureOps();
        console.log("[INFO]: redis client connected");
    } catch (error) {
        console.log(error)
        console.log("[ERROR]: redis client error");
    } finally {
        await client.quit();
    }
}

main();