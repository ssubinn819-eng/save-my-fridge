// ============================================================================
// 냉장고 구조대 (Save My Fridge) - 메인 애플리케이션 로직
// ============================================================================

(function () {
  'use strict';

  // data.js로부터 데이터 가져오기 (전역 window.SMF_DATA 지원)
  const SMF = (typeof window !== 'undefined' && window.SMF_DATA) ? window.SMF_DATA : {};
  const CATEGORIES = SMF.CATEGORIES || [];
  const INGREDIENTS = SMF.INGREDIENTS || [];
  const RECIPES = SMF.RECIPES || [];
  const STORAGE_GUIDE = SMF.STORAGE_GUIDE || [];
  const DAILY_MISSIONS = SMF.DAILY_MISSIONS || [];
  const SDG_INFO = SMF.SDG_INFO || {};

// ============================================================================
// 글로벌 헬퍼 함수 바인딩 (인라인 onclick 및 HTML 어디서든 즉시 호출 지원)
// ============================================================================
window.switchFridgeView = function(viewMode) {
  const layout = document.getElementById('fridge-management-layout');
  const btnBoth = document.getElementById('btn-tab-both');
  const btnFridge = document.getElementById('btn-tab-fridge');
  const btnInput = document.getElementById('btn-tab-input');

  [btnBoth, btnFridge, btnInput].forEach(b => { if (b) b.classList.remove('active'); });

  if (layout) {
    layout.classList.remove('view-only-fridge', 'view-only-input');
    if (viewMode === 'fridge') {
      layout.classList.add('view-only-fridge');
      if (btnFridge) btnFridge.classList.add('active');
    } else if (viewMode === 'input') {
      layout.classList.add('view-only-input');
      if (btnInput) btnInput.classList.add('active');
    } else {
      if (btnBoth) btnBoth.classList.add('active');
    }
  }
};

window.focusIngredientInput = function() {
  window.switchFridgeView('both');
  const input = document.getElementById('ingredient-search-input');
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      input.focus();
      input.classList.add('highlight-pulse');
      setTimeout(() => input.classList.remove('highlight-pulse'), 1000);
    }, 250);
  }
};

window.scrollToFridgeTop = function() {
  const section = document.getElementById('fridge-core-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
};

window.scrollToFridge = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  window.switchFridgeView('both');
  const section = document.getElementById('fridge-core-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  const input = document.getElementById('ingredient-search-input');
  if (input) {
    setTimeout(() => {
      input.focus();
      input.classList.add('highlight-pulse');
      setTimeout(() => input.classList.remove('highlight-pulse'), 1000);
    }, 350);
  }
};

window.openDirectAdd = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const section = document.getElementById('fridge-core-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  if (typeof openDirectCustomAddModal === 'function') {
    openDirectCustomAddModal();
  }
};

window.quickAdd = function(name) {
  if (typeof quickAddIngredientByName === 'function') {
    quickAddIngredientByName(name);
  }
};

window.selectCategory = function(catId) {
  STATE.selectedCategory = catId;
  const container = document.getElementById('category-chips');
  if (container) {
    container.querySelectorAll('.category-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === catId);
    });
  }
  if (typeof renderCategoryIngredientsGrid === 'function') {
    renderCategoryIngredientsGrid();
  }
};

window.openModalForIngredient = function(id) {
  const def = (SMF.INGREDIENTS || []).find(i => i.id === id);
  if (def && typeof openAddIngredientModal === 'function') {
    openAddIngredientModal(def);
  }
};

window.closeAllModals = function() {
  if (typeof closeIngredientModal === 'function') closeIngredientModal();
  if (typeof closeRecipeDetailModal === 'function') closeRecipeDetailModal();
  if (typeof closeCookingDoneModal === 'function') closeCookingDoneModal();
};

window.adjustQty = function(delta) {
  const input = document.getElementById('modal-qty-input');
  if (input) {
    let val = parseInt(input.value, 10) || 1;
    input.value = Math.max(1, val + delta);
  }
};

window.handleAddSearch = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (typeof handleSearchAdd === 'function') {
    handleSearchAdd();
  }
};

// ============================================================================
// 애플리케이션 상태 (State)
// ============================================================================
const STATE = {
  // 사용자가 냉장고에 등록한 재료 목록
  userIngredients: [],
  // 요리 완료 히스토리
  history: [],
  // 누적 통계
  stats: {
    recipesCount: 0,
    ingredientsUsedCount: 0,
    rescueCount: 0,
    streakDays: 1,
    lastActiveDate: null
  },
  // 현재 레시피 필터 ('all', 'ready', 'quick', 'meal', 'snack', 'urgent')
  recipeFilter: 'all',
  // 냉장고 털기 모드 활성화 여부
  isSweepMode: false,
  // 현재 선택된 재료 카테고리 필터
  selectedCategory: 'all',
  // 현재 보관 가이드 검색어
  storageSearchQuery: '',
  // 오늘 미션 상태
  missionCompleted: false,
  // 모달에 열려있는 임시 데이터
  activeModalIngredient: null,
  activeModalRecipe: null,
  isEditMode: false,
  isCustomAdd: false
};

// ============================================================================
// LocalStorage 관리 함수
// ============================================================================
const STORAGE_KEYS = {
  INGREDIENTS: 'smf_user_ingredients',
  HISTORY: 'smf_cooking_history',
  STATS: 'smf_user_stats',
  MISSION: 'smf_daily_mission'
};

function loadStateFromStorage() {
  try {
    const savedIngredients = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    if (savedIngredients) {
      STATE.userIngredients = JSON.parse(savedIngredients);
    }

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) {
      STATE.history = JSON.parse(savedHistory);
    }

    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) {
      STATE.stats = { ...STATE.stats, ...JSON.parse(savedStats) };
    }

    const savedMission = localStorage.getItem(STORAGE_KEYS.MISSION);
    if (savedMission) {
      const parsed = JSON.parse(savedMission);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        STATE.missionCompleted = parsed.completed;
      }
    }

    // 연속 실천 일수(Streak) 점검
    checkAndUpdateStreak();
  } catch (err) {
    console.warn('LocalStorage 로드 중 오류 발생:', err);
  }
}

function saveIngredientsToStorage() {
  localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(STATE.userIngredients));
}

function saveHistoryAndStatsToStorage() {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(STATE.history));
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(STATE.stats));
}

function saveMissionToStorage() {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEYS.MISSION, JSON.stringify({
    date: today,
    completed: STATE.missionCompleted
  }));
}

function checkAndUpdateStreak() {
  const today = new Date().toDateString();
  if (!STATE.stats.lastActiveDate) {
    STATE.stats.lastActiveDate = today;
    STATE.stats.streakDays = 1;
  } else if (STATE.stats.lastActiveDate !== today) {
    const lastDate = new Date(STATE.stats.lastActiveDate);
    const diffTime = Math.abs(new Date(today) - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      STATE.stats.streakDays += 1;
    } else if (diffDays > 1) {
      STATE.stats.streakDays = 1;
    }
    STATE.stats.lastActiveDate = today;
    saveHistoryAndStatsToStorage();
  }
}

// ============================================================================
// 우선순위 계산 알고리즘 (⏰ 먼저 구조해주세요!)
// ============================================================================
/**
 * 재료의 보관 상태, 구매 시기, 재료 자체의 부패 민감도를 종합 분석하여
 * 🔴 urgent (먼저 확인), 🟡 moderate (가능한 빨리 사용), 🟢 safe (비교적 여유 있음)
 * 으로 분류합니다.
 */
