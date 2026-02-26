import { describe, it, expect } from 'vitest';
import { generateRandomNickname } from '../generateNickname';

const adjectives = [
  '졸린', '즐거운', '열정적인', '행복한', '슬기로운', '귀여운', '멋진', '똑똑한',
  '친절한', '착한', '신나는', '활기찬', '따뜻한', '시원한', '달콤한', '재미있는',
  '상냥한', '부지런한', '센스있는', '유쾌한',
];

const nouns = [
  '고양이', '강아지', '토끼', '판다', '코알라', '펭귄', '기린', '여우',
  '늑대', '곰', '다람쥐', '호랑이', '사자', '코끼리', '앵무새', '돌고래',
  '거북이', '햄스터', '수달', '알파카',
];

describe('generateRandomNickname', () => {
  it('공백으로 구분된 2단어 형식의 문자열을 반환한다', () => {
    const nickname = generateRandomNickname();
    const parts = nickname.split(' ');
    expect(parts).toHaveLength(2);
  });

  it('형용사 + 동물 조합으로 구성된다', () => {
    const nickname = generateRandomNickname();
    const [adj, noun] = nickname.split(' ');
    expect(adjectives).toContain(adj);
    expect(nouns).toContain(noun);
  });

  it('여러 번 호출해도 항상 유효한 닉네임을 반환한다', () => {
    for (let i = 0; i < 50; i++) {
      const nickname = generateRandomNickname();
      const [adj, noun] = nickname.split(' ');
      expect(adjectives).toContain(adj);
      expect(nouns).toContain(noun);
    }
  });
});
