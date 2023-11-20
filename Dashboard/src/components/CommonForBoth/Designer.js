import React from 'react';
import PropTypes from 'prop-types';
const Designer = ({height, width}) => {
    React.useEffect(() => {
        var scaling = "designer";
        var frame1 = new zim.Frame(scaling, width, height);
	frame1.on("ready", function() {
  	    var stage = frame1.stage;
  	    var stageW = width;
	    var stageH = height;

	    var circle = new zim.Circle(60, blue)
		.center() // both centers and does addChild
		.drag();
   	    stage.update();
	});
    });
	  
    return (
        <div id="designer" />
    );
};

Designer.propTypes = {
	  height: PropTypes.number.isRequired,
	  width: PropTypes.number.isRequired,
};

export default Designer;
