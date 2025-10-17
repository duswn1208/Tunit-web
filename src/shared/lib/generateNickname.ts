const adjectives = [
  '졸린',
  '즐거운',
  '열정적인',
  '행복한',
  '슬기로운',
  '귀여운',
  '멋진',
  '똑똑한',
  '친절한',
  '착한',
  '신나는',
  '활기찬',
  '따뜻한',
  '시원한',
  '달콤한',
  '재미있는',
  '상냥한',
  '부지런한',
  '센스있는',
  '유쾌한',
];

const nouns = [
  '고양이',
  '강아지',
  '토끼',
  '판다',
  '코알라',
  '펭귄',
  '기린',
  '여우',
  '늑대',
  '곰',
  '다람쥐',
  '호랑이',
  '사자',
  '코끼리',
  '앵무새',
  '돌고래',
  '거북이',
  '햄스터',
  '수달',
  '알파카',
];

export function generateRandomNickname(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}
