//创建地图
var map = new AMap.Map('container', {
	mapStyle: "amap://styles/whitesmoke",
	center: [119.137200, 33.508200], // 添加路径起始经纬度
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
		name: 'zhou',
		path: [ // 添加经纬度
			[119.137200,33.508200], //1
			[123.852910,42.300189], //2
			[117.171253,39.129545], //3
			[117.168913,39.103605], //4
			[2.352200,48.856600], //5
			[113.271667,23.126667], //6
			[114.371529,30.534494], //9
			[106.251831,28.945570], //8
			[108.768539,36.824654], //13
			[121.470550,31.209500], //7
			[119.142290,33.507078], //12
			[113.942085,38.340157], //10
			[116.623568,39.875407], //11
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
var paths = [[119.137200,33.508200], //1
			[123.852910,42.300189], //2
			[117.171253,39.129545], //3
			[117.168913,39.103605], //4
			[2.352200,48.856600], //5
			[113.271667,23.126667], //6
			[114.371529,30.534494], //9
			[106.251831,28.945570], //8
			[108.768539,36.824654], //13
			[121.470550,31.209500], //7
			[119.142290,33.507078], //12
			[113.942085,38.340157], //10
			[116.623568,39.875407]] //11]

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
	text: "1898.3.5", // 需要更改
	position:paths[0],
	map:map,
});
var title = '1898年3月5日', // 弹出信息栏的标题
	content = [];
content.push("<div><img src='../素材/周恩来/p1.png' width='300' height='220'></img></div>"); // 信息栏中图片
content.push("<div>1898年3月5日，周恩来诞生在这里，在此居住直到1910年北上沈阳。</div>"); // 主要事件内容填写
content.push("<div>地点：江苏省淮安市淮安区淮城镇中心镇淮楼西侧，周恩来故居</div>"); // 地点填写
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
content.push("<div><img src='../素材/周恩来/p2.png' width='300' height='220'></img></div>");
content.push("<div>1910年春，周恩来随伯父周贻庚到中国东北地区，在铁岭银冈书院学习。</div>");
content.push("<div>地点：铁岭银冈书院</div>");
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
	text: "1913.8.16",
	position:paths[2],
	map:map,
});	
var title = '1913年8月16日',
	content = [];
content.push("<div><img src='../素材/周恩来/p3.png' width='300' height='220'></img></div>");
content.push("<div>1913年7月毕业，8月16日入天津南开学校。</div>");
content.push("<div>地点：天津南开（中学）学校</div>");
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
	text: "1919",
	position:paths[3],
	map:map,
});	
var title = '1919年~1920年',
	content = [];
content.push("<img src='../素材/周恩来/p4.png' width='300' height='220'></img>");
content.push("<div>1919年，周恩来注册进南开学校大学部文科学习，学号62号，其后大学部正式改名南开大学。不久五四运动爆发，周恩来积极投身其中，成为运动领导核心，于9月16日组织成立觉悟社，主编《天津学生联合会报》，并用笔名“伍豪”在报刊上发表时评文章。1920年1月29日，周恩来等四人领导天津各校学生数千人赴直隶省公署请愿，被当局拘捕。校方在直隶省教育厅压力下，开除包括周恩来在内被捕学生学籍。</div>");
content.push("<div>地点：南开大学</div>");
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
	text: "1920.11.7",
	position:paths[4],
	map:map,
});	
var title = '1920年11月7日',
	content = [];
content.push("<img src='../素材/周恩来/p5.png' width='300' height='220'></img>");
content.push("<div>1920年11月7日，周恩来赴德国柏林大学考察学习。1921年1月，他在法国巴黎的阿利昂法语学校补习法文，后又转到法国中部的布卢瓦镇继续学习法文，还在雷诺汽车厂做过工；1922年周恩来从巴黎来柏林，专门从事革命活动，告别了求学生涯。在巴黎结识也是勤工俭学的邓小平，并与赵世炎介绍他加入旅法共产主义小组，成为终生好友及革命伙伴。</div>");
content.push("<div>地点：巴黎Godefroy街</div>");
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
	text: "1923.6~1924.1",
	position:paths[5],
	map:map,
});	
var title = '1923年6月～1924年1月',
	content = [];
