import ACTION from './actions';
import { LOTTO } from '../constants';
import pickUniqueNumbersInRange from '../utils';

const generateLottoList = (money) => {
  const lottoList = [];
  const count = Math.floor(money / 1000);

  for (let i = 0; i < count; i += 1) {
    const { RANGE, COUNT } = LOTTO;
    lottoList.push(pickUniqueNumbersInRange(RANGE.MIN, RANGE.MAX, COUNT));
  }

  return lottoList;
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(state, { type, payload }) {
  const newState = { ...state };

  switch (type) {
    case ACTION.PURCHASE_LOTTO: {
      newState.money = payload;
      newState.lottoList = generateLottoList(payload);

      return newState;
    }
    case ACTION.TOGGLE_LOTTO_LIST:
      newState.lottoListVisibility = payload;

      return newState;
    case ACTION.TOGGLE_RESULT_MODAL:
      newState.resultModalVisibility = payload;

      return newState;
    default:
      return state;
  }
}
