import { dislike_post, like_post,get_post_detail,get_post_comments,add_post_comments, VERCEL_URL,get_image } from "./api.js";
import { load_navbar,handle_resize } from "./script.js";
import { show_dialog,time_to_string } from "./tool.js";

import DOMPurify from './libs/dompurify 3.3.1.js';
let liked=false;
let disliked=false;
let like_btn=null;
let dislike_btn=null;
function render_post(data,comments){
    let tags="";
    let comments_string="";
    liked=data["liked"];
    disliked=data["disliked"];
    data["tags"].forEach(tag => {
        tags=tags.concat(`<span class='tags'>${DOMPurify.sanitize(tag)}</span>`);
    });
    if(comments!=null){
        comments.forEach((comment)=>{
            console.log("building comment string");
            comments_string=comments_string.concat(`
                <div class="comment">
                    <div class="row" style="margin-bottom:12px;">
                        <img src="${comment["profile"]}" width="30px" height="30px" style="border-radius:50%"></img>
                        <span>${DOMPurify.sanitize(comment["user"])}</span>
                    </div>
                    <span>${DOMPurify.sanitize(comment["content"])}</span>
                </div>
            `);
        });
    }
    return `
        <div class="row">
            <img src="${get_image(data["signature"],0)}" width="40px" height="40px" style="border-radius: 50%;">
            <div>
                <span style="font-size: 18px;">${DOMPurify.sanitize(data["group"])}</span>
                <div class="row">
                    <span>${DOMPurify.sanitize(data['author'])}</span>
                    <span>${time_to_string(parseInt(data["time"]))+"ago"}</span>
                </div>
            </div>
        </div>
        <h1>${DOMPurify.sanitize(data['tilte'])}</h1>
        <div class="row" style="margin-top: 12px;margin-bottom: 12px;">
            ${tags}
        </div>
        <div style="display: flex;">
            <img src="${get_image(data["signature"],1)}" style="flex-grow: 1;max-height: 90vh;max-width: 100%;">
        </div>
        <span class="post-body">${data["body"]!=undefined?DOMPurify.sanitize(data["body"]):""}</span>
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
        <div class="row">
            <textarea type="text" class="add-comment" placeholder="share your thought here" 
            maxlength="550" id="comment-field"></textarea>
            <button class="comment-btn" id="add-comment-btn" type="button">
                <img src="image/send.svg">
            </button>
        </div>
        <div style="margin-top: 14px;">${comments_string}</div>
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
        const content=document.getElementById('comment-field').value;
        if(content==""){
            return show_dialog("please enter comment before posting");
        }
        if(!await add_post_comments(content)){
            show_dialog("can't post comments");
        }
    }catch{}
}
async function handle_like(){
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
document.addEventListener("DOMContentLoaded",async (evt)=>{
    if(!await render_self()){
        return;
    }
    document.getElementById('add-comment-btn').addEventListener('click',post_comment);
    like_btn=document.getElementById('like-btn');
    dislike_btn=document.getElementById('dislike-btn');
    like_btn.addEventListener('click',handle_like);
    dislike_btn.addEventListener('click',handle_dislike);
    await load_navbar();
});
document.addEventListener('resize',handle_resize);
