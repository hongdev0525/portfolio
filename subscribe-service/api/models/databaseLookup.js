var db = require("../db/db.js");
require("dotenv").config();

const DATABASE_NAME = process.env.DATABASE_NAME;


const common = {

    /**
     * 데이터베이스 테이블 이름 조회 - getTableNameListFromDB()
     * @returns {object}
     */
    getTableNameListFromDB: async () => {
        const query =
            `SELECT 
                TABLE_NAME 
            FROM 
                INFORMATION_SCHEMA.tables 
            WHERE 
                TABLE_SCHEMA = '${DATABASE_NAME}'`;
        try {
            const [rows] = await db.query(query);
            return rows
        } catch (error) {
            console.log('Error occured from getTableNameFromDB() function :>> ', error);
            return -1
        }
    },

    /**
     * 데이터베이스 필드명 조회 - getFieldNameListFromDB()
     * @param {string} tableName - 테이블명
     * @returns {string} 조회된 테이블명
     */
    getFieldNameListFromDB: async  (tableName) => {
        if (tableName.length == 0) {
            console.error("tableName is not defined")
            return -1
        }
        const query =
            `SELECT 
                GROUP_CONCAT(COLUMN_NAME) as COLUMN_NAME
            FROM 
                INFORMATION_SCHEMA.columns 
            WHERE 
                table_schema = '${DATABASE_NAME}' 
            AND 
                table_name = '${tableName}' 
            ORDER BY ordinal_position`;

            try {
                const [rows] =  await db.query(query)
                return rows[0].COLUMN_NAME
            } catch (error) {
                console.log('Error occured from getFieldNameListFrom() function :>> ', error);
                return -1
            }
    }
}

module.exports = common

