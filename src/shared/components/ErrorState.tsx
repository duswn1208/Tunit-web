import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
}

export default function ErrorState({
  title = '오류 발생',
  message = '죄송합니다. 요청하신 정보를 찾을 수 없습니다.',
  details,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      {details && <p className="error-details">{details}</p>}
    </div>
  );
}
