document.addEventListener('DOMContentLoaded', function(){
  const fileInput = document.querySelector('input[name="photo"]');
  const previewEl = document.getElementById('photoPreview');
  const previewImg = document.getElementById('photoPreviewImg');
  const uploadArea = document.getElementById('uploadArea');

  function showPreview(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      previewImg.src = e.target.result;
      previewEl.classList.add('has-image');
    }
    reader.readAsDataURL(file);
  }

  if(fileInput){
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(f) showPreview(f);
      else previewEl.classList.remove('has-image');
    });
  }

  if(uploadArea){
    uploadArea.addEventListener('click', ()=>{ fileInput.click(); });
    uploadArea.addEventListener('dragover', (e)=>{ e.preventDefault(); uploadArea.classList.add('drag'); });
    uploadArea.addEventListener('dragleave', ()=>{ uploadArea.classList.remove('drag'); });
    uploadArea.addEventListener('drop', (e)=>{ e.preventDefault(); uploadArea.classList.remove('drag'); const f = e.dataTransfer.files[0]; if(f){ fileInput.files = e.dataTransfer.files; showPreview(f); } });
  }
});
