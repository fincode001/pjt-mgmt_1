---

## 7. API 명세

### 7.1. API 기본 설계 원칙

1. **RESTful 설계**: 자원 중심의 URL 구조와 HTTP 메소드 사용
2. **JSON 형식**: 요청 및 응답 데이터는 JSON 형식 사용
3. **버전 관리**: URL 접두사에 API 버전 포함 (예: `/api/v1/`)
4. **일관된 오류 처리**: 표준화된 오류 응답 형식 사용
5. **페이지네이션**: 목록 조회 시 페이지네이션 지원
6. **필터링 및 정렬**: 쿼리 파라미터를 통한 필터링 및 정렬 지원
7. **HATEOAS**: 응답에 관련 리소스 링크 포함
8. **인증**: JWT 기반 인증 헤더 사용

### 7.2. 인증 및 인가

**인증 헤더 형식**:
```
Authorization: Bearer {jwt_token}
```

**권한 수준**:
- **관리자 (Admin)**: 모든 권한
- **프로젝트 관리자 (PM)**: 프로젝트 생성, 수정, 멤버 관리
- **팀원 (Member)**: 프로젝트 정보 조회, 일부 수정
- **조회자 (Viewer)**: 읽기 전용 권한

### 7.3. 엔드포인트 목록

#### 7.3.1. 인증 API

| 메소드 | 경로                | 설명           | 권한    |
|------|---------------------|--------------|--------|
| POST | /api/v1/auth/login  | 로그인         | 없음    |
| POST | /api/v1/auth/logout | 로그아웃        | 로그인   |
| POST | /api/v1/auth/refresh| 토큰 갱신      | 로그인   |
| POST | /api/v1/auth/password| 비밀번호 변경  | 로그인   |

#### 7.3.2. 사용자 API

| 메소드 | 경로                  | 설명           | 권한     |
|------|----------------------|--------------|---------|
| GET  | /api/v1/users        | 사용자 목록 조회  | Admin   |
| GET  | /api/v1/users/{id}   | 사용자 상세 조회  | 로그인    |
| POST | /api/v1/users        | 사용자 생성      | Admin   |
| PUT  | /api/v1/users/{id}   | 사용자 정보 수정  | 본인/Admin|
| DELETE| /api/v1/users/{id}  | 사용자 삭제      | Admin   |
| GET  | /api/v1/users/me     | 내 정보 조회     | 로그인    |
| PUT  | /api/v1/users/me/settings| 설정 변경   | 로그인    |

#### 7.3.3. 프로젝트 API

| 메소드 | 경로                           | 설명              | 권한       |
|------|--------------------------------|-----------------|-----------|
| GET  | /api/v1/projects              | 프로젝트 목록 조회    | 로그인      |
| GET  | /api/v1/projects/{id}         | 프로젝트 상세 조회    | 멤버/PM    |
| POST | /api/v1/projects              | 프로젝트 생성        | PM/Admin  |
| PUT  | /api/v1/projects/{id}         | 프로젝트 수정        | PM/Admin  |
| DELETE| /api/v1/projects/{id}        | 프로젝트 삭제        | PM/Admin  |
| GET  | /api/v1/projects/dashboard    | 대시보드 데이터 조회   | 로그인     |
| PUT  | /api/v1/projects/priority     | 우선순위 일괄 수정    | PM/Admin  |
| GET  | /api/v1/projects/relationships| 관계도 데이터 조회    | 로그인     |

#### 7.3.4. 요구사항 API

| 메소드 | 경로                                         | 설명                | 권한      |
|------|----------------------------------------------|-------------------|----------|
| GET  | /api/v1/projects/{projectId}/requirements    | 요구사항 목록 조회      | 멤버/PM   |
| GET  | /api/v1/projects/{projectId}/requirements/{id}| 요구사항 상세 조회     | 멤버/PM   |
| POST | /api/v1/projects/{projectId}/requirements    | 요구사항 생성          | PM       |
| PUT  | /api/v1/projects/{projectId}/requirements/{id}| 요구사항 수정         | PM       |
| DELETE| /api/v1/projects/{projectId}/requirements/{id}| 요구사항 삭제        | PM       |

#### 7.3.5. 자원 관리 API

| 메소드 | 경로                                    | 설명                | 권한      |
|------|----------------------------------------|-------------------|----------|
| GET  | /api/v1/projects/{projectId}/files     | 파일 목록 조회        | 멤버/PM   |
| POST | /api/v1/projects/{projectId}/files     | 파일 업로드          | 멤버/PM   |
| GET  | /api/v1/projects/{projectId}/files/{id}| 파일 다운로드         | 멤버/PM   |
| DELETE| /api/v1/projects/{projectId}/files/{id}| 파일 삭제           | 멤버/PM   |

