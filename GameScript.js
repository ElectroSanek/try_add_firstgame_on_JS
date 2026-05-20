const board = document.getElementById('game_board')
const player = document.getElementById('player')
const slime = document.getElementById('slime')
const slime2 = document.getElementById('slime2')
const critspan = document.getElementById('crit_chance')
const HPpot = document.getElementById('HP_potion')
const crit = 0.05
var Health = document.getElementById('HP')

var PlayerHP = 10;
const MaxHP = 10; 
var slimeHP = 3;
var slime2HP = 7;

const playerPOS = {x: 1, y: 1};
const slimePOS = {x: 7, y: 8};
const slime2POS = {x: 4, y: 6};

const HPpotPOS = {x: -1, y: -1}; 
let isPotionSpawned = true; 

// ==========================================
// НАДЕЖНАЯ АУДИОСИСТЕМА НА ЧИСТОМ HTML5 AUDIO
// ==========================================
const ambientAudio = new Audio();
const combatAudio = new Audio();

ambientAudio.src = 'ambient.mp3';
combatAudio.src = 'combat.mp3';

ambientAudio.loop = true;
combatAudio.loop = true;

// Фиксируем громкость на 20% от исходного файла
const MAX_VOLUME = 0.2; 

let isAudioStarted = false;
let currentTrack = 'none'; 
let fadeInterval = null;

// Безопасная функция плавного переключения треков
function switchTrack(targetTrack) {
    if (!isAudioStarted) return;
    if (currentTrack === targetTrack) return;
    
    currentTrack = targetTrack;
    clearInterval(fadeInterval);

    if (ambientAudio.paused) ambientAudio.play().catch(() => {});
    if (combatAudio.paused) combatAudio.play().catch(() => {});

    fadeInterval = setInterval(() => {
        let changed = false;

        // Логика для Эмбиента
        let targetAmbientVol = (targetTrack === 'ambient') ? MAX_VOLUME : 0;
        let currentAmbientVol = parseFloat(ambientAudio.volume.toFixed(2));
        if (currentAmbientVol !== targetAmbientVol) {
            let diff = targetAmbientVol - currentAmbientVol;
            if (Math.abs(diff) <= 0.02) {
                ambientAudio.volume = targetAmbientVol;
            } else {
                ambientAudio.volume = Math.max(0, Math.min(MAX_VOLUME, currentAmbientVol + Math.sign(diff) * 0.02));
            }
            changed = true;
        }

        // Логика для Боевого рока
        let targetCombatVol = (targetTrack === 'combat') ? MAX_VOLUME : 0;
        let currentCombatVol = parseFloat(combatAudio.volume.toFixed(2));
        if (currentCombatVol !== targetCombatVol) {
            let diff = targetCombatVol - currentCombatVol;
            if (Math.abs(diff) <= 0.02) {
                combatAudio.volume = targetCombatVol;
            } else {
                combatAudio.volume = Math.max(0, Math.min(MAX_VOLUME, currentCombatVol + Math.sign(diff) * 0.02));
            }
            changed = true;
        }

        if (!changed) {
            clearInterval(fadeInterval);
        }
    }, 40); 
}

// Принудительный старт аудиосистемы на первом шаге игрока
function startAudioOnFirstGesture() {
    if (isAudioStarted) return;
    
    isAudioStarted = true;
    
    ambientAudio.volume = 0;
    combatAudio.volume = 0;

    ambientAudio.play().then(() => {
        combatAudio.play().then(() => {
            console.log("Аудиосистема успешно разблокирована шагом игрока!");
            checkMusicState(); 
        });
    }).catch(err => {
        isAudioStarted = false;
        console.log("Браузер заблокировал звук: ", err);
    });
}

// Проверка окружения (2х2 клетки)
function checkMusicState() {
    let enemySpotted = false;

    if (slimeHP > 0 && slimePOS.x !== -1) {
        let distX = Math.abs(playerPOS.x - slimePOS.x);
        let distY = Math.abs(playerPOS.y - slimePOS.y);
        if (distX <= 2 && distY <= 2) enemySpotted = true;
    }

    if (slime2HP > 0 && slime2POS.x !== -1) {
        let distX = Math.abs(playerPOS.x - slime2POS.x);
        let distY = Math.abs(playerPOS.y - slime2POS.y);
        if (distX <= 2 && distY <= 2) enemySpotted = true;
    }

    if (enemySpotted) {
        switchTrack('combat');
    } else {
        switchTrack('ambient');
    }
}
// ==========================================

function spawnPotionRandomly() {
    let validPosition = false;
    let rx, ry;

    while (!validPosition) {
        rx = Math.floor(Math.random() * 10) + 1;
        ry = Math.floor(Math.random() * 10) + 1;

        let isPlayerCell = (rx === playerPOS.x && ry === playerPOS.y);
        let isSlimeCell = (slimeHP > 0 && rx === slimePOS.x && ry === slimePOS.y);
        let isSlime2Cell = (slime2HP > 0 && rx === slime2POS.x && ry === slime2POS.y);

        if (!isPlayerCell && !isSlimeCell && !isSlime2Cell) {
            validPosition = true;
        }
    }

    HPpotPOS.x = rx;
    HPpotPOS.y = ry;
    console.log(`Зелье здоровья заспавнилось на X:${rx}, Y:${ry}`);
}

spawnPotionRandomly();

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

    if (isPotionSpawned && HPpotPOS.x !== -1) {
        HPpot.style.gridRowStart = HPpotPOS.x;
        HPpot.style.gridColumnStart = HPpotPOS.y;
        HPpot.style.display = 'block';
    }
}
POS()

function checkPlayerDeath() {
    if (PlayerHP <= 0) {
        alert("Вы проиграли! Слаймы победили.");
        location.reload();
        return true;
    }
    return false;
}

function moveSlimes(skipSlime1 = false, skipSlime2 = false) {
    if (!skipSlime1) processSingleSlime(slimePOS, slimeHP, slime, "Обычный слизень");
    if (!skipSlime2) processSingleSlime(slime2POS, slime2HP, slime2, "Элитный слизень");
    POS();
    if (isAudioStarted) checkMusicState(); 
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

function moveP(dx, dy){
    startAudioOnFirstGesture();

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
            slime2.classList.remove('slime2'); 
            slime2.classList.add('block');
            slime2.style.display = 'none'; 
            slime2POS.x = -1;
            slime2POS.y = -1;
            console.log("Элитный слизень побежден!");
        }

        if (checkPlayerDeath()) return;

        POS();
        moveSlimes(false, true); 
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

        POS();
        moveSlimes(true, false); 
        return;
    }

    playerPOS.x = nextX;
    playerPOS.y = nextY;

    if (isPotionSpawned && playerPOS.x === HPpotPOS.x && playerPOS.y === HPpotPOS.y) {
        PlayerHP += 5; 
        if (PlayerHP > MaxHP) { PlayerHP = MaxHP; } 
        Health.innerHTML = PlayerHP; 
        isPotionSpawned = false; 
        HPpot.style.display = 'none'; 
        HPpotPOS.x = -1; 
        HPpotPOS.y = -1;
        console.log(`Вы подобрали зелье! Текущее HP: ${PlayerHP}`);
    }

    POS();
    moveSlimes(false, false);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp')    moveP(-1,0);
    if (e.key === 'ArrowDown')  moveP(1,0);
    if (e.key === 'ArrowLeft')  moveP(0,-1);
    if (e.key === 'ArrowRight') moveP(0,1);
});

critspan.innerHTML = crit;
Health.innerHTML = PlayerHP;