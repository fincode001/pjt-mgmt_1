---

## 6. 데이터베이스 설계 (업데이트)

### 6.1. ERD (Entity Relationship Diagram)

```
Users ||--o{ Projects : creates
Users ||--o{ ProjectMembers : belongs_to
Projects ||--o{ ProjectMembers : has
Projects ||--o{ ProjectRelationships : source
Projects ||--o{ ProjectRelationships : target
Projects ||--o{ Requirements : has
Projects ||--o{ ProjectFiles : has
Projects ||--o{ ProjectUrls : has
Projects ||--o{ ProjectEnvironments : has
Projects ||--o{ ProjectServers : has
Projects ||--o{ ProjectSummaries : has
Requirements ||--o{ RequirementComments : has
Requirements ||--o{ Requirements : parent_of
Requirements ||--o{ RequirementAuditLog : has
Requirements ||--o{ QnAThreads : has
QnAThreads ||--o{ QnAMessages : has
QnAMessages ||--o{ QnAMessages : parent_of
```

### 6.2. 테이블 설계

#### 6.2.1. Users (사용자)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    user_type VARCHAR(10) CHECK (user_type IN ('human', 'ai')) DEFAULT 'human',
    theme_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.2. Projects (프로젝트)
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    overview TEXT,
    importance INTEGER CHECK (importance BETWEEN 1 AND 5),
    urgency INTEGER CHECK (urgency BETWEEN 1 AND 5),
    start_date DATE,
    end_date DATE,
    reception_date TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('not-started', 'in-progress', 'on-hold', 'completed')),
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    provider_name VARCHAR(100),
    provider_email VARCHAR(255),
    deliverer_name VARCHAR(100),
    deliverer_email VARCHAR(255),
    notion_workspace_id VARCHAR(255),
    notion_page_id VARCHAR(255),
    notion_api_token_encrypted TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.3. ProjectMembers (프로젝트 멤버)
```sql
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
```

#### 6.2.4. ProjectRelationships (프로젝트 관계)
```sql
CREATE TABLE project_relationships (
    id SERIAL PRIMARY KEY,
    source_project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    target_project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    relationship_level VARCHAR(10) CHECK (relationship_level IN ('high', 'medium', 'low')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_project_id, target_project_id)
);
```

