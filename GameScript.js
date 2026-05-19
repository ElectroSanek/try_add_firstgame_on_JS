const board = document.getElementById('game_board')
const player = document.getElementById('player')
const slime = document.getElementById('slime')
const slime2 = document.getElementById('slime2')
const critspan = document.getElementById('crit_chance')
const HPpot = document.getElementById('HP_potion')
const crit = 0.05
var Health = document.getElementById('HP')



var PlayerHP = 10;
var slimeHP = 3;
var slime2HP = 7;

var x = 1;
var y = 1;

const playerPOS = {x: 1, y: 1};
const slimePOS = {x: 7, y: 8};
const slime2POS = {x: 4, y: 6};
const HPpotPOS = {x: 9, y: 9};


function POS(){

HPpotPOS != slime2POS && slimePOS && playerPOS;

player.style.gridRowStart = playerPOS.x;
player.style.gridColumnStart = playerPOS.y;

slime.style.gridRowStart = slimePOS.x;
slime.style.gridColumnStart = slimePOS.y;

slime2.style.gridRowStart = slime2POS.x;
slime2.style.gridColumnStart = slime2POS.y;



}
POS()

function moveP(dx, dy){

let nextX = playerPOS.x + dx;
let nextY = playerPOS.y + dy;

if( nextX === slime2POS.x  &&  nextY === slime2POS.y){


   
    if(Math.random() <= crit){
        
        PlayerHP -= 1;
        slime2HP -= 2;
        if ( slime2HP < 0){slime2HP = 0; }
        console.log(`Критический удар! Твое HP: ${PlayerHP}, HP Врага: ${slime2HP}`)
        
    }
    else{

        PlayerHP -= 1;
        slime2HP -= 1;
        if ( slime2HP < 0){slime2HP = 0; }
        console.log(`Атака! Твое HP: ${PlayerHP}, HP Врага: ${slime2HP}`);

    }
    Health.innerHTML = PlayerHP;
    
    if (slime2HP <= 0){
        
    slime.classList.remove('slime_2');
    slime.classList.add('block');
        
    slime2POS.x = -1;
    slime2POS.y = -1;
    console.log("Элитный слизень побежден!");
    
    board.style.borderRightWidth = "2px";
    }
    board.style.borderRightWidth = "2px";
    return;
    }
    board.style.borderRightWidth = "2px";

if( nextX === slimePOS.x  &&  nextY === slimePOS.y){


if(Math.random() <= crit){
        
    PlayerHP -= 1;
    slimeHP -= 2;
    if ( slimeHP < 0){slimeHP = 0; }
    console.log(`Критический удар! Твое HP: ${PlayerHP}, HP Врага: ${slimeHP}`)
   
}
else{

    PlayerHP -= 1;
    slimeHP -= 1;
    if ( slimeHP < 0){slimeHP = 0; }
    console.log(`Атака! Твое HP: ${PlayerHP}, HP Врага: ${slimeHP}`);

}
Health.innerHTML = PlayerHP;
critspan.innerHTML = crit;

if (slimeHP <= 0){
    
slime.classList.remove('slime');
slime.classList.add('block');
    
slimePOS.x = -1;
slimePOS.y = -1;
console.log("Слизень побежден!");

board.style.borderRightWidth = "2px";
}
board.style.borderRightWidth = "2px";
return;

}
board.style.borderRightWidth = "2px";


if (nextX < 1 || nextX > 10 || nextY < 1 || nextY > 10){return;}

playerPOS.x = nextX
playerPOS.y = nextY
POS()

}



document.addEventListener('keydown', (e) => {

if (e.key === 'ArrowUp')    moveP(-1,0);
if (e.key === 'ArrowDown')  moveP(1,0);
if (e.key === 'ArrowLeft')  moveP(0,-1);
if (e.key === 'ArrowRight') moveP(0,1);


}

);
critspan.innerHTML = crit;
Health.innerHTML = PlayerHP;

/*playerPOS.x = Math.max(1, Math.min(playerPOS.x, 10));
playerPOS.y = Math.max(1, Math.min(playerPOS.y, 10));*/