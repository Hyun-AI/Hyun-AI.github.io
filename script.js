// Marked.js 설정 초기화
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    sanitize: false,
    highlight: function(code, lang) {
        if (Prism && lang) {
            try {
                return Prism.highlight(code, Prism.languages[lang], lang);
            } catch (e) {
                console.error('Prism highlighting error:', e);
                return code;
            }
        }
        return code;
    }
});

/**
============================================================================================================================
배경
============================================================================================================================
*/
// 배경 파티클 생성
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 랜덤 위치 설정
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // 랜덤 애니메이션 지연
        particle.style.animationDelay = `${Math.random() * 8}s`;

        particlesContainer.appendChild(particle);
    }
}

/**
============================================================================================================================
타이핑 효과
============================================================================================================================
*/
async function typeText(element, text, delay = 200) {
    element.textContent = '';

    for (let char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// 페이지 로드 시 실행
// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 파티클 생성
    createParticles();

    // 타이핑 효과 시작
    const typingElement = document.querySelector('.typing-text');
    const text = "미래 기술과 소통을 중시하는 유현승입니다.";
    const highlightWords = ["유현승"];

    // 하이라이트된 HTML 생성 함수
    function getHighlightedHTML(text) {
        let result = text;
        highlightWords.forEach(word => {
            const regex = new RegExp(word, 'g');
            result = result.replace(regex, `<span class="highlight">${word}</span>`);
        });
        return result;
    }

    // 타이핑 효과 함수
    async function typeText(element, text) {
        let displayText = '';
        for (let i = 0; i < text.length; i++) {
            displayText += text[i];
            element.innerHTML = getHighlightedHTML(displayText);
            await new Promise(resolve => setTimeout(resolve, 100)); // 타이핑 속도를 50ms로 설정
        }
    }

    // 타이핑 효과 반복
    async function startTyping() {
        while (true) {
            await typeText(typingElement, text);
            await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기
            typingElement.textContent = '';
            await new Promise(resolve => setTimeout(resolve, 100)); // 0.1초 대기
        }
    }

    startTyping();
});

// ============================================================================================================================
// About me & skills 애니매이션 효과
// ============================================================================================================================
// Intersection Observer 설정
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // About/Skills 섹션 애니메이션
            if (entry.target.classList.contains('as-about') || 
                entry.target.classList.contains('as-skills')) {
                entry.target.classList.add('animate');
            }
            
            // Experience 아이템 애니메이션
            if (entry.target.classList.contains('as-experience-item')) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay * 1000);
            }
            
            // Skill 아이템 애니메이션
            if (entry.target.classList.contains('as-skill-item')) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay * 1000);
            }

            // 애니메이션이 완료된 후에도 계속 관찰
            //observer.unobserve(entry.target);
        } else {
            // 뷰포트에서 벗어났을 때 애니메이션 클래스 제거
            entry.target.classList.remove('animate');
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, observerOptions);

// 모든 애니메이션 요소 관찰 시작
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate], .as-experience-item, .as-skill-item');
    animatedElements.forEach(el => observer.observe(el));
});

/**
============================================================================================================================
프로젝트 섹션
============================================================================================================================
*/

// 프로젝트 데이터 객체
const projectData = {
    'bigdata2022': {
        title: '중소기업 빅데이터 분석·활용 지원사업',
        mdFile: './md/project/bigdata2022.md'
    },
    'productmonitoring': {
        title: '신상품 모니터링',
        mdFile: './md/project/monitoring.md'
    },
    'ipservicegrowth_dev': {
        title: '지식재산서비스 성장지원사업 (BM) - 개발 단계',
        mdFile: './md/project/bm-1.md'
    },
    'bigdata2023': {
        title: '중소기업 데이터 분석·활용 지원사업',
        mdFile: './md/project/bigdata2023.md'
    },
    'ipservicegrowth_biz': {
        title: '지식재산서비스 성장지원사업 (BM) - 사업화 단계',
        mdFile: './md/project/bm-2.md'
    }
};

/**
 * 사이드 메뉴 생성 함수
 */
function createSideMenu(currentProjectId) {
    const sideMenu = document.querySelector('.project-side-menu');
    if (!sideMenu) return;
    
    sideMenu.innerHTML = ''; // 기존 내용 초기화
    
    Object.entries(projectData).forEach(([id, data]) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-side-item';
        if (id === currentProjectId) {
            projectItem.classList.add('active');
        }
        projectItem.dataset.project = id;
        projectItem.textContent = data.title;
        
        projectItem.addEventListener('click', async () => {
            const detailContainer = document.querySelector('.project-details');
            if (!detailContainer) return;
            
            // 활성 상태 업데이트
            document.querySelectorAll('.project-side-item').forEach(item => 
                item.classList.remove('active')
            );
            projectItem.classList.add('active');
            
            // 페이드 아웃
            detailContainer.style.opacity = '0';
            
            // 컨텐츠 로드
            await loadProjectDetail(id, detailContainer);
            
            // URL 해시 업데이트
            history.pushState({ projectId: id }, '', `#project-${id}`);
            
            // 페이드 인
            setTimeout(() => {
                detailContainer.style.opacity = '1';
            }, 300);
        });
        
        sideMenu.appendChild(projectItem);
    });
}

