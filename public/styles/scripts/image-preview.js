const filePickerElement = document.getElementById('image');
const imagePreviewElement = document.getElementById('image-preview');

function showPreview() {
    
  const files = filePickerElement.files;
  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }
  

  const pickedFile = files[0];
  console.log(pickedFile)

  imagePreviewElement.src = URL.createObjectURL(files[0]);
  imagePreviewElement.style.display = 'block';
}

filePickerElement.addEventListener('change', showPreview);


