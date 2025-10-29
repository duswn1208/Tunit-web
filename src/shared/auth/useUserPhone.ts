import { useAuth } from './AuthContext';

export function useUserPhone(): string {
  const { user } = useAuth();
  // user 객체에 phone 필드가 있다고 가정, 실제 필드명에 맞게 수정 필요
  // ex) user?.phone 또는 user?.mobile 등
  return (user && (user.phone || user.mobile || user.tel)) || '';
}
