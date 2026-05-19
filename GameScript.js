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

const playerPOS = {x: 1, y: 1};
const slimePOS = {x: 7, y: 8};
const slime2POS = {x: 4, y: 6};
const HPpotPOS = {x: 9, y: 9};

function POS(){
    player.style.gridRowStart = playerPOS.x;
    player.style.gridColumnStart = playerPOS.y;

    if (slimeHP > 0 && slimePOS.x !== -1) {
        slime.style.gridRowStart = slimePOS.x;
        slime.style.gridColumnStart = slimePOS.y;
    }
    if (slime2HP > 0 && slime2POS.x !== -1) {
        slime2.style.gridRowStart = slime2POS.x;
        slime2.style.gridColumnStart = slime2POS.y;
    }
}
POS()

// Функция проверки смерти игрока
function checkPlayerDeath() {
    if (PlayerHP <= 0) {
        alert("Вы проиграли! Слаймы победили.");
        location.reload();
        return true;
    }
    return false;
}

function processSingleSlime(slimePosObj, currentSlimeHP, slimeElement, slimeName) {
    if (currentSlimeHP <= 0 || slimePosObj.x === -1) return;

    let diffX = playerPOS.x - slimePosObj.x;
    let diffY = playerPOS.y - slimePosObj.y;
    let distX = Math.abs(diffX);
    let distY = Math.abs(diffY);

    if (distX <= 2 && distY <= 2) {
        if (distX <= 1 && distY <= 1) {
            PlayerHP -= 1;
            if (PlayerHP < 0) PlayerHP = 0;
            Health.innerHTML = PlayerHP;
            console.log(`${slimeName} атакует! Твое HP: ${PlayerHP}`);
            
            if (checkPlayerDeath()) return;
        } else {
            let nextX = slimePosObj.x;
            let nextY = slimePosObj.y;

            if (distX === distY) {
                if (Math.random() < 0.5) {
                    nextX += diffX > 0 ? 1 : -1;
                } else {
                    nextY += diffY > 0 ? 1 : -1;
                }
            } else if (distX > distY) {
                nextX += diffX > 0 ? 1 : -1;
            } else {
                nextY += diffY > 0 ? 1 : -1;
            }

            let isCellOccupied = false;
            if (slimeName === "Обычный слизень" && slime2HP > 0 && nextX === slime2POS.x && nextY === slime2POS.y) isCellOccupied = true;
            if (slimeName === "Элитный слизень" && slimeHP > 0 && nextX === slimePOS.x && nextY === slimePOS.y) isCellOccupied = true;

            if (!isCellOccupied) {
                slimePosObj.x = nextX;
                slimePosObj.y = nextY;
                console.log(`${slimeName} сокращает дистанцию!`);
            }
        }
    } else {
        let directions = [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1},
            {dx: 0, dy: 1}
        ];
        
        let randomDir = directions[Math.floor(Math.random() * directions.length)];
        let nextX = slimePosObj.x + randomDir.dx;
        let nextY = slimePosObj.y + randomDir.dy;

        if (nextX >= 1 && nextX <= 10 && nextY >= 1 && nextY <= 10) {
            let isPlayer = (nextX === playerPOS.x && nextY === playerPOS.y);
            let isOtherSlime = false;
            if (slimeName === "Обычный слизень" && slime2HP > 0 && nextX === slime2POS.x && nextY === slime2POS.y) isOtherSlime = true;
            if (slimeName === "Элитный слизень" && slimeHP > 0 && nextX === slimePOS.x && nextY === slimePOS.y) isOtherSlime = true;

            if (!isPlayer && !isOtherSlime) {
                slimePosObj.x = nextX;
                slimePosObj.y = nextY;
            }
        }
    }
}

function moveSlimes() {
    processSingleSlime(slimePOS, slimeHP, slime, "Обычный слизень");
    processSingleSlime(slime2POS, slime2HP, slime2, "Элитный слизень");
    POS();
}

function moveP(dx, dy){
    let nextX = playerPOS.x + dx;
    let nextY = playerPOS.y + dy;

    if (nextX < 1 || nextX > 10 || nextY < 1 || nextY > 10){return;}

    // Атака на Элитного Слизня 2
    if( nextX === slime2POS.x  &&  nextY === slime2POS.y && slime2HP > 0){
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
            slime2.classList.remove('slime_2');
            slime2.classList.add('block');
            slime2.style.display = 'none'; 
            slime2POS.x = -1;
            slime2POS.y = -1;
            console.log("Элитный слизень побежден!");
        }

        if (checkPlayerDeath()) return;

        moveSlimes();
        return;
    }

    // Атака на Обычного Слизня 1
    if( nextX === slimePOS.x  &&  nextY === slimePOS.y && slimeHP > 0){
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

        if (slimeHP <= 0){
            slime.classList.remove('slime');
            slime.classList.add('block');
            slime.style.display = 'none'; 
            slimePOS.x = -1;
            slimePOS.y = -1;
            console.log("Слизень побежден!");
        }

        if (checkPlayerDeath()) return;

        moveSlimes();
        return;
    }

    playerPOS.x = nextX;
    playerPOS.y = nextY;
    POS();
    moveSlimes();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp')    moveP(-1,0);
    if (e.key === 'ArrowDown')  moveP(1,0);
    if (e.key === 'ArrowLeft')  moveP(0,-1);
    if (e.key === 'ArrowRight') moveP(0,1);
});

critspan.innerHTML = crit;
Health.innerHTML = PlayerHP;