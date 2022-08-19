const mongoose = require('mongoose');
const Comment = require('../Models/Comment');
const Post = require("../Models/Post");
const {addCommentToPost, deleteCommentFromPost} = require("../Controllers/postController");

const readComments = async (req,res) =>{
    let sent = false;
    try {
        const {postId} = req.params
        await Comment.find({postID: postId}, function(error, result){
            if(error || !result) {
                res.status(404).send("Didn't find comment or error occurred.");
                sent = true;
            }
            else res.status(200).json(result);
        }).clone();
    } catch (err) {
        if(!sent)
            res.status(404).json({error: err.message});
    }
}

const getCommentById = async (req,res) => {
    let sent = false;
    try{
        const {id} = req.params;
        await Comment.findOne({_id:id}, function(error, result){
            if(error || !result){
                if(!sent)
                    res.status(404).send("Didn't find message or error occurred.");
            }
            else res.status(200).json(result);
        }).clone();
    }catch(err) {
        if(!sent)
            res.status(404).json({error: err.message});
    }
}

const createComment = async (req,res) => {
    let sent = false;
    try {
        const {postID, content} = req.body
        await Post.findById(postID, function(error, result){
            if(error || !result) {
                res.status(404).send("Error with finding post for comment creation.");
                sent = true;
            }
        }).clone();
        const comment = new Comment({postID: postID, content: content});
        await comment.save();
        response = await addCommentToPost({postID: comment.postID, commentID: comment.id});
        if(!sent)
            res.status(200).json(comment);
    } catch (error) {
        if(!sent)
            res.status(404).json({ message:error });
    }
}

const deleteComment = async (req,res) => {
    try {
        const {id} = req.params;
        let sent = false;
        let response = await Comment.findByIdAndUpdate(id, {isDeleted: true}, {new: true}, async function (error, result) {
            if (error && !sent)
                res.status(400).send("Deletion of comment " + id + " failed with error " + error);
            await deleteCommentFromPost({postID: result.postID, commentID: result.id});
        }).clone();

        if (!sent)
            res.status(200).send("Comment deleted successfully.");
    }
    catch(e){
        console.log("Error " + e + " occurred in deleteComment")
        res.status(400).send("error")
    }
}

module.exports = {readComments, createComment, deleteComment,getCommentById};
