/**
 * 질병관리청 안내 웹 포털 인터랙션 스크립트 (Vanilla JS)
 * - 외부 라이브러리 및 서버 없이 순수 브라우저 환경에서 동작
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 국민 맞춤 지원 혜택 체크리스트 설문
  initBenefitFinder();

  // 2. 핵심 업무 탭 필터링
  initDutiesFilter();

  // 3. 건강 상식 미니 퀴즈 렌더링 및 토글
  renderHealthQuiz();

  // 4. 최신 뉴스 및 정책 보도자료 렌더링
  renderLatestNews();

  // 5. 스무스 스크롤 네비게이션
  initSmoothScroll();
});

/**
 * 0. 국민 맞춤 혜택 & 지원 찾기 (Benefit Finder)
 */
function initBenefitFinder() {
  const checkResultBtn = document.getElementById("checkResultBtn");
  const resetBtn = document.getElementById("resetChecklistBtn");
  const reselectBtn = document.getElementById("reselectBtn");
  const resultContainer = document.getElementById("resultContainer");
  const matchedCardsContainer = document.getElementById("matchedCardsContainer");
  const resultTitle = document.getElementById("resultTitle");
  const resultSubtitle = document.getElementById("resultSubtitle");
  const checkboxes = document.querySelectorAll('input[name="benefit"]');

  // 맞춤 혜택 데이터베이스
  const benefitsDB = {
    infant: {
      type: "국가예방접종 지원",
      title: "어린이 국가필수예방접종(NIP) 18종 전액 무료",
      desc: "결핵(BCG), B형간염, DTaP, 폴리오, MMR, 수두 등 만 12세 이하 어린이의 18종 백신을 전국 보건소 및 지정 위탁의료기관에서 비용 부담 없이 100% 무료 지원합니다.",
      linkText: "지정 의료기관 및 접종일정 조회",
      url: "https://nip.kdca.go.kr"
    },
    senior: {
      type: "고위험군 보호",
      title: "만 65세 이상 어르신 독감·코로나19·폐렴구균 무료 백신",
      desc: "어르신의 중증 감염 예방을 위해 매년 절기 인플루엔자 백신과 코로나19 백신, 평생 1회 폐렴구균(23가 다당질) 백신을 무료로 접종해 드립니다. 또한 고령자 낙상사고 예방 가이드라인을 제공합니다.",
      linkText: "어르신 접종 지원 안내",
      url: "https://nip.kdca.go.kr"
    },
    pregnant: {
      type: "모자 보건",
      title: "임신부 인플루엔자 무료 접종 및 감염병 산전 관리",
      desc: "임신 주수와 무관하게 임신부와 태아의 건강 보호를 위해 인플루엔자(독감) 백신을 전액 무료 지원합니다. 풍진, 거대세포바이러스 등 산전 필수 감염병 검사 정보도 함께 제공합니다.",
      linkText: "임신부 백신 지원 상세",
      url: "https://nip.kdca.go.kr"
    },
    hpv: {
      type: "여성 청소년 암 예방",
      title: "HPV(사람유두종바이러스) 자궁경부암 백신 무료 접종",
      desc: "만 12~17세 여성 청소년 및 만 18~26세 저소득층(기초생활수급자·차상위계층) 여성을 대상으로 자궁경부암을 최대 90% 이상 예방할 수 있는 HPV 백신 2~3회 접종을 전액 지원합니다.",
      linkText: "HPV 무료 지원 확인",
      url: "https://nip.kdca.go.kr"
    },
    rare: {
      type: "의료비 및 특수식 지원",
      title: "희귀질환자 의료비 지원 사업 및 헬프라인",
      desc: "산정특례 등록 희귀질환자를 대상으로 요양급여 본인부담금 전액 또는 일부, 간병비, 만 19세 이상 특수식이(특수분유 등) 구입비를 지원하여 환자와 가족의 경제적 부담을 덜어드립니다.",
      linkText: "희귀질환 헬프라인 바로가기",
      url: "https://helpline.kdca.go.kr"
    },
    chronic: {
      type: "만성질환 예방관리",
      title: "고혈압·당뇨병 등록관리 서비스 & 국가건강정보포털",
      desc: "심뇌혈관질환 예방을 위해 고혈압·당뇨병 환자에게 진료비·약제비 지원(일부 지역), 올바른 혈압·혈당 관리 교육, 그리고 전문의가 검수한 신뢰성 있는 질환 정보를 제공합니다.",
      linkText: "국가건강정보포털 의학지침",
      url: "https://health.kdca.go.kr"
    },
    travel: {
      type: "해외 보건안전",
      title: "해외 감염병 정보 & 예방접종 / Q-CODE 스마트 검역",
      desc: "출국 전 여행 국가별 감염병 위험도(황열, 말라리아, 뎅기열, 콜레라 등)와 필수 예방접종을 안내하며, 입국 시 Q-CODE(검역정보 사전입력시스템)를 통한 신속하고 안전한 입국 검역을 지원합니다.",
      linkText: "해외감염병 Now 및 접종기관 확인",
      url: "https://dportal.kdca.go.kr"
    },
    cert: {
      type: "온라인 민원 서비스",
      title: "전자 예방접종증명서 무료 즉시 발급 (국·영문)",
      desc: "어린이집·유치원·학교 입학, 입대, 취업, 해외 유학 및 비자 발급에 필수적인 예방접종증명서를 정부24 및 예방접종도우미 사이트에서 공동인증서/간편인증으로 24시간 언제든 무료 발급받을 수 있습니다.",
      linkText: "예방접종증명서 발급 신청",
      url: "https://nip.kdca.go.kr"
    },
    counsel: {
      type: "24시간 무료 콜센터",
      title: "질병관리청 콜센터 1339 핫라인",
      desc: "감염병 의심 증상 문의, 선별진료 안내, 법정 감염병 격리 기준, 백신 이상반응 신고 방법 등 공중보건과 관련된 모든 궁금증을 국번 없이 1339로 24시간 365일 전문 간호사 및 상담원이 무료로 답변해 드립니다.",
      linkText: "1339 콜센터 소개",
      url: "https://www.kdca.go.kr"
    }
  };

  // 결과 확인 버튼 클릭 시
  if (checkResultBtn) {
    checkResultBtn.addEventListener("click", () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

      resultContainer.style.display = "block";

      if (selected.length === 0) {
        // 선택 항목이 없을 경우: 전 국민 기본 혜택 안내
        resultTitle.textContent = "선택된 항목이 없습니다. (전 국민 기본 혜택 안내)";
        resultSubtitle.textContent = "상황을 선택하지 않으셔도 대한민국 국민이라면 누구나 다음 3가지 핵심 혜택을 이용하실 수 있습니다.";

        const defaultKeys = ["counsel", "chronic", "cert"];
        matchedCardsContainer.innerHTML = defaultKeys.map(key => createBenefitCardHtml(benefitsDB[key])).join("");
      } else {
        resultTitle.textContent = `국민 맞춤 혜택 ${selected.length}건이 발견되었습니다!`;
        resultSubtitle.textContent = "선택하신 조건에 맞춰 질병관리청에서 지원하는 맞춤형 복지 및 보건의료 서비스를 확인하세요.";

        matchedCardsContainer.innerHTML = selected.map(key => createBenefitCardHtml(benefitsDB[key])).join("");
      }

      // 부드럽게 결과 박스로 스크롤
      resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // 전체 해제 버튼
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkboxes.forEach(cb => cb.checked = false);
    });
  }

  // 다시 선택 버튼
  if (reselectBtn) {
    reselectBtn.addEventListener("click", () => {
      const checkerBox = document.querySelector(".checker-box");
      if (checkerBox) {
        checkerBox.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function createBenefitCardHtml(item) {
  if (!item) return "";
  return `
    <div class="benefit-card">
      <div class="benefit-main">
        <span class="benefit-type">${item.type}</span>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="benefit-link">
        ${item.linkText} ↗
      </a>
    </div>
  `;
}

/**
 * 1. 핵심 업무 탭 필터링 기능
 */
function initDutiesFilter() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const dutyCards = document.querySelectorAll(".duty-card");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // 액티브 클래스 교체
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetCategory = btn.getAttribute("data-tab");

      dutyCards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        if (targetCategory === "all" || targetCategory === cardCat) {
          card.style.display = "flex";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transition = "opacity 0.3s ease";
          }, 10);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/**
 * 2. 국민 건강 상식 퀴즈 데이터 및 아코디언 인터랙션
 */
function renderHealthQuiz() {
  const quizData = [
    {
      q: "Q1. 독감(인플루엔자) 백신은 매년 새로 맞아야 할까요?",
      a: "정답은 **O (그렇습니다)** 입니다. 인플루엔자 바이러스는 해마다 변이를 거치기 때문에, WHO와 질병관리청이 당해 유행 예상 바이러스를 선별하여 매년 새로운 백신을 제작합니다. 면역 지속 기간 또한 약 6개월 내외이므로 매년 10~11월 접종이 권장됩니다."
    },
    {
      q: "Q2. 손을 흐르는 물에만 씻어도 감염병 예방에 충분할까요?",
      a: "정답은 **X (아닙니다)** 입니다. 물로만 씻으면 세균이나 바이러스가 충분히 제거되지 않습니다. 반드시 **비누나 세정제**를 사용하여 손바닥, 손등, 손가락 사이, 엄지손가락, 손톱 밑까지 **30초 이상** 골고루 문질러 씻어야 감염병을 최대 50~70%까지 예방할 수 있습니다."
    },
    {
      q: "Q3. 고혈압이나 당뇨병은 증상이 없으면 약을 안 먹어도 될까요?",
      a: "정답은 **X (절대 안 됩니다)** 입니다. 만성질환은 초기 자각 증상이 거의 없어 '침묵의 살인자'라 불립니다. 방치할 경우 뇌졸중, 심근경색, 만성 콩팥병 등 치명적인 합병증을 유발하므로 정기적인 수치 측정과 의사 처방에 따른 꾸준한 복약 관리가 필수적입니다."
    },
    {
      q: "Q4. 감염병 의심 증상이나 격리 기준이 궁금할 때 24시간 전화할 수 있는 번호는?",
      a: "정답은 **질병관리청 콜센터 1339 (국번 없이)** 입니다. 365일 24시간 전문 상담원이 감염병 예방, 해외여행 전 감염병 예방접종, 선별진료 안내 등을 친절히 무료 상담해 드립니다."
    }
  ];

  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  quizContainer.innerHTML = quizData.map((item, idx) => `
    <div class="quiz-card" data-idx="${idx}">
      <div class="quiz-q">
        <span>${item.q}</span>
        <span class="quiz-toggle">답변 보기 ▼</span>
      </div>
      <div class="quiz-ans" id="ans-${idx}">
        ${formatMarkdownBold(item.a)}
      </div>
    </div>
  `).join("");

  // 아코디언 토글 이벤트
  const cards = quizContainer.querySelectorAll(".quiz-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const ans = card.querySelector(".quiz-ans");
      const toggleText = card.querySelector(".quiz-toggle");
      const isVisible = ans.classList.contains("show");

      if (isVisible) {
        ans.classList.remove("show");
        toggleText.textContent = "답변 보기 ▼";
      } else {
        ans.classList.add("show");
        toggleText.textContent = "답변 닫기 ▲";
      }
    });
  });
}

function formatMarkdownBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

/**
 * 3. 최신 뉴스 기사 및 보도자료 데이터 & 렌더링
 * - 질병관리청 실제 발표 및 언론 보도(연합뉴스 등) URL 직접 삽입
 */
function renderLatestNews() {
  const newsList = [
    {
      source: "연합뉴스",
      date: "최신 보도",
      title: "질병청, 만성질환 진단 오차 줄인다…국가 '참값' 구축 추진",
      snippet: "질병관리청이 검사장비와 시약에 따라 발생하는 검사 오차를 줄여 사회적 비용을 절감하기 위해 국가 진단의학 표준검사실을 본격 운영하고 주요 만성질환 지표 표준화 사업을 확대합니다.",
      url: "https://www.yna.co.kr/view/AKR20240902143000530"
    },
    {
      source: "연합뉴스TV",
      date: "보건 캠페인",
      title: "'가슴 뛰게 하는 4분'…질병관리청, 심폐소생술 대국민 캠페인",
      snippet: "세계 심장소생의 날을 맞아 질병청은 심정지 환자의 생존율을 2~3배 높일 수 있는 대국민 CPR(심폐소생술) 가이드라인을 배포하고 신속한 초기 대응의 중요성을 강조했습니다.",
      url: "https://www.yonhapnewstv.co.kr/news/MYH20241016016600641"
    },
    {
      source: "질병관리청 공식",
      date: "절기 방역대책",
      title: "2024-2025절기 인플루엔자(독감) 및 코로나19 백신 동시 접종 안내",
      snippet: "65세 이상 어르신 및 취약계층을 대상으로 독감과 코로나19 백신의 안전한 동시 접종을 시행하고 있습니다. 보건소 및 전국 위탁의료기관에서 편리하게 지원받을 수 있습니다.",
      url: "https://www.kdca.go.kr/board/board.es?mid=a20501010000&bid=0015"
    },
    {
      source: "보건의료 통계",
      date: "환경보건 분석",
      title: "기후위기 대응 온열질환 응급실 감시체계 운영 결과 및 행동요령",
      snippet: "전국 500여 개 응급실 표본감시를 통해 폭염기 온열질환 환자 발생 추이를 신속하게 국민에게 알리고 야외 근로자 및 독거 어르신 맞춤형 온열질환 예방 수칙을 배포했습니다.",
      url: "https://www.kdca.go.kr/board/board.es?mid=a20501010000&bid=0015"
    },
    {
      source: "국가보건 정책",
      date: "대국민 복지",
      title: "희귀질환자 의료비 지원 사업 대상 질환 확대 및 편의 개선",
      snippet: "의료 취약계층의 치료 부담을 경감하기 위해 특수식이 지원 품목을 늘리고 온라인 헬프라인을 통해 간편하게 의료비 지원을 신청할 수 있도록 절차를 간소화했습니다.",
      url: "https://helpline.kdca.go.kr"
    },
    {
      source: "공식 브리핑",
      date: "감염병 감시",
      title: "백일해·호흡기 감염병 유행 동향 모니터링 및 적기 접종 권고",
      snippet: "최근 환절기를 맞아 영유아와 학령기 청소년을 중심으로 호흡기 질환이 확산됨에 따라 표준 예방접종 및 호흡기 위생 수칙 준수를 거듭 당부했습니다.",
      url: "https://dportal.kdca.go.kr"
    }
  ];

  const newsGrid = document.getElementById("newsGrid");
  if (!newsGrid) return;

  newsGrid.innerHTML = newsList.map(item => `
    <article class="news-card">
      <div class="news-meta">
        <span class="news-source">${item.source}</span>
        <span class="news-date">${item.date}</span>
      </div>
      <h3 class="news-title">${item.title}</h3>
      <p class="news-snippet">${item.snippet}</p>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="news-link-btn">
        기사/보도자료 원문 보기 ↗
      </a>
    </article>
  `).join("");
}

/**
 * 4. 부드러운 스크롤 네비게이션
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === "#") return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
