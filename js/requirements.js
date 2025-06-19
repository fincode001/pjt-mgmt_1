// Project Requirements Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initProjectRequirements();
});

// Initialize Tabs
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabs.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to current tab and content
      this.classList.add('active');
      document.getElementById(tabId + '-tab').classList.add('active');
    });
  });
}

// Initialize Project Requirements
function initProjectRequirements() {
  // Sample data for demonstration
  const requirementsData = {
    '2025-A-01-001-Ver0.1': [
      {
        id: 'req001',
        project: '프로젝트 관리 시스템 구축',
        projectId: '2025-A-01-001-Ver0.1',
        registrant: '홍길동',
        registrantType: 'user',
        type: 'new',
        typeLabel: '신규 개발요구사항',
        title: '진척률 실시간 대시보드 구현',
        content: '프로젝트 진척률을 실시간으로 확인할 수 있는 대시보드 화면이 필요합니다. 차트 형태로 시각화하여 프로젝트 관리자가 한눈에 현황을 파악할 수 있어야 합니다.\n\n요구사항 상세:\n1. 프로젝트별 진척률 비교 차트\n2. 일정 경과율 대비 진척률 비교\n3. 중요도/긴급도별 프로젝트 분류\n4. 각 프로젝트 담당자별 업무 현황',
        lastModified: '2025-06-01 14:30',
        hasAttachment: true,
        attachments: [
          { name: 'dashboard_mockup.png', path: '/files/req001/' }
        ]
      },
      {
        id: 'req006',
        project: '프로젝트 관리 시스템 구축',
        projectId: '2025-A-01-001-Ver0.1',
        registrant: 'DeepSeek R1',
        registrantType: 'ai',
        type: 'improvement',
        typeLabel: '기타 개선 제안 사항',
        title: 'UI/UX 개선 방안',
        content: '프로젝트 관리 시스템의 사용자 경험을 분석한 결과, 다음과 같은 UI/UX 개선이 필요합니다.\n\n1. 네비게이션 구조 단순화\n2. 주요 기능 접근성 향상\n3. 일관된 색상 체계 적용\n4. 모바일 반응형 디자인 강화',
        lastModified: '2025-06-03 09:22',
        hasAttachment: false,
        attachments: []
      }
    ],
    '2025-A-02-001-Ver0.1': [
      {
        id: 'req002',
        project: '전자문서 관리 시스템',
        projectId: '2025-A-02-001-Ver0.1',
        registrant: '김철수',
        registrantType: 'user',
        type: 'change',
        typeLabel: '요구사항 변경',
        title: '문서 검색 기능 개선',
        content: '기존 단순 검색에서 고급 검색 기능으로 변경이 필요합니다. 태그 기반 검색과 전문(Full-text) 검색을 지원해야 합니다.\n\n변경 사유: 문서량 증가로 인한 검색 효율성 저하 문제 해결\n\n주요 변경 사항:\n1. 고급 검색 필터 추가\n2. 태그 기반 검색 기능\n3. 파일 내용 전문 검색\n4. 검색 결과 정렬 옵션',
        lastModified: '2025-05-30 09:15',
        hasAttachment: false,
        attachments: []
      }
    ],
    '2025-B-01-002-Ver1.3': [
      {
        id: 'req003',
        project: '고객 데이터 분석 시스템',
        projectId: '2025-B-01-002-Ver1.3',
        registrant: 'ChatGPT',
        registrantType: 'ai',
        type: 'additional',
        typeLabel: '추가 요구사항',
        title: 'AI 기반 예측 모델 추가',
        content: '기존 통계 분석에 더해 AI 머신러닝 기반의 예측 모델을 추가하여 고객 행동 패턴을 예측하고 선제적 대응이 가능한 기능이 필요합니다.\n\n추가 기능:\n1. 고객 이탈 예측 모델\n2. 구매 패턴 예측\n3. 상품 추천 시스템\n4. 이상 행동 감지',
        lastModified: '2025-05-28 16:45',
        hasAttachment: true,
        attachments: [
          { name: 'ml_requirements.pdf', path: '/files/req003/' },
          { name: 'model_specs.docx', path: '/files/req003/' }
        ]
      }
    ],
    '2025-C-03-001-Ver0.2': [
      {
        id: 'req004',
        project: '인공지능 챗봇 개발',
        projectId: '2025-C-03-001-Ver0.2',
        registrant: '박민수',
        registrantType: 'user',
        type: 'bug',
        typeLabel: '오류수정',
        title: '한국어 자연어 처리 개선',
        content: '현재 챗봇이 복잡한 한국어 문장을 제대로 이해하지 못하는 문제가 있습니다. 특히 존댓말과 반말 구분, 한국어 특유의 생략된 주어 처리, 문맥 이해에 어려움이 있습니다.\n\n해결 방안:\n1. 한국어 특화 NLP 모델 도입\n2. 문맥 이해를 위한 대화 기록 활용 최적화\n3. 한국어 언어모델 파인튜닝',
        lastModified: '2025-05-25 11:20',
        hasAttachment: false,
        attachments: []
      }
    ],
    '2025-B-02-003-Ver0.5': [
      {
        id: 'req005',
        project: '모바일 앱 리뉴얼',
        projectId: '2025-B-02-003-Ver0.5',
        registrant: 'Claude Sonnet',
        registrantType: 'ai',
        type: 'improvement',
        typeLabel: '개선 제안',
        title: '사용자 경험 개선 방안',
        content: '현재 앱의 사용자 인터페이스를 분석한 결과, 네비게이션 구조 개선과 터치 친화적인 디자인 요소가 필요합니다. 사용자 테스트 결과를 바탕으로 다음 개선사항을 제안합니다.\n\n1. 바텀 네비게이션 바 도입\n2. 제스처 기반 인터랙션 추가\n3. 시각적 계층구조 명확화\n4. 접근성 가이드라인 준수\n5. 다크 모드 지원',
        lastModified: '2025-05-22 13:10',
        hasAttachment: true,
        attachments: [
          { name: 'ux_analysis.pdf', path: '/files/req005/' },
          { name: 'wireframes.zip', path: '/files/req005/' }
        ]
      }
    ]
  };
  
  // Save to local storage for demo purposes
  localStorage.setItem('requirementsData', JSON.stringify(requirementsData));
}

