tinymce.init({
    selector: 'textarea.textarea-mce',
    plugins: "image", // thêm ahr trong mce
    file_picker_callback: function (callback, value, meta) {
        if (meta.filetype == 'image') {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target.result, {
                        alt: ''
                    });
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
    }
});