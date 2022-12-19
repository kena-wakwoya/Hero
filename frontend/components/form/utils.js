export const passwordRules = [
    {
      rule: "Min. 8 characters",
      valid: function (val) {
        const minLengthRegExp = /.{8,}/;
        return minLengthRegExp.test(val);
      },
    },
    {
      rule: "An uppercase letter",
      valid: function (val) {
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        return uppercaseRegExp.test(val);
      },
    },
    {
      rule: "A special character",
      valid: function (val) {
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        return specialCharRegExp.test(val);
      },
    },
    {
      rule: "A number",
      valid: function (val) {
        const digitsRegExp = /(?=.*?[0-9])/;
        return digitsRegExp.test(val);
      },
    },
  ];

  export default passwordRules