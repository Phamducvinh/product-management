const User = require('../../models/user.model');

module.exports = (res) => {
    // chức năng gửi yêu cầu
    _io.once('connection', (socket) => {
        socket.on("client_add_friend", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId); id của A
            // console.log(userId); id của B

            // thêm id A vào acceptFriends B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(!existIdAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            }
            // Thêm id B vào requestFriends A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(!existIdBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                });
            }
            // lấy ra độ dài của acceptFriends của B và trả về A
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("server_return_length_accept_friends", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // lấy info của A và trả về B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("server_return_info_accept_friends", {
                userIdB: userId,
                infoUserA: infoUserA
            });

        });
    });

    // chức năng hủy yêu cầu
    _io.once('connection', (socket) => {
        socket.on("client_cancel_friend", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId);
            // console.log(userId);

            // Xóa id A vào acceptFriends B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(existIdAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                })
            }
            // Xóa id B vào requestFriends A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(existIdBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                });
            }
            
            // lấy ra độ dài của acceptFriends của B và trả về A
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("server_return_length_accept_friends", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // lấy id của A trả về B
            socket.broadcast.emit("server_return_user_id_cancel_friend", {
                userIdB: userId,
                userIdA: myUserId
            });
        });
    });

    // chức năng từ chối yêu cầu
    _io.once('connection', (socket) => {
        socket.on("client_refuse_friend", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId); : id B
            // console.log(userId); : id A

            // Xóa id A vào acceptFriends B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                })
            }
            // Xóa id B vào requestFriends A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            }
        });
    });

    // chức năng chấp nhận yêu cầu
    _io.once('connection', (socket) => {
        socket.on("client_accept_friend", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId); : id B
            // console.log(userId); : id A

            // Xóa id A trong acceptFriends B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    // thêm {user_id, room_chat_id} của A vào friendList của B
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                })
            }
            // Xóa id B trong requestFriends A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    // thêm {user_id, room_chat_id} của B vào friendList của A
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            }
        });
    });
    // chức năng hiện danh sách đã kết bạn
    _io.once('connection', (socket) => {
        socket.on("client_show_list_friend", async (userId) => {
            const infoUser = await User.findOne({
                _id: userId
            }).select("friendList");

            socket.emit("server_return_list_friend", {
                infoUser: infoUser
            });
        });
    });
    // chức năng hiện danh sách kết bạn
}