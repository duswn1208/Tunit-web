import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
}

const sizeMap = {
  small: '20px',
  medium: '28px',
  large: '36px',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'medium',
  readonly = false,
}) => {
  const starSize = sizeMap[size];

  const handleStarClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2, 3, 4].map((index) => (
        <svg
          key={index}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={index < rating ? '#FFD700' : '#E0E0E0'}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            transition: 'fill 0.2s',
          }}
          onClick={() => handleStarClick(index)}
          onMouseEnter={(e) => {
            if (!readonly) {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!readonly) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};
