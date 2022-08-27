import { Server } from "socket.io";

const io = new Server(
    {
        cors: {
            origin: "http://localhost:3000"
        }
    });
let onlineUsers = [];
const addNewUser = (userEmail, socketId) => {
    console.log(onlineUsers.length)
    !onlineUsers.some((user) => user.userEmail === userEmail) && onlineUsers.push({ userEmail, socketId });
}
const removeUser = (removeEmail) => {
    onlineUsers = onlineUsers.filter((user) => user.userEmail !== removeEmail);
}
io.on("connection", (socket) => {

    io.emit("refresh", "please refresh you page for updates....")
    socket.on("newUser", (userName) => {
        addNewUser(userName, socket.id);
    })
    socket.on("sendOnlineUser", () => {
        console.log("sendOnlineUser " + onlineUsers.length);
        io.emit("getOnlineUser", onlineUsers.length);
    })

    socket.on("logout", (userEmail) => {
        removeUser(userEmail);
    })
});
console.log("socket running on port 5000....")
io.listen(5000);