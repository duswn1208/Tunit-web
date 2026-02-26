import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('children을 렌더링한다', () => {
    render(<Button>클릭</Button>);
    expect(screen.getByText('클릭')).toBeInTheDocument();
  });

  it('loading 상태에서 "처리 중…"을 표시하고 disabled 처리된다', () => {
    render(<Button loading>저장</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('처리 중…');
    expect(button).toBeDisabled();
  });

  it('loading 상태에서 aria-busy가 설정된다', () => {
    render(<Button loading>저장</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('disabled prop이 동작한다', () => {
    render(<Button disabled>클릭</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('onClick 핸들러가 호출된다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 onClick이 호출되지 않는다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>클릭</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('tooltip이 있으면 tooltip 텍스트가 렌더링된다', () => {
    render(<Button tooltip="도움말">클릭</Button>);
    expect(screen.getByText('도움말')).toBeInTheDocument();
  });
});
