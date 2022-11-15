import Decimal from "decimal.js"



export const Types = {
  UInt: {
    formatRegex: /^(0|[1-9]\d*)$/,
    validate: (value) => {
      try {
        const v = new Decimal(value)
        return v.isInteger() && v.isPositive() && !v.isZero()
      } catch (e) {
        return false
      }
    }
  }
}