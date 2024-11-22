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
애니메이션 슬라이더
============================================================================================================================
*/
// 모달 열림 이벤트 처리를 위한 커스텀 이벤트 디스패처
// 모달 열림 이벤트 처리를 위한 커스텀 이벤트 디스패처
// 스크롤 방지 함수 개선
class VerticalSlider {
    constructor() {
        this.wrapper = document.querySelector('.animation-wrapper');
        this.sections = document.querySelectorAll('.animation-section');
        this.dots = document.querySelectorAll('.animation-progress-dot');
        this.currentIndex = 0;
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setActiveSection(0);
        this.bindEvents();
    }

    bindEvents() {
        // 휠 이벤트
        window.addEventListener('wheel', (e) => {
            if (this.isAnimating || this.isModalOpen()) return;
            e.preventDefault();

            this.isAnimating = true;
            if (e.deltaY > 0) {
                this.navigate(1);
            } else {
                this.navigate(-1);
            }
        }, { passive: false });

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating || this.isModalOpen()) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigate(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigate(-1);
            }
        });

        // 네비게이션 닷 클릭
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.isAnimating || this.isModalOpen()) return;
                this.navigateToSection(index);
            });
        });

        // 네비게이션 링크 클릭
        document.querySelectorAll('.navbar-link').forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAnimating || this.isModalOpen()) return;
                this.navigateToSection(index);
            });
        });
    }

    isModalOpen() {
        return document.querySelector('.modal.active, .worked-detail-modal.active, .worked-business-panel.active, .competitions-modal-overlay.active, .project-slide-layer.is-visible') !== null;
    }

    navigate(direction) {
        const nextIndex = this.currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= this.sections.length) {
            this.isAnimating = false;
            return;
        }

        this.navigateToSection(nextIndex);
    }

    navigateToSection(index) {
        if (index === this.currentIndex) {
            this.isAnimating = false;
            return;
        }

        const direction = index > this.currentIndex ? 1 : -1;

        // 현재 섹션 처리
        if (this.sections[this.currentIndex]) {
            this.sections[this.currentIndex].classList.add(direction > 0 ? 'previous' : 'next');
            this.sections[this.currentIndex].classList.remove('active');
        }

        // 새 섹션 활성화
        this.setActiveSection(index);

        // 트랜지션
        this.wrapper.style.transform = `translateY(-${index * 100}vh)`;

        // 상태 업데이트
        this.currentIndex = index;

        // 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
            this.sections.forEach(section => {
                section.classList.remove('previous', 'next');
            });
            this.isAnimating = false;
        }, 1000);
    }

    setActiveSection(index) {
        // 섹션 활성화 상태 업데이트
        this.sections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });

        // 닷 네비게이션 업데이트
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // 네비게이션 링크 활성화 상태 업데이트
        document.querySelectorAll('.navbar-link').forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
    }
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new VerticalSlider();
});

/**
============================================================================================================================
타이핑 효과
============================================================================================================================
*/
async function typeText(element, text, delay = 50) { // delay를 50ms로 줄임
    let displayText = '';
    for (let i = 0; i < text.length; i++) {
        displayText += text[i];
        element.innerHTML = getHighlightedHTML(displayText);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 부드러운 슬라이딩 효과 추가
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }
}

function initFlowingText() {
    const flowingText = document.querySelector('.flowing-text');
    const text = flowingText.textContent;
    flowingText.textContent = '';
    
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'flowing-char';
        span.style.setProperty('--char-index', index);
        
        // 공백 처리
        if (char.trim() === '') {
            span.innerHTML = '&nbsp;';
        }
        
        // 하이라이트 처리 (선택적)
        if (char.match(/[A-Z]/)) {
            span.classList.add('highlight');
        }
        
        flowingText.appendChild(span);
        
        // 각 문자를 순차적으로 표시
        setTimeout(() => {
            span.classList.add('active');
        }, index * 100);
    });
}

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', initFlowingText);

// 스크롤 시 애니메이션 재생 (선택적)
function handleScroll() {
    const flowingTexts = document.querySelectorAll('.flowing-text');
    
    flowingTexts.forEach(text => {
        const rect = text.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            text.querySelectorAll('.flowing-char').forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('active');
                }, index * 100);
            });
        }
    });
}

window.addEventListener('scroll', handleScroll);

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', initFlowingText);

