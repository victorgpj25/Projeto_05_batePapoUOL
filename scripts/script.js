function login () {
    var myUsername = document.querySelector(".my-username").value
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: document.querySelector(".my-username").value})

    request.then(loginSuccess)
    request.catch(loginFail)

    function loginSuccess (response) {
        document.querySelector(".login-screen").classList.add("displayNone")
        function myStatus () {
            axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: document.querySelector(".my-username").value})
        }
        myStatus()
        setInterval(myStatus, 5000)
        loadMessages()
        setInterval(loadMessages, 3000)
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
function displayParticipants() {
    document.querySelector(".participants-background").classList.toggle("displayNone")
    document.querySelector("section").classList.toggle("displayNone")
}
function loadMessages() {
    
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')

    promise.then(receiveMessages)

    function receiveMessages (messages) {
        if (document.querySelector("ol").innerHTML.includes(messages.data[messages.data.length - 1].time) )
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
function sendMessage() {

}