/**
 * 프로젝트 상세 내용 로드 함수
 */
async function loadProjectDetail(projectId, detailContainer) {
    try {
        // 페이드 아웃
        detailContainer.style.opacity = '0';
        detailContainer.style.transform = 'translateY(20px)';
        
        const response = await fetch(projectData[projectId].mdFile);
        if (!response.ok) throw new Error('Failed to load project content');
        
        const mdContent = await response.text();
        
        // HTML로 변환
        const htmlContent = `
            <div class="project-detail-header">
                <h1 class="project-title">${projectData[projectId].title}</h1>
            </div>
            <div class="project-detail-content project-markdown">
                ${marked.parse(mdContent)}
            </div>
        `;
        
        // 상세 내용 업데이트
        detailContainer.innerHTML = htmlContent;

        // 페이드 인
        setTimeout(() => {
            detailContainer.style.opacity = '1';
            detailContainer.style.transform = 'translateY(0)';
        }, 50);
        
        // 이미지 처리
        detailContainer.querySelectorAll('img').forEach(img => {
            const altText = img.alt.toLowerCase();
            if (altText.includes('small')) {
                img.parentElement.classList.add('image-container-small');
            } else if (altText.includes('medium')) {
                img.parentElement.classList.add('image-container-medium');
            } else {
                img.parentElement.classList.add('image-container-large');
            }
            img.onload = () => img.classList.add('loaded');
        });

        return true;
    } catch (error) {
        console.error('Error loading project:', error);
        detailContainer.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Project</h2>
                <p>Failed to load project content. Please try again later.</p>
            </div>
        `;
        return false;
    }
}

/**
 * 프로젝트 상세 보기 닫기 함수
 */
function closeProjectDetail() {
    const fullscreenProject = document.getElementById('fullscreen-project');
    
    // 페이드 아웃 애니메이션
    fullscreenProject.style.opacity = '0';
    
    // body 스크롤 복원
    document.body.style.overflow = 'auto';
    
    // 활성 카드 상태 제거
    const activeCard = document.querySelector('.project-card.active');
    if (activeCard) {
        activeCard.classList.remove('active');
    }
    
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
        fullscreenProject.classList.remove('active');
        fullscreenProject.style.opacity = '';
        // URL 해시 제거
        history.pushState(null, '', window.location.pathname);
    }, 300);
}

/**
 * 초기 URL 해시 확인 함수
 */
function checkInitialHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
        const projectId = hash.replace('#project-', '');
        if (projectData[projectId]) {
            const detailContainer = document.querySelector('.project-details');
            if (detailContainer) {
                loadProjectDetail(projectId, detailContainer);
                createSideMenu(projectId);
            }
        }
    }
}

/**
 * 프로젝트 초기화
 */
function initializeProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    const fullscreenProject = document.getElementById('fullscreen-project');
    const projectDetails = fullscreenProject.querySelector('.project-details');
    let activeCard = null;

    // 초기 사이드 메뉴 생성
    createSideMenu();

    projectCards.forEach(card => {
        card.addEventListener('click', async function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            
            if (this === activeCard) {
                closeProjectDetail();
                activeCard = null;
                return;
            }
            
            const success = await loadProjectDetail(projectId, projectDetails);
            
            if (success) {
                fullscreenProject.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                this.classList.add('active');
                activeCard = this;
                
                // 사이드 메뉴 업데이트
                createSideMenu(projectId);
                
                history.pushState({ projectId }, '', `#project-${projectId}`);
            }
        });
    });

    // ESC 키 이벤트 리스너 개선
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const fullscreenProject = document.getElementById('fullscreen-project');
            if (fullscreenProject.classList.contains('active')) {
                closeProjectDetail();
            }
        }
    });

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash;
        if (hash.startsWith('#project-')) {
            const projectId = hash.replace('#project-', '');
            if (projectData[projectId]) {
                loadProjectDetail(projectId, projectDetails);
                createSideMenu(projectId);
            }
        } else {
            closeProjectDetail();
        }
    });
    
    // 초기 URL 해시 확인
    checkInitialHash();
}



// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeProjects);


// ============================================================================================================================
// worked
// ============================================================================================================================
// 경력 기술서 관련 JavaScript

// 프로젝트 데이터
const careerData = {
    projects: [
        {
            id: 'bigdata2022',
            title: '중소기업 빅데이터 분석·활용 지원사업',
            period: '2022.08 - 2022.12',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'ML'],
            mdFile: './md/project/bigdata2022.md',
            image: './images/projects/work1.png'
        },
        {
            id: 'productmonitoring',
            title: '신상품 모니터링',
            period: '2023.07 - 2023.11',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning'],
            mdFile: './md/project/monitoring.md',
            image: './images/projects/work2.png'
        },
        {
            id: 'ipservicegrowth_dev',
            title: '지식재산서비스 성장지원사업',
            period: '2023년 5월 ~ 2023년 11월',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning'],
            mdFile: './md/project/bm-1.md',
            image: './images/projects/work3.png'
        },
        {
            id: 'bigdata2023',
            title: '중소기업 빅데이터 분석·활용 지원사업',
            period: '2023년 7월 ~ 2022년 11월',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning', '#정부지원사업'],
            mdFile: './md/project/bigdata2023.md',
            image: './images/projects/work4.png'
        },
        {
            id: 'ipservicegrowth_biz',
            title: '지식재산서비스 사업화',
            period: '2023년 12월 ~ 2024년 1월',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning'],
            mdFile: './md/project/bm-2.md',
            image: './images/projects/work5.png'
        },
        
    ],
    businessPlans: {
            "2024": [
                {
                    "id": "bm-2024",
                    "period": "2023.12.18 - 2024.01.26",
                    "title": "지식재산서비스 성장지원사업(BM) - 사업화 단계",
                    "company": "한국특허정보원",
                    "details": [
                        "사업화 단계 지원",
                        "BM 검증 및 고도화",
                        "시장 검증 및 사업화 준비"
                    ]
                }
            ],
            "2023": [
                {
                    "id": "ai-voucher-1",
                    "period": "01.04 ~ 01.29",
                    "title": "2023 AI 바우처 (1차)",
                    "details": [
                        "고객관리(CRM) 강화 및 고객 이탈 방지를 위한 AI 솔루션 개발"
                    ]
                },
                {
                    "id": "ict-rd",
                    "period": "02.06 ~ 02.14",
                    "title": "ICT R&D",
                    "details": [
                        "광고(메뉴, 위치, 가격 등) 및 유동 인구 데이터를 활용한 맞춤형 AI 광고 추천 시스템 도입"
                    ]
                },
                {
                    "id": "ai-voucher-2",
                    "period": "02.14 ~ 02.20",
                    "title": "2023 AI 바우처 (2차)",
                    "details": [
                        "AI 바우처 (1차) 기간에 선정된 기업들 대상으로 2차 범포 진행",
                        "참가자: 수요기업과 주관기업 각 기업의 대표, 심사위원 4-5명"
                    ]
                },
                {
                    "id": "data-voucher",
                    "period": "02.21 ~ 03.28",
                    "title": "2023 데이터바우처",
                    "details": [
                        "A기업 - AI 분야: 인공지능 기반의 이탈 예측을 위한 고객관리(CRM) 데이터 가공",
                        "B기업 - AI 분야: 광고 데이터와 유동 인구 데이터를 활용한 AI 기반 자동 목의광고 추천 서비스",
                        "C기업 - 일반 분야: 세계최초 LCD 방식의 3D 프린터 기술 고도화를 위한 기술 및 소비자 동향 파악",
                        "D기업 - 일반 분야: 친환경 소재의 트렌드 및 키워드 분석을 반영한 ECO 생활용품 신규 라인업 개발",
                        "E기업 - 구매 분야: 유동 인구 데이터를 활용한 지식재산권 서비스 마케팅 광고 위치 선정 및 매출 증진"
                    ]
                },
                {
                    "id": "trademark-analysis",
                    "period": "04.17 ~ 05.01",
                    "title": "상표빅데이터 분석사업",
                    "details": [
                        "신상품 모니터링 및 거래상태 조사",
                        "지정상품간 유사도 측정 방법론 개발 및 적용"
                    ]
                },
                {
                    "id": "ai-convergence",
                    "period": "05.02 ~ 05.03",
                    "title": "인공지능산업융합사업단",
                    "details": [
                        "AI 기반 상표도용 진단 모니터링 서비스"
                    ]
                },
                {
                    "id": "agile-innovation",
                    "period": "05.03 ~ 05.08",
                    "title": "애자일 기반 혁신 서비스",
                    "details": [
                        "학교폭력 징후서를 기반으로 한 조치이행 예측 시스템 개발"
                    ]
                },
                {
                    "id": "smtech",
                    "period": "05.09 ~ 05.15",
                    "title": "SMTECH",
                    "details": [
                        "지식재산권 및 소비자 보호를 위한 온라인 상표도용 확인 서비스"
                    ]
                },
                {
                    "id": "patent-valuation",
                    "period": "05.16 ~ 05.26",
                    "title": "특허가치평가 시스템 개발",
                    "details": [
                        "AI·빅데이터 기반 특허가치평가 시스템 개발"
                    ]
                },
                {
                    "id": "nia-bigdata",
                    "period": "07.08 ~ 07.11",
                    "title": "NIA 빅데이터 플랫폼 기반 분석 서비스",
                    "details": [
                        "2023 빅데이터 플랫폼 기반 분석서비스 지원사업 - 유동정보 및 맞고리즘1"
                    ]
                }
            ]
        }
};

