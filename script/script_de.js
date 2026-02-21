const boardSize=5;
const bombCount=5;

let flags=[], board=[], revealed=[], gameOver=false;

function initGame(){
  board=Array(boardSize*boardSize).fill(0);
  flags=Array(boardSize*boardSize).fill(false);
  revealed=Array(boardSize*boardSize).fill(false);
  gameOver=false;
  document.getElementById("message").textContent="";

  let bombsPlaced=0;
  while(bombsPlaced<bombCount){
    const index=Math.floor(Math.random()*board.length);
    if(board[index]!=="B"){
      board[index]="B";
      bombsPlaced++;
      getNeighbors(index).forEach(i=>{
        if(board[i]!=="B") board[i]++;
      });
    }
  }
  renderBoard();
}

function renderBoard(){
  const boardDiv=document.getElementById("board");
  boardDiv.innerHTML="";

  board.forEach((val,index)=>{
    const cell=document.createElement("div");
    cell.classList.add("cell");

    if(revealed[index]){
      cell.classList.add("revealed");
      if(val==="B"){
        cell.classList.add("bomb");
        cell.textContent="💣";
      } else if(val>0){
        cell.textContent=val;
      }
    } else if(flags[index]){
      cell.textContent="🚩";
    }

    cell.addEventListener("click",()=>revealCell(index));
    cell.addEventListener("contextmenu",(e)=>{
      e.preventDefault();
      toggleFlag(index);
    });

    boardDiv.appendChild(cell);
  });
}

function getNeighbors(index){
  const neighbors=[];
  const row=Math.floor(index/boardSize);
  const col=index%boardSize;

  for(let dr=-1;dr<=1;dr++){
    for(let dc=-1;dc<=1;dc++){
      if(dr===0 && dc===0) continue;
      const r=row+dr;
      const c=col+dc;
      if(r>=0 && r<boardSize && c>=0 && c<boardSize){
        neighbors.push(r*boardSize+c);
      }
    }
  }
  return neighbors;
}

function toggleFlag(index){
  if(revealed[index] || gameOver) return;
  flags[index]=!flags[index];
  renderBoard();
}

function revealCell(index){
  if(gameOver || revealed[index]) return;

  revealed[index]=true;

  if(board[index]==="B"){
    gameOver=true;
    document.getElementById("message").textContent="💥 BOOM ! Perdu.";
    revealAll();
    return;
  }

  if(board[index]===0){
    getNeighbors(index).forEach(revealCell);
  }

  if(revealed.filter((v,i)=>!v && board[i]!=="B").length===0){
    gameOver=true;
    document.getElementById("message").textContent="🎉 Gagné ! +10💰 +15😊 pour tous !";
    revealAll();
    rewardAllPets();
  }

  renderBoard();
}

function revealAll(){
  for(let i=0;i<board.length;i++){
    revealed[i]=true;
  }
  renderBoard();
}
