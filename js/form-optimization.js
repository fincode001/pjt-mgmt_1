// Form Optimization JS for Project Management System

document.addEventListener('DOMContentLoaded', function() {
  initFormSteps();
  initSectionCollapse();
  initRatingSystem();
  initStatusSelector();
  initProgressVisuals();
  initFileUploadEnhancements();
  initAutoSave();
});

// Form Steps Navigation
function initFormSteps() {
  const steps = document.querySelectorAll('.form-step-content');
  const stepIndicators = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-prev');
  
  if (steps.length === 0) return;
  
  // Show initial step
  showStep(0);
  
  nextButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate current step
      if (validateStep(index)) {
        showStep(index + 1);
      }
    });
  });
  
  prevButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      showStep(index);
    });
  });
  
  function showStep(stepIndex) {
    steps.forEach((step, i) => {
      step.style.display = i === stepIndex ? 'block' : 'none';
    });
    
    // Update step indicators
    stepIndicators.forEach((indicator, i) => {
      if (i < stepIndex) {
        indicator.classList.add('completed');
        indicator.classList.remove('active');
      } else if (i === stepIndex) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    });
    
    // Scroll to top of form
    const form = document.querySelector('.enhanced-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function validateStep(stepIndex) {
    const currentStep = steps[stepIndex];
    const requiredFields = currentStep.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('invalid');
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = '필수 입력 항목입니다';
          field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
      } else {
        field.classList.remove('invalid');
        if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
          field.nextElementSibling.remove();
        }
      }
    });
    
    return isValid;
  }
}

// Section Collapse Functionality
function initSectionCollapse() {
  const toggleButtons = document.querySelectorAll('.toggle-section');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const section = this.closest('.form-section');
      section.classList.toggle('collapsed');
      
      // Update icon
      if (section.classList.contains('collapsed')) {
        this.innerHTML = '<i class="fas fa-chevron-down"></i>';
      } else {
        this.innerHTML = '<i class="fas fa-chevron-up"></i>';
      }
    });
  });
}

