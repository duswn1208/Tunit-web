import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import FormField from '../FormField';

describe('FormField', () => {
  it('label을 렌더링한다', () => {
    render(
      <FormField label="이름">
        <input />
      </FormField>,
    );
    expect(screen.getByText('이름')).toBeInTheDocument();
  });

  it('required일 때 * 표시를 렌더링한다', () => {
    render(
      <FormField label="이름" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('hint를 렌더링한다', () => {
    render(
      <FormField hint="한글로 입력해주세요">
        <input />
      </FormField>,
    );
    expect(screen.getByText('한글로 입력해주세요')).toBeInTheDocument();
  });

  it('error가 있으면 에러 메시지를 표시하고 hint는 숨긴다', () => {
    render(
      <FormField hint="도움말" error="필수 항목입니다">
        <input />
      </FormField>,
    );
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();
    expect(screen.queryByText('도움말')).not.toBeInTheDocument();
  });

  it('error가 있으면 ui-has-error 클래스가 적용된다', () => {
    const { container } = render(
      <FormField error="에러">
        <input />
      </FormField>,
    );
    expect(container.querySelector('.ui-has-error')).toBeInTheDocument();
  });

  it('children을 렌더링한다', () => {
    render(
      <FormField>
        <input data-testid="input" />
      </FormField>,
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});
