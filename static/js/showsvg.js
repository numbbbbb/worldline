var arrColors   = ['red','green','blue','yellow','navy','gold','dodgerblue','navajowhite','mediumpurple'];

//数组排序函数,升序
function s(a,b) {
  return a - b;
}
//排序函数用法
//array.sort(s);

//删除数组中的一个元素，参数dx表示该元素的index
Array.prototype.baoremove = function(dx)
{
  if(isNaN(dx)||dx>this.length){return false;}
  this.splice(dx,1);
}

//重新排列数组，去掉为空的值或者非正常的值
//参数是一个两维数组，第一维表示数值的数组，第二维表示年份的数组，
//两个子数组在排序前后均须保持一一对应关系
function resortArray() {
  //var tmparr1 = tmparr[0];
  //var tmparr2 = tmparr[1];
  var len = arrUseValue.length;
  var tmpi = 0;
  for(var i=0; i<len; i++) {
    if(isNaN(arrUseValue[tmpi])) {
      arrUseValue.baoremove(tmpi);
      arrUseYear.baoremove(tmpi);
      tmpi = (i > 0) ? i : 0;
      //tmparr1.baoremove(i);
      //tmparr2.baoremove(i);
    } else {
      tmpi = i + 1;
    }
  }
  //var retarr = new Array(tmparr1,tmparr2);
  //return retarr;
}

function getMaxValue(tmparr) {
  var maxValue = 0;
  for (var i=0; i<tmparr.length; i++) {
    var value = parseFloat(tmparr[i]);
    if (value > maxValue) maxValue = value;
  }
  maxValue = Math.ceil(maxValue);
  return maxValue;
}


function getMinValue(tmparr) {
  var minValue = 1000000000000000;
  for (var i=0; i<tmparr.length; i++) {
    var value = parseFloat(tmparr[i]);
    if (value < minValue) {
      minValue = value;
    }
  }
  minValue = Math.floor(minValue);
  return minValue;
}


function getMaxPeriod(tmparr) {
  var maxValue = 0;
  for (var i=0; i<tmparr.length; i++) {
    var value = tmparr[i][0];
    if (value > maxValue) maxValue = value;
  }
  return maxValue;
}


function getMinPeriod(tmparr) {
  var minPeriod = 3000;
  for (var i=0; i<tmparr.length; i++) {
    var value = tmparr[i][0];
    if (value < minPeriod) minPeriod = value;
  }
  return minPeriod;
}

//显示提示窗口    
function ShowTooltip(mousemove_event,txt)
{
  //obj=mousemove_event.target.parentNode;
  //obj.style.setProperty("opacity","0.5");
  
  var ttrelem,tttelem,posx,posy,curtrans,ctx,cty;

  ttrelem=svgDoc.getElementById("ttr");
  tttelem=svgDoc.getElementById("ttt");

  posx=mousemove_event.clientX;
  posy=mousemove_event.clientY;
  tttelem.childNodes.item(0).data=txt;

  curtrans=svgDoc.documentElement.currentTranslate;
  ctx=curtrans.x;
  cty=curtrans.y;

  ttrelem.setAttribute("x",posx-ctx);
  ttrelem.setAttribute("y",posy-cty-20);
  tttelem.setAttribute("x",posx-ctx+5);
  tttelem.setAttribute("y",posy-cty-8);
  ttrelem.setAttribute("width",tttelem.getComputedTextLength()+30);
  tttelem.setAttribute("style","fill: #00C; font-size: 13px; visibility: visible");
  ttrelem.setAttribute("style","fill: #FFC; stroke: #000; stroke-width: 0.5px;\
    visibility: visible");
}
//隐藏提示窗口
function HideTooltip(mouseout_event)
{
  //obj=mouseout_event.target.parentNode;
  //obj.style.setProperty("opacity","1.0");
  
  var ttrelem,tttelem;

  ttrelem=svgDoc.getElementById("ttr");
  tttelem=svgDoc.getElementById("ttt");
  ttrelem.setAttribute("style","visibility: hidden");
  tttelem.setAttribute("style","visibility: hidden");
}
//窗口缩放
function ZoomControl()
{
  var curzoom;

  curzoom=svgDoc.documentElement.currentScale;
  svgDoc.getElementById("tooltip").setAttribute("transform","scale("+1/curzoom+")");
}
    
