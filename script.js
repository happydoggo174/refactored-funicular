let open_menu=window.innerWidth>=670;
import { get_user_info, VERCEL_URL,ping, is_authenticated,SUPABASE_URL} from "./api.js";
function set_user_info(info){
    document.getElementById('nav-login-btn').style.display='none';
    const profile=document.getElementById('user-profile');
    profile.src=`${VERCEL_URL}/image/?signature=${info["profile"]}&idx=0`;
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
export async function load_navbar(load_user=true){
    window.addEventListener('resize',handle_resize);
    document.getElementById('menu_btn').addEventListener('click',toggle_sidebar);
    if(is_authenticated()){
        document.getElementById('post-btn').addEventListener('click',()=>{window.location.href="make-post.html"});
    }else{
        document.getElementById('post-btn').style.display="none";
    }
    if(!load_user){return;}
    if(is_authenticated()){
        document.getElementById('user-profile').addEventListener('click',(evt)=>{
            window.location.href="account_page.html";
        });
    }
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
export function run_sbx(container, htmlContent) {
  const iframe = document.createElement("iframe");

  iframe.setAttribute("sandbox","");

  iframe.style.width = "100%";
  iframe.style.border = "none";
  // Prevent same-origin access
  iframe.srcdoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy"
              content="img-src ${SUPABASE_URL}">
        <style>
          body { margin: 0; font-family: sans-serif; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  container.appendChild(iframe);
}
document.addEventListener('DOMContentLoaded',async(evt)=>{
    setInterval(ping,360*1000);
});
export function escapeHTML(str) {
    var p = document.createElement("p");
    p.textContent = str; // Use .textContent to treat the input as plain text
    return p.innerHTML;  // Retrieve the safely escaped HTML
}