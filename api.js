export const GITHUB_URL='';
export const VERCEL_URL='https://automatic-giggle-ebon.vercel.app';
let auth_header=sessionStorage.getItem('auth');
if(auth_header!=null){
    auth_header={"Authorization":auth_header};
}
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
    if(profile!=""){
        form_data.append('profile',profile);
    }
    form_data.append("description",description)
    try{
        const resp=await fetch(`${VERCEL_URL}/auth/register`,{
            method:"POST",
            body:form_data
        });
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
        console.log("no auth header");
        return null;
    }
    try{
        const resp=await fetch(`${VERCEL_URL}/user/info`,{headers:auth_header});
        if(!resp.ok){return null;}
        return await resp.json();
    }catch{
        return null;
    }
}
export async function get_post(){
    let resp=null;
    try{
        resp=await fetch(`${VERCEL_URL}/post/home`);
        if(!resp.ok){
            return null;
        }
        return await resp.json();
    }catch{
        return null;
    }
}
export async function get_post_detail(post_id) {
    const url=`${VERCEL_URL}/post/detail/${post_id}`;
    try{
        const resp=await fetch(url);
        if(!resp.ok){return null;}
        return await resp.json();
    }catch{
        return null;
    }
}
function get_post_id(){
    return (new URL(window.location.href)).searchParams.get('post_id');
}
export async function like_post(){
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/like"));
    url.searchParams.append('post_id',post_id);
    try{
        const resp=await fetch(url,{method:"POST",});
        if(!resp.ok){return false;}
    }catch{
        return false;
    }
    return true;
}
export async function dislike_post(){
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/dislike"));
    url.searchParams.append('post_id',post_id);
    try{
        const resp=await fetch(url,{method:"POST",});
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
        const resp=await fetch(url);
        if(!resp.ok){
            return null;
        }
        return await resp.json();
    }catch{
        return null;
    }
}
export async function add_post_comments(content) {
    console.log("adding comments");
    const post_id=get_post_id();
    const url=new URL(VERCEL_URL.concat("/post/comment"));
    url.searchParams.append('post_id',post_id);
    const form_data=new FormData();
    form_data.append('content',content);
    try{
        const resp=await fetch(
            url,
            {
                method:"POST",
                body:form_data
            }
        );
        if(!resp.ok){
            return false;
        }
    }catch(e){
        console.log("error posting comment",e);
        return false;
    }
    console.log('added');
    return true;
}