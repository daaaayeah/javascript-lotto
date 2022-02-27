import ACTION from '../flux/actions';
import createAction from '../flux/actionCreator';
import Component from '../abstracts/component';
import { validateWinningNumbers } from '../validation/validators';
import ValidationError from '../validation/validation-error';

class WinningNumberForm extends Component {
  render() {
    this.innerHTML = this.template();
    const { money } = window.store.getState();

    if (money > 0) {
      this.show();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  template() {
    return `
      <form>
        <label>지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.</label>
        <div class="wrapper">
          <fieldset>
            <label>당첨 번호</label>
            <div class="d-flex">
              <input class="form-control" maxlength="2"/>
              <input class="form-control" maxlength="2"/>
              <input class="form-control" maxlength="2"/>
              <input class="form-control" maxlength="2"/>
              <input class="form-control" maxlength="2"/>
              <input class="form-control" maxlength="2"/>
            </div>
          </fieldset>
          <fieldset class="bonus-number-container">
            <label>보너스 번호</label>
            <input class="form-control" maxlength="2"/>
          </fieldset>
        </div>
        <button class="btn btn-cyan w-100">결과 확인하기</button>
      </form>
    `;
  }

  setEvent() {
    this.addEvent('submit', 'form', (event) => {
      event.preventDefault();
      const $winningNumberInputs = [...this.querySelectorAll('input')];
      const winningNumbers = $winningNumberInputs.map((input) => input.value);

      try {
        this.pickLottoNumbers(winningNumbers);
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    });
  }

  pickLottoNumbers(winningNumbers) {
    const { hasError, errorMessage } = validateWinningNumbers(winningNumbers);

    if (hasError) {
      throw new ValidationError(errorMessage);
    }

    window.store.dispatch(createAction(ACTION.SET_WINNING_NUMBERS, winningNumbers));
  }
}

customElements.define('winning-number-form', WinningNumberForm);

export default WinningNumberForm;