function analyzeUrgency(userIng) {
  const baseDef = INGREDIENTS.find(i => i.id === userIng.ingredientId) || {};
  const baseUrgency = baseDef.urgencyScore || 3; // 1: 매우민감, 5: 둔감
  const period = userIng.purchasePeriod; // 'today', '1-2days', '3-5days', 'week_plus', 'unknown'
  const storage = userIng.storageType; // 'fridge', 'freeze', 'room'

  // 냉동 보관인 경우 대부분 여유 있음
  if (storage === 'freeze') {
    return {
      level: 'safe',
      label: '비교적 여유 있음',
      advice: '냉동 보관 중이라 비교적 여유가 있어요. 천천히 필요할 때 활용해보세요.'
    };
  }

  // 1주 이상 경과
  if (period === 'week_plus') {
    if (baseUrgency <= 3 || storage === 'room') {
      return {
        level: 'urgent',
        label: '먼저 확인',
        advice: '구매한 지 시간이 다소 지났어요. 상태(냄새/외관)를 확인하고 우선 활용해보세요.'
      };
    } else {
      return {
        level: 'moderate',
        label: '가능한 빨리 사용',
        advice: '보관 기간이 길어지고 있어요. 조만간 요리에 사용하거나 냉동 소분을 추천해요.'
      };
    }
  }

  // 3~5일 전
  if (period === '3-5days') {
    if (baseUrgency <= 2) {
      return {
        level: 'urgent',
        label: '먼저 확인',
        advice: '수분이 많거나 민감한 재료예요. 신선할 때 오늘 식단에 먼저 올려보세요.'
      };
    } else {
      return {
        level: 'moderate',
        label: '가능한 빨리 사용',
        advice: '신선도가 떨어지기 전에 이번 주 안에 맛있게 조리해보세요.'
      };
    }
  }

  // 1~2일 전
  if (period === '1-2days') {
    if (baseUrgency === 1) {
      return {
        level: 'moderate',
        label: '가능한 빨리 사용',
        advice: '신선식품은 금방 상태가 변할 수 있으니 며칠 내로 소비를 권장해요.'
      };
    } else {
      return {
        level: 'safe',
        label: '비교적 여유 있음',
        advice: '신선한 상태예요! 다양한 요리에 자유롭게 활용해보세요.'
      };
    }
  }

  // 오늘 구매 또는 알 수 없음
  return {
    level: 'safe',
    label: '비교적 여유 있음',
    advice: '올바른 보관법을 유지하면 오랫동안 신선하게 즐길 수 있어요.'
  };
}

// ============================================================================
// 레시피 추천 엔진
// ============================================================================
function getRecommendedRecipes() {
  const userIngIds = new Set(STATE.userIngredients.map(item => item.ingredientId));
  
  // 우선 소비 대상 재료 ID 추출
  const urgentIngIds = new Set(
    STATE.userIngredients
      .filter(item => {
        const u = analyzeUrgency(item);
        return u.level === 'urgent' || u.level === 'moderate';
      })
      .map(item => item.ingredientId)
  );

  const scoredRecipes = RECIPES.map(recipe => {
    // 필수 재료 중 보유한 것
    const matchedRequired = recipe.requiredIngredients.filter(id => userIngIds.has(id));
    // 필수 재료 중 부족한 것
    const missingRequired = recipe.requiredIngredients.filter(id => !userIngIds.has(id));
    // 선택 재료 중 보유한 것
    const matchedOptional = (recipe.optionalIngredients || []).filter(id => userIngIds.has(id));
    
    // 전체 보유 재료 중 이 레시피에 들어가는 재료 수
    const totalMatchedCount = matchedRequired.length + matchedOptional.length;
    const requiredRatio = recipe.requiredIngredients.length > 0 
      ? (matchedRequired.length / recipe.requiredIngredients.length) 
      : 0;

    // 우선 소비 재료 포함 여부
    const containsUrgent = [...recipe.requiredIngredients, ...(recipe.optionalIngredients || [])]
      .some(id => urgentIngIds.has(id));

    // 매칭 등급 판별
    let tier = 'bronze'; // 🥉 비슷하게 만들 수 있어요
    if (missingRequired.length === 0) {
      tier = 'gold'; // 🥇 바로 만들 수 있어요
    } else if (missingRequired.length === 1) {
      tier = 'silver'; // 🥈 하나만 더 있으면 돼요
    }

    // 추천 점수 계산
    let score = (requiredRatio * 60) + (matchedOptional.length * 10);
    if (containsUrgent) score += 25; // 우선 재료 가중치
    if (missingRequired.length === 0) score += 40; // 완벽 매칭 가중치

    // 냉장고 털기 모드일 때는 많은 재료를 쓰는 레시피에 압도적 가중치
    if (STATE.isSweepMode) {
      score = (totalMatchedCount * 50) + (requiredRatio * 20);
    }

    return {
      ...recipe,
      matchedRequired,
      missingRequired,
      matchedOptional,
      totalMatchedCount,
      requiredRatio,
      containsUrgent,
      tier,
      score
    };
  });

  // 점수 높은 순 정렬
  scoredRecipes.sort((a, b) => b.score - a.score);

  // 필터링 적용
  return scoredRecipes.filter(r => {
    if (STATE.recipeFilter === 'ready') return r.tier === 'gold';
    if (STATE.recipeFilter === 'quick') return r.tags.includes('10분 요리') || r.tags.includes('5분 요리');
    if (STATE.recipeFilter === 'meal') return r.category === '한 끼';
    if (STATE.recipeFilter === 'snack') return r.category === '간식';
    if (STATE.recipeFilter === 'urgent') return r.containsUrgent;
    return true; // 'all'
  });
}

// ============================================================================
// DOM 요소 참조 및 렌더링 함수들
// ============================================================================
let DOM = {};

