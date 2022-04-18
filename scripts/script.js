function login () {
    window.myUsername = document.querySelector(".my-username").value
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: document.querySelector(".my-username").value})

    request.then(loginSuccess)
    request.catch(loginFail)

    function loginSuccess (response) {
        document.querySelector(".login-screen").classList.add("displayNone")
        function myStatus () {
            axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: document.querySelector(".my-username").value})
        }
        document.querySelector(".message-info").innerHTML = `Enviando para ${document.querySelector(".participants-list .selected").children[1].innerHTML} (${document.querySelector(".visibility-list .selected").children[1].innerHTML})`
        myStatus()
        setInterval(myStatus, 5000)
        loadMessages()
        setInterval(loadMessages, 3000)
        loadParticipants()
        setInterval(loadParticipants, 10000)
    }
    function loginFail (requestStatus) {
        const statusCode = requestStatus.response.status
        if (statusCode === 400) {
            alert("Utilize outro nome de usuário")
        }
    }
}
function reload() {
    window.location.reload()
}
function displayParticipantsSection() {
    document.querySelector(".participants-background").classList.remove("displayNone")
    document.querySelector("section").classList.remove("displayNone")
    window.participantsInterval = setInterval(loadParticipants, 10000)
}
function notDisplayParticipantsSection() {
    document.querySelector(".participants-background").classList.add("displayNone")
    document.querySelector("section").classList.add("displayNone")
    clearInterval(participantsInterval)
}
function loadParticipants () {
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')

    promise.then(receiveParticipants)

    function receiveParticipants (participants) {
        document.querySelector(".participants-list").innerHTML = `<li class="selected" onclick="selectReceiver(this)"><ion-icon name="people"></ion-icon><p>Todos</p><ion-icon name="checkmark" class="check"></ion-icon></li>`
        for (let i = 0; i < participants.data.length; i++) {
        displayParticipants(participants.data[i])
        }

        function displayParticipants (participant) {
            const participantBox = document.querySelector(".participants-list")
            participantBox.innerHTML += `<li onclick="selectReceiver(this)"><ion-icon name="person-circle"></ion-icon><p>${participant.name}</p></li>`
        }

    }
}
function loadMessages() {
    
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')

    promise.then(receiveMessages)

    function receiveMessages (messages) {
        if (document.querySelector("ol").innerHTML.includes(messages.data[messages.data.length - 1].time) ) {

        } else {
            document.querySelector("ol").innerHTML = ""
            for (let i = 0; i < messages.data.length; i++) {
                displayMessages(messages.data[i])
            }

            function displayMessages (message) {
                const messageBox = document.querySelector("ol")
                if (message.type === "status") {
                    messageBox.innerHTML += `<li><p><span class="time">(${message.time})  </span><b>${message.from} </b>${message.text}</p></li>`
                } else if (message.type === "message") {
                    messageBox.innerHTML += `<li class="message"><p><span class="time">(${message.time})  </span><b>${message.from} </b> para <b>${message.to}</b>: ${message.text}</p></li>`
                } else if (message.type === "private_message" && (message.to === document.querySelector(".my-username").value || message.from === document.querySelector(".my-username").value)) {
                    messageBox.innerHTML += `<li class="private-message"><p><span class="time">(${message.time})  </span><b>${message.from} </b> reservadamente para <b>${message.to}</b>: ${message.text}</p></li>`
                }
                var lastMessage = document.querySelector("ol").lastChild
                document.querySelector("ol").lastChild.scrollIntoView();
            }
        }
    }
}
function sendMessage() {
    if (document.querySelector(".visibility-list .selected").children[1].innerHTML === "Reservadamente" && document.querySelector(".participants-list .selected").children[1].innerHTML === "Todos") {
        alert("Não é possível mandar mensagens reservadamente para todos os usuários")
    } else {
        let myMessage = {from: document.querySelector(".my-username").value, to: document.querySelector(".participants-list .selected").children[1].innerHTML, text: document.querySelector(".my-message").value, type: document.querySelector(".visibility-list .selected").id}
        const messageSent = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', myMessage)

        messageSent.then(messageOk)
        messageSent.catch(messageFail)

        function messageOk (messageInfo) {
            loadMessages()
        }
        function messageFail (messageInfo) {
            window.location.reload()
        }
    }
    loadMessages()
}
function selectReceiver (receiver) {
    let alreadySelected = document.querySelector(".participants-list .selected")
    if (receiver !== alreadySelected) {
        alreadySelected.classList.remove("selected")
        alreadySelected.removeChild(alreadySelected.children[2])
        receiver.classList.add("selected")
        receiver.innerHTML += '<ion-icon name="checkmark" class="check"></ion-icon>'
        document.querySelector(".message-info").innerHTML = `Enviando para ${document.querySelector(".participants-list .selected").children[1].innerHTML} (${document.querySelector(".visibility-list .selected").children[1].innerHTML})`
    }
}
function selectVisibility (visibility) {
    let alreadySelected = document.querySelector(".visibility-list .selected")
    if (visibility !== alreadySelected) {
        alreadySelected.classList.remove("selected")
        alreadySelected.removeChild(alreadySelected.children[2])
        visibility.classList.add("selected")
        visibility.innerHTML += '<ion-icon name="checkmark" class="check"></ion-icon>'
        document.querySelector(".message-info").innerHTML = `Enviando para ${document.querySelector(".participants-list .selected").children[1].innerHTML} (${document.querySelector(".visibility-list .selected").children[1].innerHTML})`
    }
}