// Load requirements for a specific project
function loadProjectRequirements() {
  const projectId = document.getElementById('project-selector').value;
  const container = document.getElementById('project-requirements-container');
  
  if (!projectId) {
    container.innerHTML = '<p class="text-center">프로젝트를 선택하면 해당 프로젝트의 요구사항 목록이 표시됩니다.</p>';
    return;
  }
  
  // Get requirements data from localStorage
  const requirementsData = JSON.parse(localStorage.getItem('requirementsData')) || {};
  const projectRequirements = requirementsData[projectId] || [];
  
  if (projectRequirements.length === 0) {
    container.innerHTML = '<p class="text-center">선택한 프로젝트의 요구사항이 없습니다.</p>';
    return;
  }
  
  // Build HTML table
  let html = `
    <div class="form-section">
      <div class="form-header">
        <span>${projectRequirements[0].project} 요구사항 목록</span>
        <button class="add-requirement-btn" onclick="location.href='project-requirements.html?projectId=${projectId}'">
          <i class="fas fa-plus"></i> 새 요구사항 등록
        </button>
      </div>
      <div class="form-body">
        <table class="requirements-table">
          <thead>
            <tr>
              <th style="width: 100px;">등록자</th>
              <th style="width: 100px;">구분</th>
              <th style="width: 250px;">요구사항 제목</th>
              <th style="width: 350px;">요구사항 내용 (일부)</th>
              <th style="width: 120px;">최종 변경일</th>
              <th style="width: 60px;">첨부파일</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  projectRequirements.forEach(req => {
    html += `
      <tr>
        <td>
          <div class="registrant-type">
            <span>${req.registrant}</span>
            ${req.registrantType === 'ai' ? '<span class="ai-badge">AI</span>' : ''}
          </div>
        </td>
        <td>
          <span class="requirement-type type-${req.type}">${req.typeLabel}</span>
        </td>
        <td>
          <span class="requirement-title" onclick="viewRequirement('${req.id}')">${req.title}</span>
        </td>
        <td class="content-preview">${req.content.substring(0, 100)}...</td>
        <td class="date">${req.lastModified}</td>
        <td class="has-attachment">
          ${req.hasAttachment ? '<i class="fas fa-paperclip" title="첨부파일 있음"></i>' : '<i class="fas fa-times" title="첨부파일 없음"></i>'}
        </td>
      </tr>
    `;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// Apply filters to requirements list
function applyFilters() {
  const searchText = document.getElementById('global-search').value.toLowerCase();
  const typeFilter = document.getElementById('type-filter').value;
  const registrantFilter = document.getElementById('registrant-filter').value;
  
  const requirementsRows = document.querySelectorAll('#requirements-list tr');
  
  requirementsRows.forEach(row => {
    let showRow = true;
    
    // Apply text search filter
    if (searchText) {
      const title = row.querySelector('.requirement-title').textContent.toLowerCase();
      const content = row.querySelector('.content-preview').textContent.toLowerCase();
      if (!title.includes(searchText) && !content.includes(searchText)) {
        showRow = false;
      }
    }
    
    // Apply type filter
    if (typeFilter && showRow) {
      const typeElement = row.querySelector('.requirement-type');
      if (typeElement && !typeElement.classList.contains('type-' + typeFilter)) {
        showRow = false;
      }
    }
    
    // Apply registrant filter
    if (registrantFilter && showRow) {
      const hasAiBadge = row.querySelector('.ai-badge') !== null;
      if ((registrantFilter === 'user' && hasAiBadge) || 
          (registrantFilter !== 'user' && !hasAiBadge)) {
        showRow = false;
      }
      
      // Specific AI model filter
      if (registrantFilter !== 'user' && hasAiBadge) {
        const registrantText = row.querySelector('.registrant-type span').textContent.toLowerCase();
        if (!registrantText.includes(registrantFilter)) {
          showRow = false;
        }
      }
    }
    
    // Show or hide row
    row.style.display = showRow ? '' : 'none';
  });
}

// Perform unified search across all projects
function performUnifiedSearch() {
  const searchText = document.getElementById('unified-search').value.toLowerCase();
  const searchType = document.querySelector('input[name="search-type"]:checked').value;
  const container = document.getElementById('search-results-container');
  
  if (!searchText) {
    container.innerHTML = '<p class="text-center">검색 키워드를 입력하고 검색 버튼을 클릭하세요.</p>';
    return;
  }
  
  // Get requirements data from localStorage
  const requirementsData = JSON.parse(localStorage.getItem('requirementsData')) || {};
  
  // Collect all requirements
  let allRequirements = [];
  Object.keys(requirementsData).forEach(projectId => {
    requirementsData[projectId].forEach(req => {
      allRequirements.push(req);
    });
  });
  
  // Filter requirements based on search
  const filteredRequirements = allRequirements.filter(req => {
    if (searchType === 'exact') {
      return req.title.toLowerCase().includes(searchText) || 
             req.content.toLowerCase().includes(searchText);
    } else {
      // Partial match - split search into words
      const searchWords = searchText.split(/\s+/);
      return searchWords.some(word => 
        req.title.toLowerCase().includes(word) || 
        req.content.toLowerCase().includes(word)
      );
    }
  });
  
  if (filteredRequirements.length === 0) {
    container.innerHTML = '<p class="text-center">검색 결과가 없습니다.</p>';
    return;
  }
  
  // Build HTML table
  let html = `
    <div class="form-section">
      <div class="form-header">
        <span>검색 결과: "${searchText}" (${filteredRequirements.length}건)</span>
      </div>
      <div class="form-body">
        <table class="requirements-table">
          <thead>
            <tr>
              <th style="width: 150px;">프로젝트명</th>
              <th style="width: 120px;">프로젝트 ID</th>
              <th style="width: 100px;">구분</th>
              <th style="width: 200px;">요구사항 제목</th>
              <th style="width: 300px;">요구사항 내용 (일부)</th>
              <th style="width: 120px;">최종 변경일</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  filteredRequirements.forEach(req => {
    html += `
      <tr>
        <td>${req.project}</td>
        <td class="project-id">${req.projectId}</td>
        <td>
          <span class="requirement-type type-${req.type}">${req.typeLabel}</span>
        </td>
        <td>
          <span class="requirement-title" onclick="viewRequirement('${req.id}')">${req.title}</span>
        </td>
        <td class="content-preview">${highlightSearchText(req.content.substring(0, 100), searchText)}...</td>
        <td class="date">${req.lastModified}</td>
      </tr>
    `;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// Highlight search text in content preview
function highlightSearchText(content, searchText) {
  if (!searchText) return content;
  
  const regex = new RegExp(searchText, 'gi');
  return content.replace(regex, match => `<mark>${match}</mark>`);
}

// View requirement details
function viewRequirement(requirementId) {
  // In a real application, this would navigate to a detail page
  // For demo purposes, we'll just show an alert
  const allRequirements = [];
  
  // Get requirements data from localStorage
  const requirementsData = JSON.parse(localStorage.getItem('requirementsData')) || {};
  
  // Collect all requirements
  Object.keys(requirementsData).forEach(projectId => {
    requirementsData[projectId].forEach(req => {
      allRequirements.push(req);
    });
  });
  
  // Find requirement by ID
  const requirement = allRequirements.find(req => req.id === requirementId);
  
  if (requirement) {
    // In a real app, redirect to detail page
    // window.location.href = `requirement-detail.html?id=${requirementId}`;
    
    // For demo, show alert with requirement details
    alert(`요구사항 상세 정보:\n\n제목: ${requirement.title}\n\n내용: ${requirement.content.substring(0, 200)}...\n\n이 부분은 실제로는 상세 페이지로 이동합니다.`);
  }
}

// Save settings
function saveSettings() {
  const settings = {
    filePath: document.getElementById('file-save-path').value,
    autoBackup: document.getElementById('auto-backup').checked,
    backupInterval: document.getElementById('backup-interval').value,
    fontSize: document.getElementById('font-size').value,
    autoSave: document.getElementById('auto-save').checked
  };
  
  localStorage.setItem('requirementSettings', JSON.stringify(settings));
  alert('설정이 저장되었습니다.');
}

// Reset settings to default
function resetSettings() {
  document.getElementById('file-save-path').value = '/project_files/requirements/';
  document.getElementById('auto-backup').checked = true;
  document.getElementById('backup-interval').value = 'weekly';
  document.getElementById('font-size').value = '14';
  document.getElementById('auto-save').checked = true;
  
  saveSettings();
  alert('설정이 기본값으로 복원되었습니다.');
}

// Select file path (mock function as real file system access is not available in browser)
function selectFilePath() {
  alert('실제 애플리케이션에서는 여기서 파일 경로 선택 대화상자가 표시됩니다.');
}

// Get URL parameters (helper function)
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}