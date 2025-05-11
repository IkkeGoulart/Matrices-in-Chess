const gameboard = document.querySelector('#gameboard')
const whiteMenuPiece = document.querySelector('#piece-list-white')
const blackMenuPiece = document.querySelector('#piece-list-black')

const menuPieces = [
    pieces.king, pieces.queen, pieces.bishop, pieces.knight, pieces.rook, pieces.pawn
]

let selectedPiece = null;
let selectedPieceColor = null;

const addPiece = (event) => {
    const square = event.target.parentNode.parentNode
    if (square.firstChild.classList.contains('valid')) {
        if (selectedPiece && selectedPieceColor) {
            square.innerHTML = pieces[selectedPiece]
            square.firstChild.classList.add(selectedPieceColor)
            validSquares(false)

            selectedPiece = null;
            selectedPieceColor = null;
        }
    }
}

const showMatrixMove = (row, col, piece) => {
    const squares = document.querySelectorAll('#gameboard .square')

    let range = 0

    switch (piece) {
        case 'knight': {
            range = 2
            break
        }

        case 'king': {
            range = 1
            break
        }

        case 'pawn': {
            range = 1
            break
        }

        default: {
            range = 6
            break
        }
    }

    if (piece === 'pawn')
        row -= 1

    for (let r = row - range; r <= row + range; r++) {
        for (let c = col - range; c <= col + range; c++) {
            if ((c < 0 || c > 7) || (r < 0 || r > 7))
                continue

            let idElement = `${r}-${c}`
            document.querySelector(`[square-id="${idElement}"]`).classList.add('matrix')
        }
    }

}

const genericValidMove = (directions, pieceRow, pieceCol, range) => {
    directions.forEach((direction) => {
        let r = pieceRow
        let c = pieceCol
        let counter = 0

        //atualiza os valores de linha e coluna com base na diagonal percorrida da vez
        //caso seja detectada uma peça, a iteração da diagonal para e inicia a próxima
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7 && counter != range) {
            r += direction.dr
            c += direction.dc

            if (r < 0 && r > 7 && c < 0 && c > 7)
                break

            let square = document.querySelector(`[square-id="${r}-${c}"]`)

            if (square) {
                if (!square.firstChild || !square.firstChild.classList.contains(pieceColor)) {
                    const valid = document.createElement('div')
                    valid.innerHTML = validCircle
                    square.appendChild(valid.firstChild)

                    if (square.firstChild.classList.contains('piece') && !square.firstChild.classList.contains(pieceColor))
                        break
                } else
                    break
            }
            counter++

        }
    })
}

