# 프로젝트 관리 시스템 (PMS) - 추가 요구사항

**문서 버전:** 1.1  
**작성일:** 2025-06-05  
**업데이트일:** 2025-06-05  

---

## 추가 기능 요구사항

### 1. AI 기반 질의응답 시스템

#### 1.1. 기능 개요
- 사용자와 인공지능 간의 양방향 질의응답 기능
- 요구사항 관리 프로세스에 AI 보조 기능 추가
- 스레드 형태의 대화 구조로 연속적인 질의응답 지원

#### 1.2. 상세 기능

**F-013: AI 질의응답 시스템**
- 사용자가 AI에게 질문을 할 수 있고, AI가 사용자에게 질문을 할 수 있는 양방향 소통
- 질문-답변 형태의 스레드 구조 (원글 → 답글 → 추가 답글)
- 각 질의응답은 특정 요구사항 또는 프로젝트와 연결
- 우선순위: **높음**

**권한 구조:**
- **사용자**: CRUD (생성, 읽기, 수정, 삭제) 모든 권한
- **AI**: CR (생성, 읽기) 권한만 보유

#### 1.3. 질의응답 유형

**질문 유형:**
1. **사용자 → AI**: 요구사항에 대한 명확화 요청
2. **AI → 사용자**: 요구사항의 애매한 부분에 대한 추가 질문
3. **사용자 → 사용자**: 팀원 간 질의응답 (기존 기능 확장)

**답변 처리:**
- 모든 답변은 원본 질문에 대한 참조(Reference) 필수
- 중첩 답변 구조 지원 (최대 5단계 깊이)
- 실시간 알림 및 이메일 알림 지원

### 2. 요구사항 관리 확장

#### 2.1. 요구사항 등록 방식 세분화

**F-014: 요구사항 등록 유형별 처리**

**신규 등록:**
- 완전히 새로운 요구사항 레코드 생성
- 고유 ID 자동 생성
- 기본 상태: '등록'
- **질문/답변 기능 지원**: 요구사항에 대한 질의응답 스레드 생성 가능

**수정:**
- 기존 레코드 업데이트
- 변경 이력 추적 (audit log)
- 수정 사유 입력 필수
- **질문/답변 기능 지원**: 수정 내용에 대한 질의응답 스레드 생성 가능
- **수정 사유에 대한 질의응답**: 수정 사유에 대한 추가 설명 요청 가능

**삭제:**
- 논리적 삭제 (소프트 삭제)
- 삭제 사유 입력 필수
- 관련 질의응답 내역은 보존
- **질문/답변 기능 지원**: 삭제 사유에 대한 질의응답 스레드 생성 가능

**추가 등록:**
- 기존 요구사항과 연관된 새로운 요구사항
- 부모-자식 관계 설정
- 연관성 표시
- **질문/답변 기능 지원**: 추가 등록된 요구사항과 원본 요구사항 간의 관계에 대한 질의응답 스레드 생성 가능

**개선 제안:**
- 기존 요구사항에 대한 개선안
- 제안 유형으로 분류
- 승인/거부 워크플로우 적용
- **질문/답변 기능 지원**: 개선 제안에 대한 세부 설명 요청 및 제공 가능
- **승인/거부 과정의 질의응답**: 워크플로우 과정에서 관련 질문과 답변 지원

#### 2.2. 질의응답 데이터 구조

**스레드 구조:**
```
원본 요구사항
├── AI 질문 1
│   ├── 사용자 답변 1
│   └── AI 질문 1-1
│       └── 사용자 답변 1-1
├── 사용자 질문 1
│   └── AI 답변 1
└── 사용자 추가 질문
    └── 팀원 답변
```

### 3. 최종정리 기능

#### 3.1. 기능 개요

**F-015: 프로젝트 최종정리 생성**
- 프로젝트의 모든 변경사항을 종합적으로 정리하는 기능
- 버튼 클릭 시점까지의 모든 데이터를 기반으로 정리 문서 생성
- 노션(Notion) 사이트 자동 연동 기능
- **질의응답 내용 포함**: 모든 요구사항 관련 질의응답 내역을 정리하여 포함
- **질의응답 해결 상태 추적**: 해결된 질문과 미해결된 질문을 구분하여 정리
- 우선순위: **높음**

#### 3.2. 정리 대상 데이터

**포함 데이터:**
1. **프로젝트 기본 정보**: 제목, 코드, 개요, 일정, 상태, 진척률
2. **요구사항 변경 이력**: 
   - 유지된 요구사항 및 관련 질의응답
   - 삭제된 요구사항 및 삭제 사유에 대한 질의응답
   - 변경된 요구사항 (변경 전후 비교) 및 변경 사유에 대한 질의응답
   - 새로 추가된 요구사항 및 관련 질의응답
   - 개선 제안된 요구사항 및 관련 질의응답
3. **질의응답 정리**:
   - 유형별 질의응답 분류 (사용자→AI, AI→사용자, 사용자→사용자)
   - 해결된 질의응답 스레드
   - 미해결 질의응답 스레드
   - AI 제안사항 및 이에 대한 사용자 피드백
   - 중요 질의응답 하이라이트
