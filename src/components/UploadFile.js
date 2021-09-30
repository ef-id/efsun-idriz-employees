import { useState } from 'react';

import { Container, Row, Col, Form, Table } from 'react-bootstrap';


const UploadFile = () => {

    const [isEmpty, setIsEmpty] = useState(false);

    const [employeeOne, setEmployeeOne] = useState();
    const [employeeTwo, setEmployeeTwo] = useState();
    const [pjctId, setPjctId] = useState();
    const [togetherDaysWorked, setTogetherDaysWorked] = useState();

    let today = new Date().toISOString().slice(0, 10);

    function dateConvert(dt) {
        return Date.parse(dt);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            let allText = reader.result;
            let employees = [];

            let splitTextByRow = allText.split('\r\n');
            let splitRowByElement = splitTextByRow.map(x => x.split(', '))

            let sortedArray = splitRowByElement.sort((a, b) => {
                return a[1] - b[1];
            });

            sortedArray.forEach(x => {
                employees.push({
                    employeeId: x[0],
                    projectId: x[1],
                    dateFrom: x[2],
                    dateTo: x[3].toLocaleUpperCase() === 'NULL' ? x[3] = today : x[3],
                });
            })

            let groupByProject = employees.reduce((r, a) => {
                r[a.projectId] = [...r[a.projectId] || [], a];
                return r;
            }, {});

            let commonWorkArr = [];

            for (const property in groupByProject) {

                for (let i = 0; i < groupByProject[property].length; i++) {

                    let togetherWorkingDays = 0;

                    for (let k = i + 1; k < groupByProject[property].length; k++) {

                        let firstDateFrom = dateConvert(groupByProject[property][i].dateFrom);
                        let firstDateTo = dateConvert(groupByProject[property][i].dateTo);
                        let secondDateFrom = dateConvert(groupByProject[property][k].dateFrom);
                        let secondDateTo = dateConvert(groupByProject[property][k].dateTo);


                        if (secondDateFrom > firstDateFrom && secondDateFrom < firstDateTo) {

                            if (secondDateTo < firstDateTo) {
                                togetherWorkingDays = (secondDateTo - secondDateFrom) / (1000 * 3600 * 24);
                            } else {
                                togetherWorkingDays = (firstDateTo - secondDateFrom) / (1000 * 3600 * 24);
                            }

                            commonWorkArr.push({
                                employeeIdOne: groupByProject[property][i].employeeId,
                                employeeIdTwo: groupByProject[property][k].employeeId,
                                projectId: groupByProject[property][k].projectId,
                                daysWorked: togetherWorkingDays
                            })
                        }

                    }
                }
            }

            if (commonWorkArr.length !== 0) {
                setIsEmpty(true)
            }

            for (let i = 0; i < commonWorkArr.length; i++) {

                if (commonWorkArr.length === 1) {
                    setEmployeeOne(commonWorkArr[i].employeeIdOne)
                    setEmployeeTwo(commonWorkArr[i].employeeIdTwo)
                    setPjctId(commonWorkArr[i].projectId)
                    setTogetherDaysWorked(commonWorkArr[i].daysWorked)

                    return;
                }

                for (let j = i + 1; j < commonWorkArr.length; j++) {

                    if (commonWorkArr[i].daysWorked > commonWorkArr[j].daysWorked) {
                        setEmployeeOne(commonWorkArr[i].employeeIdOne)
                        setEmployeeTwo(commonWorkArr[i].employeeIdTwo)
                        setPjctId(commonWorkArr[i].projectId)
                        setTogetherDaysWorked(commonWorkArr[i].daysWorked)
                    } else {
                        setEmployeeOne(commonWorkArr[j].employeeIdOne)
                        setEmployeeTwo(commonWorkArr[j].employeeIdTwo)
                        setPjctId(commonWorkArr[j].projectId)
                        setTogetherDaysWorked(commonWorkArr[j].daysWorked)
                    }
                }
            }
        }

        reader.readAsText(file);
    }

    return (
        <Container>
            <h1 style={{ textAlign: "center", margin: "1em 0" }}>File Reader</h1>
            <Row className="justify-content-md-center">
                <Col xs={6}>
                    <Form.Group controlId="formFileMd" className="mb-3" onChange={handleFileChange}>
                        <Form.Control type="file" size="md" />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={8}>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th>Employee ID #1</th>
                                <th>Employee ID #2</th>
                                <th>Project ID</th>
                                <th>Days Worked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isEmpty === false
                                ?
                                <tr>
                                    <td colSpan="4"> No employees </td>
                                </tr>
                                :
                                <tr>
                                    <td>{employeeOne}</td>
                                    <td>{employeeTwo}</td>
                                    <td>{pjctId}</td>
                                    <td>{togetherDaysWorked}</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default UploadFile;