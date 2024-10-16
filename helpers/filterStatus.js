module.exports = (query) => {
    // truyền button từ admin qua fontend
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "active"
        },
        {
            name: "Còn hàng",
            status: "active",
            class: ""
        },
        {
            name: "Hết hàng",
            status: "inactive",
            class: ""
        }
    ];

    // thao tác với button cho đúng trạng thái
    if(query.status){
        filterStatus = filterStatus.map(item => {
            if(item.status === query.status){
                item.class = "active";
            }else{
                item.class = "";
            }

            return item;
        });
    }
    return filterStatus;
}