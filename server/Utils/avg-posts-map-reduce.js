const User = require('../Models/User')

const getAveragePostAmount = async (req, res) => {
    let sent = false
    await User.find(function(error, result){
        if(error || !result) {
            res.status(400).send("Error or no results")
            sent = true;
        }
        if(!result && !sent) {
            res.status(400).send("Error or no results")
            sent = true;
        }
        const postLengths = result.map(item => item.allPostIDs.length);
        result = postLengths.reduce((a, b) => a + b, 0) / postLengths.length;
        if(!sent) {
            res.status(200).send("The average amount of posts per user in our app is: " + result.toPrecision(3))
            sent = true;
        }
    }).clone();
}

module.exports = {getAveragePostAmount};