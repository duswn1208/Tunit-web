import { useState } from 'react';

export default function QnARegisterModal({
  onSave,
  onClose,
}: {
  onSave: (data: { title: string; content: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ title: '', content: '' });

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
        <h2 className="text-lg font-bold mb-4">QnA 등록</h2>
        <div className="mb-2">
          <label className="block text-sm mb-1">제목</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
            취소
          </button>
          <button type="submit" className="px-3 py-1 rounded bg-blue-500 text-white">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
