import { api } from '../api';
import type { Region } from '../../type/onboarding';

const GET_SIDO = '/api/regions';
const GET_SUB_GUGUN = (sidoCode: string) =>
  `/api/regions/${encodeURIComponent(sidoCode)}/subregions`;

export function getSidos<T extends Region = Region>() {
  return api<T[]>(GET_SIDO);
}

export function getSubregions<T extends Region = Region>(sidoCode: string) {
  return api<T[]>(GET_SUB_GUGUN(sidoCode));
}
