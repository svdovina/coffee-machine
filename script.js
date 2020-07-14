"use strict";

let state = "waiting"; //"cooking" "ready" переменная для отслеживания состояния кофемашины
let balance = document.querySelector(".balance"); 
//onclick="cookCoffee('Американо', 50, this)"
//  console.log(balance.value); //забираем значение баланса из инпута
let cup = document.querySelector(".cup img");

function cookCoffee(name, price, elem) {
  if (state !="waiting") {
    return;
  }
  if (balance.value >= price) { 
    state = "cooking";
    balance.style.backgroundColor = "";
    balance.value -= price; // balance.value = balance.value - price
    changeDisplayText(`Ваш ${name} готовится`);
    
//    console.log(elem);
    let coffeeImg = elem.querySelector("img");
//    console.log(coffeeImg);
    let coffeeSrc = coffeeImg.getAttribute("src");
//    console.log(coffeeSrc);
//    console.log(coffeeImg.src);
    
    startCooking(name, coffeeSrc);
  } else {
    changeDisplayText("Недостаточно средств");
    balance.style.backgroundColor = "rgb(255, 50, 50)";
  }
}

//Планирование
// setTimeout(func, ms) - отрабатывает только один раз
// setInterval(func, ms) - отрабатывает пока не отключим
// let timeout = setTimeout(func, ms);
// let timeinterval = setInterval(func, ms);
// clearTimeout(timeout)
// clearInterval(interval)

function startCooking(name, src) {
  //let progressBar = document.querySelector(".progress-bar"); //вынесли функционал в отдельную функцию changeProgressPercent
//  let cup = document.querySelector(".cup img"); //вынесли в глобальную переменную
  cup.setAttribute("src", src); //"src" - какой атрибут, src - переменная
  cup.style.display = "inline";
  let t = 0;
  let cookingInterval = setInterval(() => { //тоже самое, что и function() {}
    t++;
    cup.style.opacity = t + "%";
    //progressBar.style.width = t + "%";
    changeProgressPercent(t);
    console.log(t);
    if (t == 100) {
      state = "ready";
      clearInterval(cookingInterval);
      changeDisplayText(`Ваш ${name} готов!`);
      cup.style.cursor = "pointer";
      cup.onclick = function() {
        takeCoffee();
      };
    }
  }, 50);
}

function takeCoffee() {
  if (state != "ready") {
    return;
  }
  state = "waiting";
  changeProgressPercent(0);
  cup.style.opacity = 0;
  cup.style.display = ""; //или "none"
  cup.style.cursor = "";
  changeDisplayText("Выберите кофе");
  cup.onclick = null;
}

function changeProgressPercent(percent) {
  let progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = percent + "%";
}

function changeDisplayText(text) { 
  if (text.length > 23) {
    text = text.slice(0, 23) + "...";
  }
  let displayText = document.querySelector(".display span");
  displayText.innerHTML = text;
}

//----------------Drag'n'Drop----------------
let money = document.querySelectorAll(".money img"); //получаем массив всех купюр
//два варианта для перебора всего массива с for
//1
//for (let i = 0; i < money.length; i++) {
//  money[i].onclick = takeMoney; //изменения внутри массива будут
//}

//2
//В функцию, которая присвоена событию, передается this, который возвращает элемент, на котором это событие совершено
for (let bill of money) {
  bill.onmousedown = takeMoney; //изменений в массиве не будет
}
//В функцию, которая присвоена событию, первым параметром передается объект события - event, 

function takeMoney(event) {
  event.preventDefault();
//  console.log(this);
//  console.log(event);
//  console.log([event.target, event.clientX, event.clientY]);
  let bill = this;
  
//  console.log( bill.style.height ); //""
//  console.log( bill.style.width ); //""
//  console.log( bill.getBoundingClientRect() );
  
  let billCoords = bill.getBoundingClientRect(); //Получение объекта, которые описывает положение элемента
  
  let billHeight = billCoords.height;
  let billWidth = billCoords.width;
  
  bill.style.position = "absolute";
  if (!bill.style.transform) { //bill.style.transform == ""
    bill.style.top = (event.clientY - billHeight/2 + "px");
    bill.style.left = event.clientX - billWidth/2 + "px";
    bill.style.transform = "rotate(90deg)";
  } else {
    bill.style.top = (event.clientY - billWidth/2 + "px");
    bill.style.left = (event.clientX - billHeight/2 + "px");
  }
  
  bill.style.transition = "transform .3s";
  
  window.onmousemove = function (event) {
    let billCoords = bill.getBoundingClientRect(); 
    let billHeight = billCoords.height;
    let billWidth = billCoords.width;
    bill.style.top = (event.clientY - billWidth/2 + "px");
    bill.style.left = (event.clientX - billHeight/2 + "px");
  };
  
  bill.onmouseup = function() {
    window.onmousemove = null;
    if ( inAtm(bill) ) {
      let cashContainer = document.querySelector(".cash-container");
      bill.style.position = "";
      bill.style.transform = "rotate(90deg) translateX(25%)";
      cashContainer.append(bill); // Присоеденить в конце элемента
      bill.style.transition = "transform 1.5s";
      setTimeout(() => {
        bill.style.transform = "rotate(90deg) translateX(-75%)";
        bill.ontransitionend = () => {
          balance.value = +balance.value + +bill.dataset.cost;
          bill.remove();
        };
      }, 10);

    // console.log( bill.getAttribute("data-cost") );
    // console.log( bill.dataset.cost );
    }
  };
}

