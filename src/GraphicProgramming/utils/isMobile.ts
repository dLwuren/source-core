 
const userAgentInfo = navigator.userAgent;
const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
const getArr = Agents.filter(i => userAgentInfo.includes(i));
const is = getArr.length ? true : false;

export function isMobile() {
    return is;
}