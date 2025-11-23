import sequelize from '../config/db.js';
import { cleanupOrphanedCheckouts, verifyForeignKeyConstraints } from '../utils/cleanupOrphanedData.js';

/**
 * Migration script to fix foreign key constraints
 * Run this script if you encounter foreign key constraint errors
 * 
 * Usage: npx ts-node src/migrations/fixForeignKeyConstraints.ts
 */

const runMigration = async () => {
  try {
    console.log('Starting foreign key constraint migration...\n');

    // Step 1: Connect to database
    console.log('1. Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Step 2: Clean up orphaned data
    console.log('2. Cleaning up orphaned checkout records...');
    await cleanupOrphanedCheckouts();
    console.log('');

    // Step 3: Drop existing constraints (if any)
    console.log('3. Dropping existing foreign key constraints...');
    try {
      await sequelize.query(`
        ALTER TABLE "Checkouts" 
        DROP CONSTRAINT IF EXISTS "Checkouts_userId_fkey",
        DROP CONSTRAINT IF EXISTS "Checkouts_bookId_fkey"
      `);
      console.log('✓ Old constraints removed\n');
    } catch (error) {
      console.log('✓ No existing constraints to remove\n');
    }

    // Step 4: Add new CASCADE constraints
    console.log('4. Adding CASCADE foreign key constraints...');
    await sequelize.query(`
      ALTER TABLE "Checkouts"
      ADD CONSTRAINT "Checkouts_userId_fkey" 
      FOREIGN KEY ("userId") 
      REFERENCES "Users" ("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
    `);

    await sequelize.query(`
      ALTER TABLE "Checkouts"
      ADD CONSTRAINT "Checkouts_bookId_fkey" 
      FOREIGN KEY ("bookId") 
      REFERENCES "Books" ("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
    `);
    console.log('✓ CASCADE constraints added\n');

    // Step 5: Verify constraints
    console.log('5. Verifying foreign key constraints...');
    await verifyForeignKeyConstraints();
    console.log('');

    console.log('✅ Migration completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
runMigration();
