import { VERCEL_URL,add_post } from "./api.js";
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
function select_photo(evt){
    const file=evt.target.files[0];
    if(file){
        const reader=new FileReader();
        reader.onload=function(evt){
            const image=document.createElement("IMG");
            image.src=evt.target.result;
            image.style='max-height:80vh';
            const wrapper=document.createElement("DIV");
            wrapper.style="display:flex;justify-content:center;";
            wrapper.appendChild(image)
            const paragraph=document.getElementById('paragraph-list');
            paragraph.appendChild(wrapper);
            const div=document.createElement("DIV");
            div.contentEditable=true;
            div.classList.add("paragraph-content");
            paragraph.appendChild(div);
            const photo_id=generateSecureRandomHex(24);
            photos.set(photo_id,file);
        }
        reader.readAsDataURL(file);
    }
}
function add_photo(){
    const file_input=document.getElementById('file-input');
    file_input.click();
    file_input.addEventListener('input',select_photo);
}
async function save_recipe(){
    const tilte=document.getElementById('tilte-banner').value;
    const list=document.getElementById("paragraph-list").children;
    let content='';
    for(let i=0;i<list.length;i++){
        const elem=list[i];
        if(elem.classList.contains("row") || elem.classList.contains("tags-list")){
            continue;
        }
        if(elem.contentEditable){
            content+=`<span>${elem.innerText}</span>`;
        }else{
            const photo_id=elem.querySelector('img').id;
            content+=`<img src=${`${VERCEL_URL}/post/image/${photo_id}`}>`;
        }
    }
    const tags=document.getElementById('tags-list-inner').children;
    let tags_string=[];
    for(let i=0;i<tags.length;i++){
        tags_string+=tags[i].querySelector("DIV").innerHTML;
    }
    const files=[];
    for(const [id,file] of photos){
        files.push([file,id]);
    }
    console.log(await add_post(tilte,content,tags_string,files));
}
function add_tags(){
    const tags=document.createElement("DIV");
    tags.innerHTML=`
        <div contenteditable="true" style="min-width:20px;margin-right:8px;height:100%;margin-left:6px"></div>
        <button style="border-radius:8px;">
            <img src="image/close_black.svg" style="border-radius:8px;"></img>
        </button>
    `;
    tags.querySelector('button').addEventListener('click',(evt)=>{
        const button=evt.currentTarget;
        const tags=button.parentElement;
        document.getElementById('tags-list-inner').removeChild(tags);
    });
    tags.classList.add("tag");
    document.getElementById("tags-list-inner").appendChild(tags);
}
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('photo-add-btn').addEventListener('click',add_photo);
    document.getElementById('upload-btn').addEventListener('click',save_recipe);
    document.getElementById('add-tag-btn').addEventListener('click',add_tags);
});