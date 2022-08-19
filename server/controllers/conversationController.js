const Conversation = require("../Models/Conversation")
const User = require("../Models/User")

//new conv
const newConversation = async (req,res) => {
    let sent = false;
    try{
        const {senderEmail, receiverEmail} = req.body;
        if(!senderEmail || !receiverEmail || senderEmail === receiverEmail){
            res.status(400).send("Please provide both sender and receiver emails");
            sent = true;
        }
        let response = await User.findOne({email: senderEmail}, async function(errS, resultS){
            if(errS || !resultS){
                if(!sent) {
                    res.status(400).send("Sender email not found or error occurred.");
                    sent = true;
                }
            }
            else{
                await User.findOne({email: receiverEmail}, function (errR, resultR){
                    if(errR || !resultR){
                        if(!sent) {
                            res.status(400).send("Receiver email not found or error occurred.");
                            sent = true;
                        }
                    }
                });
            }
        });

        response = await Conversation.findOne({$or: [{members: [senderEmail, receiverEmail]}, {members: [receiverEmail, senderEmail]}]}, function(error, result){
            if(result){
                if(!sent) {
                    res.status(400).send("These members already have an existing conversation.");
                    sent = true;
                }
            }
        });

        const conversation = new Conversation({
            members: [req.body.senderEmail, req.body.receiverEmail]
        });
        await conversation.save()
        res.status(200).json(conversation)
    }catch(err){
        res.status(500).json(err)
    }
}

//get all conv of user
const getAllConversation = async (req, res) => {
    try{
        const conversation = await Conversation.find({
            members: { $in:[req.params.userEmail]}
        }).clone().then(conversations => res.status(200).json(conversations));
    }catch(err){
        res.status(500).json(err)
    }
}

const getSpecificConversationBuUsers = async (req, res) => {
    try{
        const userEmail1 = req.query.userEmail1
        const userEmail2 = req.query.userEmail2
        await Conversation.findOne({
            $and: [
                {members: { $in:[userEmail1]}},
                {members: { $in:[userEmail2]}}
            ]
        }).clone().then(conversations => res.status(200).json(conversations));
    }catch(err){
        res.status(500).json(err)
    }
}



module.exports = {newConversation, getAllConversation, getSpecificConversationBuUsers}