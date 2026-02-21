// Tirage aléatoire de 2 aliments par jour
function showDailyFood() {
  fetch("data/food.json")
    .then(response => response.json())
    .then(data => {
      const aliments = [...data.nourritures];
      const dailyDiv = document.getElementById("dailyFood");

      // Crée un seed basé sur la date du jour
      const today = new Date();
      let seed = today.getFullYear() + today.getMonth() + today.getDate();

      function seededRandom(max) {
        const x = Math.sin(seed++) * 10000;
        return Math.floor((x - Math.floor(x)) * max);
      }

      // Mélange le tableau avec le seed
      for (let i = aliments.length - 1; i > 0; i--) {
        const j = seededRandom(i + 1);
        [aliments[i], aliments[j]] = [aliments[j], aliments[i]];
      }

      // Prend les 2 premiers aliments
      const tirage = aliments.slice(0, 2);

      // Vide l'ancien contenu
      dailyDiv.innerHTML = "";

      tirage.forEach(item => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.margin = "5px";
        card.style.padding = "5px";
        card.style.display = "inline-block";
        card.style.textAlign = "center";
        card.innerHTML = `
          <img src="${item.image}" alt="${item.type}" style="width:100px; height:80px; object-fit:cover;"><br>
          <strong>${item.type}</strong><br>
          ${item.prix} 💰
        `;
        dailyDiv.appendChild(card);
      });
    })
    .catch(error => console.error("Erreur :", error));
}

// Appelle la fonction à l'ouverture du shop
showDailyFood();
