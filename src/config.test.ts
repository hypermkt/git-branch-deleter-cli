import { loadConfig } from './config';
import { promises as fs, readFile } from 'fs';

// モックの準備
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

const mockReadFile = fs.readFile as jest.Mock;

describe('loadConfig', () => {
  it('should load config succesfully', async () => {
    const configPath = './config.json';
    const mockData = JSON.stringify({ protectedBranches: ['main', 'develop'] });
    mockReadFile.mockResolvedValue(mockData);

    const result = await loadConfig(configPath);
    expect(result).toEqual({ protectedBranches: ['main', 'develop'] });
  });

  it('should return default value if config file does not exist', async () => {
    const configPath = './config.json';
    mockReadFile.mockRejectedValue(new Error('File not found'));

    const result = await loadConfig(configPath);
    expect(result).toEqual({ protectedBranches: [] });
  });

  it('should return default value if config file is invalid JSON', async () => {
    const configPath = './config.json';
    mockReadFile.mockResolvedValue('invalid json');

    const result = await loadConfig(configPath);
    expect(result).toEqual({ protectedBranches: [] });
  });
});
