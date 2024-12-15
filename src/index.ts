#!/usr/bin/env node
import { loadConfig } from './config';
import { getDeletableBranches, deleteBranch } from './gitService';
import { selectBranches, confirmBranch } from './prompt';
import path from 'path';

const configPath = path.resolve(__dirname, '../config.json');

async function main() {
  try {
    // Load the configuration file
    const config = await loadConfig(configPath);
    const protectedBranches = config.protectedBranches;

    const deletableBranches = await getDeletableBranches(protectedBranches);

    if (deletableBranches.length === 0) {
      console.log('No branches available for deletion.');
      return;
    }

    const selectedBranches = await selectBranches(deletableBranches);

    if (selectedBranches.length === 0) {
      console.log('No branches selected for deletion.');
      return;
    }

    const confirmation = await confirmBranch(selectedBranches);
    if (!confirmation) {
      console.log('Deletion canceled.');
      return;
    }

    for (const branch of selectedBranches) {
      deleteBranch(branch);
      console.log(`Deleted branch: ${branch}`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log('Cancelled');
      process.exit(0);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

main();
