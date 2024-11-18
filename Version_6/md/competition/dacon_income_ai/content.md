> 현재 테스트 입니다. 
> 💡 **개인 특성 데이터를 활용하여 개인 소득 수준을 예측하는 AI 모델 개발**
--- 
> 기간: 2024.03.11 ~ 2024.04.08  
> 성과: **1200명 중 16등** 달성


## 🎯 프로젝트 핵심 접근 방법

- **데이터 전처리**: 윈저화 방법(상하위 3%)을 통한 이상치 처리로 성능 향상
- **Feature Engineering**: 다양한 파생변수 생성으로 모델 성능 개선
- **앙상블 기법**: XGBoost, LightGBM, CatBoost 모델의 조합
- **성능 최적화**: Weighted Blending을 통한 최종 성능 극대화

## 📊 주요 데이터 처리 과정

### 1. 데이터 정제
- 컬럼명 표준화 및 특수문자 제거
- 불필요한 컬럼(Gains, Losses, Dividends) 제거 → Income과의 낮은 상관관계
- Income 이상치 처리 → 상하위 3% 윈저화 적용

### 2. 파생변수 생성
- 국가 정보 → 대륙별 분류
- 연령 → 연령대 범주화
- 직업/산업 → 주요 카테고리로 재그룹화
- 시민권/출생국가 → US/Non-US 이진 분류
- Frequency Encoding 적용 → 편향된 카테고리 데이터 처리

## 🔧 모델링 프로세스

### 1. 모델 선정 및 최적화
## 🔧 모델링 프로세스

모델링 프로세스 타이핑 테스트 입니다.
```
# 코드 주석

for i in range(1, 101, 2):
    print(i)
print("hello Wordl")

그냥 주석 텍스트 입니다.
룰루랄라 입니다. 
```

`현재 테스트 중 입니다`

### 1. 모델 선정 및 최적화

![small-image](images/competition/dacon_income_ai/fall.png)
![medium-image](images/competition/dacon_income_ai/fall.png)
![large-image](images/competition/dacon_income_ai/fall.png)

### 2. 성능 최적화 과정
1. Optuna를 활용한 하이퍼파라미터 최적화
2. Stacking과 Voting 앙상블 적용
3. 성능 기반 Weighted Blending 적용

## ✨ 주요 성과 및 배운 점

### 💪 Technical Achievement
- Weighted Blending 기법 첫 도입 및 성공적 결과 도출
- ChatGPT와 GPTs를 활용한 효율적인 문제 해결 경험
- K-Fold 교차 검증을 통한 과적합 방지

### 📝 Improvement Points
- 이상치 처리 방법의 다양화 필요성 인식
- 더 다양한 모델 실험의 필요성 확인
- 데이터 분석 단계에서의 더 깊은 인사이트 도출 필요

---
> 💡 **Key Takeaway**  
> "데이터 전처리부터 모델 앙상블까지, 체계적인 접근을 통해 상위 1.3% 달성.  
> 특히 Weighted Blending 기법의 성공적인 첫 적용이 핵심 성과"