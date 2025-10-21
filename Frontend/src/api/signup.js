export async function signup(endpointOrData, maybeData) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Allow calling signup(data) or signup(endpoint, data)
    let endpoint;
    let data;

    if (typeof endpointOrData === 'string') {
      endpoint = endpointOrData;
      data = maybeData;
    } else {
      // caller passed only the body
      endpoint = '/auth/register';
      data = endpointOrData;
    }

    // Validate endpoint type
    if (typeof endpoint !== 'string') {
      throw new TypeError(
        `Expected endpoint to be a string, got ${typeof endpoint}: ${JSON.stringify(endpoint)}`
      );
    }

    // Validate data
    if (typeof data !== 'object' || data === null) {
      throw new TypeError(
        `Expected data to be an object, got ${typeof data}: ${JSON.stringify(data)}`
      );
    }

    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    console.debug('signup() ->', { url, payload: data });

    // perform the fetch with focused network error handling
    let res;
    try {
      // detect runtime context
      const runtime = typeof window === 'undefined' ? 'server' : 'browser';
      console.debug('signup() runtime', { runtime, BASE_URL, url });

      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (fetchErr) {
      // Typical fetchErr types: TypeError (network failure), DOMException (CORS?), etc.
      console.error('signup() fetch failed', fetchErr);

      // Add guidance for common network problems
      const guidance = [];
      guidance.push('Check that the API server is running and reachable at the configured URL.');
      guidance.push(`NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL || ''} (used as BASE_URL=${BASE_URL})`);
      guidance.push('If running frontend in a browser, inspect Network tab for CORS failures (OPTIONS/Access-Control-Allow-Origin).');
      guidance.push('If using Docker, ensure hostnames/ports are reachable from the container/browser (e.g. use host.docker.internal when appropriate).');

      const err = new Error('Network error during signup fetch: ' + (fetchErr.message || String(fetchErr)));
      err.original = fetchErr;
      err.guidance = guidance;
      console.error('signup() fetch guidance', guidance);
      throw err;
    }

    if (!res.ok) {
      // try to capture response body for better debugging
      let bodyText = null;
      try {
        bodyText = await res.text();
      } catch (e) {
        console.warn('Failed reading error response body', e);
      }
      console.error('signup() non-ok response', { status: res.status, bodyText });
      const err = new Error(`HTTP error! status: ${res.status}`);
      err.status = res.status;
      try {
        err.body = bodyText ? JSON.parse(bodyText) : bodyText;
      } catch (e) {
        err.body = bodyText;
      }
      throw err;
    }

    const json = await res.json().catch((e) => {
      console.warn('signup() response json parsing failed', e);
      return null;
    });

    console.debug('signup() success', { status: res.status, json });
    return json;
  } catch (err) {
    console.error('Signup API error:', err);
    throw err;
  }
}
