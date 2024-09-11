module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'@electron-toolkit/eslint-config-ts/recommended',
		'@electron-toolkit/eslint-config-prettier',
	],
	plugins: ['@typescript-eslint'],
	rules: {
		// A temporary hack related to IDE not resolving correct package.json
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript/explicit-function-return-type': 'off',
		'import/no-extraneous-dependencies': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'import/no-import-module-exports': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	settings: {
		'import/resolver': {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				moduleDirectory: ['node_modules', 'src/'],
			},
			typescript: {},
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
};