4. **프로젝트 관련 자료**: 첨부파일, 참고 URL, 환경 정보

#### 3.3. 정리 결과물

**정리 문서 구성:**
1. **프로젝트명**: 정리 대상 프로젝트의 전체 제목
2. **정리 내용**: 
   - 요약이 아닌 상세한 "정리" 형태
   - 시간순/카테고리별 구조화된 내용
   - 변경사항 추적 및 근거 제시
3. **생성 일시**: 정리 버튼을 누른 정확한 시점 (년/월/일/시/분)
4. **자동 배포**: 지정된 노션 사이트에 자동 전달

#### 3.4. 노션 연동 설정

**프로젝트 등록 시 추가 필드:**
- **노션 워크스페이스 ID**: 연동할 노션 워크스페이스 식별자
- **노션 페이지 ID**: 정리 문서가 생성될 특정 페이지 ID
- **노션 API 토큰**: 인증을 위한 API 토큰 (암호화 저장)

**노션 연동 프로세스:**
1. 정리 문서 생성
2. 노션 API를 통한 페이지 생성/업데이트
3. 연동 성공/실패 로그 기록
4. 실패 시 재시도 메커니즘

---

## 업데이트된 데이터베이스 설계

### 1. 기존 테이블 수정

#### 1.1. Projects 테이블 업데이트
```sql
ALTER TABLE projects ADD COLUMN notion_workspace_id VARCHAR(255);
ALTER TABLE projects ADD COLUMN notion_page_id VARCHAR(255);
ALTER TABLE projects ADD COLUMN notion_api_token_encrypted TEXT;
```

#### 1.2. Requirements 테이블 업데이트
```sql
ALTER TABLE requirements ADD COLUMN parent_requirement_id INTEGER REFERENCES requirements(id);
ALTER TABLE requirements ADD COLUMN requirement_action VARCHAR(20) CHECK (requirement_action IN ('new', 'update', 'delete', 'additional', 'improvement'));
ALTER TABLE requirements ADD COLUMN delete_reason TEXT;
ALTER TABLE requirements ADD COLUMN is_deleted BOOLEAN DEFAULT false;
```

### 2. 새로운 테이블 추가

#### 2.1. QnA_Threads (질의응답 스레드)
```sql
CREATE TABLE qna_threads (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES requirements(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    thread_type VARCHAR(20) CHECK (thread_type IN ('user_question', 'ai_question', 'discussion')),
    status VARCHAR(20) CHECK (status IN ('open', 'answered', 'closed')) DEFAULT 'open',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2. QnA_Messages (질의응답 메시지)
```sql
CREATE TABLE qna_messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES qna_threads(id) ON DELETE CASCADE,
    parent_message_id INTEGER REFERENCES qna_messages(id),
    content TEXT NOT NULL,
    author_type VARCHAR(10) CHECK (author_type IN ('user', 'ai')) NOT NULL,
    author_id INTEGER REFERENCES users(id), -- NULL for AI messages
    is_question BOOLEAN DEFAULT false,
    is_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3. Project_Summaries (프로젝트 정리)
```sql
CREATE TABLE project_summaries (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    summary_content TEXT NOT NULL,
    summary_type VARCHAR(20) CHECK (summary_type IN ('manual', 'scheduled', 'milestone')) DEFAULT 'manual',
    notion_page_url VARCHAR(500),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_snapshot JSONB -- 정리 시점의 프로젝트 전체 데이터 스냅샷
);
```

#### 2.4. Requirement_Audit_Log (요구사항 변경 이력)
```sql
CREATE TABLE requirement_audit_log (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES requirements(id) ON DELETE CASCADE,
    action_type VARCHAR(20) CHECK (action_type IN ('create', 'update', 'delete', 'restore')) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 인덱스 추가
```sql
-- QnA 검색 성능 향상
CREATE INDEX idx_qna_threads_project ON qna_threads(project_id);
CREATE INDEX idx_qna_threads_requirement ON qna_threads(requirement_id);
CREATE INDEX idx_qna_messages_thread ON qna_messages(thread_id);
CREATE INDEX idx_qna_messages_parent ON qna_messages(parent_message_id);

-- 정리 기능 성능 향상
CREATE INDEX idx_project_summaries_project ON project_summaries(project_id);
CREATE INDEX idx_requirement_audit_project ON requirement_audit_log(requirement_id);

