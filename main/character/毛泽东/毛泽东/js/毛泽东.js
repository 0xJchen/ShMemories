//创建地图
var map = new AMap.Map('container', {
	mapStyle: "amap://styles/whitesmoke",
	center: [112.493723,27.913298], // 添加路径起始经纬度
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
		name: 'mao',
		path: [ // 添加经纬度
			[112.493723,27.913298],
			[112.867516,28.195498],
			[112.804320,28.429550],
			[116.405450,39.924450],
			[116.391210,39.921200],
			[121.449760,31.223440],
			[112.981960,28.199550],
			[112.989250,28.199441],
			[114.299080,30.551160],
			[114.299840,30.586610],
			[114.369310,28.518230],
			[113.931481,28.043161],
			[113.973003,26.844006],
			[114.129828,26.562037],
			[114.512990,26.322820],
			[116.362680,25.832500],
			[115.415359,25.953720],
			[115.341944,26.336944],
			[116.731667,25.225278],
			[115.643889,24.950000],
			[115.124140,27.850740],
			[115.840650,26.782210],
			[117.647210,24.513220],
			[115.402003,26.312853],
			[115.411667,25.959722],
			[106.916111,27.691389],
			[102.125690,29.642530],
			[108.177193,36.927643],
			[109.489780,36.585290],
			[106.547260,29.562860],
			[116.391939,39.921169],
			[120.134950,30.251450],
			[115.978889,29.567222],
			[116.397827,39.903740],
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
	});
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
	
	setInterval(function(){if(flag == 0){map.panTo(navg1.getPosition());}},800);	
});


// 添加经纬度
var paths = [[112.493723,27.913298],
			[112.867516,28.195498],
			[112.804320,28.429550],
			[116.405450,39.924450],
			[116.391210,39.921200],
			[121.449760,31.223440],
			[112.981960,28.199550],
			[112.989250,28.199441],
			[114.299080,30.551160],
			[114.299840,30.586610],
			[114.369310,28.518230],
			[113.931481,28.043161],
			[113.973003,26.844006],
			[114.129828,26.562037],
			[114.512990,26.322820],
			[116.362680,25.832500],
			[115.415359,25.953720],
			[115.341944,26.336944],
			[116.731667,25.225278],
			[115.643889,24.950000],
			[115.124140,27.850740],
			[115.840650,26.782210],
			[117.647210,24.513220],
			[115.402003,26.312853],
			[115.411667,25.959722],
			[106.916111,27.691389],
			[102.125690,29.642530],
			[108.177193,36.927643],
			[109.489780,36.585290],
			[106.547260,29.562860],
			[116.391939,39.921169],
			[120.134950,30.251450],
			[115.978889,29.567222],
			[116.397827,39.903740]]

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
	text: "1893", // 需要更改
	position:paths[0],
	map:map,
});
var title = '1893年', // 弹出信息栏的标题
	content = [];
content.push("<div><img src='../素材/毛泽东/p1.png' width='300' height='220'></img></div>"); // 信息栏中图片
content.push("<div>湖南省长沙府湘潭县韶山冲出生。</div>"); // 主要事件内容填写
content.push("<div>地点：湖南省长沙府湘潭县韶山冲</div>"); // 地点填写
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
	text: "1910",
	position:paths[1],
	map:map,
});	
var title = '1910年',
	content = [];
content.push("<div><img src='../素材/毛泽东/p2.png' width='300' height='220'></img></div>");
content.push("<div>毛泽东请亲戚说动父亲允许他去“洋学堂”湖南省立第一师范学校，在那里他接触到了梁启超等维新派的改良思想。</div>");
content.push("<div>地点：湖南省立第一师范学校旧址</div>");
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
	text: "1918.4",
	position:paths[2],
	map:map,
});	
var title = '1918年4月',
	content = [];
