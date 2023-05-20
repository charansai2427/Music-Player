var userinp=document.getElementsByClassName("input");
var songlist=document.querySelector(".songlist");
var audiotag=document.querySelector(".audio");
var currentsongimg=document.querySelector(".currentsongimg");

function mainfunction(event)
{
    userinp[0].value=event.target.value;
    console.log(userinp[0].value);
    data(); 
}

function data()
{
    songlist.innerHTML="";
    console.log(userinp[0].value);
    fetch(`https://saavn.me/search/songs?query=${userinp[0].value}`).then(res =>(res.json())).then(res =>
    {
        res.data.results.map((finalresult)=>
        {
            songlist.innerHTML+=`
            <img style="width:8rem;row-gap:5rem;" src="${finalresult.image[2].link}" name="${finalresult.name}" class="songimageinjs" alt="${finalresult.downloadUrl[4].link}" /> `;
            var a=document.querySelectorAll(".songimageinjs");
            a.forEach((c)=>
            {
                c.addEventListener("click",(event)=>
                {
                    console.log(event);
                    audiotag.setAttribute("src",event.target.alt);
                    currentsongimg.src=event.target.currentSrc;
                })
            })
        })
    })
}