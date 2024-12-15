import { promises as fs } from 'fs';

export async function loadConfig(configPath: string): Promise< { protectedBranches: string[] }> {
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load config file.', error);
    return { protectedBranches: [] }; // 設定ファイルが読み込めない場合のデフォルト
  }
}