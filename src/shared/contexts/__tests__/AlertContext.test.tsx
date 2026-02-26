import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@/test/test-utils';
import { renderHook } from '@testing-library/react';
import { AlertProvider, useAlert } from '../AlertContext';

describe('AlertContext', () => {
  it('Provider 없이 useAlert를 사용하면 에러가 발생한다', () => {
    expect(() => {
      renderHook(() => useAlert());
    }).toThrow('useAlert must be used within an AlertProvider');
  });

  it('showAlert 호출 시 Alert가 렌더링된다', () => {
    function TestComponent() {
      const { showAlert } = useAlert();
      return (
        <button onClick={() => showAlert({ message: '테스트 알림' })}>
          열기
        </button>
      );
    }

    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>,
    );

    act(() => {
      screen.getByText('열기').click();
    });

    expect(screen.getByText('테스트 알림')).toBeInTheDocument();
  });

  it('closeAlert 호출 시 Alert가 닫힌다', () => {
    function TestComponent() {
      const { showAlert, closeAlert } = useAlert();
      return (
        <>
          <button onClick={() => showAlert({ message: '알림 내용' })}>열기</button>
          <button onClick={closeAlert}>닫기</button>
        </>
      );
    }

    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>,
    );

    act(() => {
      screen.getByText('열기').click();
    });
    expect(screen.getByText('알림 내용')).toBeInTheDocument();

    act(() => {
      screen.getByText('닫기').click();
    });
    expect(screen.queryByText('알림 내용')).not.toBeInTheDocument();
  });

  it('title이 있으면 제목을 표시한다', () => {
    function TestComponent() {
      const { showAlert } = useAlert();
      return (
        <button onClick={() => showAlert({ title: '경고', message: '내용' })}>
          열기
        </button>
      );
    }

    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>,
    );

    act(() => {
      screen.getByText('열기').click();
    });

    expect(screen.getByText('경고')).toBeInTheDocument();
    expect(screen.getByText('내용')).toBeInTheDocument();
  });
});
