interface CategoryIcon {
  icon: string;
  label: string;
}

export const categoryIcons: Record<string, CategoryIcon> = {
  MUSIC: {
    icon: '🎵',
    label: '음악',
  },
  INSTRUMENT: {
    icon: '🎸',
    label: '악기',
  },
  VOCAL: {
    icon: '🎤',
    label: '보컬',
  },
  EXERCISE: {
    icon: '💪',
    label: '운동',
  },
  SPORTS: {
    icon: '⚽',
    label: '스포츠',
  },
  STUDY: {
    icon: '📚',
    label: '학습',
  },
  ACADEMIC: {
    icon: '✏️',
    label: '학업',
  },
  LANGUAGE: {
    icon: '🗣️',
    label: '언어',
  },
  PROGRAMMING: {
    icon: '💻',
    label: '코딩',
  },
  ART: {
    icon: '🎨',
    label: '미술',
  },
  DANCE: {
    icon: '💃',
    label: '춤',
  },
  COOKING: {
    icon: '👨‍🍳',
    label: '요리',
  },
  HOBBY: {
    icon: '🎯',
    label: '취미',
  },
  BUSINESS: {
    icon: '💼',
    label: '비즈니스',
  },
  CRAFTS: {
    icon: '🛠️',
    label: '공예',
  },
  ETC: {
    icon: '✨',
    label: '기타',
  },
};
