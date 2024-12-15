import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

export async function selectBranches(
  deletableBranches: string[]
): Promise<string[]> {
  return await checkbox({
    message: '削除するブランチを選んでください（スペースキーで選択）：',
    choices: deletableBranches.map((branch) => ({
      name: branch,
      value: branch,
    })),
    pageSize: deletableBranches.length,
  });
}

export async function confirmBranch(
  selectedBranches: string[]
): Promise<boolean> {
  return await select({
    message: `以下のブランチを削除しますか？\n${selectedBranches.join('\n')}\n選択してください。`,
    choices: [
      { name: 'はい', value: true },
      { name: 'いいえ', value: false },
    ],
  });
}
