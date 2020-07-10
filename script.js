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
    console.log( bill.getAttribute("data-cost") );
    console.log( bill.dataset.cost );
    balance.value = +balance.value + +bill.dataset.cost;
    bill.remove(); //Удаляем элемент
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



























