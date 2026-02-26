import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@/test/test-utils';
import { renderHook } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

describe('ToastContext', () => {
  it('Provider 없이 useToast를 사용하면 에러가 발생한다', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
  });

  it('showToast 호출 시 Toast가 렌더링된다', () => {
    function TestComponent() {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('저장되었습니다', 'success')}>
          토스트
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText('토스트').click();
    });

    expect(screen.getByText('저장되었습니다')).toBeInTheDocument();
  });

  it('Toast에 role="alert"이 설정된다', () => {
    function TestComponent() {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('알림 메시지')}>
          토스트
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText('토스트').click();
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
