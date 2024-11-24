### 연계/소속회사: 한국특허정보원 / (주)마크클라우드

### 수행 기간: 2023.07 ~ 2023.11 (종료)

- **`사업 순서도`**
    ![large-testimage](images/projects/BM개발프로세스.png)
    
    

### 주요 역할

- 데이터 수집 및 모델링
    - 다양한 데이터 소스에서 네이밍 관련 데이터 수집 및 정제
    - 수집한 데이터를 기반으로 모델 구축 및 성능 최적화
- 네이밍 생성 서비스 개발
    - 서비스 요구사항 분석 및 기능 설계
    - 네이밍 생성 알고리즘 개발 및 구현

### 과정

- 기존 문제점 파악
    - 기존 방법: 영어 모음집을 사용하여 랜덤으로 알파벳 조합, 세상에 존재하지 않는 단어 생성
        - 예시: 입력 키워드 "banana" → "banaiczcl" (banana와 연관이 없는 문자 생성)
- 해결 방법
    - 프린스턴 대학에서 공개한 영어 사전(WordNet) 이용
    - GloVe 사전학습 모델 사용 → 연관어 추천 가능
        - 예시: 입력 키워드 "banana" → 연관어 "Pineapple"
    - GloVe와 WordNet을 활용하여 네이밍 생성

### 업무 성과

- 우수기업 선정