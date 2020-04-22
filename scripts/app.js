const boardElements = document.querySelectorAll('.board-item');
const resetBtn = document.querySelector('#reset-btn');
const displays = document.querySelectorAll('#display h2');
const form = document.querySelector('#player-form');
let game = undefined;

for (let i = 0; i < boardElements.length; i++) {
    boardElements[i].addEventListener('click', () => {
        if(game) {
            game.move(i);
        }
    });
}

form.addEventListener('submit', function(e) {
    let Data = new FormData(form);
    let name1, name2;

    if(Data.get('name1').length === 0) {
        name1 = 'PLAYER 1';
    } else {
        name1 = Data.get('name1');
    }

    if(Data.get('name2').length === 0) {
        name2 = 'PLAYER 2';
    } else {
        name2 = Data.get('name2');
    }

    if (game !== undefined) {
        game.reset();
    }

    displays[0].textContent = `GAME STARTED`;
    displays[1].textContent = `[X] ${name1.toUpperCase()}'s TURN`;
    game = Game(Player(name1,'x'), Player(name2,'o'), board);
    e.preventDefault();
});

resetBtn.addEventListener('click', () => {
    game.reset();
});

const Player = (name, symbol, turn = 0) => {
    const getName = () => name.toUpperCase();
    const getSymbol = () => symbol.toUpperCase();
    const getTurn = () => turn;

    return {getName, getSymbol, getTurn};
};

const board = (() => {
    let board = [];

    for(let i = 0; i < 9; i++) {
        board[i] = '';
    }

    function getBoard() {
        return board;
    }

    function tryPlayerMove(player, index) {
        if (board[index] === '') {
            board[index] = player.getSymbol();
            return true;
        } else {
            return false;
        }
    }

    function check(player, index0, index1, index2) {
        let string  = board[index0] + board[index1] + board[index2];
        let playerString = player.getSymbol() + player.getSymbol() + player.getSymbol();
        if (string === playerString) {
            let indexes = String(index0) + String(index1) + String(index2)
            return indexes;
        } else {
            return false;
        }
    }

    function isFull() {
        if (board.join('').length === 9) {
            return true;
        } else {
            return false;
        }
    }

    function reset() {
        for(let i = 0; i < 9; i++) {
            board[i] = '';
        }
    }

    return {
        getBoard,
        tryPlayerMove,
        reset,
        isFull,
        check
    };
})();

const Game = (player1, player2) => {
    let turn = 0;
    let gameover = false;

    const move = (index) => {
        if (!gameover) {
            let validMove = false;
            if (turn === 0) {
                validMove = board.tryPlayerMove(player1, index);
                if (validMove) {
                    displays[1].textContent = `[${player2.getSymbol()}] ${player2.getName()}'s TURN`;
                    checkForWinner(player1);
                    turn = 1;
                }
            } else {
                
                validMove = board.tryPlayerMove(player2, index);
                if (validMove) {
                    displays[1].textContent = `[${player1.getSymbol()}] ${player1.getName()}'s TURN`;
                    checkForWinner(player2);
                    turn = 0;
                }
            }
            render();
        }
    }

    const checkForWinner = (player) => {
        let winningOptions = [[0,1,2], [3,4,5],
        [6,7,8], [0,3,6], [1,4,7],
        [2,5,8], [0,4,8], [2,4,6]];

        for (let i = 0; i < winningOptions.length; i++) {
            let win = board.check(player, winningOptions[i][0], winningOptions[i][1], winningOptions[i][2]);
            if(win !== false) {
                gameOver(player, winningOptions[i][0], winningOptions[i][1], winningOptions[i][2]);
                break;
            }
        }

        if (board.isFull()) {
            gameOver();
        }
    }

    const gameOver = (player, index0, index1, index2) => {
        gameover = true;
        displays[0].textContent = 'GAME OVER';
        if(player === undefined) {
            console.log('game ended in tie')
            displays[1].textContent = 'TIE';
        } else {
            console.log(`${player.getSymbol()} ${player.getName()} won at indexes ${index0}, ${index1}, ${index2}`);
            boardElements[index0].classList.toggle('win');
            boardElements[index1].classList.toggle('win');
            boardElements[index2].classList.toggle('win');
            displays[1].textContent = `${player.getName()} WON`;
        }
    }

    const render = () => {
        for(let i = 0; i < 9; i++) {
            boardElements[i].textContent = board.getBoard()[i];
        }
    }

    const reset = () => {
        turn = 0;
        gameover = false;
        board.reset();
        boardElements.forEach((element) => {
            element.classList.remove('win');
        });
        displays[0].textContent = 'GAME STARTED';
        displays[1].textContent = `[X] ${player1.getName()}'s turn`;
        render();
    }

    return {render, checkForWinner, move, reset};
};