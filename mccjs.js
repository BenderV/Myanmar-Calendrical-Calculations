"use strict";

//Author: YAN NAING AYE 
//WebSite: http://mmcal.blogspot.com
//License: Myanmar Calendrical Calculations by Yan Naing Aye is licensed
//         under a Creative Commons Attribution 3.0 Unported License.
//         http://creativecommons.org/licenses/by/3.0/
//  You are free:
//    to Share — to copy, distribute and transmit the work
//    to Remix — to adapt the work
//    to make commercial use of the work
//  Under the following conditions:
//    Attribution — You must attribute Myanmar Calendrical Calculations
//		to Yan Naing Aye (with link).
//-------------------------------------------------------------------------
//Version: 201503181500
//-------------------------------------------------------------------------
//Start of kernel ############################################################
//----------------------------------------------------------------------------

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function ($, _) {
    //    methods

    //Definition of constants
    var SY=365.2587565; //solar year
    var LM=29.53058795; //lunar month
    var MO=1954168.0506; //beginning of 0 ME
    var SE2=1217; //start of second era
    var SE3=1312; //start of third era
    var SG=2361222;//Gregorian start in English calendar (1752/Sep/14)
    var BGNTG=1100;//start of Thingyan
    //-------------------------------------------------------------------------
    //Julian date to Gregorian date
    //Credit to: http://pmyers.pcug.org.au/General/JulianDates.htm
    //input: (jd=julian date)
    //output: Gregorian date where,
    //(y=year, m=month, d=day, h=hour, n=minute, s=second)
    function j2g(jd) {
     var j,jf,y,d,m,h,n,s;
     j=Math.floor(jd+0.5); jf=jd+0.5-j; j-=1721119;
     y=Math.floor((4*j-1)/146097); j=4*j-1-146097*y; d=Math.floor(j/4);
     j=Math.floor((4*d+3)/1461); d=4*d+3-1461*j;
     d=Math.floor((d+4)/4); m=Math.floor((5*d-3)/153); d=5*d-3-153*m;
     d=Math.floor((d+5)/5); y=100*y+j;
     if(m<10) {m+=3;}
     else {m-=9; y=y+1;}		
     jf*=24; h=Math.floor(jf); jf=(jf-h)*60; n=Math.floor(jf); s=(jf-n)*60;
     return {y:y,m:m,d:d,h:h,n:n,s:s};
    }
    //-------------------------------------------------------------------------
    //Julian date to Julian Calendar
    //Credit to: http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
    //input: (jd=julian date)
    //output: Julian calendar where,
    //(y=year, m=month, d=day, h=hour, n=minute, s=second)
    function j2jc(jd) {
    	var z,jf,b,c,f,e,d,y,m,h,n,s;
    	z=Math.floor(jd+0.5); jf=jd+0.5-z;
    	b=z+1524; c=Math.floor((b-122.1)/365.25); f=Math.floor(365.25*c);
    	e=Math.floor((b-f)/30.6001); m=(e>13)?(e-13):(e-1);
    	d=b-f-Math.floor(30.6001*e); y=m<3?(c-4715):(c-4716);
    	jf*=24; h=Math.floor(jf); jf=(jf-h)*60; n=Math.floor(jf); s=(jf-n)*60;
    	return {y:y,m:m,d:d,h:h,n:n,s:s};
    }
    //-------------------------------------------------------------------------
    //Julian date to English Calendar
    //input: (jd=julian date)
    //output: English calendar where,
    //(y=year, m=month, d=day, h=hour, n=minute, s=second)
    function j2e(jd) {
    	var E;
    	if(jd>=SG) E=j2g(jd);
    	else E=j2jc(jd);
    	return E;
    }
    //-------------------------------------------------------------------------
    //Gregorian date to Julian day number
    //Credit to: http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
    //input: (gy: year, gm: month, gd: day)
    //output: Julian day number
    function g2j(gy,gm,gd) {
    	var a,y,m;
    	a=Math.floor((14-gm)/12); y=gy+4800-a; m=gm+(12*a)-3;
    	return (gd+Math.floor((153*m+2)/5)+(365*y)+Math.floor(y/4)
    		-Math.floor(y/100)+Math.floor(y/400)-32045);
    }
    //-------------------------------------------------------------------------
    //Julian calendar date to Julian day number
    //input: (jcy: year, jcm: month, jcd: day)
    //output: Julian day number
    function jc2j(jcy,jcm,jcd) {
    		var a,y,m;
    		a=Math.floor((14-jcm)/12); y=jcy+4800-a; m=jcm+(12*a)-3;
    		return (jcd+Math.floor((153*m+2)/5)+(365*y)+Math.floor(y/4)-32083);
    }
    //-------------------------------------------------------------------------
    //English calendar date to Julian day number
    //input: (ecy: year, ecm: month, ecd: day)
    //output: (jd: Julian day number,
    //gsf: gregorian skip, 1=true, 0=false)
    function e2j(ecy,ecm,ecd) {
    	var jd,gsf;
    	gsf=0; jd=g2j(ecy,ecm,ecd); //Gregorian date to julian date
    	if(jd<SG) { if(jd>(SG-12)){gsf=1; ecd=2;} jd=jc2j(ecy,ecm,ecd);}
    	return {jd:jd,gsf:gsf};
    }
    //-------------------------------------------------------------------------
    //Julian date to Myanmar date
    //input: (jd -julian date)
    //output:  (my : year,
    //myt :year type, 0=regular, 1=little watat, 2=big watat,
    //watat : 1=watat, 0=regular,
    //bw : big watat, 1=true, 0=false,
    //myl: year length,
    //mm: month,
    //mmt: month type, 1=hnaung, 0= Oo,
    //mml: month length,
    //md: month day = 1 to 30,
    //d: day =1 to 15,
    //ms :moon status, 0: waxing, 1: full moon, 2: waning, 3: new moon,
    //wd: week day, 0=sat, 1=sun, ..., 6=fri)
    function j2m(jd) {
    	var jdn,my,yo,dd,myl,mmt,t,s,c,mm,md,mml,ms,d,wd;
    	jdn=Math.round(jd);//convert jd to jdn
    	my=Math.floor((jdn-0.5-MO)/SY);//Myanmar year
    	yo=chk_my(my);//check year
    	dd=jdn-yo.tg1+1;//day count
    	myl=354+yo.watat*30+yo.bw;//year length
    	mmt=Math.floor((dd-1)/myl);//month type: Hnaung =1 or Oo = 0
    	dd-=mmt*myl;//adjust day count
    	t=Math.floor(myl/(dd+266));
    	s=29.5+t*yo.bw/5; c=117+t*yo.bw*14/5;//get rate and offset
    	dd+=t*266-(1-t)*(myl-266);//modify day count
    	mm=Math.floor((dd+c)/s);//month
    	md=dd-Math.floor(s*mm-c-0.1);//day
    	mm=(mm%16); mm-=12*Math.floor(mm/13); //correct month number
    	mml=30-mm%2;//month length
    	if(mm==3) mml+=yo.bw;//adjust if Nayon in big watat
    	ms=Math.floor((md+1)/16)+Math.floor(md/16)+Math.floor(md/mml);
    	d=md-15*Math.floor(md/16);//waxing or waning day
    	wd=(jdn+2)%7;//week day
    	return {my:my,myt:yo.myt,watat:yo.watat,bw:yo.bw,myl:myl,
    	mm:mm,mmt:mmt,mml:mml,md:md,ms:ms,d:d,wd:wd};
    }
    //-------------------------------------------------------------------------
    //Check watat (intercalary month) for 2nd or 3rd era
    //input: (my -myanmar year)
    //output:  (watat : intercalary month, 1=watat, 0=regular,
    //ed : number of excess days,
    //fm : full moon day of 2nd Waso)
    function chk_watat(my) {
    	var ed,NM,TA,TW,watat=0,w2fm,yr,WO=0;
    	ed=(SY*(my+3739))%LM; // excess day
    	if(my<SE2){ if(my<0) yr=19+my%19; else yr=my%19; 
    		yr%=8; if (yr==2 || yr==5 || yr==7) watat=1;
    		NM=-1; TA=(SY/12-LM)*(12-NM); //threshold to adjust excess days
    		if(ed<TA) ed+=LM;//adjust excess days
    		WO-=my<1100?1.1:0.85; }
    	else{ NM=(my>=SE3)?8:4; TA=(SY/12-LM)*(12-NM); //threshold to adjust 
    		TW=LM-(SY/12-LM)*NM; //threshold for watat
    		if(ed<TA) ed+=LM;//adjust excess days
    		if(ed>=TW) watat=1; 
    		WO-=4/NM; }
    	switch(my){
    		case 205: case 246: //check exception and adjust the offset
    		case 1120: case 1150: case 1207: case 1234: case 1377: WO+=1; break;
    		case 813: case 854: case 1039: case 1126: case 1172: case 1261: WO-=1; break;
    	}  
    	switch(my){
    		case 1202: case 1264: case 1345: watat=0; break;
    		case 1201: case 1263: case 1344: watat=1; break;
    	} 
    	w2fm=Math.round(SY*my+MO-ed+4.5*LM+WO);
    	return {watat:watat,ed:ed,fm:w2fm};
    }
    //-------------------------------------------------------------------------
    //Check Myanmar Year 
    //input: (my -myanmar year)
    //output:  (myt :year type, 0=regular, 1=little watat, 2=big watat,
    //watat : 1=watat, 0=regular,
    //bw : big watat, 1=true, 0=false,
    //tg1 : the 1st day of Tagu)
    function chk_my(my) {
    	var yd=0,y1,y2,myt,bw=0,watat,nd,tg1;
    	y2=chk_watat(my); 
    	do{ yd++; y1=chk_watat(my-yd); }while(y1.watat==0);
    	watat=y2.watat;  myt=watat;  
    	if(watat) { nd=(y2.fm-y1.fm)%354; bw=Math.floor(nd/31); myt=bw+1;}
    	tg1=y1.fm+354*yd-102;	
    	return {myt:myt,watat:watat,bw:bw,tg1:tg1};
    }
    //-----------------------------------------------------------------------------
    //Convert a number to string in the selected language
    //input: (n=number, X: global variable that holds the language catalog)
    //output: (s: string)
    function n2s(n) { var r,s=""; n=Math.floor(n);   do{ r=n%10; n=Math.floor(n/10);  s=X[r.toString()]+s; }while(n>0);  return s; }
    //-------------------------------------------------------------------------
    //Gregorian date to Julian date
    //Credit to: http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
    //input: (gy=year, gm=month, gd=day, h=hour, n=minute, s=second)
    //output: (julian date)
    function g2jd(gy,gm,gd,h,n,s) {
     a=Math.floor((14-gm)/12); y=gy+4800-a; m=gm+(12*a)-3;
     jdn=gd+Math.floor((153*m+2)/5)+(365*y)+Math.floor(y/4)
      -Math.floor(y/100)+Math.floor(y/400)-32045;
     return (jdn+(h-12)/24+n/1440+s/86400);
     }
    //-------------------------------------------------------------------------
    //Myanmar date to Julian date
    //input:  (my : year,
    //mm: month,
    //mmt: month type, 1=hnaung, 0= Oo,
    //ms :moon status, 0: waxing, 1: full moon, 2: waning, 3: new moon,
    //d: day =1 to 15,)
    //output: (jd -julian date)
    function m2j(my,mm,mmt,ms,d) {
    	yo=chk_my(my);//check year
    	mml=30-mm%2;//month length
    	if (mm==3) mml+=yo.bw;//adjust if Nayon in big watat
    	m1=ms%2; m2=Math.floor(ms/2); md=m1*(15+m2*(mml-15))+(1-m1)*(d+15*m2);
    	mm+=4 *Math.floor((16-mm)/16)+12*Math.floor((15-mm)/12);
    	t=Math.floor(mm/13); s=29.5+t*yo.bw/5; c=117+t*yo.bw*14/5;
    	dd=md +Math.floor(s*mm-c-0.1);
    	myl=354+yo.watat*30+yo.bw;//year length
    	dd+=(1-t)*(myl-266)-266* t;
    	dd+=mmt*myl;//adjust day count
    	return dd+yo.tg1-1;
    }
    //-------------------------------------------------------------------------
    //Output date string from Julian Date
    //input: (jd=julian date)
    //output: (date string)
    function jd2date(jd,t) {
    	emName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    	var atatT=0; if (t==1) atatT=j2g(jd); else if(t==2) atatT=j2jc(jd);  else atatT=j2e(jd);
    	return atatT.y.toString()+"-"+emName[atatT.m-1]+"-"+("0"+atatT.d).slice(-2);
    }
    //-------------------------------------------------------------------------
    //Output date/time string from Julian Date according to calendar type
    //input: (jd=julian date,t=calendar type)
    //output: (date/time string)
    function jd2str(jd,t) {
    	emName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    	var atatT=0; if (t==1) atatT=j2g(jd); else if(t==2) atatT=j2jc(jd);  else atatT=j2e(jd);
    	return atatT.y.toString()+"-"+emName[atatT.m-1]+"-"
    		+("0"+atatT.d).slice(-2)+" "+("0"+atatT.h).slice(-2)+":"
    		+("0"+atatT.n).slice(-2)+":"+("0"+Math.round(atatT.s)).slice(-2);
    }
    //----------------------------------------------------------------------------
    //Checking Astrological days
    //input: (mm=month, mml= length of month,md= day of month [0-30], wd= weekday)
    //output: (sabbath, sabbatheve,yatyaza,pyathada,thamanyo,amyeittasote,
    //	warameittugyi,warameittunge,yatpote,thamaphyu,nagapor,yatyotema,
    //	mahayatkyan,shanyat,nagahle [0: west, 1: north, 2: east, 3: south])
    function astro(mm,mml,md,wd) {
    	var d,sabbath,sabbatheve,yatyaza,pyathada,thamanyo,amyeittasote;
    	var warameittugyi,warameittunge,yatpote,thamaphyu,nagapor,yatyotema;
    	var mahayatkyan,shanyat,nagahle,m1,wd1,wd2,wda,sya;
    	if (mm<=0) mm=4;//first waso is considered waso
    	d=md-15*Math.floor(md/16);//waxing or waning day [0-15]
    	sabbath=0; if((md==8)||(md==15)||(md==23)||(md==mml)) sabbath=1;
    	sabbatheve=0;if((md==7)||(md==14)||(md==22)||(md==(mml-1))) sabbatheve=1;
    	yatyaza=0; m1=mm%4; wd1=Math.floor(m1/2)+4;
    	wd2=((1-Math.floor(m1/2))+m1%2)*(1+2*(m1%2)); 
    	if((wd==wd1)||(wd==wd2)) yatyaza=1;
    	pyathada=0; wda=[1,3,3,0,2,1,2]; if(m1==wda[wd]) pyathada=1;
    	if((m1==0)&&(wd==4)) pyathada=2;//afternoon pyathada
    	thamanyo=0; m1=mm-1-Math.floor(mm/9); wd1=(m1*2-Math.floor(m1/8))%7;
    	wd2=(wd+7-wd1)%7; if(wd2<=1) thamanyo=1;
    	amyeittasote=0; wda=[5,8,3,7,2,4,1]; if(d==wda[wd]) amyeittasote=1;
    	warameittugyi=0; wda=[7,1,4,8,9,6,3]; if(d==wda[wd]) warameittugyi=1;
    	warameittunge=0; wn=(wd+6)%7; if((12-d)==wn) warameittunge=1;
    	yatpote=0; wda=[8,1,4,6,9,8,7]; if(d==wda[wd]) yatpote=1; 
    	thamaphyu=0; wda=[1,2,6,6,5,6,7];  if(d==wda[wd]) thamaphyu=1;
    	wda=[0,1,0,0,0,3,3]; if(d==wda[wd]) thamaphyu=1;
    	if((d==4) && (wd==5)) thamaphyu=1;
    	nagapor=0; wda=[26,21,2,10,18,2,21];  if(md==wda[wd]) nagapor=1;
    	wda=[17,19,1,0,9,0,0]; if(md==wda[wd]) nagapor=1;
    	if(((md==2) && (wd==1)) ||(((md==12)||(md==4)||(md==18)) && (wd==2)))nagapor=1;
    	yatyotema=0; m1=(mm%2)?mm:((mm+9)%12); m1=(m1+4)%12+1; if(d==m1) yatyotema=1;
    	mahayatkyan=0; m1=(Math.floor((mm%12)/2)+4)%6+1; if(d==m1) mahayatkyan=1;
    	shanyat=0; sya=[8,8,2,2,9,3,3,5,1,4,7,4]; if(d==sya[mm-1]) shanyat=1;
    	nagahle=Math.floor((mm%12)/3);
    	
    	return {sabbath:sabbath,sabbatheve:sabbatheve,yatyaza:yatyaza,
    	pyathada:pyathada,thamanyo:thamanyo,amyeittasote:amyeittasote,
    	warameittugyi:warameittugyi,warameittunge:warameittunge,
    	yatpote:yatpote,thamaphyu:thamaphyu,nagapor:nagapor,
    	yatyotema:yatyotema,mahayatkyan:mahayatkyan,	shanyat:shanyat,
    	nagahle:nagahle};
    }
    //----------------------------------------------------------------------------
    //find the length of a month
    //input: (y=year, m=month [Jan=1, ... , Dec=12], t: calender type [0-English, 1-Gregorian, 2-Julian])
    //output: (l = length of the month)
    function emLen(y,m,t) {
    	var leap=0; var mLen=30+(m+Math.floor(m/8))%2;//get length of the current month
        if(m==2) { //if  february
    		if(t==1 || (t==0 && y>1752)) {if((y%4==0 && y%100!=0) || y%400==0) leap=1;}
    		else {if(y%4==0 ) leap=1;}
    		mLen+=leap-2; 
    	}
    	if (y==1752 && m==9) mLen=19;
    	return mLen;
    }
    //----------------------------------------------------------------------------
    //End of kernel ##############################################################
    //----------------------------------------------------------------------------
    //Start of checking holidays #################################################
    //----------------------------------------------------------------------------
    //input: (gy=year, gm=month [Jan=1, ... , Dec=12], gd: day [0-31])
    //output: (h=flag [true: 1, false: 0], hs=string)
    function ehol(gy,gm,gd) {
    	var h=0; var hs="";
    	if((gm==1) && (gd==1)) {h=1; hs="New Year Day";}
    	else if((gy>=1948) && (gm==1) && (gd==4)) {h=1; hs="Independence Day";}
    	else if((gy>=1947) && (gm==2) && (gd==12)) {h=1; hs="Union Day";}
    	else if((gy>=1958) && (gm==3) && (gd==2)) {h=1; hs="Peasants Day";}
    	else if((gy>=1945) && (gm==3) && (gd==27)) {h=1; hs="Resistance Day";}
    	else if((gy>=1923) && (gm==5) && (gd==1)) {h=1; hs="Labour Day";}
    	else if((gy>=1947) && (gm==7) && (gd==19)) {h=1; hs="Martyrs Day";}//Martyrs' Day 
    	else if((gm==12) && (gd==25)) {h=1; hs="Christmas Day";}
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //input: (my=year, mm=month [Tagu=1, ... , Tabaung=12], md: day [0-30],
    // ms: moon status)
    //output: (h=flag [true: 1, false: 0], hs=string)
    function mhol(my,mm,md,ms) {
    	var h=0; var hs="";
    	if((mm==2) && (ms==1)) {h=1; hs="Buddha Day";}//Vesak day
    	else if((mm==4)&& (ms==1)) {h=1; hs="Start of Buddhist Lent";}//Warso day
    	else if((mm==7) && (ms==1)) {h=1; hs="End of Buddhist Lent";}
    	else if((mm==8) && (ms==1)) {h=1; hs="Tazaungdaing";}
    	else if((my>=1282) && (mm==8) && (md==25)) {h=1; hs="National Day";}
    	else if((mm==10) && (md==1)) {h=1; hs="Karen New Year Day";}
    	else if((mm==12) && (ms==1)) {h=1; hs="Tabaung Pwe";}
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //input: (gy=year, gm=month [Jan=1, ... , Dec=12], gd: day [0-31])
    //output: (h=flag [true: 1, false: 0], hs=string)
    function ecd(gy,gm,gd) {
    	var h=0; var hs="";
    	if((gy>=1915) && (gm==2) && (gd==13)) {h=1; hs="G. Aung San BD";}
    	else if((gy>=1969) && (gm==2) && (gd==14)) {h=1; hs="Valentines Day";}
    	else if((gy>=1970) && (gm==4) && (gd==22)) {h=1; hs="Earth Day";}
    	else if((gy>=1392) && (gm==4) && (gd==1)) {h=1; hs="April Fools Day";}
    	else if((gy>=1948) && (gm==5) && (gd==8)) {h=1; hs="Red Cross Day";}
    	else if((gy>=1994) && (gm==10) && (gd==5)) {h=1; hs="World Teachers Day";}
    	else if((gy>=1947) && (gm==10) && (gd==24)) {h=1; hs="United Nations Day";}
    	else if((gm==10) && (gd==31)) {h=1; hs="Halloween";}
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //input: (my=year, mm=month [Tagu=1, ... , Tabaung=12], md: day [0-30],
    // ms: moon status, ln: language code)
    //output: (h=number of days, hs=array of string)
    function mcd(my,mm,md,ms) {
    	var h=0; var hs=["","",""];
    	if((my>=1309) && (mm==11) && (md==16)) {h=1; hs[0]="Mon National Day";}//celebrating the ancient founding of Hanthawady
    	else if((mm==9) && (md==1)) {h=1; hs[0]="Shan New Year Day"; if(my>=1306) {h=2; hs[1]="Authors Day";}}//Nadaw waxing moon 1
    	else if((mm==3) && (ms==1)) {h=1; hs[0]="Mahathamaya Day";}//Nayon full moon
    	else if((mm==6) && (ms==1)) {h=1; hs[0]="Garudhamma Day";}//Tawthalin full moon
    	else if((my>=1356) && (mm==10) && (ms==1)) {h=1; hs[0]="Mothers Day";}//Pyatho full moon
    	else if((my>=1370) && (mm==12) && (ms==1)) {h=1; hs[0]="Fathers Day";}//Tabaung full moon
    	else if((mm==5) && (ms==1)) {h=1; hs[0]="Metta Day";}//Waguang full moon, Conflict Mon Revolution day
    	else if((mm==5) && (md==10)) {h=1; hs[0]="Taungpyone Pwe";}//Taung Pyone Pwe
    	else if((mm==5) && (md==23)) {h=1; hs[0]="Yadanagu Pwe";}//Yadanagu Pwe
    	//if((my>=1119) && (mm==2) && (md==23)) {h=1; hs[0]="Mon Fallen Day";}//Mon Fallen day (ကဆုန် လဆုတ်-၈-ရက်)
    	//else if((my>=1324) && (mm==5) && (ms==1)) {h=2; hs[1]="Mon Revolution Day";}//Mon Revolution day (ဝါခေါင် လပြည့်)
    	//else if((mm==12) && (md==12)) {h=1; hs[0]="Mon Women Day";}//Mon Women's day (တပေါၚ်း လဆန်း ၁၂-ရက်)
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //input: (jdn, my: myanmar year, mmt: myanmar month type [oo: 0, hnaung: 1])
    //output: (h=flag [true: 1, false: 0], hs=string)
    function thingyan(jdn,my,mmt) {
    	var h=0; var hs=""; var atat, akn, atn;
    	ja=SY*(my+mmt)+MO;
    	if (my >= SE3) jk=ja-2.169918982;
    	else jk=ja-2.1675;
    	akn=Math.round(jk); atn=Math.round(ja);
    	if(jdn==(atn+1)) {h=1; hs="Myanmar New Year Day";}
    	if ((my+mmt)>=BGNTG) {
    	if(jdn==atn) {h=1; hs="Thingyan Atat";}
    	else if((jdn>akn)&&(jdn<atn)) {h=1; hs="Thingyan Akyat";}
    	else if(jdn==akn) {h=1; hs="Thingyan Akya";}
    	else if(jdn==(akn-1)) {h=1; hs="Thingyan Akyo";}
    	else if(((my+mmt)>=1362)&&((jdn==(akn-2))||((jdn>=(atn+2))&&(jdn<=(akn+7))))) {h=1; hs="Holiday";}
    	}
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //other holidays
    //input: (jd: Julian day number)
    //output: (h=flag [true: 1, false: 0], hs=string)
    var GMCal_DiwaliA=[2456599,2456953,2457337];
    var GMCal_EidA=[2456513,2456867,2457221];
    function ohol(jd) {
    	var h=0; var hs="";
    	if (GMCal_DiwaliA.indexOf(jd)>=0) {h=1; hs="Diwali";}
    	if (GMCal_EidA.indexOf(jd)>=0) {h=1; hs="Eid";}
    	return {h:h,hs:hs};
    }
    //----------------------------------------------------------------------------
    //End of checking holidays ###################################################
    //-----------------------------------------------------------------------------
    //Start of language catalog ##################################################
    //Version: 201503152245
    //Internationalization---------------------------------------------------------
    var X;//global variable
    function SetLang(lang)
    {
    	//----------------------------------------------------------------------------
    	if (lang==1) { //Catalog for  English Language
    	X={ 'January':'January', 'February':'February', 'March':'March',
    	'April':'April', 'May':'May', 'June':'June','July':'July','August':'August',
    	'September':'September','October':'October','November':'November',
    	'December':'December','First Waso':'First Waso','Tagu':'Tagu',
    	'Kason':'Kason','Nayon':'Nayon','Waso':'Waso',	'Wagaung':'Wagaung',
    	'Tawthalin':'Tawthalin','Thadingyut':'Thadingyut','Tazaungmon':'Tazaungmon',
    	'Nadaw':'Nadaw','Pyatho':'Pyatho','Tabodwe':'Tabodwe','Tabaung':'Tabaung',
    	'waxing':'waxing','waning':'waning','full moon':'full moon',
    	'new moon':'new moon','Myanmar Year':'Myanmar Year','Ku':' ','Late':'Late ',
    	'Second':'Second ','Sunday':'Sunday','Monday':'Monday','Tuesday':'Tuesday',
    	'Wednesday':'Wednesday','Thursday':'Thursday','Friday':'Friday',
    	'Saturday':'Saturday','Nay':' ','Yat':' ','Sabbath Eve':'Sb Eve',
    	'Sabbath':'Sabbath','Yatyaza':'Yatyaza',
    	'Afternoon Pyathada':'Afternoon Pyathada','Pyathada':'Pyathada',
    	'New Year Day':'New Year\'s Day','Independence Day':'Independence Day',
    	'Union Day':'Union Day','Peasants Day':'Peasants Day',
    	'Resistance Day':'Resistance Day','Labour Day':'Labour Day',
    	'Martyrs Day':'Martyrs\' Day','Christmas Day':'Christmas Day',
    	'Buddha Day':'Buddha Day','Start of Buddhist Lent':'Start of Buddhist Lent',
    	'End of Buddhist Lent':'End of Buddhist Lent','Tazaungdaing':'Tazaungdaing',
    	'National Day':'National Day','Karen New Year Day':'Karen New Year Day',
    	'Tabaung Pwe':'Tabaung Pwe','Thingyan Akyo':'Thingyan Akyo',
    	'Thingyan Akya':'Thingyan Akya','Thingyan Akyat':'Thingyan Akyat',
    	'Thingyan Atat':'Thingyan Atat','Myanmar New Year Day':'Myanmar New Year Day',
    	'Amyeittasote':'Amyeittasote','Warameittugyi':'Warameittugyi',
    	'Warameittunge':'Warameittunge','Thamaphyu':'Thamaphyu',
    	'Thamanyo':'Thamanyo','Yatpote':'Yatpote','Yatyotema':'Yatyotema',
    	'Mahayatkyan':'Mahayatkyan','Nagapor':'Nagapor','Shanyat':'Shanyat',
    	'0': '0','1': '1','2': '2','3': '3','4': '4','5': '5','6': '6','7': '7',
    	'8': '8','9': '9',',':',','.':'.','Mon National Day':'Mon National Day',
    	'G. Aung San BD':'G. Aung San BD','Valentines Day':'Valentines Day',
    	'Earth Day':'Earth Day','April Fools Day':'April Fools\' Day',
    	'Red Cross Day':'Red Cross Day','United Nations Day':'United Nations Day',
    	'Halloween':'Halloween','Shan New Year Day':'Shan New Year Day',
    	'Mothers Day':'Mothers\' Day','Fathers Day':'Fathers\' Day',
    	'Sasana Year':'Sasana Year','Eid':'Eid','Diwali':'Diwali',
    	'Mahathamaya Day':'Great Integration','Garudhamma Day':'Garudhamma Day',
    	'Metta Day':'Metta Day','Taungpyone Pwe':'Taungpyone Pwe',
    	'Yadanagu Pwe':'Yadanagu Pwe','Authors Day':'Authors\' Day',
    	'World Teachers Day':'World Teachers\' Day','Holiday':'Holiday'};}
    	//----------------------------------------------------------------------------
    	else if (lang==2) { //Catalog for Mon Language  using Unicode
    //Mon Language Translation by: 'ITVilla' : http://it-villa.blogspot.com/
    //Proof reading: Mikau Nyan
    	X={ 'January':'ဂျာန်နျူအာရဳ','February':'ဝှေဝ်ဗျူအာရဳ','March':'မာတ်ချ်',
    	'April':'ဨပြေယ်လ်','May':'မေ','June':'ဂျုန်','July':'ဂျူလာၚ်',
    	'August':'အဝ်ဂါတ်','September':'သိတ်ထီဗာ','October':'အံက်ထဝ်ဗာ',
    	'November':'နဝ်ဝါမ်ဗာ','December':'ဒီဇြေန်ဗာ','First Waso':'ဂိတုပ-ဒ္ဂိုန်',
    	'Tagu':'ဂိတုစဲ','Kason':'ဂိတုပသာ်','Nayon':'ဂိတုဇှေ်',
    	'Waso':'ဂိတုဒ္ဂိုန်','Wagaung':'ဂိတုခ္ဍဲသဳ','Tawthalin':'ဂိတုဘတ်',
    	'Thadingyut':'ဂိတုဝှ်','Tazaungmon':'ဂိတုက္ထိုန်','Nadaw':'ဂိတုမြေက္ကသဵု',
    	'Pyatho':'ဂိတုပှော်','Tabodwe':'ဂိတုမာ်','Tabaung':'ဂိတုဖဝ်ရဂိုန်',
    	'waxing':'မံက်','waning':'စွေက်','full moon':'ပေၚ်',
    	'new moon':'အိုတ်','Myanmar Year':'သက္ကရာဇ်ဍုၚ်','Ku':'သၞာံ',
    	'Late':'','Second':'ဒု','Sunday':'တ္ၚဲအဒိုတ်','Monday':'တ္ၚဲစန်',
    	'Tuesday':'တ္ၚဲအင္ၚာ','Wednesday':'တ္ၚဲဗုဒ္ဓဝါ','Thursday':'တ္ၚဲဗြဴဗတိ',
    	'Friday':'တ္ၚဲသိုက်','Saturday':'တ္ၚဲသ္ၚိသဝ်','Nay':'','Yat':'',
    	'Sabbath Eve':'တ္ၚဲတိၚ်','Sabbath':'တ္ၚဲသဳ','Yatyaza':'တ္ရဲရာဇာ',
    	'Afternoon Pyathada':'တ္ၚဲရာဟု','Pyathada':'တ္ၚဲပြာဗ္ဗဒါ',
    	'New Year Day':'New Year\'s Day','Independence Day':'တ္ၚဲသၠးပွး',
    	'Union Day':'တ္ၚဲကၟိန်ဍုၚ်','Peasants Day':'တ္ၚဲသၟာဗ္ၚ',
    	'Resistance Day':'တ္ၚဲပၠန်ဂတးဗၟာ','Labour Day':'တ္ၚဲသၟာကမၠောန်',
    	'Martyrs Day':'တ္ၚဲအာဇာနဲ','Christmas Day':'တ္ၚဲခရေဿမာတ်',
    	'Buddha Day':'တ္ၚဲသ္ဘၚ်ဖဍာ်ဇြဲ','Start of Buddhist Lent':'တ္ၚဲတွံဓဝ်ဓမ္မစက်',
    	'End of Buddhist Lent':'တ္ၚဲအဘိဓရ်','Tazaungdaing':'သ္ဘၚ်ပူဇဴပၟတ်ပၞာၚ်',
    	'National Day':'တ္ၚဲကောန်ဂကူဗၟာ','Karen New Year Day':'ကရေၚ်လှာဲသၞာံ',
    	'Tabaung Pwe':'သ္ဘၚ်ဖဝ်ရဂိုန်','Thingyan Akyo':'တ္ၚဲဒစးအတး',
    	'Thingyan Akya':'တ္ၚဲအတးစှေ်','Thingyan Akyat':'တ္ၚဲအတးကြာပ်',
    	'Thingyan Atat':'တ္ၚဲအတးတိုန်','Myanmar New Year Day':'တ္ၚဲသၞာံတၟိ',
    	'Amyeittasote':'ကိုန်အမြိုတ်','Warameittugyi':'ကိုန်ဝါရမိတ္တုဇၞော်',
    	'Warameittunge':'ကိုန်ဝါရမိတ္တုဍောတ်','Thamaphyu':'ကိုန်လေၚ်ဒိုက်',
    	'Thamanyo':'ကိုန်ဟုံဗြမ်','Yatpote':'ကိုန်လီုလာ်','Yatyotema':'ကိုန်ယုတ်မာ',
    	'Mahayatkyan':'ကိုန်ဟွံခိုဟ်', 'Nagapor':'နာ်မံက်','Shanyat':'တ္ၚဲဒတန်',
    	'0': '၀','1': '၁','2': '၂','3': '၃','4': '၄','5': '၅','6': '၆','7': '၇',
    	'8': '၈','9': '၉',',':'၊','.':'။','Mon National Day':'တ္ၚဲကောန်ဂကူမန်',
    	'Mon Fallen Day':'တ္ၚဲဟံသာဝတဳလီု', 'Mon Revolution Day':'တ္ၚဲပၠန်ဂတးမန်',
    	'Mon Women Day':'တ္ၚဲညးဗြဴမန်','G. Aung San BD':'တ္ၚဲသၟိၚ်ဗၟာ အံၚ်သာန်ဒှ်မၞိဟ်',
    	'Valentines Day':'တ္ၚဲဝုတ်ဗၠာဲ','Earth Day':'တ္ၚဲဂၠးကဝ်',
    	'April Fools Day':'တ္ၚဲသ္ပပရအ်','Red Cross Day':'တ္ၚဲဇိုၚ်ခ္ဍာ်ဍာဲ',
    	'United Nations Day':'တ္ၚဲကုလသမ္မဂ္ဂ','Halloween':'တ္ၚဲဟေဝ်လဝ်ဝိန်',
    	'Shan New Year Day':'တ္ၚဲသေံလှာဲသၞာံ','Mothers Day':'တ္ၚဲမိအံက်',
    	'Fathers Day':'တ္ၚဲမအံက်','Sasana Year':'သက္ကရာဇ် သာသနာ',
    	'Eid':'အိဒ်','Diwali':'ဒီဝါလီ','Mahathamaya Day':'မဟာသမယနေ့',
    	'Garudhamma Day':'ဂရုဓမ္မနေ့','Metta Day':'မေတ္တာနေ့',
    	'Taungpyone Pwe':'တောင်ပြုန်းပွဲ','Yadanagu Pwe':'ရတနာ့ဂူပွဲ',
    	'Authors Day':'စာဆိုတော်နေ့','World Teachers Day':'ကမ္ဘာ့ဆရာများနေ့',
    	'Holiday':'ရုံးပိတ်ရက်' };}
    	//----------------------------------------------------------------------------
    	else if (lang==3) { //Catalog for Zawgyi-One
    	X={'January':'ဇန္နဝါရီ','February':'ေဖေဖာ္ဝါရီ','March':'မတ္',
    	'April':'ဧၿပီ','May':'ေမ','June':'ဇြန္','July':'ဇူလိုင္','August':'ဩဂုတ္',
    	'September':'စက္တင္ဘာ','October':'ေအာက္တိုဘာ','November':'နိုဝင္ဘာ',
    	'December':'ဒီဇင္ဘာ','First Waso':'ပဝါဆို','Tagu':'တန္ခူး','Kason':'ကဆုန္',
    	'Nayon':'နယုန္','Waso':'ဝါဆို','Wagaung':'ဝါေခါင္','Tawthalin':'ေတာ္သလင္း',
    	'Thadingyut':'သီတင္းကြ်တ္','Tazaungmon':'တန္ေဆာင္မုန္း','Nadaw':'နတ္ေတာ္',
    	'Pyatho':'ျပာသို','Tabodwe':'တပို႔တြဲ','Tabaung':'တေပါင္း','waxing':'လဆန္း',
    	'waning':'လဆုတ္','full moon':'လျပည့္','new moon':'လကြယ္',
    	'Myanmar Year':'ျမန္မာႏွစ္','Ku':'ခု','Late':'ေႏွာင္း','Second':'ဒု',
    	'Sunday':'တနဂၤေႏြ','Monday':'တနလၤာ','Tuesday':'အဂၤါ','Wednesday':'ဗုဒၶဟူး',
    	'Thursday':'ၾကာသပေတး','Friday':'ေသာၾကာ','Saturday':'စေန','Nay':'ေန႔',
    	'Yat':'ရက္','Sabbath Eve':'အဖိတ္','Sabbath':'ဥပုသ္','Yatyaza':'ရက္ရာဇာ',
    	'Afternoon Pyathada':'မြန္းလြဲျပႆဒါး','Pyathada':'ျပႆဒါး',
    	'New Year Day':'New Year\'s Day','Independence Day':'လြတ္လပ္ေရးေန႔',
    	'Union Day':'ျပည္ေထာင္စုေန႔','Peasants Day':'ေတာင္သူ လယ္သမားေန႔',
    	'Resistance Day':'ေတာ္လွန္ေရးေန႔','Labour Day':'အလုပ္သမားေန႔',
    	'Martyrs Day':'အာဇာနည္ေန႔','Christmas Day':'ခရစၥမတ္ေန႔',
    	'Buddha Day':'ေညာင္ေရ သြန္းပြဲ','Start of Buddhist Lent':'ဓမၼစၾကာေန႔',
    	'End of Buddhist Lent':'မီးထြန္းပြဲ','Tazaungdaing':'တန္ေဆာင္တိုင္',
    	'National Day':'အမ်ိဳးသားေန႔','Karen New Year Day':'ကရင္ နွစ္သစ္ကူး',
    	'Tabaung Pwe':'တေပါင္းပြဲ','Thingyan Akyo':'သၾကၤန္ အႀကိဳ',
    	'Thingyan Akya':'သႀကၤန္္ အက်','Thingyan Akyat':'သႀကၤန္္ အၾကတ္',
    	'Thingyan Atat':'သႀကၤန္္ အတက္','Myanmar New Year Day':'နွစ္ဆန္း တစ္ရက္',
    	'Amyeittasote':'အၿမိတၱစုတ္','Warameittugyi':'ဝါရမိတၱဳႀကီး',
    	'Warameittunge':'ဝါရမိတၱဳငယ္','Thamaphyu':'သမားျဖဴ',
    	'Thamanyo':'သမားညိဳ','Yatpote':'ရက္ပုပ္','Yatyotema':'ရက္ယုတ္မာ',
    	'Mahayatkyan':'မဟာရက္ၾကမ္း','Nagapor':'နဂါးေပၚ','Shanyat':'ရွမ္းရက္',
    	'0': '၀','1': '၁','2': '၂','3': '၃','4': '၄','5': '၅','6': '၆','7': '၇',
    	'8': '၈','9': '၉',',':'၊','.':'။','Mon National Day':'မြန္အမ်ိဳးသားေန႔',
    	'G. Aung San BD':'ဗိုလ္ခ်ဳပ္ ေမြးေန႔','Valentines Day':'ဗယ္လင္တိုင္း',
    	'Earth Day':'ကမၻာေျမေန႔','April Fools Day':'ဧၿပီအ႐ူးေန႔',
    	'Red Cross Day':'ၾကက္ေျခနီေန႔','United Nations Day':'ကုလသမၼဂၢေန႔',
    	'Halloween':'သရဲေန႔','Shan New Year Day':'ရွမ္းနွစ္သစ္ကူး',
    	'Mothers Day':'အေမေန႔','Fathers Day':'အေဖေန႔','Sasana Year':'သာသနာႏွစ္',
    	'Eid':'အိဒ္','Diwali':'ဒီဝါလီ','Mahathamaya Day':'မဟာသမယေန႔',
    	'Garudhamma Day':'ဂ႐ုဓမၼေန႔','Metta Day':'ေမတၱာေန႔',
    	'Taungpyone Pwe':'ေတာင္ျပဳန္းပြဲ','Yadanagu Pwe':'ရတနာ့ဂူပြဲ',
    	'Authors Day':'စာဆိုေတာ္ေန႔','World Teachers Day':'ကမၻာ့ဆရာမ်ားေန႔',
    	'Holiday':'႐ုံးပိတ္ရက္'};}
    	//----------------------------------------------------------------------------
    	else {	//Catalog for Myanmar Unicode
    	X={'January':'ဇန်နဝါရီ','February':'ဖေဖော်ဝါရီ','March':'မတ်',
    	'April':'ဧပြီ','May':'မေ','June':'ဇွန်','July':'ဇူလိုင်','August':'ဩဂုတ်',
    	'September':'စက်တင်ဘာ','October':'အောက်တိုဘာ','November':'နိုဝင်ဘာ',
    	'December':'ဒီဇင်ဘာ','First Waso':'ပဝါဆို','Tagu':'တန်ခူး','Kason':'ကဆုန်',
    	'Nayon':'နယုန်','Waso':'ဝါဆို','Wagaung':'ဝါခေါင်','Tawthalin':'တော်သလင်း',
    	'Thadingyut':'သီတင်းကျွတ်','Tazaungmon':'တန်ဆောင်မုန်း','Nadaw':'နတ်တော်',
    	'Pyatho':'ပြာသို','Tabodwe':'တပို့တွဲ','Tabaung':'တပေါင်း','waxing':'လဆန်း',
    	'waning':'လဆုတ်','full moon':'လပြည့်','new moon':'လကွယ်',
    	'Myanmar Year':'မြန်မာနှစ်','Ku':'ခု','Late':'နှောင်း','Second':'ဒု',
    	'Sunday':'တနင်္ဂနွေ','Monday':'တနင်္လာ','Tuesday':'အင်္ဂါ',
    	'Wednesday':'ဗုဒ္ဓဟူး','Thursday':'ကြာသပတေး','Friday':'သောကြာ',
    	'Saturday':'စနေ','Nay':'နေ့','Yat':'ရက်','Sabbath Eve':'အဖိတ်',
    	'Sabbath':'ဥပုသ်','Yatyaza':'ရက်ရာဇာ','Afternoon Pyathada':'မွန်းလွဲပြဿဒါး',
    	'Pyathada':'ပြဿဒါး','New Year Day':'New Year\'s Day',
    	'Independence Day':'လွတ်လပ်ရေးနေ့','Union Day':'ပြည်ထောင်စုနေ့',
    	'Peasants Day':'တောင်သူ လယ်သမားနေ့','Resistance Day':'တော်လှန်ရေးနေ့',
    	'Labour Day':'အလုပ်သမားနေ့','Martyrs Day':'အာဇာနည်နေ့',
    	'Christmas Day':'ခရစ္စမတ်နေ့','Buddha Day':'ညောင်ရေသွန်းပွဲ',
    	'Start of Buddhist Lent':'ဓမ္မစကြာနေ့','End of Buddhist Lent':'မီးထွန်းပွဲ',
    	'Tazaungdaing':'တန်ဆောင်တိုင်','National Day':'အမျိုးသားနေ့',
    	'Karen New Year Day':'ကရင်နှစ်သစ်ကူး','Tabaung Pwe':'တပေါင်းပွဲ',
    	'Thingyan Akyo':'သင်္ကြန်အကြို','Thingyan Akya':'သင်္ကြန်အကျ',
    	'Thingyan Akyat':'သင်္ကြန်အကြတ်','Thingyan Atat':'သင်္ကြန်အတက်',
    	'Myanmar New Year Day':'နှစ်ဆန်းတစ်ရက်','Amyeittasote':'အမြိတ္တစုတ်',
    	'Warameittugyi':'ဝါရမိတ္တုကြီး','Warameittunge':'ဝါရမိတ္တုငယ်',
    	'Thamaphyu':'သမားဖြူ','Thamanyo':'သမားညို','Yatpote':'ရက်ပုပ်',
    	'Yatyotema':'ရက်ယုတ်မာ','Mahayatkyan':'မဟာရက်ကြမ်း','Nagapor':'နဂါးပေါ်',
    	'Shanyat':'ရှမ်းရက်','0': '၀','1': '၁','2': '၂','3': '၃','4': '၄','5': '၅',
    	'6': '၆','7': '၇','8': '၈','9': '၉',',':'၊','.':'။',
    	'Mon National Day':'မွန် အမျိုးသားနေ့','G. Aung San BD':'ဗိုလ်ချုပ် မွေးနေ့',
    	'Valentines Day':'ဗယ်လင်တိုင်းနေ့','Earth Day':'ကမ္ဘာမြေနေ့',
    	'April Fools Day':'ဧပြီအရူးနေ့','Red Cross Day':'ကြက်ခြေနီနေ့',
    	'United Nations Day':'ကုလသမ္မဂ္ဂနေ့','Halloween':'သရဲနေ့',
    	'Shan New Year Day':'ရှမ်းနှစ်သစ်ကူး','Mothers Day':'အမေနေ့',
    	'Fathers Day':'အဖေနေ့','Sasana Year':'သာသနာနှစ်',
    	'Eid':'အိဒ်','Diwali':'ဒီဝါလီ','Mahathamaya Day':'မဟာသမယနေ့',
    	'Garudhamma Day':'ဂရုဓမ္မနေ့','Metta Day':'မေတ္တာနေ့',
    	'Taungpyone Pwe':'တောင်ပြုန်းပွဲ','Yadanagu Pwe':'ရတနာ့ဂူပွဲ',
    	'Authors Day':'စာဆိုတော်နေ့','World Teachers Day':'ကမ္ဘာ့ဆရာများနေ့',
    	'Holiday':'ရုံးပိတ်ရက်'};}
    	//----------------------------------------------------------------------------
    }
    //End of language catalog ####################################################
    //-------------------------------------------------------------------------

    // Public function - Gregorian to Myanmar 
    //----------------------------------------------------------------------------
    //input: (gy=year, gm=month [Jan=1, ... , Dec=12], gd: day [0-31])
    //output:  (my : year,
    //  myt :year type, 0=regular, 1=little watat, 2=big watat,
    //  watat : 1=watat, 0=regular,
    //  bw : big watat, 1=true, 0=false,
    //  myl: year length,
    //  mm: month,
    //  mmt: month type, 1=hnaung, 0= Oo,
    //  mml: month length,
    //  md: month day = 1 to 30,
    //  d: day =1 to 15,
    //  ms :moon status, 0: waxing, 1: full moon, 2: waning, 3: new moon,
    //  wd: week day, 0=sat, 1=sun, ..., 6=fri)
    function g2m(gy,gm,gd) {
      return j2m(g2j(gy,gm,gd));//Gregorian date to julian date
    }
    // Public function - Myanmar to Gregorian
    //----------------------------------------------------------------------------
    //input:  (my : year,
    //  myt :year type, 0=regular, 1=little watat, 2=big watat,
    //  watat : 1=watat, 0=regular,
    //  bw : big watat, 1=true, 0=false,
    //  myl: year length,
    //  mm: month,
    //  mmt: month type, 1=hnaung, 0= Oo,
    //  mml: month length,
    //  md: month day = 1 to 30,
    //  d: day =1 to 15,
    //  ms :moon status, 0: waxing, 1: full moon, 2: waning, 3: new moon,
    //  wd: week day, 0=sat, 1=sun, ..., 6=fri)
    //ouput: (gy=year, gm=month [Jan=1, ... , Dec=12], gd: day [0-31])
    function m2g(my,mm,mmt,ms,d) {
      return j2g(m2j(my,mm,mmt,ms,d));//Gregorian date to julian date
    }


    //input: 
    //  mDate: myanmarDate
    //  lang: (0: myanmar unicode, 1: english, 2: Mon Language using Unicode, 3:Zawgyi-One)
    //output:
    //  string
    function dateString(mDate, lang) {
      SetLang(lang || 0); // Default is myanmar.

      var display = n2s(mDate.my) +", "; // +" ME, ";
      
      if(mDate.mmt === 1) { 
        display += "Hnaung ";
      }

      var months=["1st Waso","Tagu","Kason","Nayon","Waso","Wagaung","Tawthalin", "Thadingyut","Tazaungmon","Nadaw","Pyatho","Tabodwe","Tabaung"];
      for (var i = 0; i < months.length; i++) {
        months[i] = X[months[i]];
      };

      if(mDate.myt !== 0 && mDate.mm === 4) {
        display += "2nd "; 
      }
      
      display += months[mDate.mm] + " ";

      var msStr=["waxing","full moon","waning","new moon"];
      for (var i = 0; i < msStr.length; i++) {
        msStr[i] = X[msStr[i]];
      };

      display += msStr[mDate.ms] + " "; 

      if ((mDate.ms%2) === 0) {
        display += n2s(mDate.d); 
      }

      return display;
    }


    // Add function here to make them publicly available
    return {
        g2m: g2m,
        m2g: m2g,
        dateString: dateString
    }
}));

