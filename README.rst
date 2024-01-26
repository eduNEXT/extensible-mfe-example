Extensible MFE example
======================
|Status|

.. |Status| image:: https://img.shields.io/badge/status-maintained-31c653

Purpose
-------

This repository provides a foundational configuration for integrating new extensions into any Micro Frontend (MFE). Currently, the configuration requires updates within the specific MFE where you intend to implement the feature. The content of this repository includes the initial setup for facilitating this configuration process. `Here is the original implementation <https://github.com/openedx/frontend-app-communications/pull/184>`_


Configuration
-------------

Before proceeding with the following steps, clone this repository inside the Micro Frontend (MFE) where you intend to implement the extension.

.. code-block:: bash

    git clone https://github.com/eduNEXT/extensible-mfe-example.git


1. **Adding the basic configuration for eslint, jest, and webpack**

   - **eslint configuration:**
     Add this configuration to the `.eslintrc.js` files inside the Micro Frontend (MFE).

     .. code-block:: javascript

        const path = require('path');
        const { createConfig } = require('@edx/frontend-build');

        module.exports = createConfig('eslint', {
          settings: {
            'import/resolver': {
              webpack: {
                config: path.resolve(__dirname, 'webpack.dev.config.js'),
              },
              alias: {
                map: [
                  // optional to have an alias
                  ['@communications-app', '.'],
                ],
                extensions: ['.ts', '.js', '.jsx', '.json'],
              },
            },
          },

          rules: {
            ...otherRules,
            'import/prefer-default-export': 'off',
            'import/no-extraneous-dependencies': 'off',
          },

          overrides: [
            {
              files: ['plugins/**/*.jsx'],
              rules: {
                'import/no-extraneous-dependencies': 'off',
              },
            },
          ],
        });

   - **jest configuration:**
     Add this configuration to the `jest.config.js` file inside the MFE.

     .. code-block:: javascript

        const path = require('path');
        const { createConfig } = require('@edx/frontend-build');

        module.exports = createConfig('jest', {
          ...otherRules,
          moduleNameMapper: {
            // required
            '@node_modules/(.*)': '<rootDir>/node_modules/$1',
            // optional
            '@communications-app/(.*)': '<rootDir>/$1'
          },
        });

   - **webpack configuration:**

     - **development:**
       Add this configuration to the `webpack.dev.config.js` file inside the MFE.

       .. code-block:: javascript

           const path = require('path');
           const { createConfig } = require('@edx/frontend-build');

           const config = createConfig('webpack-dev');
           // ...other rules
           const alias = {
            '@node_modules': path.resolve(__dirname, 'node_modules'),
            // optional
            '@communications-app': path.resolve(__dirname, '.'),
          };

          config.resolve.alias = { ...config.resolve.alias, ...alias };

          module.exports = config;

     - **production:**
       Add this configuration to the `webpack.prod.config.js` file inside the MFE.

       .. code-block:: javascript

           const path = require('path');
           const { createConfig } = require('@edx/frontend-build');
           // ...other rules
           const alias = {
            '@node_modules': path.resolve(__dirname, 'node_modules'),
            // optional
            '@communications-app': path.resolve(__dirname, '.'),
          };

          config.resolve.alias = { ...config.resolve.alias, ...alias };

2. **Adding the PluggableComponent and contextFactory to the MFE**

   - **PluggableComponent:**
     This component allows dynamic components, passing it two props:

     1. `key`: A string identifier for the component.
     2. `as`: A string that will be the name of the plugin. For example, if the `package.json` of the plugin
        is called "@openedx-plugins/example-app-example-plugin," then the "as" prop will be 
        "example-app-example-plugin."

     To add it to the MFE, move it to the "src" folder of the MFE.

     .. code-block:: bash

        cp -R extensible-mfe-example/PluggableComponent src

   - **contextFactory (optional):**
     This is a utility that you could use to create a context with a simple reducer to share
     between plugins if needed.

     To add it to the MFE, move it to the "src" folder of the MFE.

     .. code-block:: bash

        cp -R extensible-mfe-example/contextFactory src

    

3. **Move the plugin to the MFE root directory:**

   .. code-block:: bash

        cp -R extensible-mfe-example/plugins .

   There is a plugin example; you can change the `{{MFE_NAME}}` for the MFE where you are adding this slot, which is in the `peerDependencies` in the `package.json`.

4. **Install the dependencies:**

   Add these dependencies to your project's dependencies in the `package.json` file:

   .. code-block:: json

      {
        "dependencies": {
          ...otherDependencies,
          "@openedx-plugins/example-app-example-plugin": "file:plugins/PluginExample"
        }
      }

   Then, in your terminal, run:

   .. code-block:: bash

      npm install @loadable/component use-deep-compare-effect @openedx-plugins/example-app-example-plugin
      npm install --save-dev @testing-library/react-hooks eslint-import-resolver-alias eslint-import-resolver-webpack eslint-plugin-import



5. **Add the `PluggableComponent` component to any part of the MFE:**

   .. code-block:: jsx

        import PluggableComponent from '{your_path}/PluggableComponent';

   Then add it somewhere you want to:

   .. code-block:: jsx

       <PluggableComponent
          id="example-plugin"
          as="example-app-example-plugin"
        />

6. **Start the MFE:**

   .. code-block:: bash

        npm start

You should be able to see the plugin in the part that you have added to the MFE.
     

**Recommendations**

The plugins should have an `index.jsx` file as the entry point to avoid problems when uploading the plugin to npm. Ensure that the plugin is Babel transpiled code when published to npm.