function initDOMElements() {
  DOM = {
    // 헤더
    header: document.querySelector('.site-header'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    mobileNav: document.getElementById('mobile-nav-drawer'),
    
    // 식재료 검색 & Autocomplete
    ingredientSearchInput: document.getElementById('ingredient-search-input'),
    btnClearSearchInput: document.getElementById('btn-clear-search-input'),
    btnSearchAdd: document.getElementById('btn-search-add'),
    btnDirectAdd: document.getElementById('btn-direct-add'),
    autocompleteDropdown: document.getElementById('autocomplete-dropdown'),
    quickAddContainer: document.getElementById('quick-add-chips'),
    categoryChipsContainer: document.getElementById('category-chips'),
    categoryIngredientsGrid: document.getElementById('category-ingredients-grid'),
    
    // 내 냉장고 디스플레이
    fridgeItemsContainer: document.getElementById('fridge-items-container'),
    fridgeCountBadge: document.getElementById('fridge-count-badge'),
    fridgeClearBtn: document.getElementById('fridge-clear-btn'),
    
    // 우선순위 섹션
    priorityUrgentList: document.getElementById('priority-urgent-list'),
    priorityUrgentCount: document.getElementById('priority-urgent-count'),
    priorityModerateList: document.getElementById('priority-moderate-list'),
    priorityModerateCount: document.getElementById('priority-moderate-count'),
    prioritySafeList: document.getElementById('priority-safe-list'),
    prioritySafeCount: document.getElementById('priority-safe-count'),
    
    // 레시피 추천
    recipesGrid: document.getElementById('recipes-grid'),
    recipeFilterTabs: document.querySelectorAll('.recipe-tab-btn'),
    sweepModeBtn: document.getElementById('sweep-mode-btn'),
    urgentSpotlightBanner: document.getElementById('urgent-spotlight-banner'),
    urgentSpotlightText: document.getElementById('urgent-spotlight-text'),
    
    // 모달들
    ingredientModal: document.getElementById('ingredient-detail-modal'),
    ingredientModalClose: document.getElementById('modal-close-btn'),
    ingredientModalForm: document.getElementById('ingredient-form'),
    modalItemIcon: document.getElementById('modal-item-icon'),
    modalItemTitle: document.getElementById('modal-item-title'),
    modalItemSub: document.getElementById('modal-item-sub'),
    modalQtyInput: document.getElementById('modal-qty-input'),
    modalQtyMinus: document.getElementById('modal-qty-minus'),
    modalQtyPlus: document.getElementById('modal-qty-plus'),
    modalUnitText: document.getElementById('modal-unit-text'),
    modalSubmitBtn: document.getElementById('modal-submit-btn'),
    modalCustomNameGroup: document.getElementById('modal-custom-name-group'),
    modalCustomNameInput: document.getElementById('modal-custom-name-input'),
    
    recipeDetailModal: document.getElementById('recipe-detail-modal'),
    recipeModalClose: document.getElementById('recipe-modal-close-btn'),
    recipeModalContent: document.getElementById('recipe-modal-body'),
    
    cookingDoneModal: document.getElementById('cooking-done-modal'),
    cookingDoneClose: document.getElementById('done-modal-close-btn'),
    usedIngredientsList: document.getElementById('used-ingredients-list'),
    confirmRescueBtn: document.getElementById('confirm-rescue-btn'),
    
    // 보관 가이드
    storageSearchInput: document.getElementById('storage-search-input'),
    storageGrid: document.getElementById('storage-cards-grid'),
    
    // 나의 기록
    statRecipes: document.getElementById('stat-recipes-count'),
    statIngredients: document.getElementById('stat-ingredients-count'),
    statRescue: document.getElementById('stat-rescue-count'),
    statStreak: document.getElementById('stat-streak-days'),
    historyList: document.getElementById('history-list'),
    
    // 미션
    missionTitle: document.getElementById('mission-title'),
    missionDesc: document.getElementById('mission-desc'),
    missionTag: document.getElementById('mission-tag'),
    missionBtn: document.getElementById('mission-btn'),
    
    // 토스트 및 캔버스
    toastContainer: document.getElementById('toast-container'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    mobileFloatingCta: document.getElementById('mobile-floating-cta')
  };
}

// ============================================================================
// Toast 메시지 시스템
// ============================================================================
function showToast(message, icon = '🥕') {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ============================================================================
// Confetti 파티클 애니메이션 (축하 효과)
// ============================================================================
function launchConfetti() {
  const canvas = DOM.confettiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#4F8A62', '#F4C95D', '#E9785D', '#E9F3EB', '#60A5FA', '#F472B6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      gravity: 0.28,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  animate();
}

// ============================================================================
// 렌더링: 1. 내 냉장고 재료 목록
// ============================================================================
function renderFridge() {
  const container = DOM.fridgeItemsContainer;
  const countBadge = DOM.fridgeCountBadge;
  if (!container) return;

  container.innerHTML = '';
  countBadge.textContent = `${STATE.userIngredients.length}개 보관 중`;
  const tabCount = document.getElementById('fridge-tab-count');
  if (tabCount) tabCount.textContent = STATE.userIngredients.length;

  if (STATE.userIngredients.length === 0) {
    container.innerHTML = `
      <div class="fridge-empty-state">
        <span class="empty-state-emoji">🧊</span>
        <h4 class="empty-state-title">냉장고가 비어 있어요!</h4>
        <p class="empty-state-desc">남아 있는 재료를 하나 추가해보세요 🥕<br>작은 자투리 재료도 맛있는 한 끼가 됩니다.</p>
      </div>
    `;
    return;
  }

  STATE.userIngredients.forEach(item => {
    const card = document.createElement('div');
    card.className = 'fridge-item-card';

    // 보관 형태 한글 변환
    const storageText = item.storageType === 'freeze' ? '냉동' : item.storageType === 'room' ? '실온' : '냉장';
    // 구매 시기 한글 변환
    let periodText = '오늘';
    if (item.purchasePeriod === '1-2days') periodText = '1~2일 전';
    else if (item.purchasePeriod === '3-5days') periodText = '3~5일 전';
    else if (item.purchasePeriod === 'week_plus') periodText = '1주 이상';
    else if (item.purchasePeriod === 'unknown') periodText = '시기 모름';

    card.innerHTML = `
      <div class="fridge-item-top">
        <div class="fridge-item-info">
          <span class="fridge-item-emoji">${item.icon}</span>
          <div>
            <div class="fridge-item-name">${item.name}</div>
            <div class="fridge-item-qty">${item.quantity}${item.unit}</div>
          </div>
        </div>
        <button type="button" class="fridge-item-delete-btn" aria-label="${item.name} 삭제" data-id="${item.id}">✕</button>
      </div>
      <div class="fridge-item-bottom">
        <div class="fridge-item-badges">
          <span class="badge-tag badge-storage">${storageText}</span>
          <span class="badge-tag badge-period">${periodText}</span>
        </div>
        <button type="button" class="fridge-item-edit-btn" data-id="${item.id}">수정</button>
      </div>
    `;

    // 삭제 이벤트
    card.querySelector('.fridge-item-delete-btn').addEventListener('click', () => {
      removeIngredient(item.id, item.name);
    });

    // 수정 이벤트
    card.querySelector('.fridge-item-edit-btn').addEventListener('click', () => {
      openEditIngredientModal(item);
    });

    container.appendChild(card);
  });
}

// ============================================================================
// 렌더링: 2. 먼저 먹어야 할 재료 (우선순위 섹션)
// ============================================================================
function renderPriorities() {
  const urgentList = DOM.priorityUrgentList;
  const moderateList = DOM.priorityModerateList;
  const safeList = DOM.prioritySafeList;
  if (!urgentList || !moderateList || !safeList) return;

  urgentList.innerHTML = '';
  moderateList.innerHTML = '';
  safeList.innerHTML = '';

  let urgentCount = 0;
  let moderateCount = 0;
  let safeCount = 0;

  STATE.userIngredients.forEach(item => {
    const analysis = analyzeUrgency(item);
    const itemCard = document.createElement('div');
    itemCard.className = 'priority-item-card';
    itemCard.innerHTML = `
      <div class="priority-item-header">
        <span class="priority-item-name">${item.icon} ${item.name} (${item.quantity}${item.unit})</span>
      </div>
      <p class="priority-item-advice">${analysis.advice}</p>
    `;

    if (analysis.level === 'urgent') {
      urgentList.appendChild(itemCard);
      urgentCount++;
    } else if (analysis.level === 'moderate') {
      moderateList.appendChild(itemCard);
      moderateCount++;
    } else {
      safeList.appendChild(itemCard);
      safeCount++;
    }
  });

  DOM.priorityUrgentCount.textContent = `${urgentCount}개`;
  DOM.priorityModerateCount.textContent = `${moderateCount}개`;
  DOM.prioritySafeCount.textContent = `${safeCount}개`;

  if (urgentCount === 0) {
    urgentList.innerHTML = '<div class="priority-empty-note">급하게 확인이 필요한 재료가 없어요 👏</div>';
  }
  if (moderateCount === 0) {
    moderateList.innerHTML = '<div class="priority-empty-note">적정 시기에 순서대로 드시면 좋아요 😊</div>';
  }
  if (safeCount === 0 && STATE.userIngredients.length === 0) {
    safeList.innerHTML = '<div class="priority-empty-note">냉장고에 재료를 등록해보세요 🥕</div>';
  }

  // 우선 소비 재료 하이라이트 배너 제어
  updateUrgentSpotlightBanner();
}

function updateUrgentSpotlightBanner() {
  const banner = DOM.urgentSpotlightBanner;
  const bannerText = DOM.urgentSpotlightText;
  if (!banner || !bannerText) return;

  const urgentItems = STATE.userIngredients.filter(item => {
    const a = analyzeUrgency(item);
    return a.level === 'urgent';
  });

  if (urgentItems.length > 0) {
    const topItem = urgentItems[0];
    banner.style.display = 'flex';
    bannerText.innerHTML = `
      <span class="spotlight-emoji">⏰</span>
      <span><strong>${topItem.icon} ${topItem.name}</strong>을(를) 먼저 활용해보세요! 지금 만들 수 있는 추천 요리가 있어요.</span>
    `;
  } else {
    banner.style.display = 'none';
  }
}

// ============================================================================
// 렌더링: 3. 레시피 추천 목록
// ============================================================================
function renderRecipes() {
  const grid = DOM.recipesGrid;
  if (!grid) return;
  grid.innerHTML = '';

  // 재료가 아예 없는 경우 친절한 안내 표시
  if (STATE.userIngredients.length === 0) {
    grid.innerHTML = `
      <div class="recipe-fallback-card">
        <div class="fallback-icon">🥕</div>
        <h3 class="fallback-title">냉장고에 남은 재료를 알려주세요!</h3>
        <p class="fallback-desc">계란 하나, 양파 반 개라도 괜찮아요. 냉장고 재료를 추가하면 바로 만들 수 있는 맞춤 레시피를 찾아드려요.</p>
        <div class="suggested-add-chips">
          <button type="button" class="btn-primary" id="btn-fallback-add-ingredient">
            🥕 지금 재료 추가하기
          </button>
        </div>
      </div>
    `;
    return;
  }

  const recipes = getRecommendedRecipes();

  // 필터 조건 등에 의해 결과가 0개인 경우
  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="recipe-fallback-card">
        <div class="fallback-icon">🍳</div>
        <h3 class="fallback-title">이 조건에 맞는 레시피를 찾지 못했어요</h3>
        <p class="fallback-desc">필터를 '전체'로 변경하거나, 아래 추천 재료를 하나만 더 추가해보세요!</p>
        <div class="suggested-add-chips">
          <button type="button" class="quick-chip-btn" data-name="계란">+ 🥚 계란 추가</button>
          <button type="button" class="quick-chip-btn" data-name="양파">+ 🧅 양파 추가</button>
          <button type="button" class="quick-chip-btn" data-name="밥">+ 🍚 밥 추가</button>
        </div>
      </div>
    `;
    grid.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => quickAddIngredientByName(btn.dataset.name));
    });
    return;
  }

  // 레시피 카드 생성
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    // 뱃지 설정
    let badgeClass = 'badge-gold';
    let badgeText = '🥇 바로 만들 수 있어요';
    if (recipe.tier === 'silver') {
      badgeClass = 'badge-silver';
      badgeText = '🥈 하나만 더 있으면 돼요';
    } else if (recipe.tier === 'bronze') {
      badgeClass = 'badge-bronze';
      badgeText = '🥉 비슷하게 만들 수 있어요';
    }

    // 냉장고 털기 모드 뱃지
    let sweepBadgeHtml = '';
    if (STATE.isSweepMode) {
      const fridgeTotal = STATE.userIngredients.length;
      const percent = fridgeTotal > 0 ? Math.round((recipe.totalMatchedCount / fridgeTotal) * 100) : 0;
      sweepBadgeHtml = `<span class="recipe-sweep-badge">🎉 활용도 ${percent}% (${recipe.totalMatchedCount}개 소진)</span>`;
    }

    // 보유 재료 이름
    const haveNames = recipe.matchedRequired.map(id => {
      const found = INGREDIENTS.find(i => i.id === id);
      return found ? found.name : id;
    });
    if (recipe.matchedOptional.length > 0) {
      recipe.matchedOptional.forEach(id => {
        const found = INGREDIENTS.find(i => i.id === id);
        if (found) haveNames.push(`${found.name}(선택)`);
      });
    }

    // 부족한 재료 이름
    const needNames = recipe.missingRequired.map(id => {
      const found = INGREDIENTS.find(i => i.id === id);
      return found ? found.name : id;
    });

    const haveText = haveNames.length > 0 ? haveNames.map(n => `✓ ${n}`).join('  ') : '없음';
    const needText = needNames.length > 0 ? needNames.map(n => `+ ${n}`).join('  ') : '추가 필요 없음';

    card.innerHTML = `
      <div>
        <div class="recipe-card-header">
          <span class="recipe-match-badge ${badgeClass}">${badgeText}</span>
          ${sweepBadgeHtml}
        </div>
        <div class="recipe-card-title-group">
          <span class="recipe-emoji">${recipe.emoji}</span>
          <h3 class="recipe-title">${recipe.name}</h3>
        </div>
        <p class="recipe-desc">${recipe.description}</p>
        
        <div class="recipe-ingredients-status">
          <div class="ing-row">
            <span class="ing-row-label">보유 재료:</span>
            <span class="ing-have-list">${haveText}</span>
          </div>
          <div class="ing-row">
            <span class="ing-row-label">추가 필요:</span>
            <span class="ing-need-list">${needText}</span>
          </div>
        </div>
      </div>

      <div class="recipe-card-footer">
        <div class="recipe-meta-info">
          <span>⏱️ ${recipe.cookTime}</span>
          <span>난이도: ${recipe.difficulty}</span>
        </div>
        <button type="button" class="btn-view-recipe" data-recipe-id="${recipe.id}">레시피 보기</button>
      </div>
    `;

    card.querySelector('.btn-view-recipe').addEventListener('click', () => {
      openRecipeDetailModal(recipe);
    });

    grid.appendChild(card);
  });
}

// ============================================================================
// 렌더링: 4. 보관 가이드 목록
// ============================================================================
function renderStorageGuides() {
  const grid = DOM.storageGrid;
  if (!grid) return;
  grid.innerHTML = '';

  const query = STATE.storageSearchQuery.trim().toLowerCase();
  const filtered = STORAGE_GUIDE.filter(item => {
    return item.name.toLowerCase().includes(query) ||
           item.recommended.toLowerCase().includes(query) ||
           item.simpleTip.toLowerCase().includes(query) ||
           item.ideas.some(idea => idea.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--color-text-sub);">
        '${query}'에 대한 보관 가이드를 찾지 못했어요. 다른 재료명을 검색해보세요.
      </div>
    `;
    return;
  }

  filtered.forEach(guide => {
    const card = document.createElement('div');
    card.className = 'storage-card';
    card.innerHTML = `
      <div>
        <div class="storage-card-header">
          <span class="storage-emoji">${guide.icon}</span>
          <span class="storage-name">${guide.name}</span>
          <span class="storage-method-badge">${guide.recommended}</span>
        </div>
        <p class="storage-tip-text">${guide.simpleTip}</p>
        <div class="storage-ideas-tags">
          ${guide.ideas.map(idea => `<span class="storage-idea-tag">${idea}</span>`).join('')}
        </div>
      </div>
      <div class="storage-alert-text">
        <span>💡</span>
        <span>${guide.alert}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================================
// 렌더링: 5. 나의 기록 & 통계
// ============================================================================
function renderRecords() {
  if (DOM.statRecipes) DOM.statRecipes.textContent = STATE.stats.recipesCount;
  if (DOM.statIngredients) DOM.statIngredients.textContent = STATE.stats.ingredientsUsedCount;
  if (DOM.statRescue) DOM.statRescue.textContent = STATE.stats.rescueCount;
  if (DOM.statStreak) DOM.statStreak.textContent = STATE.stats.streakDays;

  const historyContainer = DOM.historyList;
  if (!historyContainer) return;
  historyContainer.innerHTML = '';

  if (STATE.history.length === 0) {
    historyContainer.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--color-text-muted); font-size: 0.95rem;">
        아직 완성한 요리 기록이 없어요. 첫 번째 냉장고 구조를 시작해보세요! 🍳
      </div>
    `;
    return;
  }

  // 최근 기록 상위 5개 표시
  const recent = [...STATE.history].reverse().slice(0, 5);
  recent.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';
    const usedText = (h.usedIngredients || []).map(i => i.name).join(', ');
    item.innerHTML = `
      <div class="history-item-left">
        <span style="font-size: 1.5rem;">🍳</span>
        <div>
          <div class="history-recipe-name">${h.recipeName}</div>
          <div class="history-used-badge">구조한 재료: ${usedText || '알뜰 요리'}</div>
        </div>
      </div>
      <div class="history-date">${h.completedDate}</div>
    `;
    historyContainer.appendChild(item);
  });
}

// ============================================================================
// 렌더링: 6. 오늘의 작은 미션
// ============================================================================
function renderDailyMission() {
  if (!DOM.missionTitle) return;
  // 당일 날짜 기반 일정한 미션 선택 (매일 변경)
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const mission = DAILY_MISSIONS[dayOfYear % DAILY_MISSIONS.length];

  DOM.missionTitle.textContent = mission.title;
  DOM.missionDesc.textContent = mission.description;
  DOM.missionTag.textContent = `${mission.emoji} ${mission.tag}`;

  if (STATE.missionCompleted) {
    DOM.missionBtn.textContent = '✓ 오늘 실천 완료!';
    DOM.missionBtn.classList.add('completed');
  } else {
    DOM.missionBtn.textContent = '오늘 해볼게요 👍';
    DOM.missionBtn.classList.remove('completed');
  }
}

// ============================================================================
// 식품 아이콘 매핑 헬퍼
// ============================================================================
function getFoodEmoji(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('계란') || n.includes('달걀') || n.includes('egg')) return '🥚';
  if (n.includes('우유') || n.includes('milk')) return '🥛';
  if (n.includes('치즈') || n.includes('cheese')) return '🧀';
  if (n.includes('버터')) return '🧈';
  if (n.includes('양파')) return '🧅';
  if (n.includes('대파') || n.includes('쪽파') || n.includes('파')) return '🌱';
  if (n.includes('마늘')) return '🧄';
  if (n.includes('당근')) return '🥕';
  if (n.includes('감자')) return '🥔';
  if (n.includes('고구마')) return '🍠';
  if (n.includes('토마토')) return '🍅';
  if (n.includes('김치')) return '🥬';
  if (n.includes('두부')) return '🧊';
  if (n.includes('밥') || n.includes('쌀')) return '🍚';
  if (n.includes('라면') || n.includes('면') || n.includes('파스타') || n.includes('국수')) return '🍜';
  if (n.includes('빵') || n.includes('식빵') || n.includes('토스트')) return '🍞';
  if (n.includes('소고기') || n.includes('돼지고기') || n.includes('고기') || n.includes('삼겹살')) return '🥩';
  if (n.includes('닭') || n.includes('치킨')) return '🍗';
  if (n.includes('베이컨') || n.includes('햄') || n.includes('스팸')) return '🥓';
  if (n.includes('새우')) return '🦐';
  if (n.includes('오징어')) return '🦑';
  if (n.includes('고등어') || n.includes('생선') || n.includes('연어')) return '🐟';
  if (n.includes('만두')) return '🥟';
  if (n.includes('어묵')) return '🍢';
  if (n.includes('참치')) return '🥫';
  if (n.includes('사과')) return '🍎';
  if (n.includes('바나나')) return '🍌';
  if (n.includes('딸기')) return '🍓';
  if (n.includes('버섯')) return '🍄';
  if (n.includes('오이') || n.includes('호박') || n.includes('애호박')) return '🥒';
  if (n.includes('고추')) return '🌶️';
  if (n.includes('옥수수')) return '🌽';
  return '🥗';
}

