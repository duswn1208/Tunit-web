import { useParams } from 'react-router-dom';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import type { TutorDetailResponse } from '../types/tutor';
import '../css/tutor-detail.css';

const DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'] as const;

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? '오전' : '오후';
  const hour = hours === 12 ? 12 : hours % 12;

  if (minutes === 0) {
    return `${period} ${hour}시`;
  }
  return `${period} ${hour}시 ${minutes}분`;
}

export default function TutorDetailPage() {
  const { tutorId } = useParams();
  const { data, isLoading, error } = useTutorDetail(tutorId!);

  console.log('Tutor detail data:', data);

  if (isLoading) {
    return (
      <div className="tutor-detail-page min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tutor-detail-page min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">오류 발생</h2>
            <p className="text-gray-600">
              죄송합니다. 튜터 정보를 찾을 수 없습니다. (ID: {tutorId})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-detail-page bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.nickname || '튜터'}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{data.nickname || '튜터'}</h1>
              <div className="text-gray-600 text-lg mb-4 whitespace-pre-wrap">{data.introduce}</div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  경력 {data.careerYears}년
                </span>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  시간당 {data.pricePerHour.toLocaleString()}원
                </span>
                {data.rating && (
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    평점 {data.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 레슨 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">레슨 정보</h2>
            <div className="grid gap-6">
              <div>
                <h3 className="text-gray-700 font-medium mb-2">레슨 과목</h3>
                <div className="flex flex-wrap gap-2">
                  {data.lessonSubcategoryList?.map((lesson) => (
                    <span
                      key={lesson.tutorLessonNo}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${
                        lesson.isMain ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lesson.lessonCategory.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-gray-700 font-medium mb-2">레슨 가능 지역</h3>
                <div className="flex flex-wrap gap-2">
                  {data.regionList?.map((region) => (
                    <span
                      key={region.code}
                      className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm"
                    >
                      {region.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 스케줄 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">레슨 가능 시간</h2>
              <button className="px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm">
                레슨 예약하기
              </button>
            </div>
            <div className="grid gap-2">
              {DAYS_OF_WEEK.map((day, index) => {
                const schedule = data.tutorAvailableTimeList?.find(
                  (time) => Number(time.dayOfWeekNum) === index + 1
                );
                return (
                  <div
                    key={day}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      schedule ? 'bg-gray-50 border-gray-100' : 'bg-gray-50/50 border-gray-100/50'
                    }`}
                  >
                    <span className="font-medium text-gray-700 w-16">{day}요일</span>
                    {schedule ? (
                      <span className="text-gray-600">
                        {formatTime(schedule.startTime)} ~ {formatTime(schedule.endTime)}
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">휴무</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