// 스크롤 시 애니메이션 재생 (선택적)
function handleScroll() {
    const flowingTexts = document.querySelectorAll('.flowing-text');
    
    flowingTexts.forEach(text => {
        const rect = text.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            text.querySelectorAll('.flowing-char').forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('active');
                }, index * 100);
            });
        }
    });
}

window.addEventListener('scroll', handleScroll);

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 파티클 생성

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
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning', '#정부지원사업'],
            mdFile: './md/project/monitoring.md',
            image: './images/projects/work2.png'
        },
        {
            id: 'ipservicegrowth_dev',
            title: '지식재산서비스 성장지원사업',
            period: '2023년 5월 ~ 2023년 11월',
            description: '중소기업의 데이터 기반 의사결정을 지원하기 위한 프로젝트로, 매출 데이터 분석 및 예측 모델을 구축했습니다.',
            tags: ['PYTHON', 'BIGDATA', 'DeepLearning', '#정부지원사업'],
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
        // 현재 슬라이드 인덱스
        this.currentIndex = 0;
        // 전체 프로젝트 데이터
        this.items = careerData.projects;
        // 애니메이션 진행 중 여부
        this.isAnimating = false;
    }

    // 특정 인덱스로 이동
    goToIndex(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        // 범위를 벗어나는 경우 처리
        if (index < 0) index = this.items.length - 1;
        if (index >= this.items.length) index = 0;
        
        this.currentIndex = index;
    }

    // 다음 슬라이드 인덱스 계산
    getNextIndex() {
        return (this.currentIndex + 1) % this.items.length;
    }

    // 이전 슬라이드 인덱스 계산
    getPrevIndex() {
        return (this.currentIndex - 1 + this.items.length) % this.items.length;
    }
}


// 이벤트 리스너 설정
function setupEventListeners(state, dom) {
    // 이전 버튼 클릭 이벤트
    dom.prevBtn.addEventListener('click', () => {
        if (!state.isAnimating) {
            state.isAnimating = true;
            state.goToIndex(state.getPrevIndex());
            updateCardPositions(state, dom);
            
            // 애니메이션 완료 후 상태 초기화
            setTimeout(() => {
                state.isAnimating = false;
            }, 600); // 600ms는 트랜지션 시간과 일치
        }
    });

    // 다음 버튼 클릭 이벤트
    dom.nextBtn.addEventListener('click', () => {
        if (!state.isAnimating) {
            state.isAnimating = true;
            state.goToIndex(state.getNextIndex());
            updateCardPositions(state, dom);
            
            // 애니메이션 완료 후 상태 초기화
            setTimeout(() => {
                state.isAnimating = false;
            }, 600);
        }
    });

    // 카드 클릭 이벤트
    dom.slider.addEventListener('click', (e) => {
        const card = e.target.closest('.worked-card');
        if (card) {
            handleCardClick(card, state, dom);
        }
    });

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

// DOM 요소 참조
class CareerDOMReferences {
    constructor() {
        // 필요한 DOM 요소들을 찾아서 저장
        this.container = document.querySelector('.worked-container');
        this.slider = document.querySelector('.worked-slider-container');
        this.pagination = document.querySelector('.worked-pagination');
        // 이전/다음 버튼 요소 찾기
        this.prevBtn = document.querySelector('.fa-angle-left'); // FontAwesome 아이콘 클래스
        this.nextBtn = document.querySelector('.fa-angle-right'); // FontAwesome 아이콘 클래스
        this.modal = document.querySelector('.worked-detail-modal');
        this.modalContent = document.querySelector('.worked-modal-content');
        this.businessPanel = document.querySelector('.worked-business-panel');
        this.businessToggle = document.querySelector('.worked-business-toggle');
    }
}

// 초기화 함수
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
    
    // 태그 HTML 생성 로직
    // "#" 로 시작하는 태그는 highlight 클래스 추가
    const tagsHtml = item.tags.map(tag => {
        // "#" 로 시작하는 태그인지 확인
        const isHashTag = tag.startsWith('#');
        // highlight 클래스를 조건부로 추가
        const tagClass = isHashTag ? 'worked-tag highlight' : 'worked-tag';
        return `<span class="${tagClass}">${tag}</span>`;
    }).join('');
    
    const html = `
        <img src="${item.image}" alt="${item.title}" class="worked-card-image">
        <div class="worked-card-content">
            <h3 class="worked-card-title">${item.title}</h3>
            <span class="worked-card-period">${item.period}</span>
            <p class="worked-card-description">${item.description}</p>
            <div class="worked-card-tags">
                ${tagsHtml}
            </div>
        </div>
    `;
    
    card.innerHTML = html;
    return card;
}