// ============================================================================
// 재료 관리 로직 (추가, 수정, 삭제, Quick Add)
// ============================================================================
function openAddIngredientModal(ingredientDef) {
  STATE.activeModalIngredient = ingredientDef;
  STATE.isEditMode = false;
  STATE.isCustomAdd = !!ingredientDef.isCustom;

  DOM.modalItemIcon.textContent = ingredientDef.icon || '🥕';
  DOM.modalItemTitle.textContent = ingredientDef.name || '새 재료 등록';
  DOM.modalItemSub.textContent = `기본 단위: ${ingredientDef.defaultUnit || '개'}`;
  DOM.modalUnitText.textContent = ingredientDef.defaultUnit || '개';
  DOM.modalQtyInput.value = 1;
  DOM.modalSubmitBtn.textContent = '🧊 냉장고에 넣기';

  // 커스텀 이름 입력 그룹 표시/숨김
  if (DOM.modalCustomNameGroup) {
    if (ingredientDef.isCustom) {
      DOM.modalCustomNameGroup.style.display = 'block';
      if (DOM.modalCustomNameInput) {
        DOM.modalCustomNameInput.value = ingredientDef.name || '';
        setTimeout(() => DOM.modalCustomNameInput.focus(), 80);
      }
    } else {
      DOM.modalCustomNameGroup.style.display = 'none';
    }
  }

  // 라디오 기본값 리셋
  const periodRadios = DOM.ingredientModalForm.querySelectorAll('input[name="purchasePeriod"]');
  if (periodRadios.length > 0) periodRadios[0].checked = true; // 'today'

  const storageRadios = DOM.ingredientModalForm.querySelectorAll('input[name="storageType"]');
  if (storageRadios.length > 0) storageRadios[0].checked = true; // 'fridge'

  DOM.ingredientModal.classList.add('open');
}

