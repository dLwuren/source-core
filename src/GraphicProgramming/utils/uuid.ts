
// let index = 0;
function uuid() {
    const id = new Date().getTime().toString(32)+"_" + Math.floor(Math.random() * 1000).toString(32);
    return id;
}

export {
    uuid
} 