//require api.js,dompurifier to be included first
import DOMPurify from './libs/dompurify 3.3.1.js';
import {get_post,get_image} from "./api.js";
import { load_navbar,handle_resize } from './script.js';
import { time_to_string } from './tool.js';
function get_now(){
    return Math.floor((new Date().getTime())/1000);
}
function html_escape(text){
    return DOMPurify.sanitize(text);
}
function load_dishes(dishes){
    let output="";
    dishes.forEach((dish)=>{
        output+=`
            <div class="post" id="${"dish:".concat(parseInt(dish["id"]).toString())}">
                <div class="post-info">
                    <div class="row">
                        <h3>${html_escape(dish["group"])}</h3>
                        <span>${time_to_string(parseInt(dish["time"])).concat('ago')}</span>
                    </div>
                    <div class="row">
                        <button class="cook-btn">let's cook</button>
                    </div>
                </div>
                <h1 class="post-tilte">${html_escape(dish['tilte'])}</h1>
                <div class="post-frame">
                    <img src="${get_image(dish['image'],0)}">
                </div>
                <div class="post-btn-rows">
                    <button class="post-btn like-btn">${parseInt(dish['likes'])} likes</button>
                    <button class="center-btn post-btn comment-btn">${parseInt(dish['comments_count'])}</button>
                    <button class="center-btn post-btn share-btn">share</button>
                </div>
            </div>
        `;
    });
    const main_content=document.getElementById('main-content');
    main_content.innerHTML=output;
    main_content.childNodes.forEach(div=>{
        if(div.tagName=="DIV"){
            div.addEventListener('click',(evt)=>{
                let target=evt.currentTarget;
                const id_string=target.id;
                const id=parseInt(id_string.split(':')[1]);
                const url=new URL('https://happydoggo174.github.io/refactored-funicular//post-detail.html');
                url.searchParams.append('post_id',id);;
                window.location.href=url.toString();
            });
        }
    });
}
document.addEventListener('DOMContentLoaded',async (evt)=>{
    await load_navbar();
    const dishes=await get_post();
    if(dishes!=null){   
        load_dishes(dishes);
    }
});
document.addEventListener('resize',handle_resize)