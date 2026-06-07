function saveData(){

    const existingRaw = localStorage.getItem("class_"+className);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};

    localStorage.setItem(
        "class_"+className,
        JSON.stringify({
            icon: existing.icon || "🏫",
            students: students || []
        })
    );
}

function heartbeat(){
    saveData();
    render();
}