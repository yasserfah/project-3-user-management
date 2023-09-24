
document.getElementById("search").addEventListener("click", ()=>{
    values=document.getElementById("se").value
    console.log(values)
        
     location.href = `search/?values=${values}`
        
    }
)