content.push("<div><img src='../素材/毛泽东/p3.png' width='300' height='220'></img></div>");
content.push("<div>新民学会是毛泽东、蔡和森等组织的一个革命团体，成立于1918年4月。五四运动期间，该会高举反帝反封建旗帜，联合长沙各界反日爱国力量进行驱逐军阀张敬尧斗争，为我国近代革命史谱写了光辉的一页。</div>");
content.push("<div>地点：新民学会旧址（长沙市区湘江西岸荣湾镇周家台子）</div>");
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
	text: "1918.8~1919.3",
	position:paths[3],
	map:map,
});	
var title = '1918年8月～1919年3月',
	content = [];
content.push("<img src='../素材/毛泽东/p4.png' width='300' height='220'></img>");
content.push("<div>毛泽东在北大图书馆工作期间曾在此居住。</div>");
content.push("<div>地点：北京大学红楼</div>");
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
	text: "1919.12",
	position:paths[4],
	map:map,
});	
var title = '1919年12月',
	content = [];
content.push("<img src='../素材/毛泽东/p5.png' width='300' height='220'></img>");
content.push("<div>毛泽东率湖南驱逐张敬尧的代表团来北京时在此居住。</div>");
content.push("<div>地点：福佑寺</div>");
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
	text: "1920.5~1920.7",
	position:paths[5],
	map:map,
});	
var title = '1920年5月～7月',
	content = [];
content.push("<img src='../素材/毛泽东/p6.png' width='300' height='220'></img>");
content.push("<div>毛泽东以“驱张”代表团成员的身份在此居住。</div>");
content.push("<div>地点：1920年毛泽东寓所旧址（上海市静安区安义路63号）</div>");
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
	text: "1921.8.16",
	position:paths[6],
	map:map,
});	
var title = '1921年8月16日',
	content = [];
content.push("<img src='../素材/毛泽东/p7.png' width='300' height='220'></img>");
content.push("<div>毛泽东在湖南《大公报》上发表了《湖南自修大学组织大纲》，同时他又起草了《湖南自修大学创立宣言》。1921年9月，毛泽东、何叔衡等人兴办的湖南自修大学开学，原船山学社的社长贺民范为校长，毛泽东任教务长。1922年11月，李达受邀担任校长，李维汉、夏明翰等人在此学习和教书。1923年11月，自修大学被湖南省长赵恒惕以“学说不正”为由查封。1938年建筑毁于文夕大火。</div>");
content.push("<div>地点：湖南自修大学旧址位于湖南省长沙市的中山东路</div>");
var infoWindow7 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var H = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[7],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var H = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1921.9~1923.4",
	position:paths[7],
	map:map,
});	
var title = '1921年8月16日',
	content = [];
content.push("<img src='../素材/毛泽东/p8.png' width='300' height='220'></img>");
content.push("<div>毛泽东、何叔衡等租用此地作为中共湘区委员会机关秘密办公地。1921年10月10日，中共湖南支部建立，毛泽东任书记，这是全国成立最早的省级支部。</div>");
content.push("<div>地点：中共湘区委员会旧址（中共湘区委员会旧址暨毛泽东、杨开慧故居）,位于湖南省长沙市八一路清水塘长沙市博物馆</div>");
var infoWindow8 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var I = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[8],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var I = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.1~1927.6",
	position:paths[8],
	map:map,
});	
var title = '1927年上半年',
	content = [];
content.push("<img src='../素材/毛泽东/p9.png' width='300' height='220'></img>");
content.push("<div>毛泽东1927年上半年与杨开慧及儿子毛岸英、毛岸青、毛岸龙住此，毛岸龙1927年4月4日在武昌出生。毛泽东在这里完成《湖南农民运动考察报告》，同时发动武昌农民运动。</div>");
content.push("<div>地点：武昌毛泽东旧居</div>");
var infoWindow9 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var J = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[9],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var J = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.8.7",
	position:paths[9],
	map:map,
});	
var title = '1927年8月7号',
	content = [];
