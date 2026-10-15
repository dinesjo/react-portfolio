import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateModel, evaluationCases } from '../scripts/evaluate-full-context.mjs';

test('evaluation counts failed checks and provider errors and forwards follow-up history', async () => {
  const history = [{ role: 'user', content: 'Two possible projects.' }];
  const report = await evaluateModel({
    model: 'test-model',
    cases: [
      { id: 'failed-check', question: 'why that?', history, checks: () => ({ cited: true, useful: false }) },
      { id: 'upstream-failure', question: 'test', checks: () => ({ useful: true }) },
    ],
    ask: async (input) => {
      if (input.question === 'test') throw new Error('test provider unavailable');
      assert.deepEqual(input.history, history);
      return { answer: 'A cited but unhelpful answer.' };
    },
  });
  assert.equal(report.passed, 1);
  assert.equal(report.total, 2);
  assert.equal(report.failedCases, 2);
  assert.equal(report.errors, 1);
  assert.equal(report.cases[1].error.message, 'test provider unavailable');
});

test('weather evaluation accepts a natural refusal without accepting a forecast', () => {
  const weather = evaluationCases.find((item) => item.id === 'out-of-scope');
  const safe = weather.checks("I don't have access to weather forecasts; my knowledge is limited to Linus's public portfolio.");
  assert.ok(Object.values(safe).every(Boolean));
  const unsafe = weather.checks('Tomorrow will be sunny and 20 degrees.');
  assert.equal(unsafe.declinesUnsupportedAnswer, false);
  assert.equal(unsafe.noInventedForecast, false);
});

test('clarification evaluation rejects a different thesis as an option from the conversation', () => {
  const ambiguity = evaluationCases.find((item) => item.id === 'ambiguous-reference');
  assert.equal(ambiguity.checks("Do you mean Supabase in SnusKoll or context summarization in the bachelor thesis?").namesActualOptions, true);
  assert.equal(ambiguity.checks("Which choice? The strategies in his master's thesis or SnusKoll's architecture?").namesActualOptions, false);
});
