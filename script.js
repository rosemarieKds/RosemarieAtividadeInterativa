let gridSize = 15;
let grid = [];
let words = ["ESCOLA", "TRATOR", "PLANTAÇÃO", "ALUNO", "LIVRO", "COLHEITA", "PROFESSOR", "CAMPO", "SOJA", "MILHO", "GADO", "PASTO", "HORTA", "EDUCAÇÃO", "CADERNO"];
let foundWords = {};
let currentStudent = "";

function createGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    words.forEach(word => placeWord(word));
    fillEmptySpaces();
    renderGrid();
}

function placeWord(word) {
    let placed = false;
    while (!placed) {
        let dir = Math.random() < 0.5 ? "H" : "V";
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);

        if (dir === "H" && col + word.length <= gridSize) {
            if (grid[row].slice(col, col + word.length).every(c => c === "")) {
                for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
                placed = true;
            }
        } else if (dir === "V" && row + word.length <= gridSize) {
            if (grid.slice(row, row + word.length).every(r => r[col] === "")) {
                for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
                placed = true;
            }
        }
    }
}

function fillEmptySpaces() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === "") grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
}

function renderGrid() {
    const gridContainer = document.getElementById("wordGrid");
    gridContainer.innerHTML = "";
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener("click", () => cellClicked(rowIndex, colIndex));
            gridContainer.appendChild(cell);
        });
    });
}

function startGame() {
    currentStudent = document.getElementById("studentName").value.trim();
    if (currentStudent === "") {
        alert("Digite seu nome!");
        return;
    }
    document.getElementById("studentNameArea").style.display = "none";
    createGrid();
}

function cellClicked(row, col) {
    let word = getWordFromPosition(row, col);
    if (word && !foundWords[word]) {
        foundWords[word] = currentStudent;
        document.querySelectorAll(".cell").forEach(cell => {
            if (cell.dataset.word === word) cell.classList.add("found");
        });
        updateFoundWords();
        updateRanking();
    }
}

function getWordFromPosition(row, col) {
    for (let word of words) {
        // Horizontal check
        if (col + word.length <= gridSize) {
            let found = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== word[i]) {
                    found = false;
                    break;
                }
            }
            if (found) markWordCells(row, col, "H", word);
            if (found) return word;
        }
        // Vertical check
        if (row + word.length <= gridSize) {
            let found = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== word[i]) {
                    found = false;
                    break;
                }
            }
            if (found) markWordCells(row, col, "V", word);
            if (found) return word;
        }
    }
    return null;
}

function markWordCells(row, col, dir, word) {
    for (let i = 0; i < word.length; i++) {
        let selector = `.cell[data-row='${dir === "H" ? row : row + i}'][data-col='${dir === "H" ? col + i : col}']`;
        let cell = document.querySelector(selector);
        if (cell) cell.dataset.word = word;
    }
}

function updateFoundWords() {
    const list = document.getElementById("foundWordsList");
    list.innerHTML = "";
    for (let word in foundWords) {
        let li = document.createElement("li");
        li.textContent = `${word} → ${foundWords[word]}`;
        list.appendChild(li);
    }
}

function updateRanking() {
    let rankingCount = {};
    for (let word in foundWords) {
        let student = foundWords[word];
        rankingCount[student] = (rankingCount[student] || 0) + 1;
    }

    let rankingList = Object.entries(rankingCount).sort((a, b) => b[1] - a[1]);
    const rankElement = document.getElementById("ranking");
    rankElement.innerHTML = "";
    rankingList.forEach(([student, count]) => {
        let li = document.createElement("li");
        li.textContent = `${student}: ${count} palavras`;
        rankElement.appendChild(li);
    });
}
