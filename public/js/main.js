document.addEventListener('DOMContentLoaded', function(){
  const fileInput = document.getElementById('fileInput');
  const previewEl = document.getElementById('photoPreview');
  const uploadArea = document.getElementById('uploadArea');
  const signupForm = document.getElementById('signupForm');
  const submitBtn = document.getElementById('submitBtn');

  function showPreview(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      previewEl.innerHTML = `<img src="${e.target.result}" alt="preview" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      previewEl.classList.remove('empty');
    }
    reader.readAsDataURL(file);
  }

  if(fileInput){
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(f) showPreview(f);
      else {
        previewEl.innerHTML = '<span>👤</span>';
        previewEl.classList.add('empty');
      }
    });
  }

  if(uploadArea){
    uploadArea.addEventListener('click', ()=>{ fileInput.click(); });
    uploadArea.addEventListener('dragover', (e)=>{ e.preventDefault(); uploadArea.classList.add('drag'); });
    uploadArea.addEventListener('dragleave', ()=>{ uploadArea.classList.remove('drag'); });
    uploadArea.addEventListener('drop', (e)=>{ 
      e.preventDefault(); 
      uploadArea.classList.remove('drag'); 
      const f = e.dataTransfer.files[0]; 
      if(f){ 
        fileInput.files = e.dataTransfer.files; 
        showPreview(f); 
      } 
    });
  }

  // Form submit handler
  if(signupForm){
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      try {
        const formData = new FormData(signupForm);
        const response = await fetch('/', {
          method: 'POST',
          body: formData
        });
        
        if(response.ok){
          // Success - reload page to show new card
          setTimeout(() => window.location.reload(), 500);
        } else {
          const text = await response.text();
          alert('Submit failed: ' + text);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Register ➤';
        }
      } catch(error){
        console.error('Submit error:', error);
        alert('Submit failed: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register ➤';
      }
    });
  }
});
