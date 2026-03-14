import { VERCEL_URL,add_post,SUPABASE_URL,get_post_detail, edit_post,make_pr, get_post_id } from "./api.js";
import {load_navbar,escapeHTML} from "./script.js";
import {show_dialog} from './tool.js';
import DOMPurify from "./libs/dompurify 3.3.1.js";
let tilte_changed=false;
let content_changed=false;
let tags_changed=false;
let post_id=null;
let is_contribute=false;
const drop_file=new Map([]);
const photos=new Map([]);
function generateSecureRandomHex(length) {
  // Calculate the number of bytes needed (each byte produces two hex characters)
  const byteLength = Math.ceil(length / 2); 
  const array = new Uint8Array(byteLength);
  
  // Fill the array with cryptographically secure random bytes
  window.crypto.getRandomValues(array);
  
  // Convert the bytes to a hexadecimal string
  let hexString = '';
  for (let i = 0; i < array.length; i++) {
    // Ensure each byte is converted to a two-character hex string (e.g., '0a' instead of 'a')
    hexString += array[i].toString(16).padStart(2, '0');
  }
  
  // Trim to the desired length if necessary
  return hexString.slice(0, length);
}
function create_photo_wrapper(evt,file,name){
    const photo_id=generateSecureRandomHex(24)+'.'+name.split('.').pop();
    const image=document.createElement("IMG");
    image.src=evt.target.result;
    image.style='max-height:80vh';
    image.id=photo_id;
    const close_btn=document.createElement('button');
    close_btn.innerHTML='<img src="image/close_black.svg"></img>';
    close_btn.style='position:absolute;right:0;';
    close_btn.addEventListener('click',()=>{
        document.getElementById('paragraph-list').removeChild(wrapper);
        photos.delete(photo_id);
    });
    const wrapper=document.createElement("DIV");
    wrapper.style="display:flex;justify-content:center;";
    wrapper.classList.add('image-wrapper');
    wrapper.appendChild(image);
    wrapper.appendChild(close_btn);
    photos.set(photo_id,file);
    return wrapper;
}
function select_photo(evt){
    const file=evt.target.files[0];
    if(file){
        const reader=new FileReader();
        const name=file.name;
        reader.onload=function(evt){
            const wrapper=create_photo_wrapper(evt,file,name);
            const paragraph=document.getElementById('paragraph-list');
            paragraph.appendChild(wrapper);
            const div=document.createElement("DIV");
            div.contentEditable=true;
            div.classList.add("paragraph-content");
            div.addEventListener('input',()=>{content_changed=true;});
            paragraph.appendChild(div);
        }
        reader.readAsDataURL(file);
    }
}
function add_photo(){
    const file_input=document.getElementById('file-input');
    file_input.click();
    file_input.addEventListener('input',select_photo);
}
function serialize_content(){
    const list=document.getElementById("paragraph-list").children;
    let content='';
    for(let i=0;i<list.length;i++){
        const elem=list[i];
        if(elem.classList.contains("row") || elem.classList.contains("tags-list")){
            continue;
        }
        if(!elem.classList.contains('image-wrapper')){
            content+=`<div>${elem.innerHTML}</div>`;
        }else{
            const photo_id=elem.querySelector('img').id;
            content+=`<img src="${`${SUPABASE_URL}/posts/image/${photo_id}`}" style="max-height:80vh;"></img>`;
        }
    }
    return content;
}
function save_tags(){
    const tags=document.getElementById('tags-list-inner').children;
    let tags_string=[];
    for(let i=0;i<tags.length;i++){
        tags_string.push(tags[i].querySelector("DIV").innerText);
    }
    return tags_string;
}
async function save_recipe_edit(){
    let tilte=null;
    let content=null;
    let tags=null;
    let dropped=null;
    let extra=null;
    if(tilte_changed){
        tilte=document.getElementById('tilte-banner').value;
    }
    if(content_changed){
        content=serialize_content();
    }
    if(tags_changed){
        tags=save_tags();
    }
    if(drop_file.size>0){
        dropped=[];
        for(let drop in drop_file.keys()){
            dropped.push(drop);
        }
    }
    if(photos.size>0){
        extra=[];
        for(const [id,file] of photos){
            extra.push([file,id]);
        }
    }
    let resp=false;
    if(is_contribute){
        resp=await make_pr({post_id:post_id,tilte:tilte,content:content,tags:tags,drop_file:dropped,extra_file:extra});
    }else{
        resp=await edit_post({tilte:tilte,content:content,tags:tags,drop_file:dropped,extra_file:extra});
    }
    if(resp){
        window.location.href='index.html';
    }
}
async function save_recipe(){
    if(post_id){
        return await save_recipe_edit();
    }
    const tilte=document.getElementById('tilte-banner').value;
    let content=serialize_content();
    const tags_string=save_tags();
    const files=[];
    for(const [id,file] of photos){
        files.push([file,id]);
    }
    const stat=(await add_post(tilte,content,tags_string,files));
    if(stat==200){
        return window.location.href=`index.html`;
    }
    if(stat==501){
        return show_dialog("the file format is not supported");
    }
}
function add_tags({content=null}){
    const tags=document.createElement("DIV");
    tags.innerHTML=`
        <div contenteditable="true" style="min-width:20px;margin-right:8px;height:100%;margin-left:6px">
            ${escapeHTML(content || "")}
        </div>
        <button style="border-radius:8px;">
            <img src="image/close_black.svg" style="border-radius:8px;"></img>
        </button>
    `;
    if(!content){
        tags_changed=true;
    }
    tags.querySelector('button').addEventListener('click',(evt)=>{
        tags_changed=true;
        const button=evt.currentTarget;
        const tags=button.parentElement;
        document.getElementById('tags-list-inner').removeChild(tags);
    });
    tags.classList.add("tag");
    document.getElementById("tags-list-inner").appendChild(tags);
}
async function deserialize_post(){
    const info=await get_post_detail(post_id);
    if(info==null){return;}
    info['tags'].forEach(tags => {
        add_tags({content:tags});
    });
    document.getElementById('tilte-banner').innerText=info['tilte'];
    const body=DOMPurify.sanitize(info['body'],{
        FORBID_TAGS:['math','svg','form'],
        FORBID_ATTR:['id','class','name'],
        RETURN_DOM:true
    });
    const paragraph=body.children;
    for(let i=0;i<paragraph.length;i++){
        if(paragraph[i].tagName=="IMG"){
            const wrapper=document.createElement('DIV');
            const image=document.createElement('img');
            image.src=paragraph[i].src;
            image.style.maxHeight='80vh';
            wrapper.appendChild(image);
            wrapper.classList.add('image-wrapper');
            wrapper.style='display:flex;justify-content:center;'
            const btn=document.createElement('btn');
            btn.innerHTML=`
                <img src="image/close_black.svg"></img>
            `;
            btn.style.position='absolute';
            btn.style.right='0';
            const params=image.src.split('/');
            btn.id=params[params.length-1];
            btn.addEventListener('click',()=>{
                drop_file.delete(btn.id);
            });
            wrapper.appendChild(btn);
            document.getElementById('paragraph-list').appendChild(wrapper);
        }else{
            const div=document.createElement("DIV");
            div.contentEditable=true;
            div.classList.add("paragraph-content");
            div.innerText=paragraph[i].innerText;
            div.addEventListener('input',()=>{content_changed=true;});
            document.getElementById('paragraph-list').appendChild(div);
        }
    }
}
document.addEventListener('DOMContentLoaded',async ()=>{
    const url=new URL(window.location.href);
    post_id=url.searchParams.get('post_id');
    is_contribute=url.searchParams.get('contribute');
    const upload_btn=document.getElementById('upload-btn');
    if(post_id){
        upload_btn.innerText='save';
        await deserialize_post();
    }
    if(is_contribute){
        upload_btn.innerText='submit change';
    }
    document.getElementById('upload-btn').addEventListener('click',save_recipe);
    document.getElementById('photo-add-btn').addEventListener('click',add_photo);
    document.getElementById('add-tag-btn').addEventListener('click',add_tags);
    document.getElementById('tilte-banner').addEventListener('input',()=>{tilte_changed=true;});
    document.getElementById('cancel-btn').addEventListener('click',()=>{history.go(-1)});
    await load_navbar();
});