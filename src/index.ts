#!/usr/bin/env node
import { loadConfig } from './config';
import { getDeletableBranches, deleteBranch } from './gitService';
import path from 'path';
import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

const configPath = path.resolve(__dirname, '../config.json');

async function main() {
  try {
    // Load the configuration file
    const config = await loadConfig(configPath);
    const protectedBranches = config.protectedBranches;

    const deletableBranches = await getDeletableBranches(protectedBranches); 

    if (deletableBranches.length === 0) {
      console.log('削除可能なブランチはありません。');
      return;
    }

    const selectedBranches = await checkbox({
      message: '削除するブランチを選んでください（スペースキーで選択）：',
      choices: deletableBranches.map((branch) => ({
        name: branch,
        value: branch,
      })),
      pageSize: deletableBranches.length,
    });

    if (selectedBranches.length === 0) {
      console.log('削除するブランチが選択されていません');
      return;
    }

    const confirmation = await select({
      message: `以下のブランチを削除しますか？\n${selectedBranches.join('\n')}\n選択してください。`,
      choices: [
        { name: 'はい', value: true },
        { name: 'いいえ', value: false },
      ],
    });

    if (!confirmation) {
      console.log('削除をキャンセルしました。');
      return;
    }

    for (const branch of selectedBranches) {
      try {
        deleteBranch(branch)
        console.log(`ブランチ ${branch} を削除しました`);
      } catch (error) {
        console.error(`ブランチの削除に失敗しました: `, error);
      }
    }

    console.log('選択したすべてのブランチを削除しました');
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log('キャンセルしました');
      process.exit(0);
    } else {
      console.error('エラーが発生しました: ', error);
    }
  }
}

main();
