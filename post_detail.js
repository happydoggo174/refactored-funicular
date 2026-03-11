import { dislike_post, like_post,get_post_detail,get_post_comments,add_post_comments, VERCEL_URL,get_public_image,
is_authenticated,get_username,get_profile,delete_post,get_image } from "./api.js";
import { load_navbar,handle_resize,escapeHTML } from "./script.js";
import { show_dialog,time_to_string } from "./tool.js";

import DOMPurify from './libs/dompurify 3.3.1.js';
let liked=false;
let disliked=false;
let like_btn=null;
let dislike_btn=null;
let send_btn=null;
let is_owner=false;
function render_post(data,comments){
    let tags="";
    let comments_string="";
    liked=data["liked"];
    disliked=data["disliked"];
    data["tags"].forEach(tag => {
        tags=tags.concat(`<span class='tags'>${escapeHTML(tag)}</span>`);
    });
    is_owner=data["deletable"]!=false;
    if(comments!=null){
        comments.forEach((comment)=>{
            const profile=get_image(comment["profile"],0);
            comments_string=comments_string.concat(`
                <div class="comment">
                    <div class="row" style="margin-bottom:12px;">
                        <img src="${profile}" width="30px" height="30px" style="border-radius:50%"></img>
                        <span>${escapeHTML(comment["user"])}</span>
                    </div>
                    <span>${escapeHTML(comment["content"])}</span>
                </div>
            `);
        });
    }
    return `
        <div class="row" style="justify-content: space-between;">
            <img src="${get_public_image(data["author_img"])}" width="40px" height="40px" style="border-radius: 50%;">
            <div>
                <div class="row">
                    <span>${escapeHTML(data['author'])}</span>
                    <span>${time_to_string(parseInt(data["time"]))+"ago"}</span>
                </div>
            </div>
            <div style="flex-grow:1;"></div>
            <div id="menu-div">
                <div id="option-menu">
                    <button>create variant</button>
                    <button id="post-delete-btn">delete post</button>
                    <button>report as spam</button>
                </div>
                <button id="menu-btn">
                    <img src="image/more.svg"></img>
                </button>
            </div>
        </div>
        <h1>${escapeHTML(data['tilte'])}</h1>
        <div class="row" style="margin-top: 12px;margin-bottom: 12px;">
            ${tags}
        </div>
        <div>${DOMPurify.sanitize(data['body'],{FORBID_ATTR:["id","class"],FORBID_TAGS:["svg","math"]})}</div>
        <div class="row" style="margin-top: 12px;">
            <button class="row bottom-btn like-btn" id='like-btn'>
                <img src="${liked?"image/like_filled.svg":"image/like.svg"}" id="like-img">
                <span>${parseInt(data["likes"])}</span>
            </button>
            <button class="row bottom-btn dislike-btn" id='dislike-btn'>
                <img src="${disliked?"image/dislike_filled.svg":"image/dislike.svg"}" id="dislike-img">
                <span>${parseInt(data["dislikes"])}</span>
            </button>
        </div>
        <div class="row" id="add-comment-area">
            <textarea type="text" class="add-comment" placeholder="share your thought here" 
            maxlength="550" id="comment-field"></textarea>
            <button class="comment-btn" id="add-comment-btn" type="button">
                <img src="image/send.svg">
            </button>
        </div>
        <div style="margin-top: 14px;" id="comment-area">${comments_string}</div>
    `;
}
async function render_self(){
    const post_id=new URL(window.location.href).searchParams.get('post_id');
    const [info,comments]=await Promise.all([get_post_detail(post_id),get_post_comments()]);
    if(info==null){
        show_dialog("error loading post");
        return false;
    }
    document.getElementById('main-content').innerHTML=render_post(info,comments);
    return true;
}
function add_span_value(span,val){
    const text=span.innerText;
    const value=parseFloat(text)+val;
    span.innerText=value.toString();
}
async function post_comment(evt){
    try{
        if(!is_authenticated()){
            return show_dialog("please login to comment");
        }
        const content=document.getElementById('comment-field').value;
        if(content==""){
            return show_dialog("please enter comment before posting");
        }
        if(!await add_post_comments(content)){
            return show_dialog("can't post comments");
        }
        const new_comment=document.createElement("DIV");
        new_comment.classList.add('comment');
        new_comment.innerHTML=`
            <div class="row" style="margin-bottom:12px;">
                <img src="${get_profile()}" width="30px" height="30px" style="border-radius:50%"></img>
                <span>${escapeHTML(get_username())}</span>
            </div>
            <span>${escapeHTML(content)}</span>`;
        document.getElementById('comment-area').appendChild(new_comment);
        document.getElementById('add-comment-area').remove();
    }catch{}
}
async function handle_like(){
    if(!is_authenticated()){
        return show_dialog("please login to like this post");
    }
    if(liked){return;}
    if(!await like_post()){
        return show_dialog("can't like this post");
    }
    liked=true;
    if(disliked){
        add_span_value(dislike_btn.getElementsByTagName('span').item(0),-1);
        document.getElementById("dislike-img").src="image/dislike.svg";
    }
    disliked=false;
    add_span_value(like_btn.getElementsByTagName('span').item(0),1);
    document.getElementById('like-img').src="image/like_filled.svg";
}
async function handle_dislike(){
    if(!is_authenticated()){
        return show_dialog("please login to dislike this post");
    }
    if(disliked){return;}
    if(!await dislike_post()){
        return show_dialog("can't dislike this post");
    }
    disliked=true;
    if(liked){
        add_span_value(like_btn.getElementsByTagName('span').item(0),-1);
        document.getElementById("like-img").src="image/like.svg";
    }
    liked=false;
    add_span_value(dislike_btn.getElementsByTagName('span').item(0),1);
    document.getElementById("dislike-img").src="image/dislike_filled.svg";
}
function handle_send_btn(evt){
    if(send_btn==null){
        send_btn=document.getElementById('add-comment-btn');
    }
    const comment_field=document.getElementById('comment-field')
    const value=comment_field.value;
    if(value==""){
        send_btn.style.backgroundColor="blue";
        send_btn.style.opacity="0.5";
    }else{
        send_btn.style.backgroundColor="green";
        send_btn.style.opacity="1";
    }
}
function handle_comment_hover(evt){
    if(send_btn==null){
        send_btn=document.getElementById('add-comment-btn');
    }
    if(evt.type=="mouseleave"){
        send_btn.style.boxShadow="";
    }else{
        const value=document.getElementById('comment-field').value;
        if(value!=""){
            send_btn.style.boxShadow="1px 0 5px 4px";
        }
    }
}
function init_comment(){
    document.getElementById('add-comment-btn').addEventListener('click',post_comment);
    const comment_field=document.getElementById('comment-field');
    comment_field.addEventListener('input',handle_send_btn);
    send_btn=document.getElementById('add-comment-btn');
    send_btn.addEventListener('mouseenter',handle_comment_hover);
    send_btn.addEventListener('mouseleave',handle_comment_hover);
    if(!is_authenticated()){
        send_btn.remove();
        comment_field.placeholder="please login to comment";
        comment_field.readOnly=true;
    }
}
async function handle_delete_post(evt){
    const stat=await delete_post();
    if(!stat){
        show_dialog("can't delete this post");
    }
    document.location.href="index.html";
}
function init_menu(){
    const delete_btn=document.getElementById('post-delete-btn');
    if(is_owner){
        delete_btn.addEventListener('click',handle_delete_post);
    }else{
        delete_btn.style.display='none';
    }
}
function show_more(){ 
    const menu=document.getElementById('option-menu');
    if(menu.style.display=='none'){
        menu.style.display='flex';
    }else{
        menu.style.display='none';
    }
}
document.addEventListener("DOMContentLoaded",async (evt)=>{
    if(!await render_self()){
        return;
    }
    like_btn=document.getElementById('like-btn');
    dislike_btn=document.getElementById('dislike-btn');
    like_btn.addEventListener('click',handle_like);
    dislike_btn.addEventListener('click',handle_dislike);
    document.getElementById('menu-btn').addEventListener('click',show_more);
    init_comment();
    init_menu();
    await load_navbar();
});
document.addEventListener('resize',handle_resize);
