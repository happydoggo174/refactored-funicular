import { get_user_info, VERCEL_URL,get_image,edit_user_info } from "./api.js";
import { show_dialog } from "./tool.js";
import {handle_resize,toggle_sidebar,load_navbar} from "./script.js";
async function save_pass_edit(){
    const password=document.getElementById('password-field').value;
    if(password==""){
        return show_dialog("please enter your password");
    }
    const stat=await edit_user_info({password:password});
    if(!stat){
        show_dialog("error updating password");
    }
    container.removeChild(pass_div);
    change_btn.style.display="inline-block";
}
function toggle_password(){
    const field=document.getElementById('password-field');
    if(field.type=="password"){
        field.type="text";
        document.getElementById('pass-img').src="image/eye_open.svg";
    }else{
        field.type="password";
        document.getElementById('pass-img').src="image/eye_closed.svg";
    }
}
function make_pass_div(){
    const pass_div=document.getElementById('pass-container');
    pass_div.innerHTML=`
    <div class="row">
        <span>new password</span>
        <input type="password" id="password-field"></input>
        <button id="show-pass-btn">
            <img src="image/eye_closed.svg" id='pass-img'></img>
        </button>
    </div>
    <div class="row">
        <button id="confirm-btn">confirm</button>
        <button id="cancel-btn">cancel</button>
    </div>
    `;
    return pass_div;
}
async function change_password() {
    const pass_div=make_pass_div();
    const change_btn=document.getElementById('change-password-btn');
    change_btn.style.display='none';
    pass_div.querySelector('#confirm-btn').addEventListener('click',save_pass_edit);
    pass_div.querySelector('#cancel-btn').addEventListener('click',()=>{
        pass_div.innerHTML="";
        change_btn.style.display="inline-block";
    });
    pass_div.querySelector("#show-pass-btn").addEventListener('click',toggle_password);
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
function set_username_ui(){
    document.getElementById('username-container').style.display="none";
    const container=document.getElementById('username-edit');
    const name=document.getElementById('username').innerText;
    container.innerHTML=`
        <input type="text" style="height:100%" id="username-field"></input>
        <button class="yes-btn">
            <img src="image/yes.svg" id="username-confirm"></img>
        </button>
        <button class="no-btn">
            <img src="image/close.svg" id="username-cancel"></img>
        </button>
    `;
    container.querySelector("#username-field").value=name;
    return container;
}
async function set_username(){
    const username=document.getElementById('username-field').value;
    if(username==""){
        return show_dialog("please enter username");
    }
    const stat=await edit_user_info({username:username});
    if(!stat){
        return show_dialog("error editing username");
    }
    document.getElementById('username-edit').innerHTML=``;
    const name=document.getElementById('username-container');
    name.style.display="flex";
    document.getElementById('username').innerText=username;
}
function change_username(){
    const container=set_username_ui();
    container.querySelector("#username-confirm").addEventListener('click',set_username);
    container.querySelector("#username-cancel").addEventListener('click',()=>{
        container.innerHTML=``;
        document.getElementById('username-container').style.display="flex";
    });
}
async function set_description(){
    let description=document.getElementById('description-field').value;
    if(description==""){
        description="nothing to see here";
    }
    const stat=await edit_user_info({description:description});
    if(!stat){
        return show_dialog("error editing description");
    }
    const container=document.getElementById('description-edit-div');
    container.innerHTML=``;
    document.getElementById('change-description-btn').style.display="inline-block";
    document.getElementById('description-field').style.display='none';
    const desc=document.getElementById('description-content');
    desc.innerText=description;
    desc.style.display="block";
}
function set_description_ui(){
    document.getElementById('change-description-btn').style.display="none";
    const desc=document.getElementById('description-content');
    desc.style.display="none";
    const field=document.getElementById('description-field');
    field.innerText=desc.innerText;
    field.style.display='flex';
    const container=document.getElementById('description-edit-div');
    container.innerHTML=`
        <button class="yes-btn">
            <img src="image/yes.svg" id="description-confirm"></img>
        </button>
        <button class="no-btn">
            <img src="image/close.svg" id="description-cancel"></img>
        </button>
    `;
    return container;
}
function change_description(){
    const container=set_description_ui();
    container.querySelector("#description-confirm").addEventListener('click',set_description);
    container.querySelector("#description-cancel").addEventListener('click',()=>{
        container.innerHTML=``;
        document.getElementById('change-description-btn').style.display="inline-block";
        document.getElementById('description-field').style.display='none';
        document.getElementById('description-content').style.display="block";
    });
}
function setup_eventListener(){
    document.getElementById('change-password-btn').addEventListener('click',change_password);
    document.getElementById('menu_btn').addEventListener('click',toggle_sidebar);
    document.getElementById('change-username-btn').addEventListener('click',change_username);
    document.getElementById('change-description-btn').addEventListener('click',change_description);
}
document.addEventListener('DOMContentLoaded',async (evt)=>{
    await load_navbar(false);
    const info=await get_user_info();
    if(info==null){
        return show_dialog("error loading profile");
    }
    show_user_info(info);
    setup_eventListener();
});