// 슬라이더 상태 관리
class CareerSliderState {
    constructor() {
        this.currentIndex = 0;
        this.items = careerData.projects;
        this.isAnimating = false;
    }

    // 다음 슬라이드 인덱스 계산
    getNextIndex() {
        return (this.currentIndex + 1) % this.items.length;
    }

    // 이전 슬라이드 인덱스 계산
    getPrevIndex() {
        return (this.currentIndex - 1 + this.items.length) % this.items.length;
    }

    // 특정 인덱스로 이동
    goToIndex(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
    }
}

// DOM 요소 참조
class CareerDOMReferences {
    constructor() {
        this.container = document.querySelector('.worked-container');
        this.slider = document.querySelector('.worked-slider-container');
        this.pagination = document.querySelector('.worked-pagination');
        this.prevBtn = document.querySelector('.worked-prev');
        this.nextBtn = document.querySelector('.worked-next');
        this.modal = document.querySelector('.worked-detail-modal');
        this.modalContent = document.querySelector('.worked-modal-content');
        this.businessPanel = document.querySelector('.worked-business-panel');
        this.businessToggle = document.querySelector('.worked-business-toggle');
    }
}

// 초기화 함수
function initializeCareerSection() {
    const state = new CareerSliderState();
    const dom = new CareerDOMReferences();

    // 초기 카드 생성
    createInitialCards(state, dom);
    
    // 페이지네이션 생성
    createPagination(state, dom);
    
    // 이벤트 리스너 설정
    setupEventListeners(state, dom);

    return { state, dom };
}

// 카드 생성 함수
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'worked-card';
    card.dataset.id = item.id;
    
    const html = `
        <img src="${item.image}" alt="${item.title}" class="worked-card-image">
        <div class="worked-card-content">
            <h3 class="worked-card-title">${item.title}</h3>
            <span class="worked-card-period">${item.period}</span>
            <p class="worked-card-description">${item.description}</p>
            <div class="worked-card-tags">
                ${item.tags.map(tag => `<span class="worked-tag ${tag === '정부지원사업' ? 'highlight' : ''}">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    card.innerHTML = html;
    return card;
}



// 슬라이더 애니메이션 관련 함수들

// 카드 위치 업데이트
function updateCardPositions(state, dom) {
    const cards = dom.slider.querySelectorAll('.worked-card');
    
    cards.forEach((card, index) => {
        // 모든 클래스 제거
        card.classList.remove('active', 'prev', 'next');
        
        // 새로운 위치에 따른 클래스 추가
        if (index === state.currentIndex) {
            card.classList.add('active');
        } else if (index === state.getPrevIndex()) {
            card.classList.add('prev');
        } else if (index === state.getNextIndex()) {
            card.classList.add('next');
        }
    });

    // 페이지네이션 업데이트
    updatePagination(state, dom);
}

// 슬라이드 전환 애니메이션
function animateSlide(direction, state, dom) {
    if (state.isAnimating) return;
    
    state.isAnimating = true;
    const cards = dom.slider.querySelectorAll('.worked-card');
    
    // 현재 카드
    const currentCard = cards[state.currentIndex];
    
    // 다음/이전 카드 결정
    const targetIndex = direction === 'next' ? state.getNextIndex() : state.getPrevIndex();
    const targetCard = cards[targetIndex];
    
    // 전환 애니메이션
    currentCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    targetCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // 상태 업데이트
    state.currentIndex = targetIndex;
    updateCardPositions(state, dom);
    
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
        state.isAnimating = false;
    }, 600);
}

