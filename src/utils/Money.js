export default class Money {
  constructor() {}
  static getAmount(moneyString) {
    let cents = parseInt(moneyString.replace(/,|\.|€/g , ""))
    if(isNaN(cents)) {
      return 0
    } else {
      return cents
    }
  }

  static getString(amount, currency) {
    if ( currency === "EUR") {
     return this.convertEuro(amount)
    } 
  }
  static convertEuro(amount) {
    let money = amount.toString()
    if (money.length === 1) {
      return "0,0" + money
    } else if ( money.length === 2) {
      return "0," + money 
    } else {
      let euro = money.substring(0, money.length -2)
      let cents = money.substring(money.length -2, money.length)
      return euro.replace(/(\d)(?=(\d{3})+?$)/g, "$1.") + "," + cents 
    }

  }
}
