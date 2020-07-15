import React, { Component } from "react";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class PrivatePage extends Component {

    render() {
        return (
            <React.Fragment>
                Private content on of {Config.websiteName}
            </React.Fragment>
        )
    }
}

export default PrivatePage;