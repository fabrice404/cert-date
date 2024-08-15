const { getExpirationDate, getHosts } = require('./index');

describe("index", () => {
  describe("getExpirationDate", () => {
    it("should start a TLS connection and return the certificate expiration date", async () => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      const result = await getExpirationDate("budget.lamant.io", 443);
      console.log(result);
    }, 10000);
  });
});
