
const videoGrid = document.querySelector("#video-grid") //place where the video elements are
const Calling = document.querySelector(".firstPart") // part of registration before connecting to call
const STButton = document.querySelector(".openingCall .button .openForm") // button pressed to get id of peer
const infoID = document.querySelector(".firstPart .info") //place where the information about the id is set
const JCButton = document.querySelector(".connectCall .openForm") //button that opens form for entering another peer's id
const codeForm = document.querySelector(".connectCall form"); //the form that you enter the other peer's id
const videoCall = document.querySelector(".secondPart"); // part that is the video call
const muteButton = document.querySelector(".mainMuteButton"); // mute or unmute button on left side of screen
const videoButton = document.querySelector(".mainVideoButton"); //stop and start video button on left side of screen
const leaveButton = document.querySelector("#leave_meeting"); //button for leaving meeting in right side of screen
const sendTextForm = document.querySelector(".main__message__container form"); //the submit part on bottom right part of screen
const chat = document.querySelector(".messages"); //the messages placed in the ul that both peers send
const localMuteIcon = document.querySelector("#muteIconLocal") // the icons for muting both you and the other peer
const remoteMuteIcon = document.querySelector("#muteIconRemote") // the icons for muting both you and the other peer
const localVideoCover = document.querySelector("#videoDownCoverLocal") //the icons for closing camera both for you and other peer
const remoteVideoCover = document.querySelector("#videoDownCoverRemote"); //the icons for closing camera both for you and other peer
const myVideo = document.createElement("video"); //your video in the call
let myVideoStream; // the stream (audio and video) that you get from your machine

// hiding all the elements of the second part
videoCall.style.display = "none";
infoID.style.display = "none";
codeForm.style.display = "none";
localMuteIcon.style.display = "none";
localVideoCover.style.display = "none";
remoteMuteIcon.style.display = "none";
remoteVideoCover.style.display = "none";


myVideo.muted = true; // mute your video

//the event listener for clicking the Start Call button. after this you make yourself the creator of the call
STButton.addEventListener("click", () => {
    //changing the elements on screen to the information about your id
    STButton.style.display = "none";
    infoID.style.display = "block";
    JCButton.style.display = "none";

    const peer = new Peer();
    //creating the information and putting it in place
    const info = document.createElement("p");
    //evemt for opening peer
    peer.on('open', peerID => {
        console.log("aaa")
        info.innerHTML = `this is your ID. send it to the person you want to video call. ${peerID}`
    })
    document.querySelector(".info").append(info);
    //event for connectimg to other peer, you recive a line of communication
    peer.on('connection', function (conn) {
        //event for when connection is opened
        conn.on('open', function () {
            //event for receiving data
            conn.on('data', function (data) {


                if (data === "leave") {
                    alert("other person left");
                    setTimeout(() => { location.reload(); }, 5000)
                }
                else if (data === "otherClickedAudio") {
                    if (remoteMuteIcon.style.display === "block")
                        remoteMuteIcon.style.display = "none";
                    else {
                        remoteMuteIcon.style.display = "block";
                    }
                }
                else if (data === "otherClickedVideo") {
                    if (remoteVideoCover.style.display === "block")
                        remoteVideoCover.style.display = "none";
                    else {
                        remoteVideoCover.style.display = "block";
                    }
                }
                else {
                    const li = document.createElement("li")
                    li.innerHTML = `user: ${data}`;
                    chat.append(li)
                    const scroll = document.querySelector(".main__chat__window");
                    scroll.scrollBy(0, 20)
                }
            });


            sendTextForm.addEventListener("submit", (event) => {
                event.preventDefault();
                if (sendTextForm.elements.chat_message.value != "")
                    conn.send(sendTextForm.elements.chat_message.value)
                const li = document.createElement("li")
                li.innerHTML = `user: ${sendTextForm.elements.chat_message.value}`;
                chat.append(li)
                const scroll = document.querySelector(".main__chat__window");
                scroll.scrollBy(0, 20)
                document.getElementById("chat_message").value = "";
            })


            muteButton.addEventListener("click", () => {
                let enabled = myVideoStream.getAudioTracks()[0].enabled;
                if (enabled) {
                    myVideoStream.getAudioTracks()[0].enabled = false;
                    conn.send("otherClickedAudio")
                    localMuteIcon.style.display = "block"
                    muteButton.innerHTML = `
                        <i class="fas fa-microphone"></i>
                        <span>Unmute</span>`
                }
                else {
                    myVideoStream.getAudioTracks()[0].enabled = true;
                    conn.send("otherClickedAudio")
                    localMuteIcon.style.display = "none"
                    muteButton.innerHTML = `
                        <i class="unmute fas fa-microphone-slash"></i>
                        <span>Mute</span>`
                }
            })


            videoButton.addEventListener("click", () => {
                let enabled = myVideoStream.getVideoTracks()[0].enabled;
                if (enabled) {
                    conn.send("otherClickedVideo")
                    myVideoStream.getVideoTracks()[0].enabled = false;
                    localVideoCover.style.display = "block";
                    videoButton.innerHTML = `
                            <i class="fas fa-video"></i>
                            <span>Play Video</span>`

                }
                else {
                    myVideoStream.getVideoTracks()[0].enabled = true;
                    conn.send("otherClickedVideo")
                    localVideoCover.style.display = "none";
                    videoButton.innerHTML = `
                        <i class="fas fa-video-slash"></i>
                        <span>Stop Video</span>`

                }
            })


            leaveButton.addEventListener("click", () => {
                conn.send("leave");
                location.reload();
            })
        });
    });


    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        peer.on('call', function (call) {
            myVideoStream = stream;
            call.answer(stream);
            addVideoStream(myVideo, stream)
            let count = 0;
            call.on('stream', function (stream) {
                if (count <= 0)
                    addVideoStream(document.createElement("video"), stream)
                count++;
                Calling.style.display = "none";
                videoCall.style.display = "flex";
            });
        });
    })

})