//清除svg图像中的所有元素，便于重新画图
function deleItem() {
  //var gnode = svgDoc.getElementById("gc");
  while (gnode.getChildNodes().getLength() > 0) {
    gnode.removeChild(gnode.getFirstChild());
  }
}

//画折线图，第一个参数是数值数组，
//第二个参数是最小值，第三个参数是最大值
function drawPolyline(tmparr,tmpminv,tmpmaxv) {
  var vpoint = "";
  var t = tmparr.length;
  var addv = 152 / (t - 1);
  var vx = 20;
  var vy = 0;
  tmpdiv = (tmpmaxv - tmpminv) / 5;
  
  tmpmaxv = Math.ceil(tmpmaxv + tmpdiv);
  tmpminv = Math.floor(tmpminv - tmpdiv);
  
  for(var i=0;i<t;i++) {
    var txtcirc = arrUseYear[i] + ", " + tmparr[i];
    //确定x坐标
    vx = 20 + i * addv;
    vpoint += vx + ",";
    //确定y坐标
    //alert(tmparr[i]);
    vy = 120 - (tmparr[i] - tmpminv) / (tmpmaxv - tmpminv) * 120;
    vpoint += vy + ",";
    
    //添加小圆点
    var newcircle = svgDoc.createElement("circle");
    newcircle.setAttribute("cx",vx);
    newcircle.setAttribute("cy",vy);
    newcircle.setAttribute("r",2);
    newcircle.setAttribute("style","cursor:crosshair;fill:" + arrColors[i]);
    newcircle.setAttribute("onmouseover","ShowTooltip(evt,'" + txtcirc + "')" );
    newcircle.setAttribute("onmouseout","HideTooltip(evt)");
    gnode.appendChild(newcircle);
  }
  vpoint  = vpoint.substring(0,(vpoint.length - 1));
  //alert(vpoint);
  var newpoly = svgDoc.createElement("polyline");
  newpoly.setAttribute("points",vpoint);
  newpoly.setAttribute("style","fill: none; stroke: #00C; stroke-width: 1.5px");
  gnode.appendChild(newpoly);
}

//画柱状图，第一个参数是数值数组，
//第二个参数是最小值，第三个参数是最大值
function drawRectange(tmparr,tmpminv,tmpmaxv) {
  var vpoint = "";
  var t = tmparr.length;
  //var addv = 32.5;
  var addv = 130 / (t - 1);
  var vx = 27;
  var vy = 0;
  tmpdiv = (tmpmaxv - tmpminv) / 5;
  
  tmpmaxv = Math.ceil(tmpmaxv + tmpdiv);
  tmpminv = Math.floor(tmpminv - tmpdiv);

  for(var i=0;i<t;i++) {
    var txtrect = arrUseYear[i] + ", " + tmparr[i];
    //确定x坐标
    vx = 27 + i * addv;
    //确定y坐标
    vy = 120 - (tmparr[i] - tmpminv) / (tmpmaxv - tmpminv) * 120;
    var newrect = svgDoc.createElement("rect");
    newrect.setAttribute("x",vx);
    newrect.setAttribute("y",vy);
    newrect.setAttribute("width",15);
    newrect.setAttribute("height",(120 - vy));
    newrect.setAttribute("style","cursor:crosshair;fill:" + arrColors[i]);
    newrect.setAttribute("onmouseover","ShowTooltip(evt,'" + txtrect + "')" );
    newrect.setAttribute("onmouseout","HideTooltip(evt)");
    gnode.appendChild(newrect);
  }
}

