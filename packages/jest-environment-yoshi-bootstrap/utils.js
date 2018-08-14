const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports.loadConfig = () => {
  const configPath = path.join(process.cwd(), 'jest-yoshi.config.js');

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Could not find 'jest-yoshi.config.js' file, please create one at the root of your project.`,
    );
  }

  try {
    return require(configPath);
  } catch (error) {
    throw new Error(
      `Config ${chalk.bold(configPath)} is invalid:\n  ${error.message}`,
    );
  }
};
