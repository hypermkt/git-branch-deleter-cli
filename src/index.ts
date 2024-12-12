#!/usr/bin/env node
import simpleGit from 'simple-git';
import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

const git = simpleGit();

async function main() {
  try {
    // Retrieve the list of Git branches
    const branches = await git.branchLocal();
    const branchNames = branches.all.filter(branch => (branch !== branches.current))

    if (branchNames.length === 0) {
      console.log('削除可能なブランチはありません。')
      return;
    }

    const selectedBranches = await checkbox({
      message: '削除するブランチを選んでください（スペースキーで選択）：',
      choices: branchNames.map(branch => ({name: branch, value: branch})),
      pageSize: branchNames.length
    });

    if (selectedBranches.length === 0) {
      console.log('削除するブランチが選択されていません')
      return;
    }

    const confirmation = await select({
      message: `以下のブランチを削除しますか？\n${selectedBranches.join('\n')}\n選択してください。`,
      choices: [
        {name: 'はい', value: true},
        {name: 'いいえ', value: false}
      ]
    });

    if (!confirmation) {
      console.log('削除をキャンセルしました。')
      return;
    }
  
    const errors : { branch: string; message: string }[] = [];
    for (const branch of selectedBranches) {
      try {
        await git.deleteLocalBranch(branch);
        console.log(`ブランチ ${branch} を削除しました`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({ branch, message: errorMessage });
      }
    }

    if (errors.length > 0) {
      console.log('ブランチの削除に失敗しました。')
      errors.forEach(({ branch, message}) => {
        if (message.includes('not fully merged')) {
          console.error(`  => ブランチ ${branch}は未マージです。強制削除をするには'git branch -D ${branch}' を実行してください。`);
        }
      });
    } else {
      console.log('選択したすべてのブランチを削除しました')
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log("キャンセルしました");
      process.exit(0);
    } else {
      console.error('エラーが発生しました: ', error)
    }
  }
}

main();