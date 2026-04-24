import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Solo buscar tests en src/ — evitar correr los .js compilados en dist/
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    environment: 'node',
    globals: true,
    env: {
      NODE_ENV: 'test',
      DB_PATH: ':memory:',
    },
  },
});
