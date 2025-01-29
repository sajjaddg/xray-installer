import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
  Usage
    $ xray-installer --type [h2|tcp]

  Options
    --type    Transport type (default: h2)

  Examples
    $ xray-installer --type=h2
    $ xray-installer --type=tcp
`,
  {
    importMeta: import.meta,
    flags: {
      type: {
        type: 'string',
        default: 'h2'
      }
    }
  }
);

render(<App type={cli.flags.type} />);