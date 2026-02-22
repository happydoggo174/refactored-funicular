#workaround for cors issue
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
app=FastAPI()
app.mount('/',StaticFiles(directory="./"))
app.add_middleware(CORSMiddleware,allow_methods=['*'],allow_origins=['*'])
uvicorn.run(app,port=9000)