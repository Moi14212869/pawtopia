let pets = [];
let activePetIndex = null;
let coins = 0;

const speciesData = { dragon:"🐉", cat:"🐱", blob:"👾" };

function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function showPetPage(){
  if(activePetIndex === null){
    alert("Adopte un animal !");
    showPage("adoption");
    return;
  }
  showPage("pet");
}
function updateNavState() {
  const navButtons = document.querySelectorAll(".nav button");

  navButtons.forEach(btn => {
 
    if (pets.length === 0 && !btn.textContent.includes("🏠") && !btn.textContent.includes("🐣")) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else {
      btn.classList.remove("disabled");
      btn.disabled = false;
    }
  });
}

load();
updateNavState();

function adopt(species){
  const name = document.getElementById("petNameInput").value || "SansNom";
  const newPet = { name, species, hunger:50, happiness:50, level:1 };

  if(pets.length === 0){
    coins = 20;
  }

  pets.push(newPet);
  activePetIndex = pets.length-1;

  save(); 
  update(); 
  updateNavState();
  showPage("pet");
}

function save(){
  localStorage.setItem("petGameFinal", JSON.stringify({
    pets, activePetIndex, coins
  }));
}

function load(){
  const data = localStorage.getItem("petGameFinal");
  if(data){
    const parsed = JSON.parse(data);
    pets = parsed.pets || [];
    activePetIndex = parsed.activePetIndex;
    coins = parsed.coins || 0;
  }
  if(pets.length > 0 && activePetIndex !== null){
    update();
    showPage("pet");
  } else {
    showPage("home");
  }
}

function update(){
  if(activePetIndex === null) return;

  const pet = pets[activePetIndex];

  document.getElementById("name").textContent = pet.name;
  document.getElementById("petImage").textContent = speciesData[pet.species];
  document.getElementById("level").textContent = pet.level;
  document.getElementById("coins").textContent = coins;
  document.getElementById("shopCoins").textContent = coins;

  document.getElementById("hungerBar").style.width = pet.hunger + "%";
  document.getElementById("happyBar").style.width = pet.happiness + "%";

  const list = document.getElementById("petList");
  list.innerHTML = "";

  pets.forEach((p,index)=>{
    const btn = document.createElement("button");
    btn.textContent = speciesData[p.species] + " " + p.name;
    btn.onclick = ()=>{
      activePetIndex = index;
      save(); update();
    };
    list.appendChild(btn);
  });
}

function feed(){
  if(coins <= 0) return alert("Pas assez de pièces !");
  const pet = pets[activePetIndex];
  pet.hunger = Math.max(0, pet.hunger - 15);
  coins -= 1;
  save(); update();
}

// Dégradation  : 1% toutes les 30 min
setInterval(()=>{
  if(activePetIndex === null) return;
  pets.forEach(p=>{
    p.hunger = Math.min(100, p.hunger + 1);
    p.happiness = Math.max(0, p.happiness - 1);
  });
  save(); update();
}, 1800000);

function rewardAllPets(){
  coins += 10;
  pets.forEach(p=>{
    p.happiness = Math.min(100, p.happiness + 15);
  });
  save(); update();
}

load();
