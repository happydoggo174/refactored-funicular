#workaround for cors issue
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
app=FastAPI()
@app.get('/libs/{filename}')
def get_library(filename:str):
    filename=os.path.basename(filename)#prevent path traversal
    return FileResponse("libs/"+filename,media_type="application/javascript")
app.mount('/',StaticFiles(directory="./"))
app.add_middleware(CORSMiddleware,allow_methods=['*'],allow_origins=['*'])
@app.get('')
def root():return FileResponse("index.html")
print("link:http://127.0.0.1:9000/index.html")
uvicorn.run(app,port=9000)