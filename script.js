'use strict';

let calcOperator,
    maxDigit,
    maxNum = 1,
    maxQuestion,
    nowQuestionNum = 1,
    result = [],
    startTime;

// el === element
let elDisplayArea,
    elQuestionArea,
    elQuestionNum,
    elQuestionText,
    elAnsBox;

const startGame = (type) => {
  // リトライ時は処理しない
  if (type !== 'retry') {
    const elMaxQuestionErrText = document.getElementById('max-question-err-text');
    const elMaxDigitErrText = document.getElementById('max-digit-err-text');
    if (elMaxQuestionErrText.textContent) elMaxQuestionErrText.textContent = '';
    else if (elMaxDigitErrText.textContent) elMaxDigitErrText.textContent = '';

    maxQuestion = parseInt(document.getElementById('max-question').value, 10);
    maxDigit = parseInt(document.getElementById('max-digit').value, 10);
    if (maxQuestion && 1 > maxQuestion || maxQuestion > 100) {
      elMaxQuestionErrText.textContent = '※ 1以上100以下の値を入力してください';
      return;
    } else if (maxDigit && 1 > maxDigit || maxDigit > 10) {
      elMaxDigitErrText.textContent = '※ 1以上10以下の値を入力してください';
      return;
    }

    // 入力があればその値を、無ければ初期値を代入
    maxQuestion = maxQuestion ? maxQuestion : 15;



    if (type === 'addition') {
      calcOperator = '+';
      maxDigit = maxDigit ? maxDigit : 2;
    } else if (type === 'subtraction') {
      calcOperator = '-';
      maxDigit = maxDigit ? maxDigit : 2;
    } else if (type === 'multiplication') {
      calcOperator = '×';
      maxDigit = maxDigit ? maxDigit : 1;
    }

    // maxDigitの計算
    for (let i = 0; i < maxDigit; i++) {
      maxNum = maxNum * 10;
    }

  }

  elDisplayArea = document.getElementById('display-area');
  while (elDisplayArea.firstChild) elDisplayArea.removeChild(elDisplayArea.firstChild);

  // 問題番号を表示する場所
  elQuestionNum = document.createElement('h2');
  elQuestionNum.id = 'question-num';

  // 問題文・回答欄の表示場所
  elQuestionArea = document.createElement('p');
  elQuestionArea.id = 'question-area';

  // 問題テキストエリア
  elQuestionText = document.createElement('span');
  elQuestionText.id = 'question-text';
  elQuestionArea.insertBefore(elQuestionText, elQuestionArea.firstChild);

  // 解答欄の設置
  elAnsBox = document.createElement('input');
  elAnsBox.id = 'ans-box';
  elAnsBox.autofocus = true;
  elAnsBox.setAttribute('type', 'number');
  elAnsBox.setAttribute('pattern', '\d*');
  elAnsBox.setAttribute('oncopy', 'return false;');
  elAnsBox.setAttribute('onpaste', 'return false;');
  elAnsBox.setAttribute('onkeypress', 'keyInputDecision(event);');
  
  const elErrText = document.createElement('p');
  elErrText.id = 'err-text';

  elQuestionArea.appendChild(elAnsBox);
  elQuestionArea.appendChild(elErrText);
  elDisplayArea.appendChild(elQuestionNum);
  elDisplayArea.appendChild(elQuestionArea);

  // 開始時間を記録
  startTime = new Date();

  genQuestion();
}


const allowNumOnly = (event) => {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}


const keyInputDecision = (event) => {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  } else if (charCode === 13) {
    let elErrText = document.getElementById('err-text');

    // 値が入力されていれば次の問題へ
    if (elAnsBox.value) {
      if (elErrText.textContent) elErrText.textContent = '';
      genQuestion();
    } else {
      elErrText.textContent = '※ 値を入力してください';
    }
  }
}