content.push("<img src='../素材/毛泽东/p10.png' width='300' height='220'></img>");
content.push("<div>八七会议在此秘密召开。毛泽东在会上提出了“枪杆子里面出政权”的著名论断，并当选为候补委员。</div>");
content.push("<div>地点：八七会议旧址（武汉市汉口鄱阳街139号）</div>");
var infoWindow10 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var K = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[10],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var K = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.9.10",
	position:paths[10],
	map:map,
});	
var title = '1927年9月10号',
	content = [];
content.push("<img src='../素材/毛泽东/p11.png' width='300' height='220'></img>");
content.push("<div>毛泽东来到铜鼓，在此宣布成立工农革命军第一师第三团，传达了 “八七会议”精神及秋收暴动计划。</div>");
content.push("<div>地点：湘赣边界秋收起义前敌委员会旧址</div>");
var infoWindow11 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var L = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[11],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var L = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.9",
	position:paths[11],
	map:map,
});	
var title = '1927年9月',
	content = [];
content.push("<img src='../素材/毛泽东/p12.png' width='300' height='220'></img>");
content.push("<div>以毛泽东为首领导的湘赣边区秋收起义进攻中心城市失利以后，各路部队在文家市会师的地点。</div>");
content.push("<div>地点：秋收起义文家市会师旧址</div>");
var infoWindow12 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var M = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var M = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.9.29",
	position:paths[12],
	map:map,
});	
var title = '1927年9月29日',
	content = [];
content.push("<img src='../素材/毛泽东/p13.png' width='300' height='220'></img>");
content.push("<div>毛泽东率领湘赣边界秋收起义部队来到这里进行“三湾改编”。</div>");
content.push("<div>地点：三湾改编旧址</div>");
var infoWindow13 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var N = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[13],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var N = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1927.10.24",
	position:paths[13],
	map:map,
});	
var title = '1927年10月24日',
	content = [];
content.push("<img src='../素材/毛泽东/p14.png' width='300' height='220'></img>");
content.push("<div>毛泽东率领秋收起义部队上井冈山到达这里。1929年1月底，红四军主力向赣南进军后，大井村的房屋基本上被焚毁。</div>");
content.push("<div>地点：大井毛泽东旧居</div>");
var infoWindow14 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var O = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[14],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var O = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1928.1.5",
	position:paths[14],
	map:map,
});	
var title = '1928年1月5日',
	content = [];
// content.push("<img src='../素材/毛泽东/p15.png' width='300' height='220'></img>");
content.push("<div>毛泽东率军攻克遂川县城后住此，同年2月4日毛泽东回师井冈山。遂川县工农兵政府旧址往北100米，原名邱家厦所，坐西向东，是一幢仿西欧教堂式硬山顶双开大门的三层砖木结构建筑，始建于1926年，占地面积187.9平方米，建筑面积为448平方米，高10米。</div>");
content.push("<div>地点：遂川毛泽东旧居</div>");
var infoWindow15 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var P = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[15],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var P = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1929.3.14",
	position:paths[15],
	map:map,
});	
var title = '1929年3月14日',
	content = [];
content.push("<img src='../素材/毛泽东/p16.png' width='300' height='220'></img>");
content.push("<div>毛泽东、朱德率领红四军进入长汀后在此居住。</div>");
content.push("<div>地点：中国工农红军第四军司令部和政治部旧址——辛耕别墅</div>");
var infoWindow16 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var Q = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[16],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var Q = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1929.4.8",
	position:paths[16],
	map:map,
});	
var title = '1929年4月8日',
	content = [];
content.push("<img src='../素材/毛泽东/p17.png' width='300' height='220'></img>");
content.push("<div>毛泽东、朱德率领红四军首次进驻于都县，红四军政治部驻在管屋，毛泽东也住在这里。4月中旬，毛泽东、朱德率红四军从于都县城出发分兵前往兴国、宁都等地。</div>");
content.push("<div>地点：红四军政治部旧址暨毛泽东旧居──管屋</div>");
var infoWindow17 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var R = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[17],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var R = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1929.4",
	position:paths[17],
	map:map,
});	
var title = '1929年4月',
	content = [];
