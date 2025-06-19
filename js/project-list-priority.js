// Project List Priority Management

document.addEventListener('DOMContentLoaded', function() {
  initProjectPriority();
});

function initProjectPriority() {
  const projectTable = document.querySelector('.project-list');
  const tbody = projectTable?.querySelector('tbody');
  let draggedRow = null;
  let isDraggingEnabled = false;
  
  if (!projectTable || !tbody) return;
  
  // Add priority numbers to rows
  updatePriorityNumbers();
  
  // Initialize drag and drop
  initDragAndDrop();
  
  // Initialize priority mode toggle
  const priorityModeToggle = document.getElementById('priority-mode-toggle');
  if (priorityModeToggle) {
    priorityModeToggle.addEventListener('click', function() {
      togglePriorityMode();
    });
  }
  
  // Initialize save button
  const saveButton = document.getElementById('save-priorities');
  if (saveButton) {
    saveButton.addEventListener('click', function() {
      savePriorities();
    });
  }
  
  function togglePriorityMode() {
    isDraggingEnabled = !isDraggingEnabled;
    priorityModeToggle.classList.toggle('active');
    
    if (isDraggingEnabled) {
      priorityModeToggle.innerHTML = '<i class="fas fa-check"></i> 우선순위 수정 모드';
      projectTable.classList.add('priority-mode');
      document.querySelectorAll('.priority-handle').forEach(handle => {
        handle.style.visibility = 'visible';
      });
    } else {
      priorityModeToggle.innerHTML = '<i class="fas fa-sort"></i> 우선순위 수정';
      projectTable.classList.remove('priority-mode');
      document.querySelectorAll('.priority-handle').forEach(handle => {
        handle.style.visibility = 'hidden';
      });
    }
  }
  
  function updatePriorityNumbers() {
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
      // If priority cell doesn't exist, create it
      if (!row.querySelector('.priority-cell')) {
        const priorityCell = document.createElement('td');
        priorityCell.className = 'priority-cell';
        priorityCell.innerHTML = `
          <span class="priority-number">${index + 1}</span>
          <span class="priority-handle" style="visibility: hidden;">
            <i class="fas fa-grip-lines"></i>
          </span>
          <div class="priority-dropdown">
            <button class="priority-dropdown-btn">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="priority-dropdown-content">
              <button class="move-to-top">맨 위로</button>
              <button class="move-up">위로</button>
              <button class="move-down">아래로</button>
              <button class="move-to-bottom">맨 아래로</button>
            </div>
          </div>
        `;
        
        row.insertBefore(priorityCell, row.firstChild);
        
        // Add event listeners to dropdown buttons
        priorityCell.querySelector('.move-to-top').addEventListener('click', () => moveRow(row, 'top'));
        priorityCell.querySelector('.move-up').addEventListener('click', () => moveRow(row, 'up'));
        priorityCell.querySelector('.move-down').addEventListener('click', () => moveRow(row, 'down'));
        priorityCell.querySelector('.move-to-bottom').addEventListener('click', () => moveRow(row, 'bottom'));
      } else {
        // Just update the number
        const priorityNumber = row.querySelector('.priority-number');
        if (priorityNumber) {
          priorityNumber.textContent = index + 1;
        }
      }
    });
  }
  
  function initDragAndDrop() {
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
      // Make row draggable
      row.setAttribute('draggable', 'true');
      
      // Add drag event listeners
      row.addEventListener('dragstart', handleDragStart);
      row.addEventListener('dragover', handleDragOver);
      row.addEventListener('dragenter', handleDragEnter);
      row.addEventListener('dragleave', handleDragLeave);
      row.addEventListener('dragend', handleDragEnd);
      row.addEventListener('drop', handleDrop);
      
      // Add click handler for the drag handle
      const dragHandle = row.querySelector('.priority-handle');
      if (dragHandle) {
        dragHandle.addEventListener('mousedown', function(e) {
          if (!isDraggingEnabled) return;
          // Prevent event propagation to allow dragging only from the handle
          e.stopPropagation();
          row.draggable = true;
        });
      }
    });
  }
  
  function handleDragStart(e) {
    if (!isDraggingEnabled) {
      e.preventDefault();
      return;
    }
    
    // Store the dragged row
    draggedRow = this;
    this.classList.add('dragging');
    
    // Set data for drag operation
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  }
  
  function handleDragOver(e) {
    if (!isDraggingEnabled || !draggedRow) {
      return;
    }
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  
  function handleDragEnter(e) {
    if (!isDraggingEnabled || !draggedRow) {
      return;
    }
    
    this.classList.add('drag-over');
  }
  
  function handleDragLeave(e) {
    if (!isDraggingEnabled || !draggedRow) {
      return;
    }
    
    this.classList.remove('drag-over');
  }
  
  function handleDragEnd(e) {
    if (!isDraggingEnabled) {
      return;
    }
    
    // Reset all rows
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      row.classList.remove('dragging', 'drag-over');
    });
    
    draggedRow = null;
  }
  
  function handleDrop(e) {
    if (!isDraggingEnabled || !draggedRow || draggedRow === this) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Get all rows and calculate the new position
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const draggedIndex = rows.indexOf(draggedRow);
    const targetIndex = rows.indexOf(this);
    
    // Move the row
    if (draggedIndex < targetIndex) {
      // Moving down
      tbody.insertBefore(draggedRow, this.nextSibling);
    } else {
      // Moving up
      tbody.insertBefore(draggedRow, this);
    }
    
    // Highlight the moved row
    draggedRow.classList.add('highlight');
    setTimeout(() => {
      draggedRow.classList.remove('highlight');
    }, 1000);
    
    // Update all priority numbers
    updatePriorityNumbers();
    
    // Show save indicator
    showSaveIndicator('변경사항이 있습니다. 저장 버튼을 클릭하세요.');
  }
  
  function moveRow(row, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const currentIndex = rows.indexOf(row);
    
    switch (direction) {
      case 'top':
        if (currentIndex > 0) {
          tbody.insertBefore(row, rows[0]);
        }
        break;
      case 'up':
        if (currentIndex > 0) {
          tbody.insertBefore(row, rows[currentIndex - 1]);
        }
        break;
      case 'down':
        if (currentIndex < rows.length - 1) {
          tbody.insertBefore(row, rows[currentIndex + 1].nextSibling);
        }
        break;
      case 'bottom':
        if (currentIndex < rows.length - 1) {
          tbody.appendChild(row);
        }
        break;
    }
    
    // Highlight the moved row
    row.classList.add('highlight');
    setTimeout(() => {
      row.classList.remove('highlight');
    }, 1000);
    
    // Update all priority numbers
    updatePriorityNumbers();
    
    // Show save indicator
    showSaveIndicator('변경사항이 있습니다. 저장 버튼을 클릭하세요.');
  }
  
  function savePriorities() {
    // In a real application, you would send the new order to the server
    // For this demo, we'll just simulate saving
    
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = '저장 중...';
      saveIndicator.classList.add('visible');
      
      // Simulate API call
      setTimeout(() => {
        saveIndicator.textContent = '우선순위가 저장되었습니다!';
        
        // Hide after 2 seconds
        setTimeout(() => {
          saveIndicator.classList.remove('visible');
        }, 2000);
      }, 800);
    }
    
    // Store the new order in localStorage for demo purposes
    const rows = tbody.querySelectorAll('tr');
    const projectOrder = [];
    
    rows.forEach(row => {
      const projectCode = row.querySelector('td:nth-child(2)').textContent;
      const projectName = row.querySelector('td:nth-child(3)').textContent;
      
      projectOrder.push({
        code: projectCode,
        name: projectName
      });
    });
    
    localStorage.setItem('projectPriorityOrder', JSON.stringify(projectOrder));
  }
  
  function showSaveIndicator(message) {
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = message;
      saveIndicator.classList.add('visible');
      
      // Hide after 3 seconds
      setTimeout(() => {
        saveIndicator.classList.remove('visible');
      }, 3000);
    }
  }
}