// 슬라이더 애니메이션 관련 함수들

// 카드 위치 업데이트
// 카드 위치 업데이트
function updateCardPositions(state, dom) {
    const cards = dom.slider.querySelectorAll('.worked-card');
    
    cards.forEach((card, index) => {
        // 모든 카드의 클래스 초기화
        card.classList.remove('active', 'prev', 'next');
        
        // 현재 카드
        if (index === state.currentIndex) {
            card.classList.add('active');
        }
        // 이전 카드
        else if (index === state.getPrevIndex()) {
            card.classList.add('prev');
        }
        // 다음 카드
        else if (index === state.getNextIndex()) {
            card.classList.add('next');
        }
    });

    // 페이지네이션 업데이트 (있는 경우)
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
        
        // 클릭한 카드가 active가 아닌 경우 해당 카드로만 이동
        if (!card.classList.contains('active')) {
            state.goToIndex(index);
            updateCardPositions(state, dom);
        } else {
            // active 카드(가운데 카드)를 클릭했을 때만 모달 표시
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

class CompetitionsManager {
    constructor() {
        // DOM 요소 참조
        this.tabButtons = document.querySelectorAll('.competitions-tab-btn');
        this.tabContents = document.querySelectorAll('.competitions-tab-content');
        this.modal = document.getElementById('competitions-modal');
        this.modalOverlay = document.getElementById('competitions-modal-overlay');
        this.detailsBtn = document.querySelector('.competitions-details-btn');
        this.filterButtons = document.querySelectorAll('.competitions-controls button');

        // 이벤트 리스너 초기화
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 탭 전환 이벤트
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // 자세히 보기 버튼 이벤트
        if (this.detailsBtn) {
            this.detailsBtn.addEventListener('click', () => {
                this.showCompetitionDetails('dacon_income_ai');
            });
        }

        // 모달 닫기 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) this.closeModal();
            });
        }

        // 필터 버튼 이벤트
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const year = button.textContent === '전체' ? 'all' : button.textContent;
                this.filterCompetitions(year);
            });
        });

        // 모달 닫기 버튼 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('competitions-modal-close')) {
                this.closeModal();
            }
        });
    }

    // 탭 전환 함수
   // 탭 전환 함수 수정
   // 탭 전환 함수 수정
    switchTab(tabId) {
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
        });
        
        this.tabButtons.forEach(button => button.classList.remove('active'));

        const selectedTab = document.getElementById(`${tabId}-tab`);
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);

        if (selectedTab && selectedButton) {
            selectedButton.classList.add('active');
            // 페이드 인 효과를 위한 지연
            setTimeout(() => {
                selectedTab.classList.add('active');
                selectedTab.style.opacity = '1';
            }, 50);
        }
    }

    // 경진대회 상세 정보 표시
    async showCompetitionDetails(competitionId) {
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
            this.modal.innerHTML = `
                <div class="competitions-modal-header">
                    <h2 class="competitions-modal-title">${competition.title}</h2>
                    <button class="competitions-modal-close">×</button>
                </div>
                <div class="competitions-modal-content markdown-content">
                    ${marked.parse(mdContent)}
                </div>
            `;

            // 모달 표시
            this.modalOverlay.classList.add('active');
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error showing competition details:', error);
            this.showErrorModal();
        }
    }

    // 에러 모달 표시
    showErrorModal() {
        this.modal.innerHTML = `
            <div class="competitions-modal-header">
                <h2 class="competitions-modal-title">오류 발생</h2>
                <button class="competitions-modal-close">×</button>
            </div>
            <div class="competitions-modal-content">
                <p>내용을 불러오는 중 오류가 발생했습니다.</p>
            </div>
        `;
        
        this.modalOverlay.classList.add('active');
        this.modal.classList.add('active');
    }

    // 모달 닫기
    closeModal() {
        if (this.modal && this.modalOverlay) {
            this.modal.classList.remove('active');
            this.modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // 경진대회 필터링
    filterCompetitions(year) {
        const rows = document.querySelectorAll('.competitions-table tbody tr');
        rows.forEach(row => {
            const date = row.querySelector('td:nth-child(2)').textContent;
            const rowYear = '20' + date.split('.')[0];
            
            row.style.display = (year === 'all' || rowYear === year) ? '' : 'none';
        });
    }
}

// 비디오 링크 토글 함수
function toggleVideos(button) {
    const links = button.nextElementSibling;
    const allLinks = document.querySelectorAll('.video-links');

    allLinks.forEach(el => {
        if (el !== links) {
            el.style.display = 'none';
        }
    });

    links.style.display = links.style.display === 'block' ? 'none' : 'block';
}

// 문서 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const competitionsManager = new CompetitionsManager();

    // 비디오 링크 외부 클릭 시 닫기
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.video-container')) {
            document.querySelectorAll('.video-links').forEach(el => {
                el.style.display = 'none';
            });
        }
    });

    // 초기 탭 설정 (현재 진행중 탭을 기본으로)
    competitionsManager.switchTab('current');
});















