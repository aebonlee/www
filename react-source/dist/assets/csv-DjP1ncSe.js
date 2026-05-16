function b(e,o){if(!e.length)return;const n=Object.keys(e[0]),a=n.join(","),r=e.map(s=>n.map(d=>`"${String(s[d]??"").replace(/"/g,'""')}"`).join(",")).join(`
`),l=new Blob(["\uFEFF"+a+`
`+r],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(l),t=document.createElement("a");t.href=c,t.download=o,t.click(),URL.revokeObjectURL(c)}export{b as d};