function openDirectCustomAddModal() {
  const customDef = {
    id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: '',
    icon: '🥕',
    category: 'vegetable',
    defaultUnit: '개',
    isCustom: true
  };
  STATE.isCustomAdd = true;
  openAddIngredientModal(customDef);
}

function openEditIngredientModal(userIng) {
  const def = INGREDIENTS.find(i => i.id === userIng.ingredientId) || {
    name: userIng.name,
    icon: userIng.icon,
    defaultUnit: userIng.unit
  };

  STATE.activeModalIngredient = { ...def, existingId: userIng.id };
  STATE.isEditMode = true;
  STATE.isCustomAdd = false;

  if (DOM.modalCustomNameGroup) {
    DOM.modalCustomNameGroup.style.display = 'none';
  }

  DOM.modalItemIcon.textContent = userIng.icon;
  DOM.modalItemTitle.textContent = `${userIng.name} (수정)`;
  DOM.modalItemSub.textContent = `단위: ${userIng.unit}`;
  DOM.modalUnitText.textContent = userIng.unit;
  DOM.modalQtyInput.value = userIng.quantity;
  DOM.modalSubmitBtn.textContent = '수정 완료';

  // 라디오 설정
  const periodRadio = DOM.ingredientModalForm.querySelector(`input[name="purchasePeriod"][value="${userIng.purchasePeriod}"]`);
  if (periodRadio) periodRadio.checked = true;

  const storageRadio = DOM.ingredientModalForm.querySelector(`input[name="storageType"][value="${userIng.storageType}"]`);
  if (storageRadio) storageRadio.checked = true;

  DOM.ingredientModal.classList.add('open');
}

function closeIngredientModal() {
  DOM.ingredientModal.classList.remove('open');
  STATE.activeModalIngredient = null;
  STATE.isEditMode = false;
  STATE.isCustomAdd = false;
  if (DOM.modalCustomNameGroup) {
    DOM.modalCustomNameGroup.style.display = 'none';
  }
}

function saveIngredientFromModal(e) {
  e.preventDefault();
  if (!STATE.activeModalIngredient) return;

  const formData = new FormData(DOM.ingredientModalForm);
  const quantity = Math.max(1, parseInt(DOM.modalQtyInput.value, 10) || 1);
  const purchasePeriod = formData.get('purchasePeriod') || 'today';
  const storageType = formData.get('storageType') || 'fridge';

  let def = STATE.activeModalIngredient;

  // 커스텀 새 재료인 경우 이름 필드 확인
  if (STATE.isCustomAdd || def.isCustom) {
    const customName = (DOM.modalCustomNameInput ? DOM.modalCustomNameInput.value : '').trim();
    if (!customName) {
      showToast('추가할 재료명을 입력해주세요 ✏️', '⚠️');
      if (DOM.modalCustomNameInput) DOM.modalCustomNameInput.focus();
      return;
    }
    def.name = customName;
    def.icon = getFoodEmoji(customName);
  }

  if (STATE.isEditMode && def.existingId) {
    // 수정 처리
    const target = STATE.userIngredients.find(item => item.id === def.existingId);
    if (target) {
      target.quantity = quantity;
      target.purchasePeriod = purchasePeriod;
      target.storageType = storageType;
      showToast(`${target.name} 정보가 수정되었어요.`, target.icon);
    }
  } else {
    // 신규 추가 처리
    const existing = STATE.userIngredients.find(item => 
      (item.ingredientId === def.id || item.name.toLowerCase() === def.name.toLowerCase()) && 
      item.storageType === storageType
    );
    if (existing) {
      existing.quantity += quantity;
      existing.purchasePeriod = purchasePeriod;
      showToast(`${def.name} 수량이 ${existing.quantity}${def.defaultUnit || '개'}(으)로 늘어났어요!`, def.icon);
    } else {
      const newEntry = {
        id: 'user_ing_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        ingredientId: def.id || ('custom_' + Date.now()),
        name: def.name,
        icon: def.icon || '🥕',
        category: def.category || 'vegetable',
        quantity: quantity,
        unit: def.defaultUnit || '개',
        purchasePeriod: purchasePeriod,
        storageType: storageType,
        addedAt: new Date().toISOString()
      };
      STATE.userIngredients.push(newEntry);
      showToast(`${def.name}을(를) 냉장고에 넣었어요!`, def.icon || '🧊');
    }
  }

  saveIngredientsToStorage();
  closeIngredientModal();
  updateAllViews();
}

