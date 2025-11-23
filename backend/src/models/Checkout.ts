import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

interface CheckoutAttributes {
  id: number;
  userId: number;
  bookId: number;
  checkedOutAt: Date;
  returnedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CheckoutCreationAttributes extends Optional<CheckoutAttributes, 'id'> {}

class Checkout extends Model<CheckoutAttributes, CheckoutCreationAttributes> implements CheckoutAttributes {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public checkedOutAt!: Date;
  public returnedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Checkout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    checkedOutAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Checkout',
  }
);

// Establish relationships with CASCADE delete
User.hasMany(Checkout, { foreignKey: 'userId', onDelete: 'CASCADE' });
Checkout.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

Book.hasMany(Checkout, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Checkout.belongsTo(Book, { foreignKey: 'bookId', onDelete: 'CASCADE' });

export default Checkout;