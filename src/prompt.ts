import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

export async function selectBranches(
  deletableBranches: string[]
): Promise<string[]> {
  return await checkbox({
    message: 'Select branches to delete):',
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
    message: `Do you want to delete these branches?\n${selectedBranches.join('\n')}`,
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ],
  });
}
