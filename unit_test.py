import requests
import os
BASE_ADDR="http://127.0.0.1:8000/"
token=requests.post(f"{BASE_ADDR}/auth/login",data={"username":"phuc","password":"sigmaboy"}).content
token=token.decode().replace("'","")
auth_header={"Authorization":f"Bearer {token}"}
print(auth_header)
up=[("image/ramen.webp",open("image/ramen.webp","rb"))]
resp=requests.post(f"{BASE_ADDR}/post/make",headers=auth_header,params={"group_id":1},data={"tilte":"ef",
    "content":"wert",},files=up)
print(resp.status_code,resp.content)