#### 6.2.5. Requirements (요구사항)
```sql
CREATE TABLE requirements (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('functional', 'non-functional', 'constraint')),
    importance INTEGER CHECK (importance BETWEEN 1 AND 5),
    urgency INTEGER CHECK (urgency BETWEEN 1 AND 5),
    status VARCHAR(20) CHECK (status IN ('registered', 'reviewing', 'approved', 'rejected', 'completed')),
    assigned_to INTEGER REFERENCES users(id),
    parent_requirement_id INTEGER REFERENCES requirements(id),
    requirement_action VARCHAR(20) CHECK (requirement_action IN ('new', 'update', 'delete', 'additional', 'improvement')),
    is_deleted BOOLEAN DEFAULT false,
    delete_reason TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.6. RequirementAuditLog (요구사항 변경 이력)
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

#### 6.2.7. QnAThreads (질의응답 스레드)
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

#### 6.2.8. QnAMessages (질의응답 메시지)
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

#### 6.2.9. ProjectFiles (프로젝트 파일)
```sql
CREATE TABLE project_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    folder_path VARCHAR(500),
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.10. ProjectUrls (참고 URL)
```sql
CREATE TABLE project_urls (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2000) NOT NULL,
    description TEXT,
    category VARCHAR(20) CHECK (category IN ('website', 'youtube', 'github', 'document', 'api')),
    tags VARCHAR(500),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.11. ProjectEnvironments (환경 정보)
```sql
CREATE TABLE project_environments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    key_value TEXT,
    category VARCHAR(20) CHECK (category IN ('db', 'api', 'cloud', 'server', 'etc')),
    description TEXT,
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, key_name)
);
```

#### 6.2.12. ProjectServers (MCP 서버)
```sql
CREATE TABLE project_servers (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    server_name VARCHAR(100) NOT NULL,
    ip_address INET NOT NULL,
    server_type VARCHAR(20) CHECK (server_type IN ('app', 'db', 'web', 'cache')),
    os_info VARCHAR(100),
    cpu_cores INTEGER,
    memory_gb INTEGER,
    status VARCHAR(20) CHECK (status IN ('online', 'offline', 'warning')),
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    last_checked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.13. ProjectSummaries (프로젝트 정리)
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

### 6.3. 인덱스 설계

```sql
-- 프로젝트 검색 성능 향상
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_importance_urgency ON projects(importance DESC, urgency DESC);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_projects_title ON projects USING gin(to_tsvector('korean', title));

-- 요구사항 검색
CREATE INDEX idx_requirements_project_status ON requirements(project_id, status);
CREATE INDEX idx_requirements_assigned ON requirements(assigned_to, status);
CREATE INDEX idx_requirements_parent ON requirements(parent_requirement_id);
CREATE INDEX idx_requirements_action ON requirements(requirement_action);
CREATE INDEX idx_requirements_is_deleted ON requirements(is_deleted);

-- 프로젝트 멤버 조회
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);

-- 파일 검색
CREATE INDEX idx_project_files_project ON project_files(project_id);
CREATE INDEX idx_project_files_filename ON project_files USING gin(to_tsvector('korean', original_filename));

-- 요구사항 변경 이력
CREATE INDEX idx_requirement_audit_requirement ON requirement_audit_log(requirement_id);
CREATE INDEX idx_requirement_audit_action ON requirement_audit_log(action_type);

-- QnA 검색 성능 향상
CREATE INDEX idx_qna_threads_project ON qna_threads(project_id);
CREATE INDEX idx_qna_threads_requirement ON qna_threads(requirement_id);
CREATE INDEX idx_qna_threads_status ON qna_threads(status);
CREATE INDEX idx_qna_messages_thread ON qna_messages(thread_id);
CREATE INDEX idx_qna_messages_parent ON qna_messages(parent_message_id);
CREATE INDEX idx_qna_messages_author ON qna_messages(author_id, author_type);

-- 정리 기능 성능 향상
CREATE INDEX idx_project_summaries_project ON project_summaries(project_id);
CREATE INDEX idx_project_summaries_type ON project_summaries(summary_type);
```

### 6.4. 데이터 제약조건

1. **참조 무결성:** 모든 외래 키는 ON DELETE CASCADE 또는 ON DELETE SET NULL 설정
2. **데이터 유효성:** CHECK 제약조건으로 상태값, 점수 범위 등 제한
3. **고유성:** 프로젝트 코드, 사용자 이메일 등 UNIQUE 제약조건
4. **NOT NULL:** 필수 데이터는 NOT NULL 제약조건

### 6.5. 요구사항 상태 변경 트리거

```sql
CREATE OR REPLACE FUNCTION log_requirement_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- 요구사항 업데이트 시 변경 이력 저장
        INSERT INTO requirement_audit_log (
            requirement_id, 
            action_type, 
            old_values, 
            new_values,
            change_reason,
            changed_by
        ) VALUES (
            NEW.id,
            CASE 
                WHEN OLD.is_deleted = false AND NEW.is_deleted = true THEN 'delete'
                WHEN OLD.is_deleted = true AND NEW.is_deleted = false THEN 'restore'
                ELSE 'update'
            END,
            row_to_json(OLD),
            row_to_json(NEW),
            NEW.delete_reason,
            NEW.updated_by
        );
    ELSIF TG_OP = 'INSERT' THEN
        -- 요구사항 생성 시 변경 이력 저장
        INSERT INTO requirement_audit_log (
            requirement_id, 
            action_type,
            new_values,
            changed_by
        ) VALUES (
            NEW.id,
            'create',
            row_to_json(NEW),
            NEW.created_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requirement_audit_trigger
AFTER INSERT OR UPDATE ON requirements
FOR EACH ROW EXECUTE FUNCTION log_requirement_changes();
```

### 6.6. 노션 API 토큰 암호화/복호화 함수

```sql
-- 암호화 함수
CREATE OR REPLACE FUNCTION encrypt_api_token(token text, key text)
RETURNS text AS $$
DECLARE
    result text;
BEGIN
    result = pgp_sym_encrypt(token, key);
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 복호화 함수
CREATE OR REPLACE FUNCTION decrypt_api_token(encrypted_token text, key text)
RETURNS text AS $$
DECLARE
    result text;
BEGIN
    result = pgp_sym_decrypt(encrypted_token::bytea, key);
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```