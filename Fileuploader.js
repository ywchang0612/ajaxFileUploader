function FileUploader(file) {
    const KB = 1024;
    const MB = 1024 * KB;
    const CHUNK_SIZE = 256 * MB;

    if (!(file instanceof Blob)) {
        throw "not a Blob file";
    }

    this.file = file;
    this.UPLOAD_URL = '/ajaxUpload';
    this.chunk_index = 0;
    this.timestamp = Date.now();

    this._shouldChunk = function () {
        return this.file.size > CHUNK_SIZE
    };

    this.upload = function () {
        if (this._shouldChunk()) {
            this.sliceUpload()
        } else {
            this.simpleUpload()
        }
    };

    this.sliceUpload = function () {
        let uploader = this;
        let start = CHUNK_SIZE * this.chunk_index++;
        let end = (start + CHUNK_SIZE) <= this.file.size
            ? start + CHUNK_SIZE
            : this.file.size;


        let form = new FormData;
        form.append('file', this.file.slice(start, end), this.file.name);

        let xhr = this.createXHR();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (uploader.chunk_index < Math.ceil(uploader.file.size / CHUNK_SIZE)) {
                    uploader.sliceUpload()
                } else {
                    console.log('success')
                }
            }
        };

        xhr.onprogress = function () {
            console.log("percent:" + Math.round(start / uploader.file.size * 100) + "%")
        };

        xhr.onabort = function () {
            console.log(xhr);
        };

        xhr.send(form)
    };

    this.simpleUpload = function () {
        let form = new FormData;
        form.append('file', this.file, this.file.name);

        let xhr = this.createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log('success')
            }
        };

        xhr.send(form);
    };

    this.createXHR = function () {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.UPLOAD_URL);
        xhr.setRequestHeader('X-CSRF-Token', $('[name=csrf-token]').attr('content'));
        return xhr;
    }
}
