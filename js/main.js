// Main JavaScript for Project Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initProjectCodeGenerator();
    initRatingStars();
    initDatePickers();
    initFileUpload();
    initRelationships();
    initReferenceUrls();
    initProjectForm();
});

// Project form initialization
function initProjectForm() {
    const projectForm = document.getElementById('project-form');
    if (!projectForm) return;

    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const requiredFields = projectForm.querySelectorAll('[required]');
        let valid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('invalid');
                
                // Add error message if not exists
                let errorMsg = field.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = '필수 입력 항목입니다';
                    field.parentElement.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('invalid');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
        
        if (valid) {
            // Here you would normally send the data to the server
            // For demo purposes, we'll just show a success message
            alert('프로젝트가 성공적으로 등록되었습니다!');
            projectForm.reset();
            
            // Reset other components
            resetRatingStars();
            document.getElementById('file-list').innerHTML = '';
        }
    });
}

// Project Code Generator
function initProjectCodeGenerator() {
    const yearInput = document.getElementById('project-year');
    const categorySelect = document.getElementById('project-category');
    const majorClassSelect = document.getElementById('project-major-class');
    const minorClassSelect = document.getElementById('project-minor-class');
    const versionInput = document.getElementById('project-version');
    const resultDisplay = document.getElementById('project-code-result');
    
    if (!yearInput || !resultDisplay) return;
    
    // Set current year as default
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;
    
    // Update project code on any input change
    const inputs = [yearInput, categorySelect, majorClassSelect, minorClassSelect, versionInput];
    inputs.forEach(input => {
        if (!input) return;
        input.addEventListener('change', updateProjectCode);
    });
    
    // Initial code generation
    updateProjectCode();
    
    function updateProjectCode() {
        const year = yearInput.value || currentYear;
        const category = categorySelect.value || 'A';
        const majorClass = (majorClassSelect.value || '01').padStart(2, '0');
        const minorClass = (minorClassSelect.value || '001').padStart(3, '0');
        const version = versionInput.value || '0.1';
        
        const projectCode = `${year}-${category}-${majorClass}-${minorClass}-Ver${version}`;
        resultDisplay.textContent = projectCode;
    }
}

// Rating Stars (Importance & Urgency)
function initRatingStars() {
    const ratingContainers = document.querySelectorAll('.rating-stars');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const hiddenInput = container.querySelector('input[type="hidden"]');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                updateStars(stars, value);
                if (hiddenInput) hiddenInput.value = value;
            });
        });
    });
}

function updateStars(stars, activeValue) {
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= activeValue) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetRatingStars() {
    const ratingContainers = document.querySelectorAll('.rating-stars');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const hiddenInput = container.querySelector('input[type="hidden"]');
        
        // Reset to 1 star active
        updateStars(stars, 1);
        if (hiddenInput) hiddenInput.value = 1;
    });
}

// Date Pickers
function initDatePickers() {
    const startDateInput = document.getElementById('project-start-date');
    const endDateInput = document.getElementById('project-end-date');
    const receptionDateInput = document.getElementById('project-reception-date');
    const progressInput = document.getElementById('project-progress');
    const scheduleProgressBar = document.getElementById('schedule-progress');
    const scheduleProgressText = document.getElementById('schedule-progress-text');
    
    if (!startDateInput || !endDateInput || !receptionDateInput) return;
    
    // Set today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    startDateInput.value = todayString;
    
    // Set next week as end date
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekString = nextWeek.toISOString().split('T')[0];
    endDateInput.value = nextWeekString;
    
    // Set current date and time for reception date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    receptionDateInput.value = now.toISOString().slice(0, 16);
    
    // Set minimum end date to be start date
    startDateInput.addEventListener('change', function() {
        endDateInput.min = startDateInput.value;
        
        // If end date is before start date, update it
        if (endDateInput.value < startDateInput.value) {
            endDateInput.value = startDateInput.value;
        }
        
        updateScheduleProgress();
    });
    
    endDateInput.addEventListener('change', updateScheduleProgress);
    
    // Update progress when project progress changes
    if (progressInput) {
        progressInput.addEventListener('input', function() {
            // You could add additional visualization here if needed
        });
    }
    
    // Initial calculation of schedule progress
    updateScheduleProgress();
    
    function updateScheduleProgress() {
        if (!scheduleProgressBar || !scheduleProgressText) return;
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const currentDate = new Date();
        
        // Calculate schedule progress
        let progress = 0;
        
        if (currentDate < startDate) {
            progress = 0;
        } else if (currentDate > endDate) {
            progress = 100;
        } else {
            const totalDuration = endDate - startDate;
            const elapsedDuration = currentDate - startDate;
            progress = Math.round((elapsedDuration / totalDuration) * 100);
        }
        
        // Update UI
        scheduleProgressBar.style.width = `${progress}%`;
        scheduleProgressText.textContent = `${progress}% 경과`;
    }
}

