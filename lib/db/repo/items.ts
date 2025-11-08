import { getDatabase } from '../init';
import { Item, UUID } from '@/lib/types';

function rowToItem(row: any): Item {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    photoUri: row.photo_uri,
    labelPhotoUri: row.label_photo_uri,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand,
    size: row.size,
    colors: JSON.parse(row.colors),
    fabric: row.fabric,
    warmth: row.warmth,
    waterproof: Boolean(row.waterproof),
    windproof: Boolean(row.windproof),
    formalLevel: row.formal_level,
    seasons: row.seasons ? JSON.parse(row.seasons) : undefined,
    tags: row.tags ? JSON.parse(row.tags) : undefined,
    notes: row.notes,
    lastWorn: row.last_worn,
    cost: row.cost,
    archived: Boolean(row.archived),
  };
}

export async function getAllItems(): Promise<Item[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM items WHERE archived = 0 ORDER BY created_at DESC'
  );
  return rows.map(rowToItem);
}

export async function getItemById(id: UUID): Promise<Item | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM items WHERE id = ?', [id]);
  return row ? rowToItem(row) : null;
}

export async function createItem(item: Item): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO items (
      id, created_at, updated_at, name, photo_uri, label_photo_uri, category, subcategory,
      brand, size, colors, fabric, warmth, waterproof, windproof, formal_level, seasons,
      tags, notes, last_worn, cost, archived
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.createdAt,
      item.updatedAt,
      item.name,
      item.photoUri,
      item.labelPhotoUri ?? null,
      item.category,
      item.subcategory ?? null,
      item.brand ?? null,
      item.size ?? null,
      JSON.stringify(item.colors),
      item.fabric ?? null,
      item.warmth ?? null,
      item.waterproof ? 1 : 0,
      item.windproof ? 1 : 0,
      item.formalLevel ?? null,
      item.seasons ? JSON.stringify(item.seasons) : null,
      item.tags ? JSON.stringify(item.tags) : null,
      item.notes ?? null,
      item.lastWorn ?? null,
      item.cost ?? null,
      item.archived ? 1 : 0,
    ]
  );
}

export async function updateItem(item: Item): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE items SET
      updated_at = ?, name = ?, photo_uri = ?, label_photo_uri = ?, category = ?, subcategory = ?,
      brand = ?, size = ?, colors = ?, fabric = ?, warmth = ?, waterproof = ?, windproof = ?,
      formal_level = ?, seasons = ?, tags = ?, notes = ?, last_worn = ?, cost = ?, archived = ?
    WHERE id = ?`,
    [
      item.updatedAt,
      item.name,
      item.photoUri,
      item.labelPhotoUri ?? null,
      item.category,
      item.subcategory ?? null,
      item.brand ?? null,
      item.size ?? null,
      JSON.stringify(item.colors),
      item.fabric ?? null,
      item.warmth ?? null,
      item.waterproof ? 1 : 0,
      item.windproof ? 1 : 0,
      item.formalLevel ?? null,
      item.seasons ? JSON.stringify(item.seasons) : null,
      item.tags ? JSON.stringify(item.tags) : null,
      item.notes ?? null,
      item.lastWorn ?? null,
      item.cost ?? null,
      item.archived ? 1 : 0,
      item.id,
    ]
  );
}

export async function deleteItem(id: UUID): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM items WHERE id = ?', [id]);
}

export async function markItemWornToday(id: UUID): Promise<void> {
  const db = getDatabase();
  const now = Date.now();
  await db.runAsync('UPDATE items SET last_worn = ? WHERE id = ?', [now, id]);
}

export async function searchItems(query: string): Promise<Item[]> {
  const db = getDatabase();
  const searchPattern = `%${query}%`;
  const rows = await db.getAllAsync(
    `SELECT * FROM items
     WHERE archived = 0
     AND (name LIKE ? OR category LIKE ? OR subcategory LIKE ?)
     ORDER BY created_at DESC`,
    [searchPattern, searchPattern, searchPattern]
  );
  return rows.map(rowToItem);
}

export async function getItemsByCategory(category: string): Promise<Item[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM items WHERE archived = 0 AND category = ? ORDER BY created_at DESC',
    [category]
  );
  return rows.map(rowToItem);
}
