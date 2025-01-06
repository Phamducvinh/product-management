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

// chức năng từ chối kết bạn
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userId = button.getAttribute("btn-refuse-friend");
        // console.log(userId);
        socket.emit("client_refuse_friend", userId);
    });
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    });
}
//  end chức năng từ chối kết bạn


// chức năng chấp nhận yêu cầu
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");

        const userId = button.getAttribute("btn-accept-friend");
        // console.log(userId);
        socket.emit("client_accept_friend", userId);
    });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button);
    });
}
// end chức năng chấp nhận yêu cầu

// server return length accept friends

const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if(badgeUsersAccept){
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("server_return_length_accept_friends", (data) => {
        if(userId == data.userId){
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    });
}
// socket.on("server_return_length_accept_friends", (data) => {
//     const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
//     if (badgeUsersAccept) {
//         badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
//     }
// });

// end server return length accept friends

// server_return_info_accept_friends
socket.on("server_return_info_accept_friends", (data) => {
    // trang lời mời kết bạn
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if(dataUsersAccept){
        const userIdB = dataUsersAccept.getAttribute("data-users-accept");
        if(userIdB == data.userIdB){

            // in user ra giao diện
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);
            
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="/images/avatar.png" alt="${data.infoUserA.fullName}">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                    </div>
                        <div class="inner-buttons">
                            <button
                                class="btn btn-sm btn-primary mr-1"
                                btn-accept-friend="${data.infoUserA._id}"
                            > Chấp nhận </button>
                            <button
                                class="btn btn-sm btn-secondary mr-1"
                                btn-refuse-friend="${data.infoUserA._id}"
                            > Từ chối </button>
                            <button
                                class="btn btn-sm btn-danger mr-1"
                                btn-deleted-friend=""
                                disabled=""
                            > Đã xóa </button>
                            <button
                                class="btn btn-sm btn-success"
                                btn-accepted-friend=""
                                disabled=""
                            > Đã chấp nhận </button>
                        </div>
                    </div>
                </div>
            `;
            dataUsersAccept.appendChild(div);
    
            // hủy lời mời kết bạn
            const buttonRefuse = div.querySelector(`[btn-refuse-friend]`);
    
            refuseFriend(buttonRefuse);
    
            // chấp nhận kết bạn
            const buttonAccept = div.querySelector(`[btn-accept-friend]`);
            acceptFriend(buttonAccept);
        }
    }
    
    // trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if(dataUsersNotFriend){
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if(userId === data.userIdB){
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserA._id}']`);
            if(boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }
});

// end server_return_info_accept_friends

// server_return_user_id_cancel_friend
socket.on("server_return_user_id_cancel_friend", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
    if(boxUserRemove){
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = dataUsersAccept.getAttribute("data-users-accept");
        if(userIdB === data.userIdB){
            dataUsersAccept.removeChild(boxUserRemove);
        }
    }
});
// end server_return_user_id_cancel_friend

