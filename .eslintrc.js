module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['plugin:@typescript-eslint/recommended'],
   	rules: {
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/semi': ['off'],
		'@typescript-eslint/member-delimiter-style': ['off'],
		'@typescript-eslint/no-unused-vars': ['off'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-function-return-type': ['off'],
		'@typescript-eslint/interface-name-prefix': ['off'],
		'semi': ['off']
   }
}