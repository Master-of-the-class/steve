function addStudent(){

    const name = prompt("Nom du nouvel élève :");

    if(!name) return;

   const student = {
    name: name,
    hearts: 10,
    mana: 5,
    gold: 0,
    xp: 0,
    level: 1,
    absent: false,

    recurringRewards:{
        hearts:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        mana:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        gold:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        }
    },

    lastRecurringReward: new Date().toISOString().split("T")[0],

    gender: "m",
    image: "",
    useDefaultImage: true,
    defaultImage: ""
};

    refreshDefaultImage(student);

    students.push(student);

    saveData();
    render();

    alert(name + " ajouté !");
}

function deleteStudentByName(){

    const name =
        document.getElementById("studentToDelete")
        .value
        .trim();

    if(!name){
        alert("Entrez un nom.");
        return;
    }

    const index = students.findIndex(
        s => s.name.toLowerCase() === name.toLowerCase()
    );

    if(index === -1){
        alert("Élève introuvable.");
        return;
    }

    if(!confirm(
        "Supprimer " + students[index].name + " ?"
    )){
        return;
    }

    students.splice(index, 1);

    saveData();
    render();

    document.getElementById("studentToDelete").value = "";

    alert("Élève supprimé.");
}






function toggleAbsent(){

    const s = students[current];

    s.absent = !s.absent;

    saveData();
    render();
    openPopup(current);
}

/* Ensure new properties exist */
students.forEach((s,i)=>{
    if(s.hearts === undefined) s.hearts = 10;
    if(s.mana === undefined) s.mana = 5;
    if(s.gold === undefined) s.gold = 0;
    if(s.xp === undefined) s.xp = 0;
    if(s.level === undefined) s.level = 1;
if(!s.recurringRewards){

    s.recurringRewards = {
        hearts:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        mana:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        gold:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        }
    };
}

if(!s.lastRecurringReward){
    s.lastRecurringReward = getTodayDate();
}
if(s.absent === undefined) s.absent = false;
    if(s.image === undefined) s.image = "";

    if(s.gender === undefined) s.gender = "m";

    if(s.useDefaultImage === undefined)
        s.useDefaultImage = true;

    if(s.defaultImage === undefined)
        s.defaultImage = "";
});

students.forEach(s=>{

    if(
        !s.defaultImage ||
        s.defaultImage.endsWith(".png")
    ){
        refreshDefaultImage(s);
    }

});

function changeHearts(v){
    let s = students[current];
    let old = s.hearts;

    s.hearts = s.hearts + v;
    s.hearts = Math.max(0, Math.min(10, s.hearts));

    if(s.hearts !== old) heartEffect(current, v>0);
    updateLive();
}

function changeMana(v){
    let s = students[current];
    s.mana = Math.min(5, Math.max(0,s.mana+v));
    updateLive();
}

function changeGold(){
    let amount = parseInt(goldInput.value)||0;
    let s = students[current];
    s.gold = Math.max(0,s.gold+amount);
    updateLive();
}

function changeXP(){
    let amount = parseInt(document.getElementById("xpInput").value) || 0;
    if(amount <= 0) return;

    addXP(amount, current);
    updateLive();
    saveData();

    
    setTimeout(() => {
        render();
    }, 250);
}

let levelSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");

function addXP(amount,index){
    let s = students[index];
    s.xp += amount;

    let leveledUp = false;

    xpEffect(index, amount);

    while(s.xp >= 1000){

    s.xp -= 1000;
    s.level++;

    // récompenses de niveau
    s.gold += levelRewards.gold;

    s.mana = Math.min(
        5,
        s.mana + levelRewards.mana
    );

    s.hearts = Math.min(
        10,
        s.hearts + levelRewards.hearts
    );
        leveledUp = true;

        const oldStage = getEvolutionStage(s.level - 1);
        const newStage = getEvolutionStage(s.level);

        if(oldStage !== newStage){
            refreshDefaultImage(s);
        }

        if(!muted) levelSound.play();
    }

    if(leveledUp){
        levelUpEffect(index);
    }
}

function saveAndClose(){
console.log("SAVE CLICKED");
    if(current === null) return;

    const nameInput = document.getElementById("studentName");

    students[current].name = nameInput.value;

    saveData();
    render();
    closeAll(); // IMPORTANT : pas closeAllWithoutSave
}

function resetClass(){

    if(confirm("Réinitialiser les statistiques de la classe ?")){

        students.forEach((s)=>{

            s.hearts = 10;
            s.mana = 5;
            s.gold = 0;
            s.xp = 0;
            s.level = 1;

            if(s.image === undefined)
                s.image = "";

            if(s.gender === undefined)
                s.gender = "m";

            if(s.useDefaultImage === undefined)
                s.useDefaultImage = true;

            refreshDefaultImage(s);

        });

        saveData();
        render();
        closeAll();
    }
}

function deleteClass(){
    if(confirm("Delete this class permanently?")){
        localStorage.removeItem("class_"+className);
        window.location.href="index.html";
    }
}

function renameClass(){

    const newName = prompt(
        "Entrez le nouveau nom de la classe :",
        className
    );

    if(!newName) return;

    if(localStorage.getItem("class_" + newName)){
        alert("Une classe avec ce nom existe déjà !");
        return;
    }

    let raw = JSON.parse(
        localStorage.getItem("class_" + className)
    );

    let icon = "🏫";

    if(raw && !Array.isArray(raw)){
        icon = raw.icon || "🏫";
    }

    localStorage.setItem(
        "class_" + newName,
        JSON.stringify({
            icon: icon,
            students: students
        })
    );

    // déplacer aussi les sorts
    let oldSpells =
        localStorage.getItem(className + "_spells");

    if(oldSpells){
        localStorage.setItem(
            newName + "_spells",
            oldSpells
        );

        localStorage.removeItem(
            className + "_spells"
        );
    }

    localStorage.removeItem(
        "class_" + className
    );

    className = newName;

    document.getElementById("classTitle").innerText =
        newName;

    window.history.replaceState(
        {},
        "",
        "class.html?name=" +
        encodeURIComponent(newName)
    );

    alert("Classe renommée avec succès !");
}

function restoreDefaultImage(){

    const s = students[current];

    s.useDefaultImage = true;

    refreshDefaultImage(s);

    document.getElementById("previewImage").src =
        s.defaultImage;

    saveData();
    render();
}

function setGender(g){

    const s = students[current];

    s.gender = g;

    refreshDefaultImage(s);

    s.useDefaultImage = true;

    document.getElementById("previewImage").src =
        s.defaultImage;

    document.getElementById("genderDisplay").innerText =
        g === "f"
        ? "♀ Féminin"
        : "♂ Masculin";

    saveData();

    render();
}

function generateDefaultImage(student){

    const prefix =
        student.gender === "f"
        ? "f"
        : "m";

    const stage =
        getEvolutionStage(student.level);

    const variation =
        Math.floor(Math.random()*4)+1;

    return `images/${prefix}${stage}-${variation}.jpg`;
}

function refreshDefaultImage(student){

    const oldImage = student.defaultImage || "";

    let newImage = oldImage;

    while(newImage === oldImage){

        newImage = generateDefaultImage(student);

    }

    student.defaultImage = newImage;
}

function getEvolutionStage(level){

    if(level >= 50) return 10;
    if(level >= 45) return 9;
    if(level >= 40) return 8;
    if(level >= 35) return 7;
    if(level >= 30) return 6;
    if(level >= 25) return 5;
    if(level >= 15) return 4;
    if(level >= 10) return 3;
    if(level >= 5) return 2;

    return 1;
}

