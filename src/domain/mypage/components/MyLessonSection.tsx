import LessonHistorySection from './LessonHistorySection';

export default function MyLessonSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">레슨 내역</h2>
      <div className="bg-white rounded-lg p-6">
        <LessonHistorySection />
      </div>
    </section>
  );
}
