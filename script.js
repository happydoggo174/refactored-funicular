let open_menu=window.innerWidth>=670;
document.addEventListener('DOMContentLoaded',(ev)=>{
    Array.from(document.getElementsByClassName('post')).forEach(element => {
        element.addEventListener('click',(ev)=>{
            const id=ev.target.id;
            if(id==null){
                print();
            }else{
                console.log("id found");
            }
        });
    });
});
function handle_resize(){
    if(window.innerWidth>=670){
        document.getElementById('side-bar').style.transform='translateX(0%)';
        open_menu=false;
    }else{
        if(open_menu==false){
            document.getElementById('side-bar').style.transform='translateX(-100%)';
        }
    }
}
function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}
function toggle_sidebar(){
    const menu=document.getElementById("side-bar");
    if(open_menu){
        open_menu=false;
        menu.style.transform='translateX(-100%)';
    }else{
        open_menu=true;
        menu.style.transform='translateX(0%)';
    }
}
