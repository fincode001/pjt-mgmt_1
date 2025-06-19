---

## 6. 데이터베이스 설계

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
Requirements ||--o{ RequirementComments : has
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
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.6. ProjectFiles (프로젝트 파일)
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

#### 6.2.7. ProjectUrls (참고 URL)
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

#### 6.2.8. ProjectEnvironments (환경 정보)
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

#### 6.2.9. ProjectServers (MCP 서버)
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

-- 프로젝트 멤버 조회
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);

-- 파일 검색
CREATE INDEX idx_project_files_project ON project_files(project_id);
CREATE INDEX idx_project_files_filename ON project_files USING gin(to_tsvector('korean', original_filename));
```

### 6.4. 데이터 제약조건

1. **참조 무결성:** 모든 외래 키는 ON DELETE CASCADE 또는 ON DELETE SET NULL 설정
2. **데이터 유효성:** CHECK 제약조건으로 상태값, 점수 범위 등 제한
3. **고유성:** 프로젝트 코드, 사용자 이메일 등 UNIQUE 제약조건
4. **NOT NULL:** 필수 데이터는 NOT NULL 제약조건