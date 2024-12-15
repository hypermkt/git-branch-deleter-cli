import { simpleGit } from 'simple-git';

export async function getDeletableBranches(protectedBranches: string[]): Promise<string[]> {
  const git = simpleGit();

  // Retrieve the list of Git branches
  const branches = await git.branchLocal();

  // protectedBranchesに含まれるブランチを除外
  const deletableBranches = branches.all.filter(
    (branch) =>
      !protectedBranches.includes(branch) && branch !== branches.current
  );

  return deletableBranches;
}

export async function deleteBranch(branch: string): Promise<void> {
  const git = simpleGit();
  await git.branch(['-D', branch]);
}