export const GITHUB_URL='';
export const VERCEL_URL='https://automatic-giggle-ebon.vercel.app';
let auth_header=sessionStorage.getItem('auth');
let username=null;
let profile_sig=null;
if(auth_header!=null){
    auth_header={"Authorization":auth_header};
}
function runChallenge(html) {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    doc.open();
    doc.body.innerHTML=html;
    doc.close();

    // wait a bit for challenge script to run and set cookie
    setTimeout(() => {
      iframe.remove();
      resolve();
    }, 3000);
  });
}
async function check_challenge(resp){
    if(resp.status==403 && (resp.headers.get("content-type")||"").includes("text/html")){
        await runChallenge(resp.text());
        return true;
    }
    return false;
}
export async function ping() {
    if(auth_header!=null){
        const resp=await fetch(`${VERCEL_URL}/auth/ping`,{
            method:"POST",
            headers:auth_header
        });
        if(await check_challenge(resp)){
            await fetch(`${VERCEL_URL}/auth/ping`,{
                method:"POST",
                headers:auth_header
            });
        }
    }
}
export function get_username(){return username;}
export function get_profile(){return profile_sig;}
export function is_authenticated(){return auth_header!=null;}
export async function check_login(username,password){
    const form_data=new FormData();
    form_data.append("username",username);
    form_data.append("password",password);
    let resp=null;
    try{
        resp=await fetch(
            `${VERCEL_URL}/auth/login`,
            {
                method:"POST",
                body:form_data
            }
        );
        if(await check_challenge(resp)){
             resp=await fetch(
            `${VERCEL_URL}/auth/login`,
            {
                method:"POST",
                body:form_data
            }
        );
        }
    }catch{
        return false;
    }
    if(!resp.ok){
        return false;
    }
    const token=await resp.text();
    auth_header={'Authorization':`Bearer ${token}`}
    sessionStorage.setItem('auth',`Bearer ${token}`);
    return true;
}
export async function register(username,password,description,profile){
    const form_data=new FormData();
    form_data.append('username',username);
    form_data.append('password',password);
    if(profile!=null){
        form_data.append('profile',profile);
    }
    form_data.append("description","nothing to see here");
    try{
        let resp=await fetch(`${VERCEL_URL}/auth/register`,{
            method:"POST",
            body:form_data
        });
        if(await check_challenge(resp)){
            resp=await fetch(`${VERCEL_URL}/auth/register`,{
                method:"POST",
                body:form_data
            });
        }
        if(!resp.ok){
            return false;
        }
    }catch{
        return false;
    }
    return true;
}
export async function get_user_info(){
    if(auth_header==null){
        return null;
    }
    try{
        let resp=await fetch(`${VERCEL_URL}/user/info`,{headers:auth_header});
        if(await check_challenge(resp)){
            resp=await fetch(`${VERCEL_URL}/user/info`,{headers:auth_header});
        }
        if(!resp.ok){return null;}
        const r=await resp.json();
        profile_sig=get_image(r["profile"],0);
        return r;
    }catch{
        return null;
    }
}
export async function get_post(){
    let resp=null;
    try{
        resp=await fetch(`${VERCEL_URL}/post/home`);
        if(await check_challenge(resp)){
            resp=await fetch(`${VERCEL_URL}/post/home`);
        }
        if(!resp.ok){
            return null;
        }
        return await resp.json();
    }catch{
        return null;
    }
}
export async function get_post_detail(post_id) {
    const url=`${VERCEL_URL}/post/detail/${post_id}?version=2`;
    try{
        let resp=null;
        if(auth_header==null){
            resp=await fetch(url);
        }else{
            resp=await fetch(url,{headers:auth_header});
        }
        if(await check_challenge(resp)){
            if(auth_header==null){
                resp=await fetch(url);
            }else{
                resp=await fetch(url,{headers:auth_header});
            }
        }
        if(!resp.ok){return null;}
        return await resp.json();
    }catch(e){
        console.log(e);
        return null;
    }
}
function get_post_id(){
    return (new URL(window.location.href)).searchParams.get('post_id');
}
export async function like_post(){
    if(auth_header==null){return false;}
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/like"));
    url.searchParams.append('post_id',post_id);
    try{
        let resp=await fetch(url,{method:"POST",headers:auth_header});
        if(await check_challenge(resp)){
            resp=await fetch(url,{method:"POST",headers:auth_header});
        }
        if(!resp.ok){return false;}
    }catch{
        return false;
    }
    return true;
}
export async function dislike_post(){
    if(auth_header==null){return false;}
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/dislike"));
    url.searchParams.append('post_id',post_id);
    try{
        let resp=await fetch(url,{method:"POST",headers:auth_header});
        if(await check_challenge(resp)){
            resp=await fetch(url,{method:"POST",headers:auth_header});
        }
        if(!resp.ok){return false;}
    }catch{
        return false;
    }
    return true;
}
export async function get_post_comments() {
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/comment"));
    url.searchParams.append('post_id',post_id);
    try{
        let resp=await fetch(url);
        if(await check_challenge(resp)){
            resp=await fetch(url);
        }
        if(!resp.ok){
            return null;
        }
        return await resp.json();
    }catch{
        return null;
    }
}
export async function add_post_comments(content) {
    if(auth_header==null){return false;}
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/comment"));
    url.searchParams.append('post_id',post_id);
    const form_data=new FormData();
    form_data.append('content',content);
    try{
        let resp=await fetch(
            url,
            {
                method:"POST",
                body:form_data,
                headers:auth_header
            }
        );
        if(await check_challenge(resp)){
            resp=await fetch(
                url,
                {
                    method:"POST",
                    body:form_data,
                    headers:auth_header
                }
            );
        }
        if(!resp.ok){
            return false;
        }
    }catch(e){
        console.log("error posting comment",e);
        return false;
    }
    return true;
}
export function get_image(signature,idx){
    return `${VERCEL_URL}/image?signature=${signature}&idx=${idx}`;
}
export async function delete_post(post_id=null) {
    if(auth_header==null){return false;}
    if(post_id==null){
        post_id=get_post_id();
    }
    if(post_id==null){return false;}
    const url=new URL(`${VERCEL_URL}/post/remove`);
    url.searchParams.set('post_id',post_id);
    try{
        let resp=await fetch(
            url,{
                method:"DELETE",
                headers:auth_header
            }
        );
        if(await check_challenge(resp)){
            resp=await fetch(
                url,{
                    method:"DELETE",
                    headers:auth_header
                }
            );
        }
        return resp.ok;
    }catch{
        return false;
    }
}
export async function edit_user_info({username=null,password=null,profile=null,description=null}) {
    if(auth_header==null){return false;}
    try{
        const body=new FormData();
        if(username!=null){
            body.set('username',username);
        }
        if(password!=null){
            body.set('password',password);
        }
        if(profile!=null){
            body.set('profile',profile);
        }
        if(description!=null){
            body.set('description',description);
        }
        let resp=await fetch(`${VERCEL_URL}/user/info`,{
            method:"PUT",
            headers:auth_header,
            body:body
        });
        if(await check_challenge(resp)){
            resp=await fetch(`${VERCEL_URL}/user/info`,{
                method:"PUT",
                headers:auth_header,
                body:body
            });
        }
        return resp.ok;
    }catch{
        return false;
    }
}
export async function create_variant(){
    if(auth_header==null){return null;}
    const post_id=get_post_id();
    if(post_id==null){return null;}
    try{
        const url=new URL(`${VERCEL_URL}/post/fork`);
        url.searchParams.set("post_id",post_id);
        let resp=await fetch(url,{
            method:"POST",
            headers:auth_header            
        });
        if(await check_challenge(resp)){
            resp=await fetch(url,{
                method:"POST",
                headers:auth_header            
            });
        }
        if(!resp.ok){return null;}
        return await resp.text();
    }catch{
        return null;
    }
}
export async function edit_post({tilte=null,content=null,tags=null,images=null}) {
    const post_id=get_post_id();
    if(post_id==null || auth_header==null){return false;}
    const body=new FormData();
    try{
        if(tilte){
        body.append("tilte",tilte);
        }
        if(content){
            body.append("content",content);
        }
        if(tags){
            body.append(tags);
        }
        if(images){
            body.append(images);
        }
        let resp=await fetch(url,{
            method:"PUT",
            body:body,
            headers:auth_header
        });
        if(await check_challenge(resp)){
            resp=await fetch(url,{
                method:"PUT",
                body:body,
                headers:auth_header
            });
        }
        return resp.ok;
    }catch{
        return false;
    }
}