content.push("<img src='../素材/毛泽东/p18.png' width='300' height='220'></img>");
content.push("<div>毛泽东在此举办土地革命干部训练班，制定了《兴国土地法》。</div>");
content.push("<div>地点：潋江书院</div>");
var infoWindow18 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var S = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[18],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var S = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1929.7.20",
	position:paths[18],
	map:map,
});	
var title = '1929年7月20日',
	content = [];
content.push("<img src='../素材/毛泽东/p19.png' width='300' height='220'></img>");
content.push("<div>召开中共闽西一大时毛泽东在此居住。</div>");
content.push("<div>地点：蛟洋文昌阁</div>");
var infoWindow19 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var T = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[19],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var T = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1930.5",
	position:paths[19],
	map:map,
});	
var title = '1930年5月',
	content = [];
content.push("<img src='../素材/毛泽东/p20.png' width='300' height='220'></img>");
content.push("<div>毛泽东进行寻乌调查时在此居住。寻乌调查，毛泽东1930年5月所作的江西省寻乌县的农村经济调查报告。当时中国共产党已在江西、福建的边界建立了革命根据地，为了认清中国农村和小城市的经济状况，开展土地革命，巩固农村革命根据地，毛泽东从实际出发，运用马克思主义的阶级分析方法，作了这个调查。</div>");
content.push("<div>地点：寻乌调查旧址</div>");
var infoWindow20 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var U = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[20],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var U = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1930.10.25~1930.11",
	position:paths[20],
	map:map,
});	
var title = '1930年10月25日至11月初',
	content = [];
// content.push("<img src='../素材/毛泽东/p21.png' width='300' height='220'></img>");
content.push("<div>毛泽东率红一方面军总前委与江西省行委在罗坊召开联席会议，史称罗坊会议。会议期间，毛泽东对八位兴国籍红军战士进行了调查，于次年1月在宁都写成《八个家庭的典型调查》，又称《兴国调查》。</div>");
content.push("<div>地点：中国江西省新余市渝水区罗坊镇罗坊会议旧址</div>");
var infoWindow21 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var V = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[21],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var V = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1931.1.15",
	position:paths[21],
	map:map,
});	
var title = '1931年1月15日',
	content = [];
content.push("<img src='../素材/毛泽东/p22.png' width='300' height='220'></img>");
content.push("<div>根据中共六届三中全会的决定，在这里成立了中国共产党苏维埃区域中央局（简称中共苏区中央局）、中华苏维埃中央革命军事委员会。毛泽东在此居住并整理了著名的《兴国调查》和《寻乌调查》。</div>");
content.push("<div>地点：中共苏区中央局旧址</div>");
var infoWindow22 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var W = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[22],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var W = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1932",
	position:paths[22],
	map:map,
});	
var title = '1932年春',
	content = [];
content.push("<img src='../素材/毛泽东/p23.png' width='300' height='220'></img>");
content.push("<div>由毛泽东率领红军第一、五军团组成东路军东征闽南，4月20日攻克漳州城。芝山红楼原为美国基督教会创办的浔源中学校长楼，为西式两层红砖楼，毛泽东住楼上。</div>");
content.push("<div>地点：中国工农红军东路军领导机关旧址——芝山红楼</div>");
var infoWindow23 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var X = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[23],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var X = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1933.11",
	position:paths[23],
	map:map,
});	
var title = '1933年11月',
	content = [];
content.push("<img src='../素材/毛泽东/p24.png' width='300' height='220'></img>");
content.push("<div>毛泽东率临时中央政府检查团到此调查，并写出《长冈乡调查》一文。</div>");
content.push("<div>地点：长冈乡调查旧址</div>");
var infoWindow24 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var Y = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[24],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var Y = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1934",
	position:paths[24],
	map:map,
});	
var title = '1934年7月,1934年9月中旬',
	content = [];
