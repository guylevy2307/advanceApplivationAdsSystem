const mongoose = require('mongoose');
const Post = require('../Models/Post');
const User = require("../Models/User");
const AhoCorasick = require("ahocorasick")
const {AddPostToUser, deletePostFromUser, getAllUserAddresses} = require("./userController");
//const {getPopularPostThemes} = require("../Utils/aho-corasick");

const readPosts = async (req,res) =>{
    try {
        await Post.find({isDeleted: false}, function (err, docs) {
            if (!req || !res) {
                console.log("here")
                if (err)
                    return null;
                return docs;
            } else if (err)
                res.status(400).json({message: err});
            else if (docs) {
                res.status(200).json(docs.reverse());
            } else return null;
        }).clone();
    }
    catch(e){
        console.log("Exception " + e + " occurred in readPosts")
        res.status(400).send("error")
        return null;
    }
}

const getPopularPostThemes = async(tag1, tag2, tag3) => {
    let keywords = [tag1,tag2,tag3]
    let ac = new AhoCorasick(keywords); // add whatever tags you want in here
    let allPosts = await readPosts(null, null)
    if(!allPosts){
        console.log(allPosts)
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
    console.log(result)
    for(let i in keywords){
        console.log("Amount of " + keywords[i] + " related posts: " + result[keywords[i]])
    }
    return result
}

const getTagsFrequencies = async(req, res) => {
    try{
        const result = await getPopularPostThemes(req.body.tag1, req.body.tag2, req.body.tag3);
        res.status(200).json(result);
    }
    catch(e) {
        console.log("Exception " + e + " occurred in getTagsFrequencies");
        res.status(400).send("error")
    }
}

const readCommentsByPost = async (req,res) => {
    try {
        let sent = false;
        const {postID} = req.params

        await Comment.find({postID: postID, isDeleted: false}, function (error, docs) {
            if (error || !docs)
                if (!sent) {
                    res.status(400).send("No comments on this post or error occurred.");
                    sent = true;
                } else {
                    if (!sent)
                        res.status(200).json(docs);
                }
        }).clone();
    }
    catch(e) {
        console.log("Exception " + e + " occurred in readCommentsByPost")
        res.status(400).send("error")
    }
}

const getPostById = async (req,res) => {
    let sent = false;
    try{
        const {id} = req.params;

        await Post.findById(id, function(error, result){
            if(error){
                if(!sent) {
                    res.status(404).send("Post not found.");
                    sent = true;
                }
            }
            if(!sent) {
                res.status(200).json(result);
                sent = true;
            }
        }).clone();
    }catch(err) {
        if(!sent) {
            res.status(404).json({error: err.message});
            sent = true;
        }
    }
}
//
// userEmail: {type: String, require: true},
// content: {type: String, require: false},
// image: {type: [{type: String}], default: []},
// creationDate: {type: String, require: true, default: Date.now().toString()},
// isDeleted: {type: Boolean, require: true, default: false},
// allCommentIDs: {type: [{type: String}], default: []}

const createPost = async (req,res) => {
    let sent = false;
    try {
        // validatePost(req.body.content, req.body.image)
        const {userEmail, content, image} = req.body
        let response = await User.findOne({email: userEmail, isDeleted: false}, function(error, docs){
            if(error || !docs) {
                res.status(400).send("No user with email " + userEmail + "exists.");
                sent = true;
            }
        }).clone();
        if(!content && !image && !sent) {
            res.status(400).send("No content nor image in this post.");
            sent = true;
        }
        const post = new Post({userEmail:userEmail, content:content, image:image});
        await post.save();
        response = await AddPostToUser({email: userEmail, postID: post.id});
        if(!sent)
            res.status(200).json(post);
    } catch (error) {
        if(!sent)
            res.status(404).json({ message:error });
    }
}

const deleteCommentFromPost = async (req) => {
    let succeeded = true;
    let allCommentIDs = null;
    try {
        let response = await Post.findById(req.postID, async function (error, docs) {
            if (error || !docs) {
                succeeded = false;
            } else allCommentIDs = docs.allCommentIDs;

            if (!succeeded)
                return false;
            let toRemove = req.commentID;
            allCommentIDs = allCommentIDs.filter(e => e !== toRemove)
            await Post.findByIdAndUpdate(req.postID, {allCommentIDs: allCommentIDs}, {new: true}, function (error, docs) {
                if (error) succeeded = false;
                console.log("Posts after removal: " + docs.allCommentIDs);
            }).clone();
        }).clone();

        return succeeded;
    }
    catch(e){
        console.log("Exception " + e + " occurred in deleteCommentFromPost");
        return false;
    }
}

const addCommentToPost = async (req) => {
    let succeeded = true;
    let allCommentsIDs = null;
    try {
        await Post.findById(req.postID, async function (error, docs) {
            if (error || !docs) {
                succeeded = false;
            }
            allCommentsIDs = docs.allCommentIDs;
            if (allCommentsIDs == null) allCommentsIDs = [];
            console.log(docs);
            if (!succeeded)
                return false;
            let newCommentId = req.commentID;
            allCommentsIDs.push(newCommentId);

            let result = await Post.findByIdAndUpdate(req.postID, {allCommentsIDs: allCommentsIDs}, {new: true}).clone();
            return result;
        }).clone();
    }
    catch(e){
        console.log("Exception " + e + " occurred in addCommentToPost");
        return false;
    }
}

const updatePost = async (req,res) => {
    try {
        let sent = false;
        const {id} = req.params;
        const {userEmail, content, image, allCommentIDs} = req.body;
        if (!id) {
            if (!sent) {
                res.status(404).send(`the id ${id} is not valid`);
                sent = true;
            }
        }
        let resDoc = {_id: id}
        let response = await User.findOne({email: userEmail, isDeleted: false}, function (error, docs) {
            if (error || !docs) {
                if (!sent) {
                    res.status(400).send("No user email with the email provided - " + userEmail);
                    sent = true;
                }

            }
        }).clone();
        resDoc.userEmail = userEmail
        if (content)
            resDoc.content = content
        if (image)
            resDoc.image = image
        if (allCommentIDs)
            resDoc.allCommentIDs = allCommentIDs
        await Post.findByIdAndUpdate(id, resDoc, {new: true}, function (error, docs) {
            if (error && !sent) {
                res.status(400).send("Error in post update: " + error);
                sent = true;
            }
            if (!sent)
                res.status(200).json(docs)
        }).clone();
    }
    catch(e) {
        console.log("Exception " + e + " occurred in updatePost")
        res.status(400).send("error")
    }
}

const deletePost = async (req,res) => {
    try {
        let sent = false;
        const {id} = req.params;
        await Post.findByIdAndUpdate(id, {isDeleted: true}, async function (error, result) {
            if (error && !sent) {
                res.status(400).send("Error while deleting post with ID " + id);
                sent = true;
            }
            if (result)
                await deletePostFromUser({email: result.userEmail, postID: result.id});
            if (!sent)
                res.status(200).send("Post deleted successfully.");
        }).clone();
    }
    catch(e) {
        console.log("Exception " + e + " occurred in deletePost")
        res.status(400).send("error")
    }
}

module.exports = {readPosts, createPost, updatePost, deletePost,getPostById, readCommentsByPost, addCommentToPost, deleteCommentFromPost, getTagsFrequencies};
