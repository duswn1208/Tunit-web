import { useReducer } from 'react';

interface ReservationState {
  showBookingCalendar: boolean;
  selectedDate: string;
  selectedTime: string | undefined;
  selectedLesson: string | undefined;
  requestMessage: string;
}

type ReservationAction =
  | { type: 'TOGGLE_CALENDAR'; payload: boolean }
  | { type: 'SET_DATE_TIME'; payload: { date: string; time: string | undefined } }
  | { type: 'SET_LESSON'; payload: string }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'RESET' };

const initialState: ReservationState = {
  showBookingCalendar: true,
  selectedDate: new Date().toISOString().split('T')[0],
  selectedTime: undefined,
  selectedLesson: undefined,
  requestMessage: '',
};

function reservationReducer(state: ReservationState, action: ReservationAction): ReservationState {
  switch (action.type) {
    case 'TOGGLE_CALENDAR':
      return {
        ...state,
        showBookingCalendar: action.payload,
      };
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
      return initialState;
    default:
      return state;
  }
}

export function useReservationState() {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  return {
    state,
    toggleCalendar: (show: boolean) => dispatch({ type: 'TOGGLE_CALENDAR', payload: show }),
    setDateTime: (date: string, time: string | undefined) =>
      dispatch({ type: 'SET_DATE_TIME', payload: { date, time } }),
    setLesson: (lesson: string) => dispatch({ type: 'SET_LESSON', payload: lesson }),
    setMessage: (message: string) => dispatch({ type: 'SET_MESSAGE', payload: message }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
