const User = require('../../models/user.model');
const usersSocket = require("../../sockets/client/users.socket")

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // socket
    usersSocket(res);

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            {_id: { $ne: userId }},
            {_id: {$nin: requestFriends}},
            {_id: {$nin: acceptFriends}},
        ],
        status: 'active',
        deleted: false,
    }).select("id avatar fullName");
    
    res.render('client/pages/users/not-friend', {
        pageTitle: 'Danh sách người dùng',
        users: users,
    });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
    // socket
    usersSocket(res);

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: {$in: requestFriends},
        status: 'active',
        deleted: false,
    }).select("id avatar fullName");
    res.render('client/pages/users/request', {
        pageTitle: 'Danh sách yêu cầu kết bạn',
        users: users,
    });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
    // socket
    usersSocket(res);

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: {$in: acceptFriends},
        status: 'active',
        deleted: false,
    }).select("id avatar fullName");
    res.render('client/pages/users/accept', {
        pageTitle: 'Danh sách yêu cầu kết bạn',
        users: users,
    });
};

module.exports.friends = async (req, res) => {
    // socket
    usersSocket(res);

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        
        _id: userId,
    });
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);


    const users = await User.find({
        _id: {$in: friendListId},
        status: 'active',
        deleted: false,
    }).select("id avatar fullName statusOnline");

    console.log(users);

    res.render('client/pages/users/friends', {
        pageTitle: 'Danh sách bạn bè',
        users: users,
    });
}