// 페이지네이션 업데이트
function updatePagination(state, dom) {
    const dots = dom.pagination.querySelectorAll('.worked-dot');
    
    dots.forEach((dot, index) => {
        if (index === state.currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 카드 클릭 이벤트 처리
// 카드 클릭 이벤트 처리
function handleCardClick(card, state, dom) {
    const projectId = card.dataset.id;
    const project = state.items.find(item => item.id === projectId);
    
    if (project) {
        const index = state.items.findIndex(item => item.id === projectId);
        
        // 클릭한 카드가 active가 아니면 해당 카드로 이동 후 모달 표시
        if (!card.classList.contains('active')) {
            // 카드 이동 애니메이션
            state.goToIndex(index);
            updateCardPositions(state, dom);
            
            // 애니메이션이 완료된 후 모달 표시
            setTimeout(() => {
                loadProjectDetails(project, dom);
            }, 600); // 카드 이동 애니메이션 시간과 동일하게 설정
        } else {
            // active 카드면 바로 모달 표시
            loadProjectDetails(project, dom);
        }
    }
}

// 드래그 기능
function setupDragFunctionality(state, dom) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    dom.slider.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX;
        currentX = startX;
    });
    
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        
        currentX = e.pageX;
        const diff = currentX - startX;
        
        // 드래그 방향에 따라 미리보기 효과
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                dom.slider.classList.add('dragging-prev');
            } else {
                dom.slider.classList.add('dragging-next');
            }
        }
    });
    
    document.addEventListener('mouseup', e => {
        if (!isDragging) return;
        
        const diff = e.pageX - startX;
        if (Math.abs(diff) > 100) {
            // 충분한 드래그 거리가 있으면 슬라이드 전환
            if (diff > 0) {
                animateSlide('prev', state, dom);
            } else {
                animateSlide('next', state, dom);
            }
        }
        
        isDragging = false;
        dom.slider.classList.remove('dragging-prev', 'dragging-next');
    });
}

// 터치 이벤트 처리
function setupTouchFunctionality(state, dom) {
    let startX = 0;
    let currentX = 0;
    
    dom.slider.addEventListener('touchstart', e => {
        startX = e.touches[0].pageX;
        currentX = startX;
    }, { passive: true });
    
    dom.slider.addEventListener('touchmove', e => {
        currentX = e.touches[0].pageX;
    }, { passive: true });
    
    dom.slider.addEventListener('touchend', e => {
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                animateSlide('prev', state, dom);
            } else {
                animateSlide('next', state, dom);
            }
        }
    });
}


// 모달 및 마크다운 관련 함수들

// 프로젝트 상세 내용 로드
async function loadProjectDetails(project, dom) {
    try {
        // 모달 제목 설정
        dom.modal.querySelector('.worked-modal-title').textContent = project.title;
        
        // 마크다운 파일 로드
        const response = await fetch(project.mdFile);
        if (!response.ok) throw new Error('Failed to load project content');
        
        const mdContent = await response.text();
        
        // 마크다운을 HTML로 변환
        const htmlContent = marked.parse(mdContent);
        
        // 모달 내용 업데이트
        dom.modalContent.querySelector('.markdown-content').innerHTML = htmlContent;
        
        // 모달 표시
        showModal(dom.modal);
        
    } catch (error) {
        console.error('Error loading project details:', error);
        dom.modalContent.querySelector('.markdown-content').innerHTML = `
            <div class="error-message">
                <h3>컨텐츠를 불러오는데 실패했습니다</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// 사업계획서 목록 로드
// 기존 loadBusinessPlans 함수 수정
// loadBusinessPlans 함수 수정
function loadBusinessPlans(state, dom) {
    const businessList = dom.businessPanel.querySelector('.worked-business-list');
    businessList.innerHTML = '';
    
    Object.entries(careerData.businessPlans).reverse().forEach(([year, plans]) => {
        const yearSection = document.createElement('div');
        yearSection.className = 'year-section';
        
        yearSection.innerHTML = `
            <div class="year-header">
                <div class="year-label">
                    ${year}
                    <div class="project-count">${plans.length}개 계획서</div>
                </div>
                <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="year-content">
                ${plans.map(plan => `
                    <div class="worked-business-item">
                        <div class="worked-business-item-header">
                            <span class="period-badge">${plan.period}</span>
                            <h4 class="business-title">${plan.title}</h4>
                        </div>
                        <div class="worked-business-item-content">
                            ${plan.company ? `<p class="business-company">${plan.company}</p>` : ''}
                            <ul class="business-details">
                                ${plan.details.map(detail => `
                                    <li>${detail}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        yearSection.querySelector('.year-header').addEventListener('click', () => {
            yearSection.classList.toggle('active');
        });
        
        businessList.appendChild(yearSection);
    });
}



// 새로운 이벤트 리스너 설정 함수
function setupBusinessPlanEventListeners() {
    // 연도 섹션 토글
    document.querySelectorAll('.year-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleYear(header.closest('.year-section'));
        });
    });
    
    // 비즈니스 아이템 클릭
    document.querySelectorAll('.worked-business-item').forEach(item => {
        item.addEventListener('click', () => {
            handleBusinessItemClick(item);
        });
    });
}

