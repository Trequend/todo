import { useSelector } from 'react-redux';
import { AppState } from '../app/store';

export default function useUser() {
  return useSelector((state: AppState) => state.user.data);
}
