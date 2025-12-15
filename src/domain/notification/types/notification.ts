export interface Notification {
  notifyNo: number;
  title: string;
  message: string;
  createdAt: string;
  status: 'READ' | 'PENDING' | 'SENT';
  deepLink?: string;
}