function removeIngredient(id, name) {
  STATE.userIngredients = STATE.userIngredients.filter(item => item.id !== id);
  saveIngredientsToStorage();
  showToast(`${name}을(를) 목록에서 뺐어요.`, '🗑️');
  updateAllViews();
}

function quickAddIngredientByName(name) {
  const def = INGREDIENTS.find(i => i.name === name) || {
    id: 'quick_' + Date.now(),
    name: name,
    icon: getFoodEmoji(name),
    category: 'vegetable',
    defaultUnit: '개'
  };

  const existing = STATE.userIngredients.find(item => item.ingredientId === def.id || item.name === def.name);
  if (existing) {
    existing.quantity += 1;
    showToast(`${def.name} 수량을 1개 더 추가했어요! (${existing.quantity}${def.defaultUnit || '개'})`, def.icon);
  } else {
    STATE.userIngredients.push({
      id: 'user_ing_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      ingredientId: def.id,
      name: def.name,
      icon: def.icon,
      category: def.category,
      quantity: 1,
      unit: def.defaultUnit || '개',
      purchasePeriod: 'today',
      storageType: 'fridge',
      addedAt: new Date().toISOString()
    });
    showToast(`${def.name}을(를) 냉장고에 넣었어요 🧊`, def.icon);
  }

  saveIngredientsToStorage();
  updateAllViews();
}

// ============================================================================
// 검색창 입력 및 추가 처리
// ============================================================================
function handleSearchAdd() {
  const input = DOM.ingredientSearchInput;
  const query = (input ? input.value : '').trim();

  if (!query) {
    openDirectCustomAddModal();
    return;
  }

  // 1. 정확한 매칭
  const exact = INGREDIENTS.find(i => i.name.toLowerCase() === query.toLowerCase());
  if (exact) {
    openAddIngredientModal(exact);
    input.value = '';
    if (DOM.btnClearSearchInput) DOM.btnClearSearchInput.style.display = 'none';
    if (DOM.autocompleteDropdown) DOM.autocompleteDropdown.classList.remove('open');
    return;
  }

  // 2. 부분 일치
  const partial = INGREDIENTS.find(i => i.name.toLowerCase().includes(query.toLowerCase()));
  if (partial) {
    openAddIngredientModal(partial);
    input.value = '';
    if (DOM.btnClearSearchInput) DOM.btnClearSearchInput.style.display = 'none';
    if (DOM.autocompleteDropdown) DOM.autocompleteDropdown.classList.remove('open');
    return;
  }

  // 3. 커스텀 새 재료 등록
  const customDef = {
    id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: query,
    icon: getFoodEmoji(query),
    category: 'processed',
    defaultUnit: '개',
    isCustom: true
  };
  openAddIngredientModal(customDef);
  input.value = '';
  if (DOM.btnClearSearchInput) DOM.btnClearSearchInput.style.display = 'none';
  if (DOM.autocompleteDropdown) DOM.autocompleteDropdown.classList.remove('open');
}

// ============================================================================
// Autocomplete 검색 처리
// ============================================================================
function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  const dropdown = DOM.autocompleteDropdown;
  if (!dropdown) return;

  if (DOM.btnClearSearchInput) {
    DOM.btnClearSearchInput.style.display = query ? 'flex' : 'none';
  }

  if (!query) {
    dropdown.classList.remove('open');
    dropdown.innerHTML = '';
    return;
  }

  // 필터링 (카테고리 필터와 검색어 결합)
  const matches = INGREDIENTS.filter(item => {
    const matchCategory = STATE.selectedCategory === 'all' || item.category === STATE.selectedCategory;
    const matchName = item.name.toLowerCase().includes(query);
    return matchCategory && matchName;
  });

  let html = '';
  if (matches.length > 0) {
    html = matches.map(item => `
      <div class="autocomplete-item" data-id="${item.id}">
        <div class="autocomplete-item-left">
          <span style="font-size: 1.4rem;">${item.icon}</span>
          <span>${item.name}</span>
        </div>
        <span class="autocomplete-item-category">${getCategoryName(item.category)}</span>
      </div>
    `).join('');
  }

  // 언제나 직접 추가 옵션 제공
  html += `
    <div class="autocomplete-item autocomplete-item-direct" data-custom-name="${encodeURIComponent(query)}">
      <div class="autocomplete-item-left">
        <span style="font-size: 1.4rem;">${getFoodEmoji(query)}</span>
        <span>'${query}' 직접 추가하기</span>
      </div>
      <span class="autocomplete-item-category">새 재료 등록 ＋</span>
    </div>
  `;

  dropdown.innerHTML = html;
  dropdown.classList.add('open');

  dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
    el.addEventListener('click', () => {
      if (el.dataset.customName) {
        const customName = decodeURIComponent(el.dataset.customName);
        const customDef = {
          id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: customName,
          icon: getFoodEmoji(customName),
          category: 'processed',
          defaultUnit: '개',
          isCustom: true
        };
        openAddIngredientModal(customDef);
      } else {
        const targetId = el.dataset.id;
        const def = INGREDIENTS.find(i => i.id === targetId);
        if (def) {
          openAddIngredientModal(def);
        }
      }
      DOM.ingredientSearchInput.value = '';
      if (DOM.btnClearSearchInput) DOM.btnClearSearchInput.style.display = 'none';
      dropdown.classList.remove('open');
    });
  });
}