// toggleYear 함수는 그대로 사용
function toggleYear(yearSection) {
    const allSections = document.querySelectorAll('.year-section');
    allSections.forEach(section => {
        if (section !== yearSection) {
            section.classList.remove('active');
        }
    });
    yearSection.classList.toggle('active');
}

// handleBusinessItemClick 함수 수정
function handleBusinessItemClick(item) {
    const businessId = item.dataset.id;
    const plan = careerData.businessPlans.find(p => p.id === businessId);
    
    if (plan) {
        loadBusinessPlanDetails(plan);
    }
}

// 사업계획서 상세 내용 로드
async function loadBusinessPlanDetails(plan, dom) {
    try {
        // 모달 제목 설정
        dom.modal.querySelector('.worked-modal-title').textContent = plan.title;
        
        // 마크다운 파일 로드
        const response = await fetch(plan.mdFile);
        if (!response.ok) throw new Error('Failed to load business plan content');
        
        const mdContent = await response.text();
        
        // 마크다운을 HTML로 변환
        const htmlContent = marked.parse(mdContent);
        
        // 모달 내용 업데이트
        dom.modalContent.querySelector('.markdown-content').innerHTML = htmlContent;
        
        // 모달 표시
        showModal(dom.modal);
        
    } catch (error) {
        console.error('Error loading business plan details:', error);
        showError('사업계획서를 불러오는데 실패했습니다.');
    }
}

// 모달 표시
// 모달 표시 함수
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ESC 키 이벤트와 외부 클릭 이벤트를 함께 처리
    const handleClose = (e) => {
        if (e.key === 'Escape' || e.target === modal) {  // 외부 클릭 조건 추가
            closeModal(modal);
            document.removeEventListener('keydown', handleClose);
            modal.removeEventListener('click', handleClose);
        }
    };

    // 키보드 이벤트와 클릭 이벤트 모두 등록
    document.addEventListener('keydown', handleClose);
    modal.addEventListener('click', handleClose);
}

// 모달 닫기 함수
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 에러 메시지 표시
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'worked-error';
    errorElement.textContent = message;
    
    document.body.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
}

// 이미지 로딩 처리
function handleImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            img.parentElement.innerHTML = `
                <div class="image-error">
                    이미지를 불러올 수 없습니다
                </div>
            `;
        });
    });
}

// 이벤트 리스너 및 초기화 관련 함수들

// 이벤트 리스너 설정
function setupEventListeners(state, dom) {
    // 네비게이션 버튼 이벤트
    dom.prevBtn.addEventListener('click', () => animateSlide('prev', state, dom));
    dom.nextBtn.addEventListener('click', () => animateSlide('next', state, dom));
    
    // 모달 닫기 버튼 이벤트
    const modalCloseBtn = dom.modal.querySelector('.worked-modal-close');
    modalCloseBtn.addEventListener('click', () => closeModal(dom.modal));
    
    // 사업계획서 토글 버튼 이벤트
    dom.businessToggle.addEventListener('click', () => {
        dom.businessPanel.classList.add('active');
        loadBusinessPlans(state, dom);
    });
    
    // 사업계획서 패널 닫기 버튼 이벤트
    const businessCloseBtn = dom.businessPanel.querySelector('.worked-business-close');
    businessCloseBtn.addEventListener('click', () => {
        dom.businessPanel.classList.remove('active');
    });
    
    // 카드 클릭 이벤트
      // 카드 클릭 이벤트 수정
    dom.slider.addEventListener('click', (e) => {
        const card = e.target.closest('.worked-card');
        if (card) {
            handleCardClick(card, state, dom);
        }
    });
    
    // 드래그 및 터치 이벤트 설정
    setupDragFunctionality(state, dom);
    setupTouchFunctionality(state, dom);
    
    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', () => {
        updateCardPositions(state, dom);
    });
}

// 초기 카드 생성
function createInitialCards(state, dom) {
    // 기존 카드 제거
    dom.slider.innerHTML = '';
    
    // 새 카드 생성 및 추가
    state.items.forEach(item => {
        const card = createCard(item);
        dom.slider.appendChild(card);
    });
    
    // 초기 카드 위치 설정
    updateCardPositions(state, dom);
}

