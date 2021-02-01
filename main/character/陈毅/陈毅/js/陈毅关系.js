const data = {
	nodes: [
	// labelCfg: { position: "bottom", offset: 5 } 
	{
		id: "陈毅",
		shape: "ellipse",
		style: {
			fill: "grey",
		},
		size: [60, 30],
		label: "陈毅",
		labelCfg: {
			style: {
				fill: "white",
			},
		}
	},
	{ 
		id: "陈昊苏" ,
		label: "陈昊苏",
	},
	{
		id: "陈丹淮",
		label: "陈丹淮",
	},
	{ 
		id: "陈小鲁",
		label: "陈小鲁",
	},
	{
		id: "张茜",
		label: "张茜",
	}
  ],
	edges: [
	{ 
		source: "陈毅", 
		target: "陈昊苏", 
		value: 100,
		label: "长子",
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
		source: "陈毅", 
		target: "陈丹淮", 
		value: 10,
		label: "次子",
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
		source: "陈毅", 
		target: "陈小鲁", 
		value: 10,
		label: "末子",
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
		source: "陈毅", 
		target: "张茜", 
		value: 10,
		label: "妻子",
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
		source: "张茜", 
		target: "陈昊苏", 
		value: 10,
		label: "长子",
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
		source: "张茜", 
		target: "陈丹淮", 
		value: 10,
		label: "次子",
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
		source: "张茜", 
		target: "陈小鲁", 
		value: 10,
		label: "末子",
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
