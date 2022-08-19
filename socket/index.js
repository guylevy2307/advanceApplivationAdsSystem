const io = require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:3000"
    }
})

let users = []

const addUser = (userEmail,socketId) =>{
    !users.some(user=>user.userEmail===userEmail) &&
        users.push(({userEmail, socketId}))
}

const removeUser = (socketId) => {
    users = users.filter(user=>user.socketId !== socketId)
}

const getUser = (userEmail) => {
    return users.find(user=>user.userEmail === userEmail)
}

io.on('connection', (socket) => {
    //when connect
    console.log("a user connected")
    //take userEmail and socketId from user
    socket.on("addUser", userEmail => {
        addUser(userEmail,socket.id)
        console.log(`${userEmail} is connected`)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", jsonStr => { //json should be {senderEmail,receiverEmail,text}
        if(jsonStr){
            const {senderEmail,receiverEmail,text} = JSON.parse(jsonStr)
            console.log(`sending new message to ${receiverEmail} `)
            const receiver = getUser(receiverEmail)
            if(receiver) {
                io.to(receiver.socketId).emit("getMessage", JSON.stringify({
                    senderEmail,
                    text
                }))
            }
        }
    })

    socket.on("getOnline", userEmail => {
        console.log(`client is ${userEmail}`)
        const result = users.filter(u => u.userEmail!==userEmail)
        console.log(result)
        io.to(socket.socketId).emit("getUsers", result)
    })


    //when disconnect
    socket.on("disconnect", () => {
        console.log('user disconnected')
        removeUser(socket.id)
        io.emit("getUsers", users)
        console.log(`there are ${users.length} online users`)
    })
})
