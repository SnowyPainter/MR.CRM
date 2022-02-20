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
function getAjax(url, onload) {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.onload = () => {onload(ajax.responseText)}
    ajax.send();
}
function _createQuestHtml(questId, fieldText, submitType, addDeleteBtn) {
    let table = document.createElement("table")
    let tr = document.createElement("tr")
    let questTd = document.createElement("td")
    questTd.innerText = fieldText
    let inputTd = document.createElement("td")
    
    let deleteBtn = document.createElement("button")
    deleteBtn.innerText = "X"
    deleteBtn.classList.add("deleteBtn")
    deleteBtn.addEventListener("click", (e) => {
        const sender = e.target;
        const p = sender.parentNode.parentNode
        
        addedQuests.splice(addedQuests.indexOf(questId), 1);
        p.parentNode.removeChild(p);
    })
    let input;
    if(submitType == "text" || submitType == "file") {
        input = document.createElement("input")
        input.name = questId;
    }
    if(submitType == "text") {
        input.type = "text"
    } else if (submitType == "file") {
        input.type = "file"
    } else if (submitType == "yorn") {
        input = document.createElement("div")
        let y = document.createElement("input")
        let n = document.createElement("input")
        y.name = questId; y.type = "radio"; y.value = "yes"
        n.name = questId; n.type = "radio"; n.value = "no"
        input.appendChild(y)
        input.appendChild(document.createTextNode("Yes"))
        input.appendChild(n)
        input.appendChild(document.createTextNode("No"))
    }
    inputTd.appendChild(input)
    tr.appendChild(questTd)
    tr.appendChild(inputTd)
    if(addDeleteBtn)
        tr.appendChild(deleteBtn)
    table.appendChild(tr)
    return table
}