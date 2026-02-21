let open_menu=window.innerWidth>=670;
import { get_user_info, VERCEL_URL } from "./api.js";
function set_user_info(info){
    document.getElementById('nav-login-btn').style.display='none';
    const profile=document.getElementById('user-profile');
    profile.src=info["profile"];
    const username=document.getElementById('nav-username');
    if(username!=null){
        username.innerText=info["name"];
    }
    profile.addEventListener('mouseenter',(evt)=>{
        if(username!=null){
            username.style.display="flex";
        }
    });
    profile.addEventListener('mouseleave',(evt)=>{
        if(username!=null){
            username.style.display="none";
        }
    });
}
export async function load_navbar(){
    document.getElementById('menu_btn').addEventListener('click',toggle_sidebar);
    const info=await get_user_info();
    if(info!=null){
        set_user_info(info);
    }
}
export function handle_resize(){
    if(window.innerWidth>=670){
        document.getElementById('side-bar').style.transform='translateX(0%)';
        open_menu=false;
    }else{
        if(open_menu==false){
            document.getElementById('side-bar').style.transform='translateX(-100%)';
        }
    }
}
function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}
export function toggle_sidebar(){
    const menu=document.getElementById("side-bar");
    if(open_menu){
        open_menu=false;
        menu.style.transform='translateX(-100%)';
    }else{
        open_menu=true;
        menu.style.transform='translateX(0%)';
    }
}
