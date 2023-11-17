var db = require("../db/db");
var common = require("../public/javascripts/common.js")
var crud = require("./crud.js")




const tagModel = {
  getProductListPerDow: async (TagGroupNo) => {
    const query = `SELECT
      DeliveryDow as deliverydow
      ,TagLabel  as taglabel
      ,TagType  as tagtype
      ,Price  as price
      ,SUM(Amount) as totalCount
      ,cm.CodeOrder  as codeorder
    FROM
      Tag t
    LEFT JOIN 
      CodeMst cm ON(cm.CodeLabel=t.TagLabel AND CodeType="ITEM_CATEGORY") 
    WHERE 
      TagGroupNo  = ${TagGroupNo}
    GROUP BY
      DeliveryDow,TagLabel
    ORDER BY
      CodeOrder asc`

    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getProductListPerDow() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  getDeliveryDows: async (TagGroupNo) => {
    const query = `SELECT
    DeliveryDow as deliverydow
      FROM
        Tag t
      LEFT JOIN 
        CodeMst cm ON(cm.CodeLabel=t.DeliveryDow)
      WHERE 
        TagGroupNo  = ${TagGroupNo}
      GROUP BY
        DeliveryDow
      ORDER BY
        CodeOrder asc`

    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getDeliveryDows() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  }
}

module.exports = tagModel