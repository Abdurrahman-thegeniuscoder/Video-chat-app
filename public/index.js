const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement("video")
myVideo.muted = true
var peer = new Peer()

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        videoGrid.append(video);
        video.play();
     });
}

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", () => {
        addVideoStream(video, userVideoStream)
    })
}

// socket.emit("join-room", ROOM_ID, 10)

async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: true,
    })
    addVideoStream(myVideo, stream)
    
    peer.on("call", (call) => {
        call.answer(stream)
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream)
    })
}

startVideo()
