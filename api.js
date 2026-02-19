export const GITHUB_URL=''
export async function check_login(username,password){
    return username=='admin' && password=='admin';
}
export async function get_user_info(){
    return {"name":"username","profile":"image/ramen.webp"}
}
export async function get_post(){
    return [{"group":"donut","time":1771498181,"tilte":"my first attempt at this dish","image":"image/donuts.avif",
    "likes":31,"comments":23},{"group":"donut","time":1771498181,"tilte":"<b>my first attempt at this dish</b>","image":"image/donuts.avif",
    "likes":31,"comments":23},{"group":"donut","time":1771498181,"tilte":"my first attempt at this dish","image":"image/donuts.avif",
    "likes":31,"comments":23},];
}