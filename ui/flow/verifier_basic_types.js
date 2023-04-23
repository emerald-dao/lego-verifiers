import Decimal from "decimal.js"

export const Types = {
  PositiveInt: function () {
    return {
      name: "PositiveInt",
      formatRegex: /^(0|[1-9]\d*)$/,
      validate: function (value) {
        try {
          const v = new Decimal(value)
          return v.isInteger() && v.isPositive() && !v.isZero()
        } catch (e) {
          return false
        }
      }
    }
  },
  Enum: function (options) {
    return {
      name: "Enum",
      options: options,
      validate: function (value) {
        return options.includes(value)
      }
    }
  },
  String: function () {
    return {
      name: "String",
      validate: function (value) {
        return typeof value === 'string' || value instanceof String
      }
    }
  }
}
