import { register,GITHUB_URL } from "./api.js";
import { load_navbar } from "./script.js";
import { show_dialog } from "./tool.js";
const login_bg=["image/ramen.webp","image/shrimp_salad.webp","image/hotpot.webp"];
const login_bg_mobile=["image/ramen-mobile.webp","image/shrimp_salad-mobile.webp","image/hotpot-mobile.webp"];
let bg_index=0;
function switch_image(){
    let filename=login_bg[bg_index];
    if(window.innerWidth<=670){
        filename=login_bg_mobile[bg_index];
    }
    document.getElementById("bg").src=filename;
    bg_index=(bg_index+1)%login_bg.length;
    setTimeout(switch_image,20000);
}
let offsetX = 0;
let offsetY = 0;
let rotation = 0;
function naughtyButtonHandler(evt) {
    const btn = evt.target;
    const btnRect = btn.getBoundingClientRect();
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    // Calculate vector from mouse to button center
    const vecX = (btnRect.left + btnRect.width / 2) - mouseX;
    const vecY = (btnRect.top + btnRect.height / 2) - mouseY;

    // Normalize the vector
    const distance = Math.sqrt(vecX * vecX + vecY * vecY);
    const epsilon = 1e-6;
    const normX = vecX / (distance + epsilon);
    const normY = vecY / (distance + epsilon);

    // How far to move the button
    const moveAmount = 64;

    // Calculate new position
    offsetX += normX * moveAmount;
    offsetY += normY * moveAmount;

    const maxX = 400;
    const maxY = 250;

    // Calculate rotation based on horizontal mouse position relative to button
    const rotationAmount = -normX * 15;
    rotation += rotationAmount;

    const isOutOfRange = (offsetX < -maxX || offsetX > maxX || offsetY < -maxY || offsetY > maxY);
    if (isOutOfRange) {
        offsetX = 0;
        offsetY = 0;
        rotation = 0;
    } else {
        offsetX = Math.max(-maxX, Math.min(offsetX, maxX));
        offsetY = Math.max(-maxY, Math.min(offsetY, maxY));
    }


    // Apply new position and rotation
    btn.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
}
async function handle_register(evt){
    const username=document.getElementById('username').value;
    const password=document.getElementById('pass_field').value;
    const filename=document.getElementById('profile-field').value;
    if(username=="" || password==""){
        naughtyButtonHandler(evt);
    }else{
        evt.target.style.transform='translate(0px,0px)';
        evt.target.style.rotate='0px'
        if(evt.type=='click'){
            if(!await register(username,password,filename)){
                show_dialog("this username had been taken");
            }else{
                show_dialog("register successfully");
                window.location.href=GITHUB_URL.concat('login.html');
            }
        }
    }
}
function toggle_pass_field(){
    const field=document.getElementById('pass_field');
    if(field.type=='text'){
        field.type='password';
        document.getElementById('pass_img').src='image/eye_closed.svg';
    }else{
        field.type='text';
        document.getElementById('pass_img').src='image/eye_open.svg'
    }
}
document.addEventListener('DOMContentLoaded',async(ev)=>{
    switch_image();
    document.getElementById('pass_btn').addEventListener('click',toggle_pass_field);
    document.getElementById('login-btn-main').addEventListener('click',(evt)=>{
        window.location.href=GITHUB_URL.concat("login.html");
    });
    const register_btn=document.getElementById('register-btn');
    register_btn.addEventListener('mouseenter',handle_register);
    register_btn.addEventListener('click',handle_register);
    const profile_field=document.getElementById('profile-field');
    profile_field.addEventListener('change',(evt)=>{
        const files=evt.target.files;
        if(files==null || files.length==0){
            return;
        }
        const display=document.getElementById("profile-img");
        if(display.style.display=='none'){
            display.style.display='flex';
        }
        const reader=new FileReader();
        reader.onload=function(evt){
            display.src=evt.target.result;
        }
        reader.readAsDataURL(files[0]);
        const padding=document.getElementById('top-padding');
        padding.style.marginTop='10vh';
    });
});