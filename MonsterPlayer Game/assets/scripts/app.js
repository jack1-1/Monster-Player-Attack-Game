const ATTACK_VALUE = 10; // player attack strength(ATTACK Btn)
const MONSTER_ATTACK_VALUE = 14; //monster attack strength(ATTCK Btn and Strong attack also)

const STRONG_ATTACK_VALUE= 17;  // player strong attack strength(Strong attack btn)
const HEAL_VALUE=20;  // Heal value of palyer
const MODE_ATTACK='ATTACK';
const MODE_STRONG_ATTACK='STRONG_ATTACK';

const LOG_EVENT_PALYER_ATTACK='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK='MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL='PLAYER_HEAL';
const LOG_EVENT_GAME_OVER='GAME_OVER';

let battleLog=[];  //array to store different log

function getMaxLifeValues(){
  const enteredValue=prompt('Maximum life for you and monster.','100');
  let parsedValue=parseInt(enteredValue);
  if(isNaN(parsedValue) || parsedValue<=0){
    throw {message:'Invalid user input, not a number !'};
  }
  return parsedValue;
}

  let chosenMaxLife;

  try{
     chosenMaxLife=getMaxLifeValues();

  } catch (error) {
    console.log(error);
    chosenMaxLife=100;
    alert('You entered smething wrong, default value of 100 was used');

  }



let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife=true;

adjustHealthBars(chosenMaxLife);


function writeToLog(ev, val, monsterHealth, playerHealth){
let logEntry={
  event:ev,
  value:val,
  target: 'MONSTER',
  finalMonsterHealth:monsterHealth,
  finalPlayerHealth:playerHealth
};

switch(ev) {
  case LOG_EVENT_PLAYER_STRONG_ATTACK:
    logEntry.target='MONSTER';
    break;
    
    case  LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {     // object
        event:ev,
        value:val,
        target: 'MONSTER',
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHealth
      };
      break;

      case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {     // object
        event:ev,
        value:val,
        target: 'PLAYER',
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHealth
      };
      break;

      case LOG_EVENT_PLAYER_HEAL:
        logEntry = {     // object
          event:ev,
          value:val,
          target: 'PLAYER',
          finalMonsterHealth:monsterHealth,
          finalPlayerHealth:playerHealth
        };

        case LOG_EVENT_GAME_OVER:
          logEntry = {     // object
            event:ev,
            value:val,
            // no target property here
            finalMonsterHealth:monsterHealth,
            finalPlayerHealth:playerHealth
          };
          break;
          default:
            logEntry={};


}



  // if(ev===LOG_EVENT_PALYER_ATTACK){
    
  //     logEntry.target='MONSTER';
   
  
  // } else if(ev=== LOG_EVENT_PLAYER_STRONG_ATTACK){
  //   logEntry = {     // object
  //     event:ev,
  //     value:val,
  //     target: 'MONSTER',
  //     finalMonsterHealth:monsterHealth,
  //     finalPlayerHealth:playerHealth
  //   };
    

  // }else if(ev===LOG_EVENT_MONSTER_ATTACK){
  //   logEntry = {     // object
  //     event:ev,
  //     value:val,
  //     target: 'PLAYER',
  //     finalMonsterHealth:monsterHealth,
  //     finalPlayerHealth:playerHealth
  //   };
    

  // }else if(ev===LOG_EVENT_PLAYER_HEAL){
  //   logEntry = {     // object
  //     event:ev,
  //     value:val,
  //     target: 'PLAYER',
  //     finalMonsterHealth:monsterHealth,
  //     finalPlayerHealth:playerHealth
  //   };
   
  // } else if(ev===LOG_EVENT_GAME_OVER){
  //   logEntry = {     // object
  //     event:ev,
  //     value:val,
  //     // no target property here
  //     finalMonsterHealth:monsterHealth,
  //     finalPlayerHealth:playerHealth
  //   };
    
  // }
  battleLog.push(logEntry);
}










function reset() {
   currentMonsterHealth = chosenMaxLife;
   currentPlayerHealth = chosenMaxLife;
   resetGame(chosenMaxLife);
}

function endRound() {  

  const intialPlayerHealth=currentPlayerHealth;
 

  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE); // Player is healing but still monster can attack player
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
 

  if(currentPlayerHealth<=0 && hasBonusLife){
    hasBonusLife=false;
    removeBonusLife();
    currentPlayerHealth=intialPlayerHealth;
    alert('You would be the dead bonus life saved you..!');
    setPlayerHealth(intialPlayerHealth);
  }
 

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );

  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'You have a draw',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if(currentMonsterHealth<=0 || currentPlayerHealth<=0){
    reset();
  }

}

function atttackMonster(mode) {  //function to rmove redundant code
  const maxDamage=mode===MODE_ATTACK ? ATTACK_VALUE:STRONG_ATTACK_VALUE;
  const logEvent=mode===MODE_ATTACK/*if cond*/ ? LOG_EVENT_PALYER_ATTACK/*true*/:LOG_EVENT_PLAYER_STRONG_ATTACK/*false*/;
  /* if(mode===MODE_ATTACK){
    maxDamage=ATTACK_VALUE;
    logEvent=LOG_EVENT_PALYER_ATTACK;
  } else if(mode===MODE_STRONG_ATTACK){
    maxDamage=STRONG_ATTACK_VALUE;
    logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK;
  } */
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
 
}


function attackHandler() { // funtion for attack button
  atttackMonster(MODE_ATTACK);
 
}

function strongAttackHandler() {  // function fro strong ATTACK button
  atttackMonster(MODE_STRONG_ATTACK);
 

}

function healPlayerHandler() {  // function for Heal Button
  let healValue;
  if(currentPlayerHealth>=chosenMaxLife-HEAL_VALUE){
    alert("You can't heal more than your chosen maximum health.... You are still high on health");
    healValue=chosenMaxLife-currentPlayerHealth;
  }
  else {
    healValue=HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth+=healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();

}

function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
