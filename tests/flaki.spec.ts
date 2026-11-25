import { test, expect } from '@playwright/test';

test('Test 1: Simulate a flaky test that passes on retry', async ({}, testInfo) => {
    // testInfo.retry is 0 on the first run, 1 on the first retry, etc.
    console.log('Current attempt retry count:', {
        title: testInfo.title,    
        retry: testInfo.retry,    
    });
    expect(testInfo.retry).toBe(1);
});

///adding this line to validate github actions config