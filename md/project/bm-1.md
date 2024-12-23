## 1. **사업 개요**  

> 지식재산서비스 성장지원사업은 특허청이 주관하고 한국특허정보원이 전담하는 IP서비스 연구개발 지원 프로그램입니다.

- **연계/소속회사**: 한국특허정보원 / (주)마크클라우드  
- **수행 기간**: 2023.07 ~ 2023.11 (종료)  

---

## 2. **주요 역할**  

1) **데이터 수집 및 모델링**  
   - WordNet, GloVe 활용 데이터 수집・정제.  
   - 브랜드 네임 생성 로직을 위한 데이터셋 설계・분석.  

2) **네이밍 생성 알고리즘 개발**  
   - 입력 키워드와 연관된 단어를 활용한 브랜드 네임 생성 로직 구현.  
   - 접두사/접미사 및 합성어 기법을 통해 다양한 네임 추천 알고리즘 제공.  

---

## 3. **기존 문제**  

- 과거에는 단순 랜덤 알파벳 조합 방식을 사용  
  - 예: 키워드 "banana" → "banaiczcl" (연관성 부족, 브랜드 가치 전달 어려움)

---

## 4. **개선된 해결 방법**  

1) **GloVe 모델 적용**  
   - 단어 간 의미적 유사도를 기반으로 연관 단어 추출.  
2) **WordNet 연계**  
   - 사전적 정의 및 예문을 활용해 키워드와 의미적으로 밀접한 단어 필터링.  
3) **합성어 & 접두사/접미사 네이밍 기법**  
   - **합성어 네이밍**: 두 단어를 결합하거나 일부를 단축 (예: "bana" + "presso" → "Banapresso").  
   - **접두사/접미사 네이밍**: 키워드 "Tech" → "InnovaTech", 또는 자주 사용되는 접미사 활용 (예: "Smart" → "Smartify").  

---

## 5. **성과 예시**  

- **입력 키워드** "banana"  
  - 합성어: "BanaNova", "BanaFresh"  
  - 접두사/접미사: "TropiBanana", "Golden Banana"  

- **입력 키워드** "tech"  
  - 합성어: "TechSphere", "InnovaEdge"  
  - 접두사/접미사: "FuturEdge", "Smartify"  

---

## 6. **GloVe 모델의 한계와 GPT API의 등장**  

1) **GloVe 모델의 한계**  
   - **문맥 이해 부족**
     GloVe는 임베딩 방식으로 단어의 다의성을 반영하지 못함. 예를 들어, "apple"은 과일일 수도, 회사일 수도 있지만 이를 구분하지 않음.  
   - **창의성 제한**
     통계적 연관성에 기반하여 단순히 연관 단어를 추출하므로, 새로운 조합이나 창의적 표현 생성에 한계가 있음.  
   - **한국어 데이터 부족**
     영어 중심의 모델로, 한국어 처리 성능이 상대적으로 낮음.

2) **GPT API의 등장과 변화**  
   - **문맥 기반 이해**
     GPT는 동적(language model) 접근 방식을 통해 단어의 의미를 문맥에 따라 이해하고 처리 가능.  
   - **문제 해결 능력 강화**
     GloVe의 한계를 보완하며, 문맥 이해, 창의적 결과 생성, 다국어 지원(특히 한국어) 등 기존 문제를 해결 가능.  
   - **사용자 친화성 향상**
     생성된 단어의 의미, 사용된 기법 등 구체적인 정보를 제공하여, 사용자에게 더 나은 설명과 통찰을 전달 가능.  

---