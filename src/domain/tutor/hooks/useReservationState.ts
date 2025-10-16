import { useReducer, useCallback } from 'react';

interface ReservationState {
  selectedDate: string;
  selectedTime: string | undefined;
  selectedLesson: string | undefined;
  requestMessage: string;
}

type ReservationAction =
  | { type: 'SET_DATE_TIME'; payload: { date: string; time: string | undefined } }
  | { type: 'SET_LESSON'; payload: string }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'RESET' };

const getInitialState = (): ReservationState => ({
  selectedDate: new Date().toISOString().split('T')[0],
  selectedTime: undefined,
  selectedLesson: undefined,
  requestMessage: '',
});

function reservationReducer(state: ReservationState, action: ReservationAction): ReservationState {
  switch (action.type) {
    case 'SET_DATE_TIME':
      return {
        ...state,
        selectedDate: action.payload.date,
        selectedTime: action.payload.time,
      };
    case 'SET_LESSON':
      return {
        ...state,
        selectedLesson: action.payload,
      };
    case 'SET_MESSAGE':
      return {
        ...state,
        requestMessage: action.payload,
      };
    case 'RESET':
      return getInitialState();
    default:
      return state;
  }
}

export function useReservationState() {
  const [state, dispatch] = useReducer(reservationReducer, getInitialState());

  const setDateTime = useCallback((date: string, time: string | undefined) => {
    dispatch({ type: 'SET_DATE_TIME', payload: { date, time } });
  }, []);

  const setLesson = useCallback((lesson: string) => {
    dispatch({ type: 'SET_LESSON', payload: lesson });
  }, []);

  const setMessage = useCallback((message: string) => {
    dispatch({ type: 'SET_MESSAGE', payload: message });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    setDateTime,
    setLesson,
    setMessage,
    reset,
  };
}
