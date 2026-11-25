import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path'


const endPointUrl = 'https://reqres.in/api/users/2';
const jsonFile = 'playwright/.bodyRequest/requestBody.json';
const jsonFileResponse = 'playwright/.bodyResponse/responseBody.json';
const endpointPost = 'https://reqres.in/api/users';
const endpointRegister = 'https://reqres.in/api/register';

test('Test 1: GET request fetches user data successfully', async ({ request }) => {
    // send the request to the endpoint
    const response = await request.get(endPointUrl, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        }
    });
    // Assert the status code, ".ok()" checks if status is in  200 - 299 range
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    // Parse the body to JSON
    const responseBody = await response.json();
    fs.mkdirSync(path.dirname(jsonFile), { recursive: true });
    fs.writeFileSync(jsonFile, JSON.stringify(responseBody, null, 2));
    //console.log(`This is the body of request: ${JSON.stringify(responseBody, null, 2)}`);
    // console.log(`This is the body of request: ${responseBody}`);
    // assert the data payload
    expect(responseBody.data.first_name).toBe('Janet');
    expect(responseBody.data.id).toBe(2);
    console.log('Test 1 has been executed!');
});
test('Test 2: POST request create a new user', async ({ request }) => {
    // sending the request POST
    const response = await request.post(endpointPost, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!,
        },
        data: {
            name: 'Andres Cruz',
            job: 'QA Engineer'
        }
    });
    //////////////////////////////////////////////////////////////////////
    expect(response.status()).toBe(201); // 201 created, check status code
    const responseBody = await response.json(); /// converts the response into JSON format
    fs.mkdirSync(path.dirname(jsonFileResponse), { recursive: true }); /// create folder bodyResponse
    fs.writeFileSync(jsonFileResponse, JSON.stringify(responseBody, null, 2)); /// create JSON file
    expect(responseBody.name).toBe('Andres Cruz');
    expect(responseBody.id).toBeDefined();
    console.log('Test 2 has been executed!');
});
test('Test 3: DELETE request delete an user', async ({ request }) => {
    const response = await request.delete(endPointUrl, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        }
    })
    expect(response.status()).toBe(204);
    //// Checking delete process
    const checkingDelete = await request.get(endPointUrl, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        }
    })
    expect(checkingDelete.status()).toBe(200);

    console.log('Test 3 has been executed!')
});
test('Test 4: PUT request updating an user', async ({ request }) => {
    const response = await request.put(endPointUrl, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        },
        data: {
            name: 'Vito',
            Job: 'CEO'
        }
    })
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.name).toBe('Vito');    
    console.log('Test 4 has been executed!')
});
test('Test 5: PATCH updating the job user', async ({ request }) => {
    const response = await request.patch(endPointUrl, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        },
        data: {
            job: 'CEO & TEST'
        }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.job).toBe('CEO & TEST');
    console.log('Test 5 has been executed!');
});
test('Test 6: POST register user success', async ({ request }) => {
    const response = await request.post(endpointRegister, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        },
        data: {
            email: 'eve.holt@reqres.in',
            password: 'pistol'
        }
    });
    expect(response.status()).toBe(200);
    const bodyResponse = await response.json();
    expect(bodyResponse.id).toBeDefined();
    expect(bodyResponse.token).toBeDefined();
    console.log('Test 6 has been executed!')    
});
test('Test 7: POST Missing password', async ({ request }) => {
    const response = await request.post(endpointRegister, {
        headers: {
            'x-api-key': process.env.REQRES_API_KEY!
        },
        data: {
            email: 'sydney@fife'
        }
    });
    expect(response.status()).toBe(400);
    const bodyRequest = await response.json();
    expect(bodyRequest.error).toBe('Missing password');  
    console.log('Test 7 has been executed!')     
});