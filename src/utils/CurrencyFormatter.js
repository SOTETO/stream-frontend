export default class CurrencyFormatter {
    constructor(currency, value) {
        this.selectedCurrency = currency
        this.value = value
        this.numericValue = this.numeric()
    }

    getNumeric() {
        return this.numericValue
    }

    match() {
        return (this.selectedCurrency === "euro" && this.value.match(CurrencyFormatter.regex.euro)) ||
            (this.selectedCurrency === "dollar" && this.value.match(CurrencyFormatter.regex.dollar))
    }

    numeric() {
        var numeric = 0.00
        var removed = this.value
        if(this.selectedCurrency === "euro" && this.value.match(CurrencyFormatter.regex.euro)) {
            removed = removed.replace(".", "")
            removed = removed.replace(/(\s*€)/g, "")
            removed = removed.replace(",", '.')
            numeric = parseFloat(removed)
        } else if(this.selectedCurrency === "dollar" && this.value.match(CurrencyFormatter.regex.dollar)) {
            removed = removed.replace(",", "")
            removed = removed.replace(/(\s*\$)/g, "")
            removed = removed.replace(/(\$\s*)/g, "")
            numeric = parseFloat(removed)
        }
        return numeric
    }

    localize() {
        var localized = this.value
        if(this.selectedCurrency === "euro" && this.value.match(CurrencyFormatter.regex.euro)) {
            localized = CurrencyFormatter.formatMoney(this.numericValue, 2, ",", ".") + " €"
        } else if(this.selectedCurrency === "dollar" && this.value.match(CurrencyFormatter.regex.dollar)) {
            localized = "$" + CurrencyFormatter.formatMoney(this.numericValue)
        }
        return localized
    }

    static getDefault(currency) {
        return new CurrencyFormatter(currency, CurrencyFormatter.defaults[currency])
    }

    static getFromNumeric(currency, numeric) {
        var localized = CurrencyFormatter.defaults[currency]
        if(currency === "euro") {
            localized = CurrencyFormatter.formatMoney(numeric, 2, ",", ".") + " €"
        } else if(currency === "dollar") {
            localized = "$" + CurrencyFormatter.formatMoney(numeric)
        }
        return new CurrencyFormatter(currency, localized)
    }

    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            // console.log(e)
        }
    }
}

CurrencyFormatter.regex = {
    "euro": /^\d+(\.\d{3})*(,\d{2})?(\s*€)?$/,
    "dollar": /^(\$\s*)?\d+(,\d{3})*(\.\d{2})?(\s*\$)?$/
}

CurrencyFormatter.defaults = {
    "euro": "0,00",
    "dollar": "0.00"
}