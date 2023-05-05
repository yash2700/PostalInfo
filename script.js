var ipAddr = "";
var ipTag = document.querySelector("h3");
var token="daac54fe5de3a6";
var ipData="";
var map=document.getElementById("map");
var lat="";
var lon="";
var postalData=""

var postalElement=document.querySelector(".postal-data");

async function getIp() {
  ipAddr = await fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data =>data.ip);
}

getIp()
  .then(() => {
    ipTag.innerText += ipAddr;
})

async function getData(){
    ipData=await fetch(`https://ipinfo.io/${ipAddr}?token=${token}`).then((response)=>response.json()).then((data)=>ipData=data);
    lat=ipData.loc.split(",")[0];
    lon=ipData.loc.split(",")[1];
    console.log(lat,lon);
}

function getCurrentTime(timeZone){
    var now = new Date();

  // Create options object with specified time zone
  var options = {
    timeZone: timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  // Format the date and time according to the options
  const formatter = new Intl.DateTimeFormat([], options);
  var dateAndTime = formatter.format(now);

  // Return the formatted date and time
  return dateAndTime;
}

async function getPostalData(pin){
 return  await fetch(`https://api.postalpincode.in/pincode/${pin}`).then((response)=>response.json());
}

document.getElementById("getData").addEventListener("click", (e) => {
  var button = e.target;
  button.style.display = "none";
  document.querySelector(".second").style.display="block"
  getData().then(()=>{console.log(ipData);
    document.getElementById("lat").innerHTML+=lat;
    document.getElementById("long").innerHTML+=lon;
    document.getElementById("city").innerHTML+=ipData.city;
    document.getElementById("org").innerHTML+=ipData.org;
    document.getElementById("region").innerHTML+=ipData.region;
    document.getElementById("host").innerHTML+=ipData.hostname;
    document.getElementById("time").innerHTML+=ipData.timezone;
    document.getElementById("pin").innerHTML+=ipData.postal;
    document.getElementById("date").innerHTML+=getCurrentTime(ipData.timezone);

    getPostalData(ipData.postal).then((data)=>{
        postalData=data[0];
        document.getElementById("message").innerHTML+=postalData.Message;
        console.log(postalData);
        renderItems(postalData.PostOffice)
    })

    map.src=`https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;


});
  
});

function renderItems(data){
    var innerHtml="";
    postalElement.innerHTML=""
    data.forEach((i)=>{
       innerHtml+=`<div class="item">
        <p>Name : ${i.Name}</p>
        <p>Branch Type : ${i.BranchType}</p>
        <p>Delivery Status : ${i.DeliveryStatus}</p>
        <p>District : ${i.District}</p>
        <p>Division : ${i.Division}</p>
    </div>`
    })

    postalElement.innerHTML+=innerHtml
}

document.getElementById("search").addEventListener("input",(e)=>{
    var input=e.target.value.trim();
    renderItems(postalData.PostOffice.filter((i)=>i.Name.toLowerCase().includes(input) || i.BranchType.toLowerCase().includes(input)))

})