//画饼图,第一个参数是数值数组，第二个参数是年份数组
function drawPie(tmparr1,tmparr2) {
    var basePointX     = 62.;
    var basePointY     = 65.;
    var currentX       = 0.0;
    var currentY       = 0.0;
    var offsetX1       = 0.0;
    var offsetY1       = 0.0;
    var offsetX2       = 0.0;
    var offsetY2       = 0.0;
    var radius         = 60.;
    var angleSum1      = 0.;
    var angleSum2      = 0.;
    var vertexCount    = tmparr1.length;
    var xPts           = Array(vertexCount);
    var yPts           = Array(vertexCount);
    var angles         = Array(vertexCount);
    var pointPath      = "";
    var colorCount     = arrColors.length;

    var pieNode        = null;
    var gcNode         = null;
    
    var dataSum = 0.;

    for(var v=0; v<vertexCount; v++)
    {
       dataSum += Math.abs(parseFloat(tmparr1[v]));
    }
    //alert(dataSum);
    for(var v=0; v<vertexCount; v++)
    {
       angles[v] = 360.*Math.abs(parseFloat(tmparr1[v]))/dataSum;
    }
    //alert(angles);
    gcNode = svgDoc.getElementById("gc");
    var txtstyle = "text-anchor:left;";
    for(var v=0; v<vertexCount; v++)
    {
       angleSum2 = angleSum1 + angles[v];
       var txtpv = parseInt(Math.abs(tmparr1[v])/dataSum *10000) / 100 + "%";
       
       offsetX1 = radius*Math.cos(angleSum1*Math.PI/180);
       offsetY1 = radius*Math.sin(angleSum1*Math.PI/180);
       offsetX2 = radius*Math.cos(angleSum2*Math.PI/180);
       offsetY2 = radius*Math.sin(angleSum2*Math.PI/180);

       currentX = basePointX+offsetX2;
       currentY = basePointY-offsetY2;

      // the vertical offset must be subtracted,
      // so we need to "flip" the sign of offsetY1
       offsetY1 *= -1;

       pointPath = "M"+basePointX+","+basePointY;
       pointPath += " l"+offsetX1+","+offsetY1;
       if(angles[v] < 180 ) {
         pointPath += " A"+radius+","+radius+" 0 0 0 ";
       } else {
         pointPath += " A"+radius+","+radius+" 0 1 0 ";
       }
       pointPath += currentX+","+currentY;
       pointPath += " L"+basePointX+","+
                        basePointY+"z";

       fillColor  = "fill:" + arrColors[v%colorCount];

       txtGnode = tmparr2[v] + "," + tmparr1[v] + "," + txtpv;
       //alert(txtGnode);
       var newg = svgDoc.createElement("g");
       //newg.addEventListener("mouseover",OpacityDown,true);
       //newg.addEventListener("mouseout",OpacityUp,true);
       newg.setAttribute("onmouseover","ShowTooltip(evt,'" + txtGnode + "')" );
       newg.setAttribute("onmouseout","HideTooltip(evt)");
       gcNode.appendChild(newg);

       pieNode = svgDoc.createElement("path");
       pieNode.setAttribute("d",    pointPath);
       pieNode.setAttribute("style",fillColor);
       newg.appendChild(pieNode);
       
       var recNode = svgDoc.createElement("rect");
       recNode.setAttribute("x",123);
       recNode.setAttribute("y",(10 + v*10));
       recNode.setAttribute("width",3);
       recNode.setAttribute("height",3);
       recNode.setAttribute("style",fillColor);
       newg.appendChild(recNode);
       
       var txtNode = svgDoc.createElement("text");
       txtNode.setAttribute("x",128);
       txtNode.setAttribute("y",(15 + v*10));
       txtst = txtstyle + fillColor;
       txtNode.setAttribute("style",txtst);
       newg.appendChild(txtNode);
       texte=svgDoc.createTextNode(tmparr2[v] + "[" + txtpv + "]");
       txtNode.appendChild(texte);

       angleSum1 += angles[v];
    }
}

//设定x轴坐标,画线及添加标题,参数是年份数组
function setXAxis(tmparr) {
  //画x轴线
  var newline = svgDoc.createElement("line");
  newline.setAttribute("x1",20);
  newline.setAttribute("y1",120);
  newline.setAttribute("x2",172);
  newline.setAttribute("y2",120);
  newline.setAttribute("style","stroke-width:2;stroke:blue");
  gnode.appendChild(newline);
  
  var t = tmparr.length - 1;
  var addv = 152 / t;
  var addt = 144 / t;
  var sumlv = 20;
  var sumtv = 17;
	//画x轴的文字
  newtext = svgDoc.createElement("text");
  newtext.setAttribute("x",sumtv);
  newtext.setAttribute("y",127);
  gnode.appendChild(newtext);
  texte=svgDoc.createTextNode(tmparr[0]);
  newtext.appendChild(texte);
  for(var i=0;i<t;i++) {
    //画x轴的小短线
    sumlv = 20 + (i + 1) * addv;
    newline = svgDoc.createElement("line");
	  newline.setAttribute("x1",sumlv);
	  newline.setAttribute("y1",0);
	  newline.setAttribute("x2",sumlv);
	  newline.setAttribute("y2",120);
	  newline.setAttribute("style","stroke-width:0.5;stroke:white");
	  gnode.appendChild(newline);
	  //画x轴的文字
	  sumtv = 17 + (i + 1) * addt;
	  newtext = svgDoc.createElement("text");
	  newtext.setAttribute("x",sumtv);
	  newtext.setAttribute("y",127);
	  gnode.appendChild(newtext);
	  texte=svgDoc.createTextNode(tmparr[i+1]);
    newtext.appendChild(texte);
  }
}

