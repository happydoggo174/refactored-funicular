import { get_user_info, VERCEL_URL,get_image } from "./api.js";
import { show_dialog } from "./tool.js";
import {handle_resize,toggle_sidebar} from "./script.js";
async function  change_password() {
    
}
function show_user_info(info){
    document.getElementById('user-profile-big').src=get_image(info["profile"],0);
    document.getElementById('username').innerText=info["name"];
    document.getElementById('stats-row').innerHTML=`
        <span>${parseInt(info["likes"])} likes</span>
        <span>${parseInt(info["dislikes"])} dislikes</span>
        <span>${parseInt(info["posts"])} posts</span>
        <span>${parseInt(info["comments"])} comments</span>
    `;
    document.getElementById('description-content').innerText=info["description"];
}
function setup_eventListener(){
    document.getElementById('change-password-btn').addEventListener('click',change_password);
    document.getElementById('menu_btn').addEventListener('click',toggle_sidebar);
    window.addEventListener('resize',handle_resize);
}
document.addEventListener('DOMContentLoaded',async (evt)=>{
    const info=await get_user_info();
    if(info==null){
        return show_dialog("error loading profile");
    }
    show_user_info(info);
    setup_eventListener();
});