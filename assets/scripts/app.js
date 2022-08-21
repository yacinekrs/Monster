const valeurAttack = 10;
const monsterValeurAttack = 15;
const valeurStrongAttack = 20;
const healValue = 17;
let chooseMaxLife;
let MODE_ATTACK = "ATTACK";
let MODE_ST_ATTACK = "STRONG_ATTACK";
let LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
let LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
let LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
let LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
let LOG_EVENT_GAMEOVER = "GAMEOVER";

function GetMaxLifeValue() {
  let vie = prompt("veuiller saisir la vie du monstre et du joueur", "100");
  let parseValue = parseInt(vie);
  if (isNaN(parseValue) || parseValue <= 0) {
    throw { message: "entrer invalide , ce n'est pas un nombre " };
  }
  return parseValue;
}

try {
  //gestion d'erreur
  chooseMaxLife = GetMaxLifeValue();
} catch (error) {
  console.log(error);
  chooseMaxLife = 100;
}

let currentHealMonster = chooseMaxLife;
let currentHealPlayer = chooseMaxLife;
let hasBonusLife = true;
let battelLog = [];

adjustHealthBars(chooseMaxLife);

function writeToLog(ev, val, HealMonster, HealPlayer) {
  let logEntry = {
    even: ev,
    value: val,
    finalMonsterHeal: HealMonster,
    finalPlayerHeal: HealPlayer,
  };

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "Monster";
      break;

    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        even: ev,
        value: val,
        target: "Monster",
        finalMonsterHeal: HealMonster,
        finalPlayerHeal: HealPlayer,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        even: ev,
        value: val,
        target: "Player",
        finalMonsterHeal: HealMonster,
        finalPlayerHeal: HealPlayer,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        even: ev,
        value: val,
        target: "Player",
        finalMonsterHeal: HealMonster,
        finalPlayerHeal: HealPlayer,
      };
      break;
    case LOG_EVENT_GAMEOVER:
      logEntry = {
        even: ev,
        value: val,
        finalMonsterHeal: HealMonster,
        finalPlayerHeal: HealPlayer,
      };
      break;
    default:
      logEntry = {};
  }
  battelLog.push(logEntry);

  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry = {
  //     even: ev,
  //     value: val,
  //     target: "Monster",
  //     finalMonsterHeal: HealMonster,
  //     finalPlayerHeal: HealPlayer,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry = {
  //     even: ev,
  //     value: val,
  //     target: "Monster",
  //     finalMonsterHeal: HealMonster,
  //     finalPlayerHeal: HealPlayer,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry = {
  //     even: ev,
  //     value: val,
  //     target: "Player",
  //     finalMonsterHeal: HealMonster,
  //     finalPlayerHeal: HealPlayer,
  //   };
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry = {
  //     even: ev,
  //     value: val,
  //     target: "Player",
  //     finalMonsterHeal: HealMonster,
  //     finalPlayerHeal: HealPlayer,
  //   };
  // } else if (ev === LOG_EVENT_GAMEOVER) {
  //   logEntry = {
  //     even: ev,
  //     value: val,
  //     finalMonsterHeal: HealMonster,
  //     finalPlayerHeal: HealPlayer,
  //   };
  // }
  // battelLog.push(logEntry);
}

function reset() {
  currentHealMonster = chooseMaxLife;
  currentHealPlayer = chooseMaxLife;
  resetGame(chooseMaxLife);
}

function endround() {
  let initCurLife = currentHealPlayer;
  let damageM = dealPlayerDamage(monsterValeurAttack);
  currentHealPlayer -= damageM;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    damageM,
    currentHealMonster,
    currentHealPlayer
  );

  if (currentHealMonster <= 0 && currentHealPlayer > 0) {
    alert("tu as gagner");
    writeToLog(
      LOG_EVENT_GAMEOVER,
      "PLAYER WON",
      currentHealMonster,
      currentHealPlayer
    );
    reset();
  } else if (currentHealPlayer <= 0 && hasBonusLife === true) {
    hasBonusLife = false;
    removeBonusLife();
    alert("vous etes toujours en vie mais bonus life perdu");
    currentHealPlayer = initCurLife;
    setPlayerHealth(currentHealPlayer);
  } else if (currentHealPlayer <= 0 && currentHealMonster > 0) {
    alert("vous avez perdu");
    writeToLog(
      LOG_EVENT_GAMEOVER,
      "PLAYER LOST",
      currentHealMonster,
      currentHealPlayer
    );
    reset();
  }
}

function attackMonster(mode) {
  let maxdamage = mode === MODE_ATTACK ? valeurAttack : valeurStrongAttack;
  let logevent =
    mode === MODE_ST_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxdamage = valeurAttack;
  //   logevent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_ST_ATTACK) {
  //   maxdamage = valeurStrongAttack;
  //   logevent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  let damage = dealMonsterDamage(maxdamage);
  currentHealMonster -= damage;
  writeToLog(logevent, damage, currentHealMonster, currentHealPlayer);
  endround();
}

function attack() {
  attackMonster(MODE_ATTACK);
}

function StrongAttack() {
  attackMonster(MODE_ST_ATTACK);
}

function soigner() {
  let heal_Value;
  if (currentHealPlayer >= chooseMaxLife - healValue) {
    heal_Value = chooseMaxLife - currentHealPlayer;
    alert("vous ne pouvez pas vous vous soigner plus que la valeur initiale");
  } else {
    heal_Value = healValue;
  }
  increasePlayerHealth(heal_Value);
  currentHealPlayer += heal_Value;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    heal_Value,
    currentHealMonster,
    currentHealPlayer
  );
  endround();
}

function printlog() {
  // for (let i = 0; i < battelLog.length; i++) {
  //   console.log(battelLog[i]);
  // }
  for (let i of battelLog) {
    // boucle for pour parcourir les tableaux
    console.log(i);
  }
}

attackBtn.addEventListener("click", attack);
strongAttackBtn.addEventListener("click", StrongAttack);
healBtn.addEventListener("click", soigner);
logBtn.addEventListener("click", printlog);
