---

## 10. 배포 및 운영 요구사항

### 10.1. 인프라 구성

#### 10.1.1. 클라우드 환경

**권장 클라우드 서비스**
- AWS, Azure 또는 GCP
- 리전: 한국 (ap-northeast-2) 또는 일본 (ap-northeast-1)
- 가용성 영역: 최소 2개 이상 사용하여 고가용성 확보

**서버 구성**
- **웹 서버**: AWS EC2 t3.medium (vCPU 2, 메모리 4GB) x 2대
- **API 서버**: AWS EC2 t3.medium (vCPU 2, 메모리 4GB) x 2대
- **데이터베이스**: AWS RDS PostgreSQL (db.t3.medium) 다중 AZ 구성
- **캐시 서버**: AWS ElastiCache Redis (cache.t3.small)
- **검색 서버**: AWS OpenSearch (t3.small.search)

**스토리지**
- **파일 스토리지**: AWS S3 Standard
- **로그 스토리지**: AWS S3 Intelligent-Tiering
- **데이터베이스 백업**: AWS S3 Glacier

**네트워크 구성**
- VPC 구성
- 퍼블릭/프라이빗 서브넷 분리
- NAT Gateway를 통한 외부 연결
- ALB(Application Load Balancer)를 통한 로드 밸런싱

#### 10.1.2. 컨테이너화 및 오케스트레이션

**컨테이너 전략**
- Docker 기반 컨테이너화
- 마이크로서비스 아키텍처 지향
- 서비스별 독립 컨테이너 구성

**쿠버네티스 구성**
- AWS EKS 또는 자체 쿠버네티스 클러스터
- Horizontal Pod Autoscaler 설정
- 서비스 간 네트워크 정책 설정
- 리소스 할당 (CPU/메모리 요청 및 제한)

**컨테이너 구성 예시**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pms-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pms-api
  template:
    metadata:
      labels:
        app: pms-api
    spec:
      containers:
      - name: pms-api
        image: pms/api:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/readiness
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: db-host
```

### 10.2. CI/CD 파이프라인

#### 10.2.1. 지속적 통합 (CI)

**소스 코드 관리**
- GitHub 또는 GitLab 사용
- 브랜치 전략: GitHub Flow 또는 GitLab Flow
- 보호 브랜치 설정 (main, develop)
- 코드 리뷰 필수화 (최소 1명 이상 승인)

**빌드 및 테스트 자동화**
- GitHub Actions 또는 GitLab CI/CD 사용
- 커밋 시 자동 빌드 및 테스트
- 코드 품질 검사 (ESLint, Prettier)
- 유닛 테스트 및 통합 테스트 실행
- 코드 커버리지 80% 이상 유지

**CI 파이프라인 구성**
```yaml
# GitHub Actions 예시
name: CI Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install Dependencies
      run: npm ci
    - name: Lint Code
      run: npm run lint
    - name: Run Tests
      run: npm test
    - name: Build
      run: npm run build
    - name: Archive Build
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: dist/
```

#### 10.2.2. 지속적 배포 (CD)

**환경 구성**
- 개발(Dev), 테스트(Test), 스테이징(Staging), 프로덕션(Prod) 환경 분리
- 환경별 구성 정보 분리 관리
- Canary 배포 또는 Blue/Green 배포 전략 적용

**배포 자동화**
- 테스트 환경: 개발 브랜치 머지 시 자동 배포
- 스테이징 환경: QA 테스트 통과 후 수동 승인 배포
- 프로덕션 환경: 최종 승인 후 배포
- 롤백 전략 및 절차 수립

**CD 파이프라인 구성**
```yaml
# GitHub Actions 예시
name: CD Pipeline

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  deploy_to_staging:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install Dependencies
      run: npm ci
    - name: Build
      run: npm run build
    - name: Deploy to Staging
      run: |
        # 배포 스크립트 (AWS, Docker 등)
    - name: Notify Deployment
      run: |
        # Slack 등으로 배포 알림

  deploy_to_production:
    needs: deploy_to_staging
    runs-on: ubuntu-latest
    environment: production
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install Dependencies
      run: npm ci
    - name: Build
      run: npm run build:prod
    - name: Deploy to Production
      run: |
        # 프로덕션 배포 스크립트
    - name: Notify Deployment
      run: |
        # Slack 등으로 배포 알림
