function addEvent(dom, type, fn) {
	//对于支持DOM2级事件处理程序addeventListener方法的浏览器
	if (dom.addEventListener) {
		dom.addEventListener(type, fn, false);
	} else if (dom.attachEvent) {
		//对于不支持addEventListener方法但支持attchEvent方法的浏览器	
		dom.attachEvent('on' + type, fn);
	} else {
		//对于不支持以上两种,但支持on+'事件名'的浏览器
		dom['on' + type] = fn;
	}
}

var TimerLine = {
	data: {
		containerDiv: 'timerline', //容器盒子id
		datesDiv:'dates',//日期盒子id
		btnsDiv:'timerlineBtns',
		btns: {
			play: "timerbtn-play",
			stop: "timerbtn-stop",
			pre:"timerbtn-pre",
			next:"timerbtn-next"
		},
		processDiv:'processbar',	//进度条div
	},
	protect:{
		lock_play:false,
		lock_stop:false,
		index_label:1,
		index_process:0
	},
	rubbish_datas: [], //用来存储ajax获取到的数据
	index: 0, //变化的index
	Interval_label: null,
	Interval_process:null,
	map: new BMap.Map("allmap", {
		minZoom: 5,
		maxZoom: 20
	}),
	Utils: {
		//编写自定义函数,创建标注
		addMarker: function(point, label, status, time, picId) {
			//		var marker = new BMap.Marker(point);
			var myIcon = new BMap.Icon("images/rubbish_" + status + ".png", new BMap.Size(32, 32), {
				anchor: new BMap.Size(16, 32), //中心点设置
				infoWindowAnchor: new BMap.Size(16, 4) //消息框位置5
			});
			var marker = new BMap.Marker(point);
			TimerLine.map.addOverlay(marker);
			//跳动的动画
							// marker.setAnimation(BMAP_ANIMATION_BOUNCE);
			marker.setAnimation(BMAP_ANIMATION_DROP);
			var p = marker.getPosition();
			var content = "<div style='width:320px;'>";
			content = content + "<img src='./images/pics/"+picId+".png' width='300' height='196'></img>";
			content = content + "<table><tr><td style='border-bottom:1px solid lightgrey;'><div style='float:left;position:relative;display:inline-block;margin-bottom:5px;font-size:20px;'> " + label.content + "</div><div style='position:relative;display:inline-block;float:right;margin-top:5px;'>" + time + "</div> " + "</td></tr>";
			console.log("../images/pics/"+picId+".png")
			// content = content + "<tr><td> 坐标：" + p.lng + "," + p.lat + "</td></tr>";
			content = content + "<tr><td> " + status + "</td></tr>";
			content += "</table></div>";
			var infowindow = new BMap.InfoWindow(content);
			//添加绑定事件
			addEvent(marker, 'click', getAttr);
			function getAttr() {
				this.openInfoWindow(infowindow);
			}
		},
		/**
		 * 地图标注方法
		 * 参数:		datas:标注物数组{date:"",info:{}}
		 * 			index:序数(日期)
		 * */
		mapSetLabel: function(datas, n,isInterval) {
			TimerLine.map.clearOverlays();
			var index;
			console.log(TimerLine.protect.index_label);
			if(isInterval){
				TimerLine.protect.index_label++;
				if (TimerLine.protect.index_label >= TimerLine.rubbish_datas.length - 1) {
					TimerLine.protect.index_label = TimerLine.rubbish_datas.length - 1;
					clearInterval(TimerLine.Interval_label);
					TimerLine.protect.lock_play=false;
				}
			}
			
			if (n == null) {
				if(TimerLine.protect.index_label==0){
					TimerLine.protect.index_label=1
				}
				index = TimerLine.protect.index_label;
			} else {
				index = parseInt(n);
				TimerLine.protect.index_label = index;
			}
			
			var info = datas[index].info;
			var info_count=0;
			var addMarker_Interval=setInterval(function(){
				var p = info[info_count].point.split(',');
				var p_x = parseFloat(p[0].toString()); //纬度
				var p_y = parseFloat(p[1].toString()); //经度
				//创建label标签
				var label = new BMap.Label(info[info_count].title, {
					offset: new BMap.Size(20, -10)
				});
				//创建标注点
				var point = new BMap.Point(p_x, p_y);
				//状态(垃圾箱状态)
				var status = info[info_count].status;
				var time = info[info_count].time;
				var picId = info[info_count].picId;
				//添加标注的方法
				TimerLine.Utils.addMarker(point, label, status, time, picId);
				info_count++;
				if(info_count>=info.length){
					clearInterval(addMarker_Interval);
				}
			},0);

		},
		//添加日期点击事件绑定 dates li click
		bindEvent: function() {
			var datesDiv = document.getElementById("dates");
			addEvent(datesDiv,'click',function(e){
				var event = e || window.e;
				var target = event.target || event.srcElement;
				for(var i=0;i<TimerLine.rubbish_datas.length;i++){
					if(target.innerText==TimerLine.rubbish_datas[i].date){
//		
						TimerLine.protect.index_process=i;
						TimerLine.protect.index_label=i;
						//播放解锁
						if(TimerLine.protect.lock_play)	TimerLine.protect.lock_play=false;
						TimerLine.Utils.mapSetLabel(TimerLine.rubbish_datas, i,false);
						TimerLine.Utils.Setprocess(i,false);
						return ;
					}
				}
			})
		},
		//进度条滚动
		Setprocess:function(index,isInterval){
			if(isInterval){
				TimerLine.protect.index_process++;
				console.log(TimerLine.protect.index_process);
				console.log(TimerLine.rubbish_datas.length);
				if(TimerLine.protect.index_process >= TimerLine.rubbish_datas.length-1){
					TimerLine.protect.index_process = TimerLine.rubbish_datas.length-1;
					clearInterval(TimerLine.Interval_process);
					TimerLine.protect.lock_play=false;
				}
			}
			var datesDiv = document.getElementById("dates");
			var processDiv = document.getElementById(TimerLine.data.processDiv);
			if(index==null){
				processDiv.style.width =parseInt(processDiv.style.width)+datesDiv.getElementsByTagName('li')[0].offsetWidth+'px';
			}else{
				processDiv.style.width =datesDiv.getElementsByTagName('li')[0].offsetWidth*parseInt(index+1)+2+'px';
			}
			
		}
		
	},
	//TimerLine初始化
	init: function() {
		this.createMap();
		this.ajaxCreate();
		//事件绑定
		this.bindEvent();
	},
	createMap: function() {
		var map = this.map;
		map.centerAndZoom(new BMap.Point(110.365593, 37.528502), 5); // 初始化地图,用城市名设置地图中心点
		map.enableScrollWheelZoom(true); //启用滚轮放大缩小
	},
	ajaxCreate: function() {
		var That = this;
		var containerDiv = That.data.containerDiv;
		// $.ajax({
		// 	type: "get",
		// 	url: "js/json.json",
		// 	dataType: 'json',
		// 	success: function(data) {
		// 		containerDiv = document.getElementById(containerDiv); //容器id
		// 		That.rubbish_datas = data.result.datas; //
		// 		//console.log(That.rubbish_datas);
		// 		That.create(containerDiv, That.rubbish_datas);
		// 		//日期时间绑定
		// 		That.Utils.bindEvent();
		// 	}
		// });
		containerDiv = document.getElementById(containerDiv); //容器id
		That.rubbish_datas = data.result.datas; //
		//console.log(That.rubbish_datas);
		That.create(containerDiv, That.rubbish_datas);
		//日期时间绑定
		That.Utils.bindEvent();
	},
	create: function(containerDiv, datas) {
		var That = this;
		var datasDiv ='<div class="processcontainer"><div id="processbar" style="width:9%;"></div></div>';
//		var datasDiv = '<ul id="dates" class="timerlineul dates clearfix">';
		datasDiv += '<ul id="dates" class="timerlineul dates clearfix">';
		for (var i = 0; i < datas.length; i++) {
			datasDiv += '<li>' + datas[i].date + '</li>';
		}
		datasDiv += '</ul>';	
		// document.getElementById(That.data.btnsDiv).innerHTML='<div class="timerline-btns clearfix"><div id="timerbtn-pre" class="iconfont icon-shangyishou"></div><div id="timerbtn-play" class="iconfont icon-zanting"></div><div id="timerbtn-next" class="iconfont icon-xiayishou"></div></div>'
		//创建第一天的标注
		this.Utils.mapSetLabel(datas, 0,false);
		
//		console.log(TimerLine.index);
		That.datas = datas;
		containerDiv.innerHTML = datasDiv;
	},
	//播放 暂停 委托事件----时间绑定
	bindEvent: function() {
		if (this.data.btns == null)
			return;
		var That = this;
		addEvent(document.getElementById(That.data.btnsDiv), 'click', function(e) {
			var event = e || window.e;
			var target = event.target || event.srcElement;
			//播放事件
			if (target.id == That.data.btns.play) {
				if(!TimerLine.protect.lock_play){
					if(TimerLine.protect.index_label >= TimerLine.rubbish_datas.length-1){
						TimerLine.protect.index_label=0;
						var processDiv = document.getElementById(TimerLine.data.processDiv);
						var datesDiv = document.getElementById("dates");
						processDiv.style.width = datesDiv.getElementsByTagName('li')[0].offsetWidth+'px';
					}
					if(TimerLine.protect.index_process >= TimerLine.rubbish_datas.length-1){
						TimerLine.protect.index_process=0;
					}
//				
					TimerLine.Interval_label = setInterval("TimerLine.Utils.mapSetLabel(TimerLine.rubbish_datas,null,true)", 1000);
					TimerLine.Interval_process = setInterval("TimerLine.Utils.Setprocess(null,true)",1000);	
					$("#timerbtn-play").attr("class","iconfont icon-zanting1");
					//播放枷锁
					TimerLine.protect.lock_play=true;
					//暂停解锁
					TimerLine.protect.lock_stop=false;
				}else if(TimerLine.protect.lock_play){
					$("#timerbtn-play").attr("class","iconfont icon-zanting");
					TimerLine.Interval_label&&clearInterval(TimerLine.Interval_label);
					TimerLine.Interval_process&&clearInterval(TimerLine.Interval_process);
					//播放解锁
					TimerLine.protect.lock_play=false;
					//暂停加锁
					TimerLine.protect.lock_stop=true;
				}
			}
			
			if(target.id == That.data.btns.pre){
				if(TimerLine.protect.index_label==0) return;
				TimerLine.Utils.mapSetLabel(TimerLine.rubbish_datas, TimerLine.protect.index_label-1,false);
				TimerLine.Utils.Setprocess(TimerLine.protect.index_process-1,false);
				TimerLine.protect.index_process=TimerLine.protect.index_process-1;
			}
			if(target.id == That.data.btns.next){
				if(TimerLine.protect.index_label==TimerLine.rubbish_datas.length-1) return;
				TimerLine.Utils.mapSetLabel(TimerLine.rubbish_datas, TimerLine.protect.index_label+1,false);
				TimerLine.Utils.Setprocess(TimerLine.protect.index_process+1,false);
				TimerLine.protect.index_process=TimerLine.protect.index_process+1;
			}
		});
	}
}