content.push("<img src='../素材/毛泽东/p25.png' width='300' height='220'></img>");
content.push("<div>毛泽东和贺子珍在此居住。1934年7月，中央执行委员会迁驻云石山。</div>");
content.push("<div>地点：瑞金革命遗址——云石山中华苏维埃共和国中央政府旧址</div>");
content.push("<img src='../素材/毛泽东/p26.png' width='300' height='220'></img>");
content.push("<div>毛泽东从瑞金到雩都后即住在此处，直到10月18日开始长征。</div>");
content.push("<div>地点：中央红军长征出发地旧址——赣南省苏维埃政府旧址暨长征前夕毛泽东旧居</div>");
var infoWindow25 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var Z = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[25],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var Z = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1935.1",
	position:paths[25],
	map:map,
});	
var title = '1935年1月',
	content = [];
content.push("<img src='../素材/毛泽东/p27.png' width='300' height='220'></img>");
content.push("<div>遵义会议会址位于贵州省遵义市红花岗区老城子尹路80号。毛泽东、张闻天、王稼祥住新城古寺巷（今幸福巷19号）易宅。</div>");
content.push("<div>地点：遵义会议会址——毛泽东旧居</div>");
var infoWindow26 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AA = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[26],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AA = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1935.5.29",
	position:paths[26],
	map:map,
});	
var title = '1935年5月29日傍晚',
	content = [];
content.push("<img src='../素材/毛泽东/p28.png' width='300' height='220'></img>");
content.push("<div>红军长征抵达磨西，毛泽东住在教堂神甫楼。当晚毛泽东、朱德、周恩来、王稼祥、张闻天、陈云、邓小平、秦邦宪、林彪等召开会议，史称“磨西会议”。</div>");
content.push("<div>地点：磨西天主教堂毛泽东同志住地旧址</div>");
var infoWindow27 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AB = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[27],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AB = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1935.10.19",
	position:paths[27],
	map:map,
});	
var title = '1935年10月19日',
	content = [];
// content.push("<img src='../素材/毛泽东/p29.png' width='300' height='220'></img>");
content.push("<div>中共中央率中国工农红军陕甘支队经长征到达吴起镇，进入西北苏区。10月22日中共中央政治局在吴起镇召开会议（史称吴起镇会议），毛泽东在会上做了《关于目前行动的方针》报告，确定新形势下陕甘支队的行动方针，决定党和红军今后的战略任务是建立西北苏区，以领导全国革命。10月25日召开红军团以上干部会议。10月26日，中共中央及红军离开吴起镇，延洛河川前往甘泉下寺湾。吴起镇旧址位于砚洼山南麓，分为南北两院，南为毛泽东旧居，为一排五孔土窑洞，北为张闻天旧居，为九孔接石口土窑洞和一排四孔石窑洞，两院之间有石砌过洞相连。</div>");
content.push("<div>地点：吴旗革命旧址</div>");
var infoWindow28 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AC = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[28],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AC = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1937.1~1947.3.8",
	position:paths[28],
	map:map,
});	
var title = '1937年1月至1947年3月8日',
	content = [];
content.push("<img src='../素材/毛泽东/p30.png' width='300' height='220'></img>");
content.push("<div>中共中央在延安十年。毛泽东先后住过杨家岭、南泥湾、枣园、王家坪等地。</div>");
content.push("<div>地点：延安革命遗址</div>");
var infoWindow29 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AD = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[29],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AD = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1945.8~1945.10",
	position:paths[29],
	map:map,
});	
var title = '1945年8月至10月',
	content = [];
content.push("<img src='../素材/毛泽东/p31.png' width='300' height='220'></img>");
content.push("<div>重庆谈判期间，毛泽东白天在此办公、会客及休息。</div>");
content.push("<div>地点：桂园</div>");
var infoWindow30 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AE = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[30],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AE = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1949.8~1966.8",
	position:paths[30],
	map:map,
});	
var title = '1949年8月至1966年8月',
	content = [];
