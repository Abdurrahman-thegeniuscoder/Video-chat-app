const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const user = prompt("Enter your name");

const peer = new Peer({
//   host: '127.0.0.1',
//   port: 3030,
  path: '/peerjs',
  config: {
    'iceServers': [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      }
    ]
  },
  debug: 3
});

let myVideoStream;

const getMediaStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log('someone call me');
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

getMediaStream();

const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

const muteAudio = document.getElementById("muteButton")
const stopVideo = document.getElementById("stopVideo")
muteAudio.addEventListener("click", () => {
    const audioEnabled = myVideoStream.getAudioTracks()[0]
    console.log(audioEnabled)
    if (audioEnabled.enabled) {
        audioEnabled.enabled = false
        muteAudio.classList.toggle("background__red")
        muteAudio.innerHTML = `<i class="fas fa-microphone-slash"></i>`
    } else {
        audioEnabled.enabled = true
        muteAudio.classList.toggle("background__red")
        muteAudio.innerHTML = `<i class="fas fa-microphone"></i>`
    }
    console.log(audioEnabled)
})

stopVideo.addEventListener("click", () => {
    const videoEnabled = myVideoStream.getVideoTracks()[0]
    console.log(videoEnabled)
    if (videoEnabled.enabled) {
        videoEnabled.enabled = false
        stopVideo.classList.toggle("background__red")
        stopVideo.innerHTML = `<i class="fa-solid fa-video-slash"></i>`
    } else {
        videoEnabled.enabled = true
        stopVideo.classList.toggle("background__red")
        stopVideo.innerHTML = `<i class="fa-solid fa-video"></i>`
    }stopVideo
    console.log(videoEnabled)
})