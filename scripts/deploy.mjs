// Publishes dist/ to the `gh-pages` branch of the `origin` remote (GitHub Pages).
// Run through `npm run deploy`, which builds first.
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const tryGit = (args) => {
  try {
    return git(args);
  } catch {
    return '';
  }
};

if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing - run `npm run build` first.');
  process.exit(1);
}

const remote = git(['remote', 'get-url', 'origin']);
// dist/ becomes a throwaway repository, so pass on this repository's identity and credential helper.
const config = [];
for (const key of ['user.name', 'user.email', 'credential.https://github.com.helper']) {
  const value = tryGit(['config', key]);
  if (value) config.push('-c', `${key}=${value}`);
}

rmSync('dist/.git', { recursive: true, force: true });
git(['init', '-q', '-b', 'gh-pages'], 'dist');
git(['add', '-A'], 'dist');
git([...config, 'commit', '-q', '-m', `Deploy ${new Date().toISOString()}`], 'dist');
git([...config, 'push', '-q', '-f', remote, 'gh-pages'], 'dist');
rmSync('dist/.git', { recursive: true, force: true });

console.log(`Deployed dist/ to gh-pages on ${remote}`);