// Enhanced Rating System
function initRatingSystem() {
  const ratingValues = document.querySelectorAll('.rating-value');
  
  ratingValues.forEach(value => {
    value.addEventListener('click', function() {
      // Get the target input field and rating group
      const targetInput = document.getElementById(this.dataset.target);
      const ratingGroup = this.closest('.rating-stars').querySelectorAll('.rating-value');
      
      // Set value to hidden input
      if (targetInput) {
        targetInput.value = this.dataset.value;
      }
      
      // Update visual state
      ratingGroup.forEach(item => {
        if (parseInt(item.dataset.value) <= parseInt(this.dataset.value)) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    });
  });
}

// Project Status Selector
function initStatusSelector() {
  const statusOptions = document.querySelectorAll('.status-option');
  
  statusOptions.forEach(option => {
    option.addEventListener('click', function() {
      const input = this.querySelector('input');
      
      // Unselect all options
      const allOptions = this.parentElement.querySelectorAll('.status-option');
      allOptions.forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Select current option
      this.classList.add('selected');
      
      // Update input
      if (input) {
        input.checked = true;
        
        // If status is completed, set progress to 100%
        if (input.value === 'completed') {
          const progressInput = document.getElementById('project-progress');
          if (progressInput) {
            progressInput.value = 100;
            updateProgressBar();
          }
        }
        // If status is not-started, set progress to 0%
        else if (input.value === 'not-started') {
          const progressInput = document.getElementById('project-progress');
          if (progressInput) {
            progressInput.value = 0;
            updateProgressBar();
          }
        }
      }
    });
  });
}

// Enhanced Progress Visualization
function initProgressVisuals() {
  const progressInput = document.getElementById('project-progress');
  const scheduleProgressEl = document.getElementById('schedule-progress');
  
  if (progressInput) {
    progressInput.addEventListener('input', updateProgressBar);
    // Initial update
    updateProgressBar();
  }
  
  function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressValue = document.querySelector('.progress-value');
    
    if (progressBar && progressValue) {
      const value = progressInput.value;
      progressBar.style.width = `${value}%`;
      progressValue.textContent = `${value}%`;
      
      // Update color based on value
      if (value < 25) {
        progressBar.style.backgroundColor = '#e74c3c'; // Red for low progress
      } else if (value < 75) {
        progressBar.style.backgroundColor = '#f39c12'; // Yellow for medium progress
      } else {
        progressBar.style.backgroundColor = '#27ae60'; // Green for high progress
      }
      
      // Compare with schedule progress
      const scheduleProgress = parseInt(scheduleProgressEl?.dataset?.progress || 0);
      const progressActual = document.querySelector('.progress-actual');
      const progressExpected = document.querySelector('.progress-expected');
      
      if (progressActual && progressExpected) {
        progressActual.textContent = `실제: ${value}%`;
        progressExpected.textContent = `예상: ${scheduleProgress}%`;
        
        // Highlight if behind schedule
        if (parseInt(value) < scheduleProgress) {
          progressExpected.style.color = '#e74c3c';
        } else {
          progressExpected.style.color = '#27ae60';
        }
      }
    }
  }
}

// Enhanced File Upload
function initFileUploadEnhancements() {
  const fileUpload = document.getElementById('file-upload');
  const dropArea = document.querySelector('.enhanced-upload-area');
  const fileList = document.getElementById('enhanced-file-list');
  
  if (!fileUpload || !dropArea || !fileList) return;
  
  // Click to select files
  dropArea.addEventListener('click', () => fileUpload.click());
  
  // Handle file selection
  fileUpload.addEventListener('change', handleFiles);
  
  // Drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight() {
    dropArea.classList.add('highlight');
  }
  
  function unhighlight() {
    dropArea.classList.remove('highlight');
  }
  
  dropArea.addEventListener('drop', function(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
  });
  
  function handleFiles(e) {
    const files = e.target.files;
    
    [...files].forEach(file => {
      // Create file item
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item fadeIn';
      
      // Get file extension
      const extension = file.name.split('.').pop().toLowerCase();
      
      // Choose icon based on file type
      let icon = 'fa-file';
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
        icon = 'fa-file-image';
      } else if (['doc', 'docx', 'txt', 'pdf'].includes(extension)) {
        icon = 'fa-file-alt';
      } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        icon = 'fa-file-excel';
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        icon = 'fa-file-archive';
      }
      
      // Format file size
      let fileSize = '';
      if (file.size < 1024) {
        fileSize = file.size + ' bytes';
      } else if (file.size < 1048576) {
        fileSize = (file.size / 1024).toFixed(1) + ' KB';
      } else {
        fileSize = (file.size / 1048576).toFixed(1) + ' MB';
      }
      
      fileItem.innerHTML = `
        <i class="file-icon fas ${icon}"></i>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${fileSize}</span>
        <span class="file-remove"><i class="fas fa-times"></i></span>
      `;
      
      fileList.appendChild(fileItem);
      
      // Add remove functionality
      fileItem.querySelector('.file-remove').addEventListener('click', function() {
        fileItem.remove();
      });
    });
  }
}

// Auto Save Functionality
function initAutoSave() {
  const form = document.getElementById('project-form');
  const formElements = form?.elements;
  const autoSaveDelay = 3000; // 3 seconds
  let autoSaveTimeout;
  
  if (!form) return;
  
  // Add event listeners to all form fields
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      element.addEventListener('input', scheduleAutoSave);
      element.addEventListener('change', scheduleAutoSave);
    }
  }
  
  function scheduleAutoSave() {
    // Clear previous timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Schedule new auto save
    autoSaveTimeout = setTimeout(autoSave, autoSaveDelay);
    
    // Show saving indicator
    const saveIndicator = document.getElementById('auto-save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = '저장 중...';
      saveIndicator.style.display = 'block';
    }
  }
  
  function autoSave() {
    // In a real application, you would send the form data to the server
    // For this demo, we'll just simulate saving
    console.log('자동 저장 실행...');
    
    // Show saved indicator
    const saveIndicator = document.getElementById('auto-save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = '저장됨';
      
      // Hide after 2 seconds
      setTimeout(() => {
        saveIndicator.style.display = 'none';
      }, 2000);
    }
    
    // Store form data in localStorage for demo
    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    localStorage.setItem('projectFormData', JSON.stringify(formObject));
  }
  
  // Load saved data on page load
  function loadSavedData() {
    const savedData = localStorage.getItem('projectFormData');
    if (savedData) {
      const formObject = JSON.parse(savedData);
      
      for (const key in formObject) {
        const element = form.elements[key];
        if (element) {
          element.value = formObject[key];
        }
      }
      
      // Update visual elements
      initRatingSystem();
      initStatusSelector();
      initProgressVisuals();
    }
  }
  
  // Load saved data if available
  loadSavedData();
}