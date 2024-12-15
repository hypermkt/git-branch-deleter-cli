#!/usr/bin/env node
import { loadConfig } from './config';
import path from 'path';
import simpleGit from 'simple-git';
import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

const git = simpleGit();
const configPath = path.resolve(__dirname, '../config.json');

async function main() {
  try {
    // Load the configuration file
    const config = await loadConfig(configPath);
    const protectedBranches = config.protectedBranches;

    // Retrieve the list of Git branches
    const branches = await git.branchLocal();

    // protectedBranchesに含まれるブランチを除外
    const deletableBranches = branches.all.filter(
      (branch) =>
        !protectedBranches.includes(branch) && branch !== branches.current
    );

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
        await git.branch(['-D', branch]);
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
