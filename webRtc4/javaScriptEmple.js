const createRoom = function () {
    const localConnection = new RTCPeerConnection()


    localConnection.onicecandidate = e => {
        console.log(" NEW ice candidnat!! on localconnection reprinting SDP ")
        console.log(JSON.stringify(localConnection.localDescription))
    }


    const sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onmessage = e => console.log("messsage received!!!" + e.data)
    sendChannel.onopen = e => console.log("open!!!!");
    sendChannel.onclose = e => console.log("closed!!!!!!");


    localConnection.createOffer().then(o => localConnection.setLocalDescription(o))
}

const startProgram = function () {
    const joinClass = document.querySelector(".joinClass .openForm");
    const register = document.querySelector(".registration .openForm");
    const closeCode = document.querySelector(".joinClass button");
    const closeRegForm = document.querySelector(".registration button");
    const regForm = document.querySelector(".registration form");
    const codeForm = document.querySelector(".joinClass form");
    regForm.style.display = "none";
    codeForm.style.display = "none";
    joinClass.addEventListener("click", function () {
        codeForm.style.display = "block";
        joinClass.style.display = "none";
        if (regForm.style.display === "block") {
            regForm.style.display = "none";
            register.style.display = "block";
        }
    })
    register.addEventListener("click", function () {
        regForm.style.display = "block";
        register.style.display = "none";
        if (codeForm.style.display === "block") {
            codeForm.style.display = "none";
            joinClass.style.display = "block";
        }
    })
    closeCode.addEventListener("click", function () {
        codeForm.style.display = "none";
        joinClass.style.display = "block";
    })
    closeRegForm.addEventListener("click", function () {
        regForm.style.display = "none";
        register.style.display = "block";
    })
    regForm.addEventListener("submit", function (event) {
        console.log("Username:" + regForm.elements.Username.value);
        console.log("Password:" + regForm.elements.Password.value);
        console.log("Email:" + regForm.elements.Email.value);
        createRoom();
        event.preventDefault();
    })
    codeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let offer = codeForm.elements.code.value;
        offer += "\n"
        const remoteConnection = new RTCPeerConnection()

        remoteConnection.onicecandidate = e => {
            console.log(" NEW ice candidnat!! on localconnection reprinting SDP ")
            console.log(JSON.stringify(remoteConnection.localDescription))
        }


        remoteConnection.ondatachannel = e => {

            const receiveChannel = e.channel;
            receiveChannel.onmessage = e => console.log("messsage received!!!" + e.data)
            receiveChannel.onopen = e => console.log("open!!!!");
            receiveChannel.onclose = e => console.log("closed!!!!!!");
            remoteConnection.channel = receiveChannel;

        }
        remoteConnection.setRemoteDescription(JSON.parse(codeForm.elements.code.value))
        remoteConnection.createAnswer().then(a => remoteConnection.setLocalDescription(a)).then(a =>
            console.log(JSON.stringify(remoteConnection.localDescription)))

    })
}
startProgram();