content.push("<img src='../素材/周恩来/p6.png' width='300' height='220'></img>");
content.push("<div>1923年6月周恩来在巴黎以个人身份加入中国国民党，11月任国民党旅欧支部执行部总务科主任（执行部部长王京岐）。1924年1月，国民党第一次全国代表大会在广州召开，孙中山推行“联俄、容共、扶助农工”的政策，主张国民党与共产党合作。</div>");
content.push("<div>地点：国立广东高等师范学校礼堂</div>");
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
	text: "1938",
	position:paths[6],
	map:map,
});	
var title = '1938年',
	content = [];
content.push("<img src='../素材/周恩来/p7.png' width='300' height='220'></img>");
content.push("<div>1938年“武汉抗战”期间，为携手共谋抗日大计，进行了国共合作，周恩来来到了当时国民政府抗战临时指挥部所在地武汉大学。当时周恩来和邓颖超下榻“十八栋”27号，此住处为标准英式田园二层别墅，红瓦青砖，地基开阔，庭前屋后被参天大树环绕，通往山下的是几条铺满落叶的石阶小径。别墅由两个哥特式风格的拱形门栋分开，楼栋之间有一精致花园。在此周恩来会见了斯诺、史沫特莱、斯特朗等国际友人和国民政府军事委员会政治部第三厅部分工作人员。周恩来住的二楼有3间房：一间会客室，一间卧室兼办公室，另一小房为警卫人员居住。</div>");
content.push("<div>地点：武汉大学</div>");
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
	text: "1939.2",
	position:paths[7],
	map:map,
});	
var title = '1939年2月',
	content = [];
content.push("<img src='../素材/周恩来/p8.png' width='300' height='220'></img>");
content.push("<div>为了便于和社会各界人士来往，1939年2月邓颖超以周恩来名义租下曾家岩大部分房屋作为南方局部分办公、住宿用房，对外称周公馆，实际上南方局的统战、外事、军事、文化等机构设在这里，是南方局进行统一战线工作的主要阵地。周恩来在这里多次主持南方局工作会议，传达中共中央指示；处理皖南事变的善后工作；接待各界知名人士、外国记者。楼房二层住着国民党政府的官员和家属。大门前一条狭窄的小街两旁开设了几家负有特殊任务的“茶馆”和“烟铺”，特务头子戴笠的“公馆”就在这条小街里。国民党除安下这些“坐探”和“内勤”之外，从曾家岩到红岩村不过10多华里的马路两旁，单是军统特务就布置了80多个。办事处工作人员的一切活动，都受到国民党特务的严密监视、跟踪、盯梢。周恩来就是在这种白色恐怖下，临危不惧、机智勇敢地同反动派进行了长达8年的斗争。</div>");
content.push("<div>地点：重庆市曾家岩50号</div>");
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
	text: "1944~1947.3",
	position:paths[8],
	map:map,
});	
var title = '1944年起',
	content = [];
content.push("<img src='../素材/周恩来/p9.png' width='300' height='220'></img>");
content.push("<div>位于延安城西北，距城15华里，又名延园。1944年到1947年3月，周恩来在此居住。 枣园共占地80多亩。中共中央领导人毛泽东、张闻天、刘少奇、周恩来、朱德、任弼时等先后搬来居住，这里成为中共中央所在地。党中央在此期间，领导了抗日战争和全党整风运动、解放区军民的大生产运动，筹备了中共七大，并领导全党和全国人民为应对国民党反动派发动的全面内战做了充分准备。1947年3月，国民党反动派侵占延安，这里的建筑物部分遭到破坏。建国后，按照原样修复。</div>");
content.push("<div>地点：延安枣园周恩来故居</div>");
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
	text: "1946。4",
	position:paths[9],
	map:map,
});	
var title = '1946年4月',
	content = [];
