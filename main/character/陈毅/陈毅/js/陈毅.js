//创建地图
var map = new AMap.Map('container', {
	mapStyle: "amap://styles/whitesmoke",
	center: [104.955418, 30.379637], // 添加路径起始经纬度
	zoom: 7,
});

AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

	if (!PathSimplifier.supportCanvas) {
		alert('当前环境不支持 Canvas！');
		return;
	}

	var emptyLineStyle = {
		lineWidth: 0,
		fillStyle: null,
		strokeStyle: null,
		borderStyle: null
	};

	var pointHoverStyle ={
		width: 10,
		height: 10,
		content: 'circle',
		fillStyle: 'rgba(0,0,0,0)',
		lineWidth: 2,
		strokeStyle: '#ffa500'
	};

	var pathSimplifierIns = new PathSimplifier({
		zIndex: 100,
		autoSetFitView:false,
		map: map, //所属的地图实例

		getPath: function(pathData, pathIndex) {
			return pathData.path;
		},
		getHoverTitle: function(pathData, pathIndex, pointIndex) {
			if (pointIndex >= 0) {
				//point 
				return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
			}

			return pathData.name + '，点数量' + pathData.path.length;
		},
		renderOptions: {
			//将点、线相关的style全部置emptyLineStyle
			pathLineStyle: emptyLineStyle,
			pathLineSelectedStyle: emptyLineStyle,
			pathLineHoverStyle: emptyLineStyle,
			keyPointStyle: emptyLineStyle,
			startPointStyle: emptyLineStyle,
			endPointStyle: emptyLineStyle,
			keyPointHoverStyle: pointHoverStyle,
			keyPointOnSelectedPathLineStyle: emptyLineStyle
		}
	});

	window.pathSimplifierIns = pathSimplifierIns;
	
	pathSimplifierIns.setData([{
		name: 'chen',
		path: [ // 添加经纬度
			[104.955418,30.379637], //1
			[2.352200,48.856600], //2
			[116.406802,39.92787], //3
			[105.432066,28.874282], //4
			[112.950520,25.398450], //5
			[115.363190,26.337937], //6
			[120.225499,32.255331], //7
			[121.491403,31.242276], //8
			[119.484515,39.835081], //10
			[116.397454,39.909178], //11
		]
	}]);

	//initRoutesContainer(d);

	function onload() {
		pathSimplifierIns.renderLater();
	}

	function onerror(e) {
		alert('图片加载失败！');
	}

	var navg1 = pathSimplifierIns.createPathNavigator(0, {
		loop: true,
		speed: 300000,
		pathNavigatorStyle: {
			width: 15,
			height: 15,
			//使用图片
			content: 'defaultPathNavigator',
			strokeStyle: '#ee3b3b',
			fillStyle: '#FFD700',
			//经过路径的样式
			pathLinePassedStyle: {
				lineWidth: 2,
				strokeStyle: '#ee3b3b',
				dirArrowStyle: false,
			}
		},
		
	});

	navg1.start();
	
	var flag = 0;
	map.on('mouseout', function(){
		navg1.resume();
		pathSimplifierIns.show();
		map.setZoom(7);
		flag = 0
	});
	map.on('mouseover', function(){
		navg1.pause();
		pathSimplifierIns.hide();
		map.panTo(navg1.getPosition());
		map.setZoom(5);
		flag = 1;
	map.on('touchstart', function(){
		navg1.pause();
		pathSimplifierIns.hide();
		map.panTo(navg1.getPosition());
		map.setZoom(5);
		flag = 1;
	})
	map.on('touchend', function(){
		navg1.resume();
		pathSimplifierIns.show();
		map.setZoom(7);
		flag = 0
	})
	});
	setInterval(function(){if(flag == 0){map.panTo(navg1.getPosition());}},800);	
});


// 添加经纬度
var paths = [[104.955418,30.379637], //1
// [2.352200,48.856600], //2
[116.406802,39.92787], //3
[105.432066,28.874282], //4
[112.950520,25.398450], //5
[115.363190,26.337937], //6
[120.225499,32.255331], //7
[121.491403,31.242276], //8
[119.484515,39.835081], //10
[116.397454,39.909178]] //11

// Marker是地图上的黄色圆圈
// Text是地图上白色的年份标签
var A = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[0],
	map: map,
	offset:new AMap.Pixel(-27, -21),
	visible: false,
});
A.show();
setTimeout(function() {A.hide()}, 1000);
var A = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1901.8.26", // 需要更改
	position:paths[0],
	map:map,
});
var title = '1901年8月26日', // 弹出信息栏的标题
	content = [];
