import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  Button,
  Card,
  Tab,
} from "@mui/material";
import { Pagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { Tabs } from "@mui/base";
import './AddManagerKPI.css'

export default function AddManagerKPI(props) {
  const [managerData, setManagerData] = useState(props.managerKPI);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [quantityTarget, setQuantityTarget] = useState("");
  const [categorySelections, setCategorySelections] = useState({});
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(null);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [page, setPage] = useState(0);
  const [processKpi, setProcessKpi] = useState([]);
  const [cField, setCField] = useState([]);
  const [editModes, setEditModes] = useState([]);
  const [subCategory, setSubCategory] = useState({ queries: [] });
  const arrayData = props.metricsApiGet;

  console.log(savedData, '49');

  const isCategorySelected = selectedCategoryIndex !== null;


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const addCategory = () => {
    setProcessKpi((prevState) => {
      return [
        ...prevState,
        {
          categoryName: `New Category ${prevState.length + 1}`,
          subcategories: [],
        },
      ];
    });
    console.log(categorySelections, "179");
  };


  const toggleCategory = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    setSelectedSubcategoryIndex(null);
  };





  const toggleSubcategory = (subcategoryName) => {
    setSelectedSubcategory(selectedSubcategory === subcategoryName ? null : subcategoryName);
  };


  const removeCategory = (index) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const handleCategoryChange = (event, value, index) => {
    let updatedCategoryArray = [...cField];
    setSelectedCategoryIndex(index);
    let category = {
      categoryName: value,
      subCategory: [],
    };
    updatedCategoryArray.push(category);
    setCField(updatedCategoryArray);
  };
  const renderCategories = () => {
    return processKpi.map((category, index) => (
      <React.Fragment key={index}>
        <div>
          <TableRow>
            <TableCell>
              <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                  freeSolo
                  id="free-solo-category"
                  disableClearable
                  options={arrayData.flatMap((item) => item.category)} // Wrap in an array
                  value={selectedCategory}
                  onChange={(event, value) =>
                    handleCategoryChange(event, value, index)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search and Add Category"
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                    />
                  )}
                />
              </Stack>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => addSubcategory(index)}
                variant="outlined"
                style={{ height: "50px", marginRight: "20px" }}
                disabled={!isCategorySelected}
              >
                Add Subcategory
              </Button>
              <Button
                onClick={() => removeCategory(index)}
                variant="outlined"
                style={{ height: "50px" }}
              >
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
        </div>

        {renderSubcategories(category.subcategories, index)}
      </React.Fragment>
    ));
  };

  const addSubcategory = (categoryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories.push({
        subCategoryName: "new subCategory",
        queries: [],
      });
      return newState;
    });
    //console.log(scField,"225");.
  };

  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories.splice(subcategoryIndex, 1);
      return newState;
    });
  };

  const handleSubcategoryChange = (
    event,
    value,
    categoryIndex,
    subcategoryIndex
  ) => {
    setSelectedSubcategoryIndex(subcategoryIndex);
    const newSubcategory = {
      subCategoryName: value,
      queries: [],
    };
    cField[categoryIndex].subCategory.push(newSubcategory);
    console.log(cField, "217");
  };

  const renderSubcategories = (subcategories, categoryIndex) => {
    return subcategories.map((subcategory, subcategoryIndex) => (
      <React.Fragment key={subcategoryIndex}>
        <TableRow>
          <TableCell colSpan={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '16px' }}>Subcategory Name</TableCell>
                  <TableCell style={{ fontSize: '16px' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack >
                      <Autocomplete
                        freeSolo
                        id="free-solo-category"
                        disableClearable
                        options={arrayData.flatMap((item) => item.subCategory)}
                        value={selectedSubcategory}
                        onChange={(event, value) =>
                          handleSubcategoryChange(event, value, categoryIndex)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search and Add sub Category"
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => addQuery(categoryIndex, subcategoryIndex)}
                      variant="outlined"
                      style={{ height: "50px", marginRight: "20px" }}
                      disabled={selectedSubcategoryIndex === null}
                    >
                      Add Query
                    </Button>
                    <Button
                      onClick={() =>
                        removeSubcategory(categoryIndex, subcategoryIndex)
                      }
                      variant="outlined"
                      style={{ height: "50px" }}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                {renderQueries(
                  subcategory.queries,
                  categoryIndex,
                  subcategoryIndex
                )}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  };
  const addQuery = (categoryIndex, subcategoryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories[subcategoryIndex].queries.push({
        metric: "newMetric",
        quantityTarget: 0,
      });
      return newState;
    });
  };

  const removeQuery = (categoryIndex, subcategoryIndex, queryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories[subcategoryIndex].queries.splice(
        queryIndex,
        1
      );
      return newState;
    });
  };
  const handleMetricChange = (
    event,
    value,
    categoryIndex,
    subcategoryIndex,
    metricIndex
  ) => {
    let newMetric = {
      metric: value,
      quantityTarget: quantityTarget,
      quantityAchieved: "",
      eIndex: 0,
      empComments: "",
      managerIndex: 0,
      managerComment: "",
      directorIndex: 0,
      directorComments: "",
      isEmployeeCommented: false,
      isManagerCommented: false,
      isDirectorCommented: false,
      totalIndexValue: 0,
    };
    setSelectedMetricIndex(metricIndex);
    cField[categoryIndex].subCategory[subcategoryIndex].queries.push(newMetric);
    setQuantityTarget("");
    console.log(cField, "80");
  };

  const handleQuantityTargetChange = (event) => {
    setQuantityTarget(event.target.value);
  };
  const renderQueries = (queries, categoryIndex, subcategoryIndex) => {
    return queries.map((query, index) => (
      <TableRow key={index}>
        <TableCell colSpan={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '16px' }}>Metrics Name</TableCell>
                <TableCell style={{ fontSize: '16px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Stack >
                    <Autocomplete
                      freeSolo
                      id="free-solo-category"
                      disableClearable
                      options={arrayData.flatMap((item) => item.metrics)}
                      value={selectedMetric}
                      onChange={(event, value) =>
                        handleMetricChange(
                          event,
                          value,
                          categoryIndex,
                          subcategoryIndex
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search and Add Metrics"
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      )}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <FormControl
                    variant="outlined"
                    sx={{ minWidth: 120, }}
                  >
                    <InputLabel id="number-select-label">
                      Quantity Target
                    </InputLabel>
                    <Select
                      labelId="number-select-label"
                      id="number-select"
                      value={quantityTarget}
                      onChange={handleQuantityTargetChange}
                      input={<OutlinedInput label="Quantity Target" />}
                    >
                      {[...Array(11).keys()].map((number) => (
                        <MenuItem key={number} value={number}>
                          {number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    onClick={() =>
                      removeQuery(categoryIndex, subcategoryIndex, index)
                    }
                    variant="outlined"
                    style={{ height: "50px", marginLeft: "20px" }}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableCell>
      </TableRow>
    ));
  };


  //API CALL TO SAVE THE DATA
  const handleSave = () => {
    console.log(cField, "148");
    let formattedData = {
      role: "manager",
      processKpi: cField,
    };
    console.log(formattedData, "145");
    fetch("http://172.17.15.253:4000/api/addMetrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to post data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data posted successfully:", data);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });

  };

  useEffect(() => {
    const handleGetData = () => {
      fetch('http://172.17.15.253:4000/api/getMetrics/manager')
        .then((response) => response.json())
        .then((response) => {
          const data = response.response.map((ele) => ele.processKpi)
          var data1 = data.map((ele) => ele)
          setSavedData(data1[0])
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
    }
    handleGetData()
  }, []);


  // useEffect(() => {
  //   var KPIData = {

  //     "role": "manager",
  //     "processKpi": [
  //       {
  //         "categoryName": "munna1",
  //         "subCategory": [
  //           {
  //             "subCategoryName": "hema1",
  //             "queries": [
  //               {
  //                 "metric": "rani1",
  //                 "quantityTarget": 9,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               },
  //               {
  //                 "metric": "asdf1",
  //                 "quantityTarget": 4,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               }
  //             ]
  //           },
  //           {
  //             "subCategoryName": "keerthana1",
  //             "queries": [
  //               {
  //                 "metric": "asdf2",
  //                 "quantityTarget": 5,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               },
  //               {
  //                 "metric": "sai1",
  //                 "quantityTarget": 6,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               }
  //             ]
  //           }

  //         ]
  //       },

  //       {
  //         "categoryName": "munna",
  //         "subCategory": [
  //           {
  //             "subCategoryName": "keerthana",
  //             "queries": [
  //               {
  //                 "metric": "asdf",
  //                 "quantityTarget": 5,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               },
  //               {
  //                 "metric": "kartik",
  //                 "quantityTarget": 8,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               }
  //             ]
  //           },
  //           {
  //             "subCategoryName": "hema",
  //             "queries": [
  //               {
  //                 "metric": "Vandana",
  //                 "quantityTarget": 8,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               },
  //               {
  //                 "metric": "sai",
  //                 "quantityTarget": 4,
  //                 "quantityAchieved": "",
  //                 "eIndex": 0,
  //                 "empComments": "",
  //                 "managerIndex": 0,
  //                 "managerComment": "",
  //                 "directorIndex": 0,
  //                 "directorComments": "",
  //                 "isEmployeeCommented": false,
  //                 "isManagerCommented": false,
  //                 "isDirectorCommented": false,
  //                 "totalIndexValue": 0
  //               }
  //             ]
  //           }

  //         ]
  //       }
  //     ]
  //   }
  //   setSavedData(KPIData.processKpi);
  // }, [])


  const handleEditClick = (index) => {
    const newEditModes = [...editModes];
    newEditModes[index] = !editModes[index];
    setEditModes(newEditModes);
    console.log(editModes, '610', savedData);
  };

  const handleDeleteMetric = async (index, categoryName, subCategoryName, metric) => {
    try {
      // Make DELETE request to remove the metric
      const response = await fetch(`http://172.17.15.253:4000/api/removeMetrics/manager/${categoryName}/${subCategoryName}/${metric}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete metric');
      }

      // Remove the metric from the state
      const updatedQueries = [...subCategory.queries];
      updatedQueries.splice(index, 1);
      setSubCategory((prevSubCategory) => ({
        ...prevSubCategory,
        queries: updatedQueries,
      }));
    } catch (error) {
      console.error('Error deleting metric:', error.message);
    }
  };


  const handleManagerMetricChange = (value, categoryIndex, subcategoryIndex, queryIndex) => {
    const updatedData = [...savedData];
    updatedData[categoryIndex].subCategory[subcategoryIndex].queries[queryIndex].metric = value;
    setSavedData(updatedData);
  };

  const handleManagerQuantityTargetChange = (value, categoryIndex, subcategoryIndex, queryIndex) => {
    const updatedData = [...savedData];
    updatedData[categoryIndex].subCategory[subcategoryIndex].queries[queryIndex].quantityTarget = value;
    setSavedData(updatedData);
  };



  return (
    <div style={{ backgroundColor: "transparent" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <b>Manager KPI</b>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px', justifyContent: 'space-between' }}>
            <Button
              onClick={addCategory}
              variant="outlined"
              style={{ height: '50px', marginRight: '10px' }}
            >
              Add Category
            </Button>
            <Button
              variant="outlined"
              style={{ backgroundColor: '#e6f6fc', height: '50px', }}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '16px' }}>Category Name</TableCell>
                  <TableCell style={{ fontSize: '16px', }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderCategories()}</TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

      </Accordion>
      <p>Please go through the below cards if you want to see or update data.</p>
      <div style={{ marginTop: '20px' }}>
        {savedData.map((category, categoryIndex) => (
          console.log(savedData, '701'),
          <div key={categoryIndex}>
            <Card onClick={() => toggleCategory(category.categoryName)} style={{ backgroundColor: categoryIndex % 2 === 0 ? '#f9f9f9' : '#daeef5', marginBottom: '10px' }}>
              <div style={{ display: 'flex', }}>
                <div>
                  <p style={{ fontSize: '16px', textAlign: 'left', marginLeft: '20px', fontFamily: 'roboto', }}>
                    <b style={{ cursor: 'pointer' }}>{category.categoryName}</b>
                  </p>
                </div>
                <div style={{ display: 'flex', }}>
                  <Button><DeleteIcon /></Button>
                </div>
              </div>
            </Card>
            {selectedCategory === category.categoryName && (
              <div>
                <Tabs value={selectedSubcategory}>
                  {category.subCategory.map((subcategories, subcategoryIndex) => (
                    <Tab

                      key={subcategoryIndex}
                      label={subcategories.subCategoryName}
                      value={subcategories.subCategoryName}
                      onClick={() => toggleSubcategory(subcategories.subCategoryName)}
                      style={{
                        color: selectedSubcategory === subcategories.subCategoryName ? '#1976d2' : 'black', // Change the color based on selection
                        fontWeight: selectedSubcategory === subcategories.subCategoryName ? 'bold' : 'normal', // Apply bold font weight to the selected tab
                      }}
                    />
                  ))}
                  <Button><DeleteIcon /></Button>
                </Tabs>
                <div style={{ display: 'flex', }}>
                  {category.subCategory.map((subCategory, subcategoryIndex) => (
                    <div key={subcategoryIndex}>
                      {selectedSubcategory === subCategory.subCategoryName && (
                        <div>
                          {subCategory.queries.map((query, queryIndex) => (
                            <Card
                              key={queryIndex}
                              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', width: '100vh' }}
                            >
                              <div>
                                <TableContainer component={Paper}>
                                  <Table style={{width:'30vw', borderCollapse:'collapse'}}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell> <b>Metric:</b></TableCell>
                                        <TableCell> <b>Quantity Target:</b></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>
                                          {editModes[queryIndex] ? (
                                            <TextField
                                              value={query.metric}
                                              onChange={(e) => handleManagerMetricChange(e.target.value, categoryIndex, subcategoryIndex, queryIndex)}
                                            />
                                          ) : (
                                            query.metric
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {editModes[queryIndex] ? (
                                            <TextField
                                              value={query.quantityTarget}
                                              onChange={(e) => handleManagerQuantityTargetChange(e.target.value, categoryIndex, subcategoryIndex, queryIndex)}
                                            />
                                          ) : (
                                            query.quantityTarget
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                             
                              <div>
                                <Button onClick={() => handleEditClick(queryIndex)}>
                                  {editModes[queryIndex] ? <SaveAsIcon /> : <EditIcon />}
                                </Button>
                                <Button onClick={() => handleDeleteMetric(queryIndex, category.categoryName, subCategory.subCategoryName, query.metric)}>
                                  <DeleteIcon />
                                </Button>

                              </div>
                            </Card>
                          ))}
                        </div>

                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}


// const itemsPerPage = 10; // Number of items to display per page
// const paginatedData = savedData.slice(
//   page * itemsPerPage,
//   (page + 1) * itemsPerPage
// );
{/* Pagination */ }
{/* <Pagination
        count={Math.ceil(savedData.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        style={{ marginTop: "20px", justifyContent: "center" }}
      /> */}