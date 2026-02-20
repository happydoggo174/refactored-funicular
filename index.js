//require api.js,dompurifier to be included first
import DOMPurify from './libs/dompurify 3.3.1';
import {get_post,get_user_info} from "./api.js";
function set_user_info(info){
    document.getElementById('login-btn').style.display='none';
    const profile=document.getElementById('user-profile');
    profile.src=info["profile"];
    document.getElementById('username').innerText=info['name'];
    profile.addEventListener('mouseenter',(evt)=>{
        document.getElementById('username').style.display='flex';
    });
    profile.addEventListener('mouseleave',(evt)=>{
        document.getElementById('username').style.display='none';
    });
}
function get_now(){
    return Math.floor((new Date().getTime())/1000);
}
function time_to_string(time){
    const delta=get_now()-time;
    const seconds=delta%60;
    const minutes=Math.floor(delta/60)%60;
    const hours=Math.floor(delta/3600)%24;
    const days=Math.floor(delta/86400)%7;
    const weeks=Math.floor(delta/604800);
    let output='';
    if(weeks>0){
        if(weeks>1){
            output=output.concat(`${weeks} weeks `);
        }else{
            output=output.concat(`${weeks} week `);
        }
    }
    if(days>0){
        if(days>1){
            output=output.concat(`${days} days `);
        }else{
            output=output.concat(`${days} day `);
        }
    }
    if(hours>0){
        if(hours>1){
            output=output.concat(`${hours} hours `);
        }else{
            output=output.concat(`${hours} hour `);
        }
    }
    if(minutes>0){
        if(minutes>1){
            output=output.concat(`${minutes} minutes `);
        }else{
            output=output.concat(`${minutes} minute `);
        }
    }
    if(seconds>0){
        if(seconds>1){
            output=output.concat(`${seconds} seconds `);
        }else{
            output=output.concat(`${seconds} second `);
        }
    }
    return output;
}
function html_escape(text){
    return DOMPurify.sanitize(text);
}
function load_dishes(dishes){
    let output="";
    dishes.forEach((dish)=>{
        output+=`
            <div class="post" id="">
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
                <img src="${html_escape(dish['image'])}">
            </div>
            <div class="post-btn-rows">
                <button class="post-btn">${parseInt(dish['likes'])} likes</button>
                <button class="center-btn post-btn comment-btn">${parseInt(dish['comments'])}</button>
                <button class="center-btn post-btn share-btn">share</button>
            </div>
        </div>
        `;
    });
    document.getElementById('main-content').innerHTML=output;
}
document.addEventListener('DOMContentLoaded',async (evt)=>{
    const dishes=await get_post();
    if(dishes!=null){
        load_dishes(dishes);
    }
    const info=await get_user_info();
    if(info!=null){
        set_user_info(info);
    }
});