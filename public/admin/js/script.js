// Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0){
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if(status){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// end button status

// form sear sản phẩm
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); // tránh load lại trang
        const keyword = e.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else{
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

// end form search sản phẩm

// phân trang
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination){
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if(page){
                url.searchParams.set("page", page);
            }else{
                url.searchParams.delete("page");
            }

            window.location.href = url.href;
        });
    });
}
// end phân trang

// check box
const checkboxMulti = document.querySelector("[checkbox-multi");
if(checkboxMulti){
    const inputCheckAll = document.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        inputsId.forEach(input => {
            input.checked = inputCheckAll.checked;
        });
        // if(inputCheckAll.checked){
        //     inputsId.forEach(input => {
        //         input.checked = true;
        //     });
        // }else{
        //     inputsId.forEach(input => {
        //         input.checked = false;
        //     });
        // }
    });

    // cách 1
    // inputsId.forEach(input => {
    //     input.addEventListener("click", () => {
    //         let check = true;
    //         inputsId.forEach(input => {
    //             if(!input.checked){
    //                 check = false;
    //             }
    //         });

    //         inputCheckAll.checked = check;
    //     });
    // });

    // cách 2
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            // inputCheckAll.checked = countChecked == inputsId.length;

            if(countChecked == inputsId.length){
                inputCheckAll.checked = true;
            }else{
                inputCheckAll.checked = false;
            }
        
        })
    })
}
// end check box

// Form change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete-all"){
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa những sản phẩm này không?");

            if(!isConfirm){
                return;
            }
        }

        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
    
            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                    
                }else{
                    ids.push(id);
                }
                
            });

            inputIds.value = ids.join(",");
            formChangeMulti.submit();
    
        }else{
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }
    });

}
// end Form change Multi