// 페이지네이션 생성
function createPagination(state, dom) {
    // 기존 페이지네이션 제거
    dom.pagination.innerHTML = '';
    
    // 새 페이지네이션 도트 생성
    state.items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'worked-dot';
        if (index === state.currentIndex) {
            dot.classList.add('active');
        }
        
        // 클릭 이벤트 추가
        dot.addEventListener('click', () => {
            if (index !== state.currentIndex) {
                state.goToIndex(index);
                updateCardPositions(state, dom);
            }
        });
        
        dom.pagination.appendChild(dot);
    });
}

// Intersection Observer 설정
function setupIntersectionObserver(dom) {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);
    
    // 카드들 관찰 시작
    const cards = dom.slider.querySelectorAll('.worked-card');
    cards.forEach(card => observer.observe(card));
}

// 전체 초기화
document.addEventListener('DOMContentLoaded', () => {
    const { state, dom } = initializeCareerSection();
    setupIntersectionObserver(dom);
});


// 사업계획서 목록 생성
function createBusinessPlanList(plans) {
    const businessList = document.createElement('div');
    businessList.className = 'worked-business-list';
    
    plans.forEach(plan => {
        const planItem = createBusinessPlanItem(plan);
        businessList.appendChild(planItem);
    });
    
    return businessList;
}

