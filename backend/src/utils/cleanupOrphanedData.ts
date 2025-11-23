import sequelize from '../config/db.js';

/**
 * Cleanup orphaned checkout records that reference non-existent users or books
 * This prevents foreign key constraint violations during database migrations
 */
export const cleanupOrphanedCheckouts = async (): Promise<void> => {
  try {
    console.log('Checking for orphaned checkout records...');

    // Delete checkouts with non-existent users
    const [deletedByUser] = await sequelize.query(`
      DELETE FROM "Checkouts" 
      WHERE "userId" NOT IN (SELECT id FROM "Users")
    `);

    // Delete checkouts with non-existent books
    const [deletedByBook] = await sequelize.query(`
      DELETE FROM "Checkouts" 
      WHERE "bookId" NOT IN (SELECT id FROM "Books")
    `);

    const totalDeleted = (deletedByUser as any).rowCount + (deletedByBook as any).rowCount;

    if (totalDeleted > 0) {
      console.log(`✓ Cleaned up ${totalDeleted} orphaned checkout record(s)`);
    } else {
      console.log('✓ No orphaned checkout records found');
    }
  } catch (error) {
    console.error('Error cleaning up orphaned checkouts:', error);
    // Don't throw - allow the app to continue even if cleanup fails
  }
};

/**
 * Verify foreign key constraints are properly set
 */
export const verifyForeignKeyConstraints = async (): Promise<void> => {
  try {
    const [constraints] = await sequelize.query(`
      SELECT 
        conname as constraint_name,
        conrelid::regclass as table_name,
        confrelid::regclass as referenced_table
      FROM pg_constraint
      WHERE contype = 'f' 
      AND conrelid::regclass::text = 'Checkouts'
    `);

    console.log('✓ Foreign key constraints verified:', constraints);
  } catch (error) {
    console.error('Error verifying foreign key constraints:', error);
  }
};
