import { get_pr,get_post_detail } from "./api.js";
import { escapeHTML,load_navbar } from "./script.js";
import { time_to_string } from "./tool.js";
function view_pr(evt){
    window.location.href=`pr_detail.html?pr_id=${parseInt(evt.currentTarget.id)}`;
}
document.addEventListener('DOMContentLoaded',async()=>{
    const url=new URL(window.location.href);
    const post_id=url.searchParams.get('post_id');
    const pr=await get_pr(post_id);
    if(pr==null){return;}
    const post=await get_post_detail(post_id);
    document.getElementById('main-banner').innerText=`edit request for ${post['tilte']}`
    document.getElementById('request-edit-btn').addEventListener('click',()=>{
        window.location.href=`make-post.html?post_id=${post_id}&contribute=true`;
    })
    pr.forEach(req => {
        const node=document.createElement('DIV');
        node.classList.add('pull-request');
        node.innerHTML=`
            <div class="row">
                <img src="image/user_default.svg" alt="">
                <div>
                    <h2>${escapeHTML(req['message'])}</h2>
                    <div class="row">
                        <span>${escapeHTML(req['username'])}</span>
                        <span>${time_to_string(parseInt(req['time']),2).concat('ago')}</span>
                    </div>
                </div>
            </div>
        `; 
        node.addEventListener('click',view_pr)
        node.id=parseInt(req['id']);
        document.getElementById('pr-list').appendChild(node); 
    });
    await load_navbar();
});