function createBusinessPlansList() {
    const container = document.querySelector('.worked-business-panel');
    const content = container.querySelector('.worked-business-content');
    
    // 년도별로 섹션 생성
    Object.entries(careerData.businessPlans).forEach(([year, plans]) => {
        const yearSection = document.createElement('div');
        yearSection.className = 'year-section';
        yearSection.innerHTML = `
            <div class="year-header" onclick="toggleYear(this)">
                <div class="year-label">
                    ${year}
                    <div class="project-count">${plans.length}개 계획서</div>
                </div>
                <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="business-list">
                ${plans.map(plan => `
                    <div class="business-item">
                        <div class="business-header" onclick="toggleBusiness(this)">
                            <div class="business-title">
                                <span class="period-badge">${plan.period}</span>
                                ${plan.title}
                            </div>
                            <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="business-content">
                            ${plan.company ? `<div class="detail-company">${plan.company}</div>` : ''}
                            <ul class="detail-list">
                                ${plan.details.map(detail => `
                                    <li class="detail-item">${detail}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        content.appendChild(yearSection);
    });
}

// 사업계획서 아이템 생성
function createBusinessPlanItem(plan) {
    const item = document.createElement('div');
    item.className = 'worked-business-item';
    
    item.innerHTML = `
        <div class="worked-business-header">
            <h3 class="worked-business-title">${plan.title}</h3>
            <span class="worked-business-period">${plan.period}</span>
        </div>
        <p class="worked-business-company">${plan.company}</p>
        <div class="worked-business-description">${plan.description}</div>
        <div class="worked-business-tags">
            <span class="worked-tag highlight">정부지원사업</span>
        </div>
    `;
    
    // 클릭 이벤트 추가
    item.addEventListener('click', () => loadBusinessPlanDetails(plan));
    
    return item;
}

// 사업계획서 패널 표시
function showBusinessPlans() {
    const panel = document.querySelector('.worked-business-panel');
    const content = panel.querySelector('.worked-business-content');
    
    // 기존 내용 초기화
    content.innerHTML = `
        <div class="worked-business-header">
            <h2 class="worked-title">작성 사업계획서</h2>
            <button class="worked-modal-close" onclick="closeBusinessPlans()">&times;</button>
        </div>
    `;
    
    // 사업계획서 목록 생성 및 추가
    const plansList = createBusinessPlanList(careerData.businessPlans);
    content.appendChild(plansList);
    
    // 패널 표시
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 사업계획서 패널 닫기
function closeBusinessPlans() {
    const panel = document.querySelector('.worked-business-panel');
    panel.classList.remove('active');
    document.body.style.overflow = '';
}

// 모달 열기 함수 수정
function showBusinessPanel() {
    const panel = document.querySelector('.worked-business-panel');
    panel.classList.add('active');
    document.body.style.overflow = 'hidden'; // 외부 스크롤 금지
}

// 모달 닫기 함수 수정
function closeBusinessPanel() {
    const panel = document.querySelector('.worked-business-panel');
    panel.classList.remove('active');
    document.body.style.overflow = ''; // 외부 스크롤 복원
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    const businessToggle = document.querySelector('.worked-business-toggle');
    const businessClose = document.querySelector('.worked-business-close');

    // 사업계획서 패널 열기
    businessToggle.addEventListener('click', showBusinessPanel);

    // 사업계획서 패널 닫기
    businessClose.addEventListener('click', closeBusinessPanel);

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const panel = document.querySelector('.worked-business-panel');
            if (panel.classList.contains('active')) {
                closeBusinessPanel();
            }
        }
    });
});



/**
============================================================================================================================
경진대회 
============================================================================================================================
*/



// 경진대회 데이터 객체
const competitionData = {
    'dacon_income_ai': {
        title: '소득 예측 AI 해커톤',
        host: 'Dacon',
        period: '2024.03.11 ~ 2024.04.08',
        rank: '상위 1.3%',
        mdFile: './md/competition/dacon_income_ai/content.md'
    }
};

// 모달 관련 함수들
async function showCompetitionDetails(competitionId) {
    const overlay = document.getElementById('competitions-modal-overlay');
    const modal = document.getElementById('competitions-modal');
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    // 스크롤바 너비만큼 padding-right 추가하여 화면 흔들림 방지
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    try {
        const competition = competitionData[competitionId];
        if (!competition) {
            throw new Error('Competition not found');
        }

        // 마크다운 파일 로드
        const response = await fetch(competition.mdFile);
        if (!response.ok) {
            throw new Error('Failed to load competition content');
        }
        
        const mdContent = await response.text();
        
        // 모달 내용 설정
        modal.innerHTML = `
            <div class="competitions-modal-header">
                <h2 class="competitions-modal-title">${competition.title}</h2>
                <button class="competitions-modal-close" onclick="closeCompetitionModal()">×</button>
            </div>
            <div class="competitions-modal-content markdown-content">
                ${marked.parse(mdContent)}
            </div>
        `;

        // 모달 표시
        overlay.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

    } catch (error) {
        console.error('Error showing competition details:', error);
        modal.innerHTML = `
            <div class="competitions-modal-header">
                <h2 class="competitions-modal-title">오류 발생</h2>
                <button class="competitions-modal-close" onclick="closeCompetitionModal()">×</button>
            </div>
            <div class="competitions-modal-content">
                <p>내용을 불러오는 중 오류가 발생했습니다.</p>
            </div>
        `;
        
        overlay.style.display = 'flex';
    }
}

// 모달 닫기
function closeCompetitionModal() {
    const modal = document.getElementById('competitions-modal');
    const overlay = document.getElementById('competitions-modal-overlay');
    
    modal.classList.remove('active');
    
    // body 스크롤 복원
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

// 필터링 함수
function filterCompetitions(year) {
    const rows = document.querySelectorAll('.competitions-table tbody tr');
    rows.forEach(row => {
        const date = row.querySelector('td:nth-child(2)').textContent;
        const rowYear = '20' + date.split('.')[0];
        
        if (year === 'all' || rowYear === year) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 자세히 보기 버튼 이벤트
    const detailsBtn = document.querySelector('.competitions-details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            showCompetitionDetails('dacon_income_ai');
        });
    }

    // 필터 버튼 이벤트
    const filterButtons = document.querySelectorAll('.competitions-controls button');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const year = button.textContent === '전체' ? 'all' : button.textContent;
            filterCompetitions(year);
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCompetitionModal();
    });

    // 모달 외부 클릭 시 닫기
    document.getElementById('competitions-modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'competitions-modal-overlay') closeCompetitionModal();
    });
});

// 모달 닫기 버튼 이벤트
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('competitions-modal-close')) {
        closeCompetitionModal();
    }
});



function toggleVideos(button) {
    const links = button.nextElementSibling;
    const allLinks = document.querySelectorAll('.video-links');
    
    // 다른 모든 비디오 링크 메뉴 닫기
    allLinks.forEach(el => {
        if (el !== links) {
            el.style.display = 'none';
        }
    });
    
    // 현재 메뉴 토글
    links.style.display = links.style.display === 'block' ? 'none' : 'block';
}

// 문서 클릭 시 모든 메뉴 닫기
document.addEventListener('click', function(event) {
    if (!event.target.closest('.video-container')) {
        document.querySelectorAll('.video-links').forEach(el => {
            el.style.display = 'none';
        });
    }
});

function openVideoWindow() {
    // 새 창을 열고 HTML 내용을 작성합니다
    const videoWindow = window.open('videos.html', '_blank', 'width=800,height=800');
    videoWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>프로젝트 영상</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                .video-frame {
                    flex: 1;
                    margin: 10px 0;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <iframe class="video-frame" src="video/competitions/tree_project_1.mp4" frameborder="0" allowfullscreen></iframe>
            <iframe class="video-frame" src="video/competitions/tree_project_2.mp4" frameborder="0" allowfullscreen></iframe>
        </body>
        </html>
    `);
    videoWindow.document.close();
}















/**
============================================================================================================================
side-project
============================================================================================================================
*/