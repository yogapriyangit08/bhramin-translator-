const VOWELS = {
  aa:["ஆ","ா"], ai:["ஐ","ை"], au:["ஔ","ௌ"], ou:["ஔ","ௌ"], A:["ஆ","ா"],
  ii:["ஈ","ீ"], ee:["ஈ","ீ"], I:["ஈ","ீ"], uu:["ஊ","ூ"], oo:["ஊ","ூ"], U:["ஊ","ூ"],
  ae:["ஏ","ே"], ea:["ஏ","ே"], E:["ஏ","ே"], oa:["ஓ","ோ"], O:["ஓ","ோ"],
  a:["அ",""], i:["இ","ி"], u:["உ","ு"], e:["எ","ெ"], o:["ஒ","ொ"]
};

const CONSONANTS = {
  ng:"ங", nj:"ஞ", gn:"ஞ", th:"த", dh:"த", kh:"க", gh:"க",
  ph:"ப", bh:"ப", ch:"ச", sh:"ச", zh:"ழ", k:"க", g:"க",
  s:"ச", c:"ச", j:"ஜ", f:"ப", h:"ஹ", q:"க", x:"க", z:"ழ",
  t:"ட", d:"ட", N:"ண", n:"ந", p:"ப", b:"ப", m:"ம", y:"ய", r:"ர",
  l:"ல", v:"வ", w:"வ", L:"ள", R:"ற"
};

const LATIN_FALLBACK = {
  a:"அ", b:"ப", c:"ச", d:"ட", e:"எ", f:"ப", g:"க", h:"ஹ", i:"இ", j:"ஜ", k:"க", l:"ல",
  m:"ம", n:"ந", o:"ஒ", p:"ப", q:"க", r:"ர", s:"ச", t:"ட", u:"உ", v:"வ", w:"வ", x:"க", y:"ய", z:"ழ"
};

const VOWEL_KEYS = Object.keys(VOWELS).sort((a,b) => b.length-a.length);
const CONS_KEYS = Object.keys(CONSONANTS).sort((a,b) => b.length-a.length);

function englishToTamil(text) {
  let result=""; let i=0;
  while(i<text.length){
    let matchedCons=CONS_KEYS.find(k=>text.startsWith(k,i));
    if(!matchedCons){const slice=text.slice(i,i+2).toLowerCase();if(CONSONANTS[slice])matchedCons=text.slice(i,i+2)}
    if(matchedCons){
      let tamilCons=CONSONANTS[matchedCons]||CONSONANTS[matchedCons.toLowerCase()];
      i+=matchedCons.length;
      let matchedVowel=VOWEL_KEYS.find(k=>text.startsWith(k,i));
      if(!matchedVowel){const v2=text.slice(i,i+2).toLowerCase();const v1=text[i]?.toLowerCase()||"";if(VOWELS[v2])matchedVowel=text.slice(i,i+2);else if(VOWELS[v1])matchedVowel=text[i]}
      if(matchedVowel){const vowelSign=(VOWELS[matchedVowel]||VOWELS[matchedVowel.toLowerCase()])[1];result+=tamilCons+vowelSign;i+=matchedVowel.length}else result+=tamilCons+"்";
      continue;
    }
    let matchedVowel=VOWEL_KEYS.find(k=>text.startsWith(k,i));
    if(!matchedVowel){const v2=text.slice(i,i+2).toLowerCase();const v1=text[i]?.toLowerCase()||"";if(VOWELS[v2])matchedVowel=text.slice(i,i+2);else if(VOWELS[v1])matchedVowel=text[i]}
    if(matchedVowel){const independent=(VOWELS[matchedVowel]||VOWELS[matchedVowel.toLowerCase()])[0];result+=independent;i+=matchedVowel.length;continue}
    result+=LATIN_FALLBACK[text[i].toLowerCase()]||text[i];i++;
  }
  return result;
}

const TAMIL_TO_BRAHMI={"அ":"𑀅","ஆ":"𑀆","இ":"𑀇","ஈ":"𑀈","உ":"𑀉","ஊ":"𑀊","எ":"𑀏","ஏ":"𑀏","ஐ":"𑀐","ஒ":"𑀑","ஓ":"𑀑","ஔ":"𑀒","க":"𑀓","ங":"𑀗","ச":"𑀘","ஞ":"𑀜","ட":"𑀝","ண":"𑀡","த":"𑀢","ந":"𑀦","ப":"𑀧","ம":"𑀫","ய":"𑀬","ர":"𑀭","ல":"𑀮","வ":"𑀯","ழ":"𑀵","ள":"𑀴","ற":"𑀶","ன":"𑀷","ா":"𑀸","ி":"𑀺","ீ":"𑀻","ு":"𑀼","ூ":"𑀽","ெ":"𑁂","ே":"𑁂","ை":"𑁃","ொ":"𑁄","ோ":"𑁄","ௌ":"𑁅","்":"𑁆","ஃ":"𑀂","ஜ":"𑀚","ஷ":"𑀰","ஸ":"𑀲","ஹ":"𑀳","0":"𑁦","1":"𑁧","2":"𑁨","3":"𑁩","4":"𑁪","5":"𑁫","6":"𑁬","7":"𑁭","8":"𑁮","9":"𑁯"};

function hasTamil(text){return /[\u0B80-\u0BFF]/.test(text)}

function transliterateToBrahmi(){
  const input=document.getElementById("modernInput").value;
  const modernTamil=hasTamil(input)?input:englishToTamil(input);
  document.getElementById("tamilOutput").textContent=modernTamil;
  document.getElementById("brahmiOutput").textContent=Array.from(modernTamil).map(ch=>TAMIL_TO_BRAHMI[ch]||ch).join("");
}

function setExample(value){const input=document.getElementById("modernInput");input.value=value;transliterateToBrahmi();input.focus()}

function clearTranslator(){const input=document.getElementById("modernInput");input.value="";transliterateToBrahmi();input.focus()}

async function copyBrahmi(){
  const text=document.getElementById("brahmiOutput").textContent;
  try{await navigator.clipboard.writeText(text);const button=document.querySelector(".action-button:not(.secondary)");const original=button.textContent;button.textContent="Copied!";setTimeout(()=>button.textContent=original,1200)}
  catch(error){const range=document.createRange();range.selectNodeContents(document.getElementById("brahmiOutput"));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}
}

transliterateToBrahmi();
