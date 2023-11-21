import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { createServer } from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

const app = express()
const server = createServer(app)
const port = 3000
const io = new Server(server, {
    cors: {
      origin: '*',
    }
});

const opinions = {
    debug: true,
}
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room", (req, res) => {
    res.render("room", {roomId: req.params.room})
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        // console.log(roomId, userId)
        socket.join(roomId)
        setTimeout(()=>{ 
            socket.to(roomId).emit("user-connected", userId);
          }, 100)
    })
}) 

server.listen(process.env.PORT || 3000);
