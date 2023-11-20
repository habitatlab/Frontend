import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {CSVLink, CSVDownload} from 'react-csv';
import { connect,useDispatch } from 'react-redux';
import {
	Card,
	CardBody,
	Button,
	Col,
	Container,
	Input,
	Row,
} from "reactstrap"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin  from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import { getLogs, addLogs, updateLog, deleteLog } from "../../store/dailylogs/actions"
import { getAnimals, addAnimal, updateAnimal, deleteAnimal } from "../../store/animal/actions"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor'
import paginationFactory from 'react-bootstrap-table2-paginator';

import "@fullcalendar/bootstrap/main.css"
const AnimalHealth = props => {
	const {
	        onFetchDailyLogs,
		onAddNewLogs,
		onUpdateLog,
		onDeleteLog,
		onAddAnimal,
		onUpdateAnimal,
		onFetchAnimals,
		onDeleteAnimal,
	        dailyLogs,
		lanimals
	    } = props
	useEffect(() => {
	    onFetchDailyLogs()
	    onFetchAnimals()
	    setDateFilter(new Date());
	}, []);

	     const [filter, setFilter] = useState()
	     const [dateFilter, setDateFilter] = useState()
	     const [logs, setLogs] = useState(dailyLogs)
	     const [selectedState, setSelectedState] = useState([])
	     const [cage,setCage] = useState()
	     const [animalNumber,setAnimalNumber] = useState() 

	function checkActive(log) {
	    var animal_name = log.animal;
	    for (var key in lanimals) {
		var animalinfo = lanimals[key]
		if (animalinfo.name==animal_name && animalinfo.active=='Yes') 
		    return true;
            }
            return false;
	}

	useEffect(() => {
	   if (dateFilter) {
	       const newColumns = [];
	       columns.map((column) => {
                  if (column.dataField !== 'date') newColumns.push( column);
               });
	       setColumns(newColumns);
               var filteredLogs = []
	       for (var row in dailyLogs) {
		    var log = { ...dailyLogs[row] }
		    var date = new Date(log.date)
		    if (date.getMonth() == dateFilter.getMonth() && date.getDate() == dateFilter.getDate()) {
			if (checkActive(log))
			    filteredLogs.push(log);
		    }
	       }
	       setLogs(filteredLogs)
	   } else {
	   if (filter) {
	       var filteredLogs = []
	       for (var row in dailyLogs) {
		   var log = { ...dailyLogs[row] }
		   if (log.animal == filter) {
		       //if (checkActive(log))
			 setCage(log.cage)
			 setAnimalNumber(log.animal_number)
		         filteredLogs.push(log);
		   }
	       }
               const newColumns = [];
               columns.map((column) => {
                  if (column.dataField !== 'animal' && column.dataField !=='cage' && column.dataField !== 'animal_number') 
		       newColumns.push( column);
               });
               setColumns(newColumns);

	       setLogs(filteredLogs)
	   } else {
               var filteredLogs = []
	       for (var row in dailyLogs) {
		    var log = { ...dailyLogs[row] }
		    if (checkActive(log))
		        filteredLogs.push(log);
		     }
	       }
	       setLogs(filteredLogs)
	   }
	   animals = lanimals
       }, [dailyLogs, lanimals, dateFilter]);


	        var animals = lanimals;
       function deleteFormatter(cell, row, rowIndex, formatExtraData) { 
	   return (
               <Button
		    color="secondary"
		    onClick={() => deleteLog(row)}
	          ><i class="bx bx-trash d-block font-size-16"></i></Button>

           ); 
       } 

       function deleteAnimalFormatter(cell, row, rowIndex, formatExtraData) {
	   return (
		<Button
		     color="secondary"
		     onClick={() => deleteAnimal(row)}
		><i class="bx bx-trash d-block font-size-16"></i></Button>

	   );
       }

	const columns =  [
		{
			dataField: "researcher_provided_food",
			text: "Researcher Will Provide Food",
			editor: {
				type: Type.CHECKBOX,
				value: 'Yes:No'
			},
			// eslint-disable-next-line react/display-name
			//formatter: (cell, row, rowIndex) => {
			//	console.log(cell)
				//	var foo = {dailyLogs[rowIndex].researcher_provided_food?'checked':''}
			//	return (
			//		<center><Input type="checkbox" checked={cell} onChange={() => {}}></Input></center>
			//	)
			//}
		},
                {
                        dataField: "animal",
                        text: "Nickname",
                },

		{
			dataField: "animal_number",
			text: "ANM #",
		},
		{
			dataField: "cage",
			text: "Cage",
		},
		{
			dataField: "weight",
			text: "Weight (g)",
		},{
			dataField: "date",
			text: "Date",
			sort: true,
			formatter: (cell) => {
				let dateObj = cell
				if (typeof cell !== 'object') {
					dateObj = new Date(cell)
				}
				return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`
			},
			editor: {
				type: Type.DATE
			}
		},{
			dataField: "weight_food_given",
			text: "Food Given (g)",
		},{
			dataField: "time_food_given",
			text: "Time Food Provided",
		},{
			dataField: "initials",
			text: "Initials",
		},{
			dataField: "comments",
			text: "Comments",
			editor: {
				type: Type.TEXTAREA
			}
		},
	]

        const [dcolumns, setColumns] = useState(columns)

        useEffect(() => {
        }, [dcolumns]);
	

	const animal_columns = [
		{
			dataField: "animal_id",
			hidden:true,
		},
		{
			dataField: "name",
			text: "Nickname",
		},
		 {
                        dataField: "rci_number",
                        text: "RCI #",
                },
		{
			dataField: "cage_number",
			text: "Cage #",
		},
                {
                        dataField: "room",
                        text: "Room",
                },
		{
			dataField: "sex",
			text: "Sex",
		},
		{
			dataField: "birth_date",
			text: "Date Of Birth",
			formatter: (cell) => {
				let dateObj = cell
				if (typeof cell !== 'object') {
					dateObj = new Date(cell)
				}
				return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`
			},
			editor: {
				type: Type.DATE
			}
		},
		{
			dataField: "start_date",
			text: "Date Started",
			formatter: (cell) => {
				let dateObj = cell
				if (typeof cell !== 'object') {
					dateObj = new Date(cell)
				}
				return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`
			},
			editor: {
				type: Type.DATE
			}
		},
		{
			dataField: "weight",
			text: "Starting Weight",
		},

		                {
					                        dataField: "active",
					                        text: "Active on RCI",
					                        editor: {
									                             type: Type.CHECKBOX,
									                             value: 'Yes:No'
									                        },

					                },
	]



	const selectRow = {
		mode: 'radio',
		selected: selectedState,
		onSelect: (row, isSelect) => {
			if (isSelect) {
				setFilter(row.name)
				setSelectedState([row.animal_id])
				setDateFilter(undefined)
			} else {
				setFilter()
				setSelectedState([])
				setDateFilter(undefined)
			}
			onFetchDailyLogs()
		}
	}

	const saveChanges = (oldValue, newValue, row, column) => {
	    row[column.dataField] = newValue
             onUpdateLog(row)
	}

	const saveAnimal = (oldValue, newValue, row, column) => {
	    row[column.dataField] = newValue
            onUpdateAnimal(row)
	}

	const deleteLog = (log) => {
	     console.log(log)
	     onDeleteLog(log._id)
	     const filteredLogs = logs.filter(checklog => checklog._id!=log._id)
	     setLogs(filteredLogs)
	}

	const deleteAnimal = (animal) => {
             onDeleteAnimal(animal.name)
	     const filteredAnimals = animals.filter(checkanimal => checkanimal.name!=animal.name)
	     animals = filteredAnimals
	}


	function handleDateClick(info) {
	    var baseLogs = dailyLogs
	    var dateLogsExist = false
	    for (var i=0; i<baseLogs.length; i++) {
		var baseLogDate = new Date(baseLogs[i].date)
		if (baseLogDate.getMonth() == info.date.getMonth() &&
		    baseLogDate.getDate() == info.date.getDate() &&
		    baseLogDate.getFullYear() == info.date.getFullYear()) {
		    dateLogsExist = true
		    break;
		}
	    }
	    if (!dateLogsExist) {	
		var newLogs = []
		for (var i=0; i<animals.length; i++) {
		    var newLog = { animal_number: animals[i].rci_number, cage: "burrow", animal: animals[i].name, weight: "", date: info.date, weight_food_given: "", researcher_provided_food: "No", initials: "", time_food_given: "", comments: "" }
		    if (checkActive(newLog)) {
			newLogs.push(newLog)
		    }
		}
		onAddNewLogs(newLogs)
	    }
            setSelectedState([]) 
            setFilter(undefined)
            setDateFilter(info.date)

	}

	function addNewAnimal() {
	    var animal_id = Math.floor(1000000 + Math.random() * 9000000);
            var newAnimal = []
	    newAnimal.push ({ animal_id: animal_id.toString(), name: "NewAnimal", active: "Y", sex: "", room: "", rci_number: "", cage_number: "", birth_date: new Date(), start_date: new Date(), weight: ""})
            onAddAnimal(newAnimal)
	}

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid={true}>
					<Row>
						<Col lg="12">
							<Card>
								<CardBody>
		{dateFilter && <p><h4 className="card-title mb-4">RCI Daily Logs</h4> <CSVLink data={logs} filename={"daily_logs.csv"} >Export Daily Logs</CSVLink></p>}
		   {!dateFilter && filter && <h4 className="card-title mb-4">Animal Dashboard</h4> }
`
		{dateFilter && <h5>
          Date: <b>{dateFilter.toLocaleDateString("en-US")}</b>
        </h5>
      }

        {!dateFilter && filter && <h5>
          Animal Name: <b>{filter}</b>, Cage: <b>{cage}</b>, AMN#: <b>{animalNumber}</b>
        </h5>
      }

									<BootstrapTable
										keyField="id"
                                                                                pagination={ paginationFactory() } 
										data={logs}
										columns={dcolumns}
		                                                                sort={ { dataField: 'date', order: 'desc' } }
										cellEdit={cellEditFactory({ mode: "click", blurToSave: "true", 
											beforeSaveCell: (oldValue, newValue, row, column) => { saveChanges(oldValue, newValue, row, column) }})}
		        
									/>
								</CardBody>
							</Card>
						</Col>
					</Row>

					<Row>
						<Col md={8}>
		 <h4 className="card-title mb-4">Animal Summary</h4> 
                                                    <BootstrapTable
		                                               keyField="animal_id"
		                                               data={animals}
		                                               columns={animal_columns}
 cellEdit={cellEditFactory({ mode: "click", blurToSave: "true",
	                                                                                         afterSaveCell: (oldValue, newValue, row, column) => { saveAnimal(oldValue, newValue, row, column) }})}
		                                                                selectRow={selectRow}
		                                                        /> 
							<Button type="text" color="success"  onClick={() => addNewAnimal()}>
								Add Animal
							</Button>
						</Col>
						<Col md={4}>
		                                        <b>Clicking date adds new daily logs</b><br/>
							<FullCalendar
								plugins={[
									BootstrapTheme,
									dayGridPlugin,
									interactionPlugin,
								]}
								slotDuration={"00:15:00"}
								handleWindowResize={true}
								themeSystem="bootstrap"
								header={{
									left: "prev,next today",
									center: "title",
									right: "dayGridMonth,dayGridWeek,dayGridDay",
								}}
								editable={true}
								selectable={true}
								dateClick={handleDateClick}
							/>
						</Col>
					</Row>

				</Container>
			</div>
		</React.Fragment>
	)
}

const mapStateToProps = ({ animals, logs }) => ({
	  dailyLogs: logs.dailyLogs,
	  lanimals: animals.animals
})

const mapDispatchToProps = dispatch => ({
    onFetchDailyLogs: () => dispatch(getLogs()),
    onAddNewLogs: (logs) => dispatch(addLogs(logs)),
    onUpdateLog: (log) => dispatch(updateLog(log)),
    onDeleteLog: (id) => dispatch(deleteLog(id)),
    onFetchAnimals: () => dispatch(getAnimals()),
    onAddAnimal: (animal) => dispatch(addAnimal(animal)),
    onUpdateAnimal: (animal) => dispatch(updateAnimal(animal)),
    onDeleteAnimal: (name) => dispatch(deleteAnimal(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnimalHealth)

