import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';

// eslint-disable-next-line import/no-extraneous-dependencies
import maru from 'maru';
// eslint-disable-next-line import/no-relative-packages
import mongo from '../index.js';

describe('Запуск', () => {
  let app;

  after(() => app?.stop());

  it('Подключение компонента', async () => {
    app = maru(import.meta.url, [mongo]);
    await app.start();
    assert.ok(app.mongo);
    await app.stop();
    app = null;
  });
});
