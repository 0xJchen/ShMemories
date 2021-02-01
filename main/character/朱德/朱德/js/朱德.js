//创建地图
var map = new AMap.Map('container', {
	mapStyle: "amap://styles/whitesmoke",
	center: [106.592287, 31.465946], // 添加路径起始经纬度
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
		name: 'zhu',
		path: [ // 添加经纬度
			[106.592287,31.465946], //1
			[102.708877,25.048637], //2
			[115.896389,28.686667], //6
			[113.020000,25.301817], //7
			[116.362975,25.832346], //3
			[115.415359,25.953720], //5
			[116.827208,25.225161], //4
			[118.794787,32.041737], //9
			[112.562398,37.873531], //11
			[109.468201,36.619099], //10
			[106.547260,29.562860], //12
			[117.197247,34.236949], //13
			[116.397454,39.909178], //14
			[115.978889,29.567222], //15
			[116.397454,39.909178], //16
			[113.264385,23.129112], //17
			[116.397454,39.909178], //18
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
var paths = [[106.592287,31.465946], //1
			[102.708877,25.048637], //2
			[115.896389,28.686667], //6
			[113.020000,25.301817], //7
			[116.362975,25.832346], //3
			[115.415359,25.953720], //5
			[116.827208,25.225161], //4
			[118.794787,32.041737], //9
			[112.562398,37.873531], //11
			[109.468201,36.619099], //10
			[106.547260,29.562860], //12
			[117.197247,34.236949], //13
			[116.397454,39.909178], //14
			[115.978889,29.567222], //15
			[116.397454,39.909178], //16
			[113.264385,23.129112], //17
			[116.397454,39.909178], ]//18]

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
	text: "1886.12.21", // 需要更改
	position:paths[0],
	map:map,
});
var title = '1886年12月21日', // 弹出信息栏的标题
	content = [];
content.push("<div><img src='../素材/朱德/p1.png' width='300' height='220'></img></div>"); // 信息栏中图片
content.push("<div>1886年12月21日，朱德生于四川省北部山区仪陇县乡间一户客家人贫苦农家。朱德旧居坐落在仪陇县马鞍镇西一公里的琳琅山下朱家大湾，是一座清代嘉庆末年（公元1820年）修建的四合院（现为三合院）农舍。坐北面南，占地面积3637平方米，建筑面积336平方米，是朱德的先辈来马鞍场落户的第二个住地。</div>"); // 主要事件内容填写
content.push("<div>地点：四川省南充市仪陇县马鞍镇朱德故里朱德故里琳琅山景区</div>"); // 地点填写
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
	text: "1921~1922",
	position:paths[1],
	map:map,
});	
var title = '1921~1922年',
	content = [];
content.push("<div><img src='../素材/朱德/p2.png' width='300' height='220'></img></div>");
content.push("<div>朱德旧居位于云南省昆明市五华区五华山北水晶宫红花巷4号和小梅园巷3号。1921～1922年时任云南省会警察厅厅长的朱德在此居住。</div>");
content.push("<div>地点：云南省昆明市五华区华山街道朱德旧居翠湖大梅园（朱德旧居）</div>");
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
	text: "1927",
	position:paths[2],
	map:map,
});	
var title = '1927年初',
	content = [];
content.push("<div><img src='../素材/朱德/p3.png' width='300' height='220'></img></div>");
content.push("<div>朱德军官教育团旧址位于中国江西省南昌市东湖区八一大道376号，是朱德创办的国民革命军第三军军官教育团旧址。旧址范围包括今南昌市警备区及南昌大学第二附属医院，占地数十亩，原为清末陆军小学堂所在地，后改为江西陆军“讲武堂”。前后三进共四五十间房，另有礼堂及操场。1927年初，朱德受命创办国民革命军第三军军官教育团，并自任团长之职，由陈奇涵任教育长。“八一”南昌起义时，军官教育团成员发挥了重要作用。旧址在抗日战争期间大部分被毁，中华人民共和国成立后重建恢复了部分建筑。</div>");
content.push("<div>地点：中国江西省南昌市东湖区八一大道376号</div>");
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
	text: "1928",
	position:paths[3],
	map:map,
});	
var title = '1928年1月',
	content = [];
content.push("<img src='../素材/朱德/p4.png' width='300' height='220'></img>");
content.push("<div>1928年1月，朱德同志率领南昌起义军军事决策会议。</div>");
content.push("<div>地点：广东省韶关市乐昌市老坪石共和街78号</div>");
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
	text: "1929.3",
	position:paths[4],
	map:map,
});	
var title = '1929年3月',
	content = [];