// ============================================================================================================================
// side-project
// ============================================================================================================================
// 프로젝트 설정
// 프로젝트 설정
const sideProjectData = {
    'db-관리자': {
        title: 'DB 관리자 도구',
        category: 'Management Tool',
        type: 'Database',
        description: '데이터베이스를 효율적으로 관리하고 모니터링할 수 있는 관리자 도구입니다.',
        headerText: "Side Projects - DB 관리자",
        mainDescription: "데이터베이스를 효율적으로 관리하고 모니터링할 수 있는 관리자 도구입니다. AI와 데이터를 활용하여 직관적인 인터페이스를 구현했습니다.",
        tags: ['Database', 'Management'],
        mdFile: 'md/side-project/db관리자도구.md',
        image: 'images/home/aurora.png'
    },
    '가계부': {
        title: '가계부',
        category: 'Finance Tool',
        type: 'Personal Finance',
        description: '개인 재무를 관리할 수 있는 스마트한 가계부 도구입니다.',
        headerText: "Side Projects - 가계부",
        mainDescription: "AI 기반의 지능형 가계부로 수입/지출을 효과적으로 관리하고 분석할 수 있습니다.",
        tags: ['Finance', 'AI'],
        mdFile: 'md/side-project/신상품모니터링1.md',
        image: 'images/background/stratosphere.jpg'
    },
    '챗봇': {
        title: 'AI 챗봇',
        category: 'AI Tool',
        type: 'Chatbot',
        description: 'AI 기반의 지능형 챗봇 시스템입니다.',
        headerText: "Side Projects - AI 챗봇",
        mainDescription: "자연어 처리 기술을 활용한 지능형 챗봇으로 사용자와 자연스러운 대화가 가능합니다.", 
        tags: ['AI', 'NLP'],
        mdFile: 'md/side-project/신상품모니터링2.md',
        image: 'images/background/switzerland.jpg'
    }
};

// 마크다운 파일 로드 함수
async function loadMarkdownFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('마크다운 파일 로드 에러:', error);
        throw error;
    }
}

class ProjectSlider {
    constructor() {
        this.container = document.querySelector('.side-project__slider-container');
        this.cards = Array.from(document.querySelectorAll('.side-project__card'));
        this.currentIndex = 0;
        this.totalSlides = this.cards.length;
        this.isAnimating = false;
        
        this.prevBtn = document.querySelector('.side-project__nav--prev');
        this.nextBtn = document.querySelector('.side-project__nav--next');
        
        this.init();
    }

    init() {
        this.updateSlides();
        this.bindEvents();
    }

    handleCardClick(card) {
        const clickedIndex = this.cards.indexOf(card);
        
        // 클릭된 카드가 현재 활성화된 카드가 아닌 경우
        if (clickedIndex !== this.currentIndex) {
            this.navigateToCard(clickedIndex);
            return;
        }
        
        // 현재 활성화된 (가운데 있는) 카드를 클릭한 경우에만 모달 열기
        if (clickedIndex === this.currentIndex) {
            const projectId = card.getAttribute('project');
            if (projectId) {
                this.showProjectDetail(projectId);
            }
        }
    }

    navigateToCard(targetIndex) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.currentIndex = targetIndex;
        this.updateSlides();

