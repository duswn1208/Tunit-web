export type FailList = {
  name: string;
  phone: string;
  memo: string;
  reason: string;
};

export type FailResult = {
  failCount: number;
  failList: FailList[];
};
