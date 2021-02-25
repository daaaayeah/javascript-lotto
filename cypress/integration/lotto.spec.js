import { INVALID_PRICE_ERROR } from "../../src/js/constants.js";

describe("lotto 미션 테스트", () => {
  before(() => {
    cy.visit("http://127.0.0.1:5500/");
  });

  it("구입 금액에 1000원 단위가 아닌 금액을 입력하면 경고 메시지를 보여준다.", () => {
    const alertCalled = cy.stub();
    cy.on("window:alert", alertCalled);

    cy.get("#price-input").type("1234");
    cy.get("#price-submit-button")
      .click()
      .then(() => {
        expect(alertCalled.getCall(0)).to.be.calledWith(INVALID_PRICE_ERROR);
      });
  });

  it("구입 금액에 0원을 입력하면 경고 메시지를 보여준다.", () => {
    const alertCalled = cy.stub();
    cy.on("window:alert", alertCalled);

    cy.get("#price-input").type("0");
    cy.get("#price-submit-button")
      .click()
      .then(() => {
        expect(alertCalled.getCall(0)).to.be.calledWith(INVALID_PRICE_ERROR);
      });
  });

  it("구입 금액에 음수을 입력하면 경고 메시지를 보여준다.", () => {
    const alertCalled = cy.stub();
    cy.on("window:alert", alertCalled);

    cy.get("#price-input").type("-1000");
    cy.get("#price-submit-button")
      .click()
      .then(() => {
        expect(alertCalled.getCall(0)).to.be.calledWith(INVALID_PRICE_ERROR);
      });
  });

  it("구입 금액에 아무것도 입력하지 않으면 경고 메시지를 보여준다.", () => {
    const alertCalled = cy.stub();
    cy.on("window:alert", alertCalled);

    cy.get("#price-submit-button")
      .click()
      .then(() => {
        expect(alertCalled.getCall(0)).to.be.calledWith(INVALID_PRICE_ERROR);
      });
  });

  it("확인버튼 클릭시 금액에 맞는 수의 로또를 보여준다.", () => {
    cy.get("#price-input").type("3000");
    cy.get("#price-submit-button").click();
    cy.get("#confirmation").should("be.visible");
    cy.get("#lotto-list-label").should("have.text", "총 3개를 구매하였습니다.");
    cy.get("#lotto-tickets").children().should("have.length", 3);
  });

  it("번호보기가 true이면 로또 번호를 보여준다.", () => {
    cy.get(".switch").click();
    cy.get(".lotto-numbers").each(($winningNumber) => {
      const isNumbers = $winningNumber[0].innerText
        .split(",")
        .every((value) => !isNaN(value.trim()));

      expect(isNumbers).to.be.true;
    });
  });

  it("알맞지 않은 금액을 입력하면 모든 view가 초기화 된다.", () => {
    cy.get("#price-input").type("3");
    cy.get("#price-submit-button").click();
    cy.get("#price-input").should("have.value", "");
    cy.get("#confirmation").should("not.be.visible");
  });

  const rankingList = [0, 0, 0, 0, 0, 0]; // [noPrize, 3, 4, 5, 5+1, 6]
  it("3개의 로또가 몇 등인지 rankingList에 저장한다.", () => {
    const winningNumber = [1, 4, 23, 27, 34, 36];
    const bonusNumber = 17;

    cy.get("#price-input").type("3000{enter}");
    cy.get("#confirmation").should("be.visible");
    cy.get("#lotto-list-label").should("have.text", "총 3개를 구매하였습니다.");
    cy.get("#lotto-tickets").children().should("have.length", 3);
    cy.get(".switch").click();
    cy.get(".lotto-numbers").each(($lottoNumber) => {
      const lottoNumber = $lottoNumber[0].innerText.split(",");

      const matchedNumbers = lottoNumber.filter(
        (num) => winningNumber.indexOf(num) !== -1
      );

      switch (matchedNumbers) {
        case 3:
          rankingList[1]++;
        case 4:
          rankingList[2]++;
        case 5:
          if (lottoNumber.includes(bonusNumber)) {
            rankingList[4]++;
          }
          rankingList[3]++;
        case 6:
          rankingList[5]++;
        default:
          rankingList[0]++;
      }
    });
  });

  it("지난 주 당첨번호를 입력한다.", () => {
    cy.get("input[name='winning-number']:nth-child(1)").type(1);
    cy.get("input[name='winning-number']:nth-child(2)").type(4);
    cy.get("input[name='winning-number']:nth-child(3)").type(23);
    cy.get("input[name='winning-number']:nth-child(4)").type(27);
    cy.get("input[name='winning-number']:nth-child(5)").type(34);
    cy.get("input[name='winning-number']:nth-child(6)").type(36);
    cy.get("input[name='bonus-number']:nth-child(1)").type(17);
  });

  it("결과 모달에 알맞은 당첨 갯수가 띄워지는지 확인한다.", () => {
    cy.get("#open-result-modal-button")
      .click()
      .then(() => {
        cy.get("#prize-table > tr:nth-child(1) > td:nth-child(3)").should(
          "have.text",
          `${rankingList[1]}개`
        );
        cy.get("#prize-table > tr:nth-child(2) > td:nth-child(3)").should(
          "have.text",
          `${rankingList[2]}개`
        );
        cy.get("#prize-table > tr:nth-child(3) > td:nth-child(3)").should(
          "have.text",
          `${rankingList[3]}개`
        );
        cy.get("#prize-table > tr:nth-child(4) > td:nth-child(3)").should(
          "have.text",
          `${rankingList[4]}개`
        );
        cy.get("#prize-table > tr:nth-child(5) > td:nth-child(3)").should(
          "have.text",
          `${rankingList[5]}개`
        );
      });
  });

  it("알맞은 수익률이 띄워지는지 확인한다.", () => {
    cy.get("#earning-rate").should(
      "have.text",
      `당신의 총 수익률은 ${
        (rankingList[1] * 5000 +
          rankingList[2] * 50000 +
          rankingList[3] * 1500000 +
          rankingList[4] * 30000000 +
          rankingList[5] * 2000000000) /
        3000
      }%입니다.`
    );
  });

  it("다시 시작 버튼을 눌렀을 때 모든 뷰가 초기화 되는지 확인한다.", () => {
    cy.get("#restart-button").click();
    cy.get("#price-input").should("have.value", "");
    cy.get("#confirmation").should("not.be.visible");
  });
});