content.push("<img src='../素材/周恩来/p10.png' width='300' height='220'></img>");
content.push("<div>1946年4月，周恩来代表中共代表团致函国民党政府，要求“在上海拨予房屋一幢”建立办事处，但蒋介石却批示有关当局“希予婉却”。中共代表团只好通过各种关系，以6根金条的代价租下了这幢房屋，并以《新华日报》职工宿舍的名义申报了户口。但国民党当局仍不同意将此地作为中共办事处。1946年6月18日，从南京来沪的董必武果断地说：“不让设办事处，就称‘周公馆’”。周公馆因此而得名。</div>");
content.push("<div>地点：上海周恩来故居（思南路39号）</div>");
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
	text: "1946.5",
	position:paths[10],
	map:map,
});	
var title = '1946年5月',
	content = [];
content.push("<img src='../素材/周恩来/p11.png' width='300' height='220'></img>");
content.push("<div>位于南京市梅园新村17、30、35号，是三座被灰色围墙包围着的不大的院落，是中国共产党代表团办公原址--梅园新村纪念馆。1946年5月，周恩来率中共代表团于5月3日由重庆抵达南京，继续同国民党政府进行和平谈判。中共代表团住在国民党政府指派的梅园新村17号、30号两处房子，后因住房太拥挤，又买下了梅园新村35号一幢楼。其中梅园新村30号是周恩来、邓颖超工作和居住的地方，是一幢欧美风格的建筑，西式牌楼，黑色双开大门，为了防止特务的监视和破坏，中共代表团进驻后，将30号院墙加高了一倍，并在传达室上面加盖了小楼。进入灰墙红瓦的楼房，左边是会客室，会客室中间的圆桌上放着一碗雨花石，是当年周恩来、董必武、邓颖超等到雨花台凭吊革命先烈时捡回来的。会客室里面一间，是代表团几位负责同志的餐室。会客室对面是周恩来和邓颖超的办公室。周恩来每天的工作十分紧张和繁忙，夜里还要挑灯夜战，常常工作到深夜，办公室墙上有一张周恩来深夜起草文件的历史照片，就是当时的真实写照。办公室里间，是周恩来和邓颖超的卧室。30号庭院如今仍保持着原来的风貌，当年的翠柏、石榴、铁枝海棠、葡萄和蔷薇等，依旧郁郁葱葱，生机盎然。梅园新村35号进门左边的房间，是董必武同志的办公室，董老是代表团中年龄最大的一位，他酷爱读书，书橱中的大量书籍，都是董老当年阅读过的。办公室里间，是董必武同志全家5口人的卧室，面积仅8平方米，除了2张大床一只方凳外，别无他物。35号其他房间分别是廖承志、李维汉、钱瑛的办公室兼卧室。</div>");
content.push("<div>地点：南京周恩来故居</div>");
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
	text: "1948.5",
	position:paths[11],
	map:map,
});	
var title = '1948年5月',
	content = [];
content.push("<img src='../素材/周恩来/p12.png' width='300' height='220'></img>");
content.push("<div>1948年5月，毛泽东、周恩来及中央直属机关从西北战场转战至西柏坡，与中央工委汇合，直到1949年3月中共中央迁至北平以前，这里一直是中共中央所在地。党中央在此召开了政治局9月会议、政治局扩大会议和中共七届二中全会，并组织和指挥了辽沈、淮海、平津三大战役。</div>");
content.push("<div>地点：河北平山西柏坡周恩来故居</div>");
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
	text: "1949.11",
	position:paths[12],
	map:map,
});	
var title = '1949年11月',
	content = [];
content.push("<img src='../素材/周恩来/p13.png' width='300' height='220'></img>");
content.push("<div>从1949年11月搬进西花厅，直到病重住院，周总理一直在这里工作和生活，为祖国的繁荣富强和人民的幸福，呕心沥血，日夜操劳。</div>");
content.push("<div>地点：北京西花厅周恩来故居</div>");
var infoWindow13 = new AMap.InfoWindow({
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
