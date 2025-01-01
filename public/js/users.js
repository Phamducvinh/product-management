// chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("btn-add-friend");
            // console.log(userId);
            socket.emit("client_add_friend", userId);
        });
    });
}
// end chức năng gửi yêu cầu

// chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userId = button.getAttribute("btn-cancel-friend");
            // console.log(userId);
            socket.emit("client_cancel_friend", userId);
        })
    })
}
// end chức năng hủy yêu cầu

// chức năng hủy yêu cầu
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");
            // console.log(userId);
            socket.emit("client_refuse_friend", userId);
        });
    });
}
//  end chức năng hủy yêu cầu

// chức năng chấp nhận yêu cầu
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");

            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("client_accept_friend", userId);
        })
    })
}
// end chức năng chấp nhận yêu cầu