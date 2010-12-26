function npl(val, add) {
	if(val!=null) {
		return val+add;
	}
	return '';
}

function didLocate(position) {
	setActivityStatus('done');
	if(position.coords) {
		var coo = position.coords;
		setPosVal(coo.latitude, coo.longitude, npl(coo.altitude, ', ')+'±'+coo.accuracy, true);
	} else {
		setPosVal('??','??','Invalid');
	}
}

function locateDidFail(error) {
	var reason='‽';
	setActivityStatus('stop');

	switch(error.code) {
	case error.TIMEOUT:
		reason = 'TIMEOUT';
	break;
	case error.PERMISSION_DENIED:
		reason = 'DENIED';
	break;
	}
	setPosVal('--','--', reason);
}

function setActivityStatus(state) {
	document.getElementById('circles').setAttribute('class', state);
}

function setPosVal(latitude, longitude, accuracy, isValid) {
	setTextForNodeId(latitude, 'lat');
	setTextForNodeId(longitude, 'long');
	setTextForNodeId(accuracy, 'acc');
	if(isValid) {
		document.getElementById('c0').setAttribute('href','http://maps.google.com/?q='+latitude+','+longitude+'+(There)');
	} else {
		document.getElementById('c0').setAttribute('href','');
	}
}

function setTextForNodeId(text, nodeid) {
	var node = document.getElementById(nodeid);
	if(node) {
		clearNode(node);
		node.appendChild(document.createTextNode(text));
	}
}

function clearNode(node) {
	while(node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

function startLocating() {
	setActivityStatus('pre');
	setPosVal('--','--','--');
	if(navigator.geolocation) {
		setActivityStatus('pulse');
		setPosVal('…','…','…');
		navigator.geolocation.getCurrentPosition(didLocate, locateDidFail,
			{maximumAge:60000, timeout:10000});
	}
}

window.addEventListener('load', function() {
	document.getElementById('acc').addEventListener('click', startLocating, false);
	startLocating();
}, false);