// File Upload
function initFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileList = document.getElementById('file-list');
    
    if (!fileUpload || !fileDropArea || !fileList) return;
    
    // Handle file selection through input
    fileUpload.addEventListener('change', handleFileSelect);
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileDropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        fileDropArea.classList.remove('highlight');
    }
    
    fileDropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });
    
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        [...files].forEach(file => {
            addFileToList(file);
        });
    }
    
    function addFileToList(file) {
        const item = document.createElement('li');
        item.innerHTML = `
            <span>${file.name}</span>
            <button type="button" class="btn btn-danger btn-sm">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(item);
        
        // Add delete functionality
        item.querySelector('.btn').addEventListener('click', function() {
            fileList.removeChild(item);
        });
    }
}

// Project Relationships
function initRelationships() {
    const container = document.getElementById('project-relationships');
    const addBtn = document.getElementById('add-relationship');
    
    if (!container || !addBtn) return;
    
    addBtn.addEventListener('click', addRelationship);
    
    function addRelationship() {
        const index = container.children.length;
        const relationshipDiv = document.createElement('div');
        relationshipDiv.className = 'form-row mb-10';
        relationshipDiv.innerHTML = `
            <div class="form-col">
                <div class="form-group">
                    <label>관련 프로젝트</label>
                    <select class="form-control" name="related-project[]">
                        <option value="">프로젝트 선택</option>
                        <option value="고객 데이터 분석 시스템">고객 데이터 분석 시스템</option>
                        <option value="모바일 앱 리뉴얼">모바일 앱 리뉴얼</option>
                        <option value="전자문서 관리 시스템">전자문서 관리 시스템</option>
                        <option value="인공지능 챗봇 개발">인공지능 챗봇 개발</option>
                        <option value="프로젝트 관리 시스템 구축">프로젝트 관리 시스템 구축</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label>관계도</label>
                    <select class="form-control" name="relationship-level[]">
                        <option value="상">상</option>
                        <option value="중" selected>중</option>
                        <option value="하">하</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label>관계성 설명</label>
                    <div class="input-group">
                        <input type="text" class="form-control" name="relationship-description[]" placeholder="관계성 설명">
                        <button type="button" class="btn btn-danger btn-search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(relationshipDiv);
        
        // Add delete event listener
        const deleteBtn = relationshipDiv.querySelector('.btn-danger');
        deleteBtn.addEventListener('click', function() {
            container.removeChild(relationshipDiv);
        });
    }
}

// Reference URLs
function initReferenceUrls() {
    const container = document.getElementById('reference-urls');
    const addBtn = document.getElementById('add-url');
    
    if (!container || !addBtn) return;
    
    addBtn.addEventListener('click', addReferenceUrl);
    
    function addReferenceUrl() {
        const urlRow = document.createElement('div');
        urlRow.className = 'form-row mb-10';
        urlRow.innerHTML = `
            <div class="form-col">
                <input type="text" class="form-control" name="ref-title[]" placeholder="사이트명/유튜브 제목">
            </div>
            <div class="form-col">
                <div class="input-group">
                    <input type="url" class="form-control" name="ref-url[]" placeholder="URL">
                    <button type="button" class="btn btn-danger btn-search" onclick="removeUrl(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(urlRow);
    }
}

// Remove URL row
function removeUrl(button) {
    const row = button.closest('.form-row');
    if (row) {
        const container = row.parentElement;
        container.removeChild(row);
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Select person from modal
function selectPerson(type, name, email) {
    if (type === 'provider') {
        document.getElementById('project-provider').value = name;
        document.getElementById('project-provider-email').value = email;
        closeModal('provider-search');
    } else if (type === 'deliverer') {
        document.getElementById('project-deliverer').value = name;
        document.getElementById('project-deliverer-email').value = email;
        closeModal('deliverer-search');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});