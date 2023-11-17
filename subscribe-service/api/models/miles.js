var db = require("../db/db");
var common = require("../public/javascripts/common.js")
var crud = require("./crud.js")


const miles = {
  useMiles: async (res, userNo, subsNo, milesPrice, orderNo = null, eventType = null, payemntHistoryNo = null) => {
    const now = new Date();
    // const ExpiryDate = common.jsDateToMysqlDateTime(new Date(now.setFullYear(now.getFullYear() + 1)));
    const milesEventInfo = {
      UserNo: userNo,
      SubsNo: subsNo,
      Amount: milesPrice,
      StatusCode: "사용",
      OrderNo: orderNo ? orderNo : 0,
      EventType: eventType ? eventType : 0,
      PamenHistoryNo: payemntHistoryNo ? payemntHistoryNo : 0
      // ExpiryDate: ExpiryDate
    }
    console.log("usemiles functioning...", milesEventInfo)
    const { status: milesEventstatus, rows: milesEventRows } = await crud.createDataRow('MilesEventMst', milesEventInfo)
    if (milesEventstatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to create mielsEvent at billingSubscribe()" });
    }
    // return { milesEventNo: milesEventRows.insertId, expiryDate: ExpiryDate }
    return { milesEventNo: milesEventRows.insertId }
  },
  expireMiles: async (res, userNo, milesPrice) => {
    const now = new Date();
    const ExpiryDate = common.jsDateToMysqlDateTime(new Date(now.setFullYear(now.getFullYear() + 1)));
    const milesEventInfo = {
      UserNo: userNo,
      Amount: milesPrice,
      StatusCode: "만료",
      ExpiryDate: ExpiryDate
    }
    const { status: milesEventstatus, rows: milesEventRows } = await crud.createDataRow('MilesEventMst', milesEventInfo)
    if (milesEventstatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to expire miles at expireMiles()" });
    }
    return { milesEventNo: milesEventRows.insertId, expiryDate: ExpiryDate }
  },
  handleMilesDetails: async (milesEventNo, milesPrice, userNo, subsNo, StatusCode, orderNo, impUid = null) => {
    const query = `
            SELECT 
            MilesDetailNo,
            SUM(mdm.Amount) as TotalAmount
          FROM 
            MilesDetailMst mdm
          WHERE 
            UserNo = ${userNo}
          GROUP BY
          UsageNo 
        
      ;
    `
    try {
      const [rows] = await db.query(query);
      console.log('rows', rows)
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let amount = 0;
        const cancelNo = `(SELECT 
          MAX(MilesDetailNo) + 1 as MAXNO
          FROM MilesDetailMst mdm) `
        const totalAmount = parseInt(row.TotalAmount)

        if (totalAmount <= milesPrice) {
          amount = -totalAmount;
          milesPrice = milesPrice - totalAmount;
          if (parseInt(row.Amount) !== 0) {
            const query = `INSERT INTO MilesDetailMst (
            Amount,
            StatusCode,
            UsageNo,
            CancelNo,
            MilesEvtNo,
            UserNo,
            SubsNo,
            OrderNo,
            ImpUid
          ) VALUES(
            "${amount}",
            "${StatusCode}",
            "${row.MilesDetailNo}",
            ${cancelNo},
            "${milesEventNo}",
            "${userNo}",
            ${subsNo != null ? `"${subsNo}"` : null},
            ${orderNo != null ? `"${orderNo}"` : null},
            ${impUid != null ? `"${impUid}"` : null}
          )`
            console.log('miles query', query);
            try {
              await db.query(query);
            } catch (error) {
              console.log('error', error)
              console.error(`Error Occured from handleMilesDetails() function : \r`, error.sqlMessage)
              return { status: -1, error: error.sqlMessage }
            }
          }
        } else {
          amount = -milesPrice;
          console.log('hereeee', amount)
          const query = `INSERT INTO MilesDetailMst (
            Amount,
            StatusCode,
            UsageNo,
            CancelNo,
            MilesEvtNo,
            UserNo,
            SubsNo,
            OrderNo,
            ImpUid
          ) VALUES(
            "${amount}",
            "${StatusCode}",
            "${row.MilesDetailNo}",
            ${cancelNo},
            "${milesEventNo}",
            "${userNo}",
            ${subsNo != null ? `"${subsNo}"` : null},
            ${orderNo != null ? `"${orderNo}"` : null},
            ${impUid != null ? `"${impUid}"` : null}
          )`
          console.log('miles query', query);
          try {
            await db.query(query);
          } catch (error) {
            console.log('error', error)
            console.error(`Error Occured from handleMilesDetails() function : \r`, error.sqlMessage)
            return { status: -1, error: error.sqlMessage }
          }
          break;
        }
      }
      return { status: 1 }

    } catch (error) {
      console.error(`Error Occured from handleMilesDetails() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },

  addMiles: async (milesEventNo, amount, userNo, orderNo = null) => {
    try {
      const maxNo = `(SELECT 
          MAX(MilesDetailNo) + 1 as MAXNO
          FROM MilesDetailMst mdm) `

      const query = `INSERT INTO MilesDetailMst (
            Amount,
            StatusCode,
            UsageNo,
            CancelNo,
            MilesEvtNo,
            UserNo,
            OrderNo
          ) VALUES(
            "${amount}",
            "적립",
            ${maxNo},
            ${maxNo},
            "${milesEventNo}",
            "${userNo}",
            ${orderNo ? `${orderNo}` : null}
          )`
      try {
        const [rows] = await db.query(query);
        return { status: 1, rows: rows }
      } catch (error) {
        console.error(`Error Occured from handleMilesDetails() function : \r`, error.sqlMessage)
        return { status: -1, error: error.sqlMessage }
      }

    } catch (error) {
      console.error(`Error Occured from handleMilesDetails() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  getMiles: async (req, res, userNo) => {
    const query = `SELECT 
                  SUM(Amount) as RemainMiles
                  FROM 
                    MilesDetailMst mdm
                  WHERE 
                    UserNo = ${userNo}
                `;
    try {
      const [rows] = await db.query(query);
      return { status: "exist", data: rows[0].RemainMiles };
    } catch (error) {
      return { status: -1, error: error.sqlMessage }
    }

  }

}

module.exports = miles