import { useIndexedDB } from './useIndexedDB';
import { DB_NAME, STORE_NAME } from '../constants/dbConstants';

export async function initializeDatabase() {
    const { openDB } = useIndexedDB(DB_NAME, STORE_NAME);
    await openDB();
} 