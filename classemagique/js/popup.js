function openPopup(index){

    if(!students[index])
        return;

    const s = students[index];
    current = index;

    // 💀 CAS SPÉCIAL : RÉDEMPTION
    if(s.hearts === 0){
        openRedemption(index);
        return;
    }

    // ✅ CAS NORMAL
    studentName.value = s.name;

    document.getElementById("previewImage").src =
        s.useDefaultImage ? s.defaultImage : s.image;

    document.getElementById("genderDisplay").innerText =
        s.gender === "f" ? "♀ Féminin" : "♂ Masculin";

    updateLive();

    document.getElementById("card-"+index).style.outline="3px solid orange";

    overlay.style.display="block";
    popup.style.display="block";
}

function closeAll(){

    overlay.style.display = "none";

    popup.style.display = "none";

    settingsMenu.style.display = "none";

    toolsMenu.style.display = "none";

    document.getElementById("bulkPopup").style.display = "none";

    document.getElementById("groupPopup").style.display = "none";

    document.getElementById("spellEditor").style.display = "none";

    document.getElementById("shopPopup").style.display = "none";

    document.getElementById("shopEditor").style.display = "none";

    document.getElementById("spellShopPopup").style.display = "none";

    document.getElementById("weeklyPopup").style.display = "none";

    document.getElementById("levelRewardsPopup").style.display = "none";

    document.getElementById("studentRecurringPopup").style.display = "none";

    document.getElementById("importFile").value = "";
    saveData();

    render();
}

function openRedemption(index){

    const s = students[index];
    if(!s) return;

    redemptionIndex = index;

    document.getElementById("redemptionImage").src =
        s.useDefaultImage ? s.defaultImage : s.image;

    document.getElementById("redemptionName").innerText =
        s.name;

    overlay.style.display = "block";
    redemptionPopup.style.display = "block";
}

function closeRedemption(){
    redemptionPopup.style.display = "none";
    overlay.style.display = "none";
    redemptionIndex = null;
}

function redeemStudent(){

    if(redemptionIndex === null) return;

    const s = students[redemptionIndex];

    s.hearts = 1;

    saveData();
    render();

    closeRedemption();
}

