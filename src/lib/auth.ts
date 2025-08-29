export type MeResp = {
  authenticated: boolean;
  role: 'TUTOR' | 'STUDENT' | 'NONE';
  onboardingDone?: boolean;
};

export async function getMe(): Promise<MeResp> {
  const res = await fetch('/api/users/auth/me', { credentials: 'include' });
  if (!res.ok) return { authenticated: false, role: 'NONE' };
  return res.json();
}
