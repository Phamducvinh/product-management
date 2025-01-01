const uploadToCloudinary = require('../../helpers/uploadToCloudinary');
const Chat = require('../../models/chat.model');

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    
    _io.once('connection', (socket) => {
        socket.on('client_send_message', async (data) => {
            let images = [];

            for(const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }

            // lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });
            await chat.save();

            // trả data vè client
            _io.emit('server_return_message', {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images 
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
}