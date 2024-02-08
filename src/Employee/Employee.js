import React, { useState, useEffect } from 'react';

export default function Employee() {
    const [employeeData, setEmployeeData] = useState({
        empId: 4256,
        empName: "Sai",
        managerName: "John Vesli Chitri",
        directorName: "Venkata Ram Prasad Kandregula",
        hrName: "Divya Abburi",
        processKPI: [
            {
                categoryName: "Value Creater",
                subcategories: [
                    {
                        subCategoryName: "Trainings attended in cross skills - 2 per quarter",
                        queries: [
                            {
                                metric: "Number of training programs attended.",
                                quantityTarget: "2",
                                quantityAchieved: "3",
                                eIndex: "fdfds",
                                empComments: "sdfds",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "Number of training programs in progress",
                                quantityTarget: "0",
                                quantityAchieved: "2",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            }
                        ],
                        totalPerformanceRatio: ""
                    },
                    {
                        subCategoryName: "Get Certification - 1 per year",
                        queries: [
                            {
                                metric: "Got the certificate",
                                quantityTarget: "1",
                                quantityAchieved: "2",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "Attended for the exam",
                                quantityTarget: "0",
                                quantityAchieved: "2",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "Attended for training",
                                quantityTarget: "0",
                                quantityAchieved: "4",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            }
                        ],
                        totalPerformanceRatio: ""
                    }
                ]
            },
            {
                categoryName: "People Development",
                subcategories: [
                    {
                        subCategoryName: "Training program to develop others - 2 per quarter",
                        queries: [
                            {
                                metric: "Trainings given",
                                quantityTarget: "2",
                                quantityAchieved: "3",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "Training planned",
                                quantityTarget: "0",
                                quantityAchieved: "2",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            }
                        ],
                        totalPerformanceRatio: ""
                    },
                    {
                        subCategoryName: "Attend team meetings - 1 per week",
                        queries: [
                            {
                                metric: "No. of meetings attended",
                                quantityTarget: "12",
                                quantityAchieved: "9",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "No. of meetings not attended with reason",
                                quantityTarget: "0",
                                quantityAchieved: "2",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            },
                            {
                                metric: "No. of meetings not attended without intimation",
                                quantityTarget: "0",
                                quantityAchieved: "3",
                                eIndex: "",
                                empComments: "",
                                managerIndex: "",
                                managerComment: "",
                                directorIndex: "",
                                directorComments: "",
                                isEmployeeCommented: false,
                                isManagerCommented: false,
                                isDirectorCommented: false,
                                totalIndexValue: ""
                            }
                        ],
                        totalPerformanceRatio: ""
                    }
                ]
            }
        ],
        totalKPI: ""
    });


    const categoryNames = employeeData.processKPI.map(category => category.categoryName);

    console.log(categoryNames, '205');

    return (
        <div>
            <ul>
                {categoryNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
}




