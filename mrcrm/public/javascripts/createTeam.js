let membersIntoTeam = []
function addTeamMember(userId, permission, team) {
    getAjax("/teams/add/member/" + userId + "?p=" + permission + "&teamId=" + team, (res) => {
        const result = JSON.parse(res);
        if (!result.err) {
        }
    })
}
function pushMember(id, name, permission) {
    membersIntoTeam.push({
        id: id,
        permission: permission
    })
    let currIndex = membersIntoTeam.length -1;
    let li = document.createElement("li")
    let deleteBtn = document.createElement("button")
    li.innerText = name
    deleteBtn.innerText = "X"
    deleteBtn.addEventListener("click", () => {
        li.parentNode.removeChild(li)
        membersIntoTeam.splice(currIndex, 1);
    })
    let l = document.getElementById("addedUserList");
    l.appendChild(li)
    li.appendChild(deleteBtn)
}
function pushMemberToArray() {
    const user = document.getElementById("userList");
    const permission = document.getElementById("userPermission").value;
    for(let i = 0;i < membersIntoTeam.length;i++) {
        if(membersIntoTeam[i].id == user.value) {
            alert("Already added user.")
            return;
        }
    }
    pushMember(user.value, user.options[user.selectedIndex].innerText, permission);
}
function createTeam() {
    const teamName = document.getElementById("teamName").value;
    if(teamName == "") { alert("Team name must not be empty."); return;}
    getAjax("/teams/create/team?team=" + teamName, (res) => {
        const result = JSON.parse(res);
        if (!result.err) {
            const team = result.teamId;
            membersIntoTeam.forEach((member) => {
                addTeamMember(member.id, member.permission, team)
            })
            alert("Team created");
        }
    })
}
const loadUserList = (handler) => {
    getAjax("/get/list/users", (res) => {
        handler(JSON.parse(res))
    })
}
const prev = window.onload;
window.onload = () => {
    if (prev) prev();

    loadUserList((rows) => {
        if(rows.err) {
            alert("Failed to load users.")
            window.location.href = "/"
        }
        const users = rows.users;
        let opts = ""
        users.forEach((user) => {
            opts += "<option value="+user.id+">"+user.name+"</option>"
        })
        document.getElementById("userList").innerHTML = opts;
    })
} 