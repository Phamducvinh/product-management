import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if(content){
            socket.emit("client_send_message", content);
            e.target.elements.content.value = "";
            socket.emit("client_send_typing", "hidden");
        }
    })
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("server_send_message", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

    const div = document.createElement("div");
    let htmlFullName = "";

    if(myId == data.userId){
        div.classList.add("inner-outgoing");
    }else{
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;
});
// END SERVER_RETURN_MESSAGE

// scroll to bottom 
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// END scroll to bottom

// show icon chat
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle("show");
    }
}
// show typing
var timeOut;
const showTyping = () => {
    socket.emit("client_send_typing", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("client_send_typing", "hidden");
    }, 3000);
}
// end show typing
// insert emoji
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value += icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });
    // input keyup


    inputChat.addEventListener("keyup", () => {
        showTyping();
    })
    // END input keyup
}

// END insert emoji

// END show icon chat

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if(elementListTyping){
    socket.on("server_return_typing", (data) => {
        if(data.type == "show") {
            const bodyChat = document.querySelector(".chat .inner-body");
            const exitTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(!exitTyping){
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }   
        }else{
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
// END SERVER_RETURN_TYPING