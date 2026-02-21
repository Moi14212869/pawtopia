function initAvoidGame(){
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameOverText = document.getElementById("gameOver");

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;

  let enemies = [];
  let bonuses = [];
  let score = 0;
  let gameRunning = true;
  let shieldActive = false;

  canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
  });

  function spawnEnemy() {
      if (!gameRunning) return;

      enemies.push({
          x: -30,
          y: Math.random() * canvas.height,
          radius: 15,
          speed: 3 + Math.random() * 3,
          color: `hsl(${Math.random()*360}, 80%, 50%)` // couleurs vives aléatoires
      });

      if (Math.random() < 0.1) {
          bonuses.push({
              x: -30,
              y: Math.random() * canvas.height,
              radius: 12,
              speed: 2 + Math.random() * 2
          });
      }
  }

  function checkCollisionCircle(aX, aY, aR, bX, bY, bR) {
      const dx = aX - bX;
      const dy = aY - bY;
      return Math.sqrt(dx*dx + dy*dy) < aR + bR;
  }

  function handleGameOver() {
      gameRunning = false;
      gameOverText.style.display = "block";

      // Récompenser les pets
      pets.forEach(p => {
          p.happiness = Math.min(100, p.happiness + 15);
      });
      coins += score;
      save(); update();

      setTimeout(() => {
          gameOverText.style.display = "none";
          showPage("games");
      }, 5000);
  }

  function update() {
      if (!gameRunning) return;

      // Fond noir
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // Afficher score
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText("Score : " + score, 20, 30);

  // Joueur
  ctx.save();
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
  ctx.fillStyle = shieldActive ? "lime" : "cyan";
  ctx.shadowBlur = 20;
  ctx.shadowColor = shieldActive ? "lime" : "cyan";
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Ennemis
  for(let i=enemies.length-1;i>=0;i--){
      const e = enemies[i];
      e.x += e.speed;

      if(checkCollisionCircle(mouseX, mouseY,10,e.x,e.y,e.radius)){
          if(shieldActive){ shieldActive=false; enemies.splice(i,1);}
          else{ handleGameOver(); return; }
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(e.x,e.y,e.radius,0,Math.PI*2);
      ctx.fillStyle = e.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = e.color;
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      if(e.x - e.radius > canvas.width){ enemies.splice(i,1); score++; }
  }

  // Bonus
  for(let i=bonuses.length-1;i>=0;i--){
      const b = bonuses[i];
      b.x += b.speed;

      if(checkCollisionCircle(mouseX, mouseY,10,b.x,b.y,b.radius)){
          shieldActive = true;
          bonuses.splice(i,1);
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.radius,0,Math.PI*2);
      ctx.fillStyle = "lime";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "lime";
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      if(b.x - b.radius > canvas.width) bonuses.splice(i,1);
  }

      requestAnimationFrame(update);
  }

  setInterval(spawnEnemy, 800);
  update();
}
initGame();