-- 요구사항 계층 구조
CREATE INDEX idx_requirements_parent ON requirements(parent_requirement_id);
```

---

## 업데이트된 API 명세

### 1. 질의응답 API

#### 1.1. QnA 스레드 관리
| 메소드 | 경로 | 설명 | 권한 |
|------|------|------|------|
| GET | /api/v1/projects/{projectId}/qna/threads | QnA 스레드 목록 조회 | 멤버/PM |
| POST | /api/v1/projects/{projectId}/qna/threads | QnA 스레드 생성 | 멤버/PM |
| GET | /api/v1/projects/{projectId}/qna/threads/{threadId} | QnA 스레드 상세 조회 | 멤버/PM |
| PUT | /api/v1/projects/{projectId}/qna/threads/{threadId} | QnA 스레드 상태 변경 | 멤버/PM |

#### 1.2. QnA 메시지 관리
| 메소드 | 경로 | 설명 | 권한 |
|------|------|------|------|
| GET | /api/v1/qna/threads/{threadId}/messages | 메시지 목록 조회 | 멤버/PM |
| POST | /api/v1/qna/threads/{threadId}/messages | 메시지 생성 | 멤버/PM/AI |
| PUT | /api/v1/qna/threads/{threadId}/messages/{messageId} | 메시지 수정 | 작성자만 |
| DELETE | /api/v1/qna/threads/{threadId}/messages/{messageId} | 메시지 삭제 | 작성자만 |

#### 1.3. AI 질의응답 API
| 메소드 | 경로 | 설명 | 권한 |
|------|------|------|------|
| POST | /api/v1/ai/ask-question | AI가 사용자에게 질문 생성 | AI Only |
| POST | /api/v1/ai/generate-answer | AI 답변 생성 | AI Only |
| GET | /api/v1/ai/pending-questions | AI가 답변 대기 중인 질문 목록 | AI Only |

### 2. 프로젝트 정리 API

#### 2.1. 정리 기능 API
| 메소드 | 경로 | 설명 | 권한 |
|------|------|------|------|
| POST | /api/v1/projects/{projectId}/summary | 프로젝트 최종 정리 생성 | PM |
| GET | /api/v1/projects/{projectId}/summaries | 정리 이력 조회 | 멤버/PM |
| GET | /api/v1/projects/{projectId}/summaries/{summaryId} | 특정 정리 내용 조회 | 멤버/PM |
| POST | /api/v1/projects/{projectId}/summary/notion | 노션 연동 테스트 | PM |

### 3. 요구사항 확장 API

#### 3.1. 요구사항 관리 확장
| 메소드 | 경로 | 설명 | 권한 |
|------|------|------|------|
| GET | /api/v1/requirements/{requirementId}/history | 요구사항 변경 이력 조회 | 멤버/PM |
| POST | /api/v1/requirements/{requirementId}/improve | 개선 제안 등록 | 멤버/PM |
| GET | /api/v1/requirements/deleted | 삭제된 요구사항 조회 | PM |
| POST | /api/v1/requirements/{requirementId}/restore | 삭제된 요구사항 복원 | PM |

---

## 업데이트된 UI/UX 요구사항

### 1. 질의응답 인터페이스

#### 1.1. QnA 스레드 뷰
- **스레드 목록**: 카드 형태로 표시, 상태별 필터링 가능
- **스레드 상세**: 메신저 형태의 대화 인터페이스
- **AI 메시지 구분**: AI 메시지는 다른 색상/아이콘으로 구분
- **실시간 업데이트**: WebSocket 기반 실시간 메시지 표시

#### 1.2. 메시지 입력 인터페이스
- **리치 텍스트 에디터**: 마크다운 지원, 코드 블록, 이미지 첨부
- **답글 기능**: 특정 메시지에 대한 답글 작성
- **멘션 기능**: @사용자명으로 특정 사용자 호출

### 2. 프로젝트 정리 인터페이스

#### 2.1. 정리 버튼 및 설정
- **최종정리 버튼**: 프로젝트 상세 페이지 상단에 눈에 띄게 배치
- **정리 설정 모달**: 노션 연동 설정, 정리 범위 선택
- **진행 상태**: 정리 생성 중 진행률 표시

#### 2.2. 정리 결과 뷰
- **정리 내용 미리보기**: 생성된 정리 내용 확인
- **노션 연동 상태**: 연동 성공/실패 상태 표시
- **다운로드 기능**: PDF, 마크다운 형태로 다운로드

### 3. 요구사항 관리 확장 UI

#### 3.1. 요구사항 등록/수정 폼 개선
- **등록 유형 선택**: 신규/수정/삭제/추가/개선 라디오 버튼
- **관련 요구사항 선택**: 추가/개선 시 부모 요구사항 선택
- **변경 사유 입력**: 수정/삭제 시 필수 입력 필드

#### 3.2. 요구사항 이력 뷰
- **타임라인 뷰**: 시간순으로 변경 이력 표시
- **변경 내용 비교**: Before/After 형태로 변경 내용 시각화
- **복원 기능**: 삭제된 요구사항 복원 버튼

---

## 보안 및 권한 업데이트

### 1. AI 권한 관리
- **AI 계정**: 별도의 시스템 계정 생성 (user_type: 'ai')
- **제한된 권한**: 질의응답 생성(C), 조회(R)만 허용
- **API 인증**: AI 전용 API 키 및 인증 방식

### 2. 노션 연동 보안
- **API 토큰 암호화**: AES-256으로 암호화 후 저장
- **권한 검증**: 노션 API 호출 시 권한 검증
- **로그 기록**: 모든 노션 연동 시도 및 결과 로깅

### 3. 데이터 접근 제어
- **QnA 스레드**: 프로젝트 멤버만 접근 가능
- **정리 기능**: PM 이상 권한 필요
- **요구사항 이력**: 모든 멤버 조회 가능, 복원은 PM만 가능