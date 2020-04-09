# ajaxFileUploader
```html
<input type="file"/>

<script type="text/javascript">
document.getElementById("file-input").onchange = function(event) {
    const file = event.target.files[0];
    const uploader = new FileUploader(file);
    uploader.upload();   
}
</script>
```
