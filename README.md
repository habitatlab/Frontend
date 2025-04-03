# About

```markdown
- Description: This repository contains all React front end code, including instructions on setup and best practices.  The frontend is a GUI that can be used as a dashboard for controlling your experiment, viewing status on embedded sensors or actuators in your system, and effectively retrieving data collected during the experiment.
- Version: 0.8.0
- Release Date: 
- Creation Date: 2023-11-19
- License: BSD-3-Clause
- Author: David Schauder
- Email: schauderd@janelia.hhmi.org
- Copyright: 2023 Howard Hughes Medical Institute
```

## Overview
![ ](../docs/habitat_GUI.png)
The Habitat GUI is the main visual interface for controlling your Habitat Behavioral setup.  It runs as a web application, but can connect over ROS2 on your local network to do introspection on your Habitat nodes.  It contains a Dashboard with separate pages for controlling your experiment, viewing status on embedded sensors/actuators in your system, and data visualizers for reviewing and annotating your sensor data.  It uses a bridge technology called [ROSBridge ](https://wiki.ros.org/rosbridge_suite)! to connect to the Habitat ROS communication hub.  It also connects to the database through a Mongoose File Server to retrieve videos and data.
    
## Installation
You will need node and npm installed in order to run the webserver.  You can set up Node by following these [instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  Once Node/NPM is set up, there are 3 necessary components to set up the Frontend. 

   - Habitat FileServer - used by the GUI for database access and video file serving.  Should run on the same box as the GUI.  Runs by default on port 5001. To start the file server, navigate to the FileServer folder and run the following.
    ```
      npm install
      npm start
    ```
    - Habitat Dashboard -  Provides a dashboard for managing animal health, providing control of cameras, sensors, and embedded control nodes.  Also provides a convenient front-end for retrieving experiment data. To install the dependencies for the Frontend, navigate to the Dashboard folder and run the following.
    ```
      npm install
      npm start
    ```

    - ROSBridge - only 1 needed to bridge the ROS network and the GUI interface.  To start the ROSBridge, open a terminal window, navigate to Desktop and run the StartROSBridge.sh script

## Dashboard User Guide
