import {escapeHTML, load_navbar} from './script.js'
import { accept_pr, get_post_detail, get_pr_detail, delete_pr} from './api.js';
import DOMPurify from './libs/dompurify 3.3.1.js'
function diff_tags(old,changed){
    const old_tags=new Set(old);
    const new_tags=new Set(changed);
    const addded=[];
    const removed=[];
    for(const tag of new_tags){
        if(old_tags.delete(tag)){continue;}
        addded.push(escapeHTML(tag));
    }
    for(const tag of old_tags){
        removed.push(escapeHTML(tag));
    }
    return [addded,removed];
}
function render_body(elem,body){
    const safe_body=DOMPurify.sanitize(body,{
        FORBID_ATTR:['id','name','class'],
        FORBID_TAGS:['form','math','svg'],
        RETURN_DOM:true
    });
    elem.appendChild(safe_body);
}
document.addEventListener('DOMContentLoaded',async()=>{
    await load_navbar();
    const url=new URL(window.location.href);
    const pr_id=url.searchParams.get('pr_id')
    const detail=await get_pr_detail(pr_id);
    if(detail==null){return;}
    document.getElementById('approve-btn').addEventListener('click',async()=>{
        await accept_pr(pr_id);
    });
    document.getElementById('reject-btn').addEventListener('click',async()=>{
        await delete_pr(pr_id);
    });
    const old_data=await get_post_detail(detail['post_id'],true);
    if(old_data==null){return;}
    const tilte=detail['tilte']
    const tags=detail['tags']
    const body=detail['body']
    const message=detail['message'];
    document.getElementById('pr-message').innerText=message;
    if(tilte!=undefined){
        const tilte_area=document.getElementById('tilte-new');
        tilte_area.innerHTML=`
            <span style="font-size:18px;">tilte</span>
            <strike style="color:red;">${escapeHTML(old_data['tilte'])}</strike>
            <span>${escapeHTML(tilte)}</span>
        `;
        tilte_area.style.display='flex';
    }
    if(tags!=undefined){
        const [added,removed]=diff_tags(old_data['tags'],tags);
        const tags_area=document.getElementById('tags-new');
        tags_area.style.display='flex';
        let added_string='';
        let removed_string='';
        added.forEach((tag)=>{added_string+=`<span class='tags'>${escapeHTML(tag)}</span>`});
        removed.forEach((tag)=>{removed_string+=`<span class='tags'>${escapeHTML(tag)}</span>`});
        tags_area.innerHTML=`
            <span style="font-size:18px;">tags</span>
            <div class="row" style="margin-right:18px;">removed ${removed_string}</div>
            <div class="row" style="margin-right:18px;">added ${added_string}</div>
        `;
    }
    if(body!=undefined){
        document.getElementById('body-banner').style.display='block';
        document.getElementById('body-div').style.display='flex';
        document.getElementById('new-body-btn').addEventListener('click',()=>{
            document.getElementById('old-body').style.display='none';
            document.getElementById('new-body').style.display='flex';
        });
        document.getElementById('old-body-btn').addEventListener('click',()=>{
            document.getElementById('new-body').style.display='none';
            document.getElementById('old-body').style.display='flex';
        });
        render_body(document.getElementById('new-body'),body);
        render_body(document.getElementById('old-body',old_data['body']));
    }
});