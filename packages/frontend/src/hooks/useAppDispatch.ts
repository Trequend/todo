import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