const genQuestion = () => {

  if (nowQuestionNum > 1) {
    const prevResult = result[nowQuestionNum - 2];
    prevResult.ans = elAnsBox.value;
    prevResult.correctness = prevResult.correctAns === prevResult.ans ? true : false;
  }

  // 最後の問題だったらリザルト画面を表示
  if (nowQuestionNum > maxQuestion) {
    resultAnnounce();
    return;
  }
  
  let num1 = Math.floor(Math.random() * maxNum);
  let num2 = Math.floor(Math.random() * maxNum);
  // 引く数が引かれる数より大きい場合入れ替える（答えがマイナスにならないように）
  if (calcOperator === '-' && num1 < num2) {
    const tmp = num1;
    num1 = num2;
    num2 = tmp;
  }

  elAnsBox.value = '';

  elQuestionNum.textContent = nowQuestionNum + ' 問目';

  const questionStr = num1 + ' ' + calcOperator + ' ' + num2 + ' =';
  elQuestionText.textContent = questionStr;

  let obj = {};
  obj.id = nowQuestionNum;
  obj.question = questionStr;
  if (calcOperator === '+') obj.correctAns = num1 + num2 + '';
  else if (calcOperator === '-') obj.correctAns = num1 - num2 + '';
  else if (calcOperator === '×') obj.correctAns = num1 * num2 + '';

  result.push(obj);

  nowQuestionNum++;
}


const resultAnnounce = () => {
  // 終了時間を記録
  const endTime = new Date();
  let resultNum = 0;

  while (elDisplayArea.firstChild) elDisplayArea.removeChild(elDisplayArea.firstChild);

  const elResultTitle = document.createElement('h2');
  elResultTitle.id = 'result-title';
  elResultTitle.textContent = 'Result';
  elDisplayArea.appendChild(elResultTitle);

  const elResultArea = document.createElement('div');
  elResultArea.id = 'result-area';
  elDisplayArea.appendChild(elResultArea);

  const elResultTimeArea = document.createElement('div');
  elResultTimeArea.id = 'result-time';
  elResultTimeArea.textContent = 'タイム: ' + Math.floor((endTime.getTime() - startTime.getTime()) / 1000) + ' 秒';
  elResultArea.appendChild(elResultTimeArea);

  const elResultNumArea = document.createElement('div');
  elResultNumArea.id = 'result-num';
  elResultArea.appendChild(elResultNumArea);

  const elResults = document.createElement('div');
  elResults.id = 'results';
  elResultArea.appendChild(elResults);

  result.forEach((elm) => {
    const elResultText = document.createElement('div');
    elResultText.classList.add('result');

    const elAnsArea = document.createElement('p');
    elAnsArea.classList.add('ans-area');

    const elAns = document.createElement('span');
    elAns.classList.add('ans');
    elAns.textContent = elm.id + ' 問目:  ' + elm.question + ' ' + elm.ans;

    const elCorrectOrIncorrect = document.createElement('span');
    elCorrectOrIncorrect.classList.add('correct-or-incorrect');


    let elCorrectAnsArea;
    if (elm.correctness) {
      elCorrectOrIncorrect.textContent = '正解';
      elResultText.classList.add('correct-ans');
      resultNum++;
    } else {
      elCorrectOrIncorrect.textContent = '不正解';
      elResultText.classList.add('incorrect-ans');

      elCorrectAnsArea = document.createElement('p');
      elCorrectAnsArea.classList.add('correct-ans-area');
      elCorrectAnsArea.textContent = '正答: ' + elm.correctAns;
    }

    elAnsArea.appendChild(elAns);
    elAnsArea.appendChild(elCorrectOrIncorrect);
    elResultText.appendChild(elAnsArea);
    if (elCorrectAnsArea) elResultText.appendChild(elCorrectAnsArea);

    elResults.appendChild(elResultText);
  });

  elResultNumArea.textContent = maxQuestion + ' 問中 ' + resultNum + ' 問正解';


  // Retryボタン と TOPボタン
  const elRetryBtn = document.createElement('button');
  elRetryBtn.id = 'retry-btn';
  elRetryBtn.setAttribute('onclick', 'retry();');
  elRetryBtn.textContent = 'RETRY'
  
  const elBackToTopBtn = document.createElement('button');
  elBackToTopBtn.id = 'back-to-top-button';
  elBackToTopBtn.setAttribute('onclick', 'location.href="./index.html";');
  elBackToTopBtn.textContent = 'TOP';

  elDisplayArea.appendChild(elRetryBtn);
  elDisplayArea.appendChild(elBackToTopBtn);
}

// 同設定でリトライ
const retry = () => {
  result = [];
  nowQuestionNum = 1;
  startGame('retry');
}