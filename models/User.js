const db = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, email, password, firstName, lastName, createdAt, updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Create users table
  static async createUsersTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    try {
      await db.execute(query);
      return true;
    } catch (error) {
      console.error("Error creating users table:", error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    const { email, password, firstName, lastName } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password, first_name, last_name)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [result] = await db.execute(query, [
        email,
        hashedPassword,
        firstName,
        lastName,
      ]);
      return result.insertId;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password, first_name, last_name, created_at, updated_at
      FROM users 
      WHERE email = ?
    `;

    try {
      const [rows] = await db.execute(query, [email]);
      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];
      return new User(
        user.id,
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.created_at,
        user.updated_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;

    try {
      const [rows] = await db.execute(query, [id]);
      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];
      return new User(
        user.id,
        user.email,
        null, // Don't return password
        user.first_name,
        user.last_name,
        user.created_at,
        user.updated_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  // Return user data without password
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const createUsersTable = () => User.createUsersTable();

module.exports = { User, createUsersTable };
