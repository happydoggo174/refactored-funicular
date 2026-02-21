export const GITHUB_URL='';
export const VERCEL_URL='http://127.0.0.1:9000';
let auth_header=sessionStorage.getItem('auth');
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
    auth_header={'Authorization':`Bearer ${await resp.text()}`}
    return true;
}
export async function get_user_info(){
    if(auth_header==null){
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
export async function get_post_comments(post_id){
    return [
        {"name":"phuc","time":1771498492,
        "content":"that's a nice first attempt.Keep on trying.I'm sure you'll get better quickly",
        "profile":"image/ramen.webp"}
    ];
}