export default class Money {
  constructor() {}

  static getAmount(moneyString) {
    let cents = parseInt(moneyString.replace(/,|\.|€|$|Fr/g , ""))
    if(isNaN(cents)) {
      return 0
    } else {
      return cents
    }
  }

  static getInputString(amount, currency) {
    if ( currency === "EUR") {
      return this.convertDE(amount)
    } else if (currency === "USD") {
      return this.convertEN(amount)
    } else if (currency === "CHF") {
      return this.convertDE(amount)
    }
  }

  static getString(amount, currency) {
    if ( currency === "EUR") {
      return this.convertDE(amount) + " €"
    } else if (currency === "USD") {
      return this.convertEN(amount) + " $"
    } else if (currency === "CHF") {
      return "Fr. " + this.convertDE(amount)
    }

  }
  
  static convertDE(amount) {
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

  static convertEN(amount) {
    let money = amount.toString()
    if (money.length === 1) {
      return "0.0" + money
    } else if ( money.length === 2) {
      return "0." + money 
    } else {
      let euro = money.substring(0, money.length -2)
      let cents = money.substring(money.length -2, money.length)
      return euro.replace(/(\d)(?=(\d{3})+?$)/g, "$1,") + "." + cents 
    }
  }
}