var data ={
	"reason": "successed!",
	"result": {
	"datas": [
		{
			"date": "1919年",
			"info": [
				{
					"status": "五四运动，是1919年5月4日发生在北京的一场以青年学生为主，广大群众、市民、工商人士等阶层共同参与的，通过示威游行、请愿、罢工、暴力对抗政府等多种形式进行的爱国运动，是中国人民彻底的反对帝国主义、封建主义的爱国运动，又称'五四风雷'。",
					"point": "116.403613,39.914466",
					"title": "五四运动",
					"time": "1919年5月4日",
					"picId": "1"
				},
				{
					"status": "1919年6月3日，北京数以千计的学生涌向街道，开展大规模的宣传活动，被军警逮捕170多人。1919年6月5日，上海工人开始大规模罢工，以响应学生。1919年6月6日，上海各界联合会成立，反对开课、开市，并且联合其他地区，告知上海罢工主张。",
					"point": "121.477378,31.2342",
					"title": "上海三罢斗争",
					"time": "1919年6月",
					"picId": "2"
				},
			],
		},
		{
			"date": "1920年",
			"info": [
				{
					"status": "毛泽东在湖南建立社会主义青年团和共产主义小组",
					"point": "112.942461,28.235956",
					"title": "第一个共产主义小组在上海建立",
					"time": "1920年夏",
					"picId": "3"
				},
				{
					"status": "4月，俄共（布）西伯利亚局派维经斯基等一行来华，了解中国情况，考察能否在上海建立共产国际东亚书记处。他们先在北京会见了李大钊，后由李大钊介绍到上海会见陈独秀，共同商谈讨论了建党问题，促进了中国共产党的创立。",
					"point": "121.47824,31.235929",
					"title": "建党的探索和酝酿",
					"time": "1920年4月",
					"picId": "4"
				},
				{
					"status": "8月，陈独秀在上海成立了中国共产党的发起组。",
					"point": "121.137242,31.117976",
					"title": "共产党在上海",
					"time": "1920年8月",
					"picId": "5"
				},
				{
					"status": "10月，李大钊在北京建立了共产主义小组。",
					"point": "116.372449,39.910656",
					"title": "共产党在北京",
					"time": "1920年10月",
					"picId": "6"
				},
			]
		},
		{
			"date": "1921年",
			"info": [
				{
					"status": "1921年7月23日—31日，在上海召开了中国共产党的第一次全国代表大会。",
					"point": "121.481976,31.226871",
					"title": "中共一大会议秘密召开",
					"time": "1921年7月23日",
					"picId": "7"
				},
				{
					"status": "7月底，中共一大代表毛泽东、董必武、陈潭秋、王尽美、邓恩铭、李达等，由李达夫人王会悟做向导，从上海乘火车转移到嘉兴，再从狮子汇渡口登上渡船到湖心岛，最后转登王会悟预订的游船，并在游船中庄严宣告中国共产党的诞生。在船上，中共一大通过了党的第一个纲领和决议，正式宣告中国共产党庄严诞生。纲领规定：党的名称是“中国共产党”；党的性质是无产阶级政党；党的奋斗目标是推翻资产阶级，废除资本所有制，建立无产阶级专政，实现社会主义和共产主义；党的基本任务是从事工人运动的各项活动，加强对工会和工人运动的研究与领导。大会选举产生党的领导机构——中央局，陈独秀为书记，张国焘负责组织，李达负责宣传。",
					"point": "120.767398,30.760981",
					"title": "中国共产党正式成立",
					"time": "1921年7月底",
					"picId": "8"
				},
			]
		},
		{
			"date": "1922年",
			"info": [
				{
					"status": "张敬尧在湖南宣布为自治省",
					"point": "112.943036,28.234428",
					"title": "湖南宣布为自治省",
					"time": "1922年1月1日",
					"picId": "10"					
				},
				{
					"status": "上海召开大会，要求废除“二十一条”，解决山东问题，反对四国协定。国内各界亦纷纷响应，掀起筹款赎路和追究梁士诒责任的运动。",
					"point": "121.481115,31.234941",
					"title": "废除二十一条",
					"time": "1922年1月4日",
					"picId": "9"
				},
				{
					"status": "1922年1月12日。在中华海员总工会的领导下，香港海员举行了大罢工，这是中国工人阶级第一次同帝国主义进行针锋相对的斗争。由于英国雇主不能满足他们提高工资等正当要求。从当日下午5时起，所有从香港开往广州、江门、梧州、澳门等地的轮船，以及开往美、英、法、日、荷等国的海轮上的中国海员开始罢工，致使滞留香港的轮船达到90多艘。从外国开来的轮船只要一到香港，船上的中国船员便自动离船参加罢工。到2月初，罢工海员从最初的1500人增至2万多人，滞留香港的各国轮船已达166艘。2月底，为声援海员罢工，香港各行业举行总同盟罢工的工人达到了10万多人，并得到了全国人民的支持。",
					"point": "114.172902,22.280477",
					"title": "香港海员罢工",
					"time": "1922年1月12日",
					"picId": "11"					
				},
				{
					"status": "北京政府与苏俄、远东共和国两政府代表就中东铁路问题签定协定大纲规定：中东铁路归中国政府管理；俄人所有该铁路股份由中国政府于向后5年内收回之；该路未完全收回前，苏俄、远东两政府之代表有权派员参与该路路政；中东路所负各国政府及外商之债，由中国政府完全负责。",
					"point": "116.731394,39.910433",
					"title": "中国政府收回中东铁路（亦称“中国长春铁路”）",
					"time": "1922年2月28日",
					"picId": "12"					
				},
				{
					"status": "当工人行至九龙沙田时，又遭到英国军警开枪射击，打死六人，伤数百人，造成“沙田惨案”",
					"point": "114.199996,22.387842",
					"title": "沙田惨案",
					"time": "1922年3月4日",
					"picId": "13"
				},
				{
					"status": "孙中山、段祺瑞和张作霖联盟以对抗直系曹锟和吴佩孚，4月，奉军入山海关，29日第一次直奉战争爆发。吴佩孚为总司令指挥七个师、五个旅约十万人，两军在马厂、长辛店展开激战，吴佩孚出奇兵绕道攻击奉军后方，奉军腹背受敌；再加上奉军第十六师临阵倒戈，全阵崩溃。于是孙中山从北伐途中回广州，却被陈炯明困于永丰舰，最后直系获胜，张作霖败退出山海关，经外国传教士调停，双方停战。吴佩孚逼迫徐世昌下野，迎回黎元洪，1923年6月曹锟逼黎去职，于10月以贿选当上总统，为人所不耻，促成奉皖粤联合反直阵线。",
					"point": "119.769214,40.013631",
					"title": "第一次直奉大战",
					"time": "1922年4月29日",
					"picId": "14"
				},
				{
					"status": "1922年4月10日，中国劳动组合书记部发出通告，邀请全国各工会派代表到广州，参加由中国共产党领导的、中国劳动组合书记部发起的第一次全国劳动大会。大会于5月1日至6日召开，与会代表173人，代表着12个城市、110多个工会、34万有组织的工人。代表中有共产党员，也有国民党员、无政府主义者以及无党派人士。大会接受中国共产党提出的“打倒帝国主义”、“打倒封建军阀”的政治口号，通过《八小时工作制》、《罢工援助》和《全国总工会组织原则》等决议案。大会决定，在全国总工会成立以前，中国劳动组合书记部为全国工人组织的总通讯机关。",
					"point": "113.270614,23.116346",
					"title": "第一次全国劳动大会",
					"time": "1922年5月1日",
					"picId": "15"
				},
				{
					"status": "张作霖宣布中国东北自治。",
					"point": "123.464249,41.800359",
					"title": "东北自治",
					"time": "1922年5月5日",
					"picId": "16"
				},
				{
					"status": "中国社会主义青年团第一次全国代表大会1922年5月5日至10日在广州召开。出席大会的代表25人，代表15个地方团组织、5000多名团员。大会的主要任务是制定和通过团的纲领和章程，建立团的中央领导机构。",
					"point": "113.284513,23.124934",
					"title": "团一大",
					"time": "1922年5月5日",
					"picId": "17"
				},
				{
					"status": "中国共产党第二次全国代表大会于1922年7月16日至23日在上海英租界南成都路辅德里625号（现成都北路7弄30号）举行。出席大会的有党的中央局成员、地方组织的代表等共12人，他们是：陈独秀、张国焘、李达、蔡和森、邓中夏、施存统、王尽美、邓恩铭、项英、向警予、高君宇、张太雷。他们代表着全国195名党员。共产国际代表维经斯基也出席了会议。",
					"point": "121.473131,31.230334",
					"title": "中共二大",
					"time": "1922年7月16日至23日",
					"picId": "18"
				},
				{
					"status": "中国共产党第二届中央执行委员会在杭州西湖召开特别会议（即“西湖会议”），由国共两党“党外联合”方针向“党内合作”方针转变，加快了第一次国共合作的步伐。",
					"point": "120.12792,30.228932",
					"title": "西湖会议",
					"time": "1922年8月28日至30日",
					"picId": "19"
				},
				{
					"status": "国共合作创立上海大学",
					"point": "121.39903,31.32144",
					"title": "上海大学建立",
					"time": "1922年10月23日",
					"picId": "20"
				},
			]
		},
		{
			"date": "1923年",
			"info": [
				{
					"status": "《中国国民党宣言》发表，孙中山改组的国民党已进入一个新阶段。中国之所以革命，与革命之所以成功，原因虽繁，约而言之，不外历史之留遗与时代之进化而已。",
					"point": "121.474202,31.22212",
					"title": "中国国民党宣言",
					"time": "1923年1月1日",
					"picId": "21"
				},
				{
					"status": "京汉铁路工人在郑州举行京汉铁路总工会成立大会于2月1日成立。京汉铁路工人大罢工是中国共产党领导的第一次工人运动高潮的顶点，罢工最终以失败告终，但它进一步显示了中国工人阶级的力量，扩大了党在全国人民中的影响。",
					"point": "114.32452,30.630223",
					"title": "京汉铁路工人大罢工",
					"time": "1923年2月4日",
					"picId": "22"
				},
				{
					"status": "1923年2月7日在吴佩孚的命令下湖北督军萧耀南借口调解工潮，诱骗工会代表到江岸工会会所“谈判”，工会代表在去工会办事处途中，遭到反动军队的枪击，赤手空拳的工人纠察队当场被打死30多人、打伤200多人，造成了震惊中外的“二·七”惨案。",
					"point": "113.673024,34.758452",
					"title": "二七惨案",
					"time": "1923年2月7日",
					"picId": "23"
				},
				{
					"status": "中国共产党第三次全国代表大会于1923年6月12日至20日，中国共产党第三次全国代表大会在广州东山恤孤院31号（现恤孤院路3号）召开。陈独秀、李大钊、毛泽东、蔡和森、陈潭秋、恽代英、瞿秋白、张国焘、李立三、项英等来自全国各地及莫斯科的代表近40人出席大会，他们代表了全国420名党员。",
					"point": "113.30251,23.125161",
					"title": "中共三大",
					"time": "1923年6月12日至20日",
					"picId": "24"
				},
				{
					"status": "《中国青年》是1923年共青团中央出版的杂志。是中国大陆现存历史最悠久的杂志，也是共青团中央主管主办的历史最长的红色媒体。主要关注青年生存状态、服务青年成功人生是其基本宗旨，其目标读者定位为中国青年精英，即18岁至30岁的城市主流青年。",
					"point": "121.4782,31.229892",
					"title": "《中国青年》出版",
					"time": "1923年10月20日",
					"picId": "25"
				},
			]
		},
		{
			"date": "1924年",
			"info":[
				{
					"status": "北京政变，也有人称之为首都革命，1924年10月23日发生在北洋政府的首都北京，发动者为冯玉祥。1924年9月，第二次直奉战争爆发。冯玉祥被任命为“讨逆军”第三军总司令，出古北口迎战奉军。10月23日，冯玉祥率部返回北京，包围了总统府，迫使直系控制的北京政府下令停战并解除吴佩孚的职务，监禁总统曹锟，宣布成立“国民军”。政变后，冯玉祥授意摄政内阁通过了《修正清室优待条件》，废除帝号，清室迁出紫禁城，驱逐溥仪出宫。",
					"point": "116.403613,39.914023",
					"title": "北京政变",
					"time": "1924年10月23日-1925年3月",
					"picId": "26"
				},
				{
					"status": "中国国民党于1924年1月20～30日在广州召开的对党进行全面改组、实现国共合作的会议，包括三民主义的宣言。由于辛亥革命和以后历次斗争的失败，孙中山在共产国际和中国共产党的帮助下，认真总结了中国民主革命的经验教训，决定学习俄国革命的经验和方法，改组国民党，以振兴国民党进而振兴国家。",
					"point": "113.284061,23.130073",
					"title": "国民党一大",
					"time": "1924年1月20~30日",
					"picId": "27"
				},
				{
					"status": "为了建立革命武装， 1924年5月，孙中山在广州长洲岛创办了陆军军官学校（黄埔军校）。孙中山任校总理，蒋介石任校长。",
					"point": "113.431596,23.092169",
					"title": "黄埔军校开学",
					"time": "1924年6月16日",
					"picId": "28"
				}
			]
		},
		{
			"date": "1925年",
			"info": [
				{
					"status": "这次大会的中心议题是研究和讨论中国共产党如何加强对日益高涨的革命运动的领导、工人阶级如何参加民族革命运动以及党在组织上和群众工作上如何进行准备的问题。",
					"point": "121.4915,31.260904",
					"title": "中共四大",
					"time": "1925年1月11日至22日",
					"picId": "29"
				},
				{
					"status": "中国社会主义青年团第三次全国代表大会召开，决定改名为中国共产主义青年团。大会强调青年群众要从经济斗争走向政治斗争。",
					"point": "121.476516,31.235682",
					"title": "共青团诞生",
					"time": "1925年1月11日至22日",
					"picId": "30"
				},
				{
					"status": "孙中山在北京逝世。国共两党组织各界民众进行哀悼活动，广泛传播孙中山的遗嘱和革命精神，形成一次全国规模的声势浩大的革命宣传活动。",
					"point": "116.417401,39.939965",
					"title": "孙中山逝世",
					"time": "1925年3月12日",
					"picId": "31"
				},
				{
					"status": "国共两党在广州召开第二次全国劳动大会，并成立了中华全国总工会。中国工会第二次全国代表大会在广州召开，会上正式成立了中国工人阶级全国统一的工会领导机关——中华全国总工会。",
					"point": "113.284118,23.125514",
					"title": "中华全国总工会成立",
					"time": "1925年5月1日",
					"picId": "32"
				},
				{
					"status": "五卅惨案是反帝国主义爱国运动五卅运动的导火线。5月30日，上海学生两千余人在租界内散发传单，发表演说，抗议日本纱厂资本家镇压工人大罢工、打死工人顾正红，声援工人，并号召收回租界，被英国巡捕逮捕一百余人。下午万余群众聚集在英租界南京路老闸巡捕房门首，要求释放被捕学生，高呼“打倒帝国主义”等口号。英国巡捕竟开枪射击，当场打死十三人，重伤数十人，逮捕一百五十余人，造成震惊中外的五卅惨案。",
					"point": "121.479664,31.239776",
					"title": "五卅血案",
					"time": "1925年5月30日",
					"picId": "33"
				},
				{
					"status": "上海总工会成立，宣布大罢工，全市掀起反帝怒潮。",
					"point": "121.476812,31.259524",
					"title": "上海总工会成立",
					"time": "1925年6月1日",
					"picId": "34"
				},
				{
					"status": "中华民国国民政府（1925年7月1日—1948年5月20日），是中华民国训政时期的中央政府机构与最高行政机关。由海陆军大元帅大本营改组，1925年至1928年与北洋政府相互对峙。北伐成功之后为代表中国的唯一合法政府( 至1948年改组成总统府为止)。1937年起带领中国进行抗日战争，1948年5月20日蒋中正依《中华民国宪法》就任行宪后首任中华民国总统，国民政府改组为总统府，政府主席改中华民国总统，进入宪政时期。",
					"point": "113.272698,23.135513",
					"title": "中华民国国民政府建立",
					"time": "1925年7月1日",
					"picId": "35"
				},
				{
					"status": "中国国民党部分中央执行委员、中央监察委员和候补中央执行委员在中国北京西山碧云寺孙中山的灵前召开的所谓“国民党一届四中全会”，考虑国民党的去向问题和解决国民党内的共产党问题。参加这一全会的国民党政治人物，被视为国民党内部的一个政治派别“西山会议派”。",
					"point": "116.198581,40.003343",
					"title": "西山会议",
					"time": "1925年11月23日",
					"picId": "36"
				},
			]
		},
		{
			"date": "1926年",
			"info": [
				{
					"status": "1926年1月1日至20日在广州召开。256名与 会代表中共产党人100名左右。大会在中共和国民党左派共同努力下，决定继续贯彻孙中山的三大政策，坚决维护革命统一战线。通过《弹劾西山会议决议案》，制裁了国民党右派。",
					"point": "113.269704,23.134804",
					"title": "国民党二大",
					"time": "1926年1月1日至20日",
					"picId": "37"
				},
				{
					"status": "张作霖宣布东三省独立。",
					"point": "123.464546,41.800963",
					"title": "东三省独立",
					"time": "1926年1月11日",
					"picId": "38"
				},
				{
					"status": "在日本帝国主义殖民统治下的大连，由9名党员组成的中共大连特别支部成立了。",
					"point": "121.651923,38.928107",
					"title": "中共大连特别支部成立",
					"time": "1926年1月15日",
					"picId": "39"
				},
				{
					"status": "中共北方区委、共青团北方区委联名发出《为反吴战争告全国民众》书，文中历数吴佩孚甘作帝国主义的走狗，杀害共产党人和革命志士的罪行，号召国民革命将士奋勇向前，“出定中原”，“使南北革命势力联合，会师武汉促成革命的成功。”",
					"point": "117.125178,36.655635",
					"title": "国共两党讨伐吴佩孚",
					"time": "1926年2月23日",
					"picId": "40"
				},
				{
					"status": "1926年3月，日本军舰在天津大沽口炮轰驻防此地的中国国民军部队，蓄意挑起了践踏中国主权的「大沽口事件」。3月12日，日本帝国主义军舰驶入大沽口，掩护奉军进攻天津，炮轰国民军，被国民军击退。16日，日本联合美、英等8个帝国主义国家向北京政府发出最后通牒，提出撤除大沽口国防工事等无理要求。",
					"point": "117.715812,38.983184",
					"title": "大沽口事件",
					"time": "1926年3月7日",
					"picId": "41"
				},
				{
					"status": "冯玉祥的国民军与奉系军阀作战期间，日本军舰掩护奉军军舰驶进天津大沽口，炮击国民军，守军死伤十余名。国民军坚决还击，将日舰驱逐出大沽口。日本竟联合英美等八国于16日向段祺瑞政府发出最后通牒，提出撤除大沽口国防设施的无理要求。3月18日，北京群众五千余人，由李大钊主持，在天安门集会抗议，要求拒绝八国通牒。段祺瑞执政府（段祺瑞当时不在执政府，亦未命令开枪）竟下令开枪，当场打死四十七人，伤二百余人，李大钊、陈乔年均在斗争中负伤。",
					"point": "116.42149,39.939873",
					"title": "三一八惨案",
					"time": "1926年3月18日",
					"picId": "42"
				},
				{
					"status": "蒋介石在广州制造“中山舰事件”，谎称共产党人指挥的中山舰要炮轰黄埔，共产党要暴动，借以宣布戒严，派兵逮捕和监视共产党人，包围省港罢工委员会和苏联顾问办事处。",
					"point": "114.139869,30.351522",
					"title": "中山舰事件",
					"time": "1926年3月20日",
					"picId": "43"
				},
				{
					"status": "6月2日，叶挺率独立团到达湖南安仁，与败退下来的第八军军长唐生智的39团会合，共同开赴渌田、龙家湾前线，经过两昼夜冒雨苦战，先后打垮了敌人6个团，并于1926年6月5日攻克了军阀占领的湖南攸县县城，取得了北伐第一仗的辉煌胜利。",
					"point": "112.993628,28.118524",
					"title": "叶挺独立团攻克湖南攸县",
					"time": "1926年6月5日",
					"picId": "44"
				},
				{
					"status": "1926年7月4日，中国国民党中央执行委员会通过《中国国民党为国民革命军出师北伐宣言》。国民革命军在宣言表达了中国国民党“为国请命，为国除奸，成败利钝，在所不顾，任何牺牲，在所不惜”的决心，号召全国民众群起而助其革命一举成功，并坚信国民革命一定能取得胜利。国民革命军在广州举行北伐誓师典礼，誓师大会在广州东校场隆重举行，党政军负责人和各界民众5万余人参加大会。",
					"point": "113.289817,23.131926",
					"title": "北伐誓师典礼",
					"time": "1926年7月9日",
					"picId": "45"
				},
				{
					"status": "中国共产党第三代领导集体核心江泽民出生。",
					"point": "113.289817,23.131926",
					"title": "江泽民出生",
					"time": "1926年8月17日",
					"picId": "46"
				},
				{
					"status": "10月，北伐军占领武昌以后，立即把主力调往江西战场。军阀孙传芳在江西作战失利，浙江省长夏超和国民政府驻沪代表钮永建约定，脱离孙传芳，归附国民政府，并向上海进军。中共上海区委（又称中共江浙区委）决定和钮永建合作，组织联合暴动，以帮助夏超夺取上海，于10月23日夜发动武装起义。但因夏超的部队作战失败，起义准备不足，工人队伍力量薄弱,起义遭受失败。工人领袖陶静轩、奚佐尧等10余人牺牲，百余人被捕。",
					"point": "121.480395,31.223992",
					"title": "上海工人举行第一次武装起义",
					"time": "1926年10月23日",
					"picId": "47"
				}
			]
		},
		{
			"date": "1927年",
			"info": [
				{
					"status": "上海工人举行第二次武装起义失败",
					"point": "121.480395,31.223992",
					"title": "上海工人举行第二次武装起义",
					"time": "1927年2月22日",
					"picId": "47"
				},
				{
					"status": "上海工人举行第三次武装起义成功",
					"point": "119.480395,30.223992",
					"title": "上海工人举行第三次武装起义",
					"time": "1927年3月21日",
					"picId": "47"
				},
				{
					"status": "以蒋介石为首的国民党新右派在上海发动反对国民党左派和共产党的武装政变，大肆屠杀共产党员、国民党左派及革命群众。这就是历史上著名的“四一二”反革命政变。 使中国大革命受到严重的摧残，标志着大革命的部分失败，是大革命从胜利走向失败的转折点。同时也宣告国共两党第一次合作失败。经过四一二政变，国民党基层组织基本瘫痪，共产党在群众中的影响迅速扩大，经历了深刻的锻炼和严峻的考验，共产党初步积累了反正两方面的经验，为领导中国人民把斗争推向新的更高的阶段准备了条件。",
					"point": "121.885281,31.035883",
					"title": "四一二政变",
					"time": "1927年4月12日",
					"picId": "48"
				},
				{
					"status": "大会的主要任务是接受共产国际执委会第七次扩大会议关于中国问题的决议案，纠正陈独秀的机会主义错误，并决定党的重大方针政策。",
					"point": "114.305088,30.556647",
					"title": "中共五大",
					"time": "1927年4月27日",
					"picId": "49"
				},
				{
					"status": "驻守长沙的武汉国民政府辖军，国民党反动军官许克祥率叛军捣毁了「湖南总工会」、「农民协会」、「农民讲习所」等中共控制的组织革命机关、团体，解除工人纠察队和农民自卫军武装，释放所有在押的土豪劣绅。",
					"point": "114.360499,30.576637",
					"title": "马日事变",
					"time": "1927年5月21日",
					"picId": "50"
				},
				{
					"status": "在中华民国政府进行北伐（1926年至1928年）时，原先采取“联俄容共”的方针，与中国共产党合作。但在北伐期间，国民政府内部就容纳共产党与否的问题，于1927年分成南京（蒋中正等领导）及武汉（汪精卫等领导）两政府。武汉方面最初仍主张容共，其后与共产党发生摩擦，再加上冯玉祥等军事实力派人士的表态要求分共，汪精卫乃于7月15日当日，在武汉召集会议，宣布停止与中国共产党的合作。至此第一次国共合作正式结束。",
					"point": "114.293398,30.581462",
					"title": "七一五反革命政变",
					"time": "1927年7月15日",
					"picId": "51"
				},
				{
					"status": "南昌起义，是中国共产党直接领导的带有全局意义的一次武装起义。它打响了武装反抗国民党反动统治的第一枪，宣告了中国共产党把中国革命进行到底的坚定立场，标志着中国共产党独立地创造革命军队和领导革命战争的开始。是创建人民军队的开始。八一南昌起义是中国共产党独立领导武装革命战争和创建人民军队的开始的标志。",
					"point": "115.911072,28.678903",
					"title": "南昌起义",
					"time": "1927年8月1日",
					"picId": "52"
				},
				{
					"status": "毛泽东在井冈山建立农村革命根据地。（开始了土地革命）",
					"point": "114.147232,26.639322",
					"title": "建立井冈山根据地",
					"time": "1927年10月",
					"picId": "53"
				},
				{
					"status": "毛泽东在井冈山建立农村革命根据地。（开始了土地革命）",
					"point": "114.147232,26.639322",
					"title": "建立井冈山根据地",
					"time": "1927年10月",
					"picId": "53"
				}
			]
		},
		{
			"date": "1928年",
			"info": [
				{
					"status": "济南惨案(Jinan Massacre)又称五三惨案。民国十七年（1928年）， 蒋介石领导国民革命军进行北伐战争，日本军国主义担心中国一旦统一，就不能任日本肆意侵略，于是竭力阻挠北伐战争的进行。1928年5月，日本以保护侨民为名，派兵进驻济南、青岛及胶济铁路沿线，准备用武力阻止国民革命军的北伐。",
					"point": "117.022882,36.669491",
					"title": "五三惨案",
					"time": "1928年5月3日",
					"picId": "54"
				},
				{
					"status": "中国工农红军第四军，简称“红四军”，成立于中华民国时期，归属中国共产党领导，曾参加中央苏区第一、二、三、四次反“围剿”等战役。红一方面军就是在这个红四军基础上逐步形成的。",
					"point": "114.296864,26.754776",
					"title": "中国工农红军第四军成立",
					"time": "1928年5月4日",
					"picId": "55"
				},
				{
					"status": "凌晨5点30分，张作霖乘坐的专列经过京奉、南满铁路交叉处的三洞桥时，火车被日本关东军预埋炸药炸毁，张作霖被炸成重伤，送回沈阳后，于当日死去。但秘不发丧。其子张学良从前线动身，于6月18日赶回沈阳，稳定了东北局势，直到张学良21日继承父亲职务后，才正式公开发丧。案发皇姑屯站以东，史称皇姑屯事件。当时在日本国内，由于没有公布凶手，日本政府一直以“满洲某重大事件”代称。日本关东军高级参谋河本大作大佐指挥日本工兵引爆预埋的炸药，张重伤，抬回后气绝身亡。至此，统治民国16年的北洋军阀政府结束。",
					"point": "123.395767,41.822639",
					"title": "皇姑屯事件",
					"time": "1928年6月4日",
					"picId": "56"
				},
				{
					"status": "同年10月﹐南京国民政府公布《中华民国国民政府组织法》﹐规定国民政府总揽中华民国之治权﹐政府由行政院﹑立法院﹑司法院﹑考试院﹑监察院组成﹐设主席一人﹐委员十至十二人﹐国民政府主席兼任陆海空军总司令。同时﹐任命蒋介石为国民政府主席兼陆海空军总司令。",
					"point": "118.785577,32.070277",
					"title": "南京国民政府成立",
					"time": "1928年10月8日",
					"picId": "57"
				},
				{
					"status": "东北易帜是指皇姑屯事件之后，统治中国东北的奉系军阀将领张学良1928年12月29日通电全国，宣布：东北从即日起遵守三民主义，服从国民政府，改变旗帜（将北洋政府的五色旗换成国民政府的青天白日满地红旗）。此举标志着北伐的结束、国民政府完成“形式统一”、以及北洋政府的正式结束。东北易帜只是实现了当时中国在名义或形式上的统一。而且当时外蒙古仍被苏联所占据，加上原北洋政府仅于西藏设立代表处而并未实际管辖也并未派驻军队。",
					"point": "117.208211,39.129784",
					"title": "东北易帜",
					"time": "1928年12月29日",
					"picId": "58"
				},
			]
		},
		{
			"date": "1929年",
			"info": [
				{
					"status": "柏路会议后，红四军主力出击赣南，因强敌的一路猛追，连战失利，直到大柏地战斗后才转败为胜，进入东固革命根据地；当红四军主力离山后，红五军和边界军民坚持与敌浴血奋战，但未能打破敌人的会剿，当红四军到达东固时，得知红五军在边界失利，“围魏救赵”的方针没能完全实现。敌人的第三次会剿虽然没有打破，但是，红四军转赴赣南开创了中央革命根据地；红五军和边界军民与敌浴血奋战的献身精神，将永载史册，彪炳千秋！",
					"point": "114.124496,26.689094",
					"title": "柏露会议",
					"time": "1929年1月4日",
					"picId": "59"
				},
				{
					"status": "这是出井冈山以来的首次胜仗，胸中的郁闷为之一扫。陈毅称之为“红军成立以来最有荣誉的战斗。”",
					"point": "116.052963,26.105756",
					"title": "大柏地战斗",
					"time": "1929年2月10日",
					"picId": "60"
				},
			]
		}
	]}
}

TimerLine.init();