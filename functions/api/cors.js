export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");
  
  if (!targetUrl) {
    return new Response("Error: Missing target 'url' search parameter.", {
      status: 400,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  try {
    const fetchOptions = {
      method: request.method,
      headers: new Headers(request.headers),
      redirect: "follow"
    };

    // Host header must be deleted to allow upstream validation
    fetchOptions.headers.delete("Host");

    // Copy request body for non-safe HTTP methods
    if (request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = await request.clone().text();
    }

    const response = await fetch(targetUrl, fetchOptions);
    
    // Create new mutable response headers and inject CORS headers
    const proxyHeaders = new Headers(response.headers);
    proxyHeaders.set("Access-Control-Allow-Origin", "*");
    proxyHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    proxyHeaders.set("Access-Control-Allow-Headers", "*");
    
    // Strip headers that interfere with client security/execution
    proxyHeaders.delete("Content-Security-Policy");
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: proxyHeaders
    });
    
  } catch (e) {
    return new Response("CORS Proxy edge failure: " + e.message, {
      status: 502,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }
}
