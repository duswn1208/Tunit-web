// Firebase 설정 파일입니다. 아래의 값을 본인의 Firebase 콘솔에서 복사해 입력하세요.
// https://console.firebase.google.com/project/_/settings/general

export const firebaseConfig = {
  apiKey: 'AIzaSyBwyjMAFE4cr6yr-aSCnpCR5GDLkhv6cMs',
  authDomain: 'tunit-54555.firebaseapp.com',
  projectId: 'tunit-54555',
  storageBucket: 'tunit-54555.firebasestorage.app',
  messagingSenderId: '801824674768',
  appId: '1:801824674768:web:d031f5c769e75074a29fd5',
  measurementId: 'G-06PHJ83QCH',
};

// Firebase App 및 Analytics 초기화
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// FCM 관련 import
import { getMessaging, getToken } from 'firebase/messaging';

// 중복 초기화 방지
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics는 브라우저 환경에서만 지원
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      // 연동 테스트용: 앱 이름 출력
      console.log('Firebase App Name:', app);
    }
  });
}

export { app, analytics };

/**
 * FCM 토큰을 요청하는 함수
 * VAPID 키는 Firebase 콘솔 > 프로젝트 설정 > Cloud Messaging > 웹 푸시 인증서에서 확인
 * 사용 예시: requestFcmToken().then(token => console.log(token));
 */
export async function requestFcmToken(): Promise<string | null> {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey:
        'BDotn8p3RPdjrv4Nvs50GaH0SJBjN6KLj6sLeBeIOZnU-TIIT8lccJXZFdlgzIIQS3Rh_hGejfGIsOXh7JKDOnE',
    });
    return token;
  } catch (err) {
    console.error('FCM 토큰 요청 실패:', err);
    return null;
  }
}
