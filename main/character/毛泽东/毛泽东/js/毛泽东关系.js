const data = {
	nodes: [
	// labelCfg: { position: "bottom", offset: 5 } 
	{
		id: "毛泽东",
		shape: "ellipse",
		style: {
			fill: "grey",
		},
		size: [60, 30],
		label: "毛泽东",
		labelCfg: {
			style: {
				fill: "white",
			},
		}
	},
	{ 
		id: "江青" ,
		label: "江青",
	},
	{
		id: "罗一秀",
		label: "罗一秀",
	},
	{ 
		id: "贺子珍",
		label: "贺子珍",
	},
	{
		id: "杨开慧",
		label: "杨开慧",
	},
	{
		id: "李讷",
		label: "李讷",
	},
	{
		id: "毛岸青",
		label: "毛岸青（次子）",
	},
	{
		id: "毛岸英",
		label: "毛岸英（长子）",
	}
  ],
	edges: [
	{ 
		source: "毛泽东", 
		target: "江青", 
		value: 100,
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
		source: "毛泽东", 
		target: "李讷", 
		value: 10,
		label: "父女",
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
		source: "江青", 
		target: "李讷", 
		value: 10,
		label: "母女",
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
		source: "毛泽东", 
		target: "罗一秀", 
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
		source: "毛泽东", 
		target: "贺子珍", 
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
		source: "毛泽东", 
		target: "杨开慧", 
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
		source: "毛泽东", 
		target: "毛岸青", 
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
		source: "杨开慧", 
		target: "毛岸青", 
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
		source: "毛泽东", 
		target: "毛岸英", 
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
		source: "杨开慧", 
		target: "毛岸英", 
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
