const data = {
	nodes: [
	// labelCfg: { position: "bottom", offset: 5 } 
	{
		id: "朱德",
		shape: "ellipse",
		style: {
			fill: "grey",
		},
		size: [60, 30],
		label: "朱德",
		labelCfg: {
			style: {
				fill: "white",
			},
		}
	},
	{ 
		id: "陈玉珍" ,
		label: "陈玉珍",
	},
	{
		id: "康克清",
		label: "康克清",
	},
	{ 
		id: "朱敏",
		label: "朱敏",
	},
	{
		id: "贺稚华",
		label: "贺稚华",
	},
	{
		id: "朱世林",
		label: "朱世林",
	},
	{
		id: "钟氏",
		label: "钟氏",
	}
  ],
	edges: [
	{ 
		source: "朱德", 
		target: "陈玉珍", 
		value: 100,
		label: "前妻",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱德", 
		target: "康克清", 
		value: 10,
		label: "夫妻",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱德", 
		target: "朱敏", 
		value: 10,
		label: "女儿",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱德", 
		target: "贺稚华", 
		value: 10,
		label: "前妻",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "贺稚华", 
		target: "朱敏", 
		value: 10,
		label: "女儿",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱德", 
		target: "朱世林", 
		value: 10,
		label: "父子",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱德", 
		target: "钟氏", 
		value: 10,
		label: "母子",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
	{ 
		source: "朱世林", 
		target: "钟氏", 
		value: 10,
		label: "夫妻",
		labelCfg: {
			autoRotate: true,
			style: {
				fill: 'lightgrey',
				stroke: 'white',
				lineWidth: 5,
			}
		}
	},
  ]
};

const graph = new G6.Graph({
	container: "mountNode",
	width: 600,
	height: 400,
	modes: {
		default: ["drag-canvas"]
	  },
	defaultNode: {
		size: [30, 30]
	},
	nodeStyle: {
		default: {
			fill: "#fff",
			stroke: "white",
			lineWidth: 2,
		}
	},
	edgeStyle: {
	default: {
		lineWidth: 1,
		stroke: "grey",
	}
  }
});
graph.data({
	nodes: data.nodes,
	edges: data.edges.map((edge, i) => {
		edge.id = "edge" + i;
		return Object.assign({}, edge);
	})
});
const simulation = d3
	.forceSimulation()
	.force(
		"link",
		d3
		.forceLink()
		.id(function(d) {
			return d.id;
		})
		.strength(0.001)
	)
	.force("charge", d3.forceManyBody())
	.force("center", d3.forceCenter(300, 160));
simulation.nodes(data.nodes).on("tick", ticked);

simulation.force("link").links(data.edges);
graph.render();
function ticked() {
	graph.refreshPositions();
}
function refreshPosition(e) {
	const model = e.item.get("model");
	model.fx = e.x;
	model.fy = e.y;
	//graph.refreshPositions();
}
graph.on("node:dragstart", e => {
	simulation.alphaTarget(0.3).restart();
	refreshPosition(e);
});
graph.on("node:drag", e => {
	refreshPosition(e);
});
graph.on("node:dragend", e => {
	e.item.get("model").fx = null;
	e.item.get("model").fy = null;
	simulation.alphaTarget(0);
});
