# Foreign Key Constraint Fix

## Problem
The backend was crashing with `ForeignKeyConstraintError: Key (userId)=(4) is not present in table 'Users'` because the `Checkouts` table had orphaned records referencing deleted users or books.

## Solution Implemented

### 1. **Updated Checkout Model** (`backend/src/models/Checkout.ts`)
- Added `onDelete: 'CASCADE'` and `onUpdate: 'CASCADE'` to foreign key definitions
- Updated model associations to include CASCADE behavior
- Now when a User or Book is deleted, all related Checkouts are automatically deleted

### 2. **Created Cleanup Utility** (`backend/src/utils/cleanupOrphanedData.ts`)
- `cleanupOrphanedCheckouts()`: Removes orphaned checkout records before applying constraints
- `verifyForeignKeyConstraints()`: Verifies that foreign key constraints are properly set
- Runs automatically on server startup

### 3. **Updated Database Connection** (`backend/src/config/db.ts`)
- Cleans up orphaned data before syncing database schema
- Prevents crashes during migration by removing invalid references first
- Handles both development and production environments

### 4. **Improved Error Handling** (`backend/src/index.ts`)
- Database connection errors no longer crash the entire application
- Server starts even if database connection fails (for health checks/debugging)
- Graceful error logging

### 5. **Created Migration Script** (`backend/src/migrations/fixForeignKeyConstraints.ts`)
- Manual migration script for production databases
- Can be run to fix existing constraint issues
- Drops old constraints and adds new CASCADE constraints

## Usage

### Automatic Cleanup (Recommended)
The cleanup runs automatically when you start the server:

```bash
npm run dev   # Development
npm run build && npm start  # Production
```

### Manual Migration (If Needed)
If you need to manually fix constraints on an existing production database:

```bash
npm run migrate:fix-fk
```

### On Production Server
```bash
cd ~/BookNexus/backend
npm run build
npm run migrate:fix-fk  # Optional: Run migration first
pm2 restart booknexus-backend
```

## What Changed

### Before:
- Deleting a user left orphaned checkout records
- Foreign key constraints would fail during migrations
- Backend would crash on startup
- 502 Bad Gateway errors in production

### After:
- Deleting a user automatically deletes their checkouts (CASCADE)
- Orphaned data is cleaned up automatically on startup
- Backend starts successfully even with existing orphaned data
- Proper error handling prevents crashes

## Testing

### Verify CASCADE Deletes Work:
```sql
-- Delete a user
DELETE FROM "Users" WHERE id = 1;

-- Check that their checkouts are also deleted
SELECT * FROM "Checkouts" WHERE "userId" = 1;
-- Should return 0 rows
```

### Check for Orphaned Data:
```sql
-- Find checkouts with non-existent users
SELECT * FROM "Checkouts" 
WHERE "userId" NOT IN (SELECT id FROM "Users");

-- Find checkouts with non-existent books
SELECT * FROM "Checkouts" 
WHERE "bookId" NOT IN (SELECT id FROM "Books");
```

## Benefits

1. ✅ **No More Crashes**: Backend handles orphaned data gracefully
2. ✅ **Data Integrity**: CASCADE deletes maintain referential integrity
3. ✅ **Automatic Cleanup**: Orphaned records are removed on startup
4. ✅ **Production Ready**: Works in both development and production
5. ✅ **Easy Recovery**: Manual migration script available if needed

## Files Modified

- `backend/src/models/Checkout.ts` - Added CASCADE constraints
- `backend/src/config/db.ts` - Added automatic cleanup
- `backend/src/index.ts` - Improved error handling
- `backend/package.json` - Added migration script

## Files Created

- `backend/src/utils/cleanupOrphanedData.ts` - Cleanup utilities
- `backend/src/migrations/fixForeignKeyConstraints.ts` - Manual migration script
- `backend/FOREIGN_KEY_FIX.md` - This documentation
