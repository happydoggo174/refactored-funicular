
function get_now(){
    return Math.floor((new Date().getTime())/1000);
}
export function time_to_string(time,max_component=2){
    const delta=get_now()-time;
    const seconds=delta%60;
    const minutes=Math.floor(delta/60)%60;
    const hours=Math.floor(delta/3600)%24;
    const days=Math.floor(delta/86400)%7;
    const weeks=Math.floor(delta/604800);
    let output=[];
    if(weeks>0){
        if(weeks>1){
            output.push(`${weeks} weeks `);
        }else{
            output.push(`${weeks} week `);
        }
    }
    if(days>0){
        if(days>1){
            output.push(`${days} days `);
        }else{
            output.push(`${days} day `);
        }
    }
    if(hours>0){
        if(hours>1){
            output.push(`${hours} hours `);
        }else{
            output.push(`${hours} hour `);
        }
    }
    if(minutes>0){
        if(minutes>1){
            output.push(`${minutes} minutes `);
        }else{
            output.push(`${minutes} minute `);
        }
    }
    if(seconds>0){
        if(seconds>1){
            output.push(`${seconds} seconds `);
        }else{
            output.push(`${seconds} second `);
        }
    }
    if(output.length>max_component){
        output.length=max_component;
    }
    return output.join(" ");
}
export function show_dialog(msg){
    const dialog=document.createElement("div");
    dialog.id = "error_dialog";
    dialog.style.display = "flex";
    dialog.style.justifyContent = "center";
    dialog.style.alignItems = "center";
    dialog.innerHTML=`
        <div style="display:flex;justify-content:center;align-items:center;" id="error_dialog">
            <div style="position:fixed;
            z-index:1;
            padding:18px;
            border-radius:24px;
            border:2px solid black;
            background-color:white;">
                <span style="display:block;">${"error: ".concat(msg)}</span> 
                <div style="display:flex;flex-direction:row;justify-content:center;">
                    <button 
                        onclick="document.getElementById('error_dialog').remove()" 
                        style="padding:8px;
                        border-radius:12px;
                        margin-top:12px;
                        width:100%">ok</button>
                </div>
            </div>
        </div>
    `;
    document.getElementsByTagName('body').item(0).appendChild(dialog);
}