// content.push("<img src='../素材/毛泽东/p32.png' width='300' height='220'></img>");
content.push("<div>毛泽东从1949年8月至1966年8月住在中南海丰泽园菊香书屋，1966年8月搬到怀仁堂东北面的游泳池办公和生活。</div>");
content.push("<div>地点：中南海</div>");
var infoWindow31 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AF = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[31],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AF = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1953.12.28~1954.3.14",
	position:paths[31],
	map:map,
});	
var title = '1953年12月28日至1954年3月14日',
	content = [];
content.push("<img src='../素材/毛泽东/p33.png' width='300' height='220'></img>");
content.push("<div>毛泽东率领宪法起草小组成员以此为办公地，起草了中华人民共和国第一部宪法（“五四宪法”）草案初稿。《中华人民共和国宪法 (1954年)》，简称五四宪法，是中华人民共和国的第一部宪法，1954年9月20日经第一届全国人民代表大会第一次会议审议通过。因其在1954年颁布，故称其为“五四宪法”。</div>");
content.push("<div>地点：中国浙江省杭州市西湖区北山街道葛岭南麓北山街84号院内30号楼</div>");
var infoWindow32 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AG = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[32],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AG = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1959~1961",
	position:paths[32],
	map:map,
});	
var title = '1959年至1961年',
	content = [];
content.push("<img src='../素材/毛泽东/p34.png' width='300' height='220'></img>");
content.push("<div>庐山会议期间，毛泽东在此居住</div>");
content.push("<div>地点：美庐别墅</div>");
var infoWindow33 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var AH = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[33],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var AH = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1976.9.9",
	position:paths[33],
	map:map,
});	
var title = '1979年9月9日',
	content = [];
