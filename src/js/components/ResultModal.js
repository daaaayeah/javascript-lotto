import ACTION from '../flux/actions';
import createAction from '../flux/actionCreator';
import Component from '../abstracts/component';
import { PRIZE_MONEY } from '../constants';
import CloseImage from '../../../images/close.png';

class ResultModal extends Component {
  render() {
    const { resultModalVisibility, result } = window.store.getState();
    this.innerHTML = this.template(result);

    if (!resultModalVisibility) {
      this.hide();

      return;
    }
    this.show();
  }

  // eslint-disable-next-line max-lines-per-function
  template(result) {
    return `
      <article>
        <img src="${CloseImage}" class="close"></img>
        <h3>🏆 당첨 통계 🏆</h3>
        <table>
          <thead>
            <tr>
              <th>일치 개수</th>
              <th>당첨금</th>
              <th>당첨 개수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3개</td>
              <td>${PRIZE_MONEY.FIFTH.toLocaleString()}</td>
              <td>${result.winningCounts.fifth}개</td>
            </tr>
            <tr>
              <td>4개</td>
              <td>${PRIZE_MONEY.FOURTH.toLocaleString()}</td>
              <td>${result.winningCounts.fourth}개</td>
            </tr>
            <tr>
              <td>5개</td>
              <td>${PRIZE_MONEY.THIRD.toLocaleString()}</td>
              <td>${result.winningCounts.third}개</td>
            </tr>
            <tr>
              <td>5개+보너스볼</td>
              <td>${PRIZE_MONEY.SECOND.toLocaleString()}</td>
              <td>${result.winningCounts.second}개</td>
            </tr>
            <tr>
              <td>6개</td>
              <td>${PRIZE_MONEY.FIRST.toLocaleString()}</td>
              <td>${result.winningCounts.first}개</td>
            </tr>
          </tbody>
        </table>
        <label>당신의 총 수익률은 ${result.earningsRate}%입니다.</label>
        <button class="restart">다시 시작하기</button>
      </article>
    `;
  }

  setEvent() {
    this.addEvent('click', '.close', (event) => {
      event.preventDefault();
      window.store.dispatch(createAction(ACTION.TOGGLE_RESULT_MODAL, false));
    });

    this.addEvent('click', '.restart', (event) => {
      event.preventDefault();
      window.store.dispatch(createAction(ACTION.RESTART, null));
    });
  }
}

customElements.define('result-modal', ResultModal);

export default ResultModal;
