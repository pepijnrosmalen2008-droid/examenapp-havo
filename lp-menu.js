/* Landingspagina's: thema en niveau van de app overnemen, terugknop. */
(function(){try{var d=document.documentElement,t=localStorage.getItem('theme');
if(t==='dark')d.classList.add('dark');else if(t==='light')d.classList.add('light');
if(!d.getAttribute('data-niveau')){var n=localStorage.getItem('examenapp_level');if(n==='vwo'||n==='vmbo')d.setAttribute('data-niveau',n);}}catch(e){}})();
function lpTerug(){try{if(document.referrer&&document.referrer.indexOf(location.host)>-1&&history.length>1){history.back();return;}}catch(e){}location.href='/';}
