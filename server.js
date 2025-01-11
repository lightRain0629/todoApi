require("dotenv").config();
const express = require("express");
const sql = require("mssql");

// Инициализация Express
const app = express();

// Получение данных из .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: "localhost", // Или ваш сервер
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Используется для Azure, если это не Azure, можно установить false
    trustServerCertificate: true, // Для работы с самоподписанными сертификатами
  },
};

// Конфигурация и подключение к базе данных
async function getDbInfo() {
  let pool;
  try {
    // Подключаемся к базе данных
    pool = await sql.connect(config);
    console.log("Connected to the database");

    // Убедитесь, что таблица существует в нужной схеме
    const result = await pool.request().query("SELECT @@VERSION"); // Если схема 'dbo'
    //   const result = await pool.request().query("SELECT * FROM dbo.Tasks");  // Если схема 'dbo'

    if (result.recordset.length === 0) {
      throw new Error("No tasks found.");
    }

    return result.recordset;
  } catch (err) {
    console.error("Error getting todos:", err);
    throw new Error("Database query failed");
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Эндпоинт для получения списка задач
app.get("/api/db-info", async (req, res) => {
  try {
    const todos = await getDbInfo();
    res.json(todos);
  } catch (err) {
    console.error("Error in /api/db-info endpoint:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

async function getDbList() {
  let pool;
  try {
    // Подключаемся к базе данных
    pool = await sql.connect(config);
    console.log("Connected to the database");

    // Убедитесь, что таблица существует в нужной схеме
    const result = await pool
      .request()
      .query("SELECT name FROM master.dbo.sysdatabases"); // Если схема 'dbo'
    //   const result = await pool.request().query("SELECT * FROM dbo.Tasks");  // Если схема 'dbo'

    if (result.recordset.length === 0) {
      throw new Error("No tasks found.");
    }

    return result.recordset;
  } catch (err) {
    console.error("Error getting todos:", err);
    throw new Error("Database query failed");
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Эндпоинт для получения списка задач
app.get("/api/db-list", async (req, res) => {
  try {
    const todos = await getDbList();
    res.json(todos);
  } catch (err) {
    console.error("Error in /api/db-list endpoint:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

async function getTasks() {
  let pool;
  try {
    // Подключаемся к базе данных
    pool = await sql.connect(config);
    console.log("Connected to the database");

    // Убедитесь, что таблица существует в нужной схеме
    const result = await pool
      .request()
      .query("SELECT Title FROM dbo.Tasks"); // Если схема 'dbo'
    //   const result = await pool.request().query("SELECT * FROM dbo.Tasks");  // Если схема 'dbo'

    if (result.recordset.length === 0) {
      throw new Error("No tasks found.");
    }

    return result.recordset;
  } catch (err) {
    console.error("Error getting todos:", err);
    throw new Error("Database query failed");
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Эндпоинт для получения списка задач
app.get("/api/tasks", async (req, res) => {
  try {
    const todos = await getTasks();
    res.json(todos);
  } catch (err) {
    console.error("Error in /api/db-list endpoint:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
