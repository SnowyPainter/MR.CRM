function updateQuest(e) {
    const sender = e.srcElement || e.target;
    const id = sender.parentNode.id;
    const fieldId = sender.parentNode.getElementsByTagName("select")[0].value
    const type = sender.parentNode.getElementsByTagName("select")[1].value
    getAjax("/report/update/quests/" + id + "?fieldId=" + fieldId+"&type="+type, (r) => { refreshConstructContainer() });
 }
function deleteQuest(e) { 
    const sender = e.srcElement || e.target;
    const id = sender.parentNode.id;
    getAjax("/report/delete/quests/" + id, (r) => {
        refreshConstructContainer()
    });
}
function deleteField(e) {
    const sender = e.srcElement || e.target;
    const id = sender.parentNode.id;
    getAjax("/report/delete/fields/" + id, (r) => {
        //sender.parentNode.parentNode.removeChild(sender.parentNode)
        refreshAddFieldContainer()
    });
}
function updateField(e) {
    const sender = e.srcElement || e.target;
    const id = sender.parentNode.id;
    const text = sender.parentNode.getElementsByTagName("input")[0]
    getAjax("/report/update/fields/" + id + "?field=" + text.value, (r) => { refreshAddFieldContainer() });
}
function addQuest(event) {
    let fieldId = document.getElementById("fieldSelect").value;
    let type = document.getElementById("typeSelect").value; 

    getAjax("/report/add/quest?fieldId="+fieldId+"&type="+type, (res) => {
      refreshConstructContainer(false);
    })
}
function addField(event) {
    let input = document.getElementById("newField");
    const text = input.value;
    getAjax("/report/add/fields?field=" + text, (r) => {
        /*const json = JSON.parse(r);
        document.getElementById("fields").appendChild(createField(json.id, text)); */
        refreshAddFieldContainer(false)
        input.value = "";
    })
}
const createQuest = (id, text, type) => {
    let quest = document.createElement("div");
    quest.classList.add("quest");
    quest.id = id;
    let select = document.getElementById("fieldSelect").cloneNode(true);
    select.id = "";
    let typeselect = document.getElementById("typeSelect").cloneNode(true);
    typeselect.id = "";
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].innerText == text) {
            select.selectedIndex = i;
            break;
        }
    }
    for (let i = 0; i < typeselect.options.length; i++) {
        if (typeselect.options[i].value == type) {
            typeselect.selectedIndex = i;
            break;
        }
    }
    let editBtn = document.createElement("button")
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", updateQuest);
    let deleteBtn = document.createElement("button")
    deleteBtn.addEventListener("click", deleteQuest);
    deleteBtn.innerText = "X";
    quest.appendChild(select);
    quest.appendChild(typeselect)
    quest.appendChild(editBtn);
    quest.appendChild(deleteBtn);
    return quest;
}
const createField = (id, value) => {
    let field = document.createElement("div")
    field.classList.add("field");
    field.id = id;
    let input = document.createElement("input")
    input.value = value;
    let editBtn = document.createElement("button")
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", updateField);
    let deleteBtn = document.createElement("button")
    deleteBtn.addEventListener("click", deleteField);
    deleteBtn.innerText = "X";
    field.appendChild(input);
    field.appendChild(editBtn);
    field.appendChild(deleteBtn);
    return field;
}
const createPreviewElement = (questId, fieldText, submitType) => {
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
    }
    if(submitType == "text") {
        input.type = "text"
    } else if (submitType == "file") {
        input.type = "file"
    } else if (submitType == "yorn") {
        input = document.createElement("div")
        let y = document.createElement("input")
        let n = document.createElement("input")
        y.name = questId;
        n.name = questId;
        y.type = "radio"
        n.type = "radio"
        input.appendChild(y)
        input.appendChild(document.createTextNode("Yes"))
        input.appendChild(n)
        input.appendChild(document.createTextNode("No"))
    }
    inputTd.appendChild(input)
    tr.appendChild(questTd)
    tr.appendChild(inputTd)
    tr.appendChild(deleteBtn)
    table.appendChild(tr)
    return table
}
const getListOfQuests = () => new Promise((rs, rj) => {
    getAjax("/report/get/quests", (res) => { rs(res) })
})
const getListOfFields = () => new Promise((rs, rj) => {
    getAjax("/report/get/fields", (res) => { rs(res) })
})

let listOfFields = []
let listOfQuests = []
let addedQuests = []

function clearPreview() {
    refreshPreviewContainer();
}
function createForm() {
    if(addedQuests.length == 0) return;
    const str = addedQuests.join(' ')
    getAjax("/report/add/form?quests="+str, (res) => {
        alert(res);
    })
}

function addQuestToPreview() {
    let preview = document.getElementById("preview")
    let selected = document.getElementById("questSelect")
    const id = selected.value;
    if(id == "") return;
    if(addedQuests.includes(id)) {
        alert("Already added element.")
        return;
    }
    const fieldText = selected.options[selected.selectedIndex].innerText;
    getAjax("/report/get/quest/"+id, (res) => {
        const json = JSON.parse(res).rows[0]
        const type = json.submitType;
        preview.appendChild(createPreviewElement(id, fieldText, type))
        addedQuests.push(id)
    })
}

function refreshPreviewContainer() {
    let preview = document.getElementById("preview")
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    addedQuests = []
}

function refreshConstructContainer(refreshPreview=true) {
    let c = document.getElementById("quests");
    let qs = document.getElementById("questSelect");
    while (c.firstChild) {
        c.removeChild(c.firstChild);
    }
    getListOfQuests().then((list) => {
        listOfQuests = JSON.parse(list).quests;
        let opts = ""
        listOfQuests.forEach((q) => {
            if(q.fieldId == "") return;
            getAjax("/report/get/field/" + q.fieldId, (res) => {
                let text = JSON.parse(res).rows[0]
                if(text != undefined) {
                    text = text.field;
                    opts += "<option value='"+q.id+"'>"+text+"</option>"
                    c.appendChild(createQuest(q.id, text, q.submitType))
                }
                qs.innerHTML = opts;
            })
        });
    })
    if(refreshPreview)
        refreshPreviewContainer();
}
function refreshAddFieldContainer(relay=true) {
    let c = document.getElementById("fields");
    let selection = document.getElementById("fieldSelect");
    while (c.firstChild) {
        c.removeChild(c.firstChild);
    }
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild)
    }
    getListOfFields().then((list) => {
        listOfFields = JSON.parse(list).fields;
        let opts = "";
        listOfFields.forEach((field) => {
            c.appendChild(createField(field.id, field.field))
            opts += "<option value=" + field.id + ">" + field.field + "</option>"
        });
        selection.innerHTML = opts;
    })
    if(relay) refreshConstructContainer();
}

const prev = window.onload;
window.onload = () => {
    if (prev) prev();
    refreshAddFieldContainer();
} 