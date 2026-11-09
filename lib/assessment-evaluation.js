import { buildAssessmentResult } from '../data/instruments.js';

function routeFor(result) {
  return result.risk.crisisFirst ? '/crisis' : '/result';
}

export function evaluateAssessmentCases(cases) {
  return cases.map((testCase) => {
    try {
      const result = buildAssessmentResult(testCase.input);
      const actual = {
        tier: result.risk.tier,
        route: routeFor(result),
        instrument: result.depression.instrument,
      };
      const passed = !testCase.expectedError && Object.entries(testCase.expected).every(([key, value]) => actual[key] === value);
      return { id: testCase.id, purpose: testCase.purpose, passed, expected: testCase.expected, actual };
    } catch (error) {
      const actualError = error?.constructor?.name || 'Error';
      return {
        id: testCase.id,
        purpose: testCase.purpose,
        passed: actualError === testCase.expectedError,
        expectedError: testCase.expectedError,
        actualError,
      };
    }
  });
}

export function summarizeAssessmentEvaluation(results) {
  const passed = results.filter((result) => result.passed).length;
  return { total: results.length, passed, failed: results.length - passed };
}
