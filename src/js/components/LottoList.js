import Component from '../abstracts/component';
import LottoImage from '../../../images/lotto.png';

class LottoList extends Component {
  render() {
    const { money, lottoList, lottoListVisibility } = window.store.getState();
    this.innerHTML = this.template(lottoList, lottoListVisibility);

    if (money > 0) {
      this.show();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  template(lottoList, lottoListVisibility) {
    const lottoImages = !lottoListVisibility
      ? `<img src="${LottoImage}" alt="lotto"></img>`.repeat(lottoList.length)
      : '';
    const lists = lottoListVisibility
      ? lottoList
          .map((lottoNums) => `<lotto-item data-lotto-nums="${lottoNums.join(', ')}"></lotto-item>`)
          .join('')
      : '';

    return `
      <div class="lotto-list-container">
        <label class="form-label">총 ${lottoList.length}개를 구매하였습니다.</label>
        <div class="lotto-images">${lottoImages}</div>
        <ul class="lotto-list">${lists}</ul>
      </div>
      <div class="toggle-container">
      <label class="form-label mb-3">번호 보기</label>
      <lotto-list-toggle class="d-flex justify-content-end"></lotto-list-toggle>
      </div>
    `;
  }
}

customElements.define('lotto-list', LottoList);

export default LottoList;
