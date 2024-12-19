import { deleteBranch, getDeletableBranches } from './gitService';
import { simpleGit } from 'simple-git';

jest.mock('simple-git');

const mockSimpleGit = simpleGit as jest.Mock;

describe('gitService', () => {
  let gitMock: any;

  // simpleGitをモック化
  beforeEach(() => {
    gitMock = {
      branchLocal: jest.fn(),
      branch: jest.fn(),
    };
    mockSimpleGit.mockReturnValue(gitMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeletableBranches', () => {
    it('should return branches that are not protected or the current branch', async () => {
      gitMock.branchLocal.mockResolvedValue({
        all: ['main', 'develop', 'feature/test'],
        current: 'main',
      });

      const protectedBranches = ['main', 'develop'];
      const result = await getDeletableBranches(protectedBranches);

      expect(result).toEqual(['feature/test']);
      expect(gitMock.branchLocal).toHaveBeenCalledTimes(1);
    });
  });

  it('should return branches that all branches are protected', async () => {
    gitMock.branchLocal.mockResolvedValue({
      all: ['main', 'develop'],
      current: 'main',
    });

    const protectedBranches = ['main', 'develop'];
    const result = await getDeletableBranches(protectedBranches);

    expect(result).toEqual([]);
    expect(gitMock.branchLocal).toHaveBeenCalledTimes(1);
  });

  describe('deleteBranch', () => {
    it('should delete the specified branch', async () => {
      const branchToDelete = 'feature/test';

      await deleteBranch(branchToDelete);

      expect(gitMock.branch).toHaveBeenCalledWith(['-D', branchToDelete]);
      expect(gitMock.branch).toHaveBeenCalledTimes(1);
    });
  });
});
