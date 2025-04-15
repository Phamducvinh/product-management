module.exports.index = async (req, res) => {
    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách phòng chat",
    });
};

module.exports.create = async (req, res) => {
    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Tạo phòng chat",
    });
}