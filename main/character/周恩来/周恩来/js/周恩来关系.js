const data = {
	nodes: [
	// labelCfg: { position: "bottom", offset: 5 } 
	{
		id: "周恩来",
		shape: "ellipse",
		style: {
			fill: "grey",
		},
		size: [60, 30],
		label: "周恩来",
		labelCfg: {
			style: {
				fill: "white",
			},
		}
	},
	{ 
		id: "邓颖超" ,
		label: "邓颖超",
	},
	{
		id: "周秉建",
		label: "周秉建",
	},
	{ 
		id: "周劭纲",
		label: "周劭纲",
	},
	{
		id: "万冬儿",
		label: "万冬儿",
	},
	{
		id: "孙维世",
		label: "孙维世",
	}
  ],
	edges: [
	{ 
		source: "周恩来", 
		target: "邓颖超", 
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
		source: "周恩来", 
		target: "周秉建", 
		value: 10,
		label: "侄女",
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
		source: "周恩来", 
		target: "周劭纲", 
		value: 10,
		label: "儿子（父亲）",
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
		source: "周恩来", 
		target: "万冬儿", 
		value: 10,
		label: "儿子（母亲）",
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
		source: "周恩来", 
		target: "孙维世", 
		value: 10,
		label: "义女",
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
		source: "周劭纲", 
		target: "万冬儿", 
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
