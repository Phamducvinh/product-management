// change Status

const buttonChangeStatus = document.querySelectorAll("[button-chang-status]");
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            console.log(statusCurrent);
            console.log(id);
            console.log(statusChange);

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            console.log(action);
            // formChangeStatus.setAttribute("action", action);
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
// end Change Status

// delete product
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}

// end delete product