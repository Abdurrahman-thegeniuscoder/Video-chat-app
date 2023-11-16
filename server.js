import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { createServer } from "https";
import { Server } from "socket.io";

const app = express()
const server = createServer(app)
const port = 3000
const io = new Server(server);

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room", (req, res) => {
    res.render("room.ejs", {roomId: req.params.room})
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId)
        socket.join(roomId)
        socket.to(roomId).emit("user-connected", userId)
    })
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})