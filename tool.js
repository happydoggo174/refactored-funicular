function get_now(){
    return Math.floor((new Date().getTime())/1000);
}
export function time_to_string(time){
    const delta=get_now()-time;
    console.log(delta)
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