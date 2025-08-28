import type { SelectedRegion, RegionPayload } from '../../type/onboarding';

export function toRegionPayload(selected: SelectedRegion[]): RegionPayload[] {
  const bySido = new Map<string, { all: boolean; guguns: Set<string> }>();

  for (const s of selected) {
    if (s.type === 'sido') {
      bySido.set(s.code, { all: true, guguns: new Set() });
      continue;
    }
    const sido = s.parentCode!;
    if (!bySido.has(sido)) bySido.set(sido, { all: false, guguns: new Set() });
    if (!bySido.get(sido)!.all) bySido.get(sido)!.guguns.add(s.code);
  }

  return Array.from(bySido.entries()).map(([sidoCode, { all, guguns }]) => ({
    sidoCode,
    gugunCodes: all ? [] : Array.from(guguns),
  }));
}
