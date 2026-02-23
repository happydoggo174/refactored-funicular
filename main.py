#workaround for cors issue
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from starlette.types import ASGIApp

class DomainReplaceMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, domain_to_replace: str):
        super().__init__(app)
        self.domain_to_replace = domain_to_replace

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Only run in debug mode
        if not request.app.debug:
            return response

        content_type = response.headers.get("content-type", "")

        # Only process HTML or JS
        if "text/html" in content_type or "application/javascript" in content_type:
            body = b""
            async for chunk in response.body_iterator:
                body+=chunk
            # Replace domain
            modified_body = body.replace(
                self.domain_to_replace.encode(),
                b"http://127.0.0.1:9000/"
            )

            # Rebuild response (important: update content-length)
            new_response = Response(
                content=modified_body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type
            )
            new_response.headers["content-length"] = str(len(modified_body))
            return new_response

        return response
app=FastAPI(debug=True)
app.mount('/',StaticFiles(directory="./"))
app.add_middleware(DomainReplaceMiddleware,"https://happydoggo174.github.io/refactored-funicular/")
app.add_middleware(CORSMiddleware,allow_methods=['*'],allow_origins=['*'])
uvicorn.run(app,port=9000)