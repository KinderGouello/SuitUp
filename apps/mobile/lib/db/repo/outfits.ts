import { getDatabase } from '../init';
import { Outfit, UUID } from '@/lib/types';

function rowToOutfit(row: any): Outfit {
  return {
    id: row.id,
    createdAt: row.created_at,
    explanation: row.explanation,
    items: JSON.parse(row.items),
    weather: JSON.parse(row.weather),
  };
}

export async function getAllOutfits(): Promise<Outfit[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM outfits ORDER BY created_at DESC'
  );
  return rows.map(rowToOutfit);
}

export async function getOutfitById(id: UUID): Promise<Outfit | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM outfits WHERE id = ?', [
    id,
  ]);
  return row ? rowToOutfit(row) : null;
}

export async function getLatestOutfit(): Promise<Outfit | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync(
    'SELECT * FROM outfits ORDER BY created_at DESC LIMIT 1'
  );
  return row ? rowToOutfit(row) : null;
}

export async function createOutfit(outfit: Outfit): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO outfits (id, created_at, explanation, items, weather)
     VALUES (?, ?, ?, ?, ?)`,
    [
      outfit.id,
      outfit.createdAt,
      outfit.explanation,
      JSON.stringify(outfit.items),
      JSON.stringify(outfit.weather),
    ]
  );
}

export async function deleteOutfit(id: UUID): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM outfits WHERE id = ?', [id]);
}