```

### 10.3. 모니터링 및 로깅

#### 10.3.1. 모니터링 시스템

**인프라 모니터링**
- Prometheus + Grafana 구성
- 서버 리소스 모니터링 (CPU, 메모리, 디스크, 네트워크)
- 컨테이너 상태 모니터링
- 데이터베이스 성능 모니터링
- 알림 임계치 설정 및 알림 구성

**애플리케이션 모니터링**
- APM (Application Performance Monitoring) 도구 사용
- 응답 시간 모니터링
- 에러율 모니터링
- 엔드포인트별 사용량 모니터링
- 사용자 세션 모니터링

**비즈니스 지표 모니터링**
- 사용자 활동 지표 (DAU, MAU)
- 프로젝트 생성/완료 비율
- 주요 기능 사용률
- 시스템 전반 활용도

#### 10.3.2. 로깅 시스템

**로그 수집 및 저장**
- ELK Stack (Elasticsearch, Logstash, Kibana) 구성
- 구조화된 로그 형식 (JSON)
- 분산 추적을 위한 Trace ID, Span ID 포함
- 로그 보관 정책 (실시간 30일, 아카이브 1년)

**로그 분석**
- 실시간 로그 모니터링
- 로그 기반 알림 설정
- 주기적인 로그 분석 리포트 생성
- 보안 이벤트 모니터링 및 분석

### 10.4. 성능 최적화

#### 10.4.1. 웹 성능 최적화

**프론트엔드 최적화**
- 코드 스플리팅 및 지연 로딩
- 이미지 최적화 (WebP 포맷, 적절한 해상도)
- 캐싱 전략 (브라우저 캐시, Service Worker)
- 번들 크기 최적화 (Tree Shaking)
- 서드파티 스크립트 관리

**백엔드 최적화**
- 데이터베이스 쿼리 최적화
- 인덱싱 전략 수립
- N+1 쿼리 문제 해결
- 데이터 페이지네이션 구현
- API 응답 압축

#### 10.4.2. 캐싱 전략

**클라이언트 사이드 캐싱**
- 브라우저 캐시 (Cache-Control 헤더)
- 로컬 스토리지 / 세션 스토리지 활용
- 서비스 워커를 통한 오프라인 지원

**서버 사이드 캐싱**
- Redis를 사용한 데이터 캐싱
- 자주 사용되는 쿼리 결과 캐싱
- 세션 데이터 캐싱
- 캐시 무효화 전략 수립

**CDN 활용**
- Cloudflare 또는 AWS CloudFront 사용
- 정적 자산(CSS, JS, 이미지) CDN 배포
- 지역별 엣지 캐싱

### 10.5. 백업 및 복구

#### 10.5.1. 백업 전략

**데이터베이스 백업**
- 일일 전체 백업 (매일 새벽 3시)
- 시간 단위 증분 백업 (매시간)
- WAL(Write-Ahead Log) 아카이빙
- 백업 데이터 암호화
- 백업 데이터 다중 리전 저장

**파일 백업**
- 신규 파일 즉시 백업
- 일일 증분 백업
- 주간 전체 백업
- 백업 파일 무결성 검증

#### 10.5.2. 재해 복구 계획

**복구 목표**
- RPO (Recovery Point Objective): 1시간 이내
- RTO (Recovery Time Objective): 4시간 이내
- 데이터 손실 허용 범위: 1시간 이내 데이터

**재해 복구 절차**
- 재해 감지 및 알림
- 복구 팀 소집
- 백업 데이터 검증
- 시스템 복구 실행
- 복구 검증 및 테스트
- 서비스 재개

**정기 복구 테스트**
- 분기별 복구 모의훈련
- 백업 데이터 복원 테스트
- 복구 시간 측정 및 개선