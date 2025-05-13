"use strict";
//部屋の基本price
const price = [29000, 32000, 19000, 16000];
const dailyprice = [
  [2480, 3480, 4480],
  [3500, 4500, 6000],
];
//部屋とプランのindex

let roomselected;
let planselected;
let detailedplanselected;
let priceoff;
let weekendCount = 0;
let needroom = true;
let day;
let numofp;
//必要なものとってくる
const rooms = [...document.querySelectorAll("#rooms div")];
const plans = [...document.querySelectorAll("#plans div")];
const plandetail = [...document.querySelectorAll(".favorselect")];
document.getElementById("checkin").addEventListener("change", updateStayDays);
document.getElementById("checkout").addEventListener("change", updateStayDays);
function updateStayDays() {
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  if (!checkin || !checkout) return;

  const inDate = new Date(checkin);
  const outDate = new Date(checkout);

  const diffTime = outDate.getTime() - inDate.getTime();
  day = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 日数

  console.log("宿泊日数:", day);

  if (day < 0) {
    document.getElementById("checkout").value = ""; // 終了日クリア
    alert("終了日は開始日より後にしてください");
    return;
  }

  const tempDate = new Date(inDate);
  for (let i = 0; i < day; i++) {
    const dayOfWeek = tempDate.getDay(); // 0 = 日曜, 6 = 土曜
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendCount++;
    }
    tempDate.setDate(tempDate.getDate() + 1); // 次の日に進む
  }

  console.log("週末の宿泊日数:", weekendCount);
  if (plans) {
    plans[0].style.display = day === 0 ? "none" : "block";
    plans[1].style.display = day === 0 ? "none" : "block";
  }
  cal();
}
function updateNumofPeople() {
  const adult = Number(document.getElementById("adult").value);
  const child11 = Number(document.getElementById("child11").value);
  const child6 = Number(document.getElementById("child6").value);
  const child3 = Number(document.getElementById("child3").value);
  console.log(adult, child11, child6, child3);
  numofp = adult + child11 * 0.7 + child6 * 0.5;
  console.log("人数" + numofp);
  if (child3 > adult) {
    document.getElementById("checkout").value = "";
    alert("大人より子どもが多くて大丈夫ですか？");
  }
  cal();
}
//結果の変数
let result = 0;
//計算の関数
const cal = () => {
  document.getElementById("result").innerHTML = "";
  console.log("cal関数いくぜ");
  if (planselected || planselected === 0) {
    console.log("計算に行きます！");
    console.log("今のplanは" + planselected);
    switch (planselected) {
      case 0:
        console.log(detailedplanselected);
        priceoff = detailedplanselected == 1 ? 0.9 : 1;
        console.log("faaf" + priceoff);
        result = day * numofp * price[roomselected] * priceoff;
        console.log(result);
        break;
      case 1:
        if (detailedplanselected == 0) {
          result = day * numofp * (price[roomselected] - 2400);
        } else {
          if (numofp > 1 && numofp <= 2) {
            result = day * (price[roomselected] - 2400);
          } else {
            result = day * numofp * (price[roomselected] - 3000);
          }
        }

        console.log(result);
        break;
      case 2:
        result =
          numofp *
          (dailyprice[0][detailedplanselected] +
            (weekendCount === 1 ? 500 : 0));
        console.log(result);
        break;
      case 3:
        result =
          detailedplanselected == 1
            ? numofp * dailyprice[1][roomselected] * 1.25
            : numofp * dailyprice[1][roomselected] * 1;
        console.log(result);
        break;
      default:
        alert("error");
    }

    if (result || result === 0) {
      document.getElementById("result").innerHTML = `今の料金は${Math.floor(
        result
      )}円`;
    }
  }
};
const planreset = () => {
  plandetail.forEach((l) => (l.style.display = "none"));
  planselected = null;
  detailedplanselected = null;
  cal();
};
const planselector = (x) => {
  planreset();
  planselected = x;
  plandetail[x].style.display = "block";
  const roomsContainer = document.querySelector(".rooms");
  if (roomsContainer) {
    roomsContainer.style.display = x === 2 ? "none" : "block";
  }
  if (rooms[3]) {
    rooms[3].style.display = x === 3 ? "none" : "block";
  }
  cal();
};
const detailedplan = () => {
  detailedplanselected = document.querySelector(
    'input[name="planselector"]:checked'
  ).value;
  cal();
};
//ルームひとつだけ選べる

rooms.forEach((room, index) => {
  room.addEventListener("click", () => {
    // すべてのlabelからactiveクラスを外す
    rooms.forEach((l) => l.classList.remove("active"));

    // 選ばれたラベルにactive追加
    room.classList.add("active");
    roomselected = index;
    console.log(roomselected);
    cal();
  });
});
//planひとつだけ選べる

plans.forEach((plan, index) => {
  plan.addEventListener("click", () => {
    // すべてのlabelからactiveクラスを外す
    plans.forEach((l) => l.classList.remove("active"));

    // 選ばれたラベルにactive追加
    plan.classList.add("active");
    planselector(index);
  });
});

//初期化
planreset();
updateNumofPeople();
cal();
