let lang = "id";

const text = {
  id:{
    system:"SYSTEM ONLINE",
    badge:"KONEKSI TERENKRIPSI",
    target:"TARGET EKSTRAKSI",
    extract:"⚡ EKSTRAK MEDIA",
    guideBadge:"PANDUAN SISTEM",
    guideTitle:"CARA DOWNLOAD",
    guide:[
      "Salin link video.",
      "Tempel di kolom input.",
      "Klik EKSTRAK MEDIA.",
      "Tunggu proses selesai.",
      "Download video tanpa watermark."
    ],
    processing:"Memproses...",
    fail:"Gagal memproses link.",
    empty:"Masukkan link dulu."
  },
  en:{
    system:"SYSTEM ONLINE",
    badge:"ENCRYPTED CONNECTION",
    target:"EXTRACTION TARGET",
    extract:"⚡ EXTRACT MEDIA",
    guideBadge:"SYSTEM GUIDE",
    guideTitle:"HOW TO DOWNLOAD",
    guide:[
      "Copy the video link.",
      "Paste it into the input field.",
      "Click EXTRACT MEDIA.",
      "Wait until processing finishes.",
      "Download the video."
    ],
    processing:"Processing...",
    fail:"Failed to process link.",
    empty:"Insert a link first."
  }
};

function setLang(l){
  lang=l;
  document.getElementById("idBtn").classList.remove("active");
  document.getElementById("enBtn").classList.remove("active");
  document.getElementById(l+"Btn").classList.add("active");

  document.getElementById("systemText").innerText=text[l].system;
  document.getElementById("badgeText").innerText=text[l].badge;
  document.getElementById("targetText").innerText=text[l].target;
  document.getElementById("extractBtn").innerText=text[l].extract;
  document.getElementById("guideBadge").innerText=text[l].guideBadge;
  document.getElementById("guideTitle").innerText=text[l].guideTitle;

  const list=document.getElementById("guideList");
  list.innerHTML="";
  text[l].guide.forEach(step=>{
    const li=document.createElement("li");
    li.innerText=step;
    list.appendChild(li);
  });
}

function showHome(){
  document.getElementById("homePanel").classList.remove("hidden");
  document.getElementById("guidePanel").classList.add("hidden");
}

function showGuide(){
  document.getElementById("guidePanel").classList.remove("hidden");
  document.getElementById("homePanel").classList.add("hidden");
}

async function download(){
  const url=document.getElementById("url").value;
  const result=document.getElementById("result");

  if(!url){
    result.innerHTML=text[lang].empty;
    return;
  }

  result.innerHTML=text[lang].processing;

  try{
    const res=await fetch(`/api/download?url=${encodeURIComponent(url)}`);
    const data=await res.json();

    if(data.status){
      result.innerHTML=`
        <p><b>${data.title}</b></p>
        <video controls src="${data.video}"></video>
        <br><a href="${data.video}" download>Download</a>
      `;
    }else{
      result.innerHTML=text[lang].fail;
    }
  }catch{
    result.innerHTML="Server error.";
  }
}

setLang("id");