var db = require("../db/db");
var common = require("../public/javascripts/common.js")
var crud = require("./crud.js")


const order = {
  generateNewOrderBulk: async (subcirbeInfo, userNo, addressInfo, tagGroupNo, deliverer) => {

    let tagList = [];
    const query = `SELECT 
      ta.Product as Product
      ,ta.DeliveryDow
      ,IF(Amount >=2, ta.Price - 1000, ta.Price) as Price
      ,ta.CodeValue
    FROM (
      SELECT 
        GROUP_CONCAT(TagLabel,"-",Amount ORDER BY TagLabel) as Product 
        ,t.DeliveryDow
        ,SUM(t.Amount) as Amount
        ,SUM(Price) as Price
        ,cm2.CodeValue 
        FROM Tag t
        INNER JOIN CodeMst cm on t.TagType  = cm.Codekey  
        INNER JOIN CodeMst cm2 on t.DeliveryDow  = cm2.CodeLabel 
        WHERE t.TagGroupNo = ${tagGroupNo}
        GROUP BY t.DeliveryDow 
        ORDER BY  product desc
    ) as ta`


    try {
      const [rows] = await db.query(query);
      tagList = rows
    } catch (error) {
      console.error(`Error Occured from generateNewOrderBulk() function : \r`, error.sqlMessage)
    }

    const deliverStartDate = common.jsDateToMysqlDateTime(subcirbeInfo.DeliveryStartDate);
    for (let i = 0; i < subcirbeInfo.Period; i++) {
      for (let n = 0; n < tagList.length; n++) {
        const tag = tagList[n];

        const deliveryDateQuery =
          `(SELECT 
              IF(
                hm.Locdate IS NOT NULL
                ,DATE_ADD( '${deliverStartDate}' , INTERVAL (7  * (${i} + IF(${subcirbeInfo.Period}=1 ,${subcirbeInfo.Period} +1,${subcirbeInfo.Period})) + ${tag.CodeValue} - Weekday('${deliverStartDate}')) DAY)
                ,dt.DeliveryStartDate
              )
            FROM
            (
              SELECT
                DATE_ADD(
                  '${deliverStartDate}'
                  ,INTERVAL 
                    IF(
                    ${i} = 0 AND  ${tag.CodeValue}< Weekday('${deliverStartDate}')  
                    ,(7  * (${i} + ${subcirbeInfo.Period}) + ${tag.CodeValue} - Weekday('${deliverStartDate}'))
                    ,(7  * ${i} + ${tag.CodeValue} - Weekday('${deliverStartDate}'))
                    )
                  DAY
                ) as DeliveryStartDate
            ) dt
            LEFT JOIN
              HoliydayMst hm ON(hm.Locdate = dt.DeliveryStartDate))`
        const statusCode = "기존주문";
        const query = `INSERT INTO OrderMst (
          UserNo,
          Period,
          TagGroupNo,
          SubsNo,
          StatusCode,
          DeliveryStartDate,
          Address,
          ApartmentName,
          ApartmentBuilding,
          ApartmentUnit,
          RcvName,
          ContactNo,
          OrderRound,
          Product,
          DeliveryDow,
          DeliveryDate,
          OrderPrice,
          OrderType,
          Driver,
          Flex

        ) VALUES (
          "${userNo}",
          "${subcirbeInfo.Period}",
          "${tagGroupNo}",
          "${subcirbeInfo.SubsNo}",
          "${statusCode}",
          "${deliverStartDate}",
          "${addressInfo.Address}",
          "${addressInfo.ApartmentName}",
          "${addressInfo.ApartmentBuilding}",
          "${addressInfo.ApartmentUnit}",
          "${addressInfo.RcvName}",
          "${addressInfo.ContactNo}",
          "${subcirbeInfo.SubsRounds}",
          "${tag.Product}",
          "${tag.DeliveryDow}",
          ${deliveryDateQuery},
          "${tag.Price}",
          "${subcirbeInfo.SubsType}",
          "${deliverer.Driver}",
          "${deliverer.Flex}"
        )`;
        try {
          await db.query(query);
        } catch (error) {
          console.error(`Error Occured from createDataRow() function : \r`, error.sqlMessage)
          return { status: -1, error: error.sqlMessage }
        }

      }

    }
    return { status: 1 }

  },
  menuOfDeliveryDate: async (deliveryDate) => {
    const query =
      `SELECT 
      b.BundleNo
      ,b.BundleType
      ,b.DeliveryDate 
      ,(SELECT
          GROUP_CONCAT(DpName) 
        FROM 
          BundleItem bi 
        LEFT JOIN
          ItemMst im ON(im.ItemNo = bi.ItemNo AND im.StatusCode="normal")
        LEFT JOIN
          BundleMst bm ON(bm.BundleNo=bi.BundleNo)
        WHERE 
          bi.BundleNo = b.BundleNo) as Product
    FROM 
      BundleMst b 
    LEFT JOIN
      CodeMst cm on(b.BundleType = cm.CodeLabel AND CodeType="ITEM_CATEGORY")
    WHERE 
      StatusCode = "normal"
      AND
      DeliveryDate = "${deliveryDate}"
    ORDER BY
      DeliveryDate asc , cm.CodeOrder asc
    `
    try {
      console.log('query', query)
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from createDataRow() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  getMaxDeliveryDate: async (subsNo, date) => {
    const query =
      `SELECT 
    MAX(DeliveryDate) as MaxDeliveryDate
  FROM 
    OrderMst om 
  WHERE 
    SubsNo  = ${subsNo}
      AND
    StatusCode = "기존주문"
      AND
    DAYOFWEEK(DeliveryDate) = DAYOFWEEK("${date}")
    
  `
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getMaxDeliveryDate() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  getMinDeliveryDate: async (subsNo) => {
    const query =
      `SELECT 
    Min(DeliveryDate) as MinDeliveryDate
  FROM 
    OrderMst om 
  WHERE 
    SubsNo  = ${subsNo}
      AND
    StatusCode = "기존주문"
    AND
    DeliveryDate <= DATE_ADD(NOW(), INTERVAL 2 DAY)
    
  `
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from getMaxDeliveryDate() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  orderForSubscribeChange: async (subsNo, refundType) => {
    const query =
      `SELECT 
          OrderPrice,
          Product,
          StatusCode,
          DeliveryDate
        FROM 
          OrderMst om 
        WHERE 
        SubsNo =${subsNo} 
        ${refundType === "change" ?
        'AND  ( StatusCode ="배송완료" OR (TagGroupNo  !=0  AND StatusCode ="기존주문" ))'
        :
        'AND  ( StatusCode ="배송완료" OR StatusCode ="기존주문" ) '}
`
    console.log('query2323', query)
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from orderForSubscribeChange() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  //기존 기존주문 주문의 상태를 업데이트
  // 1. 기존주문 - TagGroupNo !=0, StatusCode = "기존주문"
  // 2. 쉬어가기 - TagGroupNo != 0, StatusCode = "쉬어가기"
  // 3. 수량변경 - TagGroupNo != 0, StatusCode = "수량변경"
  orderUpdateForSubscribeChange: async (subsNo) => {
    const query = `UPDATE  
      OrderMst
      SET StatusCode="구독변경"
      WHERE 
        SubsNo=${subsNo}
        AND ((StatusCode = "기존주문" AND TagGroupNo != 0) OR (StatusCode = "쉬어가기"))
        AND Deliverydate >= IF(TIME(NOW()) < '16:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY))
  `;
    // AND DeliveryDate >= DATE_ADD(NOW(), INTERVAL 2 DAY);

    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows };
    } catch (error) {
      return { status: -1, error: error.sqlMessage }
    }

  },
  orderUpdateForSubscribeCancel: async (subsNo) => {
    const query = `UPDATE  
      OrderMst
      SET StatusCode="구독해지"
      WHERE 
        SubsNo=${subsNo}
        AND ((StatusCode = "기존주문") OR (StatusCode = "쉬어가기"))
        AND Deliverydate >= IF(TIME(NOW()) < '16:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY))
  `;
    // AND ((StatusCode = "기존주문" AND TagGroupNo != 0) OR (StatusCode = "쉬어가기"))

    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows };
    } catch (error) {
      return { status: -1, error: error.sqlMessage }
    }

  },
  orderAddressUpdate: async (subsNo, addressInfo) => {
    const query = `UPDATE  
      OrderMst
      SET 
        Address = "${addressInfo.Address}",
        ApartmentName = "${addressInfo.ApartmentName}",
        ApartmentBuilding = "${addressInfo.ApartmentBuilding}",
        ApartmentUnit = "${addressInfo.ApartmentUnit}",
        RcvName = "${addressInfo.RcvName}",
        ContactNo = "${addressInfo.ContactNo}"
      WHERE 
        SubsNo=${subsNo}
        AND DeliveryDate >= DATE_ADD(NOW(), INTERVAL 2 DAY);
  `;
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows };
    } catch (error) {
      console.log('error', error);
      return { status: -1, error: error.sqlMessage }
    }

  },
  changedOrderForSubscribeCancel: async (subsNo) => {
    const query =
      `SELECT 
      tb.*
      ,ph.Price
      ,mem.Amount
      ,(IFNULL(ph.Price,0) + IFNULL(mem.Amount ,0)) as RefundMilesAmount
      
      FROM 
        OrderMst tb
      LEFT JOIN
      PaymentHistory ph ON (tb.OrderNo = ph.OrderNo)
      LEFT JOIN 
      MilesEventMst mem ON (mem.OrderNo = tb.OrderNo AND mem.StatusCode ="사용")
      
      WHERE 1=1  AND tb.SubsNo = ${subsNo} AND tb.StatusCode = "기존주문"  AND tb.TagGroupNo = 0
`
    // ,IFNULL( (ph.Price + mem.Amount) ,0 )as RefundMilesAmount
    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from orderForSubscribeChange() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  orderForSubscribeCancel: async (subsNo, subsRounds) => {
    const query = `SELECT 
    tb.*
    ,ph.Price
    ,mem.Amount
    ,IFNULL( (ph.Price + mem.Amount) ,0 )as RefundMilesAmount
FROM 
    OrderMst tb
    LEFT JOIN PaymentHistory ph ON tb.OrderNo = ph.OrderNo
    LEFT JOIN MilesEventMst mem ON mem.OrderNo = tb.OrderNo AND mem.StatusCode ="사용"
WHERE 
    tb.SubsNo = ${subsNo} 
    AND tb.OrderRound = ${subsRounds}
    AND tb.StatusCode = "기존주문"
    AND tb.deliverydate < IF(TIME(NOW()) < '16:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY))
ORDER BY 
    tb.DeliveryDate ASC

`;

    try {
      const [rows] = await db.query(query);
      return { status: 1, rows: rows }
    } catch (error) {
      console.error(`Error Occured from orderForSubscribeChange() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }
  },
  amountChangeOrderForSubscribeChange: async (beforeTagRows, subsNo) => {

    // function countAmountByProductName(productList) {
    //   const nameToAmount = {};
    //   for (const product of productList) {
    //     const { name, amount } = product;
    //     nameToAmount[name] = (nameToAmount[name] || 0) + amount;
    //   }
    //   return Object.entries(nameToAmount).map(([name, amount]) => `${name}-${amount}`);
    // }

    // function diffProductAmount(beforeProductList, productInfo) {
    //   const beforeAmount = {};
    //   const currentAmount = {};

    //   // beforeProductList를 반복하면서, 각 name과 amount를 추출하여 beforeAmount 객체에 저장
    //   for (const product of beforeProductList) {
    //     const [name, amount] = product.split('-');
    //     beforeAmount[name] = parseInt(amount, 10);
    //   }

    //   // productInfo를 반복하면서, 각 name과 amount를 추출하여 currentAmount 객체에 저장
    //   for (const product of productInfo) {
    //     const [name, amount] = product.split('-');
    //     currentAmount[name] = parseInt(amount, 10);
    //   }

    //   // 두 객체를 비교하여 차이를 구함
    //   const diff = {};
    //   for (const name in currentAmount) {
    //     diff[name] = currentAmount[name] - (beforeAmount[name] || 0);
    //   }

    //   // 차이가 있는 항목만 추출하여 결과 배열로 변환
    //   const result = [];
    //   for (const name in diff) {
    //     if (diff[name] !== 0) {
    //       result.push(`${name}-${diff[name]}`);
    //     }
    //   }

    //   return result;
    // }


    function groupTagsByDay(beforeData) {
      // 요일별로 그룹화하기
      const groupsByDay = beforeData.reduce((groups, tag) => {
        if (!groups[tag.DeliveryDow]) {
          groups[tag.DeliveryDow] = [];
        }
        groups[tag.DeliveryDow].push(tag);
        return groups;
      }, {});

      // 각 그룹별로 문자열로 변환하기
      const tagStringsByDay = {};
      for (const [day, group] of Object.entries(groupsByDay)) {
        tagStringsByDay[day] = group.map(tag => `${tag.TagLabel}-${tag.Amount}`).join(", ");
      }

      return tagStringsByDay;
    }


    const orderQuery = `
    SELECT 
      *
    FROM 
      OrderMst om 
    WHERE 
      SubsNo  = ${subsNo}
      AND
      StatusCode = "기존주문"
      AND
      TagGroupNo  = 0
    `
    console.log('orderQuery', orderQuery);
    try {
      const [rows] = await db.query(orderQuery);
      console.log('rows', rows)

      //for문으로 돌려야함.


      function removeOverlap(dow, beforeProductList, tagRow) {
        // 해당 요일의 데이터와 전체 주간 데이터를 비교하여 겹치는 값을 찾습니다.
        const overlap = tagRow[dow].split(", ")
          .filter(dish => beforeProductList.includes(dish));

        // 겹치는 값을 제외한 나머지 요리를 반환합니다.
        return beforeProductList.filter(dish => !overlap.includes(dish));
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const beforeProductList = row.Product.split(",");
        console.log('beforeProductList,', row.DeliveryDow, beforeProductList, groupTagsByDay(beforeTagRows))
        console.log(removeOverlap(row.DeliveryDow, beforeProductList, groupTagsByDay(beforeTagRows)));

      }


      return { status: 1 }

    } catch (error) {
      console.log('error', error)
      console.error(`Error Occured from amountChangeOrderForSubscribeChange() function : \r`, error.sqlMessage)
      return { status: -1, error: error.sqlMessage }
    }



    // const query = `
    // UPDATE  
    // OrderMst
    // SET StatusCode="구독변경"
    // WHERE 
    //   SubsNo=${subsNo}
    //   AND ((StatusCode = "기존주문" AND TagGroupNo = 0)
    //   AND Deliverydate >= IF(TIME(NOW()) < '16:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY))
    // `
  }
}

module.exports = order

