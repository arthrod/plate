export default {
  test: {
    globals: true,
    include: ['test/**/*.tests.ts'],
    exclude: ['test/test-data/**'],
    pool: 'forks',
  },
};
