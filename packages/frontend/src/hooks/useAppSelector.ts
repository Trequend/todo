import { useSelector } from 'react-redux';
import { AppState } from 'src/app/store';

export function useAppSelector<TSelected>(
  selector: (state: AppState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) {
  return useSelector(selector, equalityFn);
}
