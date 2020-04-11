var sourceSprite = null;
var sourceTexture = null;
var sourceImage = null;
var renderer = null;
var stage = null;
var filterContainer = null;
var blurSwitch = [false];
var rgbSwitches = [false, false];
var gui = null;
var snFilter = null;
var blurFilter = null;

$(document).ready(function() {

	init();
});

function init() {

	initRendering();
	initImageLoader();
	initGUI();

	render();

	$(window).resize(resize);
}

function initRendering() {

	renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
		antialias : true,
		preserveDrawingBuffer : true
	});

	$('body').append(renderer.view);

	stage = new PIXI.Stage(0xF3F3F3, true);

	filterContainer = new PIXI.DisplayObjectContainer();
	stage.addChild(filterContainer);
}

function initImageLoader() {

	sourceImage = new Image();

	sourceImage.onload = function() {
		sourceTexture = new PIXI.Texture(new PIXI.BaseTexture(sourceImage));

		if (sourceSprite) {
			filterContainer.removeChild(sourceSprite);
		}
		sourceSprite = new PIXI.Sprite(sourceTexture);

		filterContainer.addChild(sourceSprite);

		resize();
		render();
	};
	sourceImage.src = "img/binary_kite.jpg";

	$("#file_input").change(function(e) {

		var URL = window.webkitURL || window.URL;
		var url = URL.createObjectURL(e.target.files[0]);

		sourceImage.src = url;
	});
}

function initGUI() {

	gui = new dat.GUI();

	var fileFolder = gui.addFolder('Load / Save image');
	fileFolder.add(this, 'loadImage').name("Load");
	fileFolder.add(this, 'saveImage').name("Save");
	fileFolder.open();

	snFilter = new PIXI.SmartNormalMapFilter();
	snFilter.bias = 50.0;

	var snFolder = gui.addFolder('SmartNormal');
	var bias = snFolder.add(snFilter, 'bias', 0, 100).name("Bias");
	bias.onChange(render);
	var invertR = snFolder.add(rgbSwitches, '0').name("Invert R");
	invertR.onChange(render);
	var invertG = snFolder.add(rgbSwitches, '1').name("Invert G");
	invertG.onChange(render);
	snFolder.open();

	blurFilter = new PIXI.BlurFilter();
	blurFilter.blur = 3;

	var blurFolder = gui.addFolder('Blur');
	var useBlur = blurFolder.add(blurSwitch, '0').name("On");
	useBlur.onChange(render);
	var blur = blurFolder.add(blurFilter, 'blur', 0, 50).name("Amount");
	blur.onChange(render);
	blurFolder.open();

	var aboutFolder = gui.addFolder('About SmartNormal');
	aboutFolder.add(this, 'blog').name("Blog");
	aboutFolder.add(this, 'oldVersion').name("SmartNormal 1.0");
}

function resize() {

	renderer.resize(sourceSprite.width, sourceSprite.height);

	var iw = sourceSprite.width;
	var ih = sourceSprite.height;
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var vtop = 0;
	var vleft = 0;

	if (ih < wh) {
		vtop = (wh - ih) / 2.0;
	}

	if (iw < ww) {
		vleft = (ww - iw) / 2.0;
	}

	renderer.view.style.top = vtop + 'px';
	renderer.view.style.left = vleft + 'px';

	renderer.view.style.position = "absolute";
	renderer.view.style.width = iw.width + "px";
	renderer.view.style.height = ih.height + "px";
}

function render() {

	snFilter.invertR = rgbSwitches[0] ? -1.0 : 1.0;
	snFilter.invertG = rgbSwitches[1] ? -1.0 : 1.0;

	var filters = [snFilter];

	if (blurSwitch[0]) {
		filters.push(blurFilter);
	}

	filterContainer.filters = filters;

	renderer.render(stage);
};

function loadImage() {

	$('#file_input').trigger('click');
}

function saveImage() {

	var data = renderer.view.toDataURL();

	var win = window.open();

	win.document.write("<img src='" + data + "'/>");
}

function blog() {

	var data = renderer.view.toDataURL();

	var win = window.open();

	win.location.href = "http://www.smart-page.net/blog/2015/03/28/smartnormal-2-0-smartnormal-goes-webgl/";
}

function oldVersion() {

	var data = renderer.view.toDataURL();

	var win = window.open();

	win.location.href = "http://www.smart-page.net/smartnormal1/";
}