// ============================================================================
// 카테고리별 재료 그리드 렌더링 (원클릭 선택 추가)
// ============================================================================
function renderCategoryIngredientsGrid() {
  if (!DOM.categoryIngredientsGrid) return;
  DOM.categoryIngredientsGrid.innerHTML = '';

  const catId = STATE.selectedCategory || 'all';
  const list = INGREDIENTS.filter(item => {
    if (catId === 'all') return true;
    return item.category === catId;
  });

  const fridgeIds = new Set(STATE.userIngredients.map(item => item.ingredientId));

  list.forEach(item => {
    const card = document.createElement('button');
    card.type = 'button';
    const inFridge = fridgeIds.has(item.id);
    card.className = `ingredient-select-card ${inFridge ? 'in-fridge' : ''}`;
    card.setAttribute('aria-label', `${item.name} 냉장고에 추가하기`);
    card.innerHTML = `
      <div class="ing-card-info">
        <span class="ing-card-icon">${item.icon}</span>
        <span class="ing-card-name">${item.name}</span>
      </div>
      <span class="ing-card-add-badge">${inFridge ? '✓' : '＋'}</span>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      openAddIngredientModal(item);
    });

    DOM.categoryIngredientsGrid.appendChild(card);
  });
}

function getCategoryName(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.name : '기타';
}

// ============================================================================
// 레시피 상세 Modal & 요리 완료 워크플로우
// ============================================================================
function openRecipeDetailModal(recipe) {
  STATE.activeModalRecipe = recipe;
  const modal = DOM.recipeDetailModal;
  const body = DOM.recipeModalContent;
  if (!modal || !body) return;

  const userIngIds = new Set(STATE.userIngredients.map(i => i.ingredientId));

  // 재료 체크리스트 생성
  const reqChecks = recipe.requiredIngredients.map(id => {
    const def = INGREDIENTS.find(i => i.id === id) || { name: id, icon: '🥕' };
    const has = userIngIds.has(id);
    return `
      <div class="ing-check-item ${has ? 'has' : 'missing'}">
        <span>${has ? '✓' : '＋'}</span>
        <span>${def.icon} ${def.name} ${has ? '(보유중)' : '(필요)'}</span>
      </div>
    `;
  }).join('');

  const optChecks = (recipe.optionalIngredients || []).map(id => {
    const def = INGREDIENTS.find(i => i.id === id) || { name: id, icon: '🥕' };
    const has = userIngIds.has(id);
    return `
      <div class="ing-check-item ${has ? 'has' : 'missing'}">
        <span>${has ? '✓' : '○'}</span>
        <span>${def.icon} ${def.name} (선택 ${has ? '보유' : '생략가능'})</span>
      </div>
    `;
  }).join('');

  // 대체 재료 안내
  let subHtml = '';
  if (recipe.substitutions && recipe.substitutions.length > 0) {
    const tips = recipe.substitutions.map(s => {
      const def = INGREDIENTS.find(i => i.id === s.missing);
      const name = def ? def.name : s.missing;
      return `<div><strong>${name} 없음?</strong> → ${s.replaceWith} (${s.tip})</div>`;
    }).join('');

    subHtml = `
      <div class="substitutions-box">
        <div class="substitutions-title">
          <span>💡</span> 없는 재료 때문에 포기하지 마세요!
        </div>
        ${tips}
      </div>
    `;
  }

  // 조리 순서 Step
  const stepsHtml = recipe.steps.map((step, idx) => `
    <div class="cooking-step-item">
      <span class="step-badge">STEP ${idx + 1}</span>
      <p class="step-instruction">${step}</p>
    </div>
  `).join('');

  body.innerHTML = `
    <div class="recipe-modal-header">
      <div class="recipe-modal-emoji">${recipe.emoji}</div>
      <div>
        <h2 class="recipe-modal-title">${recipe.name}</h2>
        <div class="recipe-modal-tags">
          <span class="badge-tag" style="background-color: var(--color-primary-light); color: var(--color-primary);">🌱 ${recipe.mainSDG} 연계</span>
          <span class="badge-tag" style="background-color: var(--color-cream); color: var(--color-text-dark);">${recipe.category}</span>
        </div>
      </div>
    </div>

    <div class="recipe-meta-badges-row">
      <span>⏱️ 조리시간: <strong>${recipe.cookTime}</strong></span>
      <span>⭐ 난이도: <strong>${recipe.difficulty}</strong></span>
    </div>

    <h3 class="recipe-modal-section-title">🥣 준비 재료</h3>
    <div class="recipe-ingredients-box">
      <div class="ingredients-checklist">
        ${reqChecks}
        ${optChecks}
      </div>
    </div>

    ${subHtml}

    <h3 class="recipe-modal-section-title">🍳 조리 순서</h3>
    <div class="cooking-steps-list">
      ${stepsHtml}
    </div>

    <button type="button" class="btn-complete-cooking" id="btn-trigger-cooking-done">
      🎉 이 레시피로 요리했어요! (재료 구조 완료)
    </button>
  `;

  // 요리 완료 버튼 클릭 이벤트
  body.querySelector('#btn-trigger-cooking-done').addEventListener('click', () => {
    closeRecipeDetailModal();
    openCookingDoneModal(recipe);
  });

  modal.classList.add('open');
}

function closeRecipeDetailModal() {
  DOM.recipeDetailModal.classList.remove('open');
  STATE.activeModalRecipe = null;
}

// 요리 완료 시 냉장고 재료 차감 선택 모달
function openCookingDoneModal(recipe) {
  const modal = DOM.cookingDoneModal;
  const listContainer = DOM.usedIngredientsList;
  if (!modal || !listContainer) return;

  listContainer.innerHTML = '';

  // 이 레시피에 들어가는 재료 중 현재 냉장고에 있는 것 추출
  const allRecipeIngIds = [...recipe.requiredIngredients, ...(recipe.optionalIngredients || [])];
  const userMatchedItems = STATE.userIngredients.filter(item => allRecipeIngIds.includes(item.ingredientId));

  if (userMatchedItems.length === 0) {
    listContainer.innerHTML = `
      <div style="font-size: 0.9rem; color: var(--color-text-sub); padding: 8px 0;">
        냉장고에서 일치하는 재료가 없지만 요리를 훌륭하게 마치셨네요! 🎉
      </div>
    `;
  } else {
    userMatchedItems.forEach(item => {
      const label = document.createElement('label');
      label.className = 'used-item-label';
      label.innerHTML = `
        <input type="checkbox" name="used_item" value="${item.id}" checked>
        <span>${item.icon} ${item.name} (보유: ${item.quantity}${item.unit})</span>
      `;
      listContainer.appendChild(label);
    });
  }

  modal.classList.add('open');
}

function closeCookingDoneModal() {
  DOM.cookingDoneModal.classList.remove('open');
}

function finalizeCookingRescue() {
  const checkboxes = DOM.usedIngredientsList.querySelectorAll('input[name="used_item"]:checked');
  const usedIds = Array.from(checkboxes).map(cb => cb.value);

  const usedIngredientsRecord = [];

  // 선택한 재료 수량 1 차감 (0 이하가 되면 냉장고에서 제거)
  usedIds.forEach(id => {
    const item = STATE.userIngredients.find(i => i.id === id);
    if (item) {
      usedIngredientsRecord.push({ name: item.name, icon: item.icon });
      item.quantity -= 1;
    }
  });

  // 수량이 남아있는 것만 유지
  STATE.userIngredients = STATE.userIngredients.filter(item => item.quantity > 0);
  saveIngredientsToStorage();

  // 통계 업데이트
  STATE.stats.recipesCount += 1;
  STATE.stats.ingredientsUsedCount += usedIngredientsRecord.length;
  STATE.stats.rescueCount += 1;

  // 히스토리 기록
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  STATE.history.push({
    recipeId: STATE.activeModalRecipe ? STATE.activeModalRecipe.id : 'custom',
    recipeName: STATE.activeModalRecipe ? STATE.activeModalRecipe.name : '맛있는 요리',
    completedDate: dateStr,
    usedIngredients: usedIngredientsRecord
  });

  saveHistoryAndStatsToStorage();
  closeCookingDoneModal();

  // 축하 애니메이션 및 토스트
  launchConfetti();
  showToast('오늘도 냉장고 구조 성공! 맛있는 한 끼를 완성했어요 🌱', '🎉');

  updateAllViews();
}

// ============================================================================
// 전체 화면 동기화 업데이트 함수
// ============================================================================
function updateAllViews() {
  renderFridge();
  renderPriorities();
  renderRecipes();
  renderRecords();
  renderStorageGuides();
  renderDailyMission();
  renderCategoryIngredientsGrid();
}

// ============================================================================
// 이벤트 리스너 바인딩
// ============================================================================
function setupEventListeners() {
  // 모바일 햄버거 메뉴 토글
  if (DOM.hamburgerBtn && DOM.mobileNav) {
    DOM.hamburgerBtn.addEventListener('click', () => {
      DOM.mobileNav.classList.toggle('open');
    });

    DOM.mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        DOM.mobileNav.classList.remove('open');
      });
    });
  }

  // 스크롤 시 헤더 그림자 효과
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }
  });

  // 검색 추가 버튼
  if (DOM.btnSearchAdd) {
    DOM.btnSearchAdd.addEventListener('click', handleSearchAdd);
  }

  // 검색창 Enter 키 입력 시 추가
  if (DOM.ingredientSearchInput) {
    DOM.ingredientSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchAdd();
      }
    });
    DOM.ingredientSearchInput.addEventListener('input', handleSearchInput);
    DOM.ingredientSearchInput.addEventListener('focus', handleSearchInput);
  }

  // 검색창 입력 지우기 버튼
  if (DOM.btnClearSearchInput) {
    DOM.btnClearSearchInput.addEventListener('click', () => {
      DOM.ingredientSearchInput.value = '';
      DOM.btnClearSearchInput.style.display = 'none';
      if (DOM.autocompleteDropdown) DOM.autocompleteDropdown.classList.remove('open');
      DOM.ingredientSearchInput.focus();
    });
  }

  // 직접 등록 버튼
  if (DOM.btnDirectAdd) {
    DOM.btnDirectAdd.addEventListener('click', openDirectCustomAddModal);
  }

  // 바깥 클릭 시 Autocomplete 닫기
  document.addEventListener('click', (e) => {
    if (DOM.autocompleteDropdown && !e.target.closest('.search-input-wrapper')) {
      DOM.autocompleteDropdown.classList.remove('open');
    }
  });

  // 빠른 추가 Quick Add 칩 버튼들
  if (DOM.quickAddContainer) {
    DOM.quickAddContainer.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        quickAddIngredientByName(name);
      });
    });
  }

  // 카테고리 칩 필터
  if (DOM.categoryChipsContainer) {
    DOM.categoryChipsContainer.innerHTML = CATEGORIES.map(cat => `
      <button type="button" class="category-chip ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.icon} ${cat.name}
      </button>
    `).join('');

    DOM.categoryChipsContainer.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.categoryChipsContainer.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.selectedCategory = btn.dataset.cat;
        renderCategoryIngredientsGrid();
        if (DOM.ingredientSearchInput && DOM.ingredientSearchInput.value) {
          handleSearchInput({ target: DOM.ingredientSearchInput });
        }
      });
    });
  }

  // 냉장고 비우기 버튼
  if (DOM.fridgeClearBtn) {
    DOM.fridgeClearBtn.addEventListener('click', () => {
      if (STATE.userIngredients.length === 0) return;
      if (confirm('냉장고 안의 모든 재료를 비우시겠어요?')) {
        STATE.userIngredients = [];
        saveIngredientsToStorage();
        showToast('냉장고를 깨끗하게 비웠어요.', '🧹');
        updateAllViews();
      }
    });
  }

  // 재료 추가/수정 모달 닫기
  if (DOM.ingredientModalClose) {
    DOM.ingredientModalClose.addEventListener('click', closeIngredientModal);
  }
  if (DOM.ingredientModal) {
    DOM.ingredientModal.addEventListener('click', (e) => {
      if (e.target === DOM.ingredientModal) closeIngredientModal();
    });
  }

  // 수량 플러스 / 마이너스 버튼
  if (DOM.modalQtyMinus && DOM.modalQtyPlus && DOM.modalQtyInput) {
    DOM.modalQtyMinus.addEventListener('click', () => {
      let val = parseInt(DOM.modalQtyInput.value, 10) || 1;
      if (val > 1) DOM.modalQtyInput.value = val - 1;
    });
    DOM.modalQtyPlus.addEventListener('click', () => {
      let val = parseInt(DOM.modalQtyInput.value, 10) || 1;
      DOM.modalQtyInput.value = val + 1;
    });
  }

  // 재료 폼 제출
  if (DOM.ingredientModalForm) {
    DOM.ingredientModalForm.addEventListener('submit', saveIngredientFromModal);
  }

  // 레시피 필터 탭
  if (DOM.recipeFilterTabs) {
    DOM.recipeFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.recipeFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.recipeFilter = tab.dataset.filter;
        renderRecipes();
      });
    });
  }

  // 냉장고 털기 (Sweep Mode) 토글
  if (DOM.sweepModeBtn) {
    DOM.sweepModeBtn.addEventListener('click', () => {
      STATE.isSweepMode = !STATE.isSweepMode;
      DOM.sweepModeBtn.classList.toggle('active', STATE.isSweepMode);
      if (STATE.isSweepMode) {
        showToast('냉장고 털기 모드! 가장 많은 재료를 쓰는 요리를 추천해요 🧹', '✨');
      }
      renderRecipes();
    });
  }

  // 레시피 상세 모달 닫기
  if (DOM.recipeModalClose) {
    DOM.recipeModalClose.addEventListener('click', closeRecipeDetailModal);
  }
  if (DOM.recipeDetailModal) {
    DOM.recipeDetailModal.addEventListener('click', (e) => {
      if (e.target === DOM.recipeDetailModal) closeRecipeDetailModal();
    });
  }

  // 요리 완료 모달 닫기 및 확정 버튼
  if (DOM.cookingDoneClose) {
    DOM.cookingDoneClose.addEventListener('click', closeCookingDoneModal);
  }
  if (DOM.cookingDoneModal) {
    DOM.cookingDoneModal.addEventListener('click', (e) => {
      if (e.target === DOM.cookingDoneModal) closeCookingDoneModal();
    });
  }
  if (DOM.confirmRescueBtn) {
    DOM.confirmRescueBtn.addEventListener('click', finalizeCookingRescue);
  }

  // 보관 가이드 실시간 검색
  if (DOM.storageSearchInput) {
    DOM.storageSearchInput.addEventListener('input', (e) => {
      STATE.storageSearchQuery = e.target.value;
      renderStorageGuides();
    });
  }

  // 오늘의 미션 버튼 토글
  if (DOM.missionBtn) {
    DOM.missionBtn.addEventListener('click', () => {
      STATE.missionCompleted = !STATE.missionCompleted;
      saveMissionToStorage();
      renderDailyMission();
      if (STATE.missionCompleted) {
        launchConfetti();
        showToast('오늘의 냉장고 미션 실천 완료! 멋져요 🌱', '👏');
      } else {
        showToast('미션 상태가 변경되었어요.', '📝');
      }
    });
  }

  // ESC 키로 모든 열린 모달 닫기 지원 (접근성)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeIngredientModal();
      closeRecipeDetailModal();
      closeCookingDoneModal();
    }
  });

  // 재료 추가 인풋으로 부드럽게 스크롤 & 포커스
  function focusIngredientInput() {
    const section = document.getElementById('fridge-core-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    if (DOM.ingredientSearchInput) {
      setTimeout(() => {
        DOM.ingredientSearchInput.focus();
        DOM.ingredientSearchInput.classList.add('highlight-pulse');
        setTimeout(() => DOM.ingredientSearchInput.classList.remove('highlight-pulse'), 1000);
      }, 350);
    }
  }

  // 모바일 플로팅 CTA 스크롤 및 포커스
  if (DOM.mobileFloatingCta) {
    DOM.mobileFloatingCta.addEventListener('click', focusIngredientInput);
  }

  // 레시피 없을 때 나타나는 버튼
  const fallbackBtn = document.getElementById('btn-fallback-add-ingredient');
  if (fallbackBtn) {
    fallbackBtn.addEventListener('click', focusIngredientInput);
  }

  // 헤더 및 히어로 냉장고 열기 버튼 포커스 연결
  const headerFridgeBtn = document.querySelector('.header-cta-btn');
  if (headerFridgeBtn) {
    headerFridgeBtn.addEventListener('click', () => {
      setTimeout(focusIngredientInput, 200);
    });
  }

  const heroFridgeBtn = document.querySelector('.hero-actions .btn-primary');
  if (heroFridgeBtn) {
    heroFridgeBtn.addEventListener('click', () => {
      setTimeout(focusIngredientInput, 200);
    });
  }

  // 스마트폰 상단 상태바 실시간 시계
  function updatePhoneClock() {
    const clockEl = document.getElementById('status-clock');
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);

  // 모바일 하단 탭바 탭 전환 및 스크롤 연동
  function setupBottomTabBar() {
    const tabbar = document.getElementById('mobile-bottom-tabbar');
    if (!tabbar) return;
    const tabs = tabbar.querySelectorAll('.tab-item');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetId = tab.getAttribute('data-target');
        if (!targetId) return;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      });
    });

    // 스크롤 시 현재 뷰포트 내 섹션 활성화
    const sectionIds = ['hero-section', 'fridge-core-section', 'priority-section', 'recipes-section', 'records-section'];
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const scrollPos = window.scrollY + 160;
        let activeId = '';
        sectionIds.forEach(id => {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            activeId = id;
          }
        });
        if (activeId) {
          tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-target') === activeId);
          });
        }
      }, 100);
    }, { passive: true });
  }

  setupBottomTabBar();
}

// ============================================================================
// 애플리케이션 시작 (Initialize)
// ============================================================================
function initApp() {
  initDOMElements();
  loadStateFromStorage();
  setupEventListeners();
  updateAllViews();
}

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();


