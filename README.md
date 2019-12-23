# customize-cra-add-stylus-loader
This repo contain only code from declined pr (https://github.com/arackaf/customize-cra/pull/145/files#) to customize-cra


To install:

npm install --save-dev customize-cra-add-stylus-loader

To use:

const addStylusLoader = require('customize-cra-add-stylus-loader');

module.exports = override(
  addStylusLoader({}),
  ...
