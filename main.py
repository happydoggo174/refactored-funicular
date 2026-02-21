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
@app.get("/post/detail/{post_id}")
async def get_post_detail():
    return FileResponse("post-detail.html")
app.mount('/',StaticFiles(directory="./"))
app.add_middleware(CORSMiddleware,allow_methods=['*'],allow_origins=['*'])

print("link:http://127.0.0.1:9000/index.html")
uvicorn.run(app,port=9000)