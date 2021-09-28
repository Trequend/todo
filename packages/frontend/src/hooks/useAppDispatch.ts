import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