| 메소드 | 경로                                    | 설명                | 권한      |
|------|----------------------------------------|-------------------|----------|
| GET  | /api/v1/projects/{projectId}/environments| 환경 정보 목록 조회   | 멤버/PM   |
| POST | /api/v1/projects/{projectId}/environments| 환경 정보 생성       | PM       |
| PUT  | /api/v1/projects/{projectId}/environments/{id}| 환경 정보 수정  | PM       |
| DELETE| /api/v1/projects/{projectId}/environments/{id}| 환경 정보 삭제 | PM       |
| GET  | /api/v1/projects/{projectId}/environments/sample| .env.sample 생성 | 멤버/PM |

| 메소드 | 경로                                    | 설명                | 권한      |
|------|----------------------------------------|-------------------|----------|
| GET  | /api/v1/projects/{projectId}/urls      | URL 목록 조회        | 멤버/PM   |
| POST | /api/v1/projects/{projectId}/urls      | URL 생성           | 멤버/PM   |
| PUT  | /api/v1/projects/{projectId}/urls/{id} | URL 수정           | 멤버/PM   |
| DELETE| /api/v1/projects/{projectId}/urls/{id}| URL 삭제           | 멤버/PM   |
| POST | /api/v1/url-preview                    | URL 미리보기 조회     | 로그인     |

| 메소드 | 경로                                    | 설명                | 권한      |
|------|----------------------------------------|-------------------|----------|
| GET  | /api/v1/projects/{projectId}/servers   | 서버 목록 조회        | 멤버/PM   |
| POST | /api/v1/projects/{projectId}/servers   | 서버 생성           | PM       |
| PUT  | /api/v1/projects/{projectId}/servers/{id}| 서버 수정          | PM       |
| DELETE| /api/v1/projects/{projectId}/servers/{id}| 서버 삭제         | PM       |
| PUT  | /api/v1/projects/{projectId}/servers/{id}/status| 서버 상태 업데이트 | PM   |

### 7.4. 요청/응답 예시

#### 7.4.1. 프로젝트 생성 (POST /api/v1/projects)

**요청**:
```json
{
  "title": "프로젝트 관리 시스템 구축",
  "overview": "체계적인 프로젝트 관리를 위한 웹 기반 시스템 개발",
  "importance": 5,
  "urgency": 4,
  "startDate": "2025-05-15",
  "endDate": "2025-06-30",
  "receptionDate": "2025-05-10T14:30:00",
  "status": "in-progress",
  "progress": 75,
  "provider": {
    "name": "홍길동",
    "email": "hong@example.com"
  },
  "deliverer": {
    "name": "김철수",
    "email": "kim@example.com"
  },
  "yearCode": "2025",
  "categoryCode": "A",
  "majorClassCode": "01",
  "minorClassCode": "001",
  "versionCode": "0.1"
}
```

**응답 (201 Created)**:
```json
{
  "id": 1,
  "code": "2025-A-01-001-Ver0.1",
  "title": "프로젝트 관리 시스템 구축",
  "overview": "체계적인 프로젝트 관리를 위한 웹 기반 시스템 개발",
  "importance": 5,
  "urgency": 4,
  "startDate": "2025-05-15",
  "endDate": "2025-06-30",
  "receptionDate": "2025-05-10T14:30:00",
  "status": "in-progress",
  "progress": 75,
  "provider": {
    "name": "홍길동",
    "email": "hong@example.com"
  },
  "deliverer": {
    "name": "김철수",
    "email": "kim@example.com"
  },
  "createdBy": {
    "id": 10,
    "name": "박관리자"
  },
  "createdAt": "2025-06-05T09:30:45Z",
  "updatedAt": "2025-06-05T09:30:45Z",
  "_links": {
    "self": {
      "href": "/api/v1/projects/1"
    },
    "requirements": {
      "href": "/api/v1/projects/1/requirements"
    },
    "files": {
      "href": "/api/v1/projects/1/files"
    }
  }
}
```

#### 7.4.2. 프로젝트 목록 조회 (GET /api/v1/projects)

**요청 파라미터**:
```
?page=1&size=10&status=in-progress&sort=importance,desc&search=관리
```

**응답 (200 OK)**:
```json
{
  "content": [
    {
      "id": 1,
      "code": "2025-A-01-001-Ver0.1",
      "title": "프로젝트 관리 시스템 구축",
      "status": "in-progress",
      "importance": 5,
      "urgency": 4,
      "progress": 75,
      "scheduleProgress": 65,
      "startDate": "2025-05-15",
      "endDate": "2025-06-30"
    },
    // ... 추가 프로젝트
  ],
  "page": 1,
  "size": 10,
  "totalElements": 32,
  "totalPages": 4,
  "_links": {
    "self": {
      "href": "/api/v1/projects?page=1&size=10"
    },
    "next": {
      "href": "/api/v1/projects?page=2&size=10"
    },
    "last": {
      "href": "/api/v1/projects?page=4&size=10"
    }
  }
}
```