//设定y轴坐标,画线及添加标题,第一个参数是最小值，第二个参数是最大值
function setYAxis(tmpminv,tmpmaxv) {
  //画y轴线
  var newline = svgDoc.createElement("line");
  newline.setAttribute("x1",20);
  newline.setAttribute("y1",0);
  newline.setAttribute("x2",20);
  newline.setAttribute("y2",120);
  newline.setAttribute("style","stroke-width:2;stroke:blue");
  gnode.appendChild(newline);
  
  var addv = 24;
  var sumlv = 0;
  var sumtv = 4;

  tmpdiv = (tmpmaxv - tmpminv) / 5;
  tmpmaxv = Math.ceil(tmpmaxv + tmpdiv);
  tmpminv = Math.floor(tmpminv - tmpdiv);

  var divtxt = (tmpmaxv - tmpminv) / 5;
  for(var i=0;i<5;i++) {
    //画y轴的小短线
    sumlv = 0 + i * addv;
    newline = svgDoc.createElement("line");
	  newline.setAttribute("x1",20);
	  newline.setAttribute("y1",sumlv);
	  newline.setAttribute("x2",172);
	  newline.setAttribute("y2",sumlv);
	  newline.setAttribute("style","stroke-width:0.5;stroke:white");
	  gnode.appendChild(newline);
	}
	for(var i=0;i<6;i++) {
	  //画y轴的文字
	  if(i == 0) {
	    sumtv = 7;
	  } else {
	    sumtv = 4 + i * 24;
	  }
	  txtdata = tmpmaxv - Math.round(divtxt * i);
	  newtext = svgDoc.createElement("text");
	  newtext.setAttribute("x",1);
	  newtext.setAttribute("y",sumtv);
	  gnode.appendChild(newtext);
	  texte=svgDoc.createTextNode(txtdata);
    newtext.appendChild(texte);
  }
}

//设定公司的名称
function setCompanyName(companyname) {
  parent.all['svgtitle'].innerHTML = companyname;
}

//设定图象的标题,涉及到下拉框和标题栏的同时变动
function setGraphTitle(title) {
  //
}

//点击动态改变图象的函数,第一个参数是数值数组，第二个参数是年份数组
//function svgViewChange(tmparr1,tmparr2) {
function svgViewChange(tmparr1,tmparr2,type) {
  arrUseValue = tmparr1;
  arrUseYear = tmparr2;
  //alert(arrUseValue);
  //alert(arrUseYear);
  resortArray();
  svgType = type;
  if(svgType == 1) {
    deleItem();
    useMinValue = getMinValue(arrUseValue);
    useMaxValue = getMaxValue(arrUseValue);
    setXAxis(arrUseYear);
    setYAxis(useMinValue,useMaxValue);
    drawPolyline(arrUseValue,useMinValue,useMaxValue);
  } else if(svgType == 2) {
    deleItem();
    useMinValue = getMinValue(arrUseValue);
    useMaxValue = getMaxValue(arrUseValue);
    setXAxis(arrUseYear);
    setYAxis(useMinValue,useMaxValue);
    drawRectange(arrUseValue,useMinValue,useMaxValue);
  } else if(svgType == 3) {
    deleItem();
    useMinValue = getMinValue(arrUseValue);
    useMaxValue = getMaxValue(arrUseValue);
    drawPie(arrUseValue,arrUseYear);
  }
}

function opennewwin() {
  mynewwin = window.open ('bigimg.html', 'svgnewwindow', 'height=320, width=370, top=100, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
}