content.push("<img src='../素材/毛泽东/p35.png' width='300' height='220'></img>");
content.push("<div>毛泽东于北京逝世。</div>");
content.push("<div>地点：北京市东城区天安门广场中轴线南端，毛主席纪念堂。</div>");
var infoWindow34 = new AMap.InfoWindow({
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
	AMap.event.addListener(K, 'mouseover', function () {
		infoWindow11.open(map, K.getPosition());
	});
	AMap.event.addListener(K, 'mouseout', function () {
		infoWindow11.close(map, K.getPosition());
	});
	AMap.event.addListener(L, 'mouseover', function () {
		infoWindow12.open(map, L.getPosition());
	});
	AMap.event.addListener(L, 'mouseout', function () {
		infoWindow12.close(map, L.getPosition());
	});
	AMap.event.addListener(M, 'mouseover', function () {
		infoWindow13.open(map, M.getPosition());
	});
	AMap.event.addListener(M, 'mouseout', function () {
		infoWindow13.close(map, M.getPosition());
	});
	AMap.event.addListener(N, 'mouseover', function () {
		infoWindow14.open(map, N.getPosition());
	});
	AMap.event.addListener(N, 'mouseout', function () {
		infoWindow14.close(map, N.getPosition());
	});
	AMap.event.addListener(O, 'mouseover', function () {
		infoWindow15.open(map, O.getPosition());
	});
	AMap.event.addListener(O, 'mouseout', function () {
		infoWindow15.close(map, O.getPosition());
	});
	AMap.event.addListener(P, 'mouseover', function () {
		infoWindow16.open(map, P.getPosition());
	});
	AMap.event.addListener(P, 'mouseout', function () {
		infoWindow16.close(map, P.getPosition());
	});
	AMap.event.addListener(Q, 'mouseover', function () {
		infoWindow17.open(map, Q.getPosition());
	});
	AMap.event.addListener(Q, 'mouseout', function () {
		infoWindow17.close(map, Q.getPosition());
	});
	AMap.event.addListener(R, 'mouseover', function () {
		infoWindow18.open(map, R.getPosition());
	});
	AMap.event.addListener(R, 'mouseout', function () {
		infoWindow18.close(map, R.getPosition());
	});
	AMap.event.addListener(S, 'mouseover', function () {
		infoWindow19.open(map, S.getPosition());
	});
	AMap.event.addListener(S, 'mouseout', function () {
		infoWindow19.close(map, S.getPosition());
	});
	AMap.event.addListener(T, 'mouseover', function () {
		infoWindow20.open(map, T.getPosition());
	});
	AMap.event.addListener(T, 'mouseout', function () {
		infoWindow20.close(map, T.getPosition());
	});
	AMap.event.addListener(U, 'mouseover', function () {
		infoWindow21.open(map, U.getPosition());
	});
	AMap.event.addListener(U, 'mouseout', function () {
		infoWindow21.close(map, U.getPosition());
	});
	AMap.event.addListener(V, 'mouseover', function () {
		infoWindow22.open(map, V.getPosition());
	});
	AMap.event.addListener(V, 'mouseout', function () {
		infoWindow22.close(map, V.getPosition());
	});
	AMap.event.addListener(W, 'mouseover', function () {
		infoWindow23.open(map, W.getPosition());
	});
	AMap.event.addListener(W, 'mouseout', function () {
		infoWindow23.close(map, W.getPosition());
	});
	AMap.event.addListener(X, 'mouseover', function () {
		infoWindow24.open(map, X.getPosition());
	});
	AMap.event.addListener(X, 'mouseout', function () {
		infoWindow24.close(map, X.getPosition());
	});
	AMap.event.addListener(Y, 'mouseover', function () {
		infoWindow25.open(map, Y.getPosition());
	});
	AMap.event.addListener(Y, 'mouseout', function () {
		infoWindow25.close(map, Y.getPosition());
	});
	AMap.event.addListener(Z, 'mouseover', function () {
		infoWindow26.open(map, Z.getPosition());
	});
	AMap.event.addListener(Z, 'mouseout', function () {
		infoWindow26.close(map, Z.getPosition());
	});
	AMap.event.addListener(AA, 'mouseover', function () {
		infoWindow27.open(map, AA.getPosition());
	});
	AMap.event.addListener(AA, 'mouseout', function () {
		infoWindow27.close(map, AA.getPosition());
	});
	AMap.event.addListener(AB, 'mouseover', function () {
		infoWindow28.open(map, AB.getPosition());
	});
	AMap.event.addListener(AB, 'mouseout', function () {
		infoWindow28.close(map, AB.getPosition());
	});
	AMap.event.addListener(AC, 'mouseover', function () {
		infoWindow29.open(map, AC.getPosition());
	});
	AMap.event.addListener(AC, 'mouseout', function () {
		infoWindow29.close(map, AC.getPosition());
	});
	AMap.event.addListener(AD, 'mouseover', function () {
		infoWindow30.open(map, AD.getPosition());
	});
	AMap.event.addListener(AD, 'mouseout', function () {
		infoWindow30.close(map, AD.getPosition());
	});
	AMap.event.addListener(AE, 'mouseover', function () {
		infoWindow31.open(map, AE.getPosition());
	});
	AMap.event.addListener(AE, 'mouseout', function () {
		infoWindow31.close(map, AE.getPosition());
	});
	AMap.event.addListener(AF, 'mouseover', function () {
		infoWindow32.open(map, AF.getPosition());
	});
	AMap.event.addListener(AF, 'mouseout', function () {
		infoWindow32.close(map, AF.getPosition());
	});
	AMap.event.addListener(AG, 'mouseover', function () {
		infoWindow33.open(map, AG.getPosition());
	});
	AMap.event.addListener(AG, 'mouseout', function () {
		infoWindow33.close(map, AG.getPosition());
	});
	AMap.event.addListener(AH, 'mouseover', function () {
		infoWindow34.open(map, AH.getPosition());
	});
	AMap.event.addListener(AH, 'mouseout', function () {
		infoWindow34.close(map, AH.getPosition());
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
