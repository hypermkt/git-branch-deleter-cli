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
      choices: branchNames.map(branch => ({name: branch, value: branch}))
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
  
    for (const branch of selectedBranches) {
      await git.deleteLocalBranch(branch);
      console.log(`ブランチ ${branch} を削除しました`)
    }

    console.log('選択したすべてのブランチを削除しました')

  } catch (error) {
    console.error('エラーが発生しました: ', error)
  }
}

main();