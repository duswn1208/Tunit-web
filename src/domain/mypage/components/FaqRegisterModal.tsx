import { useEffect, useState } from 'react';

export default function FaqRegisterModal({
  openType,
  faqData,
  onSave,
  onClose,
}: {
  openType: 'create' | 'edit';
  faqData?: { title: string; content: string; exposed: boolean };
  onSave: (
    data: { title: string; content: string; exposed: boolean },
    type: 'create' | 'edit'
  ) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ title: '', content: '', exposed: true });

  useEffect(() => {
    if (openType === 'edit' && faqData) {
      setForm(faqData);
    }
  }, [openType, faqData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, openType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">
          자주묻는질문 {openType === 'create' ? '등록' : '수정'}
        </h2>
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
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="exposed"
              checked={form.exposed}
              onChange={handleChange}
              className="mr-2"
            />
            노출 여부
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {openType === 'create' ? '등록' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
