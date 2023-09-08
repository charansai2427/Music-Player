var userinp = document.getElementsByClassName("input");
var songlist = document.querySelector(".list");
var audiotag = document.querySelector(".audio");
var currentImg = document.querySelector(".currentImg");
console.log(audiotag);

function mainfunction(event) {
    userinp[0].value = event.target.value;
  console.log(userinp[0].value);
  data();
}
function data(){
  songlist.innerHTML = "";
  console.log(userinp[0].value);
  fetch(`https://saavn.me/search/songs?query=${userinp[0].value}`)
    .then(res => (res.json()))
    .then(res => {
      console.log(res);
      const data=res.data.results;
      renderHtml(data);
    });
}
const renderHtml=(arg) =>{
    let tempHtml="";
     arg.map((finalresult) => {
        tempHtml += `
         <img style="width:6rem; height:7rem ;row-gap:1rem;" src="${finalresult.image[2].link}" name="${finalresult.name}" class="songimageinjs" alt="${finalresult.downloadUrl[4].link}" data-id="${finalresult.id}"/> `;
        });
        songlist.innerHTML=tempHtml;
        var a = document.querySelectorAll(".songimageinjs");
        a.forEach((c) => {
          c.addEventListener("click", (event)=> {
            console.log(event);
            audiotag.setAttribute("src", event.target.alt);
            audiotag.setAttribute("data-id",event.target.dataset.id);
            audiotag.load();
            audiotag.play();
            currentImg.src=event.target.currentSrc;
          });
        });
    }
var prevsong=document.getElementById("prevsong");
var nextsong=document.getElementById("nextsong");
var playpause=document.getElementById("play/pause");
playpause.addEventListener("click",(e)=>{
    if(audiotag.paused){
        audiotag.play();
        playpause.innerHTML=`<ion-icon name="pause-outline"></ion-icon>`;
    }else{
        audiotag.pause();
        playpause.innerHTML=`<ion-icon name="play-circle"></ion-icon>`;
    }
});

prevsong.addEventListener("click",(e)=>{
    var songsImg = document.querySelectorAll(".songimageinjs");
    const songsUrl =[];
    for(const iterator of songsImg){
        songsUrl.push({
            id: iterator.dataset.id,
            url:iterator.getAttribute("alt"),
            img:iterator.getAttribute("src")
        });
    }
    const currentSong = audiotag.getAttribute("src");
    let currIndex=0;
    console.log(currentSong);
    songsUrl.forEach((e,index)=>{
        if(e.url ===currentSong)currIndex=index;
    })
    let prevIndex = currIndex -1;
    if(prevIndex <0){
        prevIndex = songsUrl.length -1;
    }
    console.log(prevIndex);
    audiotag.setAttribute("src",songsUrl[prevIndex].url);
    audiotag.setAttribute("data-id",songsUrl[prevIndex].id);
    currentImg.src=songsUrl[prevIndex].img;
    audiotag.load();
    audiotag.play();
    });

nextsong.addEventListener("click",(e)=>{
    var songsImg = document.querySelectorAll(".songimageinjs");
    const songsUrl=[];
    for(const iterator of songsImg){
        songsUrl.push({
            id: iterator.dataset.id,
            url:iterator.getAttribute("alt"),
            img:iterator.getAttribute("src")
        });
    }
    const currentSong = audiotag.getAttribute("src");
    let currIndex=0;
    songsUrl.forEach((e,index)=>{
        if(e.url === currentSong) currIndex=index;
    })
    console.log(songsUrl);
    let nextIndex = currIndex +1;
    if(nextIndex > songsUrl.length-1){
        nextIndex = 0;
    } 
    audiotag.setAttribute("src",songsUrl[nextIndex].url);
    audiotag.setAttribute("data-id",songsUrl[nextIndex].id);
    currentImg.src=songsUrl[nextIndex].img;
    audiotag.load();
    audiotag.play();
});

var pgbar=document.getElementById("pgbar");
audiotag.addEventListener("timeupdate",(e)=>{
    let currtime=audiotag.currentTime;
    let duration=audiotag.duration;
    let percentage=(currtime/duration)*100;
    pgbar.style.width=percentage+"%";
});

var addtoplaylist=document.getElementById("addtoplaylist");
addtoplaylist.addEventListener("click",()=>{
 let playlist=localStorage.getItem("playlist");
    let newPlaylist;
    if(!audiotag.dataset.id) return;
    if(playlist){

        newPlaylist=JSON.parse(playlist);
        if(!newPlaylist.find((e) => e === audiotag.dataset.id))
        newPlaylist.push(audiotag.dataset.id)
        }
        else{
            newPlaylist=[audiotag.dataset.id];
            }
localStorage.setItem("playlist",JSON.stringify(newPlaylist));
})

var myMusic=document.getElementById("myMusic");
myMusic.addEventListener("click",async ()=>{
    let playlist=localStorage.getItem("playlist");
    if(playlist){
        playlist=JSON.parse(playlist);
    }
    else{
        return;
    }
    var playlistPromiseArr=playlist.map(async e =>
        {
            try
            {
                const res=await fetch("https://saavn.me/songs?id="+e);
                const data=await res.json();
                return data;
            }
            catch(error){
                console.log(error);
            }
        })
        let playlistData=await Promise.allSettled(playlistPromiseArr);
        playlistData=playlistData.map(e => e.value.data[0]);
        console.log(playlistData);
        renderHtml(playlistData);
    })
