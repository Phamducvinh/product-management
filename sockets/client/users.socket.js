const User = require('../../models/user.model');

module.exports = (res) => {
    // chức năng gửi yêu cầu
    _io.once('connection', (socket) => {
        socket.on("client_add_friend", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId);
            // console.log(userId);

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
                })
            }
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
                })
            }
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
}