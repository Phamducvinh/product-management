import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import * as FileUploadWithPreview from 'https://cdn.jsdelivr.net/npm/file-upload-with-preview';
// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6,
});
// END file-upload-with-preview


// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;

        if(content || images.length > 0){
            socket.emit("client_send_message", {
                content: content,
                images: images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("client_send_typing", "hidden");
        }
    })
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("server_return_message", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if(myId == data.userId){
        div.classList.add("inner-outgoing");
    }else{
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    if(data.content){
        htmlContent = `
        <div class="inner-content">${data.content}</div>
        `;
    }

    if(data.images.length > 0){
        htmlImages += `<div class="inner-images">`;

        for(const image of data.images){
            htmlImages += `<img src="${image}"`;
        }

        htmlImages += `</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;

    // preview full image

    const gallery = new Viewer(div);
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

// preview full image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if(bodyChatPreviewImage){
    const gallery = new Viewer(bodyChatPreviewImage)
}
// end preview full image