function render(){
    const container = document.getElementById("students");
    container.innerHTML = "";

    students.forEach((s,i)=>{

    const imageName =
    s.useDefaultImage
        ? s.defaultImage
        : s.image;
    const xpPercent = Math.min(100, (s.xp / 1000) * 100);

    let rarity = "";

if(s.hearts === 0){
    rarity = "dead";
if(s.hearts === 0 && !s._redemptionShown){
    s._redemptionShown = true;

    setTimeout(()=>{
        openRedemption(i);
    }, 200);
}
}
else if(s.level >= 20){
    rarity = "legendary";
}
else if(s.level >= 10){
    rarity = "epic";
}
else if(s.level >= 5){
    rarity = "rare";
}

    container.innerHTML += `

<div class="card ${rarity} ${selectedStudents.includes(i) ? "selected" : ""} pop"
     id="card-${i}"
     onclick="openPopup(${i})">

    
    <input type="checkbox"
        class="selectBox"
        ${selectedStudents.includes(i) ? "checked" : ""}
        onclick="toggleSelect(${i}); event.stopPropagation()">

    <div style="position:relative;width:60px;height:60px;margin:auto;">

    <img
        class="studentPortrait"
        src="${imageName}"
        style="${s.absent ? 'opacity:0.3;filter:grayscale(1);' : ''}"
        onerror="this.src='images/m1-1.jpg'">

    ${s.absent ? `
        <img src="images/dragondodo.jpg"
        style="position:absolute;top:0;left:0;width:60px;height:60px;border-radius:8px;">
    ` : ""}

</div>

    <div class="studentName">
    ${s.name}
    ${s.gender === "f" ? "♀" : "♂"}
</div>

    <div class="levelBadge">⭐ Niveau ${s.level}</div>

    <div class="xpBar">
        <div class="xpFill" style="width:${xpPercent}%"></div>
    </div>

    <div class="statsCompact">
        <div>❤️ ${s.hearts}</div>
        <div>🔮 ${s.mana}</div>
        <div>🪙 ${s.gold}</div>
    </div>
</div>
`;
    });

    updateGrid();
}





function updateGrid(){
    const container = document.getElementById("students");

    container.style.gridTemplateColumns =
"repeat(auto-fit, minmax(140px, 1fr))";

container.style.gridAutoRows = "auto";
}

function updateLive(){
    const s = students[current];
    liveHearts.innerText = s.hearts+"/10";
    liveGold.innerText = s.gold;
    liveMana.innerText = s.mana+"/5";
    liveXP.innerText = s.xp + " / 1000";
}



function heartEffect(index, positive=true){
    const card = document.getElementById("card-"+index);
    const heart = document.createElement("div");
    heart.innerText = positive ? "❤️ +1" : "💔 -1";
    heart.style.position="absolute";
    heart.style.color= positive ? "green":"red";
    heart.style.fontWeight="bold";
    heart.style.top="50%";
    heart.style.left="50%";
    heart.style.transform="translate(-50%,-50%)";
    heart.style.animation="floatUp 1s forwards";
    card.appendChild(heart);
    setTimeout(()=>heart.remove(),1000);
}

function xpEffect(index, amount){
    const card = document.getElementById("card-"+index);
    const xp = document.createElement("div");
    xp.innerText = "⭐ +" + amount;
    xp.style.position="absolute";
    xp.style.color="blue";
    xp.style.fontWeight="bold";
    xp.style.top="60%";
    xp.style.left="50%";
    xp.style.transform="translate(-50%,-50%)";
    xp.style.animation="floatUp 1s forwards";
    card.appendChild(xp);
    setTimeout(()=>xp.remove(),1000);
}



const style=document.createElement("style");
style.innerHTML=`
@keyframes floatUp{
0%{opacity:1;transform:translate(-50%,-50%);}
100%{opacity:0;transform:translate(-50%,-120%);}
}`;
document.head.appendChild(style);

function levelUpEffect(index){
    const card = document.getElementById("card-"+index);
    card.style.boxShadow="0 0 20px gold";
    card.style.transition="0.3s";

    const banner = document.getElementById("levelBanner");
    banner.style.display="block";

    setTimeout(()=>{
        card.style.boxShadow="0 0 5px rgba(0,0,0,0.2)";
        banner.style.display="none";
    },1500);
}

function toggleSelect(i){
if(students[i].absent) return;    
if(selectedStudents.includes(i)){
        selectedStudents = selectedStudents.filter(x => x !== i);
    } else {
        selectedStudents.push(i);
    }

    const card = document.getElementById("card-" + i);
    if(card){
        card.classList.toggle("selected");
    }
}

function selectAllStudents(){

    selectedStudents = [];

    students.forEach((s,i)=>{
        if(!s.absent){
            selectedStudents.push(i);
        }
    });

    render();
}

function clearSelection(){
    selectedStudents = [];
    render();
}

function renderSanctions(){
    const div = document.getElementById("sanctionList");
    div.innerHTML = "";

    sanctions.forEach((s, i) => {
        div.innerHTML += `
            <div style="margin-bottom:10px;">
                <input type="text" value="${s.name}"
                    onchange="sanctions[${i}].name=this.value">

                <input type="number" value="${s.hearts}"
                    onchange="sanctions[${i}].hearts=parseInt(this.value)">

                ❤️
                <button onclick="sanctions.splice(${i},1);renderSanctions()">❌</button>
            </div>
        `;
    });
}