const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    // socket
    _io.once('connection', (socket) => {
        socket.on('client_send_message', async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content,
            });
            await chat.save();

            // trả data vè client
            _io.emit('server_send_message', {
                userId: userId,
                fullName: fullName,
                content: content,
            });
        });

        // typing
        socket.on("client_send_typing", async (type) => {
            socket.broadcast.emit("server_return_typing", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
    });
    


    //end socket.io

    // get all chat
    const chats = await Chat.find({
        deleted: false
    });

    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser;
    }

    // end get all chat
    res.render('client/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chats
    });
}