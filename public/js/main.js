document.addEventListener('DOMContentLoaded', function(){
  const fileInput = document.querySelector('input[name="photo"]');
  const previewEl = document.getElementById('photoPreview');
  const previewImg = document.getElementById('photoPreviewImg');
  const uploadArea = document.getElementById('uploadArea');
  const signupForm = document.getElementById('signupForm');
  const submitBtn = document.getElementById('submitBtn');

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
          submitBtn.textContent = 'Sign Up';
        }
      } catch(error){
        console.error('Submit error:', error);
        alert('Submit failed: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
      }
    });
  }
});
