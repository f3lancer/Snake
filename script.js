
let restart = document.getElementById('restart')
let pause = document.getElementById('pause')
let scoreSpeed = document.querySelector('#speed')
let scoreCells = document.querySelector('#cells')

const generateRandomNumber = (n) =>
    {
       return Math.floor(Math.random() * n) + 1;
     }

     const createArray = (end, random = false, start = 1)  => {
        let arr = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        if (random) {
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); 
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        return arr;
    }

let game = {
    widthPool:15, 
    go : 0,
    speed:5,
    cells:1,
    restart:false,
    container:'snake-body',
    score:0,
    numArray:0,
    startNumber:[],
    foodNumber:0,
    muve : '',
    bufer:[],
    point:10,
    gameOver:false,
    
}

const muveStart = () =>{
    let n = game.widthPool/(game.startNumber-((Math.floor(game.startNumber/game.widthPool,0))*game.widthPool))
        if (n>=2) {
           game.muve = 'right'
        }else{            
            game.muve = 'left'
        }
}

const generationAllNumbers = () =>{
    game.numArray = Math.pow(game.widthPool,2),
    game.startNumber[0] = generateRandomNumber(game.numArray)
    game.foodNumber = generateRandomNumber(game.numArray)
    while (game.foodNumber === game.startNumber) {
        game.foodNumber = generateRandomNumber(game.numArray);
    }
    game.arrayN = createArray(game.numArray,false)    
    muveStart()
}

const foodNewGanerated = () =>{ 
    game.foodNumber = generateRandomNumber(game.numArray)
    while (game.startNumber.includes(game.foodNumber)) {
        game.foodNumber = generateRandomNumber(game.numArray);
    }
}

console.log(game);

const result = (d) =>{
    clearInterval(game.go);
    document.addEventListener('DOMContentLoaded', () => {
        
        const container = document.querySelector(`.${game.container}`);  
        let div = document.createElement('div')
        div.className = 'game-over'
        div.innerHTML = 'game over'
        container.innerHTML = ''
        container.append(div)
        console.log(div);
        console.log(container);
        
        console.log('Game over');
      });
    
}

const renderNum = () =>{
    const container = document.querySelector(`.${game.container}`);  
    if (game.gameOver) result(container)
    
    container.innerHTML = ''
    container.style.gridTemplateColumns = `repeat(${game.widthPool}, 1fr)`;
    
    let h2 = document.createElement('h2')
    h2.className = 'body-score'
    h2.textContent = 'score: '
    let span = document.createElement('span')
    span.textContent = game.score
    h2.appendChild(span)
    container.appendChild(h2)
    
    game.arrayN.forEach((v,i,arr)=>{
        let cell = document.createElement('div');
        cell.className ='cell empty'
         
        game.startNumber.forEach((b)=>{
            v === b && cell.classList.remove('empty');
        })

        v === game.foodNumber && cell.classList.remove('empty');
        v === game.foodNumber && cell.classList.add('food'); 
        
        container.appendChild(cell)
    })    
    
    scoreSpeed.textContent = game.speed  
}

restart.addEventListener("click", function () {
    game.startNumber = []
    generationAllNumbers()
    renderNum()
    console.log(game);
});


const repeatFunction = (callback, interval) => {
    return setInterval(callback, interval);
}

const foodEating = () => {
    if ( game.startNumber[0]===game.foodNumber) 
        {   
            game.startNumber.push(game.bufer[game.bufer.length - 1])
            foodNewGanerated()   
            game.cells =  game.startNumber.length
            scoreCells.firstElementChild.textContent = game.cells
            cellWidthStyle = game.cells/(game.arrayN.length*0.01)
            
            scoreCells.style.setProperty('--cells-width', `${cellWidthStyle}%`)
            score()
    } 
}

const score = () =>{
    game.score +=game.point
    }

const deathSnaceBorder = (num) =>{
    game.startNumber.forEach((n,i)=>{
        if (i!=0) {            
            if (num===n) {
                game.gameOver = true
            return false
            }
        }
    })
}


const goSlingR = () =>{
    
    game.bufer = game.startNumber
    let firstElement = game.startNumber[0]+1
    game.startNumber.unshift(firstElement)
    game.startNumber.pop();
    deathSnaceBorder(firstElement)
    
    foodEating()
    renderNum()
}

const goSlingL = () =>{

    game.bufer = game.startNumber
    let firstElement = game.startNumber[0]-1
    game.startNumber.unshift(firstElement)
    game.startNumber.pop();
    deathSnaceBorder(firstElement)
    
    foodEating()
    renderNum()

}
const goSlingT = () =>{

    game.bufer = game.startNumber
    let firstElement = game.startNumber[0]-game.widthPool;
    game.startNumber.unshift(firstElement)
    game.startNumber.pop();
    deathSnaceBorder(firstElement)
    
    foodEating()
    renderNum()
  
}
const goSlingB = () =>{
    game.bufer = game.startNumber
    let firstElement = game.startNumber[0]+game.widthPool;
    game.startNumber.unshift(firstElement)
    game.startNumber.pop();
    deathSnaceBorder(firstElement)
    
    foodEating()
    renderNum()
}

const startGame = ()=>{

    game.go = repeatFunction(() => {
        
        switch (game.muve) {
            case 'right':
                    goSlingR()
                break;
                case 'left':
                    goSlingL()    
                break;
                case 'top':
                    goSlingT()    
                break;
                case 'bottom':
                    goSlingB()    
                break;
                    default:
                break;
                }   
                }, (1/game.speed)*1000);
}

 

pause.addEventListener("click", function (e) {
 
    if (game.go === null) {
        e.target.classList.toggle('stop')
        e.target.textContent = 'pause'
        startGame();
    }else{
        e.target.classList.toggle('stop')
        e.target.textContent = 'continue'
        clearInterval(game.go);
        game.go = null;
      }
});




function listenForKeyboard(callback) {
    document.addEventListener('keydown', (e) => {
      callback(e);
    });
  }
  

  listenForKeyboard((event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (game.muve==='bottom'&&game.startNumber.length!=1)  break;
            game.muve ='top'
            break;
        case 'ArrowDown':
            if (game.muve==='top'&&game.startNumber.length!=1)  break;
            game.muve='bottom'
            break;
        case 'ArrowLeft':
            if (game.muve==='right'&&game.startNumber.length!=1)  break;
            game.muve='left'
                break;
        case 'ArrowRight':
            if (game.muve==='left'&&game.startNumber.length!=1)  break;
            game.muve='right'
            break;
    
        default:
            break;
    }
  });

generationAllNumbers()
renderNum()
startGame()