import ACTION from '../flux/actions';
import createAction from '../flux/actionCreator';
import Component from '../abstracts/component';

class LottoListToggle extends Component {
  render() {
    const { lottoListVisibility } = window.store.getState();
    const checked = lottoListVisibility ? 'checked' : '';
    this.innerHTML = this.template(checked);
  }

  template(checked) {
    return `
      <label class="switch" for="checkbox">
        <input id="checkbox" type="checkbox" ${checked} />
        <div class="slider round"></div>
      </label>
    `;
  }

  setEvent() {
    this.addEvent('click', 'input', (event) => {
      window.store.dispatch(createAction(ACTION.TOGGLE_LOTTO_LIST, event.target.checked));
    });
  }
}

customElements.define('lotto-list-toggle', LottoListToggle);

export default LottoListToggle;