content.push("<div><img src='../素材/陈毅/p1.png' width='300' height='220'></img></div>"); // 信息栏中图片
content.push("<div>1901年8月26日，陈毅出生于四川乐至复兴场张安井村“一个小地主”家里。陈毅故居座落于乐至县城北17.5公里的劳动乡正沟湾，这里山丘连绵起伏，小河依傍山势，在群峰中穿流，树木郁郁葱葱，燕剪碧落，系典型的浅丘民居，并在这里度过童年时代。</div>"); // 主要事件内容填写
content.push("<div>地点：四川省资阳市乐至县劳动镇陈毅故居</div>"); // 地点填写
var infoWindow1 = new AMap.InfoWindow({ // 需要更改infoWindowX, X需要更新
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var B = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[1],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var B = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1919",
	position:paths[1],
	map:map,
});	
var title = '1919年',
	content = [];
content.push("<div><img src='../素材/陈毅/p2.png' width='300' height='220'></img></div>");
content.push("<div>1919年春，赴法国勤工俭学，在巴黎结识周恩来、蔡和森、李富春等，开始接受马克思主义，对资本主义由崇拜到失望。</div>");
content.push("<div>地点：法国巴黎（具体地点不明）</div>");
var infoWindow2 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var C = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[2],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var C = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1923.10",
	position:paths[2],
	map:map,
});	
var title = '1923年10月',
	content = [];
content.push("<div><img src='../素材/陈毅/p3.png' width='300' height='220'></img></div>");
content.push("<div>1923年10月，陈毅赴北京入中法大学学习，11月经颜昌颐、肖振声介绍，转入中国共产党，并担任中法大学中共支部书记。</div>");
content.push("<div>地点：北平中法大学</div>");
var infoWindow3 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var D = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[3],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var D = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1926.12",
	position:paths[3],
	map:map,
});	
var title = '1926年12月',
	content = [];
content.push("<img src='../素材/陈毅/p4.png' width='300' height='220'></img>");
content.push("<div>1926年12月，陈毅与与杨闇公、朱德、刘伯承等发动泸顺起义。</div>");
content.push("<div>地点：泸顺起义旧址-龙透关</div>");
var infoWindow4 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var E = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[4],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var E = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1928.1",
	position:paths[4],
	map:map,
});	
var title = '1928年1月',
	content = [];
content.push("<img src='../素材/陈毅/p5.png' width='300' height='220'></img>");
content.push("<div>1928年1月，参与领导湘南起义，任工农革命军第1师党代表[3]:33-34。3月兼任中共郴县县委书记、湘南苏维埃政府执行委员，发动群众建立苏维埃政权和地方武装。</div>");
content.push("<div>地点：湘南起义纪念馆/div>");
var infoWindow5 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var F = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[5],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var F = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1934.8.28",
	position:paths[5],
	map:map,
});	
var title = '1934年8月28日',
	content = [];
content.push("<img src='../素材/陈毅/p6.png' width='300' height='220'></img>");
content.push("<div>1934年8月28日，陈毅在江西兴国老营盘指挥作战时负重伤。10月，长征开始后，他因腿伤未愈被留在苏区，任中共苏区中央分局委员、军委分会委员、中央政府办事处主任。</div>");
content.push("<div>地点：中国江西兴国</div>");
var infoWindow6 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var G = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[6],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var G = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1940.7",
	position:paths[6],
	map:map,
});	
var title = '1940年7月',
	content = [];
content.push("<img src='../素材/陈毅/p7.png' width='300' height='220'></img>");
content.push("<div>1940年7月，陈毅率江南主力挺进苏北，成立苏北指挥部并任指挥。陈毅制订并贯彻了“灭敌、反韩、联李”的策略方针。10月与粟裕等指挥黄桥战役，歼灭韩德勤部主力1万余人，随后在盐城与南下八路军会师。</div>");
content.push("<div>地点：江苏省泰州市泰兴市黄桥镇致富北路388号新四军黄桥战役纪念馆(新馆)</div>");
var infoWindow7 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var H = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[6],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var H = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1949.1~1953.1",
	position:paths[6],
	map:map,
});	
var title = '1949年1月~1953年1月',
	content = [];
content.push("<img src='../素材/陈毅/p8.png' width='300' height='220'></img>");
content.push("<div>1949年1月，在上海战役前，于丹阳主持军政干部训练班，提出“军队不入民宅”等入城纪律。5月下旬，攻占上海后，陈毅兼任上海市军管会主任和市长。上海战役结束后，因上海面临煤炭粮食短缺、金融物价波动，加上十五万国军投诚，上海经济面临崩溃。为此，中财委召集的华东、华北、华中、东北、西北五大区财经领导干部会议在上海开幕（即上海财经会议），陈云主持会议，着手重点解决上海经济。当时尽管解放军占领上海，人民币仍然无法在上海金融市场上立足。为贯彻中央政府推行人民币为法定货币的指令，陈毅和陈云发动了著名的“银元之战”，即最初采用抛售银元、禁止银元流通等方式打击投机，但效果甚微。银元对人民币的价格仍然高增不止，为此华东局查封上海证券交易所，通过经济及政治兼顾的方式稳定上海金融市场。之后上海商人恶意囤积粮食、棉花和煤炭，为此又组织“米棉之战”，转移华东地区的储备，彻底稳定了上海市的物价。9.	1950年“春节抢购风”的斗争，基本打垮投机势力，确立社会主义国营经济在上海市场中的主导地位，并调整工商业。此外，他还主持共和国建国初年的历次运动，包括土地改革运动、三反五反运动、工商业社会主义改造等。1953年，领导全市实施第一个五年计划，提出“维持利用、调整改造”建设新上海的方针。</div>");
content.push("<div>地点：上海市黄浦区外滩街道外滩历史陈列馆黄浦公园（陈毅广场）</div>");
var infoWindow7 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var I = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[7],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var I = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1954.6~1966.1",
	position:paths[7],
	map:map,
});	
var title = '1954年6月~1966年1月',
	content = [];