content.push("<img src='../素材/朱德/p5.png' width='300' height='220'></img>");
content.push("<div>辛耕别墅位于中国福建省龙岩市长汀县汀州镇汀江巷11号，原系民国时期长汀商会会长卢泽林的别墅，坐西朝东，砖木结构，由门楼、空坪、前后厅两边厢房组成，占地523平方米。1929年3月中国工农红军第四军进入长汀后，将司令部和政治部设于此宅，毛泽东和朱德在这里住宿、办公，并在此主持召开红四军前敌委员会扩大会议。</div>");
content.push("<div>地点：中国福建省龙岩市长汀县汀州镇汀江巷11号/div>");
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
	text: "1929.4.8",
	position:paths[5],
	map:map,
});	
var title = '1929年4月8日',
	content = [];
content.push("<img src='../素材/朱德/p6.png' width='300' height='220'></img>");
content.push("<div>1929年4月8日，毛泽东、朱德率领红四军首次进驻于都县，红四军政治部驻在管屋，毛泽东也住在这里。4月中旬，毛泽东、朱德率红四军从于都县城出发分兵前往兴国、宁都等地。</div>");
content.push("<div>地点：红四军政治部旧址暨毛泽东旧居──管屋</div>");
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
	text: "1929.12",
	position:paths[6],
	map:map,
});	
var title = '1929年12月',
	content = [];
content.push("<img src='../素材/朱德/p7.png' width='300' height='220'></img>");
content.push("<div>中兴堂位于中国福建省上杭县古田镇八甲村，建于清嘉庆十年（1805年），建筑面积1186平方米，占地面积1698平方米。1929年12月红四军进驻古田，红四军司令部设在中兴堂，朱德军长住在这里。</div>");
content.push("<div>地点：福建省龙岩市上杭县古田镇八甲村</div>");
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
	text: "1935.1",
	position:paths[6],
	map:map,
});	
var title = '1935年1月',
	content = [];
content.push("<img src='../素材/朱德/p14.png' width='300' height='220'></img>");
content.push("<div>1935年1月，出席遵义会议，会上支持毛泽东的主张。会后，同毛泽东、周恩来等指挥中央红军四渡赤水、巧渡金沙江等作战。6月，红一方面军在懋功与红四方面军会合。1936年7月，红四方面军同红二方面军会师后，继续对张国焘进行斗争，推动两军共同北上。10月，朱德、贺龙、任弼时、张国焘率红二方面军、红四方面军与红一方面军会师于甘肃会宁，长征结束。12月，任中共中央革命军事委员会委员、主席团委员。</div>");
content.push("<div>地点：遵义会议会址</div>");
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
	text: "1937.8",
	position:paths[7],
	map:map,
});	
var title = '1937年8月',
	content = [];
content.push("<img src='../素材/朱德/p8.png' width='300' height='220'></img>");
content.push("<div>1937年8月，朱德与周恩来、叶剑英出席蒋介石主持的南京国防会议。会后返回陕北出席洛川会议，担任中共中央军委副主席。</div>");
content.push("<div>地点：南京市大行宫</div>");
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
	text: "1940.8",
	position:paths[8],
	map:map,
});	
var title = '1940年8月',
	content = [];
content.push("<img src='../素材/朱德/p9.png' width='300' height='220'></img>");
content.push("<div>1940年8月，与彭德怀、左权共同部署八路军开展百团大战。同年冬，提出“南泥湾政策”。</div>");
content.push("<div>地点：山西省南部（具体地点不明）</div>");
var infoWindow9 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var K = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[9],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var K = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1944.5.21~1945.4.20",
	position:paths[9],
	map:map,
});	
var title = '1944年5月21日~1945年4月20日',
	content = [];
content.push("<img src='../素材/朱德/p10.png' width='300' height='220'></img>");
content.push("<div>中国共产党六届七中全会于1944年5月21日至1945年4月20日在延安召开。1944年5月，中共六届七中全会决定毛泽东、朱德、刘少奇、周恩来、任弼时为主席团成员，处理中央日常工作。1945年4月，出席中共七大，作军事报告《论解放区战场》。6月，当选为中央政治局委员，中央书记处书记，排名仅次于毛泽东。</div>");
content.push("<div>地点：延安杨家岭</div>");
var infoWindow10 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var L = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[10],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var L = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1945.8~1945.10",
	position:paths[10],
	map:map,
});	
var title = '1945年8月~10月',
	content = [];
content.push("<img src='../素材/朱德/p11.png' width='300' height='220'></img>");
content.push("<div>抗日战争结束后，在毛泽东赴重庆同国民党总裁蒋介石进行重庆谈判期间，朱德与刘少奇在延安继续处理中共中央日常事务，参与制定“向北发展，向南防御”的战略方针，主张及早占领东北；参与制定和调整战略部署，编组野战兵团，实现战略转变等决策。第二次国共内战爆发后，同毛泽东指挥中共军队作战。1945年8～10月重庆谈判期间，朱德在此居住桂园原为张治中的公馆。</div>");
content.push("<div>地点：重庆桂园</div>");
var infoWindow11 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var M = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[11],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var M = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1947.3",
	position:paths[11],
	map:map,
});	
var title = '1947年3月',
	content = [];
