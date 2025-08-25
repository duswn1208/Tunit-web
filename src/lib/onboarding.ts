import type { Step1, Step2, Step3 } from '../type/onboarding';
import { load } from '../lib/utils';
import { api } from '../lib/api';
import { Region } from '../type/onboarding';

function loadStep1(): Step1 | null {
  return load('onboarding.step1');
}
function loadStep2(): Step2 | null {
  return load('onboarding.step2.tutor');
}

function loadStep3(): Step3 | null {
  return load('onboarding.step3.tutor');
}

const GET_SIDO = '/api/regions';
const GET_SUB_GUGUN = (sidoCode: string) =>
  `/api/regions/${encodeURIComponent(sidoCode)}/subregions`;

// const api = (base?: string) => {
//   const prefix = base ?? '';
//   return {
//     async getSidos(signal?: AbortSignal): Promise<Region[]> {
//       const res = await fetch(`${prefix}/api/regions`, { signal });
//       if (!res.ok) throw new Error('시/도 목록을 가져오지 못했습니다.');
//       const raw = (await res.json()) as Region[];
//       return raw;
//     },
//     async getSubregions(sidoCode: string, signal?: AbortSignal): Promise<Region[]> {
//       const res = await fetch(`${prefix}/api/regions/${encodeURIComponent(sidoCode)}/subregions`, {
//         signal,
//       });
//       if (!res.ok) throw new Error('구/군 목록을 가져오지 못했습니다.');
//       return res.json();
//     },
//     async savaeTutorInfo() {
//       const res = await fetch(`${prefix}/api/tutor/save`, {});
//       if (!res.ok) throw new Error('튜터 정보 저장에 실패했습니다.');
//     },
//   };
// };

export function getSidos<Region>() {
  return api<Region[]>(GET_SIDO);
}

export function getSubregions<Region>(sidoCode: string) {
  return api<Region[]>(GET_SUB_GUGUN(sidoCode));
}

export function savaeTutorInfo() {}
