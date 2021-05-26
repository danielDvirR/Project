JCButton.addEventListener("click", () => {
    STButton.style.display = "none";
    codeForm.style.display = "block";
    JCButton.style.display = "none";
})

codeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    peer = new Peer();
    setTimeout(() => {
        const conn = peer.connect(codeForm.elements.code.value);
        conn.on('open', function () {
            // Receive messages
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
    }, 2000)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        let call = peer.call(codeForm.elements.code.value, stream);
        myVideoStream = stream;
        addVideoStream(myVideo, stream)
        let count = 0;
        call.on('stream', function (stream) {
            if (count <= 0)
                addVideoStream(document.createElement("video"), stream)
            count++;
        });
        call.on("close", () => {
            console.log("call destroyed")
        })
    })
    Calling.style.display = "none"
    videoCall.style.display = "flex"

})
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    videoGrid.append(video)
}