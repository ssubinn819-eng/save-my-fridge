// ============================================================================
// 냉장고 구조대 (Save My Fridge) - 데이터 정의 파일
// ============================================================================

(function () {
  'use strict';

  // 1. 재료 카테고리 목록
  const CATEGORIES = [
  { id: 'all', name: '전체', icon: '🍽️' },
  { id: 'vegetable', name: '채소', icon: '🥬' },
  { id: 'fruit', name: '과일', icon: '🍎' },
  { id: 'dairy_egg', name: '달걀/유제품', icon: '🥚' },
  { id: 'meat', name: '육류', icon: '🥩' },
  { id: 'seafood', name: '해산물', icon: '🐟' },
  { id: 'grain', name: '곡류/면', icon: '🍚' },
  { id: 'bakery', name: '빵류', icon: '🍞' },
  { id: 'seasoning', name: '양념/소스', icon: '🧂' },
  { id: 'processed', name: '가공식품', icon: '🥫' }
];

// 2. 기본 식재료 데이터 (50+ 종)
// urgencyScore: 기본 부패 민감도 (1: 매우 높음(우유,생선 등) ~ 5: 매우 낮음(양념, 감자 등))
const INGREDIENTS = [
  // 달걀/유제품
  { id: 'egg', name: '계란', icon: '🥚', category: 'dairy_egg', defaultUnit: '개', urgencyScore: 2 },
  { id: 'milk', name: '우유', icon: '🥛', category: 'dairy_egg', defaultUnit: '팩', urgencyScore: 1 },
  { id: 'cheese', name: '치즈', icon: '🧀', category: 'dairy_egg', defaultUnit: '장', urgencyScore: 3 },
  { id: 'butter', name: '버터', icon: '🧈', category: 'dairy_egg', defaultUnit: '조각', urgencyScore: 4 },
  { id: 'yogurt', name: '요거트', icon: '🥣', category: 'dairy_egg', defaultUnit: '개', urgencyScore: 2 },

  // 채소
  { id: 'onion', name: '양파', icon: '🧅', category: 'vegetable', defaultUnit: '개', urgencyScore: 4 },
  { id: 'green_onion', name: '대파', icon: '🌱', category: 'vegetable', defaultUnit: '대', urgencyScore: 2 },
  { id: 'garlic', name: '마늘', icon: '🧄', category: 'vegetable', defaultUnit: '쪽', urgencyScore: 4 },
  { id: 'potato', name: '감자', icon: '🥔', category: 'vegetable', defaultUnit: '개', urgencyScore: 4 },
  { id: 'sweet_potato', name: '고구마', icon: '🍠', category: 'vegetable', defaultUnit: '개', urgencyScore: 4 },
  { id: 'carrot', name: '당근', icon: '🥕', category: 'vegetable', defaultUnit: '개', urgencyScore: 3 },
  { id: 'zucchini', name: '애호박', icon: '🥒', category: 'vegetable', defaultUnit: '개', urgencyScore: 2 },
  { id: 'mushroom', name: '버섯', icon: '🍄', category: 'vegetable', defaultUnit: '송이', urgencyScore: 1 },
  { id: 'cabbage', name: '양배추', icon: '🥬', category: 'vegetable', defaultUnit: '통', urgencyScore: 3 },
  { id: 'lettuce', name: '상추', icon: '🥗', category: 'vegetable', defaultUnit: '장', urgencyScore: 1 },
  { id: 'perilla_leaf', name: '깻잎', icon: '🍃', category: 'vegetable', defaultUnit: '장', urgencyScore: 1 },
  { id: 'spinach', name: '시금치', icon: '🌿', category: 'vegetable', defaultUnit: '단', urgencyScore: 1 },
  { id: 'bean_sprout', name: '콩나물', icon: '🌱', category: 'vegetable', defaultUnit: '봉지', urgencyScore: 1 },
  { id: 'tofu', name: '두부', icon: '🧊', category: 'vegetable', defaultUnit: '모', urgencyScore: 1 },
  { id: 'cucumber', name: '오이', icon: '🥒', category: 'vegetable', defaultUnit: '개', urgencyScore: 2 },
  { id: 'chili', name: '고추', icon: '🌶️', category: 'vegetable', defaultUnit: '개', urgencyScore: 3 },
  { id: 'paprika', name: '파프리카', icon: '🫑', category: 'vegetable', defaultUnit: '개', urgencyScore: 2 },
  { id: 'corn', name: '옥수수', icon: '🌽', category: 'vegetable', defaultUnit: '개', urgencyScore: 3 },

  // 과일
  { id: 'tomato', name: '토마토', icon: '🍅', category: 'fruit', defaultUnit: '개', urgencyScore: 2 },
  { id: 'apple', name: '사과', icon: '🍎', category: 'fruit', defaultUnit: '개', urgencyScore: 4 },
  { id: 'banana', name: '바나나', icon: '🍌', category: 'fruit', defaultUnit: '송이', urgencyScore: 2 },
  { id: 'strawberry', name: '딸기', icon: '🍓', category: 'fruit', defaultUnit: '팩', urgencyScore: 1 },
  { id: 'tangerine', name: '귤', icon: '🍊', category: 'fruit', defaultUnit: '개', urgencyScore: 3 },
  { id: 'lemon', name: '레몬', icon: '🍋', category: 'fruit', defaultUnit: '개', urgencyScore: 4 },

  // 곡류 / 빵류
  { id: 'rice', name: '밥', icon: '🍚', category: 'grain', defaultUnit: '공기', urgencyScore: 3 },
  { id: 'noodle', name: '면', icon: '🍜', category: 'grain', defaultUnit: '인분', urgencyScore: 4 },
  { id: 'ramen', name: '라면', icon: '🍜', category: 'grain', defaultUnit: '봉지', urgencyScore: 5 },
  { id: 'rice_cake', name: '떡', icon: '🍢', category: 'grain', defaultUnit: '봉지', urgencyScore: 2 },
  { id: 'bread', name: '식빵', icon: '🍞', category: 'bakery', defaultUnit: '장', urgencyScore: 2 },

  // 육류
  { id: 'chicken_breast', name: '닭가슴살', icon: '🍗', category: 'meat', defaultUnit: '팩', urgencyScore: 1 },
  { id: 'pork', name: '돼지고기', icon: '🥩', category: 'meat', defaultUnit: '팩', urgencyScore: 1 },
  { id: 'beef', name: '소고기', icon: '🥩', category: 'meat', defaultUnit: '팩', urgencyScore: 1 },
  { id: 'bacon', name: '베이컨', icon: '🥓', category: 'meat', defaultUnit: '팩', urgencyScore: 3 },

  // 해산물
  { id: 'shrimp', name: '새우', icon: '🦐', category: 'seafood', defaultUnit: '마리', urgencyScore: 1 },
  { id: 'squid', name: '오징어', icon: '🦑', category: 'seafood', defaultUnit: '마리', urgencyScore: 1 },
  { id: 'mackerel', name: '고등어', icon: '🐟', category: 'seafood', defaultUnit: '마리', urgencyScore: 1 },
  { id: 'salmon', name: '연어', icon: '🍣', category: 'seafood', defaultUnit: '팩', urgencyScore: 1 },

  // 가공식품 / 기타
  { id: 'kimchi', name: '김치', icon: '🥬', category: 'processed', defaultUnit: '포기', urgencyScore: 4 },
  { id: 'tuna_can', name: '참치캔', icon: '🥫', category: 'processed', defaultUnit: '캔', urgencyScore: 5 },
  { id: 'ham', name: '햄', icon: '🍖', category: 'processed', defaultUnit: '캔', urgencyScore: 4 },
  { id: 'fish_cake', name: '어묵', icon: '🍢', category: 'processed', defaultUnit: '장', urgencyScore: 2 },
  { id: 'dumpling', name: '만두', icon: '🥟', category: 'processed', defaultUnit: '개', urgencyScore: 3 },
  { id: 'seaweed', name: '김', icon: '⬛', category: 'processed', defaultUnit: '봉', urgencyScore: 5 },

  // 양념류
  { id: 'soy_sauce', name: '간장', icon: '🫙', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 5 },
  { id: 'gochujang', name: '고추장', icon: '🌶️', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 5 },
  { id: 'doenjang', name: '된장', icon: '🥣', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 5 },
  { id: 'salt', name: '소금', icon: '🧂', category: 'seasoning', defaultUnit: '약간', urgencyScore: 5 },
  { id: 'sugar', name: '설탕', icon: '🍬', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 5 },
  { id: 'cooking_oil', name: '식용유', icon: '🍾', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 5 },
  { id: 'mayonnaise', name: '마요네즈', icon: '🧴', category: 'seasoning', defaultUnit: '스푼', urgencyScore: 3 }
];

// 3. 레시피 데이터 (36개 풍부한 레시피)
const RECIPES = [
  {
    id: 'egg-fried-rice',
    name: '초간단 계란볶음밥',
    emoji: '🍳',
    category: '한 끼',
    description: '고슬고슬한 밥과 계란, 대파 향이 어우러진 냉장고 파먹기 대표 메뉴',
    requiredIngredients: ['egg', 'rice', 'green_onion'],
    optionalIngredients: ['ham', 'carrot', 'onion'],
    seasonings: ['간장', '식용유', '소금'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '양파', tip: '대파 대신 양파를 잘게 썰어 향을 내도 좋아요.' },
      { missing: 'ham', replaceWith: '베이컨 또는 참치', tip: '햄이 없다면 참치나 베이컨을 활용해보세요.' }
    ],
    steps: [
      '대파는 송송 썰고, 계란은 미리 그릇에 풀어둡니다.',
      '팬에 식용유를 두르고 대파를 볶아 파기름을 냅니다.',
      '대파를 한쪽으로 밀고 계란물을 부어 스크램블을 만듭니다.',
      '밥을 넣고 주걱으로 으깨며 골고루 볶아줍니다.',
      '간장 1스푼을 팬 가장자리에 둘러 불맛을 내며 섞어 마무리합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '한 끼', '초보 추천'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'kimchi-fried-rice',
    name: '매콤 김치볶음밥',
    emoji: '🍛',
    category: '한 끼',
    description: '잘 익은 김치와 찬밥의 환상적인 만남! 계란후라이를 얹으면 완벽해요.',
    requiredIngredients: ['kimchi', 'rice'],
    optionalIngredients: ['egg', 'ham', 'tuna_can', 'onion'],
    seasonings: ['식용유', '간장', '설탕', '참기름'],
    substitutions: [
      { missing: 'ham', replaceWith: '참치캔 또는 베이컨', tip: '햄 대신 참치를 기름 빼고 넣으면 담백해요.' }
    ],
    steps: [
      '김치는 가위로 잘게 잘라 준비합니다.',
      '팬에 기름을 두르고 햄이나 김치를 먼저 달달 볶아줍니다.',
      '김치가 살짝 투명해지면 설탕 반 스푼과 간장 1스푼을 넣어 감칠맛을 더합니다.',
      '찬밥을 넣고 뭉친 곳을 풀어주며 김치와 고루 볶습니다.',
      '기호에 따라 반숙 계란후라이를 얹어 완성합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '스테디셀러'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'onion-egg-stirfry',
    name: '달콤 짭조름 양파계란볶음',
    emoji: '🧅',
    category: '반찬',
    description: '양파의 자연스러운 단맛과 부드러운 계란이 만드는 가벼운 밥도둑 반찬',
    requiredIngredients: ['egg', 'onion'],
    optionalIngredients: ['green_onion', 'carrot'],
    seasonings: ['간장', '식용유', '소금'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '생략 가능', tip: '대파가 없어도 양파 단맛만으로 충분히 맛있어요.' }
    ],
    steps: [
      '양파는 결대로 얇게 채 썰어 준비합니다.',
      '달걀 2~3개는 소금 한 꼬집을 넣고 잘 풀어둡니다.',
      '팬에 기름을 넉넉히 두르고 양파가 투명하고 갈색빛이 돌 때까지 볶습니다.',
      '볶은 양파 옆으로 계란물을 부어 가볍게 스크램블을 섞어줍니다.',
      '간장 1스푼으로 간을 맞추고 불을 끕니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '초간단'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'egg-toast',
    name: '바삭 고소 계란토스트',
    emoji: '🥪',
    category: '간식',
    description: '식빵과 계란만 있어도 든든한 아침 브런치를 완성할 수 있어요.',
    requiredIngredients: ['bread', 'egg'],
    optionalIngredients: ['cheese', 'ham', 'cabbage'],
    seasonings: ['버터', '설탕', '케첩'],
    substitutions: [
      { missing: 'butter', replaceWith: '식용유', tip: '버터가 없으면 식용유를 둘러 구워도 바삭해요.' },
      { missing: 'cheese', replaceWith: '생략 가능', tip: '치즈 없이 설탕만 살짝 뿌려도 길거리 토스트 맛이 납니다.' }
    ],
    steps: [
      '볼에 계란을 풀고 기호에 따라 잘게 썬 양배추나 햄을 넣습니다.',
      '팬에 버터나 기름을 두르고 계란 부침을 식빵 크기로 부쳐냅니다.',
      '식빵을 앞뒤로 노릇하게 구워줍니다.',
      '구운 식빵 위에 계란 패티, 치즈, 설탕 약간과 케첩을 뿌리고 덮어줍니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '간식', '브런치'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'french-toast',
    name: '부드러운 프렌치토스트',
    emoji: '🍞',
    category: '간식',
    description: '마른 식빵과 우유, 계란을 소진하기에 가장 완벽한 달콤한 요리',
    requiredIngredients: ['bread', 'egg', 'milk'],
    optionalIngredients: ['butter', 'banana', 'apple'],
    seasonings: ['설탕', '소금'],
    substitutions: [
      { missing: 'milk', replaceWith: '두유 또는 물 약간', tip: '우유 대신 두유를 사용하거나 물 1~2스푼으로 풀어도 괜찮아요.' },
      { missing: 'butter', replaceWith: '식용유', tip: '약불에 식용유로 천천히 구워내도 노릇노릇 맛있어요.' }
    ],
    steps: [
      '넓은 접시에 계란 1개와 우유 50ml, 설탕 반 스푼, 소금 약간을 섞습니다.',
      '식빵을 계란우유물에 30초 정도 푹 적셔줍니다.',
      '팬에 버터나 기름을 두르고 약불에서 식빵을 앞뒤로 노릇노릇 굽습니다.',
      '접시에 담아 설탕을 솔솔 뿌리거나 남은 과일을 곁들여 먹습니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '간식', '우유소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'potato-pancake',
    name: '겉바속쫀 감자전',
    emoji: '🥔',
    category: '반찬',
    description: '싹트기 전 감자를 가장 맛있게 먹는 법! 소금 간만으로도 환상적이에요.',
    requiredIngredients: ['potato'],
    optionalIngredients: ['onion', 'chili', 'cheese'],
    seasonings: ['소금', '식용유'],
    substitutions: [
      { missing: 'chili', replaceWith: '생략 가능', tip: '고추 고명이 없어도 담백하고 고소합니다.' }
    ],
    steps: [
      '감자 껍질을 벗겨 강판이나 믹서기에 곱게 갈아줍니다.',
      '체에 밭쳐 감자 건더기와 물을 분리하고, 가라앉은 앙금 전분을 확인합니다.',
      '물은 버리고 가라앉은 전분과 감자 건더기, 소금 약간을 섞습니다.',
      '팬에 식용유를 넉넉히 두르고 반죽을 얇게 펴서 바삭하게 부쳐냅니다.'
    ],
    cookTime: '15분',
    difficulty: '★★☆',
    tags: ['반찬', '간식', '감자구조'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'potato-stirfry',
    name: '아삭 담백 감자채볶음',
    emoji: '🥔',
    category: '반찬',
    description: '기본 반찬의 정석! 당근이나 양파가 있다면 색감도 예쁘게 살려보세요.',
    requiredIngredients: ['potato'],
    optionalIngredients: ['onion', 'carrot', 'ham'],
    seasonings: ['식용유', '소금'],
    substitutions: [
      { missing: 'carrot', replaceWith: '생략 가능', tip: '당근 없이 감자만으로 볶아도 훌륭한 밥반찬이 됩니다.' }
    ],
    steps: [
      '감자를 얇게 채 썰어 찬물에 5분간 담가 전분기를 뺍니다.',
      '체에 밭쳐 물기를 털어냅니다.',
      '팬에 기름을 두르고 감자채와 채 썬 양파/당근을 함께 중약불에 볶습니다.',
      '감자가 투명하게 익으면 소금으로 간을 하고 마무리합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['반찬', '한 끼'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'pan-fried-tofu',
    name: '노릇노릇 들기름 두부부침',
    emoji: '🧊',
    category: '반찬',
    description: '소비기한이 임박한 두부를 구출하는 최고의 5분 반찬',
    requiredIngredients: ['tofu'],
    optionalIngredients: ['green_onion'],
    seasonings: ['식용유', '간장', '소금'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '양념간장 없이 소금간만', tip: '소금만 살짝 뿌려 구워도 담백하고 든든해요.' }
    ],
    steps: [
      '두부는 먹기 좋은 크기로 도톰하게 썰어 키친타월로 물기를 닦습니다.',
      '소금을 살짝 뿌려 밑간을 합니다.',
      '팬에 기름을 두르고 두부를 올려 중불에서 앞뒤로 노릇하게 지져냅니다.',
      '간장, 대파를 섞은 양념간장을 곁들여 먹습니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '두부구조'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tofu-kimchi',
    name: '찰떡궁합 두부김치',
    emoji: '🧊',
    category: '한 끼',
    description: '매콤하게 볶은 김치와 따뜻한 두부 한 조각의 든든한 조화',
    requiredIngredients: ['tofu', 'kimchi'],
    optionalIngredients: ['pork', 'onion', 'green_onion'],
    seasonings: ['식용유', '설탕', '참기름'],
    substitutions: [
      { missing: 'pork', replaceWith: '참치캔 또는 버섯', tip: '돼지고기가 없으면 참치를 넣거나 김치만 볶아도 훌륭해요.' }
    ],
    steps: [
      '두부는 끓는 물에 2~3분간 데치거나 전자레인지에 1분 돌려 따뜻하게 만듭니다.',
      '팬에 식용유를 두르고 썰어둔 김치와 양파를 볶습니다.',
      '김치에 설탕 반 스푼을 넣어 신맛을 잡고 참기름으로 마무리합니다.',
      '접시에 따끈한 두부와 볶음김치를 함께 담아냅니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '두부구조', '김치활용'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'kimchi-pancake',
    name: '바삭바삭 김치전',
    emoji: '🥞',
    category: '간식',
    description: '신김치와 부침가루(밀가루)만 있으면 비 오는 날 최고의 간식',
    requiredIngredients: ['kimchi'],
    optionalIngredients: ['onion', 'tuna_can', 'squid'],
    seasonings: ['밀가루/부침가루', '식용유', '고춧가루'],
    substitutions: [
      { missing: 'squid', replaceWith: '참치캔 또는 생략', tip: '해물이 없으면 참치 기름을 살짝 넣어 부쳐보세요.' }
    ],
    steps: [
      '신김치는 가위로 잘게 송송 썹니다.',
      '볼에 김치, 김치국물 2스푼, 밀가루 또는 부침가루와 찬물을 1:1 비율로 섞습니다.',
      '팬에 기름을 넉넉히 두르고 센불에서 달군 후 반죽을 얇게 폅니다.',
      '가장자리가 바삭하게 익으면 뒤집어 꾹꾹 누르며 노릇하게 굽습니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['간식', '비오는날', '초보'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'kimchi-stew',
    name: '진한 맛 김치찌개',
    emoji: '🍲',
    category: '한 끼',
    description: '잘 익은 김치에 두부나 고기, 참치를 넣고 보글보글 끓인 국민 찌개',
    requiredIngredients: ['kimchi'],
    optionalIngredients: ['tofu', 'pork', 'tuna_can', 'onion', 'green_onion'],
    seasonings: ['간장', '고춧가루', '다진마늘'],
    substitutions: [
      { missing: 'pork', replaceWith: '참치캔 또는 햄', tip: '돼지고기 대신 참치캔이나 스팸을 넣으면 감칠맛이 살아납니다.' }
    ],
    steps: [
      '냄비에 김치와 고기(또는 참치)를 넣고 참기름이나 기름에 달달 볶습니다.',
      '물이나 쌀뜨물을 재료가 자작하게 잠길 정도로 붓고 센불로 끓입니다.',
      '양파, 두부, 대파를 썰어 넣고 중약불로 줄여 10분 이상 푹 끓여냅니다.',
      '간장이나 소금으로 부족한 간을 맞춥니다.'
    ],
    cookTime: '20분',
    difficulty: '★☆☆',
    tags: ['한 끼', '국민찌개', '김치소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'doenjang-stew',
    name: '구수한 된장찌개',
    emoji: '🍲',
    category: '한 끼',
    description: '자투리 채소와 두부, 감자를 한 번에 정리하기 가장 좋은 찌개',
    requiredIngredients: ['doenjang'],
    optionalIngredients: ['tofu', 'onion', 'potato', 'zucchini', 'mushroom', 'green_onion'],
    seasonings: ['다진마늘', '고춧가루'],
    substitutions: [
      { missing: 'zucchini', replaceWith: '감자나 버섯 추가', tip: '애호박이 없으면 감자나 버섯만 듬뿍 넣어도 구수해요.' }
    ],
    steps: [
      '냄비에 물 500ml를 붓고 된장 1.5~2스푼을 체에 걸러 풉니다.',
      '단단한 감자, 양파를 먼저 넣고 끓입니다.',
      '애호박, 버섯, 두부를 넣고 한소끔 더 끓입니다.',
      '대파와 칼칼함을 원하면 고춧가루를 약간 넣어 마무리합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '냉장고털기', '채소정리'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'steamed-egg',
    name: '폭신폭신 부드러운 계란찜',
    emoji: '🥚',
    category: '반찬',
    description: '전자레인지로 5분 만에 완성하는 따뜻하고 촉촉한 계란 요리',
    requiredIngredients: ['egg'],
    optionalIngredients: ['green_onion', 'carrot', 'milk'],
    seasonings: ['소금', '참기름'],
    substitutions: [
      { missing: 'milk', replaceWith: '물', tip: '우유 대신 물을 넣어도 담백하게 잘 완성됩니다.' }
    ],
    steps: [
      '전자레인지용 그릇에 계란 3개, 물(또는 우유) 100ml, 소금 반 티스푼을 넣고 섞습니다.',
      '송송 썬 대파나 당근을 얹어줍니다.',
      '랩을 씌우고 포크로 구멍을 2~3개 뚫어줍니다.',
      '전자레인지에 넣고 3분 30초~4분간 돌리면 완성!'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '초간단', '전자레인지'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'egg-soup',
    name: '맑고 따뜻한 계란국',
    emoji: '🥣',
    category: '국/찌개',
    description: '속이 편안해지는 초간단 맑은 국. 찬밥과 함께 먹기 딱 좋아요.',
    requiredIngredients: ['egg', 'green_onion'],
    optionalIngredients: ['onion', 'tofu'],
    seasonings: ['간장', '소금', '참기름'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '양파', tip: '대파 대신 양파를 얇게 썰어 넣으면 국물이 달착지근해집니다.' }
    ],
    steps: [
      '냄비에 물 500ml를 끓이고 간장 1스푼과 소금으로 밑간을 합니다.',
      '양파나 대파를 먼저 넣어 국물 맛을 냅니다.',
      '계란 2개를 풀어 국물이 팔팔 끓을 때 원을 그리며 천천히 부어줍니다.',
      '계란이 떠오르면 불을 끄고 참기름 한 방울을 떨어뜨립니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '국물', '초간단'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tomato-egg-stirfry',
    name: '영양만점 토마토달걀볶음 (토달볶)',
    emoji: '🍅',
    category: '한 끼',
    description: '토마토의 상큼한 과즙과 몽글몽글 계란의 만남! 다이어트 한 끼로 최고',
    requiredIngredients: ['tomato', 'egg'],
    optionalIngredients: ['green_onion'],
    seasonings: ['굴소스(또는 간장)', '식용유', '소금'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '생략 가능', tip: '토마토와 달걀만으로도 훌륭한 브런치 메뉴가 됩니다.' }
    ],
    steps: [
      '토마토는 한 입 크기로 깍둑썰기하고, 달걀은 소금을 넣고 풀어둡니다.',
      '팬에 기름을 두르고 달걀물을 부어 부드러운 스크램블을 만들어 접시에 덜어둡니다.',
      '같은 팬에 토마토를 넣고 즙이 살짝 나올 때까지 볶습니다.',
      '덜어둔 달걀을 다시 넣고 간장이나 굴소스 1스푼으로 간해 빠르게 섞어냅니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '다이어트', '브런치'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'veggie-fried-rice',
    name: '알록달록 야채볶음밥 (냉장고 털기)',
    emoji: '🥕',
    category: '한 끼',
    description: '남은 자투리 채소를 모두 모아 싹 비우는 냉장고 구조대의 궁극기!',
    requiredIngredients: ['rice'],
    optionalIngredients: ['egg', 'onion', 'carrot', 'green_onion', 'mushroom', 'ham'],
    seasonings: ['간장', '식용유', '소금'],
    substitutions: [
      { missing: 'carrot', replaceWith: '어떤 채소든 가능', tip: '애호박, 파프리카, 양배추 등 집에 있는 어떤 채소든 다져 넣으세요.' }
    ],
    steps: [
      '냉장고에 남은 채소들(양파, 당근, 대파, 버섯 등)을 잘게 다집니다.',
      '팬에 기름을 두르고 단단한 채소부터 차례로 달달 볶습니다.',
      '채소가 익으면 밥을 넣고 골고루 섞어줍니다.',
      '간장 1스푼을 팬 가장자리에 눌려 불향을 입혀 볶아냅니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['냉장고털기', '한 끼', '채소올인'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'mushroom-stirfry',
    name: '쫄깃쫄깃 버섯볶음',
    emoji: '🍄',
    category: '반찬',
    description: '쉽게 물러지는 버섯을 빠르게 소비하는 짭조름한 볶음 반찬',
    requiredIngredients: ['mushroom'],
    optionalIngredients: ['onion', 'carrot', 'green_onion'],
    seasonings: ['식용유', '간장', '참기름', '소금'],
    substitutions: [
      { missing: 'onion', replaceWith: '생략 가능', tip: '버섯만으로도 쫄깃한 식감이 훌륭합니다.' }
    ],
    steps: [
      '버섯(느타리, 새송이, 팽이 등)은 먹기 좋게 찢거나 채 썹니다.',
      '팬에 기름을 두르고 센불에서 버섯과 채 썬 양파를 재빨리 볶습니다.',
      '수분이 날아가며 윤기가 돌면 간장 1스푼과 소금으로 간을 맞춥니다.',
      '불을 끄고 참기름을 살짝 둘러 향을 냅니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '버섯구조'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'zucchini-stirfry',
    name: '달큰한 애호박볶음',
    emoji: '🥒',
    category: '반찬',
    description: '부드럽고 달큰해 밥 위에 얹어 비벼 먹어도 맛있는 반찬',
    requiredIngredients: ['zucchini'],
    optionalIngredients: ['onion', 'chili', 'garlic'],
    seasonings: ['식용유', '소금(또는 새우젓)', '참기름'],
    substitutions: [
      { missing: 'garlic', replaceWith: '생략 가능', tip: '마늘 없이 소금으로만 깔끔하게 볶아도 달착지근합니다.' }
    ],
    steps: [
      '애호박은 반달 모양으로 도톰하게 썹니다.',
      '팬에 기름을 두르고 다진 마늘과 채 썬 양파를 먼저 볶아 향을 냅니다.',
      '애호박을 넣고 중불에서 호박이 투명해질 때까지 볶습니다.',
      '소금이나 새우젓으로 간을 맞추고 참기름을 뿌려 마무리합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '애호박구조'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'bean-sprout-salad',
    name: '아삭아삭 콩나물무침',
    emoji: '🌱',
    category: '반찬',
    description: '물러지기 쉬운 콩나물을 한 봉지 뚝딱 해치우는 초간단 나물',
    requiredIngredients: ['bean_sprout'],
    optionalIngredients: ['green_onion', 'garlic'],
    seasonings: ['소금', '참기름', '고춧가루'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '생략 가능', tip: '소금과 참기름만으로 무쳐도 고소하고 깔끔해요.' }
    ],
    steps: [
      '콩나물은 흐르는 물에 가볍게 씻어냅니다.',
      '냄비에 물 1컵과 소금을 넣고 뚜껑을 덮어 3~4분간 삶아냅니다.',
      '체에 밭쳐 한 김 식힌 후 찬물에 가볍게 헹궈 물기를 꼭 짭니다.',
      '볼에 콩나물, 소금 반 스푼, 참기름 1스푼, 대파를 넣고 조물조물 무칩니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '나물'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'cucumber-salad',
    name: '새콤달콤 오이무침',
    emoji: '🥒',
    category: '반찬',
    description: '입맛을 돋우는 아삭하고 상큼한 오이 겉절이',
    requiredIngredients: ['cucumber'],
    optionalIngredients: ['onion', 'chili'],
    seasonings: ['고추장', '간장', '식초', '설탕', '참기름'],
    substitutions: [
      { missing: 'onion', replaceWith: '생략 가능', tip: '오이만 송송 썰어 무쳐도 훌륭합니다.' }
    ],
    steps: [
      '오이는 둥글게 또는 어슷하게 썰어줍니다.',
      '양파도 얇게 채 썰어 준비합니다.',
      '볼에 고추장 1, 고춧가루 1, 식초 1, 설탕 1, 간장 0.5스푼을 섞어 양념장을 만듭니다.',
      '오이와 양파에 양념장을 넣고 가볍게 버무려 깨소금으로 마무리합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '상큼'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'cabbage-egg-pancake',
    name: '다이어트 양배추계란전',
    emoji: '🥬',
    category: '한 끼',
    description: '남은 양배추 듬뿍! 밀가루 없이 계란으로만 부쳐내는 든든한 식단',
    requiredIngredients: ['cabbage', 'egg'],
    optionalIngredients: ['onion', 'bacon', 'cheese'],
    seasonings: ['식용유', '소금', '케첩'],
    substitutions: [
      { missing: 'bacon', replaceWith: '참치캔 또는 게맛살', tip: '베이컨 대신 참치를 넣거나 채소만 넣어도 달콤해요.' }
    ],
    steps: [
      '양배추를 가늘게 채 썰어 찬물에 헹군 뒤 물기를 뺍니다.',
      '볼에 양배추 채와 달걀 2개를 깨 넣고 소금 약간과 함께 섞어줍니다.',
      '팬에 기름을 두르고 양배추 반죽을 두툼하고 둥글게 펼칩니다.',
      '약불에서 뚜껑을 덮고 익히다가 뒤집어 반대쪽도 노릇하게 굽습니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['다이어트', '양배추소진', '한 끼'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'cabbage-stirfry',
    name: '아삭 굴소스 양배추볶음',
    emoji: '🥬',
    category: '반찬',
    description: '센 불에 빠르게 볶아내는 아삭하고 달콤한 중화풍 반찬',
    requiredIngredients: ['cabbage'],
    optionalIngredients: ['bacon', 'pork', 'garlic', 'chili'],
    seasonings: ['간장', '식용유', '굴소스'],
    substitutions: [
      { missing: 'bacon', replaceWith: '생략 가능', tip: '기름에 마늘만 볶다가 양배추를 볶아도 담백합니다.' }
    ],
    steps: [
      '양배추를 한 입 크기 네모 모양으로 큼직하게 썹니다.',
      '팬에 기름을 두르고 다진 마늘이나 베이컨을 먼저 볶습니다.',
      '센 불로 올리고 양배추를 넣어 숨이 살짝 죽을 때까지만 빠르게 볶습니다.',
      '간장 1스푼 또는 굴소스를 넣어 센 불에 휘리릭 볶아 완성합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '양배추정리'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'baked-sweet-potato',
    name: '달콤 촉촉 에어프라이어 군고구마',
    emoji: '🍠',
    category: '간식',
    description: '베란다에 둔 고구마가 있다면 꿀이 뚝뚝 떨어지는 간식으로 변신',
    requiredIngredients: ['sweet_potato'],
    optionalIngredients: ['butter', 'cheese'],
    seasonings: [],
    substitutions: [
      { missing: 'butter', replaceWith: '생략 가능', tip: '고구마 자체만으로도 충분히 달콤합니다.' }
    ],
    steps: [
      '고구마를 흐르는 물에 깨끗이 씻어 양 끝을 살짝 잘라냅니다.',
      '에어프라이어에 넣고 180도에서 30~40분간 굽습니다.',
      '젓가락으로 찔렀을 때 푹 들어가면 완성!',
      '기호에 따라 반을 갈라 버터나 치즈를 얹어 즐깁니다.'
    ],
    cookTime: '30분',
    difficulty: '★☆☆',
    tags: ['간식', '고구마구조', '에어프라이어'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'banana-yogurt-bowl',
    name: '달콤 상큼 바나나요거트볼',
    emoji: '🥣',
    category: '간식',
    description: '슈가스팟이 생긴 바나나와 요거트로 만드는 즉석 에너지 충전볼',
    requiredIngredients: ['banana', 'yogurt'],
    optionalIngredients: ['apple', 'strawberry', 'tangerine'],
    seasonings: ['꿀/설탕'],
    substitutions: [
      { missing: 'banana', replaceWith: '사과 또는 귤', tip: '집에 남아있는 어떤 과일이든 썰어 넣으면 훌륭해요.' }
    ],
    steps: [
      '바나나를 먹기 좋은 두께로 송송 썹니다.',
      '볼에 요거트를 담고 그 위에 바나나를 얹습니다.',
      '기호에 따라 꿀 한 스푼이나 견과류를 얹어 가볍게 섞어 먹습니다.'
    ],
    cookTime: '5분',
    difficulty: '★☆☆',
    tags: ['5분 요리', '간식', '바나나소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'fruit-salad',
    name: '상큼한 과일 샐러드',
    emoji: '🥗',
    category: '간식',
    description: '시들기 시작한 사과, 귤, 토마토를 모두 모아 상큼하게 즐기기',
    requiredIngredients: ['apple'],
    optionalIngredients: ['banana', 'tomato', 'tangerine', 'lettuce', 'yogurt'],
    seasonings: ['마요네즈', '설탕'],
    substitutions: [
      { missing: 'mayonnaise', replaceWith: '요거트 드레싱', tip: '마요네즈 대신 요거트를 뿌리면 훨씬 가볍고 산뜻합니다.' }
    ],
    steps: [
      '집에 있는 과일들을 깨끗이 씻어 깍둑썰기합니다.',
      '볼에 과일을 모두 담고 마요네즈 2스푼이나 요거트를 넣습니다.',
      '설탕 약간을 더해 고루 버무려 시원하게 즐깁니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '과일소진', '간식'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'cheese-toast',
    name: '멜팅 치즈 토스트',
    emoji: '🧀',
    category: '간식',
    description: '노릇하게 구운 식빵 사이로 쭉 늘어나는 치즈의 행복한 맛',
    requiredIngredients: ['bread', 'cheese'],
    optionalIngredients: ['butter', 'ham', 'egg'],
    seasonings: ['설탕'],
    substitutions: [
      { missing: 'butter', replaceWith: '식용유', tip: '팬에 기름을 살짝 두르고 구워도 바삭합니다.' }
    ],
    steps: [
      '팬에 버터나 기름을 두르고 식빵 한쪽 면을 굽습니다.',
      '식빵을 뒤집고 슬라이스 치즈를 올립니다.',
      '치즈 위에 식빵 하나를 더 덮고 약불에서 뚜껑을 덮어 치즈를 녹여냅니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '간식', '치즈소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tuna-mayo-rice',
    name: '고소한 참치마요덮밥',
    emoji: '🐟',
    category: '한 끼',
    description: '참치캔과 계란, 마요네즈만 있으면 전문점 부럽지 않은 한 그릇',
    requiredIngredients: ['tuna_can', 'egg', 'rice'],
    optionalIngredients: ['onion', 'seaweed', 'mayonnaise'],
    seasonings: ['간장', '설탕', '식용유'],
    substitutions: [
      { missing: 'mayonnaise', replaceWith: '간장계란밥 스타일', tip: '마요네즈가 없다면 간장과 참기름으로 비벼도 훌륭합니다.' },
      { missing: 'seaweed', replaceWith: '생략 가능', tip: '김가루 없이도 달콤 짭조름한 양파 조림으로 충분히 맛있어요.' }
    ],
    steps: [
      '참치캔의 기름을 숟가락으로 꼭 짜냅니다.',
      '달걀 2개로 스크램블을 만들어 밥 둘레에 올립니다.',
      '양파를 얇게 썰어 팬에 간장 2스푼, 설탕 1스푼, 물 2스푼과 함께 졸입니다.',
      '밥 위에 졸인 양파, 기름 뺀 참치를 얹고 마요네즈를 지그재그로 뿌려 완성합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '참치소진', '인기메뉴'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tuna-kimchi-fried-rice',
    name: '감칠맛 참치김치볶음밥',
    emoji: '🥘',
    category: '한 끼',
    description: '참치의 기름진 고소함과 신김치의 산뜻함이 볶음밥의 맛을 배로!',
    requiredIngredients: ['kimchi', 'rice', 'tuna_can'],
    optionalIngredients: ['egg', 'green_onion', 'onion'],
    seasonings: ['식용유', '간장', '설탕', '참기름'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '양파', tip: '파기름 대신 양파 단맛으로 볶아도 맛있어요.' }
    ],
    steps: [
      '김치는 가위로 잘게 썰어 준비합니다.',
      '팬에 참치캔 기름을 살짝 두르고 김치를 달달 볶아줍니다.',
      '설탕 반 스푼을 넣어 신맛을 중화하고 참치 살코기를 넣어 함께 볶습니다.',
      '밥을 넣고 밥알이 고슬고슬해질 때까지 볶은 후 참기름으로 마무리합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '참치캔', '김치소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'fishcake-stirfry',
    name: '단짠단짠 어묵볶음',
    emoji: '🍢',
    category: '반찬',
    description: '냉장고에 남은 어묵 몇 장을 5분 만에 촉촉 쫄깃한 반찬으로',
    requiredIngredients: ['fish_cake'],
    optionalIngredients: ['onion', 'green_onion', 'carrot', 'chili'],
    seasonings: ['간장', '설탕', '식용유', '참기름'],
    substitutions: [
      { missing: 'onion', replaceWith: '대파 송송', tip: '양파가 없으면 대파만 넉넉히 썰어 넣어도 맛있습니다.' }
    ],
    steps: [
      '어묵을 먹기 좋은 크기로 길쭉하거나 네모나게 썹니다.',
      '팬에 기름을 두르고 채 썬 양파와 어묵을 함께 중불에 볶습니다.',
      '물 2스푼, 간장 2스푼, 설탕 1스푼을 섞은 양념을 붓고 촉촉하게 졸입니다.',
      '마지막에 참기름과 깨를 뿌려 마무리합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '반찬', '어묵소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tteokbokki',
    name: '매콤달콤 국민 떡볶이',
    emoji: '🍢',
    category: '간식',
    description: '냉동실에 잠자던 떡과 남은 어묵, 대파를 깨우는 마법의 분식',
    requiredIngredients: ['rice_cake'],
    optionalIngredients: ['fish_cake', 'green_onion', 'egg', 'cabbage'],
    seasonings: ['고추장', '설탕', '간장', '고춧가루'],
    substitutions: [
      { missing: 'fish_cake', replaceWith: '삶은 계란이나 양배추', tip: '어묵이 없으면 삶은 달걀이나 양배추만 넣어도 달콤해요.' }
    ],
    steps: [
      '냉동 떡은 찬물에 10분간 담가 불려둡니다.',
      '냄비에 물 400ml를 붓고 고추장 2, 설탕 2, 간장 1, 고춧가루 1스푼을 풀어 끓입니다.',
      '국물이 끓으면 떡과 큼직하게 썬 어묵, 대파를 넣습니다.',
      '중약불에서 국물이 걸쭉해질 때까지 떡에 양념이 밸 수 있도록 저어줍니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['간식', '분식', '떡소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'fried-ramen',
    name: '색다른 별미 볶음라면',
    emoji: '🍜',
    category: '한 끼',
    description: '국물 라면의 변신! 대파와 계란, 양파를 넣어 고소하게 볶아보세요.',
    requiredIngredients: ['ramen'],
    optionalIngredients: ['green_onion', 'egg', 'onion'],
    seasonings: ['라면스프(절반)', '식용유', '참기름'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '양파', tip: '대파 대신 양파를 볶아 라면과 비벼도 맛있습니다.' }
    ],
    steps: [
      '끓는 물에 라면 사리를 넣고 꼬들꼬들하게 2분만 삶아 건져냅니다.',
      '팬에 기름을 넉넉히 두르고 송송 썬 대파를 볶아 파기름을 냅니다.',
      '삶은 라면 면발과 라면 스프의 1/2만 넣고 빠르게 볶습니다.',
      '계란 하나를 넣어 스크램블처럼 함께 볶아내면 고소함 폭발!'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '별미', '라면변신'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'fried-noodle',
    name: '자투리 채소 볶음면',
    emoji: '🍝',
    category: '한 끼',
    description: '남은 면 사리와 냉장고 속 채소들을 굴소스에 볶아내는 퓨전 요리',
    requiredIngredients: ['noodle'],
    optionalIngredients: ['cabbage', 'onion', 'pork', 'bacon', 'carrot'],
    seasonings: ['간장', '식용유', '굴소스', '설탕'],
    substitutions: [
      { missing: 'noodle', replaceWith: '라면 사리 또는 우동면', tip: '소면, 중면, 라면, 우동면 어떤 면이든 가능합니다.' }
    ],
    steps: [
      '면을 삶아 찬물에 헹궈 물기를 빼둡니다.',
      '팬에 기름을 두르고 채 썬 채소(양배추, 양파, 당근)와 고기를 볶습니다.',
      '채소가 숨이 죽으면 삶은 면과 간장 1.5스푼, 굴소스 1스푼, 설탕 반 스푼을 넣습니다.',
      '센 불에서 1분간 면에 소스가 배도록 볶아 마무리합니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['한 끼', '면요리', '채소정리'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'chicken-salad',
    name: '든든 산뜻 닭가슴살 샐러드',
    emoji: '🥗',
    category: '한 끼',
    description: '냉동실 닭가슴살과 냉장고 채소로 만드는 건강하고 가벼운 한 끼',
    requiredIngredients: ['chicken_breast'],
    optionalIngredients: ['tomato', 'cucumber', 'lettuce', 'egg'],
    seasonings: ['간장', '식초', '설탕', '올리브유'],
    substitutions: [
      { missing: 'lettuce', replaceWith: '양배추 채 썰기', tip: '상추가 없으면 양배추를 얇게 채 썰어 베이스로 삼아보세요.' }
    ],
    steps: [
      '닭가슴살은 삶거나 에어프라이어에 구워 결대로 찢어둡니다.',
      '토마토, 오이, 상추 등 남은 채소를 한 입 크기로 썹니다.',
      '접시에 채소와 닭가슴살, 삶은 계란을 예쁘게 담습니다.',
      '간장 1, 식초 1, 올리브유 1, 설탕 0.5스푼을 섞은 오리엔탈 드레싱을 뿌립니다.'
    ],
    cookTime: '15분',
    difficulty: '★☆☆',
    tags: ['다이어트', '닭가슴살소진', '한 끼'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'tomato-salad',
    name: '발사믹 마리네이드 토마토샐러드',
    emoji: '🍅',
    category: '간식',
    description: '물러지려는 토마토와 양파를 상큼하게 절여두는 유럽풍 샐러드',
    requiredIngredients: ['tomato'],
    optionalIngredients: ['onion', 'cheese'],
    seasonings: ['식초', '설탕', '소금', '올리브유'],
    substitutions: [
      { missing: 'cheese', replaceWith: '생략 가능', tip: '치즈 없이 토마토와 양파만으로도 충분히 상큼합니다.' }
    ],
    steps: [
      '토마토는 한 입 크기로 깍둑썰기하고, 양파는 곱게 다집니다.',
      '볼에 올리브유 2스푼, 식초 1스푼, 설탕 1스푼, 소금 한 꼬집을 섞습니다.',
      '토마토와 다진 양파를 소스에 버무려 냉장고에 10분간 차갑게 둡니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '토마토소진', '상큼'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'mandu-soup',
    name: '뜨끈뜨끈 5분 만둣국',
    emoji: '🥟',
    category: '한 끼',
    description: '냉동만두와 계란 하나로 만드는 따뜻하고 든든한 국물 요리',
    requiredIngredients: ['dumpling', 'egg'],
    optionalIngredients: ['green_onion', 'seaweed', 'garlic'],
    seasonings: ['간장', '소금', '참기름'],
    substitutions: [
      { missing: 'seaweed', replaceWith: '대파 송송', tip: '김가루가 없어도 대파와 계란만으로 시원한 국물이 완성됩니다.' }
    ],
    steps: [
      '냄비에 물 500ml를 끓이고 간장 1스푼과 다진 마늘 약간을 넣습니다.',
      '냉동만두를 넣고 만두가 위로 떠오를 때까지 4분 정도 끓입니다.',
      '계란 1개를 풀어 냄비 둘레에 부어줍니다.',
      '대파를 송송 썰어 넣고 참기름, 후추 톡톡 뿌려 마무리합니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '국물', '만두소진'],
    mainSDG: 'SDG 12'
  },
  {
    id: 'milk-egg-custard',
    name: '부드러운 우유 계란찜',
    emoji: '🥛',
    category: '반찬',
    description: '물 대신 우유를 넣어 푸딩처럼 극강의 부드러움을 자랑하는 계란찜',
    requiredIngredients: ['milk', 'egg'],
    optionalIngredients: ['green_onion', 'cheese'],
    seasonings: ['소금', '설탕'],
    substitutions: [
      { missing: 'green_onion', replaceWith: '생략 가능', tip: '채소 없이 우유와 계란만으로 일식 차완무시처럼 즐길 수 있어요.' }
    ],
    steps: [
      '계란 2개와 우유 100ml를 1:1 비율로 잘 섞어 체에 한 번 거릅니다.',
      '소금 반 티스푼과 설탕 약간으로 밑간을 합니다.',
      '전자레인지 전용 그릇에 담아 랩을 씌우고 약 3분간 돌려줍니다.'
    ],
    cookTime: '10분',
    difficulty: '★☆☆',
    tags: ['10분 요리', '우유소진', '아이간식'],
    mainSDG: 'SDG 12'
  }
];

// 4. 식재료 보관 가이드 데이터 (27종 상세)
const STORAGE_GUIDE = [
  {
    id: 'egg',
    name: '계란',
    icon: '🥚',
    recommended: '냉장 보관',
    simpleTip: '물로 씻지 말고 뾰족한 쪽이 아래로 향하게 두세요. 문 쪽 선반보다 안쪽 선반에 보관하면 온도 변화가 적어 신선함이 오래 유지돼요.',
    ideas: ['계란볶음밥', '계란토스트', '계란찜', '토마토달걀볶음'],
    alert: '껍질을 물로 씻으면 보호막이 파괴될 수 있어요.'
  },
  {
    id: 'milk',
    name: '우유',
    icon: '🥛',
    recommended: '냉장 보관',
    simpleTip: '개봉 후에는 공기와 접촉을 최소화하고 냄새를 잘 흡수하므로 밀폐하여 보관하세요. 냉장고 문 쪽보다는 안쪽에 두는 것이 좋아요.',
    ideas: ['프렌치토스트', '우유계란찜', '라떼', '크림파스타'],
    alert: '소비기한이 지나더라도 개봉하지 않고 냉장 보관했다면 상태(냄새, 몽글거림)를 확인 후 활용해보세요.'
  },
  {
    id: 'green_onion',
    name: '대파',
    icon: '🌱',
    recommended: '냉장 / 냉동',
    simpleTip: '단기간 사용할 것은 씻지 않고 키친타월에 싸서 지퍼백에 냉장하고, 오래 둘 것은 송송 썰어 밀폐용기에 담아 냉동 보관하면 요리할 때 바로 쓰기 편해요.',
    ideas: ['파기름 볶음밥', '계란국', '찌개류 고명', '볶음라면'],
    alert: '물기가 남아있으면 쉽게 무르므로 물기를 바짝 말린 뒤 보관하세요.'
  },
  {
    id: 'onion',
    name: '양파',
    icon: '🧅',
    recommended: '실온 / 냉장',
    simpleTip: '껍질째 스타킹이나 그물망에 넣어 통풍이 잘되고 서늘한 곳에 보관하세요. 껍질을 깐 양파는 랩으로 개별 밀봉하여 냉장 보관합니다.',
    ideas: ['양파계란볶음', '김치찌개', '볶음밥', '카레'],
    alert: '감자와 함께 두면 둘 다 더 빨리 물러질 수 있으니 따로 보관하세요.'
  },
  {
    id: 'garlic',
    name: '마늘',
    icon: '🧄',
    recommended: '실온 / 냉동',
    simpleTip: '통마늘은 통풍이 잘되는 그늘진 실온에 두고, 깐마늘은 설탕이나 키친타월을 깐 밀폐용기에 담아 냉장 보관하세요. 다진 마늘은 냉동 큐브로 얼리면 편리해요.',
    ideas: ['모든 볶음 요리', '찌개', '갈릭 토스트', '알리오올리오'],
    alert: '습기에 약하므로 키친타월로 수분을 잡아주세요.'
  },
  {
    id: 'potato',
    name: '감자',
    icon: '🥔',
    recommended: '실온 보관 (그늘)',
    simpleTip: '햇빛을 받으면 솔라닌 독소(녹색 변화, 싹)가 생기므로 신문지에 싸서 박스나 어두운 서늘한 곳에 두세요. 사과를 한 개 같이 넣어두면 싹 나는 것을 억제해줘요.',
    ideas: ['감자전', '감자채볶음', '된장찌개', '웨지감자'],
    alert: '냉장고에 넣으면 전분이 당분으로 변해 식감이 나빠지니 실온 그늘에 두세요.'
  },
  {
    id: 'sweet_potato',
    name: '고구마',
    icon: '🍠',
    recommended: '실온 보관',
    simpleTip: '추위에 매우 약합니다. 냉장고에 넣으면 쉽게 썩으므로 절대 냉장하지 말고, 신문지를 깔고 상온(12~15도) 그늘에 펼쳐 수분을 말리며 보관하세요.',
    ideas: ['에어프라이어 군고구마', '고구마 맛탕', '고구마 라떼'],
    alert: '냉장고에 절대 넣지 마세요.'
  },
  {
    id: 'carrot',
    name: '당근',
    icon: '🥕',
    recommended: '냉장 보관',
    simpleTip: '흙이 묻은 채로 신문지에 싸서 채소칸에 세워 보관하는 것이 가장 좋습니다. 세척한 당근은 물기를 닦고 랩으로 감싸 보관하세요.',
    ideas: ['볶음밥', '야채볶음', '카레', '샐러드'],
    alert: '당근 윗부분의 싹은 잘라내고 보관해야 영양분이 빠져나가지 않아요.'
  },
  {
    id: 'mushroom',
    name: '버섯',
    icon: '🍄',
    recommended: '냉장 보관',
    simpleTip: '수분에 매우 약합니다. 요리하기 전까지 물로 씻지 말고, 키친타월로 감싸 지퍼백에 넣어 냉장 보관하세요. 살짝 말리거나 썰어서 냉동해도 좋아요.',
    ideas: ['버섯볶음', '된장찌개', '버섯전', '볶음밥'],
    alert: '물로 씻으면 향이 날아가고 식감이 스펀지처럼 변해요.'
  },
  {
    id: 'zucchini',
    name: '애호박',
    icon: '🥒',
    recommended: '냉장 보관',
    simpleTip: '물기를 닦고 키친타월이나 랩으로 감싸 채소칸에 보관하세요. 쓰고 남은 단면은 랩으로 공기가 통하지 않게 꼼꼼히 밀착 포장합니다.',
    ideas: ['애호박볶음', '된장찌개', '애호박전', '칼국수'],
    alert: '잘라둔 단면부터 상하기 쉬우니 며칠 내로 먼저 사용하세요.'
  },
  {
    id: 'cabbage',
    name: '양배추',
    icon: '🥬',
    recommended: '냉장 보관',
    simpleTip: '가장 먼저 심지(가운데 단단한 기둥)를 칼로 도려내고, 그 자리에 물을 적신 키친타월을 채워 넣은 뒤 랩으로 싸서 보관하면 싱싱함이 놀랍도록 오래가요.',
    ideas: ['양배추계란전', '양배추볶음', '길거리토스트', '샐러드'],
    alert: '잎을 바깥쪽부터 한 장씩 뜯어 쓰면 보관 기간이 길어져요.'
  },
  {
    id: 'lettuce',
    name: '상추',
    icon: '🥗',
    recommended: '냉장 보관 (밀폐)',
    simpleTip: '씻지 말고 줄기 부분이 아래로 향하도록 세워서 밀폐용기에 담고 키친타월을 덮어 보관하세요. 시든 상추는 50도 따뜻한 물에 1분 담그면 다시 파릇파릇 살아나요.',
    ideas: ['샐러드', '비빔밥', '겉절이', '상추쌈'],
    alert: '물기가 닿은 채 두면 잎이 짓무르니 먹기 직전에 씻으세요.'
  },
  {
    id: 'perilla_leaf',
    name: '깻잎',
    icon: '🍃',
    recommended: '냉장 보관',
    simpleTip: '줄기 끝부분을 물에 살짝 담그고 잎 부분은 닿지 않게 세워서 지퍼백에 넣어 보관하면 줄기를 통해 수분을 흡수해 오래 싱싱해요.',
    ideas: ['깻잎전', '볶음 요리 고명', '깻잎조림', '비빔밥'],
    alert: '잎이 접히면 그 부분부터 검게 변하니 펴서 보관하세요.'
  },
  {
    id: 'tofu',
    name: '두부',
    icon: '🧊',
    recommended: '냉장 보관 (물 채움)',
    simpleTip: '개봉 후 남은 두부는 밀폐용기에 담고 두부가 잠길 정도로 깨끗한 수돗물에 소금 반 티스푼을 타서 냉장 보관하세요. 물을 매일 갈아주면 더 오래 가요.',
    ideas: ['두부부침', '두부김치', '된장찌개', '두부조림'],
    alert: '냉동실에 얼려두면 단백질 조직이 쫄깃해지는 언두부(동두부)로 찌개에 넣기 좋아요.'
  },
  {
    id: 'kimchi',
    name: '김치',
    icon: '🥬',
    recommended: '냉장 / 김치냉장고',
    simpleTip: '국물에 완전히 잠기도록 꾹꾹 누르고 위에 위생비닐을 덮어 공기 접촉을 막아주세요. 온도 변화가 적은 깊은 곳에 둡니다.',
    ideas: ['김치볶음밥', '김치전', '김치찌개', '두부김치'],
    alert: '침 묻은 젓가락이 닿으면 군내가 날 수 있으니 덜어 드세요.'
  },
  {
    id: 'bread',
    name: '식빵',
    icon: '🍞',
    recommended: '냉동 보관 (즉시 소분)',
    simpleTip: '냉장실에 넣으면 수분이 빠져나가 빵이 금방 딱딱하고 퍽퍽해집니다. 2~3일 내에 먹을 것만 실온에 두고 나머지는 1~2장씩 랩으로 싸서 지퍼백에 바로 냉동하세요.',
    ideas: ['프렌치토스트', '계란토스트', '치즈토스트', '크루통'],
    alert: '냉장실 보관은 절대 비추천! 냉동실에서 꺼내 바로 토스터나 팬에 구우면 갓 구운 빵처럼 돌아와요.'
  },
  {
    id: 'cheese',
    name: '치즈',
    icon: '🧀',
    recommended: '냉장 보관',
    simpleTip: '슬라이스 치즈는 개별 포장이라도 밀폐용기에 한 번 더 담아 건조를 막아주세요. 모짜렐라 피자치즈는 소분하여 냉동 보관하면 좋습니다.',
    ideas: ['토스트', '볶음밥 토핑', '치즈라면', '계란말이'],
    alert: '치즈 냄새 흡수를 막기 위해 밀폐용기 보관 필수!'
  },
  {
    id: 'banana',
    name: '바나나',
    icon: '🍌',
    recommended: '실온 보관 (걸어두기)',
    simpleTip: '바닥에 닿는 면부터 물러지므로 바나나 걸이나 옷걸이에 걸어두세요. 꼭지 부분을 랩으로 꽁꽁 싸두면 에틸렌 가스 방출이 줄어 천천히 익어요.',
    ideas: ['바나나요거트', '바나나 팬케이크', '스무디'],
    alert: '갈색 반점(슈가스팟)이 생기면 껍질을 벗겨 썰어서 냉동실에 얼려두면 스무디용으로 최고예요.'
  },
  {
    id: 'apple',
    name: '사과',
    icon: '🍎',
    recommended: '냉장 보관 (개별 포장)',
    simpleTip: '사과는 다른 과일과 채소를 빨리 익게 만드는 에틸렌 가스를 많이 방출합니다. 꼭 랩이나 비닐봉지에 하나씩 개별 밀봉하여 따로 보관하세요.',
    ideas: ['과일샐러드', '사과잼', '샌드위치 토핑'],
    alert: '다른 채소와 한 비닐에 넣으면 채소가 금방 시들어요!'
  },
  {
    id: 'tomato',
    name: '토마토',
    icon: '🍅',
    recommended: '실온 그늘 / 냉장',
    simpleTip: '덜 익은 토마토는 꼭지가 아래로 향하게 실온에 두어 후숙시킵니다. 완전히 완숙된 토마토는 냉장 보관하고, 껍질을 벗겨 퓨레로 얼려두면 파스타나 국에 쓰기 좋아요.',
    ideas: ['토마토달걀볶음', '토마토샐러드', '카프레제', '토마토스프'],
    alert: '꼭지를 떼어내고 보관해야 곰팡이가 생기지 않아요.'
  },
  {
    id: 'cucumber',
    name: '오이',
    icon: '🥒',
    recommended: '냉장 보관',
    simpleTip: '추위에 약하므로 신문지나 키친타월로 하나씩 감싼 뒤 꼭지가 위로 향하게 세워서 채소칸에 보관하세요.',
    ideas: ['오이무침', '비빔국수 고명', '샐러드', '오이냉국'],
    alert: '냉기 배출구 근처에 두면 얼어서 물러집니다.'
  },
  {
    id: 'chili',
    name: '고추',
    icon: '🌶️',
    recommended: '냉동 보관 (송송 썰어서)',
    simpleTip: '많은 양의 고추는 깨끗이 씻어 물기를 완전히 말린 후, 송송 썰어 밀폐용기에 냉동해두면 찌개나 볶음에 한 숟가락씩 바로 넣기 아주 편리해요.',
    ideas: ['된장찌개', '볶음밥', '어묵볶음', '각종 볶음 고명'],
    alert: '물기를 닦지 않고 냉동하면 얼음 덩어리가 생겨요.'
  },
  {
    id: 'paprika',
    name: '파프리카',
    icon: '🫑',
    recommended: '냉장 보관',
    simpleTip: '물기를 닦아내고 랩으로 하나씩 감싸 냉장 채소칸에 보관하세요. 꼭지 부분부터 상하기 쉬우므로 꼭지 상태를 잘 살펴봅니다.',
    ideas: ['볶음밥', '야채볶음', '샐러드', '파프리카전'],
    alert: '씨를 빼고 썰어둔 것은 밀폐용기에 키친타월을 깔고 보관하세요.'
  },
  {
    id: 'chicken_breast',
    name: '닭가슴살 / 닭고기',
    icon: '🍗',
    recommended: '냉동 보관 (즉시)',
    simpleTip: '1~2일 내에 먹을 것은 냉장 가장 찬 곳에 두고, 그 외에는 1회 분량씩 랩으로 꼼꼼히 싸서 지퍼백에 넣어 즉시 냉동하세요.',
    ideas: ['닭가슴살 샐러드', '치킨볶음밥', '카레'],
    alert: '닭고기는 상하기 매우 쉬우므로 해동 시에도 냉장실에서 천천히 해동하세요.'
  },
  {
    id: 'pork',
    name: '돼지고기',
    icon: '🥩',
    recommended: '냉장(단기) / 냉동',
    simpleTip: '핏물을 키친타월로 닦아내고 표면에 식용유나 올리브유를 살짝 바른 뒤 랩으로 밀착 포장하면 산화를 막아 훨씬 신선하게 보관할 수 있어요.',
    ideas: ['제육볶음', '김치찌개', '볶음밥', '된장찌개'],
    alert: '핏물이 고여있으면 잡내와 부패의 원인이 됩니다.'
  },
  {
    id: 'beef',
    name: '소고기',
    icon: '🥩',
    recommended: '냉장(단기) / 냉동',
    simpleTip: '키친타월로 핏물을 꼼꼼히 제거하고 공기와의 접촉을 완벽히 차단하여 진공포장이나 랩핑 후 냉동 보관합니다.',
    ideas: ['소고기 뭇국', '불고기', '소고기 볶음밥'],
    alert: '해동할 때 전자레인지보다는 냉장실에서 반나절 동안 자연 해동하는 것이 육즙 손실을 막아요.'
  },
  {
    id: 'mackerel',
    name: '생선류 (고등어/연어 등)',
    icon: '🐟',
    recommended: '냉동 보관',
    simpleTip: '내장과 지느러미를 제거하고 흐르는 물에 씻은 뒤 물기를 완벽히 닦아 소금을 살짝 뿌려 개별 랩핑 후 냉동하세요.',
    ideas: ['생선구이', '생선조림', '연어덮밥'],
    alert: '해산물은 가장 쉽게 상하는 식재료이므로 조금이라도 냄새가 이상하면 주의하세요.'
  }
];

// 5. 오늘의 작은 미션 목록
const DAILY_MISSIONS = [
  {
    id: 'mission-1',
    title: '냉장고 구석 잠자는 재료 1개 구출하기',
    description: '냉장고 안쪽 깊숙한 곳을 열어 가장 오래된 재료를 하나 찾아 오늘 식단에 올려보세요.',
    emoji: '🔍',
    tag: '초간단'
  },
  {
    id: 'mission-2',
    title: '배달 주문 전 냉장고 문 먼저 열어보기',
    description: '배달앱을 켜기 전에 냉장고 재료로 만들 수 있는 10분 요리가 있는지 1분만 고민해보세요.',
    emoji: '🚪',
    tag: '지갑지킴이'
  },
  {
    id: 'mission-3',
    title: '시들기 쉬운 채소 하나 냉동 소분하기',
    description: '대파, 고추, 또는 양배추가 있다면 송송 썰어 냉동실에 보관용으로 소분해보세요.',
    emoji: '🧊',
    tag: '보관의달인'
  },
  {
    id: 'mission-4',
    title: '남은 자투리 채소 모아 계란말이나 볶음밥 만들기',
    description: '조금씩 남은 양파, 당근, 버섯을 잘게 다져 맛있는 한 끼를 완성해보세요.',
    emoji: '🍳',
    tag: '냉장고털기'
  },
  {
    id: 'mission-5',
    title: '소비기한 임박 재료 우선순위 체크하기',
    description: '냉장실 우유나 두부, 빵의 상태를 확인하고 오늘이나 내일 중 먹을 계획을 세워보세요.',
    emoji: '⏰',
    tag: '계획소비'
  }
];

// 6. SDGs 스토리텔링 & Impact 정보
const SDG_INFO = {
  sdg12: {
    number: 12,
    title: '책임감 있는 소비와 생산',
    englishTitle: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    keyPoint: '가장 핵심적인 우리의 실천 목표',
    desc: '필요한 만큼 소비하고 구매한 식재료를 버리지 않고 끝까지 먹는 것은 전 세계 식량 손실을 줄이는 가장 실질적이고 강력한 첫걸음입니다.'
  },
  sdg2: {
    number: 2,
    title: '기아 종식',
    englishTitle: 'Zero Hunger',
    color: '#DDA63A',
    keyPoint: '식량 자원의 소중한 가치 재조명',
    desc: '한쪽에서는 식량이 낭비되고 한쪽에서는 굶주림이 발생합니다. 음식의 가치를 다시 생각하고 먹을 수 있는 재료를 소중히 다루는 태도가 필요합니다.'
  },
  sdg13: {
    number: 13,
    title: '기후변화 대응',
    englishTitle: 'Climate Action',
    color: '#3F7E44',
    keyPoint: '보이지 않는 탄소 발자국 줄이기',
    desc: '식품이 생산되고, 냉장 트럭으로 운송되며, 조리되고, 폐기물로 썩어가는 전 과정에서 막대한 온실가스가 배출됩니다. 음식 낭비를 막는 것은 지구 온도를 낮추는 일상 속 기후 행동입니다.'
  }
};

  // 전역 객체 및 브라우저/Node 호환성 등록
  if (typeof window !== 'undefined') {
    window.SMF_DATA = {
      CATEGORIES,
      INGREDIENTS,
      RECIPES,
      STORAGE_GUIDE,
      DAILY_MISSIONS,
      SDG_INFO
    };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CATEGORIES,
      INGREDIENTS,
      RECIPES,
      STORAGE_GUIDE,
      DAILY_MISSIONS,
      SDG_INFO
    };
  }
})();

