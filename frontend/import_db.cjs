const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDb() {
  try {
    const sqlPath = path.join(__dirname, '../databases/mysql_query.sql');
    console.log(`Reading SQL file from ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Connecting to TiDB Cloud...");
    const conn = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
      port: 4000,
      user: 'zgrdvJng5uysPRf.root',
      password: 'rnFdVJ3IPo1QzKcT',
      database: 'test',
      ssl: {
        rejectUnauthorized: false
      },
      multipleStatements: true
    });

    console.log("Connected! Executing SQL dump (this may take a minute due to image sizes)...");
    await conn.query(sql);
    
    console.log("✅ Successfully imported the database to TiDB Cloud!");
    await conn.end();
  } catch (error) {
    console.error("❌ Error importing database:", error);
  }
}

importDb();