        // 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
            this.isAnimating = false;
        }, 600); // 트랜지션 시간과 동일하게 설정
    }

    async showProjectDetail(projectId) {
        const slideLayer = document.querySelector('.project-slide-layer');
        const slideTitle = slideLayer.querySelector('.slide-layer__title');
        const slideBody = slideLayer.querySelector('.slide-layer__body');
        
        try {
            const project = sideProjectData[projectId];
            if (!project) {
                throw new Error(`프로젝트 ID "${projectId}"를 찾을 수 없습니다.`);
            }

            slideTitle.textContent = project.title;
            slideBody.innerHTML = '<div class="loading">Loading...</div>';
            
            slideLayer.classList.add('is-visible');
            document.body.style.overflow = 'hidden';

            const markdownContent = await loadMarkdownFile(project.mdFile);
            const parsedContent = marked.parse(markdownContent);
            
            slideBody.innerHTML = parsedContent;
            this.handleImages(slideBody);

        } catch (error) {
            console.error('프로젝트 로드 에러:', error);
            slideBody.innerHTML = `
                <div class="slide-layer__error">
                    <h3>프로젝트를 불러오는데 실패했습니다</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    handleImages(container) {
        const images = container.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            img.addEventListener('error', () => {
                img.parentElement.innerHTML = `
                    <div class="image-error">이미지를 불러올 수 없습니다</div>
                `;
            });
        });
    }

    updateSlides() {
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                card.classList.add('active');
                this.updateDescription(index);
            } else if (index === this.getPrevIndex()) {
                card.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                card.classList.add('next');
            }
        });
    }

    updateDescription(index) {
        const project = sideProjectData[this.cards[index].getAttribute('project')];
        const infoSection = document.querySelector('.side-project__info');
        
        if (!project) return;

        infoSection.innerHTML = `
            <div class="side-project__header">
                ${project.headerText}
            </div>
            <h2 class="side-project__title">
                ${project.title}
            </h2>
            <p class="side-project__description">
                ${project.mainDescription}
            </p>
            <div class="side-project__tags">
                ${project.tags.map(tag => `
                    <span class="side-project__tag">${tag}</span>
                `).join('')}
            </div>
        `;
    }

    bindEvents() {
        // 카드 클릭 이벤트
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCardClick(card);
            });
        });

        // 이전/다음 버튼 이벤트
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.navigateToCard(this.getPrevIndex());
                }
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.navigateToCard(this.getNextIndex());
                }
            });
        }

        // 터치 이벤트
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.navigateToCard(this.getNextIndex());
                } else {
                    this.navigateToCard(this.getPrevIndex());
                }
            }
        }, { passive: true });
    }

    getPrevIndex() {
        return (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    }

    getNextIndex() {
        return (this.currentIndex + 1) % this.totalSlides;
    }
}

// 모달 닫기 함수
function closeSlideLayer() {
    const slideLayer = document.querySelector('.project-slide-layer');
    slideLayer.classList.remove('is-visible');
    document.body.style.overflow = '';
    setTimeout(() => {
        slideLayer.querySelector('.slide-layer__body').innerHTML = '';
    }, 300);
}

// 초기화 및 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
    const slider = new ProjectSlider();
    window.projectSlider = slider;

    // 외부 카드 클릭 이벤트 처리
    const externalProjectCards = document.querySelectorAll('[data-project]');
    externalProjectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = card.dataset.project;
            if (projectId && window.projectSlider) {
                // 먼저 해당 카드로 이동
                const targetIndex = slider.cards.findIndex(c => 
                    c.getAttribute('project') === projectId
                );
                if (targetIndex !== -1) {
                    slider.navigateToCard(targetIndex);
                }
            }
        });
    });

    // 모달 닫기 버튼 이벤트
    const closeButton = document.querySelector('.slide-layer__close');
    if (closeButton) {
        closeButton.addEventListener('click', closeSlideLayer);
    }

    // 모달 외부 클릭 시 닫기
    const slideLayer = document.querySelector('.project-slide-layer');
    if (slideLayer) {
        slideLayer.addEventListener('click', (e) => {
            if (e.target === slideLayer) {
                closeSlideLayer();
            }
        });
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.project-slide-layer.is-visible')) {
            closeSlideLayer();
        }
    });
});
