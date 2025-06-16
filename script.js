document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const wordList = document.getElementById('word-list');
    const message = document.getElementById('message');

    // Palavras e grid personalizado (tema rural)
    const words = ['TRATOR', 'VACA', 'PLANTIO', 'SOLO', 'AGUA', 'MILHO'];
    const gridData = [
        ['T', 'R', 'A', 'T', 'O', 'R', 'X', 'Y', 'Z', 'W'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        ['V', 'A', 'C', 'A', 'K', 'L', 'M', 'N', 'O', 'P'],
        ['P', 'L', 'A', 'N', 'T', 'I', 'O', 'Q', 'R', 'S'],
        ['S', 'O', 'L', 'O', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        ['A', 'G', 'U', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
        ['M', 'I', 'L', 'H', 'O', 'T', 'U', 'V', 'W', 'X'],
        ['X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
    ];

    let selectedCells = [];
    let foundWords = [];

    // Cria o grid
    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < gridData.length; i++) {
            for (let j = 0; j < gridData[i].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = gridData[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => selectCell(cell));
                grid.appendChild(cell);
            }
        }
    }

    // Cria a lista de palavras
    function createWordList() {
        wordList.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.className = 'word-item';
            li.textContent = word;
            li.dataset.word = word;
            wordList.appendChild(li);
        });
    }

    // Seleciona células
    function selectCell(cell) {
        if (cell.classList.contains('found')) return;

        cell.classList.toggle('selected');
        const index = selectedCells.findIndex(c => c === cell);
        if (index === -1) {
            selectedCells.push(cell);
        } else {
            selectedCells.splice(index, 1);
        }

        if (selectedCells.length > 1) {
            checkWord();
        }
    }

    // Verifica se as células selecionadas formam uma palavra
    function checkWord() {
        const selectedWord = selectedCells.map(cell => cell.textContent).join('');
        if (words.includes(selectedWord)) {
            foundWords.push(selectedWord);
            selectedCells.forEach(cell => {
                cell.classList.add('found');
                cell.classList.remove('selected');
            });
            updateWordList(selectedWord);
            message.textContent = `Parabéns! Você encontrou "${selectedWord}"!`;
            setTimeout(() => {
                message.textContent = '';
            }, 2000);
        } else {
            message.textContent = 'Tente novamente!';
            setTimeout(() => {
                selectedCells.forEach(cell => {
                    cell.classList.remove('selected');
                });
                selectedCells = [];
                message.textContent = '';
            }, 1000);
        }
    }

    // Atualiza a lista de palavras encontradas
    function updateWordList(word) {
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach(item => {
            if (item.dataset.word === word) {
                item.classList.add('found');
            }
        });
    }

    // Inicializa o jogo
    createGrid();
    createWordList();
});