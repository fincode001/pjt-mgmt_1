---

## 9. 보안 요구사항

### 9.1. 인증 및 권한 관리

#### 9.1.1. 인증 시스템

**JWT 기반 인증**
- JWT 토큰을 사용한 무상태 인증
- Access Token 유효시간: 30분
- Refresh Token 유효시간: 7일
- 토큰 자동 갱신 지원

**패스워드 정책**
- 최소 8자 이상
- 영문 대소문자, 숫자, 특수문자 중 3종류 이상 조합
- 이전 패스워드와 동일한 패스워드 사용 금지
- 패스워드 만료 기간: 90일 (권장)
- 계정 잠금: 5회 실패 시 30분 잠금

**세션 관리**
- 세션 타임아웃: 30분 비활성화 시 자동 로그아웃
- 동시 로그인 제한: 동일 계정 3개 세션까지 허용
- 로그아웃 시 모든 토큰 무효화

#### 9.1.2. 권한 관리 (RBAC)

**역할 정의**
```
Admin:
  - 사용자 관리 (생성, 수정, 삭제)
  - 시스템 설정 관리
  - 모든 프로젝트 접근

Project Manager (PM):
  - 프로젝트 생성, 수정, 삭제
  - 프로젝트 멤버 관리
  - 요구사항 관리
  - 서버 및 환경 정보 관리

Team Leader:
  - 팀 프로젝트 관리
  - 팀원 작업 할당
  - 프로젝트 리소스 관리

Member:
  - 할당된 프로젝트 조회 및 부분 수정
  - 파일 업로드/다운로드
  - 요구사항 조회

Viewer:
  - 할당된 프로젝트 조회만 가능
  - 파일 다운로드만 가능
```

**권한 검증**
- API 레벨에서 권한 검증
- 프론트엔드에서 UI 요소 표시/숨김 제어
- 리소스별 세분화된 권한 제어

### 9.2. 데이터 보안

#### 9.2.1. 데이터 암호화

**전송 중 데이터 암호화**
- HTTPS (TLS 1.3) 강제 사용
- HSTS (HTTP Strict Transport Security) 적용
- Certificate Pinning 적용

**저장 데이터 암호화**
- 패스워드: bcrypt (cost factor 12) 해시화
- API 키 및 민감 정보: AES-256-GCM 암호화
- 데이터베이스 컬럼 레벨 암호화 (민감 정보)
- 백업 데이터 암호화

**암호화 키 관리**
- 환경 변수를 통한 키 관리
- 정기적 키 로테이션 (분기별)
- HSM(Hardware Security Module) 사용 권장

#### 9.2.2. 데이터 접근 제어

**최소 권한 원칙**
- 업무 수행에 필요한 최소한의 데이터만 접근 허용
- 프로젝트 멤버는 참여 프로젝트만 접근 가능
- 시간 기반 접근 제어 (업무 시간 외 접근 제한 옵션)

**데이터 마스킹**
- 개발/테스트 환경에서 개인식별정보 마스킹
- 로그에서 민감 정보 자동 마스킹
- API 응답에서 권한 없는 필드 제외

### 9.3. 입력 검증 및 보안

#### 9.3.1. 입력 검증

**프론트엔드 검증**
- 클라이언트 사이드 유효성 검사
- XSS 방지를 위한 입력값 이스케이핑
- 파일 업로드 시 확장자 및 MIME 타입 검증

**백엔드 검증**
- 모든 입력값에 대한 서버 사이드 검증
- SQL Injection 방지 (Prepared Statement 사용)
- NoSQL Injection 방지
- 파일 크기 및 타입 제한

**보안 헤더**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

#### 9.3.2. 파일 업로드 보안

**업로드 제한**
- 최대 파일 크기: 100MB
- 허용 확장자: PDF, DOCX, XLSX, PPTX, PNG, JPG, GIF, ZIP
- 악성 파일 스캔 (바이러스 검사)
- 업로드 경로 정규화

**파일 저장**
- 웹 루트 외부 디렉토리에 저장
- 파일명 랜덤화
- 실행 권한 제거
- 정기적인 임시 파일 정리

### 9.4. 로깅 및 감사

#### 9.4.1. 보안 로깅

**로그 기록 대상**
- 인증 및 인가 이벤트 (로그인, 로그아웃, 권한 변경)
- 민감한 데이터 접근 (프로젝트 조회, 수정, 삭제)
- 시스템 관리 작업 (사용자 생성, 권한 변경)
- 보안 위반 시도 (무차별 대입 공격, 권한 없는 접근)
- 파일 업로드/다운로드

**로그 형식**
```json
{
  "timestamp": "2025-06-05T14:30:45Z",
  "level": "INFO",
  "event": "USER_LOGIN",
  "userId": 123,
  "username": "hong@example.com",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "abc123...",
  "success": true,
  "message": "User login successful"
}
```

#### 9.4.2. 감사 기능

**감사 추적**
- 모든 주요 작업에 대한 감사 로그 생성
- 데이터 변경 이력 추적 (Before/After 값)
- 로그 무결성 보장 (해시 체인)
- 로그 조작 방지 (읽기 전용 저장소)

**로그 보관 및 분석**
- 로그 보관 기간: 1년
- 실시간 로그 모니터링 및 알림
- 이상 행위 탐지 (비정상적인 접근 패턴)
- 정기적인 보안 감사 리포트 생성

### 9.5. 네트워크 보안

#### 9.5.1. 네트워크 접근 제어

**방화벽 정책**
- 화이트리스트 기반 접근 제어
- 불필요한 포트 차단
- DDoS 방어 시스템 적용

**API 보안**
- Rate Limiting (사용자당 분당 100 요청)
- CORS (Cross-Origin Resource Sharing) 정책 설정
- API 키 기반 외부 서비스 접근 제한

#### 9.5.2. 데이터베이스 보안

**접근 제어**
- 데이터베이스 전용 사용자 계정 사용
- 최소 권한 원칙 적용
- IP 화이트리스트 기반 접근 제한

**연결 보안**
- SSL/TLS 암호화 연결
- 연결 풀링을 통한 연결 관리
- 정기적인 접근 권한 검토

### 9.6. 컴플라이언스 및 개인정보보호

#### 9.6.1. 개인정보보호

**개인정보 최소 수집**
- 서비스 제공에 필요한 최소한의 개인정보만 수집
- 목적 달성 후 개인정보 자동 삭제
- 개인정보 수집/이용 동의 관리

**개인정보 보호 조치**
- 개인정보 익명화/가명화 처리
- 개인정보 접근 로그 기록
- 개인정보 유출 시 대응 절차 수립

#### 9.6.2. 보안 정책

**정기 보안 점검**
- 분기별 취약점 스캔
- 연간 침투 테스트
- 보안 패치 정기 적용

**보안 교육**
- 개발팀 보안 교육 (연 2회)
- 보안 코딩 가이드라인 준수
- 보안 사고 대응 훈련