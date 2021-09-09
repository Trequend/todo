import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
