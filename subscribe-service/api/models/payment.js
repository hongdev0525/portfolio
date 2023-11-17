var db = require("../db/db");
var common = require("../public/javascripts/common.js")
var crud = require("./crud.js")




const payment = {
  getMaxPaymentHistoryOfSubscribe: async (subsNo) => {
    const query = `
    SELECT 
        *
    FROM 
        PaymentHistory tb
        WHERE 1=1  
        AND SubsNo =${subsNo}
        AND PaymentStatus = "paid" 
        AND historyNo = (
        	SELECT 
        		MAX(historyNo) 
        	FROM PaymentHistory 
        	WHERE 
        		PaymentStatus = 'paid' 
        		AND SubsNo = ${subsNo} 
        		AND (PaymentType ="구독" OR PaymentType ="구독변경")
        		);
                  `
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getProductListPerDow() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  getPaymentHistoryOfSubscribe: async (subsNo) => {
    const query = `
    SELECT
    *
    FROM
    PaymentHistory ph1
    WHERE
    ph1.PaymentType IN ('구독', '구독변경')
    AND historyNo = (
    SELECT
      MAX(ph2.historyNo)
    FROM
      PaymentHistory ph2
    WHERE
      ph2.PaymentType IN ('구독', '구독변경')
        AND PaymentStatus = "paid"
        AND ph2.SubsNo = ${subsNo}
    )
                  `
    //               OR (PaymentType = '수량변경'
    //   AND historyNo = (
    //   SELECT
    //     MAX(ph3.historyNo)
    //   FROM
    //     PaymentHistory ph3
    //   WHERE
    //     ph3.PaymentType = '수량변경'
    //     AND PaymentStatus = "paid"
    //     AND ph3.SubsNo = ${subsNo}
    // ))
    console.log('query', query);
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getProductListPerDow() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },

}

module.exports = payment