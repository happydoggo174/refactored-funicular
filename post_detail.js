import { dislike_post, like_post,get_post_detail } from "./api.js";
import { load_navbar,handle_resize } from "./script.js";
import { show_dialog,time_to_string } from "./tool.js";

import DOMPurify from './libs/dompurify 3.3.1';
function render_post(data){
    let tags="";
    let comments="";
    data["tags"].forEach(tag => {
        tags=tags.concat(`<span class='tags'>${DOMPurify.sanitize(tag)}</span>`);
    });
    return `
        <div class="row">
            <img src="${data['group_image']}" width="40px" height="40px" style="border-radius: 50%;">
            <div>
                <span style="font-size: 18px;">donuts</span>
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
            <img src="${data["image"]}" style="flex-grow: 1;max-height: 90vh;max-width: 100%;">
        </div>
        <div class="row" style="margin-top: 12px;">
            <button class="row bottom-btn like-btn" id='like-btn'>
                <img src="image/like.svg">
                <span>${parseInt(data["likes"])}</span>
            </button>
            <button class="row bottom-btn dislike-btn" id='dislike-btn'>
                <img src="image/dislike.svg">
                <span>${parseInt(data["dislikes"])}</span>
            </button>
        </div>
        <div class="row">
            <textarea type="text" class="add-comment" placeholder="share your thought here" maxlength="550"></textarea>
            <button class="comment-btn">
                <img src="image/send.svg">
            </button>
        </div>
        <div style="margin-top: 14px;">${comments}</div>
    `;
}
async function render_self(){
    const params=window.location.href.split("/");
    const post_id=params[params.length-1];
    const info=await get_post_detail(post_id);
    if(info==null){
        show_dialog("error loading post");
        return;
    }
    document.getElementById('main-content').innerHTML=render_post(info);
}
document.addEventListener("DOMContentLoaded",async (evt)=>{
    await render_self();
    const like_btn=document.getElementById('like-btn');
    const dislike_btn=document.getElementById('dislike-btn');
    like_btn.addEventListener('click',async (evt)=>{
        if(!await like_post()){
            show_dialog("can't like this post");
            return;
        }
        const count_text=like_btn.getElementsByTagName('span').item(0);
        const like=parseInt(count_text.innerText)+1;
        count_text.innerText=like.toString();
    });
    dislike_btn.addEventListener('click',async (evt)=>{
        if(!await dislike_post()){
            show_dialog("can't dislike this post");
            return;
        }
        const count_text=dislike_btn.getElementsByTagName('span').item(0);
        const dislike=parseInt(count_text.innerText)+1;
        count_text.innerText=dislike.toString();
    });
    await load_navbar();
});
document.addEventListener('resize',handle_resize);
