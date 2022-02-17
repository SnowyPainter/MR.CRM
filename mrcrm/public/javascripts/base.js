function getNowDate() {
    const d = new Date();
    return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDay()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()
}
function postAjax(url, data, onload) {
    const ajax = new XMLHttpRequest();
    ajax.open("POST",url, false);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onload = () => {onload(ajax.responseText)};
    ajax.send(JSON.stringify(data))
}