const validMove = (event) => {
    if (!event.target.parentNode.parentNode)
        return

    if (!event.target.parentNode.parentNode.classList.contains('piece')) {
        validSquares(false)
        return
    }

    const piece = event.target.parentNode.parentNode.getAttribute('id')

    const pieceColor = event.target.parentNode.parentNode.classList.contains('white') ? 'white' : 'black'

    const squares = document.querySelectorAll('#gameboard .square')

    const idSquare = event.target.parentNode.parentNode.parentNode.getAttribute('square-id')

    const pieceRow = parseInt(idSquare.split('-')[0])
    const pieceCol = parseInt(idSquare.split('-')[1])

    //showMatrixMove(pieceRow, pieceCol, piece)

    switch (piece) {
        case 'knight': {
            let possibleSquares = [
                `${pieceRow - 2}-${pieceCol - 1}`, `${pieceRow - 2}-${pieceCol + 1}`,
                `${pieceRow + 2}-${pieceCol - 1}`, `${pieceRow + 2}-${pieceCol + 1}`,
                `${pieceRow - 1}-${pieceCol - 2}`, `${pieceRow - 1}-${pieceCol + 2}`,
                `${pieceRow + 1}-${pieceCol - 2}`, `${pieceRow + 1}-${pieceCol + 2}`
            ]

            squares.forEach((square) => {
                if (possibleSquares.includes(square.getAttribute('square-id')) &&
                    (!square.firstChild || !square.firstChild.classList.contains(pieceColor))) {
                    const valid = document.createElement('div')
                    valid.innerHTML = validCircle
                    square.appendChild(valid.firstChild)
                }
            })

            break;
        }

        case 'bishop': {
            //o bispo se movimenta na diagonal
            //a diagonal principal de um quadrado tem a diferença entre linha e coluna constante
            //enquanto a outra diagonal tem a soma constante

            let diagonals = [
                { dr: - 1, dc: - 1 }, //esquerda da diagonal principal
                { dr: + 1, dc: + 1 }, //direita da diagonal principal
                { dr: + 1, dc: - 1 }, //esquerda da outra diagonal
                { dr: - 1, dc: + 1 } //direita da outra diagonal
            ]
            genericValidMove(diagonals, pieceRow, pieceCol, 7)
            break;
        }

        case 'rook': {
            let directions = [
                { dr: 0, dc: -1 }, // esquerda
                { dr: 0, dc: 1 }, // direita
                { dr: -1, dc: 0 }, // cima
                { dr: 1, dc: 0 }, // baixo
            ]

            genericValidMove(directions, pieceRow, pieceCol, 7)
            break;
        }

        case 'queen': {
            let directions = [
                { dr: 0, dc: -1 }, // esquerda
                { dr: 0, dc: 1 }, // direita
                { dr: -1, dc: 0 }, // cima
                { dr: 1, dc: 0 }, // baixo
                { dr: - 1, dc: - 1 }, //esquerda da diagonal principal
                { dr: + 1, dc: + 1 }, //direita da diagonal principal
                { dr: + 1, dc: - 1 }, //esquerda da outra diagonal
                { dr: - 1, dc: + 1 } //direita da outra diagonal

            ]

            genericValidMove(directions, pieceRow, pieceCol, 7)
            break;
        }

        case 'king': {
            let directions = [
                { dr: 0, dc: -1 }, // esquerda
                { dr: 0, dc: 1 }, // direita
                { dr: -1, dc: 0 }, // cima
                { dr: 1, dc: 0 }, // baixo
                { dr: - 1, dc: - 1 }, //esquerda da diagonal principal
                { dr: + 1, dc: + 1 }, //direita da diagonal principal
                { dr: + 1, dc: - 1 }, //esquerda da outra diagonal
                { dr: - 1, dc: + 1 } //direita da outra diagonal
            ]
            genericValidMove(directions, pieceRow, pieceCol, 1)
            break;
        }

        /*case 'pawn': { //não teremos peão
            break;
        }*/
    }
}

const createBoard = () => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div')
            square.classList.add('square')
            square.setAttribute('square-id', `${row}-${col}`) //atribuindo id único para cada peça no modelo 'linha-coluna'

            square.classList.add((row + col) % 2 == 0 ? 'pink-square' : 'white-square') //atribuindo as classes para alterar a cor

            square.addEventListener('click', addPiece)
            square.addEventListener('click', validMove)
            gameboard.append(square)
        }
    }
}

createBoard()

let menuPieceSelected = false;

const validSquares = (visible) => {
    if (!visible) {
        const validElements = document.querySelectorAll('.valid')
        validElements.forEach(validElement => {
            validElement.remove();
        })

        const matrixElements = document.querySelectorAll('.matrix')
        matrixElements.forEach((matrixElement) => {
            matrixElement.classList.remove('matrix')
        })
        return
    }

    const squares = document.querySelectorAll('#gameboard .square')

    squares.forEach((square) => {
        if (square.innerHTML === '') {
            square.innerHTML = validCircle
        }
    })
}

const selectPieceMenu = (event) => {
    if (menuPieceSelected) {
        menuPieceSelected = false
        validSquares(false)
        return
    }

    menuPieceSelected = true
    validSquares(true)

    selectedPiece = event.target.parentNode.parentNode.getAttribute('id')
    selectedPieceColor = event.target.parentNode.parentNode.parentNode.classList.contains('white') ? 'white' : 'black'
}

const createMenu = () => {
    for (let i = 0; i < 12; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        square.classList.add('menu-pieces')

        if (i % 2 == 0) {
            square.classList.add('pink-square')
        } else {
            square.classList.add('white-square')
        }

        square.innerHTML = menuPieces[i % 6]

        if (i < 6) {
            square.classList.add('black')
            blackMenuPiece.append(square)
        } else {
            square.classList.add('white')
            whiteMenuPiece.append(square)
        }

        square.addEventListener('click', selectPieceMenu)
    }

}

createMenu()
