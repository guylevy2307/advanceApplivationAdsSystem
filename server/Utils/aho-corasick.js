//Import library
const AhoCorasick = require("ahocorasick")
const {readPosts} = require("../Controllers/postController");

//Create data structure
//Increment counters

const getPopularPostThemes = async(tag1, tag2, tag3) => {
    let ac = new AhoCorasick([tag1, tag2, tag3]); // add whatever tags you want in here
    let allPosts = await readPosts(null, null)
    if(!allPosts){
        console.log("No users in DB")
        return
    }
    let result = {}
    for(let i =0; i < allPosts.length; i++)
    {
        let content = allPosts[i].content
        let results = ac.search(content)
        for(let j = 0; j < results.length; j++)
        {
            let key = results[j][1][0];
            if(result.hasOwnProperty(key))
                result[key]++;
            else result[key] = 1;
        }
    }

    for(let key in Object.keys(result)){
        console.log("Amount of " + key + " related posts: " + result[key])
    }
    return result
}

module.exports = {getPopularPostThemes}