function inAtm(bill) {
  let atm = document.querySelector(".atm img");
  
  let atmCoords = atm.getBoundingClientRect();
  let atmLeftX = atmCoords.x;
  let atmRightX = atmCoords.x + atmCoords.width;
  let atmTopY = atmCoords.y;
  let atmBottomY = atmCoords.y + atmCoords.height/3;
  
  let billCoords = bill.getBoundingClientRect();
  let billLeftX = billCoords.x;
  let billRightX = billCoords.x + billCoords.width;
  let billY = billCoords.y;
  if(
        billLeftX > atmLeftX
    &&  billRightX < atmRightX
    &&  billY > atmTopY
    &&  billY < atmBottomY
    ) {
    return true;
  } else {
    return false;
  }
  
//  return {
//    atm: [atmLeftX, atmRightX, atmTopY, atmBottomY],
//    bill: [billLeftX, billRightX, billY],
//  };

}

//Получение сдачи, создание элементов с использованием JavaScript
let changeButton = document.querySelector(".change-button");
changeButton.onclick = takeChange;

function takeChange() { //рекурсивная функция - функция, которая вызывает саму себя, пока выполняются условия
  if (+balance.value >= 10) {
    createCoin("10");
    balance.value -= 10;
    return setTimeout(takeChange, 300);
  } else if (+balance.value >=5) {
    createCoin("5");
    balance.value -= 5;
    return setTimeout(takeChange, 300);
  } else if (+balance.value >=2) {
    createCoin("2");
    balance.value -= 2;
    return setTimeout(takeChange, 300);
  } else if (+balance.value >=1) {
    createCoin("1");
    balance.value -= 1;
    return setTimeout(takeChange, 300);
  }
}

function createCoin(cost) { 
  let coinSrc = "";
  switch (cost) {
    case "10":
      coinSrc = "img/10rub.png";
      break;
    case "5":
      coinSrc = "img/5rub.png";
      break;
    case "2":
      coinSrc = "img/2rub.png";
      break;
    case "1":
      coinSrc = "img/1rub.png";
      break;
      default:
      console.error("Такой монеты не существует");
  }
  let changeBox = document.querySelector(".change-box");
  let changeBoxWidth = changeBox.getBoundingClientRect().width;
  let changeBoxHeight = changeBox.getBoundingClientRect().height;
  let coin = document.createElement("img");
  coin.setAttribute("src", coinSrc);
  coin.style.width = "50px";
  coin.style.cursor = "pointer";
  coin.style.position = "absolute";
  coin.style.top = Math.floor(Math.random() * (changeBoxHeight - 60)) + "px";
  coin.style.left = Math.floor(Math.random() * (changeBoxWidth - 60)) + "px";
  changeBox.append(coin); //Добавляет элемент в конец родительского
  //changeBox.prepend(coin); //Добавляет элемент в начало родительского
  // changeBox.before(coin); //Добавляет элемент после родительского
  // changeBox.after(coin); //Добавляет элемент до родительского
  // changeBox.replaceWith(coin); //Добавляет элемент вместо родительского
  coin.style.transition = "transform .5s, opacity .5s";
  coin.style.transform = "translateY(-20%)";
  coin.style.opacity = 0;
  setTimeout(() => {
    coin.style.transform = "translateY(0%)";
    coin.style.opacity = 1;
  }, 10);
  
  coin.onclick = () => {
    coin.style.transform = "translateY(-20%)";
    coin.style.poacity = 0;
    coin.ontransitionend = () => {
      coin.remove();
    };
  };
  
}

























