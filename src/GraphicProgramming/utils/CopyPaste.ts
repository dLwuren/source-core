
export function copy(str=""){
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => {
            console.log('复制成功');
        });
    } else {
        const input = document.createElement('input');
        input.value = str;
        input.style.position = 'absolute';
        input.style.opacity = '0';
        input.style.left = '-999999px';
        input.style.top = '-999999px';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        input.remove();
    }
}

export function paste(fun:any){
    if (navigator.clipboard && window.isSecureContext) {
         navigator.clipboard.readText().then(text=>{
            fun(text);
         });
    }
}