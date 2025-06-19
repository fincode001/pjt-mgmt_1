// 프로젝트 리스트 상세 보기 기능

document.addEventListener('DOMContentLoaded', function() {
  // 프로젝트 이름에 클릭 이벤트 추가
  initProjectNameLinks();
  // 보기, 수정, 삭제 버튼에 이벤트 추가
  initActionButtons();
});

/**
 * 프로젝트 이름에 클릭 이벤트를 추가하는 함수
 */
function initProjectNameLinks() {
  const projectNames = document.querySelectorAll('.project-name');
  
  projectNames.forEach(projectName => {
    // 클릭 이벤트로 변경 (더블클릭에서 일반 클릭으로 변경)
    projectName.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 프로젝트 ID 가져오기
      const projectId = this.dataset.projectId;
      
      if (projectId) {
        // 프로젝트 상세 페이지로 이동
        window.location.href = `project-detail.html?id=${projectId}`;
      }
    });
    
    // 툴팁 추가
    projectName.setAttribute('title', '클릭하여 상세 정보 보기');
  });
}

/**
 * 액션 버튼(보기, 수정, 삭제)에 이벤트를 추가하는 함수
 */
function initActionButtons() {
  // 모든 프로젝트 행에서 버튼 찾기
  const rows = document.querySelectorAll('.project-list tbody tr');
  
  rows.forEach(row => {
    // 프로젝트 ID 가져오기 (행 내 project-name 요소에서)
    const projectNameEl = row.querySelector('.project-name');
    const projectId = projectNameEl ? projectNameEl.dataset.projectId : null;
    
    if (!projectId) return;
    
    // 보기 버튼
    const viewBtn = row.querySelector('.btn-sm:first-child');
    if (viewBtn) {
      viewBtn.addEventListener('click', function() {
        window.location.href = `project-detail.html?id=${projectId}`;
      });
    }
    
    // 수정 버튼
    const editBtn = row.querySelector('.btn-primary');
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        // 편집 모드로 프로젝트 상세 페이지로 이동
        window.location.href = `project-detail.html?id=${projectId}&mode=edit`;
      });
    }
    
    // 삭제 버튼
    const deleteBtn = row.querySelector('.btn-danger');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        // 삭제 확인 창
        if (confirm('이 프로젝트를 정말 삭제하시겠습니까?')) {
          // 실제 구현에서는 여기서 서버에 삭제 요청을 보내고 성공 시 목록에서 제거
          alert('프로젝트가 삭제되었습니다.');
          row.remove(); // UI에서 즉시 제거 (데모용)
        }
      });
    }
  });
}