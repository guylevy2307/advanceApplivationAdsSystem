//Import library
const createCountMinSketch = require("count-min-sketch")
const {readUsers} = require("../Controllers/userController");

//Create data structure
let sketch = createCountMinSketch()

//Increment counters

const getPopularNames = async(isFirstName) => {
    let allNames = [];
    let allUsers = await readUsers(null, null);
    if(!allUsers){
        console.log("No users in DB")
        return
    }
    for(let i =0; i < allUsers.length; i++)
    {
        let name = null
        if(isFirstName)
            name = allUsers[i].firstName;
        else name = allUsers[i].lastName;
        sketch.update(name, sketch.query(name) + 1);
        if(!allNames.includes(name))
            allNames.push(name);
    }

//Query results
    // get top 3 names and counts
    let max = 0, maxName = null;
    let secondMax = 0, secondMaxName = null;
    let thirdMax = 0, thirdMaxName = null;
    for(let i = 0; i < allNames.length; i++){
        let key = allNames[i]
        let frequency = sketch.query(key);
        if(frequency > max){
            thirdMax = secondMax;
            thirdMaxName = secondMaxName;
            secondMax = max;
            secondMaxName = maxName;
            max = frequency;
            maxName = key;
        }
        else if(frequency > secondMax){
            thirdMax = secondMax;
            thirdMaxName = secondMaxName;
            secondMax = frequency;
            secondMaxName = key;
        }
        else if(frequency > thirdMax){
            thirdMax = frequency;
            thirdMaxName = key;
        }
    }
    console.log("first place: " + maxName + " with " + max + " appearances")
    console.log("second place: " + secondMaxName + " with " + secondMax + " appearances")
    console.log("third place: " + thirdMaxName + " with " + thirdMax + " appearances")
    return {firstPlace: maxName,
            firstFrequency: max,
            secondPlace: secondMaxName,
            secondFrequency: secondMax,
            thirdPlace: thirdMaxName,
            thirdFrequency: thirdMax}
}

module.exports = {getPopularNames}