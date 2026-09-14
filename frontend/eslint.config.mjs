import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// eslint-config-next ships its own flat config array (ESLint 9+ dropped the
// legacy .eslintrc.* system this project used to use). We import it
// directly rather than bridging the old 'next/core-web-vitals' string
// through @eslint/eslintrc's FlatCompat, which chokes on eslint-plugin-react's
// circular `configs` object.
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default eslintConfig;
