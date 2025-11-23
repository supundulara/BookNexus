import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  name: string;
  email: string | null;
  password: string;
  role: 'user' | 'admin' | 'student';
  registrationNumber?: string;
  faculty?: string;
  courseOfStudy?: string;
  intakeBatch?: string;
  indexNumber?: string;
  title?: string;
  lastName?: string;
  nameWithInitials?: string;
  gender?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  static find(arg0: {}, arg1: string) {
    throw new Error('Method not implemented.');
  }
  public id!: number;
  public name!: string;
  public email!: string | null;
  public password!: string;
  public role!: 'user' | 'admin' | 'student';
  public registrationNumber?: string;
  public faculty?: string;
  public courseOfStudy?: string;
  public intakeBatch?: string;
  public indexNumber?: string;
  public title?: string;
  public lastName?: string;
  public nameWithInitials?: string;
  public gender?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to compare password
  public async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    faculty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    intakeBatch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    indexNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameWithInitials: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'student'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;