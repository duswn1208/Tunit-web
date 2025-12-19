import { useState } from 'react';

export default function TutorProfileEditModal({
  profile,
  onSave,
  onClose,
}: {
  profile: any;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: profile.name || '',
    nickname: profile.nickname || '',
    introduce: profile.tutorProfile?.introduce || '',
    careerYears: profile.tutorProfile?.careerYears || '',
    pricePerHour: profile.tutorProfile?.pricePerHour || '',
    durationMin: profile.tutorProfile?.durationMin || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">프로필 정보 수정</h2>
        <div className="mb-2">
          <label className="block text-sm mb-1">이름</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">닉네임</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">경력(년)</label>
          <input
            name="careerYears"
            value={form.careerYears}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">단가</label>
          <input
            name="pricePerHour"
            value={form.pricePerHour}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">단가 단위(회/시간 등)</label>
          <input
            name="durationMin"
            value={form.durationMin}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">소개</label>
          <textarea
            name="introduce"
            value={form.introduce}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
            취소
          </button>
          <button type="submit" className="px-3 py-1 rounded bg-blue-500 text-white">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
