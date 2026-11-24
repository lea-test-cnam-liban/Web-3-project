const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const post=(url,data)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(r=>r.json().then(j=>({ok:r.ok,...j})));

if($('#authForm')){
  let mode='login';
  $$('.tabs button').forEach(b=>b.onclick=()=>{
    mode=b.dataset.mode;
    $$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
    $('#nameBox').classList.toggle('hide',mode==='login');
    $('#authBtn').textContent=mode==='login'?'Log in':'Create account';
    $('#msg').textContent='';
  });
  $('#authForm').onsubmit=async e=>{
    e.preventDefault();
    const d={email:$('#email').value,password:$('#password').value};
    if(mode==='register')d.full_name=$('#full_name').value;
    try{
      const r=await post(`../api/${mode}.php`,d);
      if(r.ok)location.href='dashboard.html'; else $('#msg').textContent=r.error||'Something went wrong.';
    }catch{$('#msg').textContent='Cannot reach the server. Is Apache/MySQL running?'}
  };
}