content.push("<img src='../素材/朱德/p12.png' width='300' height='220'></img>");
content.push("<div>1947年3月同刘少奇等组成中共中央工作委员会，到华北进行中央委托的工作。他亲临华北前线指导作战，取得了清风店、石家庄战役的胜利，开创了攻克坚固设防城市的先例。在战略决战阶段，他协助毛泽东组织和指挥了辽沈、淮海、平津三大战役。</div>");
content.push("<div>地点：江苏省徐州市泉山区奎山街道解放路淮海战役烈士纪念塔</div>");
var infoWindow12 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var N = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var N = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1949.9",
	position:paths[12],
	map:map,
});	
var title = '1949年9月',
	content = [];
content.push("<img src='../素材/朱德/p13.png' width='300' height='220'></img>");
content.push("<div>1949年9月，在全国政协第一届全体会议上当选为中央人民政府委员会副主席。10月1日，被任命为中国人民解放军总司令。同月，被任命为中国人民革命军事委员会副主席。 11月，兼任中共中央纪律检查委员会书记。</div>");
content.push("<div>地点：北京天安门</div>");
var infoWindow13 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var O = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var O = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1959.7",
	position:paths[12],
	map:map,
});	
var title = '1959年7月',
	content = [];
content.push("<img src='../素材/朱德/p15.png' width='300' height='220'></img>");
content.push("<div>1959年7月，出席庐山会议；期间批判彭德怀，朱德在发言时肯定彭德怀的积极一面，被毛泽东批评为“未抓到痒处”；9月，朱德被迫在军委扩大会议上做检讨，之后担任军委常委。此后，朱德到各地视察。</div>");
content.push("<div>地点：美庐别墅</div>");
var infoWindow13 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var P = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var P = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1966.5",
	position:paths[12],
	map:map,
});	
var title = '1966年5月',
	content = [];
content.push("<img src='../素材/朱德/p16.png' width='300' height='220'></img>");
content.push("<div>1966年5月4日-26日，朱德出席在北京召开的中央政治局扩大会议，在会上受到林彪、康生等的批判，把朱德不同意说毛泽东思想是马列主义顶峰的意见说成是“以马克思主义来反对毛主席”。“有野心”，“想黄袍加身”，“是党内危险的定时炸弹”等等。会后发出五一六通知，文化大革命爆发。8月，在中共八届十一中全会上再次受到批判。全会根据毛泽东的提议，改组中央领导机构，中央政治局常务委员的排名降到了第九位，林彪升到了第二位。</div>");
content.push("<div>地点：北京市东城区东华门街道天安门</div>");
var infoWindow13 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var Q = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var Q = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1969.10",
	position:paths[12],
	map:map,
});	
var title = '1969年10月',
	content = [];
content.push("<img src='../素材/朱德/p17.png' width='300' height='220'></img>");
content.push("<div>1969年10月，林彪发布《林副主席指示第一号令》，全军进入紧急战备状态，各军队将领被迫疏散离京。其中朱德去广东从化、叶剑英到长沙、刘伯承去武汉、陈毅在石家庄、聂荣臻去邯郸，徐向前在开封。10月20日，与张云逸、陈奇涵等同乘一架飞机抵达广州白云机场。广州军区主要负责人不许他们进入广州市，只在机场休息片刻就被直接送到从化。</div>");
content.push("<div>地点：广东省广州市越秀区北京街道（具体地点不明）</div>");
var infoWindow13 = new AMap.InfoWindow({
	isCustom: true,  //使用自定义窗体
	content: createInfoWindow(title, content.join("<br/>")),
	offset: new AMap.Pixel(15, -40)
});

var R = new AMap.Marker({
	icon: "../素材/pt.png",
	position:paths[12],
	map:map,
	offset:new AMap.Pixel(-27, -21),
});	
var R = new AMap.Text({zIndex: 101,
	offset:new AMap.Pixel(-3, -35),
	text: "1970~1976",
	position:paths[12],
	map:map,
});	
var title = '1970~1976年',
	content = [];
content.push("<img src='../素材/朱德/p18.png' width='300' height='220'></img>");
content.push("<div>1970年7月，从广东回到北京，筹备召开第四届全国人民代表大会。8月，出席中共九届二中全会。1971年10月22日，致函中共中央、毛泽东，表示“坚决拥护主席和中央对林彪叛党集团采取的一系列正确措施；坚决拥护中央撤销军委办事组，并责令林彪的死党黄永胜、吴法宪、李作鹏、邱会作停职反省的决定；坚决拥护成立中央军委办公会议和中央专案组。1976年7月6日15时01分，朱德因感冒、心脏衰竭、糖尿病多种病症并发，在北京逝世。</div>");
content.push("<div>地点：北京市东城区东华门街道天安门</div>");
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
