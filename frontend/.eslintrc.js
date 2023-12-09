module.exports = {
    // ...other ESLint configurations
  
    overrides: [
      {
        files: ['**/*.test.js'],
        env: {
          jest: true,
        },
      },
    ],
  };
  