content.push("<img src='../素材/陈毅/p9.png' width='300' height='220'></img>");
content.push("<div>1954年6月，陈毅任中央人民政府人民革命军事委员会副主席；9月，在第一届全国人大上当选国务院副总理、中华人民共和国国防委员会副主席，兼管科学院、政法、文化工作。与此同时，陈毅仍继续参与军队事务。1959年9月，陈毅任中共中央军委常委。1961年，在北戴河召开的国防工业委员会工作会议上，关于原子弹问题展开了激烈争论；陈毅明确表示“就是当了裤子也要把原子弹搞出来”。1966年1月8日，陈毅被任命为中共中央军委副主席。</div>");
content.push("<div>地点：河北省秦皇岛市北戴河区戴河镇北戴河区秦皇岛市北戴河区</div>");
var infoWindow8 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var J = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[8],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var J = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1972.1.6",
	position:paths[8],
	map:map,
});	
var title = '1972年1月6日',
	content = [];
content.push("<img src='../素材/陈毅/p10.png' width='300' height='220'></img>");
content.push("<div>1972年1月6日，朱德逝世于北京。</div>");
content.push("<div>地点：人民大会堂-天安门广场</div>");
var infoWindow9 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});


addMarker()

function addMarker() {
	// map.clearMap();
	// var marker = new AMap.Marker({
	//     map: map,
	//     position: [121.46035,31.22644]
	// });
	//鼠标点击marker弹出自定义的信息窗体
	AMap.event.addListener(A, 'mouseover', function () {
		infoWindow1.open(map, A.getPosition());
	});
	AMap.event.addListener(A, 'mouseout', function () {
		infoWindow1.close(map, A.getPosition());
	});
	AMap.event.addListener(B, 'mouseover', function () {
		infoWindow2.open(map, B.getPosition());
	});
	AMap.event.addListener(B, 'mouseout', function () {
		infoWindow2.close(map, B.getPosition());
	});
	AMap.event.addListener(C, 'mouseover', function () {
		infoWindow3.open(map, C.getPosition());
	});
	AMap.event.addListener(C, 'mouseout', function () {
		infoWindow3.close(map, C.getPosition());
	});
	AMap.event.addListener(D, 'mouseover', function () {
		infoWindow4.open(map, D.getPosition());
	});
	AMap.event.addListener(D, 'mouseout', function () {
		infoWindow4.close(map, D.getPosition());
	});
	AMap.event.addListener(E, 'mouseover', function () {
		infoWindow5.open(map, E.getPosition());
	});
	AMap.event.addListener(E, 'mouseout', function () {
		infoWindow5.close(map, E.getPosition());
	});
	AMap.event.addListener(F, 'mouseover', function () {
		infoWindow6.open(map, F.getPosition());
	});
	AMap.event.addListener(F, 'mouseout', function () {
		infoWindow6.close(map, F.getPosition());
	});
	AMap.event.addListener(G, 'mouseover', function () {
		infoWindow7.open(map, G.getPosition());
	});
	AMap.event.addListener(G, 'mouseout', function () {
		infoWindow7.close(map, G.getPosition());
	});
	AMap.event.addListener(H, 'mouseover', function () {
		infoWindow8.open(map, H.getPosition());
	});
	AMap.event.addListener(H, 'mouseout', function () {
		infoWindow8.close(map, H.getPosition());
	});
	AMap.event.addListener(I, 'mouseover', function () {
		infoWindow9.open(map, I.getPosition());
	});
	AMap.event.addListener(I, 'mouseout', function () {
		infoWindow9.close(map, I.getPosition());
	});
	AMap.event.addListener(J, 'mouseover', function () {
		infoWindow10.open(map, J.getPosition());
	});
	AMap.event.addListener(J, 'mouseout', function () {
		infoWindow10.close(map, J.getPosition());
	});
}
//构建自定义信息窗体
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "custom-info input-card content-window-card";

    //可以通过下面的方式修改自定义窗体的宽高
 //    info.style.width = "300px";
	// info.style.height = "200px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

//关闭信息窗体
function closeInfoWindow() {
    map.clearInfoWindow();
}
