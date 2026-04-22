import type { Work, ProcessStep, SiteConfig } from '@/types';

// Perfume works data
export const works: Work[] = [
  {
    id: 'w1',
    name: '樱时',
    nameEn: 'Sakura Hour',
    description: '京都春樱的刹那与永恒，捕捉樱花飘落瞬间的空气感。',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
    notes: {
      top: ['樱花花瓣', '佛手柑', '粉红胡椒'],
      heart: ['白牡丹', '茉莉', '铃兰'],
      base: ['白麝香', '雪松', '琥珀'],
    },
    year: 2021,
  },
  {
    id: 'w2',
    name: '墨庭',
    nameEn: 'Ink Garden',
    description: '雨后庭院的苔藓与湿润泥土，墨色深处的静谧。',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    notes: {
      top: ['绿叶', '竹子', '香柠檬'],
      heart: ['鸢尾', '岩兰草', '乌龙茶'],
      base: ['苔藓', '沉香', '广藿香'],
    },
    year: 2022,
  },
  {
    id: 'w3',
    name: '宵待',
    nameEn: 'Nightfall',
    description: '黄昏时分的线香余韵，温暖而克制的东方调。',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    notes: {
      top: ['藏红花', '豆蔻', '柑橘'],
      heart: ['乳香', '没药', '玫瑰'],
      base: ['檀香', '香草', '龙涎香'],
    },
    year: 2023,
  },
  {
    id: 'w4',
    name: '初霜',
    nameEn: 'First Frost',
    description: '冬日清晨的第一层霜，冷冽中透出暖意。',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80',
    notes: {
      top: ['薄荷', '桉树', '杜松'],
      heart: ['白茶', '紫罗兰叶', '鸢尾根'],
      base: ['琥珀木', '麝香', '香根草'],
    },
    year: 2023,
  },
  {
    id: 'w5',
    name: '灯下',
    nameEn: 'Under the Lamp',
    description: '深夜书房里的一盏灯，纸墨与旧木的温存气息。',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80',
    notes: {
      top: ['纸莎草', '柠檬', '小豆蔻'],
      heart: ['旧书页', '蜂蜡', '干花'],
      base: ['旧木', '香草豆', '零陵香豆'],
    },
    year: 2024,
  },
  {
    id: 'w6',
    name: '水无月',
    nameEn: 'Minazuki',
    description: '六月无水的干涸河床，阳光炙烤石头的矿物感。',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    notes: {
      top: ['矿物', '臭氧', '青柠'],
      heart: ['睡莲', '荷花', '水生调'],
      base: ['燧石', '白麝香', '雪松'],
    },
    year: 2024,
  },
];

// Bespoke perfume creation process steps
export const processSteps: ProcessStep[] = [
  {
    id: 'p1',
    icon: '💬',
    title: '倾听',
    titleEn: 'Listen',
    description: '了解你的故事、记忆与情感偏好，找到属于你的香气语言。',
    duration: '60 分钟',
  },
  {
    id: 'p2',
    icon: '🧪',
    title: '调配',
    titleEn: 'Blend',
    description: '基于对话中的线索，从超过 200 种天然香料中筛选组合。',
    duration: '2-3 周',
  },
  {
    id: 'p3',
    icon: '👃',
    title: '品鉴',
    titleEn: 'Experience',
    description: '试闻初版配方，在肌肤上感受香气的三层变化，提出调整意见。',
    duration: '30 分钟',
  },
  {
    id: 'p4',
    icon: '✨',
    title: '精炼',
    titleEn: 'Refine',
    description: '根据你的反馈微调比例，直至每一个音符都恰到好处。',
    duration: '1-2 周',
  },
  {
    id: 'p5',
    icon: '🎁',
    title: '交付',
    titleEn: 'Deliver',
    description: '手工灌装于定制香水瓶中，附上专属配方卡片与养护建议。',
    duration: '1 周',
  },
];

// Site configuration
export const siteConfig: SiteConfig = {
  name: 'Lina',
  title: 'Lina — 独立调香师',
  description: '京都八年，以香为笔，书写时间的故事。',
  url: 'https://lina-perfume.com',
};
